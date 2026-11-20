import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleRow } from '@/components/ArticleCard';
import { CenteredState, Chip, Divider, Text } from '@/components/ui';
import { searchArticles, useFeed } from '@/lib/feed';
import { KEYS, readJson, writeJson } from '@/lib/storage';
import { fonts, radius, space, useTheme } from '@/lib/theme';

export default function SearchScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { data } = useFeed();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    readJson<string[]>(KEYS.recentSearches, []).then(setRecent);
  }, []);

  const categories = useMemo(() => [...new Set((data ?? []).map((a) => a.category))].sort(), [data]);
  const results = useMemo(() => searchArticles(data ?? [], query, category), [data, query, category]);
  const searching = query.trim().length > 0 || Boolean(category);

  const remember = () => {
    const q = query.trim();
    if (!q) return;
    const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 8);
    setRecent(next);
    writeJson(KEYS.recentSearches, next);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top + space.lg }}>
      <View style={{ paddingHorizontal: space.xl, gap: space.md }}>
        <Text variant="display">Search</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.sm,
            backgroundColor: t.surfaceAlt,
            borderRadius: radius.pill,
            paddingHorizontal: space.lg,
            minHeight: 48,
          }}
        >
          <Ionicons name="search" size={18} color={t.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={remember}
            placeholder="Titles, topics, keywords"
            placeholderTextColor={t.muted}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search articles"
            style={{ flex: 1, fontFamily: fonts.regular, fontSize: 16, color: t.text, paddingVertical: 12 }}
          />
          {query ? (
            <Pressable accessibilityLabel="Clear search" hitSlop={10} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={t.muted} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: space.sm }}>
          <Chip label="All topics" selected={!category} onPress={() => setCategory(undefined)} />
          {categories.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(category === c ? undefined : c)} />
          ))}
        </ScrollView>
      </View>

      {searching ? (
        <FlatList
          data={results}
          keyExtractor={(a) => a.slug}
          renderItem={({ item }) => <ArticleRow article={item} />}
          ItemSeparatorComponent={Divider}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => {
            remember();
            Keyboard.dismiss();
          }}
          ListHeaderComponent={
            <Text variant="caption" tone="muted" style={{ marginTop: space.lg }}>
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </Text>
          }
          ListEmptyComponent={<CenteredState icon="search-outline" title="No matches" message="Try a different word or topic." />}
          contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 120 }}
        />
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, gap: space.md }}>
          {recent.length ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="eyebrow" tone="muted">
                  Recent searches
                </Text>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => {
                    setRecent([]);
                    writeJson(KEYS.recentSearches, []);
                  }}
                >
                  <Text variant="caption" tone="accent">
                    Clear
                  </Text>
                </Pressable>
              </View>
              {recent.map((r) => (
                <Pressable key={r} accessibilityRole="button" onPress={() => setQuery(r)} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 6 }}>
                  <Ionicons name="time-outline" size={18} color={t.muted} />
                  <Text>{r}</Text>
                </Pressable>
              ))}
            </>
          ) : (
            <CenteredState icon="search-outline" title="Find an article" message="Search by title, keyword or tag, or pick a topic." />
          )}
        </ScrollView>
      )}
    </View>
  );
}
