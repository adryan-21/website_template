export type LinkVariant = 'primary' | 'secondary' | 'ghost';
export type CmsDocumentStatus = 'draft' | 'published';

export interface CmsMedia {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface CmsLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  variant?: LinkVariant;
}

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  shareImage?: CmsMedia;
  noIndex?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  body: string;
  eyebrow?: string;
  metric?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export type CmsPageSectionAlign = 'left' | 'center';
export type CmsPageSectionWidth = 'narrow' | 'wide';
export type CmsPageSectionColumns = 2 | 3;

export interface CmsPageRichTextSection {
  id: string;
  type: 'rich-text';
  eyebrow: string;
  title: string;
  body: string;
  align: CmsPageSectionAlign;
  width: CmsPageSectionWidth;
}

export interface CmsPageFeatureGridSection {
  id: string;
  type: 'feature-grid';
  eyebrow: string;
  title: string;
  description: string;
  columns: CmsPageSectionColumns;
  items: FeatureItem[];
}

export interface CmsPageTestimonialsSection {
  id: string;
  type: 'testimonials';
  eyebrow: string;
  title: string;
  description: string;
  columns: CmsPageSectionColumns;
  items: TestimonialItem[];
}

export interface CmsPageFaqSection {
  id: string;
  type: 'faq';
  eyebrow: string;
  title: string;
  description: string;
  items: FaqItem[];
}

export interface CmsPageCtaBandSection {
  id: string;
  type: 'cta-band';
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: CmsLink;
  secondaryCta: CmsLink;
}

export interface CmsPageContactFormSection {
  id: string;
  type: 'contact-form';
  eyebrow: string;
  title: string;
  body: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  privacyNote: string;
  successMessage: string;
  errorMessage: string;
}

export type CmsPageSection =
  | CmsPageRichTextSection
  | CmsPageFeatureGridSection
  | CmsPageTestimonialsSection
  | CmsPageFaqSection
  | CmsPageCtaBandSection
  | CmsPageContactFormSection;

export interface GlobalData {
  locale: string;
  siteName: string;
  siteDescription: string;
  navigation: CmsLink[];
  footerLinks: CmsLink[];
  socialLinks: CmsLink[];
  cta?: CmsLink;
  seo: SeoData;
}

export interface HomepageData {
  locale: string;
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: CmsLink;
  secondaryCta: CmsLink;
  highlights: string[];
  featureItems: FeatureItem[];
}

export interface CmsPage {
  id: string;
  locale: string;
  slug: string;
  title: string;
  description: string;
  badge: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: CmsLink;
  secondaryCta: CmsLink;
  highlights: string[];
  featureItems: FeatureItem[];
  contentBlocks: CmsPageSection[];
  seo?: SeoData;
}

export interface CmsContent {
  global: GlobalData;
  homepage: HomepageData;
  pages: CmsPage[];
}

export interface CmsHealth {
  reachable: boolean;
  source: 'remote' | 'fallback';
  apiUrl?: string;
  reason?: string;
}

export interface CmsClientOptions {
  apiUrl?: string;
  token?: string;
  locale?: string;
  status?: CmsDocumentStatus;
  timeoutMs?: number;
  fetch?: typeof fetch;
  fallbackContent?: CmsContent;
}

export interface CmsQueryOptions {
  locale?: string;
  status?: CmsDocumentStatus;
}

export interface CmsClient {
  getGlobalData(options?: CmsQueryOptions): Promise<GlobalData>;
  getHomepageData(options?: CmsQueryOptions): Promise<HomepageData>;
  getPages(options?: CmsQueryOptions): Promise<CmsPage[]>;
  getPageBySlug(slug: string, options?: CmsQueryOptions): Promise<CmsPage | undefined>;
  getCmsHealth(): Promise<CmsHealth>;
}

type EntityRecord = Record<string, unknown>;

const defaultPrimaryCta: CmsLink = {
  id: 'primary-cta',
  label: 'Status CMS',
  href: '/api/cms-status.json',
  variant: 'primary',
};

const defaultSecondaryCta: CmsLink = {
  id: 'secondary-cta',
  label: '',
  href: '',
  variant: 'secondary',
};

const emptySeoData: SeoData = {
  metaTitle: '',
  metaDescription: '',
};

const emptyPrimaryCta: CmsLink = {
  id: 'empty-primary-cta',
  label: '',
  href: '',
  variant: 'primary',
};

const emptySecondaryCta: CmsLink = {
  id: 'empty-secondary-cta',
  label: '',
  href: '',
  variant: 'secondary',
};

const emptyGlobalData: GlobalData = {
  locale: 'pl',
  siteName: '',
  siteDescription: '',
  navigation: [],
  footerLinks: [],
  socialLinks: [],
  cta: undefined,
  seo: emptySeoData,
};

const emptyHomepageData: HomepageData = {
  locale: 'pl',
  badge: '',
  title: '',
  subtitle: '',
  primaryCta: emptyPrimaryCta,
  secondaryCta: emptySecondaryCta,
  highlights: [],
  featureItems: [],
};

const emptyPageFallback: CmsPage = {
  id: '',
  locale: 'pl',
  slug: '',
  title: '',
  description: '',
  badge: '',
  heroTitle: '',
  heroDescription: '',
  primaryCta: emptyPrimaryCta,
  secondaryCta: emptySecondaryCta,
  highlights: [],
  featureItems: [],
  contentBlocks: [],
};

