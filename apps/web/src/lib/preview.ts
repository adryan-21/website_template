import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';
import { defaultLocale, normalizeLocale } from './site';

type PreviewTokenPayload = {
  path: string;
  locale: string;
  slug: string;
  issuedAt: number;
  expiresAt: number;
};

type PreviewSessionPayload = {
  enabled: true;
  issuedAt: number;
  expiresAt: number;
};

const previewCookieName = 'website_template_preview';
const defaultPreviewTtlSeconds = 15 * 60;

const getPreviewSecret = () =>
  import.meta.env.WEB_PREVIEW_SECRET ?? import.meta.env.CMS_PREVIEW_SECRET ?? '';

const getPreviewTtlSeconds = () => {
  const value =
    import.meta.env.WEB_PREVIEW_TOKEN_TTL_SECONDS ??
    import.meta.env.CMS_PREVIEW_TOKEN_TTL_SECONDS ??
    `${defaultPreviewTtlSeconds}`;
  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? defaultPreviewTtlSeconds : parsed;
};

const createSignature = (body: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(body).digest('base64url');
};

const createSignedPayload = (payload: PreviewSessionPayload | PreviewTokenPayload, secret: string) => {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createSignature(body, secret);

  return `${body}.${signature}`;
};

const parseSignedPayload = <T>(token: string, secret: string): T | null => {
  const [body, signature] = token.split('.');

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createSignature(body, secret);
  const providedBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
};

const isFutureTimestamp = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value > Date.now();
};

const isSafePreviewPath = (value: unknown): value is string => {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
};

export const sanitizeRedirectPath = (value: string | null, fallbackPath = '/'): string => {
  return value && isSafePreviewPath(value) ? value : fallbackPath;
};

export const verifyPreviewToken = (token: string): PreviewTokenPayload | null => {
  const secret = getPreviewSecret();

  if (!secret) {
    return null;
  }

  const payload = parseSignedPayload<PreviewTokenPayload>(token, secret);

  if (!payload || !isSafePreviewPath(payload.path) || !isFutureTimestamp(payload.expiresAt)) {
    return null;
  }

  return {
    ...payload,
    locale: normalizeLocale(payload.locale ?? defaultLocale),
  };
};

export const enablePreviewSession = (cookies: AstroCookies, payload: PreviewTokenPayload) => {
  const secret = getPreviewSecret();

  if (!secret) {
    throw new Error('Preview mode is not configured on the web side.');
  }

  const sessionValue = createSignedPayload(
    {
      enabled: true,
      issuedAt: payload.issuedAt,
      expiresAt: payload.expiresAt,
    },
    secret,
  );

  const maxAge = Math.max(1, Math.floor((payload.expiresAt - Date.now()) / 1000));

  cookies.set(previewCookieName, sessionValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge,
  });
};

export const clearPreviewSession = (cookies: AstroCookies) => {
  cookies.delete(previewCookieName, {
    path: '/',
  });
};

export const isPreviewEnabled = (cookies: AstroCookies): boolean => {
  const secret = getPreviewSecret();
  const previewSession = cookies.get(previewCookieName)?.value;

  if (!secret || !previewSession) {
    return false;
  }

  const payload = parseSignedPayload<PreviewSessionPayload>(previewSession, secret);

  return Boolean(payload?.enabled && isFutureTimestamp(payload.expiresAt));
};

export const getPreviewConfig = () => ({
  enabled: Boolean(getPreviewSecret()),
  ttlSeconds: getPreviewTtlSeconds(),
});