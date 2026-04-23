# Website Template — Astro + Vue + Strapi + Bun

Starter monorepo pod landing page i proste strony marketingowe.

## Stack

- `apps/web` — Astro + Vue + Node adapter + sitemap
- `apps/cms` — Strapi 5 + PostgreSQL
- `packages/cms-sdk` — wspólne typy i klient CMS dla frontendu
- `docker-compose.yml` — lokalny PostgreSQL
- `Bun` — główny toolchain repo dla root/web/sdk
- `npm` w `apps/cms` — stabilny fallback dla oficjalnej ścieżki Strapi

## Struktura repo

- `apps/web` — frontend Astro z landing page i endpointem statusu CMS
- `apps/cms` — headless CMS z modelami `global` i `page`
- `packages/cms-sdk` — kontrakty i fallback content dla integracji web ↔ CMS

## Wymagania

- Bun `1.3.13+`
- Node.js `24.x`
- Docker Desktop lub lokalny PostgreSQL

## Szybki start

1. Skopiuj lub uzupełnij env-y:
   - root: `.env`
   - web: `apps/web/.env`
   - cms: `apps/cms/.env`
2. Uruchom bazę danych z roota:
   - `docker compose up -d`
3. Zainstaluj zależności CMS:
   - `npm --prefix apps/cms install --workspaces=false`
4. Zainstaluj zależności workspace Bun:
   - `bun install`
5. Odpal development:
   - `bun run dev`

## Najważniejsze skrypty

- `bun run dev` — uruchamia Astro i Strapi równolegle
- `bun run dev:web` — uruchamia tylko frontend
- `bun run dev:cms` — uruchamia tylko CMS
- `bun run install:cms` — instaluje zależności Strapi poza Bun workspaces
- `bun run typecheck` — sprawdza SDK i frontend
- `bun run build` — buduje SDK, frontend i CMS
- `bun run check` — lint + typecheck + build

## Co już jest w starterze

- landing page gotowy pod zasilenie treścią z CMS
- SEO starter (`meta`, `Open Graph`, `sitemap`, `robots.txt`)
- fallback content w warstwie SDK/CMS, a web nie zależy twardo od działającego CMS
- modele Strapi dla global settings i pages
- PostgreSQL przez Docker Compose
- podstawowe CI pod GitHub Actions
- ESLint + Prettier na poziomie repo

## Jak spiąć frontend z prawdziwą treścią

1. Uruchom `apps/cms`.
2. Wejdź na `http://localhost:1338/admin` i utwórz konto admina.
3. W Content-Type Builder / Content Manager przygotuj wpisy:
   - `Global Settings`
   - `Page` ze slugiem `home`
4. W `Settings -> Users & Permissions -> Roles -> Public` włącz odczyt (`find`, `findOne`) dla:
   - `global`
   - `page`
5. Jeśli używasz tokenu API, ustaw `CMS_API_TOKEN` w `apps/web/.env`.

## Uwagi architektoniczne

- `apps/cms` nie jest zarządzane przez Bun workspaces celowo — oficjalna ścieżka Strapi działa stabilniej przez `npm`, a root dalej zachowuje Bun jako główny toolchain.
- Frontend korzysta z `packages/cms-sdk`, więc mapowanie odpowiedzi z CMS nie jest rozsypane po komponentach.
- Hybrid rendering jest gotowy przez adapter Node i endpoint `apps/web/src/pages/api/cms-status.json.ts`.
- `apps/web` używa lokalnego wrappera `node ./scripts/dev.mjs` dla developmentu, bo moduł `astro/dist/cli/dev/index.js` w tej instalacji był uszkodzony przez hook narzędziowy i powodował błąd `dev is not a function`.
- `apps/cms` domyślnie startuje w trybie `strapi develop --no-watch-admin`, bo to stabilniejsza opcja na Windows/OneDrive niż pełny watch mode admina; jeśli potrzebujesz hot-reload admina, użyj `npm --prefix apps/cms run develop:watch-admin`.

## Następne rozszerzenia

- seed danych do Strapi
- preview mode
- i18n
- `packages/ui` dla wspólnego design systemu
- dedykowane deployment recipe pod Vercel / VPS / kontenery