const defaultOfferContentBlocks: CmsPageSection[] = [
  {
    id: 'offer-rich-text',
    type: 'rich-text',
    eyebrow: 'Page builder',
    title: 'Bloki pozwalają budować zwykłe strony bez mnożenia osobnych modeli treści.',
    body:
      'To pierwszy, pragmatyczny krok: zamiast od razu projektować dziesięć typów sekcji, starter dostaje kilka bloków, które pokrywają najczęstsze układy dla stron marketingowych.',
    align: 'left',
    width: 'narrow',
  },
  {
    id: 'offer-feature-grid',
    type: 'feature-grid',
    eyebrow: 'Available blocks',
    title: 'Na start masz sekcję tekstową, grid feature’ów i pas CTA.',
    description:
      'To daje dość elastyczności, żeby układać ofertę, stronę usług lub prostą stronę informacyjną bez hardcodowania kolejnych tras i layoutów.',
    columns: 3,
    items: [
      {
        id: 'offer-copy',
        eyebrow: 'Rich text',
        title: 'Sekcja copy nadaje ton i porządkuje narrację strony.',
        body: 'Przydaje się do leadów, wyjaśnienia procesu lub krótkiego intro do oferty.',
        metric: 'Copy',
      },
      {
        id: 'offer-grid',
        eyebrow: 'Feature grid',
        title: 'Grid zbiera kluczowe przewagi lub etapy współpracy.',
        body: 'Możesz go wykorzystać do benefitów, procesów lub pakietów usług w lekkiej formie.',
        metric: 'Grid',
      },
      {
        id: 'offer-cta',
        eyebrow: 'CTA band',
        title: 'Band CTA domyka sekcję i prowadzi do następnego kroku.',
        body: 'W tym starterze dobrze sprawdza się jako zaproszenie do kontaktu, briefu albo wejścia do CMS preview.',
        metric: 'CTA',
      },
    ],
  },
  {
    id: 'offer-testimonials',
    type: 'testimonials',
    eyebrow: 'Social proof',
    title: 'Przykładowe referencje pokazują, jak ten blok wzmacnia ofertę.',
    description:
      'W starterze to seed demo — podmieniasz je na prawdziwe opinie klienta, gdy projekt wychodzi poza fazę template’u i zaczyna pracować sprzedażowo.',
    columns: 3,
    items: [
      {
        id: 'offer-testimonial-marta',
        quote:
          'Największa oszczędność czasu przyszła z tego, że CMS, preview i routing były gotowe od pierwszego dnia prac.',
        author: 'Marta',
        role: 'Founder',
        company: 'Studio konsultingowe',
      },
      {
        id: 'offer-testimonial-pawel',
        quote:
          'Dodanie kolejnych sekcji nie wymagało przebudowy frontendu, więc mogliśmy iterować treść zamiast walczyć z architekturą.',
        author: 'Paweł',
        role: 'Marketing lead',
        company: 'Software house B2B',
      },
      {
        id: 'offer-testimonial-katarzyna',
        quote:
          'Na MVP dostaliśmy szybki start, a jednocześnie ścieżkę do późniejszego rozwoju pod bardziej rozbudowany serwis.',
        author: 'Katarzyna',
        role: 'Project owner',
        company: 'Marka usługowa',
      },
    ],
  },
  {
    id: 'offer-faq',
    type: 'faq',
    eyebrow: 'FAQ',
    title: 'Najczęstsze pytania przed startem projektu.',
    description:
      'Ten blok dobrze sprawdza się na stronach usług, ofertach i landingach, gdzie chcesz domknąć obiekcje bez dokładania osobnej strony „Pytania i odpowiedzi”.',
    items: [
      {
        id: 'offer-faq-speed',
        question: 'Jak szybko można uruchomić stronę na tym starterze?',
        answer:
          'Dla prostego zakresu możesz zacząć praktycznie od razu: routing, CMS, preview, locale i podstawowe bloki są już gotowe. Najwięcej czasu schodzi zwykle na dopięcie treści, brandingu i konkretnych integracji.',
      },
      {
        id: 'offer-faq-scope',
        question: 'Czy mogę zacząć od małego scope’u i rozbudować projekt później?',
        answer:
          'Tak — właśnie do tego ten układ jest przygotowany. Strony, bloki page buildera i preview rozwijają się addytywnie, więc nie trzeba przepisywać całego frontendu przy każdym nowym wymaganiu.',
      },
      {
        id: 'offer-faq-locale',
        question: 'Czy FAQ działa dla wielu języków?',
        answer:
          'Tak. Blok jest lokalizowany w Strapi, więc możesz mieć niezależne pytania i odpowiedzi dla `pl` i `en`, tak samo jak dla innych sekcji strony.',
      },
    ],
  },
  {
    id: 'offer-cta-band',
    type: 'cta-band',
    eyebrow: 'Next step',
    title: 'Jeśli potrzebujesz więcej swobody, dokładamy kolejne bloki zamiast rozsadzać fundamenty startera.',
    body:
      'Taki kierunek dobrze pasuje do MVP: mały zestaw sekcji, wspólny renderer i możliwość rozbudowy bez przepisywania całej aplikacji.',
    primaryCta: defaultPrimaryCta,
    secondaryCta: {
      id: 'offer-cta-band-secondary',
      label: 'Wróć na start',
      href: '/',
      variant: 'secondary',
    },
  },
  {
    id: 'offer-contact-form',
    type: 'contact-form',
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
    messagePlaceholder: 'Opisz, czego potrzebujesz, jaki masz termin i jakiej strony dotyczy zapytanie.',
    submitLabel: 'Wyślij wiadomość',
    privacyNote:
      'Formularz w MVP forwarduje zgłoszenie do podpisanego webhooka po stronie web. Nie zapisuje leadów w CMS.',
    successMessage: 'Dzięki! Wiadomość została wysłana — wrócimy z odpowiedzią tak szybko, jak się da.',
    errorMessage: 'Nie udało się wysłać formularza. Sprawdź pola i spróbuj ponownie za chwilę.',
  },
];

