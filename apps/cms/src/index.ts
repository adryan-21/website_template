import type { Core } from '@strapi/strapi';

type LocaleDefinition = {
  code: string;
  name: string;
};

type LinkInput = {
  label: string;
  href: string;
  external?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

type SeoInput = {
  metaTitle: string;
  metaDescription: string;
  noIndex?: boolean;
};

type FeatureItemInput = {
  eyebrow?: string;
  title: string;
  body: string;
  metric?: string;
};

type PricingFeatureInput = {
  label: string;
  included?: boolean;
};

type PricingPlanInput = {
  eyebrow?: string;
  title: string;
  description?: string;
  price: string;
  billingPeriod?: string;
  featured?: boolean;
  features: PricingFeatureInput[];
  cta?: LinkInput;
};

type LogoItemInput = {
  name: string;
  href?: string;
};

type FaqItemInput = {
  question: string;
  answer: string;
};

type TestimonialItemInput = {
  quote: string;
  author: string;
  role?: string;
  company?: string;
};

type RichTextBlockInput = {
  __component: 'sections.rich-text';
  eyebrow?: string;
  title: string;
  body: string;
  align?: 'left' | 'center';
  width?: 'narrow' | 'wide';
};

type FeatureGridBlockInput = {
  __component: 'sections.feature-grid';
  eyebrow?: string;
  title: string;
  description?: string;
  columns?: '2' | '3';
  items: FeatureItemInput[];
};

type PricingGridBlockInput = {
  __component: 'sections.pricing-grid';
  eyebrow?: string;
  title: string;
  description?: string;
  columns?: '2' | '3';
  plans: PricingPlanInput[];
};

type LogoCloudBlockInput = {
  __component: 'sections.logo-cloud';
  eyebrow?: string;
  title: string;
  description?: string;
  items: LogoItemInput[];
};

type TestimonialsBlockInput = {
  __component: 'sections.testimonials';
  eyebrow?: string;
  title: string;
  description?: string;
  columns?: '2' | '3';
  items: TestimonialItemInput[];
};

type FaqBlockInput = {
  __component: 'sections.faq';
  eyebrow?: string;
  title: string;
  description?: string;
  items: FaqItemInput[];
};

type CtaBandBlockInput = {
  __component: 'sections.cta-band';
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta?: LinkInput;
  secondaryCta?: LinkInput;
};

type ContactFormBlockInput = {
  __component: 'sections.contact-form';
  eyebrow?: string;
  title: string;
  body?: string;
  nameLabel: string;
  namePlaceholder?: string;
  emailLabel: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  subjectLabel: string;
  subjectPlaceholder?: string;
  messageLabel: string;
  messagePlaceholder?: string;
  submitLabel: string;
  privacyNote?: string;
  successMessage: string;
  errorMessage: string;
};

type PageContentBlockInput =
  | RichTextBlockInput
  | FeatureGridBlockInput
  | PricingGridBlockInput
  | LogoCloudBlockInput
  | TestimonialsBlockInput
  | FaqBlockInput
  | CtaBandBlockInput
  | ContactFormBlockInput;

type GlobalSeed = {
  siteName: string;
  siteDescription: string;
  navigationLinks: LinkInput[];
  footerLinks: LinkInput[];
  socialLinks: LinkInput[];
  primaryCta: LinkInput;
  defaultSeo: SeoInput;
};

type PageSeed = {
  title: string;
  slug: string;
  description: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  highlights: string[];
  primaryCta: LinkInput;
  secondaryCta: LinkInput;
  featureItems: FeatureItemInput[];
  contentBlocks?: PageContentBlockInput[];
  seo: SeoInput;
};

type SeededDocument = {
  documentId?: string | null;
};

const localeLabels: Record<string, string> = {
  en: 'English (en)',
  pl: 'Polski (pl)',
};

const globalSeeds: Record<string, GlobalSeed> = {
  pl: {
    siteName: 'Website Template',
    siteDescription:
      'Pragmatyczny starter dla landing page i prostych stron marketingowych na Astro, Vue i Strapi.',
    navigationLinks: [
      { label: 'Start', href: '/' },
      { label: 'Oferta', href: '/oferta' },
      { label: 'Status CMS', href: '/api/cms-status.json' },
    ],
    footerLinks: [
      { label: 'Start', href: '/' },
      { label: 'Oferta', href: '/oferta' },
      { label: 'Panel CMS', href: 'http://localhost:1338/admin', external: true },
    ],
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: 'Astro', href: 'https://astro.build', external: true },
      { label: 'Strapi', href: 'https://strapi.io', external: true },
    ],
    primaryCta: {
      label: 'Otwórz CMS',
      href: 'http://localhost:1338/admin',
      external: true,
      variant: 'primary',
    },
    defaultSeo: {
      metaTitle: 'Website Template — Astro + Vue + Strapi',
      metaDescription:
        'Starter monorepo dla nowoczesnych stron, wizytówek i landing page oparty o Astro, Vue i Strapi.',
    },
  },
  en: {
    siteName: 'Website Template',
    siteDescription:
      'A pragmatic starter for landing pages and simple marketing websites built with Astro, Vue, and Strapi.',
    navigationLinks: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'CMS status', href: '/api/cms-status.json' },
    ],
    footerLinks: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'CMS admin', href: 'http://localhost:1338/admin', external: true },
    ],
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com', external: true },
      { label: 'Astro', href: 'https://astro.build', external: true },
      { label: 'Strapi', href: 'https://strapi.io', external: true },
    ],
    primaryCta: {
      label: 'Open CMS',
      href: 'http://localhost:1338/admin',
      external: true,
      variant: 'primary',
    },
    defaultSeo: {
      metaTitle: 'Website Template — Astro + Vue + Strapi',
      metaDescription:
        'A starter monorepo for modern landing pages and brochure sites powered by Astro, Vue, and Strapi.',
    },
  },
};

