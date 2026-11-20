import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fonts, useTheme } from '@/lib/theme';

const tabs: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'explore', title: 'Explore', icon: 'compass-outline', iconActive: 'compass' },
  { name: 'search', title: 'Search', icon: 'search-outline', iconActive: 'search' },
  { name: 'saved', title: 'Saved', icon: 'bookmark-outline', iconActive: 'bookmark' },
  { name: 'profile', title: 'About', icon: 'person-circle-outline', iconActive: 'person-circle' },
];

// Floating "Write" button, only for the signed-in admin
function WriteButton() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: 20, bottom: insets.bottom + 72 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Write a new article"
        onPress={() => router.push('/admin/editor')}
        style={({ pressed }) => ({
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: t.brand,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <Ionicons name="create" size={26} color={t.onBrand} />
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  const t = useTheme();
  const { isAdmin } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: t.background },
          tabBarActiveTintColor: t.text,
          tabBarInactiveTintColor: t.muted,
          tabBarStyle: { backgroundColor: t.background, borderTopColor: t.border },
          tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused, size }) => <Ionicons name={focused ? tab.iconActive : tab.icon} size={size} color={String(color)} />,
            }}
          />
        ))}
      </Tabs>
      {isAdmin ? <WriteButton /> : null}
    </View>
  );
}
