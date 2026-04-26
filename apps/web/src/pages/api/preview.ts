import type { AstroCookies } from 'astro';
import { enablePreviewSession, verifyPreviewToken } from '@/lib/preview';

export const prerender = false;

export async function GET({ url, cookies }: { url: URL; cookies: AstroCookies }) {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('Missing preview token.', { status: 400 });
  }

  const payload = verifyPreviewToken(token);

  if (!payload) {
    return new Response('Invalid or expired preview token.', { status: 401 });
  }

  enablePreviewSession(cookies, payload);

  return Response.redirect(new URL(payload.path, url), 302);
}