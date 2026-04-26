import type { AstroCookies } from 'astro';
import { clearPreviewSession, sanitizeRedirectPath } from '@/lib/preview';

export const prerender = false;

export async function GET({ url, cookies }: { url: URL; cookies: AstroCookies }) {
  clearPreviewSession(cookies);

  const redirectPath = sanitizeRedirectPath(url.searchParams.get('redirect'), '/');

  return Response.redirect(new URL(redirectPath, url), 302);
}