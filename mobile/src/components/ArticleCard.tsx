import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { useBookmarks } from '@/lib/bookmarks';
import { formatDate, type ArticleSummary } from '@/lib/feed';
import { radius, space, useTheme } from '@/lib/theme';
import { Text } from './ui';

const open = (slug: string) => router.push({ pathname: '/blog/[slug]', params: { slug } });

function BookmarkToggle({ article }: { article: ArticleSummary }) {
  const t = useTheme();
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(article.slug);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from saved' : 'Save for later'}
      hitSlop={10}
      onPress={() => toggle(article)}
    >
      <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? t.accent : t.muted} />
    </Pressable>
  );
}

// Large card with a full-width cover: for the featured article
export const FeaturedCard = memo(function FeaturedCard({ article }: { article: ArticleSummary }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${article.title}. ${article.readingMinutes} minute read`}
      onPress={() => open(article.slug)}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Image
        source={article.cover || undefined}
        style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg, backgroundColor: t.surfaceAlt }}
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
      />
      <View style={{ paddingTop: space.lg, gap: space.sm }}>
        <Text variant="eyebrow" tone="accent">
          Featured · {article.category}
        </Text>
        <Text variant="display" style={{ fontSize: 26, lineHeight: 31 }}>
          {article.title}
        </Text>
        {article.excerpt ? (
          <Text variant="serif" tone="secondary" numberOfLines={3}>
            {article.excerpt}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xs }}>
          <Text variant="caption" tone="muted">
            {formatDate(article.date)} · {article.readingMinutes} min read
          </Text>
          <BookmarkToggle article={article} />
        </View>
      </View>
    </Pressable>
  );
});

// Medium-style row: text on the left, square thumbnail on the right
export const ArticleRow = memo(function ArticleRow({ article }: { article: ArticleSummary }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${article.title}. ${article.readingMinutes} minute read`}
      onPress={() => open(article.slug)}
      style={({ pressed }) => ({ paddingVertical: space.lg, opacity: pressed ? 0.85 : 1 })}
    >
      <View style={{ flexDirection: 'row', gap: space.lg }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text variant="eyebrow" tone="accent">
            {article.category}
          </Text>
          <Text variant="heading" numberOfLines={3}>
            {article.title}
          </Text>
          {article.excerpt ? (
            <Text variant="caption" tone="secondary" numberOfLines={2}>
              {article.excerpt}
            </Text>
          ) : null}
        </View>
        {article.cover ? (
          <Image
            source={article.cover}
            style={{ width: 92, height: 92, borderRadius: radius.md, backgroundColor: t.surfaceAlt }}
            contentFit="cover"
            transition={200}
            accessibilityIgnoresInvertColors
          />
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md }}>
        <Text variant="caption" tone="muted">
          {formatDate(article.date)} · {article.readingMinutes} min read
        </Text>
        <BookmarkToggle article={article} />
      </View>
    </Pressable>
  );
});
