# Vaibhav Pasi App: Setup, Builds & Release

How to switch on the app's backend features, build it for Android and iOS, and ship updates.
Architecture and design decisions: [ARCHITECTURE.md](ARCHITECTURE.md).

## 0. What you need

| For | Account | Cost |
|---|---|---|
| Builds, push notifications, updates | [Expo](https://expo.dev/signup) (EAS) | Free tier is enough to start |
| Google Play | [Play Console](https://play.google.com/console) | US$25 once |
| App Store | [Apple Developer Program](https://developer.apple.com/programs/) | US$99 / year |

You don't need a Mac or Android Studio: EAS builds in the cloud.

## 1. Website (one time)

These ship with the website. Deploy the site as usual (push to `main`) and then:

1. **Feed:** after the deploy, open `https://www.vaibhavpasi.online/feed/posts.json`. It should list your published articles. The app reads only this.
2. **Admin login:** the app uses the same `ADMIN_PASSWORD` and `GITHUB_TOKEN` you already set for `/admin`. Nothing new to configure.
3. **Analytics + push subscribers (optional but recommended):**
   - Supabase → SQL Editor → run [`supabase.sql`](supabase.sql). It creates `article_events`, `article_stats` and `push_tokens`, locked to the server.
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already in Vercel for leads. No change needed.
   - Without this, the app still works. The dashboard shows "–" for views and pushes are skipped.
4. **Scheduled publishing + "new article" pushes:** GitHub → repo → Settings → Secrets and variables → Actions → add
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (same values as Vercel). The workflows are in `.github/workflows/`:
   - `blog-schedule.yml` runs every 15 minutes and releases due posts. GitHub may delay scheduled runs, so a post goes live within ~20 minutes of its time.
   - `blog-notify.yml` runs when an article goes live, waits until it's on the website, then notifies app readers.
   - If `main` is a protected branch, allow GitHub Actions to push to it (Settings → Branches), or scheduled posts can't be released.

## 2. App: first-time setup

```bash
cd mobile
npm install
npx eas-cli@latest login
npx eas-cli@latest init          # creates the EAS project and writes its projectId into app.json
```

Check `app.json → expo.extra.eas.projectId` is now filled in. Push notifications need it.

Push credentials:
- **Android:** create a Firebase project, add an Android app with package `online.vaibhavpasi.app`, then upload the FCM V1
  service-account key: `npx eas-cli@latest credentials` → Android → Push Notifications. ([Expo guide](https://docs.expo.dev/push-notifications/fcm-credentials/))
- **iOS:** EAS creates the push key for you during the first iOS build (answer "yes" when asked).

## 3. Run it on your phone (development build)

The editor uses native code, so the app runs in a **development build**, not Expo Go.

```bash
npx eas-cli@latest build --profile development --platform android   # installable APK
npx expo start                                                     # then open the dev build and scan the QR code
```

To use your laptop's copy of the website instead of the live one, run `npm run dev` in the repo root and start the app with
`EXPO_PUBLIC_SITE_URL=http://<your-laptop-ip>:3000 npx expo start`.

## 4. Android test build (APK)

```bash
npm run build:android:preview      # = eas build -p android --profile preview
```

EAS prints a link and QR code. Open it on any Android phone to install. Share the link with testers.

## 5. Store builds

```bash
npm run build:android:production   # .aab for Google Play
npm run build:ios:production       # .ipa for the App Store (EAS sets up signing)
npx eas-cli@latest submit -p android --latest
npx eas-cli@latest submit -p ios --latest
```

Version numbers increase automatically (`autoIncrement` in `eas.json`). Change the user-facing version in
`app.json → expo.version` for each store release.

Store listing checklist:
- Privacy policy URL: `https://www.vaibhavpasi.online/privacy`. Add a line that the app stores bookmarks on the device and
  counts article views and shares anonymously.
- Data safety / App Privacy: no account for readers. Collected: anonymous usage (views, shares) and a push token if the reader opts in.
- Screenshots: Home, an article, Explore, and the editor.

## 6. Updating the app later

- **JavaScript-only changes** (screens, text, styles): `npx eas-cli@latest update --channel production`. Phones get it on next launch, with no store review.
- **New native packages or `app.json` plugin changes:** a new store build (step 5).

## 7. Environment

| Where | Variable | Purpose |
|---|---|---|
| `mobile/app.json` | `expo.extra.siteUrl` | The website the app talks to. Default `https://www.vaibhavpasi.online` |
| local shell | `EXPO_PUBLIC_SITE_URL` | Overrides the site URL for testing |
| Vercel | `ADMIN_PASSWORD`, `GITHUB_TOKEN` | Already set. Changing the password signs out the app too |
| Vercel | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Views and shares, push subscribers |
| GitHub Actions | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Sending pushes from the workflows |

The app contains no secrets. The service-role key and GitHub token stay on Vercel and in GitHub.

## 8. Test checklist (run on a real Android and iPhone before each store release)

Reader
- [ ] Home loads; pull to refresh; airplane mode shows the last loaded articles
- [ ] Article opens; images, quotes, lists and captions render; links to other articles open in the app
- [ ] Bookmark from a card and from an article; it appears in Saved and survives an app restart
- [ ] Search by title word, by tag, and with a topic chip
- [ ] Share to WhatsApp and LinkedIn
- [ ] Settings: light, dark and automatic theme; text size changes the article

Admin
- [ ] Sign in with the admin password; a wrong password shows an error
- [ ] New article: title, H1–H3, bold, italic, underline, lists, quote, link (add, edit, remove)
- [ ] Insert 2–3 photos at once; add alt text and captions in Images; preview shows captions
- [ ] Kill the app mid-article and reopen the editor: work is restored
- [ ] Save draft: not on the website; draft reminder arrives next day (or check it's scheduled)
- [ ] Publish: notification on the phone; live on the website and in the app within ~1–2 minutes
- [ ] Schedule 30 minutes ahead: shows "Scheduled" in the dashboard and on `/admin`; goes live after the time; readers get a push
- [ ] Edit a published article from the web `/admin`, then from the app: both editors open it cleanly
- [ ] Feature / unfeature, unpublish, delete (with confirmation) from the dashboard
- [ ] Sign out; the admin screens are no longer reachable
