// About Vaibhav. Copy and links mirror the website (src/site.ts, src/contact.ts).
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Divider, Text, type IconName } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { BRAND, SITE_URL } from '@/lib/config';
import { radius, space, useTheme } from '@/lib/theme';

const BIO =
  'Vaibhav Pasi is a software developer and digital marketing strategist, an MCA graduate, and Co-Founder of 4AM Global Media. His work combines website development, SEO, digital marketing and AI-powered business automation.';

const FOCUS = ['Website Development', 'SEO, AEO & GEO', 'Digital Marketing Strategy', 'AI & Business Automation', 'Social Media Growth', 'Branding'];

const SOCIAL: { label: string; href: string; icon: IconName }[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vaibhavpasi2001', icon: 'logo-linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/vaibhavpasi_', icon: 'logo-instagram' },
  { label: 'X', href: 'https://x.com/vaibhavpasi', icon: 'logo-twitter' },
  { label: 'GitHub', href: 'https://github.com/vaibhavpasi', icon: 'logo-github' },
];

function Row({ icon, label, onPress, detail }: { icon: IconName; label: string; onPress: () => void; detail?: string }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 14, opacity: pressed ? 0.7 : 1 })}>
      <Ionicons name={icon} size={20} color={t.accent} />
      <Text style={{ flex: 1 }}>{label}</Text>
      {detail ? (
        <Text variant="caption" tone="muted">
          {detail}
        </Text>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={t.muted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { isAdmin } = useAuth();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingHorizontal: space.xl, paddingBottom: 140, gap: space.xl }}>
      <View style={{ alignItems: 'center', gap: space.md, paddingTop: space.lg }}>
        <Image
          source={`${SITE_URL}/vaibhav-pasi.jpg`}
          style={{ width: 112, height: 112, borderRadius: 56, borderWidth: 2, borderColor: t.brand, backgroundColor: t.surfaceAlt }}
          accessibilityLabel="Portrait of Vaibhav Pasi"
          transition={200}
        />
        <Text variant="display">{BRAND.name}</Text>
        <Text variant="eyebrow" tone="accent">
          {BRAND.tagline}
        </Text>
        <Text variant="caption" tone="muted" style={{ textAlign: 'center' }}>
          Software Developer · Digital Marketing Strategist · Co-Founder, 4AM Global Media
        </Text>
      </View>

      <Text variant="serif" tone="secondary" style={{ fontSize: 17, lineHeight: 27 }}>
        {BIO}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {FOCUS.map((f) => (
          <View key={f} style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: t.surfaceAlt }}>
            <Text variant="caption" tone="secondary">
              {f}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: space.lg }}>
        {SOCIAL.map((s) => (
          <Pressable
            key={s.label}
            accessibilityRole="link"
            accessibilityLabel={`Vaibhav Pasi on ${s.label}`}
            onPress={() => Linking.openURL(s.href)}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: t.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={s.icon} size={22} color={t.text} />
          </Pressable>
        ))}
      </View>

      <Card style={{ paddingVertical: 0 }}>
        <Row icon="globe-outline" label="Visit the website" onPress={() => WebBrowser.openBrowserAsync(SITE_URL)} />
        <Divider />
        <Row icon="mail-outline" label="Email Vaibhav" onPress={() => Linking.openURL('mailto:contact@vaibhavpasi.online')} />
        <Divider />
        <Row icon="logo-whatsapp" label="WhatsApp" onPress={() => Linking.openURL('https://wa.me/918826406545')} />
        <Divider />
        <Row icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} />
      </Card>

      {isAdmin ? (
        <Button label="Creator dashboard" icon="speedometer-outline" onPress={() => router.push('/admin')} />
      ) : (
        <Pressable accessibilityRole="button" onPress={() => router.push('/login')} style={{ alignSelf: 'center', padding: space.sm }}>
          <Text variant="caption" tone="muted">
            Admin sign in
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
