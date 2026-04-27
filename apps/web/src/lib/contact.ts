import crypto from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeLocale } from '@/lib/site';

export type ContactRequestInput = {
  locale?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

export type ContactPayload = {
  locale: 'pl' | 'en';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type ContactSubmissionResponse =
  | {
      success: true;
      messageId: string;
      message: string;
      queued?: boolean;
      delivery?: {
        deliveredProviders: number;
        queuedProviders: number;
        failedProviders: number;
      };
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string>;
    };

export type ContactQueueStatus = {
  enabled: boolean;
  pending: number;
  due: number;
  nextAttemptAt?: string;
};

export type ContactQueueFlushResponse = {
  success: true;
  message: string;
  queue: ContactQueueStatus & {
    processed: number;
    succeeded: number;
    rescheduled: number;
    dropped: number;
  };
};

type ContactEnvelope = {
  messageId: string;
  timestamp: string;
  source: 'website-template-web';
  payload: ContactPayload;
};

type SignedWebhookProvider = {
  id: 'primary-webhook' | 'crm-webhook';
  kind: 'signed-webhook';
  url: string;
  secret: string;
};

type ResendEmailProvider = {
  id: 'resend-email';
  kind: 'resend-email';
  apiKey: string;
  from: string;
  to: string[];
  replyTo?: string;
};

type ContactProvider = SignedWebhookProvider | ResendEmailProvider;

type DeliveryResult = {
  providerId: ContactProvider['id'];
  status: 'success' | 'retryable-failure' | 'permanent-failure';
  statusCode?: number;
  error?: string;
};

type QueueItem = {
  version: 1;
  id: string;
  providerId: ContactProvider['id'];
  queuedAt: string;
  nextAttemptAt: string;
  attempts: number;
  envelope: ContactEnvelope;
  lastError?: string;
};

type QueueRuntimeConfig = {
  enabled: boolean;
  directory: string;
  secret?: string;
  maxAttempts: number;
  retryBaseDelayMs: number;
  processLimit: number;
};

type ContactRuntimeConfig = {
  enabled: boolean;
  providers: ContactProvider[];
  queue: QueueRuntimeConfig;
};

const source = 'website-template-web' as const;
const truthyValues = new Set(['1', 'true', 'yes', 'on']);
const rateLimitStore = new Map<string, number[]>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{6,40}$/;
const payloadLimitBytes = 50 * 1024;
const providerTimeoutMs = 5000;
const queueFileExtension = '.json';
const queueWorkingSuffix = '.working';

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

const getTrimmedString = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const splitCsvEnv = (value: string | undefined): string[] => {
  return value
    ? value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];
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
        success: 'Thanks! Your message has been received.',
        accepted: 'Thanks! Your message has been accepted and queued for delivery.',
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
        success: 'Dzięki! Twoja wiadomość została przyjęta.',
        accepted: 'Dzięki! Twoja wiadomość została przyjęta i trafiła do kolejki ponownej dostawy.',
        upstreamFailure: 'Nie udało się przekazać wiadomości dalej. Spróbuj ponownie za chwilę.',
        genericError: 'Nie udało się teraz wysłać formularza kontaktowego.',
      };

export const jsonNoStore = <T>(body: T, status = 200): Response => {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};

export const getPayloadLimitBytes = (): number => payloadLimitBytes;

export const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
};

