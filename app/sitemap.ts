import type { MetadataRoute } from 'next';

const SITE_PATHS = [
  '/',
  '/signin',
  '/signup',
  '/dashboard',
  '/analyze/results',
  '/community',
  '/safety-reviews',
  '/safety-help',
  '/settings',
  '/payments',
  '/billing',
  '/checkout',
  '/help',
  '/guide',
  '/faq',
  '/report-issue',
  '/privacy',
  '/terms',
  '/set-password',
  '/reset-password',
  '/redirecting',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wondlo1.vercel.app';
  let baseUrl = 'https://wondlo1.vercel.app';

  try {
    baseUrl = new URL(configuredUrl).origin;
  } catch {
    // Keep the sitemap valid if a deployment URL is accidentally malformed.
  }

  return SITE_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/guide' || path === '/help' ? 0.8 : 0.6,
  }));
}
