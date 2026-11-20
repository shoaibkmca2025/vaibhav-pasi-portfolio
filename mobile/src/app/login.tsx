import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { Button, Text } from '@/components/ui';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { fonts, radius, space, useTheme } from '@/lib/theme';

export default function LoginScreen() {
  const t = useTheme();
  const { signIn } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!password) return;
    setBusy(true);
    setError('');
    try {
      await signIn(password);
      router.replace('/admin');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: space.xl, gap: space.lg, justifyContent: 'center' }}>
        <Text variant="title">Creator dashboard</Text>
        <Text tone="secondary">Sign in with the same admin password you use at vaibhavpasi.online/admin.</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={submit}
          placeholder="Admin password"
          placeholderTextColor={t.muted}
          secureTextEntry
          autoFocus
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          accessibilityLabel="Admin password"
          style={{
            fontFamily: fonts.regular,
            fontSize: 17,
            color: t.text,
            backgroundColor: t.surfaceAlt,
            borderRadius: radius.md,
            paddingHorizontal: space.lg,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: error ? t.danger : 'transparent',
          }}
        />
        {error ? (
          <Text tone="danger" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
        <Button label="Sign in" icon="lock-closed-outline" busy={busy} disabled={!password} onPress={submit} />
      </View>
    </KeyboardAvoidingView>
  );
}