const defaultServicesContentBlocks: CmsPageSection[] = [
  {
    id: 'services-rich-text',
    type: 'rich-text',
    eyebrow: 'Page builder',
    title: 'Blocks let you build regular marketing pages without multiplying content models.',
    body:
      'This is the pragmatic first step: instead of designing ten section types up front, the starter gets a small block set that already covers common brochure-site layouts.',
    align: 'left',
    width: 'narrow',
  },
  {
    id: 'services-feature-grid',
    type: 'feature-grid',
    eyebrow: 'Available blocks',
    title: 'You now get a text section, a feature grid, and a CTA band out of the box.',
    description:
      'That is enough flexibility to compose a services page, a company page, or a simple informational route without hard-coding new layouts for each case.',
    columns: 3,
    items: [
      {
        id: 'services-copy',
        eyebrow: 'Rich text',
        title: 'A copy section sets context and gives the page its narrative arc.',
        body: 'Use it for intros, process explanations, or a short justification of the offer.',
        metric: 'Copy',
      },
      {
        id: 'services-grid',
        eyebrow: 'Feature grid',
        title: 'The grid gathers benefits, phases, or service pillars in a clean layout.',
        body: 'It works well for selling points, workflows, or package overviews without looking overly enterprise-y.',
        metric: 'Grid',
      },
      {
        id: 'services-cta',
        eyebrow: 'CTA band',
        title: 'A CTA band closes the section and points visitors toward the next action.',
        body: 'In this starter it works nicely for contact prompts, briefs, or preview-oriented editorial flows.',
        metric: 'CTA',
      },
    ],
  },
  {
    id: 'services-testimonials',
    type: 'testimonials',
    eyebrow: 'Social proof',
    title: 'Example testimonials show how this block strengthens a services page.',
    description:
      'In the starter these are demo seeds — swap them for real client proof once the project moves beyond template mode and starts supporting sales conversations.',
    columns: 3,
    items: [
      {
        id: 'services-testimonial-alex',
        quote:
          'The biggest time saver was having CMS structure, preview, and routing ready from day one instead of stitching them together later.',
        author: 'Alex',
        role: 'Founder',
        company: 'Strategy studio',
      },
      {
        id: 'services-testimonial-jamie',
        quote:
          'We could add new sections without rewriting the frontend, which meant content iteration stayed fast even as the scope grew.',
        author: 'Jamie',
        role: 'Marketing lead',
        company: 'B2B product team',
      },
      {
        id: 'services-testimonial-taylor',
        quote:
          'It gave us a pragmatic MVP now and a credible path to scale the site later without replacing the whole foundation.',
        author: 'Taylor',
        role: 'Project owner',
        company: 'Service brand',
      },
    ],
  },
  {
    id: 'services-faq',
    type: 'faq',
    eyebrow: 'FAQ',
    title: 'Common questions before kicking off a project.',
    description:
      'This block works well on services pages, offer pages, and marketing landers where you want to handle objections without creating a separate FAQ route.',
    items: [
      {
        id: 'services-faq-speed',
        question: 'How quickly can a site go live on top of this starter?',
        answer:
          'For a lean scope, you can start almost immediately: routing, CMS, preview, locale support, and the first content blocks are already in place. The biggest variable is usually final content, branding, and external integrations.',
      },
      {
        id: 'services-faq-scope',
        question: 'Can I start with a small scope and grow the project later?',
        answer:
          'Yes — that is exactly what this setup is optimized for. Pages, page-builder blocks, and preview flows can all be extended additively instead of forcing a rewrite every time the scope grows.',
      },
      {
        id: 'services-faq-locale',
        question: 'Does the FAQ block support multiple locales?',
        answer:
          'Yes. The block is localized in Strapi, so you can maintain separate questions and answers for `pl` and `en`, just like for the other page sections.',
      },
    ],
  },
  {
    id: 'services-cta-band',
    type: 'cta-band',
    eyebrow: 'Next step',
    title: 'If you need more flexibility later, you can add new blocks without rebuilding the whole starter.',
    body:
      'That is the MVP-friendly path: a small set of reusable sections, one shared renderer, and room to expand when the project actually earns the extra complexity.',
    primaryCta: {
      id: 'services-cta-band-primary',
      label: 'Check CMS status',
      href: '/api/cms-status.json',
      variant: 'primary',
    },
    secondaryCta: {
      id: 'services-cta-band-secondary',
      label: 'Back to home',
      href: '/',
      variant: 'secondary',
    },
  },
  {
    id: 'services-contact-form',
    type: 'contact-form',
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
    successMessage: 'Thanks! Your message has been sent — we will get back to you soon.',
    errorMessage:
      'The form could not be sent right now. Please review the fields and try again in a moment.',
  },
];

export const emptyCmsContent: CmsContent = {
  global: {
    ...emptyGlobalData,
    navigation: [],
    footerLinks: [],
    socialLinks: [],
  },
  homepage: {
    ...emptyHomepageData,
    highlights: [],
    featureItems: [],
  },
  pages: [],
};

