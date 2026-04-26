# Deployment recipes

- `docker-vps.md` — kanoniczna ścieżka full-stack dla `apps/web` + `apps/cms` + PostgreSQL
- `vercel-split.md` — split deployment: `apps/web` na Vercel, `apps/cms` na hostingu Node + PostgreSQL

## Wspólne zasady

- `apps/web` używa adaptera `@astrojs/node` i to jest aktualny baseline wykonawczy repo.
- Preview mode wymaga **tego samego sekretu** po stronie web i CMS:
  - `WEB_PREVIEW_SECRET`
  - `CMS_PREVIEW_SECRET`
- i18n dla M1 zakłada:
  - `pl` na `/`
  - `en` na `/en`
- CMS uploads wymagają trwałego storage; lokalny folder `apps/cms/public/uploads` nie może być traktowany jako trwały dysk na platformach efemerycznych.