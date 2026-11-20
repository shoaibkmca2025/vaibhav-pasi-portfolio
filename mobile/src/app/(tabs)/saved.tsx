import { router } from 'expo-router';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleRow } from '@/components/ArticleCard';
import { CenteredState, Divider, Text } from '@/components/ui';
import { useBookmarks } from '@/lib/bookmarks';
import { space } from '@/lib/theme';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { bookmarks } = useBookmarks();
  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(a) => a.slug}
      renderItem={({ item }) => <ArticleRow article={item} />}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <>
          <Text variant="display">Saved</Text>
          <Text tone="muted" style={{ marginTop: 4, marginBottom: space.sm }}>
            {bookmarks.length ? `${bookmarks.length} ${bookmarks.length === 1 ? 'article' : 'articles'} to read later` : 'Your reading list'}
          </Text>
        </>
      }
      ListEmptyComponent={
        <CenteredState
          icon="bookmark-outline"
          title="Nothing saved yet"
          message="Tap the bookmark on any article to keep it here, even offline."
          action={{ label: 'Browse articles', onPress: () => router.navigate('/') }}
        />
      }
      contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.xl, paddingBottom: 120, flexGrow: 1 }}
    />
  );
}
