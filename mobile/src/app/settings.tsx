import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';
import { Button, Card, Chip, Divider, Text } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { disableArticlePush, enableArticlePush } from '@/lib/notifications';
import { useSettings, type Settings } from '@/lib/settings';
import { space, useTheme } from '@/lib/theme';

const THEMES: { value: Settings['theme']; label: string }[] = [
  { value: 'system', label: 'Automatic' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const SIZES = [
  { value: 0.9, label: 'Small' },
  { value: 1, label: 'Default' },
  { value: 1.15, label: 'Large' },
  { value: 1.3, label: 'Larger' },
];

function ToggleRow({ label, detail, value, onChange, disabled }: { label: string; detail: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="label">{label}</Text>
        <Text variant="caption" tone="muted">
          {detail}
        </Text>
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: t.brand, false: t.surfaceAlt }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, update } = useSettings();
  const { isAdmin, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const toggleAlerts = async (on: boolean) => {
    if (!on) {
      update({ newArticleAlerts: false });
      await disableArticlePush();
      return;
    }
    setBusy(true);
    const result = await enableArticlePush();
    setBusy(false);
    if (result === 'enabled') update({ newArticleAlerts: true });
    else
      Alert.alert(
        'Notifications',
        result === 'denied'
          ? 'Notifications are turned off for this app. Allow them in your phone’s settings, then try again.'
          : 'Notifications aren’t available right now. Please try again later.',
      );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: space.xl, gap: space.xl, paddingBottom: 60 }}>
      <View style={{ gap: space.md }}>
        <Text variant="eyebrow" tone="muted">
          Appearance
        </Text>
        <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
          {THEMES.map((th) => (
            <Chip key={th.value} label={th.label} selected={settings.theme === th.value} onPress={() => update({ theme: th.value })} />
          ))}
        </View>
      </View>

      <View style={{ gap: space.md }}>
        <Text variant="eyebrow" tone="muted">
          Article text size
        </Text>
        <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
          {SIZES.map((s) => (
            <Chip key={s.label} label={s.label} selected={settings.textScale === s.value} onPress={() => update({ textScale: s.value })} />
          ))}
        </View>
      </View>

      <Card style={{ paddingVertical: space.xs }}>
        <ToggleRow label="New article alerts" detail="A notification when a new article is published" value={settings.newArticleAlerts} onChange={toggleAlerts} disabled={busy} />
        {isAdmin ? (
          <>
            <Divider />
            <ToggleRow
              label="Draft reminders"
              detail="A nudge a day after you last edited a draft"
              value={settings.draftReminders}
              onChange={(v) => update({ draftReminders: v })}
            />
          </>
        ) : null}
      </Card>

      {isAdmin ? (
        <Button
          label="Sign out of admin"
          kind="danger"
          icon="log-out-outline"
          onPress={async () => {
            await signOut();
            router.back();
          }}
        />
      ) : null}

      <Text variant="caption" tone="muted" style={{ textAlign: 'center' }}>
        Vaibhav Pasi · version {Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </ScrollView>
  );
}
