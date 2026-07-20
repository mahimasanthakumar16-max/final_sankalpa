import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    Download,
    ArrowRight,
    Image as ImageIcon,
    FileText,
    Twitter,
    Facebook,
    Linkedin
} from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { blogPostBySlugQuery, blogPostsQuery, relatedPostsQuery } from '@/sanity/lib/queries';
import { FALLBACK_POSTS, formatPublishDate } from '@/lib/blog';

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: React.ReactNode }) => (
            <p className="blog-post-paragraph">{children}</p>
        ),
        h1: ({ children }: { children?: React.ReactNode }) => (
            <h1 className="blog-post-heading">{children}</h1>
        ),
        h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="blog-post-heading">{children}</h2>
        ),
        h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="blog-post-subheading">{children}</h3>
        ),
        h4: ({ children }: { children?: React.ReactNode }) => (
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{children}</h4>
        ),
        blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="blog-post-quote">{children}</blockquote>
        ),
    },
    marks: {
        code: ({ children }: { children?: React.ReactNode }) => (
            <code style={{ backgroundColor: '#f5f5f5', padding: '0.125rem 0.375rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {children}
            </code>
        ),
    },
    types: {
        image: ({ value }: any) => (
            <figure style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <img
                    src={value.asset?.url}
                    alt={value.alt || 'Blog image'}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
                {value.caption && (
                    <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                        {value.caption}
                    </figcaption>
                )}
            </figure>
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
    let allPosts: any[] = [];
    try {
        post = await safeFetch(blogPostBySlugQuery, { slug });
        allPosts = await safeFetch(blogPostsQuery) || [];
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

    // Find prev/next posts
    const currentIndex = allPosts.findIndex((p) => p._id === post._id);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    // Get category IDs for related posts (we'll use titles as a fallback for now since we don't have refs)
    // For placeholder mode, just use related from fallback
    const relatedPosts: any[] = [];

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
                        {post.author && <span>By {post.author}</span>}
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

                    {/* Gallery */}
                    {post.gallery && post.gallery.length > 0 && (
                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ImageIcon size={20} /> Gallery
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                {post.gallery.map((image: any, index: number) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={image.alt || `Gallery image ${index + 1}`}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Downloads */}
                    {post.downloads && post.downloads.length > 0 && (
                        <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f0f7f2', borderRadius: '12px', border: '1px solid #e0ebe4' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={20} /> Downloads
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {post.downloads.map((download: any, index: number) => (
                                    <li key={index} style={{ marginBottom: '1rem' }}>
                                        <a
                                            href={download.url}
                                            download
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                textDecoration: 'none',
                                                color: '#333',
                                                padding: '0.75rem 1rem',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e0e0e0',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#7d9182';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#e0e0e0';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <Download size={20} style={{ color: '#7d9182' }} />
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{download.title}</div>
                                                {download.description && (
                                                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{download.description}</div>
                                                )}
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Share Buttons */}
                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Share2 size={20} /> Share this article
                        </h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a
                                href="#"
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f0f7f2',
                                    borderRadius: '8px',
                                    border: '1px solid #e0ebe4',
                                    textDecoration: 'none',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e0ebe4';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7f2';
                                }}
                            >
                                <Twitter size={16} /> Twitter
                            </a>
                            <a
                                href="#"
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f0f7f2',
                                    borderRadius: '8px',
                                    border: '1px solid #e0ebe4',
                                    textDecoration: 'none',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e0ebe4';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7f2';
                                }}
                            >
                                <Facebook size={16} /> Facebook
                            </a>
                            <a
                                href="#"
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f0f7f2',
                                    borderRadius: '8px',
                                    border: '1px solid #e0ebe4',
                                    textDecoration: 'none',
                                    color: '#333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e0ebe4';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7f2';
                                }}
                            >
                                <Linkedin size={16} /> LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Prev/Next Navigation */}
                    <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {prevPost && (
                            <Link href={`/blog/${prevPost.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#7d9182';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <span style={{ color: '#666', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <ArrowLeft size={14} /> Previous
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{prevPost.title}</span>
                                </div>
                            </Link>
                        )}
                        {nextPost && (
                            <Link href={`/blog/${nextPost.slug}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'right' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    alignItems: 'flex-end',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#7d9182';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <span style={{ color: '#666', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Next <ArrowRight size={14} />
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{nextPost.title}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="section" style={{ backgroundColor: '#faf9f7' }}>
                    <div className="container">
                        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost: any) => (
                                <Link key={relatedPost._id} href={`/blog/${relatedPost.slug}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ height: '100%' }}>
                                        {relatedPost.mainImage && (
                                            <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                                                <img src={relatedPost.mainImage} alt={relatedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>{relatedPost.title}</h3>
                                        {relatedPost.excerpt && (
                                            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>{relatedPost.excerpt}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