const homepageSeeds: Record<string, PageSeed> = {
  pl: {
    title: 'Start',
    slug: 'home',
    description: 'Strona startowa dla startera opartego o Astro, Vue i Strapi.',
    heroBadge: 'Astro + Vue + Strapi + Bun',
    heroTitle: 'Szybszy start dla stron, które mają wyglądać dobrze i rosnąć bez bólu.',
    heroDescription:
      'Masz wydajny frontend, interaktywne wyspy Vue oraz headless CMS gotowy do rozwoju od prostej wizytówki po większy serwis.',
    highlights: [
      'Static-first tam, gdzie to ma sens',
      'Vue islands tylko dla realnej interakcji',
      'Strapi jako centralny silnik treści',
      'Bezpieczny fallback content na czas developmentu',
    ],
    primaryCta: {
      label: 'Sprawdź status CMS',
      href: '/api/cms-status.json',
      variant: 'primary',
    },
    secondaryCta: {
      label: 'Otwórz panel CMS',
      href: 'http://localhost:1338/admin',
      external: true,
      variant: 'secondary',
    },
    featureItems: [
      {
        eyebrow: 'Performance',
        title: 'Astro utrzymuje projekt lekkim od pierwszego deployu.',
        body: 'Dostarczasz HTML tam, gdzie nie trzeba hydracji, a interakcję tylko tam, gdzie faktycznie daje wartość.',
        metric: 'Static-first',
      },
      {
        eyebrow: 'Interactivity',
        title: 'Vue działa jak precyzyjne narzędzie, nie domyślny młot.',
        body: 'Wyspy zachowują ergonomię komponentów i interakcji bez kosztu pełnego SPA na każdej podstronie.',
        metric: 'Islands UX',
      },
      {
        eyebrow: 'Content',
        title: 'Strapi porządkuje treść, SEO i strukturę strony.',
        body: 'Masz gotowe modele dla ustawień globalnych i stron, więc szybciej przechodzisz od projektu do wdrożenia.',
        metric: 'CMS core',
      },
    ],
    seo: {
      metaTitle: 'Website Template — Start',
      metaDescription:
        'Starter dla wydajnych stron marketingowych i landing page oparty o Astro, Vue i Strapi.',
    },
  },
  en: {
    title: 'Home',
    slug: 'home',
    description: 'Homepage for the starter powered by Astro, Vue, and Strapi.',
    heroBadge: 'Astro + Vue + Strapi + Bun',
    heroTitle: 'A faster starting point for websites that should look sharp and scale sanely.',
    heroDescription:
      'You get a fast frontend, focused Vue islands, and a headless CMS ready to grow from a brochure site into a larger content platform.',
    highlights: [
      'Static-first delivery where it matters most',
      'Vue islands only for meaningful interactivity',
      'Strapi as the central content engine',
      'Safe fallback content during early development',
    ],
    primaryCta: {
      label: 'Check CMS status',
      href: '/api/cms-status.json',
      variant: 'primary',
    },
    secondaryCta: {
      label: 'Open CMS admin',
      href: 'http://localhost:1338/admin',
      external: true,
      variant: 'secondary',
    },
    featureItems: [
      {
        eyebrow: 'Performance',
        title: 'Astro keeps the project lean from day one.',
        body: 'Ship HTML by default and hydrate only the parts that really benefit from client-side interactivity.',
        metric: 'Static-first',
      },
      {
        eyebrow: 'Interactivity',
        title: 'Vue stays a precise tool instead of the default hammer.',
        body: 'Islands preserve component ergonomics and rich UX without turning every page into a full SPA.',
        metric: 'Islands UX',
      },
      {
        eyebrow: 'Content',
        title: 'Strapi keeps content, SEO, and page structure organized.',
        body: 'You start with ready-made models for global settings and pages, so shipping the first version is much smoother.',
        metric: 'CMS core',
      },
    ],
    seo: {
      metaTitle: 'Website Template — Home',
      metaDescription:
        'A starter for fast marketing websites and landing pages powered by Astro, Vue, and Strapi.',
    },
  },
};