export const defaultCmsContent: CmsContent = {
  global: {
    locale: 'pl',
    siteName: 'Website Template',
    siteDescription:
      'Pragmatyczny starter dla landing page i prostych stron marketingowych na Astro, Vue i Strapi.',
    navigation: [
      { id: 'nav-home', label: 'Start', href: '/' },
      { id: 'nav-status', label: 'CMS status', href: '/api/cms-status.json' },
    ],
    footerLinks: [
      { id: 'footer-home', label: 'Start', href: '/' },
      { id: 'footer-docs', label: 'README', href: 'https://docs.strapi.io/', external: true },
    ],
    socialLinks: [
      { id: 'social-github', label: 'GitHub', href: 'https://github.com', external: true },
      { id: 'social-astro', label: 'Astro', href: 'https://astro.build', external: true },
      { id: 'social-strapi', label: 'Strapi', href: 'https://strapi.io', external: true },
    ],
    cta: { id: 'global-cta', label: 'Open CMS', href: 'http://localhost:1338/admin', external: true },
    seo: {
      metaTitle: 'Website Template — Astro + Vue + Strapi',
      metaDescription:
        'Starter monorepo dla landing page i stron opartych o headless CMS z pragmatycznym podejściem do MVP.',
    },
  },
  homepage: {
    locale: 'pl',
    badge: 'Astro + Vue + Strapi + Bun',
    title: 'Szybszy start dla stron, które mają wyglądać dobrze i rosnąć bez bólu.',
    subtitle:
      'Masz wydajny frontend, interaktywne wyspy Vue, headless CMS jako core oraz lokalny stack gotowy pod rozwój od wizytówki po większy serwis.',
    primaryCta: defaultPrimaryCta,
    secondaryCta: defaultSecondaryCta,
    highlights: [
      'Hybrid rendering gotowy od startu',
      'Vue islands tylko tam, gdzie są potrzebne',
      'Strapi jako centralny silnik treści',
      'Fallback content, więc build nie panikuje bez CMS',
    ],
    featureItems: [
      {
        id: 'astro-performance',
        eyebrow: 'Performance',
        title: 'Astro robi ciężką robotę za Ciebie.',
        body: 'Statycznie tam, gdzie to ma sens. On-demand tam, gdzie projekt tego potrzebuje. Bez wpychania SPA wszędzie na siłę.',
        metric: 'Static-first',
      },
      {
        id: 'vue-islands',
        eyebrow: 'Interactivity',
        title: 'Vue jako precyzyjne narzędzie, nie domyślny młot.',
        body: 'Interakcje trafiają do wysp, więc projekt pozostaje lekki, a jednocześnie gotowy na bardziej zaawansowane widgety i dashboardy.',
        metric: 'Islands UX',
      },
      {
        id: 'cms-core',
        eyebrow: 'Content',
        title: 'Strapi trzyma treści w ryzach.',
        body: 'Model global settings i stron pozwala szybko odpalać landing page oraz proste serwisy bez przebudowy fundamentów.',
        metric: 'CMS core',
      },
    ],
  },
  pages: [
    {
      id: 'page-home',
      locale: 'pl',
      slug: 'home',
      title: 'Start',
      description: 'Landing page startowy dla template’u opartego o Astro, Vue i Strapi.',
      badge: 'Astro + Vue + Strapi + Bun',
      heroTitle: 'Szybszy start dla stron, które mają wyglądać dobrze i rosnąć bez bólu.',
      heroDescription:
        'Masz wydajny frontend, interaktywne wyspy Vue, headless CMS jako core oraz lokalny stack gotowy pod rozwój od wizytówki po większy serwis.',
      primaryCta: defaultPrimaryCta,
      secondaryCta: defaultSecondaryCta,
      highlights: [
        'Hybrid rendering gotowy od startu',
        'Vue islands tylko tam, gdzie są potrzebne',
        'Strapi jako centralny silnik treści',
      ],
      featureItems: [
        {
          id: 'page-home-performance',
          eyebrow: 'Performance',
          title: 'Astro utrzymuje projekt lekkim od pierwszego deployu.',
          body: 'Statycznie tam, gdzie to ma sens. On-demand tam, gdzie projekt tego potrzebuje.',
          metric: 'Static-first',
        },
      ],
      contentBlocks: [],
    },
    {
      id: 'page-offer-pl',
      locale: 'pl',
      slug: 'oferta',
      title: 'Oferta',
      description: 'Przykładowa podstrona CMS pokazująca, jak starter obsługuje zwykłe strony marketingowe.',
      badge: 'Dynamiczne strony CMS',
      heroTitle: 'Dodawaj zwykłe podstrony bez dopisywania nowego route’a.',
      heroDescription:
        'Każdy wpis `page` poza `home` może być renderowany jako osobna podstrona z własnym slugiem, SEO i preview.',
      primaryCta: defaultPrimaryCta,
      secondaryCta: {
        id: 'page-offer-secondary',
        label: 'Wróć na start',
        href: '/',
        variant: 'secondary',
      },
      highlights: [
        'Slug może być lokalizowany per locale',
        'Preview działa także na zwykłych podstronach',
        'Ten sam layout i shared UI package obsługują landing i podstrony',
      ],
      featureItems: [
        {
          id: 'page-offer-structure',
          eyebrow: 'Content model',
          title: 'Jeden model `page` ogarnia landing, ofertę i proste strony informacyjne.',
          body: 'Nie trzeba osobnego komponentu routingu dla każdego typu treści, dopóki układ strony pozostaje marketingowy.',
          metric: 'Reusable',
        },
        {
          id: 'page-offer-preview',
          eyebrow: 'Workflow',
          title: 'Editor może przejść z CMS prosto do draft preview podstrony.',
          body: 'Signed preview URL kończy się na właściwej ścieżce locale zamiast otwierać wszystko wyłącznie na homepage.',
          metric: 'Preview-ready',
        },
      ],
      contentBlocks: defaultOfferContentBlocks,
      seo: {
        metaTitle: 'Oferta',
        metaDescription:
          'Przykładowa podstrona startera pokazująca dynamiczny routing zwykłych stron z CMS i lokalizowanymi slugami.',
      },
    },
    {
      id: 'page-services-en',
      locale: 'en',
      slug: 'services',
      title: 'Services',
      description: 'An example CMS page showing how the starter handles standard marketing subpages.',
      badge: 'Dynamic CMS pages',
      heroTitle: 'Add regular subpages without writing a brand new route each time.',
      heroDescription:
        'Every `page` entry except `home` can render as its own route with localized slug, page SEO, and preview support.',
      primaryCta: {
        id: 'page-services-primary',
        label: 'Check CMS status',
        href: '/api/cms-status.json',
        variant: 'primary',
      },
      secondaryCta: {
        id: 'page-services-secondary',
        label: 'Back to home',
        href: '/',
        variant: 'secondary',
      },
      highlights: [
        'Slugs can differ by locale',
        'Preview works for regular content pages too',
        'The same layout and shared UI package support both landing and subpages',
      ],
      featureItems: [
        {
          id: 'page-services-structure',
          eyebrow: 'Content model',
          title: 'One `page` model covers landing, services, and simple informational pages.',
          body: 'You do not need a separate hard-coded route for every marketing page while the structure stays consistent.',
          metric: 'Reusable',
        },
        {
          id: 'page-services-preview',
          eyebrow: 'Workflow',
          title: 'Editors can jump from the CMS directly into the correct draft page preview.',
          body: 'The signed preview URL lands on the right localized route instead of treating the homepage as the only destination.',
          metric: 'Preview-ready',
        },
      ],
      contentBlocks: defaultServicesContentBlocks,
      seo: {
        metaTitle: 'Services',
        metaDescription:
          'An example subpage demonstrating dynamic CMS routing with localized slugs and page-level SEO.',
      },
    },
  ],
};

