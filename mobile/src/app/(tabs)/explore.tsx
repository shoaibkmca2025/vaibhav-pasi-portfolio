import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CenteredState, Loading, Text, type IconName } from '@/components/ui';
import { CATEGORIES } from '@/lib/blog';
import { useFeed } from '@/lib/feed';
import { radius, space, useTheme } from '@/lib/theme';

const ICONS: Record<string, IconName> = {
  Technology: 'hardware-chip-outline',
  AI: 'sparkles-outline',
  'Digital Marketing': 'megaphone-outline',
  'Software Development': 'code-slash-outline',
  Business: 'briefcase-outline',
  Entrepreneurship: 'rocket-outline',
  'Personal Growth': 'leaf-outline',
  Travel: 'airplane-outline',
};

export default function ExploreScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useFeed();

  // The eight core topics always show; topics only used by older articles are listed after them
  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of data ?? []) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    const core = CATEGORIES.map((name) => ({ name, count: counts.get(name) ?? 0 }));
    const others = [...counts.entries()]
      .filter(([name]) => !(CATEGORIES as readonly string[]).includes(name))
      .map(([name, count]) => ({ name, count }));
    return [...core, ...others];
  }, [data]);

  if (isLoading) return <Loading />;
  if (error && !data) return <CenteredState icon="cloud-offline-outline" title="Couldn’t load topics" message={error.message} action={{ label: 'Try again', onPress: () => refetch() }} />;

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.xl, paddingBottom: 120 }}>
      <Text variant="display">Explore</Text>
      <Text tone="muted" style={{ marginTop: 4, marginBottom: space.xl }}>
        Browse by topic
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
        {topics.map(({ name, count }) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityLabel={`${name}, ${count} ${count === 1 ? 'article' : 'articles'}`}
            onPress={() => router.push({ pathname: '/category/[name]', params: { name } })}
            style={({ pressed }) => ({
              width: '47.5%',
              flexGrow: 1,
              minHeight: 112,
              padding: space.lg,
              borderRadius: radius.lg,
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: t.border,
              justifyContent: 'space-between',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name={ICONS[name] ?? 'pricetag-outline'} size={24} color={t.accent} />
            <View>
              <Text variant="label" style={{ fontSize: 15 }}>
                {name}
              </Text>
              <Text variant="caption" tone="muted">
                {count ? `${count} ${count === 1 ? 'article' : 'articles'}` : 'Coming soon'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
