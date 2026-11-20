// Brand tokens, taken from the website (src/index.css) so the app and site feel like one product.
// Dark: navy page, gold accent. Light: soft white page, blue accent for text, gold for solid fills.
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from './settings';

export interface Palette {
  scheme: 'dark' | 'light';
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  muted: string;
  border: string;
  accent: string;
  brand: string;
  onBrand: string;
  danger: string;
  success: string;
  overlay: string;
}

export const palettes: Record<'dark' | 'light', Palette> = {
  dark: {
    scheme: 'dark',
    background: '#07131F',
    surface: '#0B2338',
    surfaceAlt: '#12304A',
    text: '#F4F8FC',
    textSecondary: '#C3D1E0',
    muted: '#93A6BB',
    border: 'rgba(244,248,252,0.12)',
    accent: '#F2BD5A',
    brand: '#E2A93B',
    onBrand: '#07131F',
    danger: '#F07A5F',
    success: '#4ADE80',
    overlay: 'rgba(0,0,0,0.6)',
  },
  light: {
    scheme: 'light',
    background: '#F4F8FC',
    surface: '#FFFFFF',
    surfaceAlt: '#E8F0F8',
    text: '#0B2338',
    textSecondary: '#1F3B57',
    muted: '#51677E',
    border: 'rgba(11,35,56,0.12)',
    accent: '#1D5FA8',
    brand: '#E2A93B',
    onBrand: '#07131F',
    danger: '#C2410C',
    success: '#15803D',
    overlay: 'rgba(7,19,31,0.45)',
  },
};

// Outfit is the website's typeface; Source Serif 4 is used only for long-form reading
export const fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  black: 'Outfit_800ExtraBold',
  serif: 'SourceSerif4_400Regular',
  serifItalic: 'SourceSerif4_400Regular_Italic',
  serifBold: 'SourceSerif4_600SemiBold',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 18, pill: 999 };

const ThemeContext = createContext<Palette>(palettes.dark);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const { settings } = useSettings();
  const scheme = settings.theme === 'system' ? (system === 'light' ? 'light' : 'dark') : settings.theme;
  const value = useMemo(() => palettes[scheme], [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
