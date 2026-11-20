// Cross-platform text prompt (Alert.prompt is iOS-only). Used for links.
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, TextInput, View } from 'react-native';
import { fonts, radius, space, useTheme } from '@/lib/theme';
import { Button, Text } from './ui';

export interface PromptField {
  key: string;
  label: string;
  placeholder?: string;
  initial?: string;
  keyboardType?: 'default' | 'url';
  multiline?: boolean;
  hint?: string;
}

interface Props {
  visible: boolean;
  title: string;
  fields: PromptField[];
  submitLabel?: string;
  destructiveLabel?: string; // e.g. "Remove link"
  onSubmit: (values: Record<string, string>) => void;
  onDestructive?: () => void;
  onCancel: () => void;
}

export function PromptModal(props: Props) {
  const t = useTheme();
  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onCancel}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <Pressable accessibilityLabel="Close" onPress={props.onCancel} style={{ flex: 1, backgroundColor: t.overlay, justifyContent: 'center', padding: space.xl }}>
          {/* Mounted only while open, so every opening starts from the fields' initial values */}
          {props.visible ? <PromptForm {...props} /> : null}
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PromptForm({ title, fields, submitLabel = 'Done', destructiveLabel, onSubmit, onDestructive, onCancel }: Props) {
  const t = useTheme();
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, f.initial ?? ''])));

  return (
    <Pressable onPress={() => {}} style={{ backgroundColor: t.surface, borderRadius: radius.lg, padding: space.xl, gap: space.lg }}>
      <Text variant="heading">{title}</Text>
      {fields.map((f, i) => (
        <View key={f.key} style={{ gap: 6 }}>
          <Text variant="label" tone="secondary">
            {f.label}
          </Text>
          <TextInput
            value={values[f.key] ?? ''}
            onChangeText={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
            onSubmitEditing={() => !f.multiline && onSubmit(values)}
            placeholder={f.placeholder}
            placeholderTextColor={t.muted}
            autoFocus={i === 0}
            autoCapitalize={f.keyboardType === 'url' ? 'none' : 'sentences'}
            autoCorrect={f.keyboardType !== 'url'}
            keyboardType={f.keyboardType === 'url' ? 'url' : 'default'}
            multiline={f.multiline}
            accessibilityLabel={f.label}
            style={{
              fontFamily: fonts.regular,
              fontSize: 16,
              color: t.text,
              backgroundColor: t.surfaceAlt,
              borderRadius: radius.md,
              paddingHorizontal: space.md,
              paddingVertical: 12,
              minHeight: f.multiline ? 72 : undefined,
              textAlignVertical: f.multiline ? 'top' : 'center',
            }}
          />
          {f.hint ? (
            <Text variant="caption" tone="muted">
              {f.hint}
            </Text>
          ) : null}
        </View>
      ))}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: space.sm, flexWrap: 'wrap' }}>
        {destructiveLabel && onDestructive ? <Button label={destructiveLabel} kind="danger" small onPress={onDestructive} /> : null}
        <View style={{ flex: 1 }} />
        <Button label="Cancel" kind="ghost" small onPress={onCancel} />
        <Button label={submitLabel} small onPress={() => onSubmit(values)} />
      </View>
    </Pressable>
  );
}
