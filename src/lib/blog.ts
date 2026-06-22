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

export const FALLBACK_POSTS: BlogPost[] = [
    {
        _id: '1',
        title: 'Understanding Anxiety: A Gentle Guide to Finding Calm',
        slug: 'understanding-anxiety-guide',
        excerpt: 'Anxiety is not a flaw — it is often a signal. Explore how to listen to your nervous system with compassion and build steadier ground beneath everyday worry.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-05-10',
        readingTime: 8,
        featured: true,
        mainImage: '/images/abstract.png',
        categories: ['Anxiety', 'Emotional Wellness'],
    },
    {
        _id: '2',
        title: 'The Art of Mindful Communication in Relationships',
        slug: 'mindful-communication-relationships',
        excerpt: 'Presence transforms connection. Learn how slowing down, listening deeply, and naming needs can soften conflict and deepen intimacy.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-04-28',
        readingTime: 6,
        mainImage: '/images/sun.png',
        categories: ['Relationships', 'Couples Support'],
    },
    {
        _id: '3',
        title: 'Self-Care Beyond the Spa: Real Emotional Maintenance',
        slug: 'self-care-beyond-the-spa',
        excerpt: 'Move past the commercialization of self-care toward genuine practices that nourish your emotional life — rest, boundaries, and honest reflection.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-04-15',
        readingTime: 5,
        categories: ['Self Care', 'Emotional Wellness'],
    },
    {
        _id: '4',
        title: 'Healing After Trauma: What Recovery Really Looks Like',
        slug: 'healing-after-trauma',
        excerpt: 'Trauma recovery is not linear. Discover what healing can look like when you honor your pace, your body, and the courage it takes to return to yourself.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-03-22',
        readingTime: 9,
        categories: ['Trauma Recovery'],
    },
    {
        _id: '5',
        title: 'A Beginner\'s Invitation to Mindfulness',
        slug: 'beginners-invitation-mindfulness',
        excerpt: 'Mindfulness need not be perfect or prolonged. Small, grounded moments of awareness can gently reshape how you meet stress and uncertainty.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-03-08',
        readingTime: 4,
        categories: ['Mindfulness'],
    },
    {
        _id: '6',
        title: 'Navigating Life Transitions With Intention',
        slug: 'navigating-life-transitions',
        excerpt: 'Change unsettles even when it is welcome. Reflect on how to move through transitions — career shifts, relocation, parenthood — with self-trust.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-02-18',
        readingTime: 7,
        categories: ['Life Transitions'],
    },
    {
        _id: '7',
        title: 'Exploring Identity: Who Am I Becoming?',
        slug: 'exploring-identity',
        excerpt: 'Identity is lived, not declared once. A thoughtful look at how culture, relationships, and inner truth shape who we are becoming.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-02-02',
        readingTime: 6,
        categories: ['Identity Exploration'],
    },
    {
        _id: '8',
        title: 'Supporting Your Teen\'s Mental Health',
        slug: 'supporting-teen-mental-health',
        excerpt: 'Adolescence holds intensity and possibility. Practical ways parents and caregivers can create safety, listen well, and walk alongside young people.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-01-20',
        readingTime: 7,
        categories: ['Adolescent Mental Health'],
    },
    {
        _id: '9',
        title: 'Rebuilding Trust in Couples Therapy',
        slug: 'rebuilding-trust-couples',
        excerpt: 'Trust fractures slowly and repairs gradually. Explore the emotional work of accountability, repair, and renewed closeness between partners.',
        author: 'Mahima Tirunelveli Santhakumar',
        publishedAt: '2026-01-05',
        readingTime: 8,
        categories: ['Couples Support', 'Relationships'],
    },
];

export function formatPublishDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function normalizePosts(posts: BlogPost[] | null | undefined): BlogPost[] {
    if (!posts?.length) return FALLBACK_POSTS;
    return posts.map((post) => ({
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: post.excerpt || '',
        categories: post.categories?.filter(Boolean) || [],
        readingTime: post.readingTime || 5,
        publishedAt: post.publishedAt || new Date().toISOString(),
    }));
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost {
    return posts.find((p) => p.featured) || posts[0];
}
