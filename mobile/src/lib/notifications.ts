// Two kinds of notification:
//  - Reader push ("new article"), sent by the website's GitHub Action through Expo's push service.
//    The device registers its Expo push token with /api/app.
//  - Local, on the admin's phone: published, scheduled-time reminder, draft reminders.
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// Named import: eslint-plugin-import can't follow the namespace's `export *` re-exports
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { publicApi } from './api';
import { EAS_PROJECT_ID } from './config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function setUpChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('articles', {
    name: 'New articles',
    importance: AndroidImportance.DEFAULT,
  });
  await Notifications.setNotificationChannelAsync('publishing', {
    name: 'Publishing (admin)',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export type PushResult = 'enabled' | 'denied' | 'unsupported' | 'not-configured' | 'failed';

// Subscribes this device to "new article" pushes
export async function enableArticlePush(): Promise<PushResult> {
  if (!Device.isDevice) return 'unsupported';
  if (!EAS_PROJECT_ID) return 'not-configured';
  if (!(await ensurePermission())) return 'denied';
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });
    await publicApi.registerPush(data, Platform.OS);
    return 'enabled';
  } catch (e) {
    console.warn('Push registration failed', e);
    return 'failed';
  }
}

export async function disableArticlePush() {
  if (!Device.isDevice || !EAS_PROJECT_ID) return;
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });
    await publicApi.unregisterPush(data);
  } catch (e) {
    console.warn('Push unregistration failed', e);
  }
}

async function notifyNow(title: string, body: string, data: Record<string, string> = {}) {
  if (!(await ensurePermission())) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: Platform.OS === 'android' ? { channelId: 'publishing' } : null,
  });
}

const reminderId = (kind: 'scheduled' | 'draft', slug: string) => `${kind}:${slug}`;

async function cancel(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined);
}

async function notifyAt(id: string, date: Date, title: string, body: string, data: Record<string, string>) {
  if (date.getTime() <= Date.now() || !(await ensurePermission())) return;
  await cancel(id);
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, data },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: 'publishing' },
  });
}

export const adminNotifications = {
  published: (title: string, slug: string) =>
    notifyNow('Published', `"${title}" is live on the website and in the app in about a minute.`, { slug }),

  scheduled: async (title: string, slug: string, publishAt: Date) => {
    await notifyNow('Scheduled', `"${title}" will publish ${publishAt.toLocaleString()}.`, { slug, admin: '1' });
    await notifyAt(reminderId('scheduled', slug), publishAt, 'Going live now', `"${title}" is being published.`, { slug });
  },

  // One reminder per draft, a day after the last edit; editing again pushes it back
  draftSaved: (title: string, slug: string, enabled: boolean) =>
    enabled
      ? notifyAt(
          reminderId('draft', slug),
          new Date(Date.now() + 24 * 60 * 60 * 1000),
          'Your draft is waiting',
          `Pick up "${title || 'your draft'}" where you left off.`,
          { slug, admin: '1', draft: '1' },
        )
      : Promise.resolve(),

  clear: async (slug: string) => {
    await cancel(reminderId('draft', slug));
    await cancel(reminderId('scheduled', slug));
  },
};