export const getRateLimitState = (ip: string) => {
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

export const validatePayload = (
  input: ContactRequestInput,
): { payload?: ContactPayload; errors: Record<string, string> } => {
  const locale = normalizeLocale(getTrimmedString(input.locale));
  const name = getTrimmedString(input.name);
  const email = getTrimmedString(input.email).toLowerCase();
  const phone = getTrimmedString(input.phone);
  const subject = getTrimmedString(input.subject);
  const message = getTrimmedString(input.message);
  const errors: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    errors.name =
      locale === 'en' ? 'Name must contain 2 to 100 characters.' : 'Imię musi mieć od 2 do 100 znaków.';
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

const getQueueDirectory = (): string => {
  const configuredDirectory = getEnvValue('CONTACT_QUEUE_DIRECTORY', 'WEB_CONTACT_QUEUE_DIRECTORY');

  return path.resolve(configuredDirectory ?? '.contact-queue');
};

const getContactRuntimeConfig = (): ContactRuntimeConfig => {
  const providers: ContactProvider[] = [];
  const webhookUrl = getEnvValue('CONTACT_WEBHOOK_URL', 'WEB_CONTACT_WEBHOOK_URL');
  const webhookSecret = getEnvValue('CONTACT_WEBHOOK_SECRET', 'WEB_CONTACT_WEBHOOK_SECRET');
  const crmWebhookUrl = getEnvValue('CONTACT_CRM_WEBHOOK_URL', 'WEB_CONTACT_CRM_WEBHOOK_URL');
  const crmWebhookSecret = getEnvValue('CONTACT_CRM_WEBHOOK_SECRET', 'WEB_CONTACT_CRM_WEBHOOK_SECRET');
  const resendApiKey = getEnvValue('CONTACT_RESEND_API_KEY', 'WEB_CONTACT_RESEND_API_KEY');
  const resendFromEmail = getEnvValue('CONTACT_RESEND_FROM_EMAIL', 'WEB_CONTACT_RESEND_FROM_EMAIL');
  const resendToEmail = getEnvValue('CONTACT_RESEND_TO_EMAIL', 'WEB_CONTACT_RESEND_TO_EMAIL');
  const resendReplyToEmail = getEnvValue(
    'CONTACT_RESEND_REPLY_TO_EMAIL',
    'WEB_CONTACT_RESEND_REPLY_TO_EMAIL',
  );

  if (webhookUrl && webhookSecret) {
    providers.push({
      id: 'primary-webhook',
      kind: 'signed-webhook',
      url: webhookUrl,
      secret: webhookSecret,
    });
  }

  if (crmWebhookUrl && crmWebhookSecret) {
    providers.push({
      id: 'crm-webhook',
      kind: 'signed-webhook',
      url: crmWebhookUrl,
      secret: crmWebhookSecret,
    });
  }

  if (resendApiKey && resendFromEmail && resendToEmail) {
    providers.push({
      id: 'resend-email',
      kind: 'resend-email',
      apiKey: resendApiKey,
      from: resendFromEmail,
      to: splitCsvEnv(resendToEmail),
      replyTo: resendReplyToEmail,
    });
  }

  return {
    enabled: getBooleanEnv(['CONTACT_ENABLED', 'WEB_CONTACT_ENABLED'], false),
    providers,
    queue: {
      enabled: getBooleanEnv(['CONTACT_QUEUE_ENABLED', 'WEB_CONTACT_QUEUE_ENABLED'], false),
      directory: getQueueDirectory(),
      secret: getEnvValue('CONTACT_QUEUE_SECRET', 'WEB_CONTACT_QUEUE_SECRET'),
      maxAttempts: getPositiveIntEnv(['CONTACT_QUEUE_MAX_ATTEMPTS', 'WEB_CONTACT_QUEUE_MAX_ATTEMPTS'], 5),
      retryBaseDelayMs: getPositiveIntEnv(
        ['CONTACT_QUEUE_RETRY_BASE_DELAY_MS', 'WEB_CONTACT_QUEUE_RETRY_BASE_DELAY_MS'],
        30_000,
      ),
      processLimit: getPositiveIntEnv(['CONTACT_QUEUE_PROCESS_LIMIT', 'WEB_CONTACT_QUEUE_PROCESS_LIMIT'], 20),
    },
  };
};

const createEnvelope = (payload: ContactPayload): ContactEnvelope => {
  return {
    messageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source,
    payload,
  };
};

const createSignedWebhookHeaders = (body: string, secret: string, envelope: ContactEnvelope, providerId: string) => {
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-website-template-signature': signature,
    'x-website-template-signature-algorithm': 'sha256',
    'x-website-template-message-id': envelope.messageId,
    'x-website-template-timestamp': envelope.timestamp,
    'x-website-template-provider-id': providerId,
  };
};

const isRetryableStatus = (status: number): boolean => {
  return status === 408 || status === 425 || status === 429 || status >= 500;
};

const escapeHtml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};

