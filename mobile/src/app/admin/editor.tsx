// The article editor. Write and format on the phone, then publish to the website and the app.
//
// - Everything is autosaved on the phone a moment after you stop typing, so nothing is lost if the
//   app closes. Saving a draft or publishing sends it to the website (a Git commit, live in ~1 min).
// - Images are compressed and uploaded as soon as they're picked. The editor shows the local copy
//   (the uploaded file appears on the site after its next deploy) and the saved article points at
//   the uploaded file.
import Ionicons from '@expo/vector-icons/Ionicons';
import { RichText, useBridgeState, useEditorBridge, useKeyboard } from '@10play/tentap-editor';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, KeyboardAvoidingView, Modal, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleWebView } from '@/components/ArticleWebView';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ImagesPanel } from '@/components/editor/ImagesPanel';
import { editorKit } from '@/components/editor/kit';
import { PublishSheet, type PublishMode } from '@/components/editor/PublishSheet';
import { PromptModal } from '@/components/PromptModal';
import { Button, CenteredState, IconButton, Loading, Text } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import { articleDocument } from '@/lib/articleHtml';
import { countWords, htmlToText, isValidSlug, postStatus, readingMinutes, slugify, today, type PostMeta, type PostStatus } from '@/lib/blog';
import { compressAndUpload, pickImages } from '@/lib/images';
import { adminNotifications } from '@/lib/notifications';
import { useSettings } from '@/lib/settings';
import { KEYS, readJson, removeKey, writeJson } from '@/lib/storage';
import { fonts, space, useTheme } from '@/lib/theme';

interface Initial {
  slug: string;
  sha?: string;
  meta: PostMeta;
  html: string;
  status: PostStatus | null; // null: never saved to the website
  restored: boolean;
}

// What is kept on the phone between autosaves
interface LocalDraft {
  slug: string;
  sha?: string;
  meta: PostMeta;
  html: string;
  status: PostStatus | null;
  updatedAt: string;
}

const emptyMeta = (): PostMeta => ({
  title: '',
  date: today(),
  category: 'Technology',
  excerpt: '',
  cover: '',
  tags: [],
  featured: false,
  draft: true,
});

const localDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const ask = (title: string, message: string, yes: string, no: string) =>
  new Promise<boolean>((resolve) =>
    Alert.alert(title, message, [
      { text: no, style: 'cancel', onPress: () => resolve(false) },
      { text: yes, onPress: () => resolve(true) },
    ], { cancelable: false }),
  );

async function loadInitial(slug: string | undefined): Promise<Initial> {
  if (!slug) {
    const local = await readJson<LocalDraft | null>(KEYS.draft('new'), null);
    if (local && (local.meta.title || htmlToText(local.html).trim())) {
      return { slug: local.slug, meta: local.meta, html: local.html, status: null, restored: true };
    }
    return { slug: '', meta: emptyMeta(), html: '', status: null, restored: false };
  }

  const { post } = await api.getPost(slug);
  const server: Initial = { slug: post.slug, sha: post.sha, meta: post.meta, html: post.html, status: post.status, restored: false };
  const local = await readJson<LocalDraft | null>(KEYS.draft(slug), null);
  if (!local) return server;
  if (local.sha !== post.sha) {
    // The article changed elsewhere since this phone's copy: the website's version wins
    await removeKey(KEYS.draft(slug));
    return server;
  }
  const restore = await ask(
    'Unsaved changes',
    `You have changes to this article saved on this phone (${new Date(local.updatedAt).toLocaleString()}). Continue with them?`,
    'Continue editing',
    'Discard them',
  );
  if (!restore) {
    await removeKey(KEYS.draft(slug));
    return server;
  }
  return { ...server, meta: local.meta, html: local.html, restored: true };
}

export default function EditorRoute() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const [initial, setInitial] = useState<Initial | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    loadInitial(slug)
      .then((i) => alive && setInitial(i))
      .catch((e) => alive && setError(e instanceof ApiError ? e.message : 'Could not open this article.'));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (error) return <CenteredState icon="alert-circle-outline" title="Couldn’t open the editor" message={error} action={{ label: 'Go back', onPress: () => router.back() }} />;
  if (!initial) return <Loading />;
  return <Editor initial={initial} />;
}

