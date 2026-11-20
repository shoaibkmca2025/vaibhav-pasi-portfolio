// Alt text and captions for every image in the article. Alt text is read by screen readers and
// search engines; the caption shows under the image on the website and in the app.
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EditorBridge } from '@10play/tentap-editor';
import { Button, CenteredState, Divider, Text } from '@/components/ui';
import { fonts, radius, space, useTheme } from '@/lib/theme';

interface DocNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
}

interface ImageInfo {
  src: string;
  alt: string;
  caption: string;
}

function collectImages(node: DocNode, out: ImageInfo[] = []) {
  if (node.type === 'image' && typeof node.attrs?.src === 'string') {
    out.push({ src: node.attrs.src, alt: String(node.attrs.alt ?? ''), caption: String(node.attrs.title ?? '') });
  }
  node.content?.forEach((c) => collectImages(c, out));
  return out;
}

// Applies edits by position (the same image can appear twice); `null` removes an image
function applyEdits(node: DocNode, edits: (ImageInfo | null)[], counter = { i: 0 }): DocNode | null {
  if (node.type === 'image') {
    const edit = edits[counter.i++];
    if (edit === null) return null;
    return { ...node, attrs: { ...node.attrs, alt: edit?.alt || null, title: edit?.caption || null } };
  }
  if (!node.content) return node;
  return { ...node, content: node.content.map((c) => applyEdits(c, edits, counter)).filter((c): c is DocNode => c !== null) };
}

export function ImagesPanel({ editor, visible, onClose }: { editor: EditorBridge; visible: boolean; onClose: () => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [doc, setDoc] = useState<DocNode | null>(null);
  const [images, setImages] = useState<(ImageInfo | null)[]>([]);

  useEffect(() => {
    if (!visible) return;
    editor
      .getJSON()
      .then((json) => {
        const d = json as DocNode;
        setDoc(d);
        setImages(collectImages(d));
      })
      .catch(() => Alert.alert('Images', 'Could not read the article. Please try again.'));
  }, [visible, editor]);

  const set = (i: number, patch: Partial<ImageInfo>) => setImages((list) => list.map((img, j) => (j === i && img ? { ...img, ...patch } : img)));

  const apply = () => {
    if (doc) {
      const next = applyEdits(doc, images);
      if (next) editor.setContent(next);
    }
    onClose();
  };

  const remaining = images.filter((i): i is ImageInfo => i !== null);
  const missingAlt = remaining.filter((i) => !i.alt.trim()).length;

  const input = {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: t.text,
    backgroundColor: t.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 10,
  } as const;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: t.background, paddingTop: space.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.xl, paddingBottom: space.md, gap: space.md }}>
          <View style={{ flex: 1 }}>
            <Text variant="title">Images</Text>
            <Text variant="caption" tone="muted">
              {missingAlt ? `${missingAlt} ${missingAlt === 1 ? 'image needs' : 'images need'} alt text` : 'Describe each image for screen readers and search engines.'}
            </Text>
          </View>
          <Button label="Cancel" kind="ghost" small onPress={onClose} />
          <Button label="Apply" small onPress={apply} />
        </View>
        <Divider />
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, gap: space.xl, paddingBottom: insets.bottom + 80 }}>
          {!remaining.length ? <CenteredState icon="image-outline" title="No images yet" message="Use the image button in the toolbar to add photos." /> : null}
          {images.map((img, i) =>
            img ? (
              <View key={i} style={{ gap: space.md }}>
                <Image source={img.src} style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: t.surfaceAlt }} contentFit="cover" />
                <View style={{ gap: 6 }}>
                  <Text variant="label" tone="secondary">
                    Alt text
                  </Text>
                  <TextInput
                    value={img.alt}
                    onChangeText={(alt) => set(i, { alt })}
                    placeholder="What does this image show?"
                    placeholderTextColor={t.muted}
                    maxLength={200}
                    style={input}
                    accessibilityLabel={`Alt text for image ${i + 1}`}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <Text variant="label" tone="secondary">
                    Caption (optional)
                  </Text>
                  <TextInput
                    value={img.caption}
                    onChangeText={(caption) => set(i, { caption })}
                    placeholder="Shown under the image"
                    placeholderTextColor={t.muted}
                    maxLength={200}
                    style={input}
                    accessibilityLabel={`Caption for image ${i + 1}`}
                  />
                </View>
                <Button label="Remove image" kind="danger" small icon="trash-outline" style={{ alignSelf: 'flex-start' }} onPress={() => setImages((list) => list.map((x, j) => (j === i ? null : x)))} />
              </View>
            ) : null,
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
