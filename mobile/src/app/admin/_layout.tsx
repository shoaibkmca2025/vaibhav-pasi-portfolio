// Everything under /admin requires the admin token. The server checks it on every request too;
// this guard just keeps signed-out users from seeing the screens.
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useAuth } from '@/lib/auth';
import { fonts, useTheme } from '@/lib/theme';

export default function AdminLayout() {
  const t = useTheme();
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Redirect href="/login" />;
  return (
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
      <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="editor" options={{ headerShown: false, presentation: 'fullScreenModal', gestureEnabled: false }} />
    </Stack>
  );
}
