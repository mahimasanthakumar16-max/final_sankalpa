import { safeFetch } from '@/sanity/lib/client';
import { blogPostsQuery } from '@/sanity/lib/queries';
import BlogPageContent from '@/components/BlogPageContent';
import { normalizePosts } from '@/lib/blog';

export default async function BlogPage() {
    let cmsPosts = null;
    try {
        cmsPosts = await safeFetch(blogPostsQuery);
    } catch (error) {
        console.error('Blog fetch failed:', error);
    }

    const posts = normalizePosts(cmsPosts);

    return <BlogPageContent posts={posts} />;
}
