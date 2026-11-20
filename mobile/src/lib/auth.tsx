// Admin session. The token lives in the iOS Keychain / Android Keystore (expo-secure-store),
// never in AsyncStorage. It expires after 30 days, or immediately if ADMIN_PASSWORD changes.
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, setApiToken, setUnauthorizedHandler } from './api';

const TOKEN_KEY = 'vp_admin_token';

interface AuthValue {
  ready: boolean;
  isAdmin: boolean;
  signIn: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  ready: false,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

interface Stored {
  token: string;
  expiresAt: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const signOut = useCallback(async () => {
    setApiToken(null);
    setIsAdmin(false);
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(TOKEN_KEY);
        const stored = raw ? (JSON.parse(raw) as Stored) : null;
        if (stored && new Date(stored.expiresAt).getTime() > Date.now()) {
          setApiToken(stored.token);
          setIsAdmin(true);
        } else if (stored) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      } catch {
        // unreadable keychain entry: stay signed out
      } finally {
        setReady(true);
      }
    })();
  }, [signOut]);

  const signIn = useCallback(async (password: string) => {
    const { token, expiresAt } = await api.login(password);
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({ token, expiresAt } satisfies Stored), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    setApiToken(token);
    setIsAdmin(true);
  }, []);

  const value = useMemo(() => ({ ready, isAdmin, signIn, signOut }), [ready, isAdmin, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
