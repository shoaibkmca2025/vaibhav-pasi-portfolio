import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { SourceSerif4_400Regular, SourceSerif4_400Regular_Italic, SourceSerif4_600SemiBold } from '@expo-google-fonts/source-serif-4';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/lib/auth';
import { BookmarksProvider } from '@/lib/bookmarks';
import { setUpChannels } from '@/lib/notifications';
import { SettingsProvider, useSettings } from '@/lib/settings';
import { fonts, ThemeProvider, useTheme } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Tapping a notification opens what it's about: an article for readers, the editor for draft reminders
function routeFromNotification(data: Record<string, unknown> | undefined) {
  const slug = typeof data?.slug === 'string' ? data.slug : '';
  if (!slug) return;
  if (data?.draft === '1') router.push({ pathname: '/admin/editor', params: { slug } });
  else if (data?.admin === '1') router.push('/admin');
  else router.push({ pathname: '/blog/[slug]', params: { slug } });
}

function useNotificationRouting(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    setUpChannels().catch(() => undefined);
    // App opened by tapping a notification while it was closed
    const last = Notifications.getLastNotificationResponse();
    if (last) routeFromNotification(last.notification.request.content.data);
    const sub = Notifications.addNotificationResponseReceivedListener((r) => routeFromNotification(r.notification.request.content.data));
    return () => sub.remove();
  }, [enabled]);
}

function Navigator() {
  const t = useTheme();
  const { loaded } = useSettings();
  const { ready } = useAuth();
  const appReady = loaded && ready;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(t.background).catch(() => undefined);
  }, [t.background]);

  useEffect(() => {
    if (appReady) SplashScreen.hideAsync().catch(() => undefined);
  }, [appReady]);

  useNotificationRouting(appReady);

  if (!appReady) return null;

  return (
    <>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.background },
          headerTintColor: t.text,
          headerTitleStyle: { fontFamily: fonts.semibold, color: t.text },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: t.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="blog/[slug]" options={{ title: '' }} />
        <Stack.Screen name="category/[name]" options={{ title: '' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="login" options={{ title: 'Admin sign in', presentation: 'modal' }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }));
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: Outfit_400Regular,
    [fonts.medium]: Outfit_500Medium,
    [fonts.semibold]: Outfit_600SemiBold,
    [fonts.bold]: Outfit_700Bold,
    [fonts.black]: Outfit_800ExtraBold,
    [fonts.serif]: SourceSerif4_400Regular,
    [fonts.serifItalic]: SourceSerif4_400Regular_Italic,
    [fonts.serifBold]: SourceSerif4_600SemiBold,
  });

  // A font failure falls back to system fonts rather than blocking the app
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <ThemeProvider>
            <AuthProvider>
              <BookmarksProvider>
                <Navigator />
              </BookmarksProvider>
            </AuthProvider>
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