function Editor({ initial }: { initial: Initial }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { settings } = useSettings();
  const keyboard = useKeyboard();

  const [meta, setMeta] = useState<PostMeta>(initial.meta);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [sha, setSha] = useState(initial.sha);
  const [status, setStatus] = useState<PostStatus | null>(initial.status);
  const [coverPreview, setCoverPreview] = useState(initial.meta.cover);
  const [words, setWords] = useState(0);
  const [dirty, setDirty] = useState(initial.restored);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<'draft' | 'publish' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [linkPrompt, setLinkPrompt] = useState<{ initial: string; active: boolean } | null>(null);

  const isNew = !sha;
  const draftKey = useRef(initial.sha ? initial.slug : 'new');
  // data: URI shown in the editor -> uploaded URL stored in the article
  const uploads = useRef(new Map<string, string>());
  const baseline = useRef<{ html: string; meta: string } | null>(null);
  // Latest values for the debounced autosave, which runs outside render
  const latest = useRef({ meta, slug, sha, status });
  useEffect(() => {
    latest.current = { meta, slug, sha, status };
  }, [meta, slug, sha, status]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const editor = useEditorBridge({
    bridgeExtensions: editorKit(t),
    initialContent: initial.html || undefined,
    avoidIosKeyboard: true,
    scrollBottomOffset: 72,
    mergeStyles: true,
    onChange: () => scheduleLocalSave(),
  });
  const editorState = useBridgeState(editor);

  const withUploads = useCallback((html: string) => {
    let out = html;
    for (const [dataUri, url] of uploads.current) out = out.split(dataUri).join(url);
    return out;
  }, []);

  // Saves to the phone, and works out whether anything changed since the last website save
  const saveLocal = useCallback(async () => {
    const html = withUploads(await editor.getHTML());
    const { meta: m, slug: s, sha: h, status: st } = latest.current;
    setWords(countWords(htmlToText(html)));
    if (!baseline.current) return;
    const changed = html !== baseline.current.html || JSON.stringify({ m, s }) !== baseline.current.meta;
    setDirty(changed);
    if (!changed) {
      await removeKey(KEYS.draft(draftKey.current));
      return;
    }
    await writeJson(KEYS.draft(draftKey.current), { slug: s, sha: h, meta: m, html, status: st, updatedAt: new Date().toISOString() } satisfies LocalDraft);
    setLocalSavedAt(new Date());
  }, [editor, withUploads]);

  const scheduleLocalSave = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveLocal(), 1200);
  }, [saveLocal]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Baseline once the editor has loaded its content
  useEffect(() => {
    if (!editorState.isReady || baseline.current) return;
    editor.getHTML().then((html) => {
      const clean = withUploads(html);
      baseline.current = initial.restored
        ? { html: '\u0000', meta: '' } // restored from the phone: differs from the website by definition
        : { html: clean, meta: JSON.stringify({ m: initial.meta, s: initial.slug }) };
      setWords(countWords(htmlToText(clean)));
    });
  }, [editorState.isReady, editor, initial, withUploads]);

  // Metadata edits are autosaved too
  useEffect(() => {
    if (baseline.current) scheduleLocalSave();
  }, [meta, slug, scheduleLocalSave]);

  const updateMeta = (patch: Partial<PostMeta>) => setMeta((m) => ({ ...m, ...patch }));

  const onTitle = (title: string) => {
    updateMeta({ title });
    if (isNew && !slugTouched) setSlug(slugify(title));
  };

  // ---------- images ----------
  const pickCover = async () => {
    try {
      const [image] = await pickImages(false);
      if (!image) return;
      setCoverBusy(true);
      const uploaded = await compressAndUpload(image);
      setCoverPreview(uploaded.dataUri);
      updateMeta({ cover: uploaded.url });
    } catch (e) {
      Alert.alert('Cover image', e instanceof Error ? e.message : 'Upload failed. Please try again.');
    } finally {
      setCoverBusy(false);
    }
  };

  const insertImages = async () => {
    let images;
    try {
      images = await pickImages(true);
    } catch (e) {
      return Alert.alert('Images', e instanceof Error ? e.message : 'Could not open your photos.');
    }
    if (!images.length) return;
    setUploading(true);
    let inserted = 0;
    const failed: string[] = [];
    for (const image of images) {
      try {
        const { dataUri, url } = await compressAndUpload(image);
        uploads.current.set(dataUri, url);
        editor.insertContent({ type: 'image', attrs: { src: dataUri, alt: null, title: null } });
        inserted++;
      } catch (e) {
        failed.push(e instanceof Error ? e.message : 'Upload failed.');
      }
    }
    setUploading(false);
    if (failed.length) Alert.alert('Some images were not added', [...new Set(failed)].join('\n'));
    // Straight to alt text and captions for what was just added
    if (inserted) setImagesOpen(true);
  };

  // ---------- links ----------
  const onLink = () => {
    const s = editor.getEditorState();
    if (!s.isLinkActive && s.selection.from === s.selection.to) {
      Alert.alert('Add a link', 'Select the words you want to link first, then tap the link button.');
      return;
    }
    setLinkPrompt({ initial: s.activeLink ?? '', active: s.isLinkActive });
  };

  const applyLink = (raw: string) => {
    setLinkPrompt(null);
    const url = raw.trim();
    if (!url) return editor.setLink(null);
    editor.setLink(/^(https?:\/\/|mailto:|\/)/i.test(url) ? url : `https://${url}`);
  };

  // ---------- save to the website ----------
  const save = async (kind: 'draft' | 'publish', mode: PublishMode = 'now', at: Date = new Date()) => {
    const title = meta.title.trim();
    const html = withUploads(await editor.getHTML());
    const text = htmlToText(html).trim();
    const errs: Record<string, string> = {};
    if (!title) errs.title = 'Add a title first.';
    if (html.includes('data:image')) errs.body = 'An image hasn’t finished uploading. Remove it and add it again.';
    if (kind === 'publish' && text.length < 20) errs.body = 'Write the article before publishing.';
    if (!meta.category) errs.category = 'Choose a topic.';
    if (!isValidSlug(slug)) errs.slug = 'Use lowercase letters, numbers and dashes.';
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (errs.title || errs.body) {
        setPublishOpen(false);
        Alert.alert(kind === 'publish' ? 'Not ready to publish' : 'Not saved', errs.title ?? errs.body);
      }
      return;
    }

    const scheduled = kind === 'publish' && mode === 'schedule';
    const next: PostMeta = {
      ...meta,
      title,
      draft: kind === 'draft',
      publishAt: scheduled ? at.toISOString() : undefined,
      // First publication is dated today (or the scheduled day); updates keep the original date
      date: scheduled ? localDate(at) : kind === 'publish' && status !== 'published' ? today() : meta.date || today(),
    };

    setBusy(kind);
    setErrors({});
    try {
      const result = await api.saveHtml({ slug, sha, meta: next, html });
      const finalStatus = result.status ?? postStatus(next);
      await removeKey(KEYS.draft(draftKey.current));
      draftKey.current = result.slug;
      baseline.current = { html, meta: JSON.stringify({ m: next, s: result.slug }) };
      setMeta(next);
      setSha(result.sha);
      setSlug(result.slug);
      setStatus(finalStatus);
      setDirty(false);
      setLocalSavedAt(null);
      setPublishOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['article', result.slug] });

      await adminNotifications.clear(result.slug);
      if (finalStatus === 'published') {
        await adminNotifications.published(title, result.slug);
        Alert.alert('Published', 'Your article will be live on the website and in the app in about a minute.', [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Done', onPress: () => router.back() },
        ]);
      } else if (finalStatus === 'scheduled') {
        await adminNotifications.scheduled(title, result.slug, at);
        Alert.alert('Scheduled', `It will go live ${at.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.`, [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Done', onPress: () => router.back() },
        ]);
      } else {
        await adminNotifications.draftSaved(title, result.slug, settings.draftReminders);
        Alert.alert('Draft saved', 'Saved to the website as a draft. It’s not visible to readers.');
      }
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) {
        setErrors(e.fields);
        setPublishOpen(true);
      }
      Alert.alert('Not saved', e instanceof ApiError ? e.message : 'Something went wrong. Your work is still saved on this phone.');
    } finally {
      setBusy(null);
    }
  };

  // ---------- preview & leaving ----------
  const openPreview = async () => {
    const html = await editor.getHTML();
    const minutes = readingMinutes(countWords(htmlToText(html)));
    setPreview(
      articleDocument({
        title: meta.title,
        html,
        cover: coverPreview,
        category: meta.category,
        byline: `Vaibhav Pasi · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${minutes} min read`,
        tags: meta.tags,
        palette: t,
        textScale: settings.textScale,
      }),
    );
  };

  const close = useCallback(async () => {
    clearTimeout(timer.current);
    await saveLocal();
    if (!dirty) return router.back();
    Alert.alert('Leave the editor?', 'Your changes are kept on this phone, so you can pick up where you left off. They aren’t on the website yet.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Leave',
        onPress: () => {
          if (status !== 'published') adminNotifications.draftSaved(meta.title, draftKey.current, settings.draftReminders);
          router.back();
        },
      },
    ]);
  }, [dirty, saveLocal, status, meta.title, settings.draftReminders]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      void close();
      return true;
    });
    return () => sub.remove();
  }, [close]);

  const statusLine = busy
    ? 'Saving…'
    : `${words} ${words === 1 ? 'word' : 'words'} · ${readingMinutes(words)} min read${dirty ? (localSavedAt ? ' · Saved on phone' : ' · Unsaved') : status ? ' · Saved' : ''}`;

  const showToolbar = editorState.isFocused || uploading;

  return (
    <View style={{ flex: 1, backgroundColor: t.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.sm, paddingVertical: space.xs, gap: 2 }}>
        <IconButton icon="close" label="Close editor" onPress={() => void close()} />
        <View style={{ flex: 1, paddingHorizontal: space.xs }}>
          <Text variant="caption" tone="muted" numberOfLines={1} accessibilityLiveRegion="polite">
            {status ? `${status[0].toUpperCase()}${status.slice(1)} · ` : 'New · '}
            {statusLine}
          </Text>
        </View>
        <IconButton icon="images-outline" label="Images: alt text and captions" onPress={() => setImagesOpen(true)} />
        <IconButton icon="eye-outline" label="Preview" onPress={() => void openPreview()} />
        <Button label={status === 'published' ? 'Update' : 'Publish'} small onPress={() => setPublishOpen(true)} style={{ marginLeft: space.xs }} />
      </View>

      {initial.restored ? (
        <Text variant="caption" tone="accent" style={{ paddingHorizontal: space.xl, paddingBottom: space.xs }}>
          Restored your unsaved work from this phone.
        </Text>
      ) : null}

      {/* Title + cover */}
      <View style={{ paddingHorizontal: 20, paddingTop: space.sm, gap: space.sm }}>
        <TextInput
          value={meta.title}
          onChangeText={onTitle}
          placeholder="Title"
          placeholderTextColor={t.muted}
          multiline
          maxLength={150}
          scrollEnabled={false}
          submitBehavior="blurAndSubmit"
          returnKeyType="next"
          onSubmitEditing={() => editor.focus('start')}
          accessibilityLabel="Article title"
          style={{ fontFamily: fonts.black, fontSize: 28, lineHeight: 34, color: t.text, padding: 0, maxHeight: 140 }}
        />
        {errors.title ? (
          <Text variant="caption" tone="danger">
            {errors.title}
          </Text>
        ) : null}
        <Pressable accessibilityRole="button" onPress={() => setPublishOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 }}>
          <Ionicons name={meta.cover ? 'image' : 'image-outline'} size={16} color={t.accent} />
          <Text variant="caption" tone="accent">
            {meta.cover ? 'Cover image added' : 'Add a cover image'} · {meta.category}
          </Text>
        </Pressable>
      </View>

      {/* Body */}
      <View style={{ flex: 1 }}>
        <RichText editor={editor} style={{ backgroundColor: t.background }} containerStyle={{ backgroundColor: t.background }} />
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} keyboardVerticalOffset={0}>
        {showToolbar ? (
          <View style={{ paddingBottom: keyboard.isKeyboardUp ? 0 : insets.bottom }}>
            <EditorToolbar editor={editor} onLink={onLink} onImage={() => void insertImages()} uploading={uploading} />
          </View>
        ) : null}
      </KeyboardAvoidingView>

      {!showToolbar ? (
        <View style={{ position: 'absolute', right: 20, bottom: insets.bottom + 20 }}>
          <Button label="Add image" icon="image-outline" kind="secondary" small busy={uploading} onPress={() => void insertImages()} />
        </View>
      ) : null}

      <PublishSheet
        visible={publishOpen}
        onClose={() => setPublishOpen(false)}
        meta={meta}
        onMeta={updateMeta}
        slug={slug}
        onSlug={(s) => {
          setSlugTouched(true);
          setSlug(s);
        }}
        isNew={isNew}
        currentStatus={status}
        coverPreview={coverPreview}
        coverBusy={coverBusy}
        onPickCover={() => void pickCover()}
        onRemoveCover={() => {
          setCoverPreview('');
          updateMeta({ cover: '' });
        }}
        errors={errors}
        busy={busy}
        onSaveDraft={() => void save('draft')}
        onPublish={(mode, at) => void save('publish', mode, at)}
      />

      <ImagesPanel editor={editor} visible={imagesOpen} onClose={() => setImagesOpen(false)} />

      <PromptModal
        visible={Boolean(linkPrompt)}
        title={linkPrompt?.active ? 'Edit link' : 'Add link'}
        fields={[{ key: 'url', label: 'Web address', placeholder: 'https://', initial: linkPrompt?.initial, keyboardType: 'url' }]}
        submitLabel="Apply"
        destructiveLabel={linkPrompt?.active ? 'Remove link' : undefined}
        onDestructive={() => applyLink('')}
        onSubmit={(v) => applyLink(v.url ?? '')}
        onCancel={() => setLinkPrompt(null)}
      />

      <Modal visible={preview !== null} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setPreview(null)}>
        <View style={{ flex: 1, backgroundColor: t.background, paddingTop: insets.top }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.sm, gap: space.sm }}>
            <IconButton icon="close" label="Close preview" onPress={() => setPreview(null)} />
            <Text variant="label" style={{ flex: 1 }}>
              Preview
            </Text>
            <Text variant="caption" tone="muted" style={{ paddingRight: space.md }}>
              As readers will see it
            </Text>
          </View>
          {preview ? <ArticleWebView html={preview} /> : null}
        </View>
      </Modal>
    </View>
  );
}