const secondaryPageSeeds: Record<string, Record<string, PageSeed>> = {
  services: {
    pl: {
      title: 'Oferta',
      slug: 'oferta',
      description: 'Przykładowa podstrona pokazująca, jak starter renderuje zwykłe strony z modelu page.',
      heroBadge: 'Dynamiczne strony CMS',
      heroTitle: 'Dodawaj kolejne podstrony bez dopisywania nowego route’a w Astro.',
      heroDescription:
        'Każdy wpis `page` poza `home` może działać jako zwykła podstrona z lokalizowanym slugiem, własnym SEO i wsparciem preview.',
      highlights: [
        'Slug może różnić się pomiędzy `pl` i `en`',
        'Preview działa także dla zwykłych podstron, nie tylko homepage',
        'Ten sam layout i shared UI package obsługują landing oraz podstrony',
      ],
      primaryCta: {
        label: 'Sprawdź status CMS',
        href: '/api/cms-status.json',
        variant: 'primary',
      },
      secondaryCta: {
        label: 'Wróć na start',
        href: '/',
        variant: 'secondary',
      },
      featureItems: [
        {
          eyebrow: 'Content model',
          title: 'Model `page` nadaje się już nie tylko do home, ale też do ofert i prostych stron informacyjnych.',
          body: 'Możesz rozwijać serwis bez dokładania osobnego pliku route dla każdej treści o podobnej strukturze.',
          metric: 'Reusable',
        },
        {
          eyebrow: 'Workflow',
          title: 'Editor przechodzi z CMS prosto do właściwej draft preview podstrony.',
          body: 'Signed preview URL prowadzi na lokalizowaną ścieżkę strony zamiast traktować homepage jako jedyny punkt wejścia.',
          metric: 'Preview-ready',
        },
      ],
      contentBlocks: [
        {
          __component: 'sections.rich-text',
          eyebrow: 'Page builder',
          title: 'Bloki pozwalają budować zwykłe strony bez mnożenia osobnych modeli treści.',
          body:
            'To pierwszy, pragmatyczny krok: zamiast od razu projektować dziesięć typów sekcji, starter dostaje kilka bloków, które pokrywają najczęstsze układy dla stron marketingowych.',
          width: 'narrow',
          align: 'left',
        },
        {
          __component: 'sections.feature-grid',
          eyebrow: 'Available blocks',
          title: 'Na start masz sekcję tekstową, grid feature’ów i pas CTA.',
          description:
            'To daje dość elastyczności, żeby układać ofertę, stronę usług lub prostą stronę informacyjną bez hardcodowania kolejnych tras i layoutów.',
          columns: '3',
          items: [
            {
              eyebrow: 'Rich text',
              title: 'Sekcja copy nadaje ton i porządkuje narrację strony.',
              body: 'Przydaje się do leadów, wyjaśnienia procesu lub krótkiego intro do oferty.',
              metric: 'Copy',
            },
            {
              eyebrow: 'Feature grid',
              title: 'Grid zbiera kluczowe przewagi lub etapy współpracy.',
              body: 'Możesz go wykorzystać do benefitów, procesów lub pakietów usług w lekkiej formie.',
              metric: 'Grid',
            },
            {
              eyebrow: 'CTA band',
              title: 'Band CTA domyka sekcję i prowadzi do następnego kroku.',
              body: 'W tym starterze dobrze sprawdza się jako zaproszenie do kontaktu, briefu albo wejścia do CMS preview.',
              metric: 'CTA',
            },
          ],
        },
        {
          __component: 'sections.pricing-grid',
          eyebrow: 'Pakiety startowe',
          title: 'Pricing grid pozwala zamienić ofertę w czytelne poziomy wejścia bez budowy osobnej podstrony cennika.',
          description:
            'To wciąż starter i demo content, ale układ dobrze pokazuje MVP-friendly scenariusz: prosty pakiet startowy, wariant najczęściej wybierany i zakres custom.',
          columns: '3',
          plans: [
            {
              eyebrow: 'MVP',
              title: 'Starter',
              description: 'Dla prostej wizytówki lub lądingu, który ma szybko wyjść online i dać miejsce na dalsze iteracje.',
              price: 'od 3 900 zł',
              billingPeriod: 'jednorazowo',
              features: [
                {
                  label: '1 strona + podstawowy page builder',
                },
                {
                  label: 'Lokalizacja PL/EN',
                  included: false,
                },
                {
                  label: 'Preview workflow',
                },
                {
                  label: 'Rozszerzony contact flow',
                  included: false,
                },
              ],
              cta: {
                label: 'Start od MVP',
                href: '/',
                variant: 'secondary',
              },
            },
            {
              eyebrow: 'Najczęstszy wybór',
              title: 'Growth',
              description: 'Najlepszy balans dla ofert, usług i prostych serwisów marketingowych z większą elastycznością sekcji.',
              price: 'od 7 900 zł',
              billingPeriod: 'jednorazowo',
              featured: true,
              features: [
                {
                  label: 'Wiele podstron z modelu page',
                },
                {
                  label: 'Lokalizacja PL/EN',
                },
                {
                  label: 'Page builder z sekcjami sprzedażowymi',
                },
                {
                  label: 'Contact flow z providerami i retry queue',
                },
              ],
              cta: {
                label: 'Porozmawiajmy',
                href: '/',
                variant: 'primary',
              },
            },
            {
              eyebrow: 'Custom',
              title: 'Scale',
              description: 'Dla bardziej rozbudowanego scope’u, integracji i dalszego rozwijania foundation zamiast stawiania wszystkiego od zera.',
              price: 'wycena indywidualna',
              billingPeriod: 'warsztat + estymacja',
              features: [
                {
                  label: 'Niestandardowe bloki page buildera',
                },
                {
                  label: 'Integracje CRM / automatyzacje',
                },
                {
                  label: 'Storage provider dla assetów',
                },
                {
                  label: 'Dedykowane dashboardy klienta',
                  included: false,
                },
              ],
              cta: {
                label: 'Opisz zakres',
                href: '/',
                variant: 'ghost',
              },
            },
          ],
        },
        {
          __component: 'sections.logo-cloud',
          eyebrow: 'Zaufali nam',
          title: 'Logo cloud daje szybki sygnał zaufania nawet wtedy, gdy projekt jest jeszcze na etapie MVP.',
          description:
            'Na start możesz pokazać same nazwy marek, a gdy projekt dojrzeje — podmienić je na właściwe logotypy z biblioteki mediów Strapi.',
          items: [
            {
              name: 'Northstar Studio',
            },
            {
              name: 'Lumen Commerce',
            },
            {
              name: 'Harbor Legal',
            },
            {
              name: 'Vectora Tech',
            },
            {
              name: 'Cobalt Health',
            },
            {
              name: 'Altitude Ops',
            },
          ],
        },
        {
          __component: 'sections.testimonials',
          eyebrow: 'Social proof',
          title: 'Przykładowe referencje pokazują, jak ten blok wzmacnia ofertę.',
          description:
            'W starterze to seed demo — podmieniasz je na prawdziwe opinie klienta, gdy projekt wychodzi poza fazę template’u i zaczyna pracować sprzedażowo.',
          columns: '3',
          items: [
            {
              quote:
                'Największa oszczędność czasu przyszła z tego, że CMS, preview i routing były gotowe od pierwszego dnia prac.',
              author: 'Marta',
              role: 'Founder',
              company: 'Studio konsultingowe',
            },
            {
              quote:
                'Dodanie kolejnych sekcji nie wymagało przebudowy frontendu, więc mogliśmy iterować treść zamiast walczyć z architekturą.',
              author: 'Paweł',
              role: 'Marketing lead',
              company: 'Software house B2B',
            },
            {
              quote:
                'Na MVP dostaliśmy szybki start, a jednocześnie ścieżkę do późniejszego rozwoju pod bardziej rozbudowany serwis.',
              author: 'Katarzyna',
              role: 'Project owner',
              company: 'Marka usługowa',
            },
          ],
        },
        {
          __component: 'sections.faq',
          eyebrow: 'FAQ',
          title: 'Najczęstsze pytania przed startem projektu.',
          description:
            'Ten blok dobrze sprawdza się na stronach usług, ofertach i landingach, gdzie chcesz domknąć obiekcje bez dokładania osobnej strony „Pytania i odpowiedzi”.',
          items: [
            {
              question: 'Jak szybko można uruchomić stronę na tym starterze?',
              answer:
                'Dla prostego zakresu możesz zacząć praktycznie od razu: routing, CMS, preview, locale i podstawowe bloki są już gotowe. Najwięcej czasu schodzi zwykle na dopięcie treści, brandingu i konkretnych integracji.',
            },
            {
              question: 'Czy mogę zacząć od małego scope’u i rozbudować projekt później?',
              answer:
                'Tak — właśnie do tego ten układ jest przygotowany. Strony, bloki page buildera i preview rozwijają się addytywnie, więc nie trzeba przepisywać całego frontendu przy każdym nowym wymaganiu.',
            },
            {
              question: 'Czy FAQ działa dla wielu języków?',
              answer:
                'Tak. Blok jest lokalizowany w Strapi, więc możesz mieć niezależne pytania i odpowiedzi dla `pl` i `en`, tak samo jak dla innych sekcji strony.',
            },
          ],
        },
        {
          __component: 'sections.cta-band',
          eyebrow: 'Next step',
          title: 'Jeśli potrzebujesz więcej swobody, dokładamy kolejne bloki zamiast rozsadzać fundamenty startera.',
          body:
            'Taki kierunek dobrze pasuje do MVP: mały zestaw sekcji, wspólny renderer i możliwość rozbudowy bez przepisywania całej aplikacji.',
          primaryCta: {
            label: 'Sprawdź status CMS',
            href: '/api/cms-status.json',
            variant: 'primary',
          },
          secondaryCta: {
            label: 'Wróć na start',
            href: '/',
            variant: 'secondary',
          },
        },
        {
          __component: 'sections.contact-form',
          eyebrow: 'Kontakt',
          title: 'Napisz, jeśli chcesz zamienić starter w realnie działającą stronę.',
          body:
            'Wyślij krótki opis projektu, a formularz przekaże zgłoszenie do webhooka skonfigurowanego po stronie web. To wygodny punkt startu pod automatyzacje, CRM albo email routing.',
          nameLabel: 'Imię i nazwisko',
          namePlaceholder: 'Np. Anna Kowalska',
          emailLabel: 'Adres email',
          emailPlaceholder: 'anna@firma.pl',
          phoneLabel: 'Telefon (opcjonalnie)',
          phonePlaceholder: '+48 500 600 700',
          subjectLabel: 'Temat',
          subjectPlaceholder: 'Krótko: czego dotyczy projekt?',
          messageLabel: 'Wiadomość',
          messagePlaceholder:
            'Opisz, czego potrzebujesz, jaki masz termin i jakiej strony dotyczy zapytanie.',
          submitLabel: 'Wyślij wiadomość',
          privacyNote:
            'Formularz w MVP forwarduje zgłoszenie do podpisanego webhooka po stronie web. Nie zapisuje leadów w CMS.',
          successMessage: 'Dzięki! Wiadomość została przyjęta — wrócimy z odpowiedzią tak szybko, jak się da.',
          errorMessage:
            'Nie udało się wysłać formularza. Sprawdź pola i spróbuj ponownie za chwilę.',
        },
      ],
      seo: {
        metaTitle: 'Oferta',
        metaDescription:
          'Przykładowa podstrona startera pokazująca dynamiczny routing zwykłych stron z CMS i lokalizowane slugi.',
      },
    },
    en: {
      title: 'Services',
      slug: 'services',
      description: 'An example page showing how the starter renders regular marketing subpages from the page model.',
      heroBadge: 'Dynamic CMS pages',
      heroTitle: 'Add more subpages without writing a brand new Astro route each time.',
      heroDescription:
        'Every `page` entry except `home` can act as a regular content page with its own localized slug, SEO, and preview support.',
      highlights: [
        'The slug can differ between `pl` and `en`',
        'Preview works for regular subpages, not only the homepage',
        'The same layout and shared UI package support landing pages and subpages',
      ],
      primaryCta: {
        label: 'Check CMS status',
        href: '/api/cms-status.json',
        variant: 'primary',
      },
      secondaryCta: {
        label: 'Back to home',
        href: '/',
        variant: 'secondary',
      },
      featureItems: [
        {
          eyebrow: 'Content model',
          title: 'The `page` model now comfortably covers services and simple informational pages, not only the homepage.',
          body: 'You can grow the site without creating a separate hard-coded route file for every new piece of marketing content.',
          metric: 'Reusable',
        },
        {
          eyebrow: 'Workflow',
          title: 'Editors can jump from the CMS straight into the correct draft preview route.',
          body: 'The signed preview URL lands on the localized path of the page instead of treating the homepage as the only destination.',
          metric: 'Preview-ready',
        },
      ],
      contentBlocks: [
        {
          __component: 'sections.rich-text',
          eyebrow: 'Page builder',
          title: 'Blocks let you build regular marketing pages without multiplying content models.',
          body:
            'This is the pragmatic first step: instead of designing ten section types up front, the starter gets a small block set that already covers common brochure-site layouts.',
          width: 'narrow',
          align: 'left',
        },
        {
          __component: 'sections.feature-grid',
          eyebrow: 'Available blocks',
          title: 'You now get a text section, a feature grid, and a CTA band out of the box.',
          description:
            'That is enough flexibility to compose a services page, a company page, or a simple informational route without hard-coding new layouts for each case.',
          columns: '3',
          items: [
            {
              eyebrow: 'Rich text',
              title: 'A copy section sets context and gives the page its narrative arc.',
              body: 'Use it for intros, process explanations, or a short justification of the offer.',
              metric: 'Copy',
            },
            {
              eyebrow: 'Feature grid',
              title: 'The grid gathers benefits, phases, or service pillars in a clean layout.',
              body: 'It works well for selling points, workflows, or package overviews without looking overly enterprise-y.',
              metric: 'Grid',
            },
            {
              eyebrow: 'CTA band',
              title: 'A CTA band closes the section and points visitors toward the next action.',
              body: 'In this starter it works nicely for contact prompts, briefs, or preview-oriented editorial flows.',
              metric: 'CTA',
            },
          ],
        },
        {
          __component: 'sections.pricing-grid',
          eyebrow: 'Starter packages',
          title: 'A pricing grid turns the offer into clear entry tiers without forcing a separate pricing page.',
          description:
            'This is still demo content, but it shows an MVP-friendly pattern well: a lean starter tier, a recommended growth package, and a custom expansion track.',
          columns: '3',
          plans: [
            {
              eyebrow: 'MVP',
              title: 'Starter',
              description: 'For a lean brochure site or landing page that should go live quickly and leave room for later iterations.',
              price: 'from €900',
              billingPeriod: 'one-off',
              features: [
                {
                  label: 'Single page + basic page builder',
                },
                {
                  label: 'PL/EN localization',
                  included: false,
                },
                {
                  label: 'Preview workflow',
                },
                {
                  label: 'Advanced contact flow',
                  included: false,
                },
              ],
              cta: {
                label: 'Start lean',
                href: '/',
                variant: 'secondary',
              },
            },
            {
              eyebrow: 'Most popular',
              title: 'Growth',
              description: 'The best balance for services pages and marketing sites that need a broader section set without overengineering.',
              price: 'from €1,900',
              billingPeriod: 'one-off',
              featured: true,
              features: [
                {
                  label: 'Multiple content pages from the page model',
                },
                {
                  label: 'PL/EN localization',
                },
                {
                  label: 'Sales-oriented page builder sections',
                },
                {
                  label: 'Provider-based contact flow with retry queue',
                },
              ],
              cta: {
                label: 'Let’s talk',
                href: '/',
                variant: 'primary',
              },
            },
            {
              eyebrow: 'Custom',
              title: 'Scale',
              description: 'For broader scopes, deeper integrations, and projects that extend the foundation instead of rebuilding it from scratch.',
              price: 'custom quote',
              billingPeriod: 'discovery + estimate',
              features: [
                {
                  label: 'Custom page builder blocks',
                },
                {
                  label: 'CRM / automation integrations',
                },
                {
                  label: 'Asset storage provider',
                },
                {
                  label: 'Dedicated client dashboards',
                  included: false,
                },
              ],
              cta: {
                label: 'Share the scope',
                href: '/',
                variant: 'ghost',
              },
            },
          ],
        },
        {
          __component: 'sections.logo-cloud',
          eyebrow: 'Trusted by',
          title: 'A logo cloud adds a quick trust signal even when the project is still in MVP mode.',
          description:
            'You can start with simple brand names and later swap them for real logos uploaded through the Strapi media library.',
          items: [
            {
              name: 'Northstar Studio',
            },
            {
              name: 'Lumen Commerce',
            },
            {
              name: 'Harbor Legal',
            },
            {
              name: 'Vectora Tech',
            },
            {
              name: 'Cobalt Health',
            },
            {
              name: 'Altitude Ops',
            },
          ],
        },
        {
          __component: 'sections.testimonials',
          eyebrow: 'Social proof',
          title: 'Example testimonials show how this block strengthens a services page.',
          description:
            'In the starter these are demo seeds — swap them for real client proof once the project moves beyond template mode and starts supporting sales conversations.',
          columns: '3',
          items: [
            {
              quote:
                'The biggest time saver was having CMS structure, preview, and routing ready from day one instead of stitching them together later.',
              author: 'Alex',
              role: 'Founder',
              company: 'Strategy studio',
            },
            {
              quote:
                'We could add new sections without rewriting the frontend, which meant content iteration stayed fast even as the scope grew.',
              author: 'Jamie',
              role: 'Marketing lead',
              company: 'B2B product team',
            },
            {
              quote:
                'It gave us a pragmatic MVP now and a credible path to scale the site later without replacing the whole foundation.',
              author: 'Taylor',
              role: 'Project owner',
              company: 'Service brand',
            },
          ],
        },
        {
          __component: 'sections.faq',
          eyebrow: 'FAQ',
          title: 'Common questions before kicking off a project.',
          description:
            'This block works well on services pages, offer pages, and marketing landers where you want to handle objections without creating a separate FAQ route.',
          items: [
            {
              question: 'How quickly can a site go live on top of this starter?',
              answer:
                'For a lean scope, you can start almost immediately: routing, CMS, preview, locale support, and the first content blocks are already in place. The biggest variable is usually final content, branding, and external integrations.',
            },
            {
              question: 'Can I start with a small scope and grow the project later?',
              answer:
                'Yes — that is exactly what this setup is optimized for. Pages, page-builder blocks, and preview flows can all be extended additively instead of forcing a rewrite every time the scope grows.',
            },
            {
              question: 'Does the FAQ block support multiple locales?',
              answer:
                'Yes. The block is localized in Strapi, so you can maintain separate questions and answers for `pl` and `en`, just like for the other page sections.',
            },
          ],
        },
        {
          __component: 'sections.cta-band',
          eyebrow: 'Next step',
          title: 'If you need more flexibility later, you can add new blocks without rebuilding the whole starter.',
          body:
            'That is the MVP-friendly path: a small set of reusable sections, one shared renderer, and room to expand when the project actually earns the extra complexity.',
          primaryCta: {
            label: 'Check CMS status',
            href: '/api/cms-status.json',
            variant: 'primary',
          },
          secondaryCta: {
            label: 'Back to home',
            href: '/',
            variant: 'secondary',
          },
        },
        {
          __component: 'sections.contact-form',
          eyebrow: 'Contact',
          title: 'Send a message if you want to turn this starter into a real delivery project.',
          body:
            'Share a short brief and the form will forward the submission to a webhook owned by the web app. It is a pragmatic starting point for automation, CRM handoff, or email routing.',
          nameLabel: 'Full name',
          namePlaceholder: 'e.g. Jane Smith',
          emailLabel: 'Email address',
          emailPlaceholder: 'jane@company.com',
          phoneLabel: 'Phone (optional)',
          phonePlaceholder: '+44 1234 567890',
          subjectLabel: 'Subject',
          subjectPlaceholder: 'In one sentence: what is the project about?',
          messageLabel: 'Message',
          messagePlaceholder:
            'Describe what you need, your timeline, and what kind of website or flow you want to build.',
          submitLabel: 'Send message',
          privacyNote:
            'In this MVP, the form forwards submissions to a signed webhook owned by the web app. Leads are not stored in the CMS.',
          successMessage: 'Thanks! Your message has been received — we will get back to you soon.',
          errorMessage:
            'The form could not be sent right now. Please review the fields and try again in a moment.',
        },
      ],
      seo: {
        metaTitle: 'Services',
        metaDescription:
          'An example subpage demonstrating dynamic CMS routing with localized slugs and page-level SEO.',
      },
    },
  },
};

