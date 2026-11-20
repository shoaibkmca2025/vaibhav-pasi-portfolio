// Creator dashboard: totals, every article (drafts and scheduled included), and quick actions.
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { ActionSheetIOS, Alert, FlatList, Platform, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { CenteredState, Chip, Divider, IconButton, Loading, StatusBadge, Text } from '@/components/ui';
import { api, ApiError, type PostSummary } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { PostStatus } from '@/lib/blog';
import { articleUrl } from '@/lib/config';
import { formatDate } from '@/lib/feed';
import { adminNotifications } from '@/lib/notifications';
import { radius, space, useTheme } from '@/lib/theme';

type Filter = 'all' | PostStatus;
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Drafts' },
];

const compact = (n: number) => (n >= 10_000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

function Stat({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={{ flexGrow: 1, minWidth: '30%', padding: space.lg, borderRadius: radius.lg, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, gap: 2 }}>
      <Text variant="title">{value}</Text>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

// Show choices as a native action sheet on iOS and an alert on Android
function chooseAction(title: string, options: { label: string; destructive?: boolean; run: () => void }[]) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...options.map((o) => o.label), 'Cancel'],
        cancelButtonIndex: options.length,
        destructiveButtonIndex: options.findIndex((o) => o.destructive),
      },
      (i) => options[i]?.run(),
    );
  } else {
    Alert.alert(title, undefined, [...options.map((o) => ({ text: o.label, style: o.destructive ? ('destructive' as const) : ('default' as const), onPress: o.run })), { text: 'Cancel', style: 'cancel' }], {
      cancelable: true,
    });
  }
}

