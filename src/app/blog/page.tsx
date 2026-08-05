import BlogPageContent from '@/components/BlogPageContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
    return <BlogPageContent />;
}