const buildResendTextBody = (envelope: ContactEnvelope): string => {
  const { payload } = envelope;

  return [
    'New contact form submission',
    '',
    `Message ID: ${envelope.messageId}`,
    `Timestamp: ${envelope.timestamp}`,
    `Locale: ${payload.locale}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone ?? '—'}`,
    `Subject: ${payload.subject}`,
    '',
    payload.message,
  ].join('\n');
};

const buildResendHtmlBody = (envelope: ContactEnvelope): string => {
  const { payload } = envelope;

  return [
    '<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#18181b">',
    '<h1 style="font-size:20px;margin-bottom:16px">New contact form submission</h1>',
    '<ul style="padding-left:20px;margin:0 0 20px">',
    `<li><strong>Message ID:</strong> ${escapeHtml(envelope.messageId)}</li>`,
    `<li><strong>Timestamp:</strong> ${escapeHtml(envelope.timestamp)}</li>`,
    `<li><strong>Locale:</strong> ${escapeHtml(payload.locale)}</li>`,
    `<li><strong>Name:</strong> ${escapeHtml(payload.name)}</li>`,
    `<li><strong>Email:</strong> ${escapeHtml(payload.email)}</li>`,
    `<li><strong>Phone:</strong> ${escapeHtml(payload.phone ?? '—')}</li>`,
    `<li><strong>Subject:</strong> ${escapeHtml(payload.subject)}</li>`,
    '</ul>',
    `<p style="white-space:pre-line">${escapeHtml(payload.message)}</p>`,
    '</div>',
  ].join('');
};