export default function Dashboard() {
  const t = useTheme();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [working, setWorking] = useState<string | null>(null);

  const posts = useQuery({ queryKey: ['admin-posts'], queryFn: api.listPosts });
  const stats = useQuery({ queryKey: ['admin-stats'], queryFn: api.stats, staleTime: 60_000 });

  const list = useMemo(() => posts.data?.posts ?? [], [posts.data]);
  const totals = useMemo(() => {
    const s = stats.data?.stats ?? {};
    return {
      total: list.length,
      published: list.filter((p) => p.status === 'published').length,
      scheduled: list.filter((p) => p.status === 'scheduled').length,
      drafts: list.filter((p) => p.status === 'draft').length,
      views: Object.values(s).reduce((sum, x) => sum + x.views, 0),
      shares: Object.values(s).reduce((sum, x) => sum + x.shares, 0),
    };
  }, [list, stats.data]);
  const visible = filter === 'all' ? list : list.filter((p) => p.status === filter);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
  };

  // Metadata-only change: re-save the post's own Markdown with a tweak to its header
  const updateMeta = async (post: PostSummary, change: (meta: PostSummary) => Partial<PostSummary>, done: string) => {
    setWorking(post.slug);
    try {
      const { post: full } = await api.getPost(post.slug);
      const result = await api.saveMarkdown({ slug: post.slug, sha: full.sha, meta: { ...full.meta, ...change(post) }, body: full.body });
      if (result.status === 'published') await adminNotifications.clear(post.slug);
      refresh();
      Alert.alert('Saved', done);
    } catch (e) {
      Alert.alert('Not saved', e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setWorking(null);
    }
  };

  const confirmDelete = (post: PostSummary) =>
    Alert.alert('Delete this article?', `“${post.title}” will be removed from the website and the app. Its history stays in Git if you ever need it back.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setWorking(post.slug);
          try {
            await api.deletePost(post.slug, post.sha);
            await adminNotifications.clear(post.slug);
            refresh();
          } catch (e) {
            Alert.alert('Not deleted', e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
          } finally {
            setWorking(null);
          }
        },
      },
    ]);

  const openActions = (post: PostSummary) =>
    chooseAction(post.title, [
      { label: 'Edit', run: () => router.push({ pathname: '/admin/editor', params: { slug: post.slug } }) },
      ...(post.status === 'published' ? [{ label: 'View on website', run: () => WebBrowser.openBrowserAsync(articleUrl(post.slug)) }] : []),
      {
        label: post.featured ? 'Remove from featured' : 'Feature on home page',
        run: () => updateMeta(post, (p) => ({ featured: !p.featured }), post.featured ? 'No longer featured.' : 'Featured. The website updates in about a minute.'),
      },
      post.status === 'draft'
        ? { label: 'Publish now', run: () => updateMeta(post, () => ({ draft: false, publishAt: undefined }), 'Published. Live on the website in about a minute.') }
        : { label: 'Unpublish (make draft)', run: () => updateMeta(post, () => ({ draft: true, publishAt: undefined }), 'Moved to drafts. It disappears from the website in about a minute.') },
      { label: 'Delete', destructive: true, run: () => confirmDelete(post) },
    ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton
              icon="log-out-outline"
              label="Sign out"
              onPress={() =>
                Alert.alert('Sign out?', 'You will need the admin password to publish again.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: async () => {
                      await signOut();
                      router.replace('/');
                    },
                  },
                ])
              }
            />
          ),
        }}
      />
      {posts.isLoading ? (
        <Loading />
      ) : posts.error && !posts.data ? (
        <CenteredState icon="cloud-offline-outline" title="Couldn’t load your articles" message={posts.error.message} action={{ label: 'Try again', onPress: () => posts.refetch() }} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(p) => p.slug}
          ItemSeparatorComponent={Divider}
          refreshControl={<RefreshControl refreshing={posts.isRefetching} onRefresh={refresh} tintColor={t.accent} />}
          contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 140 }}
          ListHeaderComponent={
            <View style={{ gap: space.lg, paddingBottom: space.sm }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
                <Stat label="Articles" value={String(totals.total)} />
                <Stat label="Published" value={String(totals.published)} />
                <Stat label="Drafts" value={String(totals.drafts)} />
                <Stat label="Scheduled" value={String(totals.scheduled)} />
                <Stat label="App views" value={stats.data ? compact(totals.views) : '–'} />
                <Stat label="Shares" value={stats.data ? compact(totals.shares) : '–'} />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                {FILTERS.map((f) => (
                  <Chip key={f.value} label={f.label} selected={filter === f.value} onPress={() => setFilter(f.value)} />
                ))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={<CenteredState icon="create-outline" title="Nothing here" message="Tap the pen to write a new article." />}
          renderItem={({ item }) => {
            const views = stats.data?.stats[item.slug]?.views;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityHint="Opens the editor. Long-press for more actions."
                onPress={() => router.push({ pathname: '/admin/editor', params: { slug: item.slug } })}
                onLongPress={() => openActions(item)}
                style={({ pressed }) => ({ paddingVertical: space.lg, gap: space.sm, opacity: pressed || working === item.slug ? 0.6 : 1 })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space.md }}>
                  <Text variant="heading" style={{ flex: 1 }} numberOfLines={2}>
                    {item.featured ? '★ ' : ''}
                    {item.title || 'Untitled'}
                  </Text>
                  <IconButton icon="ellipsis-horizontal" label={`More actions for ${item.title}`} onPress={() => openActions(item)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' }}>
                  <StatusBadge status={item.status} />
                  <Text variant="caption" tone="muted">
                    {item.status === 'scheduled' && item.publishAt
                      ? new Date(item.publishAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                      : formatDate(item.date)}
                    {' · '}
                    {item.category} · {item.words} words
                  </Text>
                  {views ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="eye-outline" size={14} color={t.muted} />
                      <Text variant="caption" tone="muted">
                        {compact(views)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Write a new article"
        onPress={() => router.push('/admin/editor')}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          bottom: 36,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: t.brand,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 6,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <Ionicons name="create" size={26} color={t.onBrand} />
      </Pressable>
    </>
  );
}
