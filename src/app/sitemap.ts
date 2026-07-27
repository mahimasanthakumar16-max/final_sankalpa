import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sankalpacounseling.com';

  // Core static routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/blog',
    '/fees',
    '/faq',
    '/contact',
    '/booking',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Blog routes from Prisma database
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
