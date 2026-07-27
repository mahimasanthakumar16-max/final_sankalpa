export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    author?: string;
    publishedAt: string;
    readingTime: number;
    featured?: boolean;
    mainImage?: string;
    categories: string[];
}

export const BLOG_CATEGORIES = [
    'All',
    'Anxiety',
    'Trauma Recovery',
    'Mindfulness',
    'Self Care',
    'Relationships',
    'Life Transitions',
    'Identity Exploration',
    'Emotional Wellness',
    'Couples Support',
    'Adolescent Mental Health',
] as const;

export const POPULAR_RESOURCES = [
    { title: 'Understanding Anxiety', category: 'Anxiety' },
    { title: 'Building Healthy Boundaries', category: 'Relationships' },
    { title: 'Managing Stress', category: 'Mindfulness' },
    { title: 'Coping With Life Transitions', category: 'Life Transitions' },
    { title: 'Healing From Trauma', category: 'Trauma Recovery' },
    { title: 'Practicing Mindfulness', category: 'Mindfulness' },
];

export function formatPublishDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function normalizePosts(posts: BlogPost[] | null | undefined): BlogPost[] {
    if (!posts?.length) return [];
    return posts.map((post) => ({
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: post.excerpt || '',
        categories: post.categories?.filter(Boolean) || [],
        readingTime: post.readingTime || 5,
        publishedAt: post.publishedAt || new Date().toISOString(),
    }));
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
    return posts.find((p) => p.featured) || posts[0];
}
