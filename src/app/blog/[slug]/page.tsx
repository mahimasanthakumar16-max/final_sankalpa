import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
    ArrowLeft,
    Calendar,
    Clock,
} from 'lucide-react';
import { formatPublishDate } from '@/lib/blog';
import { prisma } from '@/lib/prisma';
import BreadcrumbsSchema from '@/components/BreadcrumbsSchema';

export const dynamic = 'force-dynamic';

function toRenderableHtml(rawContent: string): string {
    if (!rawContent) return '';
    const trimmed = rawContent.trim();
    if (!trimmed) return '';
    const hasBlockHtml = /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|section|article|br\s*\/?)[^>]*>/i.test(trimmed);
    if (hasBlockHtml) {
        return trimmed;
    }
    return trimmed
        .split(/\n\s*\n/)
        .map((para) => {
            const inner = para.replace(/\n/g, '<br />');
            return `<p>${inner}</p>`;
        })
        .join('\n');
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sankalpacounseling.com';

    try {
        const post = await prisma.blog.findUnique({
            where: { slug }
        });

        if (!post || post.status !== 'PUBLISHED') {
            return {
                title: 'Article Not Found | Sankalpa Counseling',
            };
        }

        const title = post.seoTitle || `${post.title} | Sankalpa Counseling`;
        const description = post.metaDescription || post.excerpt;
        const imageUrl = post.mainImage || `${baseUrl}/images/LOTO.png`;

        return {
            title,
            description,
            alternates: {
                canonical: `/blog/${slug}`,
            },
            openGraph: {
                title,
                description,
                type: 'article',
                publishedTime: post.publishedAt.toISOString(),
                modifiedTime: post.updatedAt.toISOString(),
                authors: [post.author],
                images: [{ url: imageUrl }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            }
        };
    } catch {
        return {
            title: 'Wellness Journal | Sankalpa Counseling',
        };
    }
}

export async function generateStaticParams() {
    try {
        const posts = await prisma.blog.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true }
        });
        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch {
        return [];
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    let post = null;
    try {
        post = await prisma.blog.findUnique({
            where: { slug }
        });
    } catch (e) {
        // Fallback to null
    }

    if (!post || post.status !== 'PUBLISHED') {
        notFound();
    }

    const title = post.title;
    const publishedAt = post.publishedAt.toISOString().split('T')[0];
    const readingTime = post.readingTime;
    const mainImage = post.mainImage;
    const excerpt = post.excerpt;
    const rawContent = post.content;
    const renderableContent = toRenderableHtml(rawContent);
    const category = post.categories[0] || 'Wellness';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sankalpacounseling.com';
    const blogPostSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.mainImage || `${baseUrl}/images/LOTO.png`,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sankalpa Counseling",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/images/LOTO.png`
            }
        },
        "datePublished": post.publishedAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${post.slug}`
        }
    };

    return (
        <>
            <BreadcrumbsSchema items={[
                { name: "Home", url: "/" },
                { name: "Blog", url: "/blog" },
                { name: title, url: `/blog/${slug}` }
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
            />
            <section className="blog-post-hero">
                <div className="container">
                    <Link href="/blog" className="blog-back-link">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                    <span className="blog-category-tag">{category}</span>
                    <h1>{title}</h1>
                    <div className="blog-meta">
                        <span><Calendar size={14} /> {formatPublishDate(publishedAt)}</span>
                        <span><Clock size={14} /> {readingTime} min read</span>
                    </div>
                </div>
            </section>
            <section className="section section-bg-white">
                <div className="container blog-post-container">
                    {mainImage && (
                        <div className="blog-post-featured-image">
                            <img src={mainImage} alt={title} />
                        </div>
                    )}
                    <div className="blog-post-content">
                        <p className="blog-post-lead">{excerpt}</p>
                        <div 
                          className="blog-post-richtext"
                          dangerouslySetInnerHTML={{ __html: renderableContent }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

