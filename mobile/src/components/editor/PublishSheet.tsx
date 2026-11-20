// "Ready to publish?" sheet: everything about the article except its text. Cover, topic, tags,
// excerpt, SEO (with a Google preview), URL, featured, and publish now / schedule / draft.
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Switch, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Chip, Divider, Text } from '@/components/ui';
import { CATEGORIES, LEGACY_CATEGORIES, slugify, type PostMeta, type PostStatus } from '@/lib/blog';
import { SITE_URL } from '@/lib/config';
import { fonts, radius, space, useTheme } from '@/lib/theme';

export type PublishMode = 'now' | 'schedule';

interface Props {
  visible: boolean;
  onClose: () => void;
  meta: PostMeta;
  onMeta: (patch: Partial<PostMeta>) => void;
  slug: string;
  onSlug: (slug: string) => void;
  isNew: boolean;
  currentStatus: PostStatus | null;
  coverPreview: string;
  coverBusy: boolean;
  onPickCover: () => void;
  onRemoveCover: () => void;
  errors: Record<string, string>;
  busy: 'draft' | 'publish' | null;
  onSaveDraft: () => void;
  onPublish: (mode: PublishMode, at: Date) => void;
}

const defaultScheduleTime = () => {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  d.setHours(9);
  return d;
};

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      {children}
      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function PublishSheet(props: Props) {
  const { visible, onClose, meta, onMeta, slug, onSlug, isNew, currentStatus, coverPreview, coverBusy, errors, busy } = props;
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<PublishMode>(meta.publishAt ? 'schedule' : 'now');
  const [at, setAt] = useState(() => (meta.publishAt ? new Date(meta.publishAt) : defaultScheduleTime()));
  const [tagDraft, setTagDraft] = useState('');
  // The current time, refreshed every 30 s, so "is the scheduled time still in the future?" stays true
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [visible]);

  const input = {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: t.text,
    backgroundColor: t.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
  } as const;

  const categories = [...CATEGORIES, ...(LEGACY_CATEGORIES.includes(meta.category) ? [meta.category] : [])];

  const addTags = (text: string) => {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
    const next = [...meta.tags];
    for (const p of parts) if (!next.some((x) => x.toLowerCase() === p.toLowerCase()) && next.length < 12) next.push(p.slice(0, 40));
    onMeta({ tags: next });
    setTagDraft('');
  };

  const pickAndroid = () => {
    DateTimePickerAndroid.open({
      value: at,
      mode: 'date',
      minimumDate: new Date(),
      onChange: (e, date) => {
        if (e.type !== 'set' || !date) return;
        DateTimePickerAndroid.open({
          value: date,
          mode: 'time',
          onChange: (e2, time) => {
            if (e2.type === 'set' && time) setAt(time);
          },
        });
      },
    });
  };

  const scheduleInPast = mode === 'schedule' && at.getTime() <= now + 60_000;
  const seoTitle = meta.seoTitle || (meta.title.length > 55 ? meta.title : `${meta.title} | Vaibhav Pasi`);
  const description = meta.metaDescription || meta.excerpt;
  const primaryLabel = mode === 'schedule' ? 'Schedule' : currentStatus === 'published' ? 'Update article' : 'Publish now';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: t.background }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: space.lg, paddingHorizontal: space.xl, gap: space.md }}>
          <Text variant="title" style={{ flex: 1 }}>
            Publishing
          </Text>
          <Button label="Close" kind="ghost" small onPress={onClose} />
        </View>
        <Divider />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, gap: space.xl, paddingBottom: insets.bottom + 40 }}>
          {/* Cover */}
          <Field label="Cover image" hint="Shown at the top of the article and in link previews. Wide photos work best.">
            {coverPreview ? (
              <View style={{ gap: space.sm }}>
                <Image source={coverPreview} style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: t.surfaceAlt }} contentFit="cover" />
                <View style={{ flexDirection: 'row', gap: space.sm }}>
                  <Button label="Change" kind="secondary" small busy={coverBusy} onPress={props.onPickCover} />
                  <Button label="Remove" kind="ghost" small onPress={props.onRemoveCover} />
                </View>
              </View>
            ) : (
              <Button label="Add cover image" icon="image-outline" kind="secondary" busy={coverBusy} onPress={props.onPickCover} />
            )}
          </Field>

          <Field label="Topic" error={errors.category}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
              {categories.map((c) => (
                <Chip key={c} label={c} selected={meta.category === c} onPress={() => onMeta({ category: c })} />
              ))}
            </View>
          </Field>

          <Field label={`Excerpt (${meta.excerpt.length}/300)`} error={errors.excerpt} hint="One or two sentences shown on article cards.">
            <TextInput
              value={meta.excerpt}
              onChangeText={(excerpt) => onMeta({ excerpt })}
              maxLength={300}
              multiline
              placeholder="What will readers get from this article?"
              placeholderTextColor={t.muted}
              style={[input, { minHeight: 84, textAlignVertical: 'top' }]}
            />
          </Field>

          <Field label="Tags" error={errors.tags} hint="Separate with commas. Up to 12.">
            {meta.tags.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
                {meta.tags.map((tag) => (
                  <Pressable
                    key={tag}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove tag ${tag}`}
                    onPress={() => onMeta({ tags: meta.tags.filter((x) => x !== tag) })}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: t.surfaceAlt }}
                  >
                    <Text variant="caption">{tag}</Text>
                    <Text variant="caption" tone="muted">
                      ✕
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <TextInput
              value={tagDraft}
              onChangeText={(v) => (v.endsWith(',') ? addTags(v) : setTagDraft(v))}
              onSubmitEditing={() => addTags(tagDraft)}
              onBlur={() => tagDraft.trim() && addTags(tagDraft)}
              placeholder="e.g. SEO, Instagram"
              placeholderTextColor={t.muted}
              returnKeyType="done"
              style={input}
            />
          </Field>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Text variant="label">Featured</Text>
              <Text variant="caption" tone="muted">
                Show as the big story at the top of the website and app
              </Text>
            </View>
            <Switch value={meta.featured} onValueChange={(featured) => onMeta({ featured })} trackColor={{ true: t.brand, false: t.surfaceAlt }} thumbColor="#FFFFFF" accessibilityLabel="Featured" />
          </View>

          <Divider />
          <Text variant="heading">Search engines</Text>

          <Field label={`SEO title (${(meta.seoTitle ?? '').length}/70)`} error={errors.seoTitle} hint="Optional. A shorter title for Google; the headline stays as written.">
            <TextInput value={meta.seoTitle ?? ''} onChangeText={(v) => onMeta({ seoTitle: v || undefined })} maxLength={70} placeholder={meta.title} placeholderTextColor={t.muted} style={input} />
          </Field>

          <Field label={`Meta description (${(meta.metaDescription ?? '').length}/170)`} error={errors.metaDescription} hint="Optional. Uses the excerpt when empty.">
            <TextInput
              value={meta.metaDescription ?? ''}
              onChangeText={(v) => onMeta({ metaDescription: v || undefined })}
              maxLength={170}
              multiline
              placeholder={meta.excerpt || 'The snippet shown under the title in search results'}
              placeholderTextColor={t.muted}
              style={[input, { minHeight: 72, textAlignVertical: 'top' }]}
            />
          </Field>

          <Field
            label="Web address"
            error={errors.slug}
            hint={isNew ? 'Created from the title. Choose carefully: it can’t change after publishing.' : 'Published addresses never change, so links and search rankings keep working.'}
          >
            <View style={[input, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, opacity: isNew ? 1 : 0.6 }]}>
              <Text variant="caption" tone="muted">
                /blog/
              </Text>
              <TextInput
                value={slug}
                editable={isNew}
                onChangeText={(v) => onSlug(slugify(v.replace(/ /g, '-')) + (v.endsWith('-') ? '-' : ''))}
                onBlur={() => onSlug(slugify(slug))}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, fontFamily: fonts.regular, fontSize: 15, color: t.text, paddingVertical: 12 }}
              />
            </View>
          </Field>

          {/* Google result preview */}
          <View style={{ gap: 4, padding: space.lg, borderRadius: radius.md, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border }}>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {SITE_URL.replace('https://', '')} › blog › {slug || 'your-article'}
            </Text>
            <Text style={{ color: t.scheme === 'dark' ? '#8AB4F8' : '#1A0DAB', fontSize: 18 }} numberOfLines={2}>
              {seoTitle || 'Your article title'}
            </Text>
            <Text variant="caption" tone="secondary" numberOfLines={3}>
              {description || 'Add an excerpt or meta description to control this text.'}
            </Text>
          </View>

          <Divider />
          <Text variant="heading">When</Text>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Chip label="Publish now" selected={mode === 'now'} onPress={() => setMode('now')} />
            <Chip label="Schedule" selected={mode === 'schedule'} onPress={() => setMode('schedule')} />
          </View>
          {mode === 'schedule' ? (
            <View style={{ gap: space.sm }}>
              {Platform.OS === 'ios' ? (
                <DateTimePicker value={at} mode="datetime" display="compact" minimumDate={new Date()} onChange={(_, d) => d && setAt(d)} themeVariant={t.scheme} style={{ alignSelf: 'flex-start' }} />
              ) : (
                <Button label={at.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} icon="calendar-outline" kind="secondary" onPress={pickAndroid} style={{ alignSelf: 'flex-start' }} />
              )}
              <Text variant="caption" tone={scheduleInPast ? 'danger' : 'muted'}>
                {scheduleInPast
                  ? 'Pick a time in the future.'
                  : 'Goes live on the website and in the app within about 20 minutes of this time. Readers get a notification.'}
              </Text>
            </View>
          ) : null}

          {Object.keys(errors).length && !['category', 'excerpt', 'tags', 'seoTitle', 'metaDescription', 'slug'].some((k) => errors[k]) ? (
            <Text tone="danger">{Object.values(errors)[0]}</Text>
          ) : null}

          <View style={{ gap: space.sm }}>
            <Button label={primaryLabel} icon={mode === 'schedule' ? 'time-outline' : 'paper-plane-outline'} busy={busy === 'publish'} disabled={Boolean(busy) || scheduleInPast} onPress={() => props.onPublish(mode, at)} />
            <Button label={currentStatus === 'published' ? 'Unpublish and save as draft' : 'Save as draft'} kind="secondary" busy={busy === 'draft'} disabled={Boolean(busy)} onPress={props.onSaveDraft} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