const DEFAULT_TIMEOUT_MS = 2000;
const DEFAULT_DOCUMENT_STATUS: CmsDocumentStatus = 'published';
const DEFAULT_PAGE_POPULATE_QUERY = [
  'populate[primaryCta]=*',
  'populate[secondaryCta]=*',
  'populate[featureItems]=*',
  'populate[seo][populate]=*',
  'populate[contentBlocks][on][sections.rich-text][populate]=*',
  'populate[contentBlocks][on][sections.feature-grid][populate]=*',
  'populate[contentBlocks][on][sections.testimonials][populate]=*',
  'populate[contentBlocks][on][sections.faq][populate]=*',
  'populate[contentBlocks][on][sections.cta-band][populate]=*',
  'populate[contentBlocks][on][sections.contact-form][populate]=*',
].join('&');

const isRecord = (value: unknown): value is EntityRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isDocumentStatus = (value: unknown): value is CmsDocumentStatus =>
  value === 'draft' || value === 'published';

const extractData = (payload: unknown): unknown => {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data;
  }

  return payload;
};

const unwrapEntity = (value: unknown): EntityRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (isRecord(value.attributes)) {
    return {
      ...value.attributes,
      id: value.id ?? value.documentId ?? value.attributes.id ?? '',
      documentId: value.documentId ?? value.id ?? value.attributes.documentId ?? '',
    };
  }

  return value;
};

const getEntityList = (payload: unknown): EntityRecord[] => {
  const data = extractData(payload);

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((entry) => unwrapEntity(entry))
    .filter((entry): entry is EntityRecord => entry !== null);
};

const getSingleEntity = (payload: unknown): EntityRecord | null => {
  const data = extractData(payload);

  if (Array.isArray(data)) {
    return unwrapEntity(data[0]);
  }

  return unwrapEntity(data);
};

const getText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

const getBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const getNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const getSectionAlign = (value: unknown, fallback: CmsPageSectionAlign = 'left'): CmsPageSectionAlign => {
  return value === 'center' ? 'center' : fallback;
};

const getSectionWidth = (value: unknown, fallback: CmsPageSectionWidth = 'wide'): CmsPageSectionWidth => {
  return value === 'narrow' ? 'narrow' : fallback;
};

const getSectionColumns = (
  value: unknown,
  fallback: CmsPageSectionColumns = 3,
): CmsPageSectionColumns => {
  return value === '2' || value === 2 ? 2 : fallback;
};

const normalizeHref = (value: unknown, fallback: string): string => {
  const href = getText(value, fallback);

  if (!href) {
    return fallback;
  }

  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) {
    return href;
  }

  return `/${href.replace(/^\/+/, '')}`;
};

const isBlogHref = (href: string): boolean => {
  const normalized = href === '/' ? href : href.replace(/\/$/, '');

  return normalized === '/blog' || normalized.startsWith('/blog/');
};

const isBlogSlug = (slug: string): boolean => slug.trim().toLowerCase() === 'blog';

const legacyBlogCopyPattern =
  /\b(blog|blogs|article|articles|category|categories|wpis|wpisy|artyku(?:ł|l|ły|łów)|kategor(?:ia|ie|ii))\b/i;

const containsLegacyBlogReference = (value: string): boolean => legacyBlogCopyPattern.test(value);

const filterBlogLinks = (links: CmsLink[]): CmsLink[] =>
  links.filter((link) => link.label && link.href && !isBlogHref(link.href));

const sanitizeLandingLink = (link: CmsLink, emptyLink: CmsLink): CmsLink =>
  !link.label || !link.href || isBlogHref(link.href) ? emptyLink : link;

const filterLandingHighlights = (items: string[]): string[] =>
  items.filter((item) => !containsLegacyBlogReference(item));

const filterLandingFeatureItems = (items: FeatureItem[]): FeatureItem[] =>
  items.filter((item) => {
    const content = [item.eyebrow, item.title, item.body, item.metric].filter(Boolean).join(' ');

    return !containsLegacyBlogReference(content);
  });

const buildUrl = (apiUrl: string, path: string): string => {
  const base = apiUrl.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;

  return `${base}${suffix}`;
};

