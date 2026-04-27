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

## Deployment docs

- `docs/deployment/docker-vps.md` — pełny stack na VPS / Docker / klasycznym hostingu Node
- `docs/deployment/vercel-split.md` — split deployment: `apps/web` na Vercel, `apps/cms` osobno

## Co już jest w starterze

- landing page gotowy pod zasilenie treścią z CMS
- zwykłe podstrony z modelu `page` renderowane automatycznie pod `/:slug` i `/en/:slug`
- foundation blokowego page buildera w Strapi przez `dynamic zones`
- blok pricing grid do pokazywania pakietów, progów wejścia i zakresów MVP
- blok logo cloud do szybkiego pokazania partnerów, klientów lub marek zaufania
- blok testimonials do social proof na stronach ofertowych i usługowych
- blok FAQ do domykania pytań i obiekcji na stronach usługowych
- kontaktowy blok page buildera z webhookowym submit flow po stronie `apps/web`
- SEO starter (`meta`, `Open Graph`, `sitemap`, `robots.txt`)
- fallback content w warstwie SDK/CMS, a web nie zależy twardo od działającego CMS
- modele Strapi dla global settings i pages
- bootstrap seed dla `global` i strony `home` w `pl` oraz `en`
- podstawowy routing locale: `/` dla `pl` i `/en` dla `en`
- preview mode z podpisanym URL-em wejściowym i ciasteczkiem sesji po stronie web
- `packages/ui` z pierwszym zestawem współdzielonych tokenów i klas dla shelli, surface'ów i buttonów
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

## Locale routing

- `pl` jest locale domyślnym i renderuje się pod `/`
- `en` renderuje się pod `/en`
- przełącznik języka bazuje na aktualnej ścieżce i zachowuje odpowiadający wariant locale

## Dynamic pages

- wpis `page` ze slugiem `home` pozostaje homepage pod `/` oraz `/en`
- każdy inny wpis `page` renderuje się automatycznie jako zwykła podstrona
- starter seeduje przykładowe strony:
   - `pl`: `/oferta`
   - `en`: `/en/services`
- page-level SEO z CMS nadpisuje meta description / image / noindex na poziomie konkretnej podstrony

## Page builder blocks

- model `page` ma teraz pole `contentBlocks` jako `dynamic zone`
- pierwszy zestaw bloków obejmuje:
   - `sections.rich-text`
   - `sections.feature-grid`
   - `sections.pricing-grid`
   - `sections.logo-cloud`
   - `sections.testimonials`
   - `sections.faq`
   - `sections.cta-band`
   - `sections.contact-form`
- jeśli `contentBlocks` są obecne, frontend renderuje je wspólnym rendererem zamiast legacy `highlights` / `featureItems`
- obecne pola hero/CTA pozostają wspierane, więc to jest rozszerzenie addytywne, a nie bolesny rewrite

## Pricing grid block

- blok `sections.pricing-grid` renderuje karty pakietów / planów bez dodatkowej hydracji JavaScript
- schema opiera się o repeatowalne `shared.pricing-plan` i zagnieżdżone `shared.pricing-feature-item`, więc możesz modelować cenę, opis, listę cech, wyróżnienie planu i CTA
- starter seeduje demonstracyjny pricing grid na stronach `/oferta` oraz `/en/services`, więc blok od razu działa we wspólnym rendererze page buildera

## Testimonials block

- blok `sections.testimonials` renderuje karty opinii bez dodatkowej hydracji
- schema opiera się o repeatowalne `shared.testimonial-item`, więc możesz łatwo zarządzać cytatem, autorem, rolą i firmą
- starter seeduje przykładowe testimonials na stronach `/oferta` oraz `/en/services`
- domyślne seedy są demonstracyjne, więc w realnym projekcie warto je podmienić na prawdziwe referencje klienta

## Logo cloud block

- blok `sections.logo-cloud` renderuje siatkę marek / partnerów bez dodatkowej hydracji JavaScript
- schema opiera się o repeatowalne `shared.logo-item`, gdzie możesz zacząć od samej nazwy marki, a później dołączyć prawdziwy logotyp z media library Strapi
- starter seeduje demonstracyjny logo cloud na stronach `/oferta` oraz `/en/services`, więc nowy blok od razu wpada do wspólnego renderera page buildera

## FAQ block

- blok `sections.faq` renderuje akordeon FAQ bez dodatkowej hydracji JavaScript
- schema bloku opiera się o repeatowalne `shared.faq-item`, więc pytania i odpowiedzi są łatwe do seedowania i lokalizacji
- starter seeduje przykładowy FAQ na stronach `/oferta` oraz `/en/services`

## Contact flow

- blok `sections.contact-form` renderuje Astro-first formularz kontaktowy na stronach z modelu `page`
- frontend wysyła `POST` do `apps/web/src/pages/api/contact.json.ts`
- endpoint waliduje payload, stosuje prosty rate limiting per IP i dostarcza zgłoszenie do jednego lub wielu providerów
- obecnie wspierane ścieżki dostawy:
   - podpisany webhook (`CONTACT_WEBHOOK_URL` / `WEB_CONTACT_WEBHOOK_URL`) — zgodność wsteczna z dotychczasowym flow
   - dodatkowy webhook CRM (`CONTACT_CRM_WEBHOOK_URL`) — np. pod automatyzację CRM / Make / n8n / custom backend
   - email provider przez Resend (`CONTACT_RESEND_*`) — szybki fallback lub równoległa dostawa leada na skrzynkę