const parseLocaleCodes = (value: string | undefined, fallback: string[]): string[] => {
  const parsed = value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parsed && parsed.length > 0 ? parsed : fallback;
};

const getDefaultLocaleCode = (): string => {
  const configuredLocale =
    process.env.CMS_DEFAULT_LOCALE ?? process.env.STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE ?? 'pl';

  return configuredLocale.trim() || 'pl';
};

const getConfiguredLocales = (): LocaleDefinition[] => {
  const defaultLocale = getDefaultLocaleCode();
  const configuredCodes = parseLocaleCodes(process.env.CMS_AVAILABLE_LOCALES, ['pl', 'en']);
  const localeCodes = [defaultLocale, ...configuredCodes].filter(
    (code, index, allCodes) => code.length > 0 && allCodes.indexOf(code) === index,
  );

  return localeCodes.map((code) => ({
    code,
    name: localeLabels[code] ?? `${code} (${code})`,
  }));
};

const getSeedForLocale = <T>(dictionary: Record<string, T>, localeCode: string, fallbackLocale: string): T => {
  const fallbackEntry = dictionary[fallbackLocale] ?? Object.values(dictionary)[0];

  if (!fallbackEntry) {
    throw new Error(`Missing fallback seed content for locale "${fallbackLocale}".`);
  }

  return dictionary[localeCode] ?? fallbackEntry;
};