const appendDocumentQuery = (path: string, options: { locale?: string; status: CmsDocumentStatus }): string => {
  const params = new URLSearchParams();

  if (options.locale) {
    params.set('locale', options.locale);
  }

  params.set('status', options.status);

  const query = params.toString();

  return query.length > 0 ? `${path}${path.includes('?') ? '&' : '?'}${query}` : path;
};

const createRequestSignal = (timeoutMs: number): AbortSignal | undefined => {
  if (typeof AbortSignal === 'undefined' || typeof AbortSignal.timeout !== 'function') {
    return undefined;
  }

  return AbortSignal.timeout(timeoutMs);
};

const resolveAssetOrigin = (apiUrl?: string): string | undefined => {
  if (!apiUrl) {
    return undefined;
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return undefined;
  }
};

const mapMedia = (value: unknown, assetOrigin?: string): CmsMedia | undefined => {
  const entry = unwrapEntity(value);

  if (!entry) {
    return undefined;
  }

  const url = getText(entry.url);

  if (!url) {
    return undefined;
  }

  const absoluteUrl = url.startsWith('http') || !assetOrigin ? url : `${assetOrigin}${url}`;

  return {
    url: absoluteUrl,
    alt: getText(entry.alternativeText),
    width: getNumber(entry.width),
    height: getNumber(entry.height),
  };
};

const mapLink = (value: unknown, fallback: CmsLink): CmsLink => {
  const entry = unwrapEntity(value);

  if (!entry) {
    return fallback;
  }

  return {
    id: getText(entry.id, fallback.id),
    label: getText(entry.label, fallback.label),
    href: normalizeHref(entry.href, fallback.href),
    external: getBoolean(entry.external, fallback.external ?? false),
    variant:
      getText(entry.variant, fallback.variant ?? '') === 'secondary'
        ? 'secondary'
        : getText(entry.variant, fallback.variant ?? '') === 'ghost'
          ? 'ghost'
          : fallback.variant,
  };
};

const mapLinks = (value: unknown, fallback: CmsLink[]): CmsLink[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const mapped = value.map((entry, index) =>
    mapLink(entry, fallback[index] ?? { id: `link-${index}`, label: '', href: '' }),
  );

  return mapped.length > 0 ? mapped : fallback;
};

