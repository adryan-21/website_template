# Vercel split deployment recipe

Ten wariant jest przeznaczony dla sytuacji, w której:

- `apps/web` ląduje na Vercel
- `apps/cms` działa osobno na hostingu z Node.js oraz PostgreSQL

To **nie** jest wariant „cały stack na Vercel”. Obecny CMS potrzebuje środowiska Node i trwałego storage dla uploadów.

## Co deployujesz gdzie

### Vercel

- tylko `apps/web`

### Zewnętrzny hosting Node/VPS/Render/Railway/Fly.io/etc.

- `apps/cms`
- PostgreSQL
- persistent uploads storage

## Wymagane env dla weba na Vercel

- `WEB_PUBLIC_SITE_URL`
- `WEB_PUBLIC_CMS_URL`
- `WEB_CMS_API_URL`
- `WEB_CMS_API_TOKEN`
- `WEB_CMS_LOCALE=pl`
- `WEB_CMS_CONTENT_STATUS=published`
- `WEB_PREVIEW_SECRET`
- `WEB_PREVIEW_TOKEN_TTL_SECONDS`

## Wymagane env dla CMS

- cały zestaw `CMS_*`
- `CMS_PUBLIC_URL`
- `CMS_CLIENT_URL` ustawione na publiczny URL Vercel weba
- `CMS_PREVIEW_SECRET` identyczny jak `WEB_PREVIEW_SECRET`

## Build weba

Vercel powinien budować repo z roota, ale aplikację web wskazujesz jako projekt oparty o `apps/web`.

Rekomendowany flow walidacyjny przed deployem:

```text
bun install
npm --prefix apps/cms install --workspaces=false
bun run check
```

## Ustawienia projektu web na Vercel

- Root Directory: `apps/web`
- Install command: `bun install`
- Build command: `bun run build`
- Output: zgodnie z adapterem Node i buildem Astro w projekcie

Jeśli konfigurujesz build z roota monorepo zamiast `apps/web`, pilnuj, żeby workspace dependencies (`@website-template/cms-sdk`, `@website-template/ui`) były dostępne w czasie buildu.

## CMS hosting

CMS deployuj jako klasyczny Node service:

```text
npm install --workspaces=false
npm run build
npm run start
```

## Preview mode przy split deployu

To jest najważniejszy kawałek układanki.

1. CMS generuje preview URL na swoim originie przez `GET /api/pages/preview-url`
2. URL wskazuje na Vercel web: `/api/preview?token=...`
3. Vercel web weryfikuje token tym samym sekretem i ustawia preview cookie
4. draft fetch wykonuje się serwerowo z Vercel do `WEB_CMS_API_URL`

To oznacza, że:

- preview secret musi być wspólny dla obu usług
- `WEB_CMS_API_TOKEN` musi mieć dostęp do potrzebnych treści draft
- CORS i public URLs po stronie CMS muszą wskazywać web origin z Vercel

## O czym nie zapomnieć

- uploads Strapi nie mogą siedzieć na efemerycznym filesystemie hostingu CMS
- `CMS_CLIENT_URL` musi wskazywać dokładnie URL weba na Vercel
- `WEB_PUBLIC_CMS_URL` i `WEB_CMS_API_URL` muszą wskazywać publiczny origin CMS
- po każdej zmianie preview secret trzeba zaktualizować oba deploymenty naraz

## Smoke checklist

- `/` i `/en` działają na domenie Vercel
- CMS health endpoint na webie widzi zewnętrzny CMS
- preview URL wygenerowany przez CMS otwiera draft na domenie Vercel
- wyjście z preview czyści cookie i wraca do published