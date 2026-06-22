import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { blogPostBySlugQuery, blogPostsQuery } from '@/sanity/lib/queries';
import { FALLBACK_POSTS, formatPublishDate } from '@/lib/blog';

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: React.ReactNode }) => (
            <p className="blog-post-paragraph">{children}</p>
        ),
        h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="blog-post-heading">{children}</h2>
        ),
        h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="blog-post-subheading">{children}</h3>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="blog-post-quote">{children}</blockquote>
        ),
    },
};

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    let posts = null;
    try {
        posts = await safeFetch(blogPostsQuery);
    } catch {
        posts = null;
    }

    const slugs = (posts?.length ? posts : FALLBACK_POSTS).map((post: { slug: string }) => ({
        slug: post.slug,
    }));

    return slugs;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    let post = null;
    try {
        post = await safeFetch(blogPostBySlugQuery, { slug });
    } catch (error) {
        console.error('Blog post fetch failed:', error);
    }

    if (!post) {
        const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
        if (!fallback) notFound();

        return (
            <>
                <section className="blog-post-hero">
                    <div className="container">
                        <Link href="/blog" className="blog-back-link">
                            <ArrowLeft size={16} /> Back to Journal
                        </Link>
                        <span className="blog-category-tag">{fallback.categories[0]}</span>
                        <h1>{fallback.title}</h1>
                        <div className="blog-meta">
                            <span><Calendar size={14} /> {formatPublishDate(fallback.publishedAt)}</span>
                            <span><Clock size={14} /> {fallback.readingTime} min read</span>
                        </div>
                    </div>
                </section>
                <section className="section section-bg-white">
                    <div className="container blog-post-container">
                        {fallback.mainImage && (
                            <div className="blog-post-featured-image">
                                <img src={fallback.mainImage} alt={fallback.title} />
                            </div>
                        )}
                        <div className="blog-post-content">
                            <p className="blog-post-lead">{fallback.excerpt}</p>
                            <p className="blog-post-paragraph">
                                This article is part of the Sankalpa Counseling wellness journal — a growing
                                library of reflections and resources for your healing journey. Full content
                                will be available once published through the CMS.
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className="blog-post-hero">
                <div className="container">
                    <Link href="/blog" className="blog-back-link">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                    <span className="blog-category-tag">{post.categories?.[0] || 'Wellness'}</span>
                    <h1>{post.title}</h1>
                    <div className="blog-meta">
                        <span><Calendar size={14} /> {formatPublishDate(post.publishedAt)}</span>
                        <span><Clock size={14} /> {post.readingTime || 5} min read</span>
                    </div>
                </div>
            </section>
            <section className="section section-bg-white">
                <div className="container blog-post-container">
                    {post.mainImage && (
                        <div className="blog-post-featured-image">
                            <img src={post.mainImage} alt={post.title} />
                        </div>
                    )}
                    <div className="blog-post-content">
                        {post.excerpt && <p className="blog-post-lead">{post.excerpt}</p>}
                        {post.body && <PortableText value={post.body} components={portableTextComponents} />}
                    </div>
                </div>
            </section>
        </>
    );
}
