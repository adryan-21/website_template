import crypto from 'node:crypto';
import { normalizeLocale } from '@/lib/site';

export const prerender = false;

type ContactRequestInput = {
  locale?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

type ContactPayload = {
  locale: 'pl' | 'en';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

type ContactResponse =
  | {
      success: true;
      messageId: string;
      message: string;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string>;
    };

type ContactWebhookEnvelope = {
  messageId: string;
  timestamp: string;
  source: 'website-template-web';
  payload: ContactPayload;
};

const truthyValues = new Set(['1', 'true', 'yes', 'on']);
const rateLimitStore = new Map<string, number[]>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{6,40}$/;
const payloadLimitBytes = 50 * 1024;
const webhookTimeoutMs = 5000;

const getEnvValue = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
};

const getBooleanEnv = (keys: string[], fallback = false): boolean => {
  const value = getEnvValue(...keys);

  if (!value) {
    return fallback;
  }

  return truthyValues.has(value.toLowerCase());
};

const getPositiveIntEnv = (keys: string[], fallback: number): number => {
  const value = getEnvValue(...keys);

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
};

const getMessages = (locale: 'pl' | 'en') =>
  locale === 'en'
    ? {
        invalidJson: 'Invalid request payload.',
        invalidContentType: 'The contact endpoint accepts JSON only.',
        payloadTooLarge: 'The request payload is too large.',
        disabled: 'The contact form is currently disabled.',
        misconfigured: 'The contact flow is not configured on the server.',
        rateLimited: 'Too many attempts. Please wait a moment and try again.',
        success: 'Thanks! Your message has been sent.',
        upstreamFailure: 'The message could not be forwarded right now. Please try again later.',
        genericError: 'The contact form could not be submitted right now.',
      }
    : {
        invalidJson: 'Nieprawidłowy payload żądania.',
        invalidContentType: 'Endpoint kontaktowy przyjmuje tylko JSON.',
        payloadTooLarge: 'Payload żądania jest zbyt duży.',
        disabled: 'Formularz kontaktowy jest obecnie wyłączony.',
        misconfigured: 'Kontakt nie został jeszcze skonfigurowany po stronie serwera.',
        rateLimited: 'Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.',
        success: 'Dzięki! Twoja wiadomość została wysłana.',
        upstreamFailure: 'Nie udało się przekazać wiadomości dalej. Spróbuj ponownie za chwilę.',
        genericError: 'Nie udało się teraz wysłać formularza kontaktowego.',
      };

const json = (body: ContactResponse, status = 200): Response => {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};

const getRateLimitState = (ip: string) => {
  const windowMs = getPositiveIntEnv(
    ['CONTACT_RATE_LIMIT_WINDOW_MS', 'WEB_CONTACT_RATE_LIMIT_WINDOW_MS'],
    60_000,
  );
  const maxRequests = getPositiveIntEnv(
    ['CONTACT_RATE_LIMIT_MAX_REQUESTS', 'WEB_CONTACT_RATE_LIMIT_MAX_REQUESTS'],
    5,
  );
  const now = Date.now();
  const validTimestamps = (rateLimitStore.get(ip) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (validTimestamps.length >= maxRequests) {
    rateLimitStore.set(ip, validTimestamps);

    return { limited: true, windowMs, maxRequests };
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);

  return { limited: false, windowMs, maxRequests };
};

const getTrimmedString = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const validatePayload = (input: ContactRequestInput): { payload?: ContactPayload; errors: Record<string, string> } => {
  const locale = normalizeLocale(getTrimmedString(input.locale));
  const name = getTrimmedString(input.name);
  const email = getTrimmedString(input.email).toLowerCase();
  const phone = getTrimmedString(input.phone);
  const subject = getTrimmedString(input.subject);
  const message = getTrimmedString(input.message);
  const errors: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    errors.name = locale === 'en' ? 'Name must contain 2 to 100 characters.' : 'Imię musi mieć od 2 do 100 znaków.';
  }

  if (!emailPattern.test(email) || email.length > 160) {
    errors.email = locale === 'en' ? 'Provide a valid email address.' : 'Podaj poprawny adres email.';
  }

  if (subject.length < 3 || subject.length > 200) {
    errors.subject =
      locale === 'en' ? 'Subject must contain 3 to 200 characters.' : 'Temat musi mieć od 3 do 200 znaków.';
  }

  if (message.length < 10 || message.length > 5000) {
    errors.message =
      locale === 'en'
        ? 'Message must contain 10 to 5000 characters.'
        : 'Wiadomość musi mieć od 10 do 5000 znaków.';
  }

  if (phone && (!phonePattern.test(phone) || phone.length > 40)) {
    errors.phone = locale === 'en' ? 'Phone number format is invalid.' : 'Format numeru telefonu jest nieprawidłowy.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors,
    payload: {
      locale,
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    },
  };
};

export async function POST({ request }: { request: Request }) {
  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10);

  if (Number.isFinite(contentLength) && contentLength > payloadLimitBytes) {
    return json(
      {
        success: false,
        message: getMessages('pl').payloadTooLarge,
      },
      413,
    );
  }

  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return json(
      {
        success: false,
        message: getMessages('pl').invalidContentType,
      },
      415,
    );
  }

  let input: ContactRequestInput;

  try {
    input = (await request.json()) as ContactRequestInput;
  } catch {
    return json(
      {
        success: false,
        message: getMessages('pl').invalidJson,
      },
      400,
    );
  }

  const locale = normalizeLocale(getTrimmedString(input.locale));
  const messages = getMessages(locale);
  const contactEnabled = getBooleanEnv(['CONTACT_ENABLED', 'WEB_CONTACT_ENABLED'], false);

  if (!contactEnabled) {
    return json(
      {
        success: false,
        message: messages.disabled,
      },
      503,
    );
  }

  const rateLimitState = getRateLimitState(getClientIp(request));

  if (rateLimitState.limited) {
    return json(
      {
        success: false,
        message: messages.rateLimited,
      },
      429,
    );
  }

  const validation = validatePayload(input);

  if (!validation.payload) {
    return json(
      {
        success: false,
        message: messages.genericError,
        errors: validation.errors,
      },
      400,
    );
  }

  const webhookUrl = getEnvValue('CONTACT_WEBHOOK_URL', 'WEB_CONTACT_WEBHOOK_URL');
  const webhookSecret = getEnvValue('CONTACT_WEBHOOK_SECRET', 'WEB_CONTACT_WEBHOOK_SECRET');

  if (!webhookUrl || !webhookSecret) {
    return json(
      {
        success: false,
        message: messages.misconfigured,
      },
      500,
    );
  }

  const messageId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const envelope: ContactWebhookEnvelope = {
    messageId,
    timestamp,
    source: 'website-template-web',
    payload: validation.payload,
  };
  const body = JSON.stringify(envelope);
  const signature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-website-template-signature': signature,
        'x-website-template-signature-algorithm': 'sha256',
        'x-website-template-message-id': messageId,
        'x-website-template-timestamp': timestamp,
      },
      body,
      signal: AbortSignal.timeout(webhookTimeoutMs),
    });

    if (!response.ok) {
      return json(
        {
          success: false,
          message: messages.upstreamFailure,
        },
        502,
      );
    }
  } catch {
    return json(
      {
        success: false,
        message: messages.upstreamFailure,
      },
      502,
    );
  }

  return json({
    success: true,
    messageId,
    message: messages.success,
  });
}