import AsyncStorage from '@react-native-async-storage/async-storage';

// JSON helpers over AsyncStorage. Every read tolerates missing or corrupt data, so a bad
// value can never stop the app from starting.
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not save ${key}`, e);
  }
}

export async function removeKey(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // nothing to do
  }
}

export const KEYS = {
  settings: 'vp:settings',
  bookmarks: 'vp:bookmarks',
  feedCache: 'vp:feed',
  recentSearches: 'vp:recent-searches',
  draft: (id: string) => `vp:draft:${id}`,
  pushAsked: 'vp:push-asked',
} as const;