const getDocumentId = (entry: unknown): string | undefined => {
  if (!entry || typeof entry !== 'object' || !('documentId' in entry)) {
    return undefined;
  }

  const { documentId } = entry as SeededDocument;

  return typeof documentId === 'string' && documentId.length > 0 ? documentId : undefined;
};

const findExistingDocument = async (
  strapi: Core.Strapi,
  uid: 'api::global.global' | 'api::page.page',
  localeCodes: string[],
  filters?: Record<string, unknown>,
) => {
  const documents = strapi.documents(uid);

  for (const locale of localeCodes) {
    const draftVersion = await documents.findFirst({ locale, status: 'draft', filters });

    if (draftVersion) {
      return draftVersion;
    }

    const publishedVersion = await documents.findFirst({ locale, status: 'published', filters });

    if (publishedVersion) {
      return publishedVersion;
    }
  }

  return null;
};

const findExistingLocaleVersion = async (
  strapi: Core.Strapi,
  uid: 'api::global.global' | 'api::page.page',
  documentId: string,
  locale: string,
) => {
  const documents = strapi.documents(uid);

  return (
    (await documents.findOne({ documentId, locale, status: 'draft' })) ??
    (await documents.findOne({ documentId, locale, status: 'published' }))
  );
};

const ensureLocales = async (strapi: Core.Strapi, locales: LocaleDefinition[], defaultLocale: string) => {
  const localesService = strapi.plugin('i18n')?.service('locales');

  if (!localesService) {
    strapi.log.warn('[bootstrap] The i18n plugin is unavailable, locale bootstrap has been skipped.');
    return;
  }

  for (const locale of locales) {
    const existingLocale = await localesService.findByCode(locale.code);

    if (!existingLocale) {
      await localesService.create({
        code: locale.code,
        name: locale.name,
        isDefault: locale.code === defaultLocale,
      });
    }
  }

  const currentDefaultLocale = await localesService.getDefaultLocale();

  if (currentDefaultLocale !== defaultLocale) {
    await localesService.setDefaultLocale({ code: defaultLocale });
  }
};