const mapFeatureItems = (value: unknown, fallback: FeatureItem[]): FeatureItem[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const mapped = value
    .map((entry, index) => {
      const record = unwrapEntity(entry);

      if (!record) {
        return null;
      }

      const fallbackItem = fallback[index] ?? fallback[0];

      return {
        id: getText(record.id, fallbackItem?.id ?? `feature-item-${index}`),
        eyebrow: getText(record.eyebrow, fallbackItem?.eyebrow ?? ''),
        title: getText(record.title, fallbackItem?.title ?? ''),
        body: getText(record.body, fallbackItem?.body ?? ''),
        metric: getText(record.metric, fallbackItem?.metric ?? ''),
      } satisfies FeatureItem;
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

  return mapped.length > 0 ? mapped : fallback;
};

const mapFaqItems = (value: unknown, fallback: FaqItem[]): FaqItem[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const mapped = value
    .map((entry, index) => {
      const record = unwrapEntity(entry);

      if (!record) {
        return null;
      }

      const fallbackItem = fallback[index] ?? fallback[0];

      return {
        id: getText(record.id, fallbackItem?.id ?? `faq-item-${index}`),
        question: getText(record.question, fallbackItem?.question ?? ''),
        answer: getText(record.answer, fallbackItem?.answer ?? ''),
      } satisfies FaqItem;
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

  return mapped.length > 0 ? mapped : fallback;
};

const mapTestimonialItems = (value: unknown, fallback: TestimonialItem[]): TestimonialItem[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const mapped = value
    .map((entry, index) => {
      const record = unwrapEntity(entry);

      if (!record) {
        return null;
      }

      const fallbackItem = fallback[index] ?? fallback[0];

      return {
        id: getText(record.id, fallbackItem?.id ?? `testimonial-item-${index}`),
        quote: getText(record.quote, fallbackItem?.quote ?? ''),
        author: getText(record.author, fallbackItem?.author ?? ''),
        role: getText(record.role, fallbackItem?.role ?? ''),
        company: getText(record.company, fallbackItem?.company ?? ''),
      } satisfies TestimonialItem;
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

  return mapped.length > 0 ? mapped : fallback;
};

const mapPageSections = (value: unknown, fallback: CmsPageSection[]): CmsPageSection[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const mapped = value
    .map((entry, index) => {
      const record = unwrapEntity(entry);

      if (!record) {
        return null;
      }

      const id = getText(record.id, `section-${index}`);
      const componentUid = getText(record.__component ?? record.component);

      if (componentUid === 'sections.rich-text') {
        return {
          id,
          type: 'rich-text',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          body: getText(record.body),
          align: getSectionAlign(record.align),
          width: getSectionWidth(record.width),
        } satisfies CmsPageRichTextSection;
      }

      if (componentUid === 'sections.feature-grid') {
        return {
          id,
          type: 'feature-grid',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          description: getText(record.description),
          columns: getSectionColumns(record.columns),
          items: filterLandingFeatureItems(mapFeatureItems(record.items, [])),
        } satisfies CmsPageFeatureGridSection;
      }

      if (componentUid === 'sections.testimonials') {
        return {
          id,
          type: 'testimonials',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          description: getText(record.description),
          columns: getSectionColumns(record.columns),
          items: mapTestimonialItems(record.items, []),
        } satisfies CmsPageTestimonialsSection;
      }

      if (componentUid === 'sections.faq') {
        return {
          id,
          type: 'faq',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          description: getText(record.description),
          items: mapFaqItems(record.items, []),
        } satisfies CmsPageFaqSection;
      }

      if (componentUid === 'sections.cta-band') {
        return {
          id,
          type: 'cta-band',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          body: getText(record.body),
          primaryCta: sanitizeLandingLink(mapLink(record.primaryCta, emptyPrimaryCta), emptyPrimaryCta),
          secondaryCta: sanitizeLandingLink(
            mapLink(record.secondaryCta, emptySecondaryCta),
            emptySecondaryCta,
          ),
        } satisfies CmsPageCtaBandSection;
      }

      if (componentUid === 'sections.contact-form') {
        return {
          id,
          type: 'contact-form',
          eyebrow: getText(record.eyebrow),
          title: getText(record.title),
          body: getText(record.body),
          nameLabel: getText(record.nameLabel),
          namePlaceholder: getText(record.namePlaceholder),
          emailLabel: getText(record.emailLabel),
          emailPlaceholder: getText(record.emailPlaceholder),
          phoneLabel: getText(record.phoneLabel),
          phonePlaceholder: getText(record.phonePlaceholder),
          subjectLabel: getText(record.subjectLabel),
          subjectPlaceholder: getText(record.subjectPlaceholder),
          messageLabel: getText(record.messageLabel),
          messagePlaceholder: getText(record.messagePlaceholder),
          submitLabel: getText(record.submitLabel),
          privacyNote: getText(record.privacyNote),
          successMessage: getText(record.successMessage),
          errorMessage: getText(record.errorMessage),
        } satisfies CmsPageContactFormSection;
      }

      return null;
    })
    .filter((section): section is CmsPageSection => section !== null);

  return mapped.length > 0 ? mapped : fallback;
};

const mapSeo = (value: unknown, fallback: SeoData, assetOrigin?: string): SeoData => {
  const record = unwrapEntity(value);

  if (!record) {
    return fallback;
  }

  const shareImage = mapMedia(record.shareImage ?? record.socialImage ?? record.image, assetOrigin);

  return {
    metaTitle: getText(record.metaTitle, fallback.metaTitle),
    metaDescription: getText(record.metaDescription, fallback.metaDescription),
    noIndex: getBoolean(record.noIndex, fallback.noIndex ?? false),
    shareImage: shareImage ?? fallback.shareImage,
  };
};

const mapGlobal = (entry: EntityRecord, fallback: GlobalData, assetOrigin?: string): GlobalData => {
  const ctaSource = entry.primaryCta ?? entry.cta;
  const mappedCta = ctaSource ? mapLink(ctaSource, fallback.cta ?? emptyPrimaryCta) : fallback.cta;

  return {
    locale: getText(entry.locale, fallback.locale),
    siteName: getText(entry.siteName, fallback.siteName),
    siteDescription: getText(entry.siteDescription, fallback.siteDescription),
    navigation: filterBlogLinks(mapLinks(entry.navigationLinks ?? entry.navigation, fallback.navigation)),
    footerLinks: filterBlogLinks(mapLinks(entry.footerLinks, fallback.footerLinks)),
    socialLinks: mapLinks(entry.socialLinks, fallback.socialLinks),
    cta: mappedCta?.label && mappedCta.href && !isBlogHref(mappedCta.href) ? mappedCta : undefined,
    seo: mapSeo(entry.defaultSeo ?? entry.seo, fallback.seo, assetOrigin),
  };
};

const mapHomepage = (entry: EntityRecord, fallback: HomepageData): HomepageData => ({
  locale: getText(entry.locale, fallback.locale),
  badge: getText(entry.heroBadge ?? entry.badge, fallback.badge),
  title: getText(entry.heroTitle ?? entry.title, fallback.title),
  subtitle: getText(entry.heroDescription ?? entry.description ?? entry.subtitle, fallback.subtitle),
  primaryCta: sanitizeLandingLink(mapLink(entry.primaryCta, fallback.primaryCta), emptyPrimaryCta),
  secondaryCta: sanitizeLandingLink(mapLink(entry.secondaryCta, fallback.secondaryCta), emptySecondaryCta),
  highlights: Array.isArray(entry.highlights)
    ? filterLandingHighlights(
        entry.highlights
          .map((item) => getText(item))
          .filter((item): item is string => item.length > 0),
      )
    : filterLandingHighlights(fallback.highlights),
  featureItems: filterLandingFeatureItems(mapFeatureItems(entry.featureItems, fallback.featureItems)),
});

const mapPage = (entry: EntityRecord, fallback: CmsPage = emptyPageFallback, assetOrigin?: string): CmsPage => {
  const title = getText(entry.title, fallback.title);
  const description = getText(entry.description, fallback.description);

  return {
    id: getText(entry.id, fallback.id),
    locale: getText(entry.locale, fallback.locale),
    slug: getText(entry.slug, fallback.slug),
    title,
    description,
    badge: getText(entry.heroBadge ?? entry.badge, fallback.badge),
    heroTitle: getText(entry.heroTitle, fallback.heroTitle || title),
    heroDescription: getText(entry.heroDescription, fallback.heroDescription || description),
    primaryCta: sanitizeLandingLink(mapLink(entry.primaryCta, fallback.primaryCta), emptyPrimaryCta),
    secondaryCta: sanitizeLandingLink(
      mapLink(entry.secondaryCta, fallback.secondaryCta),
      emptySecondaryCta,
    ),
    highlights: Array.isArray(entry.highlights)
      ? filterLandingHighlights(
          entry.highlights
            .map((item) => getText(item))
            .filter((item): item is string => item.length > 0),
        )
      : filterLandingHighlights(fallback.highlights),
    featureItems: filterLandingFeatureItems(mapFeatureItems(entry.featureItems, fallback.featureItems)),
    contentBlocks: mapPageSections(entry.contentBlocks, fallback.contentBlocks),
    seo: entry.seo ? mapSeo(entry.seo, fallback.seo ?? emptySeoData, assetOrigin) : fallback.seo,
  };
};

export const createCmsClient = (options: CmsClientOptions = {}): CmsClient => {
  const apiUrl = getText(options.apiUrl, '');
  const token = getText(options.token, '');
  const defaultLocale = getText(options.locale, '');
  const defaultStatus = isDocumentStatus(options.status) ? options.status : DEFAULT_DOCUMENT_STATUS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetch ?? (typeof fetch === 'function' ? fetch : undefined);
  const fallback = options.fallbackContent ?? defaultCmsContent;
  const assetOrigin = resolveAssetOrigin(apiUrl);

  const resolveQueryOptions = (overrides?: CmsQueryOptions) => ({
    locale: getText(overrides?.locale, defaultLocale) || undefined,
    status: isDocumentStatus(overrides?.status) ? overrides.status : defaultStatus,
  });

  const withFallbackLocale = <T extends { locale: string }>(value: T, locale?: string): T => {
    return locale ? { ...value, locale } : value;
  };

  const fallbackLocale = getText(defaultLocale, fallback.global.locale || 'pl');

  const resolveFallbackPages = (locale?: string): CmsPage[] => {
    const requestedLocale = getText(locale, fallbackLocale);
    const localizedPages = fallback.pages.filter((page) => page.locale === requestedLocale);

    if (localizedPages.length > 0) {
      return localizedPages;
    }

    const defaultPages = fallback.pages.filter((page) => page.locale === fallbackLocale);

    return defaultPages.length > 0 ? defaultPages : fallback.pages;
  };

  const requestJson = async (path: string, queryOptions?: CmsQueryOptions): Promise<unknown | null> => {
    if (!apiUrl || !fetchImpl) {
      return null;
    }

    try {
      const resolvedQueryOptions = resolveQueryOptions(queryOptions);
      const headers = new Headers({
        Accept: 'application/json',
      });

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetchImpl(buildUrl(apiUrl, appendDocumentQuery(path, resolvedQueryOptions)), {
        headers,
        signal: createRequestSignal(timeoutMs),
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as unknown;
    } catch {
      return null;
    }
  };

  return {
    async getGlobalData(queryOptions) {
      const resolvedQueryOptions = resolveQueryOptions(queryOptions);
      const payload = await requestJson('/global?populate=*', resolvedQueryOptions);

      if (payload === null) {
        return withFallbackLocale(fallback.global, resolvedQueryOptions.locale);
      }

      const entry = getSingleEntity(payload);

      return entry
        ? mapGlobal(entry, emptyGlobalData, assetOrigin)
        : withFallbackLocale(emptyGlobalData, resolvedQueryOptions.locale);
    },

    async getHomepageData(queryOptions) {
      const resolvedQueryOptions = resolveQueryOptions(queryOptions);
      const payload = await requestJson(
        `/pages?filters[slug][$eq]=home&${DEFAULT_PAGE_POPULATE_QUERY}`,
        resolvedQueryOptions,
      );

      if (payload === null) {
        return withFallbackLocale(fallback.homepage, resolvedQueryOptions.locale);
      }

      const entry = getSingleEntity(payload);

      return entry
        ? mapHomepage(entry, emptyHomepageData)
        : withFallbackLocale(emptyHomepageData, resolvedQueryOptions.locale);
    },

    async getPages(queryOptions) {
      const resolvedQueryOptions = resolveQueryOptions(queryOptions);
      const payload = await requestJson(
        `/pages?sort[0]=title:asc&${DEFAULT_PAGE_POPULATE_QUERY}`,
        resolvedQueryOptions,
      );

      if (payload === null) {
        return resolveFallbackPages(resolvedQueryOptions.locale);
      }

      const entries = getEntityList(payload);

      if (entries.length === 0) {
        return [];
      }

      const fallbackPages = resolveFallbackPages(resolvedQueryOptions.locale);

      return entries
        .map((entry) => {
          const fallbackPage =
            fallbackPages.find((page) => page.slug === getText(entry.slug)) ?? emptyPageFallback;

          return mapPage(entry, fallbackPage, assetOrigin);
        })
        .filter((page) => page.slug && !isBlogSlug(page.slug));
    },

    async getPageBySlug(slug, queryOptions) {
      if (isBlogSlug(slug)) {
        return undefined;
      }

      const resolvedQueryOptions = resolveQueryOptions(queryOptions);
      const payload = await requestJson(
        `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&${DEFAULT_PAGE_POPULATE_QUERY}`,
        resolvedQueryOptions,
      );
      const fallbackPage =
        resolveFallbackPages(resolvedQueryOptions.locale).find((page) => page.slug === slug) ??
        fallback.pages.find((page) => page.slug === slug);

      if (payload === null) {
        return fallbackPage ? withFallbackLocale(fallbackPage, resolvedQueryOptions.locale) : undefined;
      }

      const entry = getSingleEntity(payload);

      return entry ? mapPage(entry, fallbackPage ?? emptyPageFallback, assetOrigin) : undefined;
    },

    async getCmsHealth() {
      const payload = await requestJson('/global?populate=defaultSeo');

      if (!apiUrl) {
        return {
          reachable: false,
          source: 'fallback',
          reason: 'CMS_API_URL is not configured.',
        } satisfies CmsHealth;
      }

      if (!payload) {
        return {
          reachable: false,
          source: 'fallback',
          apiUrl,
          reason: 'CMS is unavailable or content has not been created yet.',
        } satisfies CmsHealth;
      }

      return {
        reachable: true,
        source: 'remote',
        apiUrl,
      } satisfies CmsHealth;
    },
  };
};
