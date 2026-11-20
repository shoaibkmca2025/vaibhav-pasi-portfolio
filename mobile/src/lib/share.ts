import { Linking, Share } from 'react-native';
import { publicApi } from './api';

export type ShareTarget = 'system' | 'whatsapp' | 'linkedin' | 'x' | 'copy';

interface Shareable {
  slug: string;
  title: string;
  url: string;
}

export async function shareArticle(article: Shareable, target: ShareTarget = 'system') {
  const text = `${article.title}\n${article.url}`;
  const encoded = encodeURIComponent(article.url);
  try {
    if (target === 'whatsapp') {
      const app = `whatsapp://send?text=${encodeURIComponent(text)}`;
      const web = `https://wa.me/?text=${encodeURIComponent(text)}`;
      await Linking.openURL((await Linking.canOpenURL(app)) ? app : web);
    } else if (target === 'linkedin') {
      await Linking.openURL(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`);
    } else if (target === 'x') {
      await Linking.openURL(`https://x.com/intent/post?text=${encodeURIComponent(article.title)}&url=${encoded}`);
    } else {
      const result = await Share.share({ title: article.title, message: text, url: article.url });
      if (result.action !== Share.sharedAction) return;
    }
    publicApi.track(article.slug, 'share');
  } catch {
    // the user closed the sheet or no app could handle it: nothing to report
  }
}
