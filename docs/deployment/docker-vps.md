# Docker / VPS recipe

Ten wariant jest rekomendowaną ścieżką full-stack dla obecnego monorepo.

## Co uruchamiasz

- `apps/web` jako Node server z `@astrojs/node`
- `apps/cms` jako Strapi 5
- PostgreSQL 16
- trwały storage dla uploadów Strapi

## Minimalna architektura

- reverse proxy: Nginx / Caddy / Traefik
- web: osobny proces Node
- cms: osobny proces Node
- database: PostgreSQL
- uploads: wolumen lub katalog persistent mount

## Wymagane zmienne środowiskowe

### Web

- `WEB_PUBLIC_SITE_URL`
- `WEB_PUBLIC_CMS_URL`
- `WEB_CMS_API_URL`
- `WEB_CMS_API_TOKEN`
- `WEB_CMS_LOCALE`
- `WEB_CMS_CONTENT_STATUS`
- `WEB_PREVIEW_SECRET`
- `WEB_PREVIEW_TOKEN_TTL_SECONDS`

### CMS

- `CMS_HOST`
- `CMS_PORT`
- `CMS_PUBLIC_URL`
- `CMS_CLIENT_URL`
- `CMS_APP_KEYS`
- `CMS_API_TOKEN_SALT`
- `CMS_ADMIN_JWT_SECRET`
- `CMS_TRANSFER_TOKEN_SALT`
- `CMS_JWT_SECRET`
- `CMS_ENCRYPTION_KEY`
- `CMS_DEFAULT_LOCALE`
- `CMS_AVAILABLE_LOCALES`
- `CMS_PREVIEW_SECRET`
- `CMS_PREVIEW_TOKEN_TTL_SECONDS`
- `CMS_DATABASE_*`

### Shared constraints

- `WEB_PREVIEW_SECRET` i `CMS_PREVIEW_SECRET` muszą mieć identyczną wartość.
- `CMS_CLIENT_URL` powinien wskazywać publiczny URL weba.
- `CMS_PUBLIC_URL` powinien wskazywać publiczny URL Strapi.

## Build i start

Zakładamy, że build robisz z roota repo.

```text
bun install
npm --prefix apps/cms install --workspaces=false
bun run check
```

### Web

```text
bun run build:web
node apps/web/dist/server/entry.mjs
```

### CMS

```text
npm --prefix apps/cms run build
npm --prefix apps/cms run start
```

## PostgreSQL

Obecny `docker-compose.yml` w repo uruchamia tylko PostgreSQL i nadaje się jako baseline dla lokalnego lub prostego VPS setupu.

```text
docker compose up -d
```

## Uploads i trwałość danych

Musisz zapewnić persistence dla:

- bazy PostgreSQL
- `apps/cms/public/uploads`

Na VPS najprostsza ścieżka to bind mount lub volume dla uploadów. Bez tego media wrócą do stanu „po deployu zniknęły i nikt nic nie wie”.

## Reverse proxy

Przykładowy split originów:

- web: `https://example.com`
- cms: `https://cms.example.com`

Wtedy ustaw:

- `WEB_PUBLIC_SITE_URL=https://example.com`
- `WEB_PUBLIC_CMS_URL=https://cms.example.com`
- `WEB_CMS_API_URL=https://cms.example.com/api`
- `CMS_PUBLIC_URL=https://cms.example.com`
- `CMS_CLIENT_URL=https://example.com`

## Preview mode w produkcji

1. web i cms muszą dzielić ten sam preview secret
2. web musi mieć serwerowy dostęp do draft fetch przez `WEB_CMS_API_TOKEN`
3. CMS generuje preview URL przez `GET /api/pages/preview-url`
4. web ustawia signed cookie preview na `/api/preview`

## Smoke checklist

- `/` renderuje `pl`
- `/en` renderuje `en`
- `https://cms.../admin` działa poprawnie
- `GET /api/pages/preview-url?slug=home&locale=en` zwraca URL preview
- wejście w preview pokazuje banner i draft content
- wyjście z preview wraca do published content