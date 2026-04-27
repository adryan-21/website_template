import { handleContactQueueFlush, handleContactQueueStatus } from '@/lib/contact';

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  return handleContactQueueStatus(request);
}

export async function POST({ request }: { request: Request }) {
  return handleContactQueueFlush(request);
}
