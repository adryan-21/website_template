export const supportedLocales = ['pl', 'en'] as const;

export type SiteLocale = (typeof supportedLocales)[number];

export type LocaleSwitchLink = {
  locale: SiteLocale;
  label: string;
  href: string;
};

export const defaultLocale: SiteLocale = 'pl';

const localeLabels: Record<SiteLocale, string> = {
  pl: 'PL',
  en: 'EN',
};

const normalizePathname = (value: string): string => {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  const normalized = withLeadingSlash.replace(/\/+$/, '');

  return normalized.length > 0 ? normalized : '/';
};

export const isSiteLocale = (value: unknown): value is SiteLocale => {
  return typeof value === 'string' && supportedLocales.includes(value as SiteLocale);
};

export const normalizeLocale = (value: unknown): SiteLocale => {
  return isSiteLocale(value) ? value : defaultLocale;
};

export const stripLocalePrefix = (pathname: string): string => {
  const normalized = normalizePathname(pathname);

  if (normalized === '/en') {
    return '/';
  }

  if (normalized.startsWith('/en/')) {
    return normalized.slice('/en'.length);
  }

  return normalized;
};

export const buildLocalePath = (locale: SiteLocale, pathname: string): string => {
  const basePath = stripLocalePrefix(pathname);

  if (locale === 'pl') {
    return basePath;
  }

  return basePath === '/' ? '/en' : `/en${basePath}`;
};

export const buildPagePath = (locale: SiteLocale, slug = 'home'): string => {
  const normalizedSlug = slug.trim().replace(/^\/+/, '').replace(/\/+$/, '') || 'home';

  return buildLocalePath(locale, normalizedSlug === 'home' ? '/' : `/${normalizedSlug}`);
};

export const localizeHref = (href: string, locale: SiteLocale): string => {
  if (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }

  if (!href.startsWith('/')) {
    return href;
  }

  if (href.startsWith('/api/') || href.startsWith('/admin') || href.startsWith('/uploads/')) {
    return href;
  }

  return buildLocalePath(locale, href);
};

export const getLocaleSwitchLinks = (pathname: string): LocaleSwitchLink[] => {
  return supportedLocales.map((locale) => ({
    locale,
    label: localeLabels[locale],
    href: buildLocalePath(locale, pathname),
  }));
};