const seedLocalizedDocument = async (
  strapi: Core.Strapi,
  uid: 'api::global.global' | 'api::page.page',
  description: string,
  localeCodes: string[],
  defaultLocale: string,
  seeds: Record<string, Record<string, unknown>>,
  filters?: Record<string, unknown>,
) => {
  const documents = strapi.documents(uid);
  let documentId = getDocumentId(await findExistingDocument(strapi, uid, localeCodes, filters));
  let createdLocalesCount = 0;

  for (const locale of localeCodes) {
    const seedData = getSeedForLocale(seeds, locale, defaultLocale);

    if (!documentId) {
      const createdDocument = await documents.create({ locale, data: seedData });

      documentId = getDocumentId(createdDocument);

      if (!documentId) {
        throw new Error(`Failed to create the ${description} seed document for locale "${locale}".`);
      }

      await documents.publish({ documentId, locale });
      createdLocalesCount += 1;
      continue;
    }

    const existingLocaleVersion = await findExistingLocaleVersion(strapi, uid, documentId, locale);

    if (existingLocaleVersion) {
      continue;
    }

    const createdLocaleVersion = await documents.update({
      documentId,
      locale,
      data: seedData,
    });

    documentId = getDocumentId(createdLocaleVersion) ?? documentId;

    await documents.publish({ documentId, locale });
    createdLocalesCount += 1;
  }

  if (createdLocalesCount > 0) {
    strapi.log.info(
      `[bootstrap] Seeded ${description} for ${createdLocalesCount} locale${createdLocalesCount === 1 ? '' : 's'}.`,
    );
  }
};

