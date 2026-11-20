import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { KEYS, readJson, writeJson } from './storage';

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  // Article text size, as a multiplier of the default
  textScale: number;
  newArticleAlerts: boolean;
  draftReminders: boolean;
}

const DEFAULTS: Settings = { theme: 'system', textScale: 1, newArticleAlerts: false, draftReminders: true };

interface SettingsValue {
  settings: Settings;
  loaded: boolean;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsValue>({ settings: DEFAULTS, loaded: false, update: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readJson<Partial<Settings>>(KEYS.settings, {}).then((saved) => {
      setSettings({ ...DEFAULTS, ...saved });
      setLoaded(true);
    });
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeJson(KEYS.settings, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, loaded, update }), [settings, loaded, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
