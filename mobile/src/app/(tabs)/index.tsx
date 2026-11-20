import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleRow, FeaturedCard } from '@/components/ArticleCard';
import { Button, Card, CenteredState, Divider, Loading, Text } from '@/components/ui';
import { BRAND } from '@/lib/config';
import { useFeed } from '@/lib/feed';
import { enableArticlePush } from '@/lib/notifications';
import { useSettings } from '@/lib/settings';
import { KEYS, readJson, writeJson } from '@/lib/storage';
import { space, useTheme } from '@/lib/theme';

// A one-time, dismissible invitation to turn on new-article notifications
function NotifyCard() {
  const { settings, update } = useSettings();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    readJson(KEYS.pushAsked, false).then((asked) => setShow(!asked && !settings.newArticleAlerts));
  }, [settings.newArticleAlerts]);

  if (!show) return null;
  const dismiss = () => {
    setShow(false);
    writeJson(KEYS.pushAsked, true);
  };
  return (
    <Card style={{ marginBottom: space.xl, gap: space.md }}>
      <Text variant="heading">Never miss an article</Text>
      <Text tone="secondary">Get a notification when Vaibhav publishes something new. No other messages.</Text>
      {message ? <Text tone="muted">{message}</Text> : null}
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Button
          label="Notify me"
          icon="notifications-outline"
          small
          busy={busy}
          onPress={async () => {
            setBusy(true);
            const result = await enableArticlePush();
            setBusy(false);
            if (result === 'enabled') {
              update({ newArticleAlerts: true });
              dismiss();
            } else {
              setMessage(
                result === 'denied'
                  ? 'Notifications are turned off for this app. You can allow them in your phone’s settings.'
                  : 'Notifications are not available right now. Try again later from Settings.',
              );
            }
          }}
        />
        <Button label="Not now" kind="ghost" small onPress={dismiss} />
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch, isRefetching } = useFeed();

  const { featured, rest } = useMemo(() => {
    const all = data ?? [];
    const top = all.find((a) => a.featured) ?? all[0];
    return { featured: top, rest: all.filter((a) => a !== top) };
  }, [data]);

  const header = (
    <View style={{ paddingTop: insets.top + space.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.xl }}>
        <View>
          <Text variant="display">{BRAND.name}</Text>
          <Text variant="eyebrow" tone="accent" style={{ marginTop: 4 }}>
            {BRAND.tagline}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" hitSlop={10} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color={t.text} />
        </Pressable>
      </View>
      <NotifyCard />
      {featured ? <FeaturedCard article={featured} /> : null}
      {rest.length ? (
        <Text variant="eyebrow" tone="muted" style={{ marginTop: space.xxl, marginBottom: space.xs }}>
          Latest
        </Text>
      ) : null}
    </View>
  );

  if (isLoading) return <Loading />;
  if (error && !data) {
    return <CenteredState icon="cloud-offline-outline" title="Couldn’t load articles" message={error.message} action={{ label: 'Try again', onPress: () => refetch() }} />;
  }

  return (
    <FlatList
      data={rest}
      keyExtractor={(a) => a.slug}
      renderItem={({ item }) => <ArticleRow article={item} />}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={header}
      ListEmptyComponent={featured ? undefined : <CenteredState icon="document-text-outline" title="No articles yet" />}
      contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={t.accent} />}
    />
  );
}
