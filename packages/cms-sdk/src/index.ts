export type LinkVariant = 'primary' | 'secondary' | 'ghost';

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

export interface GlobalData {
  siteName: string;
  siteDescription: string;
  navigation: CmsLink[];
  footerLinks: CmsLink[];
  socialLinks: CmsLink[];
  cta?: CmsLink;
  seo: SeoData;
}

export interface HomepageData {
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
  slug: string;
  title: string;
  description: string;
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
  timeoutMs?: number;
  fetch?: typeof fetch;
  fallbackContent?: CmsContent;
}

export interface CmsClient {
  getGlobalData(): Promise<GlobalData>;
  getHomepageData(): Promise<HomepageData>;
  getPages(): Promise<CmsPage[]>;
  getPageBySlug(slug: string): Promise<CmsPage | undefined>;
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
  siteName: '',
  siteDescription: '',
  navigation: [],
  footerLinks: [],
  socialLinks: [],
  cta: undefined,
  seo: emptySeoData,
};

const emptyHomepageData: HomepageData = {
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
  slug: '',
  title: '',
  description: '',
};

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
      slug: 'home',
      title: 'Start',
      description: 'Landing page startowy dla template’u opartego o Astro, Vue i Strapi.',
    },
  ],
};

const DEFAULT_TIMEOUT_MS = 2000;

const isRecord = (value: unknown): value is EntityRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

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

      if (!fallbackItem) {
        return null;
      }

      return {
        id: getText(record.id, fallbackItem.id),
        eyebrow: getText(record.eyebrow, fallbackItem.eyebrow ?? ''),
        title: getText(record.title, fallbackItem.title),
        body: getText(record.body, fallbackItem.body),
        metric: getText(record.metric, fallbackItem.metric ?? ''),
      } satisfies FeatureItem;
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

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

const mapPage = (entry: EntityRecord, fallback?: CmsPage): CmsPage => ({
  id: getText(entry.id, fallback?.id ?? ''),
  slug: getText(entry.slug, fallback?.slug ?? ''),
  title: getText(entry.title, fallback?.title ?? ''),
  description: getText(entry.description, fallback?.description ?? ''),
  seo: fallback?.seo,
});

export const createCmsClient = (options: CmsClientOptions = {}): CmsClient => {
  const apiUrl = getText(options.apiUrl, '');
  const token = getText(options.token, '');
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetch ?? (typeof fetch === 'function' ? fetch : undefined);
  const fallback = options.fallbackContent ?? defaultCmsContent;
  const assetOrigin = resolveAssetOrigin(apiUrl);

  const requestJson = async (path: string): Promise<unknown | null> => {
    if (!apiUrl || !fetchImpl) {
      return null;
    }

    try {
      const headers = new Headers({
        Accept: 'application/json',
      });

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await fetchImpl(buildUrl(apiUrl, path), {
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
    async getGlobalData() {
      const payload = await requestJson('/global?populate=*');

      if (payload === null) {
        return fallback.global;
      }

      const entry = getSingleEntity(payload);

      return entry ? mapGlobal(entry, emptyGlobalData, assetOrigin) : emptyGlobalData;
    },

    async getHomepageData() {
      const payload = await requestJson('/pages?filters[slug][$eq]=home&populate=*');

      if (payload === null) {
        return fallback.homepage;
      }

      const entry = getSingleEntity(payload);

      return entry ? mapHomepage(entry, emptyHomepageData) : emptyHomepageData;
    },

    async getPages() {
      const payload = await requestJson('/pages?sort[0]=title:asc&populate=*');

      if (payload === null) {
        return fallback.pages;
      }

      const entries = getEntityList(payload);

      if (entries.length === 0) {
        return [];
      }

      return entries
        .map((entry) => mapPage(entry, emptyPageFallback))
        .filter((page) => page.slug && !isBlogSlug(page.slug));
    },

    async getPageBySlug(slug) {
      if (isBlogSlug(slug)) {
        return undefined;
      }

      const payload = await requestJson(`/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
      const fallbackPage = fallback.pages.find((page) => page.slug === slug);

      if (payload === null) {
        return fallbackPage;
      }

      const entry = getSingleEntity(payload);

      return entry ? mapPage(entry, emptyPageFallback) : undefined;
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