const deliverViaSignedWebhook = async (
  provider: SignedWebhookProvider,
  envelope: ContactEnvelope,
): Promise<DeliveryResult> => {
  const body = JSON.stringify(envelope);

  try {
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: createSignedWebhookHeaders(body, provider.secret, envelope, provider.id),
      body,
      signal: AbortSignal.timeout(providerTimeoutMs),
    });

    if (response.ok) {
      return {
        providerId: provider.id,
        status: 'success',
        statusCode: response.status,
      };
    }

    return {
      providerId: provider.id,
      status: isRetryableStatus(response.status) ? 'retryable-failure' : 'permanent-failure',
      statusCode: response.status,
      error: `Provider returned HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      providerId: provider.id,
      status: 'retryable-failure',
      error: error instanceof Error ? error.message : 'Unknown signed webhook error.',
    };
  }
};

const deliverViaResend = async (
  provider: ResendEmailProvider,
  envelope: ContactEnvelope,
): Promise<DeliveryResult> => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: provider.from,
        to: provider.to,
        reply_to: provider.replyTo || envelope.payload.email,
        subject: envelope.payload.subject,
        text: buildResendTextBody(envelope),
        html: buildResendHtmlBody(envelope),
      }),
      signal: AbortSignal.timeout(providerTimeoutMs),
    });

    if (response.ok) {
      return {
        providerId: provider.id,
        status: 'success',
        statusCode: response.status,
      };
    }

    return {
      providerId: provider.id,
      status: isRetryableStatus(response.status) ? 'retryable-failure' : 'permanent-failure',
      statusCode: response.status,
      error: `Provider returned HTTP ${response.status}.`,
    };
  } catch (error) {
    return {
      providerId: provider.id,
      status: 'retryable-failure',
      error: error instanceof Error ? error.message : 'Unknown email provider error.',
    };
  }
};

const deliverToProvider = async (
  provider: ContactProvider,
  envelope: ContactEnvelope,
): Promise<DeliveryResult> => {
  if (provider.kind === 'signed-webhook') {
    return deliverViaSignedWebhook(provider, envelope);
  }

  return deliverViaResend(provider, envelope);
};

const ensureQueueDirectory = async (directory: string): Promise<void> => {
  await mkdir(directory, { recursive: true });
};

const getQueueFilePath = (directory: string, itemId: string): string => {
  return path.join(directory, `${itemId}${queueFileExtension}`);
};

const writeQueueItem = async (directory: string, item: QueueItem): Promise<void> => {
  await ensureQueueDirectory(directory);
  await writeFile(getQueueFilePath(directory, item.id), JSON.stringify(item, null, 2), 'utf8');
};

const listQueueFiles = async (directory: string): Promise<string[]> => {
  try {
    const entries = await readdir(directory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(queueFileExtension))
      .map((entry) => path.join(directory, entry.name));
  } catch (error) {
    const errorCode = (error as { code?: string }).code;

    if (errorCode === 'ENOENT') {
      return [];
    }

    throw error;
  }
};

const readQueueItem = async (filePath: string): Promise<QueueItem | null> => {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as QueueItem;

    if (!parsed?.id || !parsed?.providerId || !parsed?.envelope?.messageId || !parsed?.nextAttemptAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const deleteFileIfExists = async (filePath: string): Promise<void> => {
  try {
    await rm(filePath, { force: true });
  } catch {
    // noop on cleanup
  }
};

const enqueueRetryableFailures = async (
  envelope: ContactEnvelope,
  results: DeliveryResult[],
  queue: QueueRuntimeConfig,
): Promise<number> => {
  if (!queue.enabled) {
    return 0;
  }

  const retryableResults = results.filter((result) => result.status === 'retryable-failure');

  if (retryableResults.length === 0) {
    return 0;
  }

  let queuedCount = 0;

  for (const result of retryableResults) {
    const item: QueueItem = {
      version: 1,
      id: crypto.randomUUID(),
      providerId: result.providerId,
      queuedAt: new Date().toISOString(),
      nextAttemptAt: new Date(Date.now() + queue.retryBaseDelayMs).toISOString(),
      attempts: 1,
      envelope,
      lastError: result.error,
    };

    try {
      await writeQueueItem(queue.directory, item);
      queuedCount += 1;
    } catch (error) {
      console.error('[contact] Failed to persist retry queue item.', error);
    }
  }

  return queuedCount;
};

const getQueueStatusInternal = async (queue: QueueRuntimeConfig): Promise<ContactQueueStatus> => {
  if (!queue.enabled) {
    return {
      enabled: false,
      pending: 0,
      due: 0,
    };
  }

  const files = await listQueueFiles(queue.directory);
  const items = (await Promise.all(files.map((filePath) => readQueueItem(filePath))))
    .filter((item): item is QueueItem => item !== null)
    .sort((left, right) => left.nextAttemptAt.localeCompare(right.nextAttemptAt));
  const now = Date.now();
  const due = items.filter((item) => Date.parse(item.nextAttemptAt) <= now).length;

  return {
    enabled: true,
    pending: items.length,
    due,
    nextAttemptAt: items[0]?.nextAttemptAt,
  };
};

const claimQueueFile = async (filePath: string): Promise<string | null> => {
  const claimedPath = `${filePath}${queueWorkingSuffix}`;

  try {
    await rename(filePath, claimedPath);
    return claimedPath;
  } catch (error) {
    const errorCode = (error as { code?: string }).code;

    if (errorCode === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

const restoreQueueFile = async (workingFilePath: string, item: QueueItem): Promise<void> => {
  await writeFile(workingFilePath, JSON.stringify(item, null, 2), 'utf8');
  await rename(workingFilePath, workingFilePath.replace(new RegExp(`${queueWorkingSuffix}$`), ''));
};

const rescheduleQueueItem = (item: QueueItem, queue: QueueRuntimeConfig, error?: string): QueueItem => {
  const nextAttempts = item.attempts + 1;
  const exponent = Math.max(nextAttempts - 1, 1);
  const delayMs = queue.retryBaseDelayMs * 2 ** (exponent - 1);

  return {
    ...item,
    attempts: nextAttempts,
    nextAttemptAt: new Date(Date.now() + delayMs).toISOString(),
    lastError: error,
  };
};

const resolveProviderById = (
  providerId: ContactProvider['id'],
  providers: ContactProvider[],
): ContactProvider | undefined => {
  return providers.find((provider) => provider.id === providerId);
};

const flushQueueInternal = async (
  queue: QueueRuntimeConfig,
  providers: ContactProvider[],
  limit = queue.processLimit,
) => {
  const statusBefore = await getQueueStatusInternal(queue);

  if (!queue.enabled || statusBefore.pending === 0 || limit <= 0) {
    return {
      processed: 0,
      succeeded: 0,
      rescheduled: 0,
      dropped: 0,
      ...statusBefore,
    };
  }

  const files = await listQueueFiles(queue.directory);
  const candidates = (await Promise.all(
    files.map(async (filePath) => {
      const item = await readQueueItem(filePath);
      return item ? { filePath, item } : null;
    }),
  ))
    .filter((entry): entry is { filePath: string; item: QueueItem } => entry !== null)
    .filter((entry) => Date.parse(entry.item.nextAttemptAt) <= Date.now())
    .sort((left, right) => left.item.nextAttemptAt.localeCompare(right.item.nextAttemptAt))
    .slice(0, limit);

  let processed = 0;
  let succeeded = 0;
  let rescheduled = 0;
  let dropped = 0;

  for (const candidate of candidates) {
    const claimedPath = await claimQueueFile(candidate.filePath);

    if (!claimedPath) {
      continue;
    }

    const item = await readQueueItem(claimedPath);

    if (!item) {
      await deleteFileIfExists(claimedPath);
      dropped += 1;
      processed += 1;
      continue;
    }

    const provider = resolveProviderById(item.providerId, providers);
    const deliveryResult = provider
      ? await deliverToProvider(provider, item.envelope)
      : ({
          providerId: item.providerId,
          status: 'retryable-failure',
          error: `Provider "${item.providerId}" is not configured.`,
        } satisfies DeliveryResult);

    processed += 1;

    if (deliveryResult.status === 'success') {
      await deleteFileIfExists(claimedPath);
      succeeded += 1;
      continue;
    }

    if (deliveryResult.status === 'retryable-failure' && item.attempts < queue.maxAttempts) {
      const rescheduledItem = rescheduleQueueItem(item, queue, deliveryResult.error);
      await restoreQueueFile(claimedPath, rescheduledItem);
      rescheduled += 1;
      continue;
    }

    console.warn('[contact] Dropping queued delivery after terminal failure.', {
      providerId: item.providerId,
      messageId: item.envelope.messageId,
      attempts: item.attempts,
      error: deliveryResult.error,
      statusCode: deliveryResult.statusCode,
    });
    await deleteFileIfExists(claimedPath);
    dropped += 1;
  }

  return {
    processed,
    succeeded,
    rescheduled,
    dropped,
    ...(await getQueueStatusInternal(queue)),
  };
};

const deliverEnvelope = async (envelope: ContactEnvelope, runtime: ContactRuntimeConfig) => {
  const results = await Promise.all(runtime.providers.map((provider) => deliverToProvider(provider, envelope)));
  const queuedCount = await enqueueRetryableFailures(envelope, results, runtime.queue);

  for (const result of results) {
    if (result.status === 'permanent-failure') {
      console.warn('[contact] Provider failed permanently.', result);
    }

    if (result.status === 'retryable-failure' && !runtime.queue.enabled) {
      console.warn('[contact] Provider failed and retry queue is disabled.', result);
    }
  }

  return {
    results,
    queuedCount,
    deliveredCount: results.filter((result) => result.status === 'success').length,
    failedCount: results.filter((result) => result.status !== 'success').length,
  };
};

const isAuthorizedQueueRequest = (request: Request, runtime: ContactRuntimeConfig): boolean => {
  const expectedSecret = runtime.queue.secret;

  if (!expectedSecret) {
    return false;
  }

  const headerSecret = request.headers.get('x-contact-queue-secret')?.trim();
  const authHeader = request.headers.get('authorization')?.trim();
  const bearerSecret = authHeader?.toLowerCase().startsWith('bearer ')
    ? authHeader.slice('bearer '.length).trim()
    : undefined;

  return headerSecret === expectedSecret || bearerSecret === expectedSecret;
};

const getRequestedFlushLimit = (request: Request, fallback: number): number => {
  const url = new URL(request.url);
  const rawLimit = url.searchParams.get('limit');

  if (!rawLimit) {
    return fallback;
  }

  const parsed = Number.parseInt(rawLimit, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, 100);
};

export const getContactQueueStatus = async (): Promise<ContactQueueStatus> => {
  const runtime = getContactRuntimeConfig();
  return getQueueStatusInternal(runtime.queue);
};

export const handleContactQueueStatus = async (request: Request): Promise<Response> => {
  const runtime = getContactRuntimeConfig();

  if (!runtime.queue.enabled) {
    return jsonNoStore(
      {
        success: false,
        message: 'Retry queue is disabled.',
      },
      503,
    );
  }

  if (!runtime.queue.secret) {
    return jsonNoStore(
      {
        success: false,
        message: 'Retry queue secret is not configured.',
      },
      503,
    );
  }

  if (!isAuthorizedQueueRequest(request, runtime)) {
    return jsonNoStore(
      {
        success: false,
        message: 'Unauthorized retry queue request.',
      },
      401,
    );
  }

  return jsonNoStore({
    success: true,
    queue: await getQueueStatusInternal(runtime.queue),
  });
};

export const handleContactQueueFlush = async (request: Request): Promise<Response> => {
  const runtime = getContactRuntimeConfig();

  if (!runtime.queue.enabled) {
    return jsonNoStore(
      {
        success: false,
        message: 'Retry queue is disabled.',
      },
      503,
    );
  }

  if (!runtime.queue.secret) {
    return jsonNoStore(
      {
        success: false,
        message: 'Retry queue secret is not configured.',
      },
      503,
    );
  }

  if (!isAuthorizedQueueRequest(request, runtime)) {
    return jsonNoStore(
      {
        success: false,
        message: 'Unauthorized retry queue request.',
      },
      401,
    );
  }

  const flushResult = await flushQueueInternal(
    runtime.queue,
    runtime.providers,
    getRequestedFlushLimit(request, runtime.queue.processLimit),
  );

  return jsonNoStore<ContactQueueFlushResponse>({
    success: true,
    message: 'Retry queue processed.',
    queue: flushResult,
  });
};

export const handleContactSubmission = async (request: Request): Promise<Response> => {
  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10);

  if (Number.isFinite(contentLength) && contentLength > payloadLimitBytes) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: getMessages('pl').payloadTooLarge,
      },
      413,
    );
  }

  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonNoStore<ContactSubmissionResponse>(
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
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: getMessages('pl').invalidJson,
      },
      400,
    );
  }

  const locale = normalizeLocale(getTrimmedString(input.locale));
  const messages = getMessages(locale);
  const runtime = getContactRuntimeConfig();

  if (!runtime.enabled) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: messages.disabled,
      },
      503,
    );
  }

  if (runtime.queue.enabled) {
    try {
      await flushQueueInternal(runtime.queue, runtime.providers, runtime.queue.processLimit);
    } catch (error) {
      console.error('[contact] Failed to flush retry queue before handling submission.', error);
    }
  }

  const rateLimitState = getRateLimitState(getClientIp(request));

  if (rateLimitState.limited) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: messages.rateLimited,
      },
      429,
    );
  }

  const validation = validatePayload(input);

  if (!validation.payload) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: messages.genericError,
        errors: validation.errors,
      },
      400,
    );
  }

  if (runtime.providers.length === 0) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: messages.misconfigured,
      },
      500,
    );
  }

  const envelope = createEnvelope(validation.payload);
  const delivery = await deliverEnvelope(envelope, runtime);
  const accepted = delivery.deliveredCount > 0 || delivery.queuedCount > 0;

  if (!accepted) {
    return jsonNoStore<ContactSubmissionResponse>(
      {
        success: false,
        message: messages.upstreamFailure,
      },
      502,
    );
  }

  const queued = delivery.deliveredCount === 0 && delivery.queuedCount > 0;

  return jsonNoStore<ContactSubmissionResponse>(
    {
      success: true,
      messageId: envelope.messageId,
      message: queued ? messages.accepted : messages.success,
      queued,
      delivery: {
        deliveredProviders: delivery.deliveredCount,
        queuedProviders: delivery.queuedCount,
        failedProviders: delivery.failedCount,
      },
    },
    queued ? 202 : 200,
  );
};
