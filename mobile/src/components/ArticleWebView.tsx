import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useRef } from 'react';
import { Linking } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { SITE_URL } from '@/lib/config';
import { useTheme } from '@/lib/theme';

// Renders a full article document. Links to other articles open in the app; everything else
// opens in the in-app browser. The page itself can never navigate away.
export function ArticleWebView({ html }: { html: string }) {
  const t = useTheme();
  const loaded = useRef(false);

  const onNavigate = (req: WebViewNavigation) => {
    if (!loaded.current || req.url === 'about:blank' || req.url.startsWith(`${SITE_URL}/#`) || req.url === `${SITE_URL}/`) {
      return true; // the initial document load
    }
    const article = req.url.match(/^https?:\/\/(?:www\.)?vaibhavpasi\.online\/blog\/([a-z0-9-]+)\/?(?:[?#].*)?$/);
    if (article) {
      router.push({ pathname: '/blog/[slug]', params: { slug: article[1] } });
    } else if (/^https?:/.test(req.url)) {
      WebBrowser.openBrowserAsync(req.url).catch(() => Linking.openURL(req.url));
    } else if (/^(mailto|tel):/.test(req.url)) {
      Linking.openURL(req.url).catch(() => undefined);
    }
    return false;
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html, baseUrl: `${SITE_URL}/` }}
      style={{ flex: 1, backgroundColor: t.background }}
      containerStyle={{ backgroundColor: t.background }}
      onLoadEnd={() => {
        loaded.current = true;
      }}
      onShouldStartLoadWithRequest={onNavigate}
      setSupportMultipleWindows={false}
      javaScriptEnabled={false}
      allowsLinkPreview={false}
      decelerationRate="normal"
      showsVerticalScrollIndicator
    />
  );
}
