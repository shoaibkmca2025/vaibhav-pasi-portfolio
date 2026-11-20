// Article reader. The route mirrors the website's URL (/blog/<slug>), so links and
// notifications map one-to-one.
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleWebView } from '@/components/ArticleWebView';
import { CenteredState, IconButton, Loading, Text, type IconName } from '@/components/ui';
import { publicApi } from '@/lib/api';
import { articleDocument } from '@/lib/articleHtml';
import { useBookmarks } from '@/lib/bookmarks';
import { formatDate, useArticle } from '@/lib/feed';
import { useSettings } from '@/lib/settings';
import { shareArticle, type ShareTarget } from '@/lib/share';
import { radius, space, useTheme } from '@/lib/theme';

// One view per article per app session
const viewed = new Set<string>();

const SHARE_OPTIONS: { target: ShareTarget; label: string; icon: IconName }[] = [
  { target: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp' },
  { target: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
  { target: 'x', label: 'X', icon: 'logo-twitter' },
  { target: 'system', label: 'More…', icon: 'share-outline' },
];

export default function ArticleScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const { data: article, isLoading, error, refetch } = useArticle(slug);
  const { isSaved, toggle } = useBookmarks();
  const { settings } = useSettings();
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (article && !viewed.has(article.slug)) {
      viewed.add(article.slug);
      publicApi.track(article.slug, 'view');
    }
  }, [article]);

  const doc = useMemo(
    () =>
      article
        ? articleDocument({
            title: article.title,
            html: article.html,
            cover: article.cover,
            category: article.category,
            byline: `Vaibhav Pasi · ${formatDate(article.date)} · ${article.readingMinutes} min read`,
            tags: article.tags,
            palette: t,
            textScale: settings.textScale,
          })
        : '',
    [article, t, settings.textScale],
  );

  const saved = article ? isSaved(article.slug) : false;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () =>
            article ? (
              <View style={{ flexDirection: 'row' }}>
                <IconButton icon={saved ? 'bookmark' : 'bookmark-outline'} label={saved ? 'Remove from saved' : 'Save for later'} active={saved} onPress={() => toggle(article)} />
                <IconButton icon="share-outline" label="Share article" onPress={() => setShareOpen(true)} />
              </View>
            ) : null,
        }}
      />
      {isLoading ? (
        <Loading />
      ) : error || !article ? (
        <CenteredState
          icon="document-text-outline"
          title="Article not available"
          message={error?.message ?? 'It may have been unpublished.'}
          action={{ label: 'Try again', onPress: () => refetch() }}
        />
      ) : (
        <ArticleWebView html={doc} />
      )}

      <Modal visible={shareOpen} transparent animationType="slide" onRequestClose={() => setShareOpen(false)}>
        <Pressable accessibilityLabel="Close" style={{ flex: 1, backgroundColor: t.overlay }} onPress={() => setShareOpen(false)} />
        <View style={{ backgroundColor: t.surface, padding: space.xl, paddingBottom: insets.bottom + space.xl, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, gap: space.lg }}>
          <Text variant="heading">Share this article</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {SHARE_OPTIONS.map((o) => (
              <Pressable
                key={o.target}
                accessibilityRole="button"
                accessibilityLabel={`Share on ${o.label}`}
                onPress={() => {
                  setShareOpen(false);
                  if (article) shareArticle(article, o.target);
                }}
                style={{ alignItems: 'center', gap: 8, width: 72 }}
              >
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: t.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={o.icon} size={24} color={t.text} />
                </View>
                <Text variant="caption" tone="secondary">
                  {o.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