- jeśli provider zwróci błąd retryable (np. timeout / `429` / `5xx`), web app może zapisać osobny job do file-based retry queue i ponawiać dostawę później
- manualny flush i podgląd kolejki są dostępne pod `apps/web/src/pages/api/contact-queue.json.ts`, zabezpieczone sekretem kolejki
- kontrakt podpisanego webhooka pozostał zgodny wstecznie:
   - headers:
      - `x-website-template-signature`
      - `x-website-template-signature-algorithm`
      - `x-website-template-message-id`
      - `x-website-template-timestamp`
      - `x-website-template-provider-id`
   - body:
      - `messageId`
      - `timestamp`
      - `source`
      - `payload` z polami `name`, `email`, `subject`, `message`, opcjonalnym `phone` i `locale`

### Kontaktowe env-y

- `WEB_CONTACT_ENABLED` — włącza submit flow po stronie web
- `WEB_CONTACT_WEBHOOK_URL` / `WEB_CONTACT_WEBHOOK_SECRET` — główny podpisany webhook
- `WEB_CONTACT_CRM_WEBHOOK_URL` / `WEB_CONTACT_CRM_WEBHOOK_SECRET` — opcjonalny drugi webhook pod CRM / automatyzacje
- `WEB_CONTACT_RESEND_API_KEY` / `WEB_CONTACT_RESEND_FROM_EMAIL` / `WEB_CONTACT_RESEND_TO_EMAIL` — opcjonalna dostawa email przez Resend
- `WEB_CONTACT_RESEND_REPLY_TO_EMAIL` — opcjonalny reply-to; gdy go nie ustawisz, użyty zostanie email nadawcy z formularza
- `WEB_CONTACT_QUEUE_ENABLED` — włącza file-based retry queue dla błędów retryable
- `WEB_CONTACT_QUEUE_DIRECTORY` — katalog na joby kolejki; domyślnie `.contact-queue`
- `WEB_CONTACT_QUEUE_SECRET` — sekret do ręcznego statusu / flushu kolejki przez `GET`/`POST /api/contact-queue.json`
- `WEB_CONTACT_QUEUE_MAX_ATTEMPTS` — maksymalna liczba prób dostawy jednego joba
- `WEB_CONTACT_QUEUE_RETRY_BASE_DELAY_MS` — bazowe opóźnienie retry z backoffem wykładniczym
- `WEB_CONTACT_QUEUE_PROCESS_LIMIT` — ile due jobów przetworzyć podczas jednego flushu
- `WEB_CONTACT_RATE_LIMIT_WINDOW_MS` — okno rate limiting w ms
- `WEB_CONTACT_RATE_LIMIT_MAX_REQUESTS` — maksymalna liczba prób w oknie

W `apps/web/.env.example` dostępne są także aliasy bez prefiksu `WEB_` (`CONTACT_*`), zgodne z obecną konwencją fallbacków w web app.

### Retry queue — uwagi operacyjne

- obecna kolejka jest **file-based** i najlepiej pasuje do baseline'u Node / VPS / Docker z trwałym dyskiem
- przy deploymentach efemerycznych warto później podmienić ją na Redis / SQS / kolejkę platformową zamiast polegać na lokalnym filesystemie
- każdy nowy submit próbuje najpierw opróżnić zaległą kolejkę, a dodatkowo możesz ręcznie sprawdzić status (`GET`) lub wymusić flush (`POST`) pod `/api/contact-queue.json`

## Preview mode

1. Ustaw **ten sam sekret** w:
   - `CMS_PREVIEW_SECRET`
   - `WEB_PREVIEW_SECRET`
2. Upewnij się, że web ma serwerowy dostęp do CMS przez `CMS_API_TOKEN` lub `WEB_CMS_API_TOKEN`.
3. Wygeneruj URL preview z CMS:
   - endpoint: `GET /api/pages/preview-url?slug=home&locale=pl`
   - wymagany header: `x-preview-secret: <CMS_PREVIEW_SECRET>`
4. Otwórz zwrócony URL w przeglądarce — web ustawi bezpieczne ciasteczko sesji preview i przekieruje na odpowiednią stronę.
5. Wyjdź z preview z bannera na stronie lub przez `/api/exit-preview`.

### Przykład wywołania preview URL

- `http://localhost:1338/api/pages/preview-url?slug=home&locale=en`
- header `x-preview-secret` musi mieć tę samą wartość, co sekret preview ustawiony po stronie CMS

## Uwagi architektoniczne

- `apps/cms` nie jest zarządzane przez Bun workspaces celowo — oficjalna ścieżka Strapi działa stabilniej przez `npm`, a root dalej zachowuje Bun jako główny toolchain.
- Frontend korzysta z `packages/cms-sdk`, więc mapowanie odpowiedzi z CMS nie jest rozsypane po komponentach.
- Hybrid rendering jest gotowy przez adapter Node i endpoint `apps/web/src/pages/api/cms-status.json.ts`.
- `apps/web` używa lokalnego wrappera `node ./scripts/dev.mjs` dla developmentu, bo moduł `astro/dist/cli/dev/index.js` w tej instalacji był uszkodzony przez hook narzędziowy i powodował błąd `dev is not a function`.
- `apps/cms` domyślnie startuje w trybie `strapi develop --no-watch-admin`, bo to stabilniejsza opcja na Windows/OneDrive niż pełny watch mode admina; jeśli potrzebujesz hot-reload admina, użyj `npm --prefix apps/cms run develop:watch-admin`.

## Następne rozszerzenia

- kolejne bloki page buildera (np. stats strip / comparison table)
- durable queue backend dla contact flow (np. Redis / SQS)
- storage provider dla assetów Strapi (np. S3 / R2)
