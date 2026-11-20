# Vaibhav Pasi: mobile app

Android and iOS app for reading and publishing articles. It uses the website as its backend:
articles you publish here appear on vaibhavpasi.online, and articles from `/admin` appear here.

- Architecture: [`../docs/mobile-app/ARCHITECTURE.md`](../docs/mobile-app/ARCHITECTURE.md)
- Setup, builds and release: [`../docs/mobile-app/DEPLOYMENT.md`](../docs/mobile-app/DEPLOYMENT.md)

```bash
npm install
npx expo start            # with a development build installed on your phone (see DEPLOYMENT.md §3)
npm run typecheck
npx eslint src
```

## Layout

```
src/app/                Screens (Expo Router: every file is a route)
  (tabs)/               Home, Explore, Search, Saved, About
  blog/[slug].tsx       Article reader (same path as the website)
  category/[name].tsx   Articles in a topic
  settings.tsx, login.tsx
  admin/                Dashboard and editor (signed-in admin only)
src/components/         UI primitives, article cards, the editor's toolbar, images panel and publish sheet
src/lib/                Data and services: feed, publishing API, auth, bookmarks, notifications, images, theme
```

Keep `src/lib/blog.ts` (categories, slug rules) in sync with `shared/blog.ts` in the website.
