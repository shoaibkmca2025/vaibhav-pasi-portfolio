// Formatting bar that sits above the keyboard: headings, bold/italic/underline, lists, quote,
// link, image, undo/redo. Buttons show their active state and are labelled for screen readers.
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useBridgeState, type EditorBridge } from '@10play/tentap-editor';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { radius, useTheme } from '@/lib/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Props {
  editor: EditorBridge;
  onLink: () => void;
  onImage: () => void;
  uploading: boolean;
}

function Tool({ icon, label, onPress, active, disabled }: { icon: IconName; label: string; onPress: () => void; active?: boolean; disabled?: boolean }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(active), disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: 42,
        height: 42,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? t.surfaceAlt : 'transparent',
        opacity: disabled ? 0.3 : pressed ? 0.6 : 1,
      })}
    >
      <MaterialCommunityIcons name={icon} size={24} color={active ? t.accent : t.text} />
    </Pressable>
  );
}

function Separator() {
  const t = useTheme();
  return <View style={{ width: 1, height: 24, backgroundColor: t.border, marginHorizontal: 4, alignSelf: 'center' }} />;
}

export function EditorToolbar({ editor, onLink, onImage, uploading }: Props) {
  const t = useTheme();
  const s = useBridgeState(editor);
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: t.border, backgroundColor: t.background }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center' }}>
        <Tool icon="format-header-1" label="Heading 1" active={s.headingLevel === 1} onPress={() => editor.toggleHeading(1)} />
        <Tool icon="format-header-2" label="Heading 2" active={s.headingLevel === 2} onPress={() => editor.toggleHeading(2)} />
        <Tool icon="format-header-3" label="Heading 3" active={s.headingLevel === 3} onPress={() => editor.toggleHeading(3)} />
        <Separator />
        <Tool icon="format-bold" label="Bold" active={s.isBoldActive} disabled={!s.canToggleBold} onPress={editor.toggleBold} />
        <Tool icon="format-italic" label="Italic" active={s.isItalicActive} disabled={!s.canToggleItalic} onPress={editor.toggleItalic} />
        <Tool icon="format-underline" label="Underline" active={s.isUnderlineActive} disabled={!s.canToggleUnderline} onPress={editor.toggleUnderline} />
        <Separator />
        <Tool icon="format-list-bulleted" label="Bulleted list" active={s.isBulletListActive} onPress={editor.toggleBulletList} />
        <Tool icon="format-list-numbered" label="Numbered list" active={s.isOrderedListActive} onPress={editor.toggleOrderedList} />
        <Tool icon="format-quote-close" label="Quote" active={s.isBlockquoteActive} onPress={editor.toggleBlockquote} />
        <Separator />
        <Tool icon="link-variant" label={s.isLinkActive ? 'Edit link' : 'Add link'} active={s.isLinkActive} onPress={onLink} />
        {uploading ? (
          <View style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={t.accent} accessibilityLabel="Uploading image" />
          </View>
        ) : (
          <Tool icon="image-plus" label="Insert image" onPress={onImage} />
        )}
        <Separator />
        <Tool icon="undo-variant" label="Undo" disabled={!s.canUndo} onPress={editor.undo} />
        <Tool icon="redo-variant" label="Redo" disabled={!s.canRedo} onPress={editor.redo} />
      </ScrollView>
    </View>
  );
}
