import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useMemo } from 'react';
import { FlatList } from 'react-native';
import { ArticleRow } from '@/components/ArticleCard';
import { CenteredState, Divider, Loading, Text } from '@/components/ui';
import { useFeed } from '@/lib/feed';
import { space } from '@/lib/theme';

export default function CategoryScreen() {
  const { name = '' } = useLocalSearchParams<{ name: string }>();
  const { data, isLoading } = useFeed();
  const articles = useMemo(() => (data ?? []).filter((a) => a.category === name), [data, name]);

  if (isLoading) return <Loading />;
  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <FlatList
        data={articles}
        keyExtractor={(a) => a.slug}
        renderItem={({ item }) => <ArticleRow article={item} />}
        ItemSeparatorComponent={Divider}
        ListHeaderComponent={
          <Text variant="display" style={{ marginTop: space.sm, marginBottom: space.sm }}>
            {name}
          </Text>
        }
        ListEmptyComponent={<CenteredState icon="document-text-outline" title="Nothing here yet" message={`New ${name} articles will appear here.`} />}
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 60 }}
      />
    </>
  );
}
