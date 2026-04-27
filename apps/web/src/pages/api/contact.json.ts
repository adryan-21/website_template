import { handleContactSubmission } from '@/lib/contact';

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  return handleContactSubmission(request);
}