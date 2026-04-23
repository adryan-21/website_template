import { getCmsClient } from '@/lib/cms';

export const prerender = false;

export async function GET() {
  const cms = getCmsClient();
  const health = await cms.getCmsHealth();

  return Response.json(health, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