const seedCmsContent = async (strapi: Core.Strapi) => {
  const locales = getConfiguredLocales();
  const localeCodes = locales.map((locale) => locale.code);
  const defaultLocale = locales[0]?.code ?? getDefaultLocaleCode();

  await ensureLocales(strapi, locales, defaultLocale);

  await seedLocalizedDocument(
    strapi,
    'api::global.global',
    'global settings',
    localeCodes,
    defaultLocale,
    globalSeeds,
  );

  const homepageSeed = getSeedForLocale(homepageSeeds, defaultLocale, defaultLocale);

  await seedLocalizedDocument(
    strapi,
    'api::page.page',
    'homepage',
    localeCodes,
    defaultLocale,
    homepageSeeds,
    { slug: { $eq: homepageSeed.slug } },
  );

  for (const [pageKey, localizedSeeds] of Object.entries(secondaryPageSeeds)) {
    const defaultLocaleSeed = getSeedForLocale(localizedSeeds, defaultLocale, defaultLocale);

    await seedLocalizedDocument(
      strapi,
      'api::page.page',
      `${pageKey} page`,
      localeCodes,
      defaultLocale,
      localizedSeeds,
      { slug: { $eq: defaultLocaleSeed.slug } },
    );
  }
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedCmsContent(strapi);
  },
};
