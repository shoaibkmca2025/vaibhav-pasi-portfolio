// Small design-system primitives: every screen is built from these, so type, spacing and
// colour stay consistent and both themes work automatically.
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { fonts, radius, space, useTheme } from '@/lib/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

const variants = {
  display: { fontFamily: fonts.black, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  serif: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  eyebrow: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1.4, textTransform: 'uppercase' as const },
} satisfies Record<string, TextStyle>;

interface TextProps extends RNTextProps {
  variant?: keyof typeof variants;
  tone?: 'default' | 'secondary' | 'muted' | 'accent' | 'danger' | 'onBrand';
}

export function Text({ variant = 'body', tone = 'default', style, ...props }: TextProps) {
  const t = useTheme();
  const color = {
    default: t.text,
    secondary: t.textSecondary,
    muted: t.muted,
    accent: t.accent,
    danger: t.danger,
    onBrand: t.onBrand,
  }[tone];
  return <RNText {...props} style={[variants[variant], { color }, style]} maxFontSizeMultiplier={1.6} />;
}

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  icon?: IconName;
  kind?: 'primary' | 'secondary' | 'ghost' | 'danger';
  busy?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, icon, kind = 'primary', busy, small, disabled, style, onPress, ...props }: ButtonProps) {
  const t = useTheme();
  const bg = { primary: t.brand, secondary: t.surfaceAlt, ghost: 'transparent', danger: 'transparent' }[kind];
  const fg = { primary: t.onBrand, secondary: t.text, ghost: t.accent, danger: t.danger }[kind];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || busy), busy: Boolean(busy) }}
      disabled={disabled || busy}
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.(e);
      }}
      style={({ pressed }) => [
        {
          minHeight: small ? 36 : 48,
          paddingHorizontal: small ? space.md : space.xl,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: kind === 'danger' ? 1 : 0,
          borderColor: t.danger,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
        style,
      ]}
      {...props}
    >
      {busy ? <ActivityIndicator color={fg} /> : icon ? <Ionicons name={icon} size={small ? 16 : 18} color={fg} /> : null}
      <Text variant="label" style={{ color: fg, fontSize: small ? 13 : 15 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  active,
  color,
  size = 22,
  disabled,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  color?: string;
  size?: number;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      hitSlop={8}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? t.surfaceAlt : 'transparent',
        opacity: disabled ? 0.35 : pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={size} color={color ?? (active ? t.accent : t.text)} />
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        minHeight: 36,
        justifyContent: 'center',
        borderRadius: radius.pill,
        backgroundColor: selected ? t.text : t.surfaceAlt,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text variant="label" style={{ color: selected ? t.background : t.textSecondary, fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[{ backgroundColor: t.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: t.border, padding: space.lg }, style]}>
      {children}
    </View>
  );
}

export function Divider() {
  const t = useTheme();
  return <View style={{ height: 1, backgroundColor: t.border }} />;
}

export function CenteredState({
  icon,
  title,
  message,
  action,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void };
}) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xxl, gap: space.md, minHeight: 280 }}>
      {icon ? <Ionicons name={icon} size={40} color={t.muted} /> : null}
      <Text variant="heading" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {message ? (
        <Text tone="muted" style={{ textAlign: 'center', maxWidth: 320 }}>
          {message}
        </Text>
      ) : null}
      {action ? <Button label={action.label} kind="secondary" onPress={action.onPress} style={{ marginTop: space.sm }} /> : null}
    </View>
  );
}

export function Loading() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
      <ActivityIndicator color={t.accent} />
    </View>
  );
}

export function StatusBadge({ status }: { status: 'draft' | 'scheduled' | 'published' }) {
  const t = useTheme();
  const map = {
    published: { label: 'Published', color: t.success },
    scheduled: { label: 'Scheduled', color: t.accent },
    draft: { label: 'Draft', color: t.muted },
  }[status];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, borderColor: t.border }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: map.color }} />
      <Text variant="caption" style={{ fontFamily: fonts.semibold, color: map.color }}>
        {map.label}
      </Text>
    </View>
  );
}
