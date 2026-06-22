"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import {
    type BlogPost,
    formatPublishDate,
    getFeaturedPost,
} from '@/lib/blog';

interface BlogPageContentProps {
    posts: BlogPost[];
}

const REDESIGN_CATEGORIES = [
    'All',
    'Anxiety',
    'Trauma Recovery',
    'Relationships',
    'Self Compassion',
    'Mindfulness',
    'Life Transitions',
    'Identity & Culture',
    'Emotional Wellbeing',
    'Couples & Connection',
    'Adolescent Mental Health',
];

const REFLECTIONS = [
    {
        title: "What Healing Really Means",
        excerpt: "Healing is not the absence of pain, but the capacity to carry it with gentleness. It's the slow, quiet process of welcoming back the parts of yourself you once had to reject.",
    },
    {
        title: "Learning to Sit with Difficult Emotions",
        excerpt: "We often rush to fix or escape discomfort. But sitting with grief, anger, or sadness without judgment is where the real softening happens. It is a form of self-hospitality.",
    },
    {
        title: "The Importance of Feeling Seen",
        excerpt: "In a world that demands performance, being witnessed in your raw truth is a rare medicine. Therapy is first and foremost a space where your story is held as sacred.",
    },
    {
        title: "Cultural Identity and Mental Health",
        excerpt: "Our healing cannot be separated from our roots. Integrating cultural heritage, ancestral stories, and modern self-understanding is key to a complete sense of wellness.",
    }
];

const RESOURCES = [
    { type: "Guide", title: "Anxiety Coping Kit", desc: "A practical guide to soothing your nervous system during moments of acute stress." },
    { type: "Worksheet", title: "Emotional Regulation", desc: "Interactive exercises to help identify, map, and process challenging feelings." },
    { type: "Mindfulness Practice", title: "Grounding Exercises", desc: "Five simple sensory-based exercises to bring you back to the present moment." },
    { type: "Journal Prompts", title: "Self-Reflection Prompts", desc: "Deep writing prompts to explore self-compassion, boundaries, and growth." },
    { type: "Self-Care Tool", title: "Daily Wellness Checklist", desc: "A minimalist daily planner focused on emotional check-ins and self-maintenance." },
    { type: "Resource List", title: "Mental Health Resources", desc: "A curated index of directories, emergency resources, and community aids." }
];

function ArticleImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
    if (src) {
        return <img src={src} alt={alt} className={className} />;
    }
    return (
        <div className={`blog-image-placeholder ${className || ''}`}>
            <BookOpen size={32} strokeWidth={1.25} />
        </div>
    );
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
    const [activeCategory, setActiveCategory] = useState('All');

    const featured = useMemo(() => getFeaturedPost(posts), [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            if (post._id === featured._id) return false;

            if (activeCategory === 'All') return true;

            return post.categories.some((c) => {
                const categoryStr = c.toLowerCase().trim();
                const activeStr = activeCategory.toLowerCase().trim();
                
                // Allow matching standard categories or partial combinations
                if (categoryStr === activeStr) return true;
                if (activeStr === 'identity & culture' && (categoryStr.includes('identity') || categoryStr.includes('culture'))) return true;
                if (activeStr === 'couples & connection' && (categoryStr.includes('couples') || categoryStr.includes('relationship') || categoryStr.includes('connection'))) return true;
                if (activeStr === 'self compassion' && (categoryStr.includes('self care') || categoryStr.includes('self-care') || categoryStr.includes('compassion'))) return true;
                
                return false;
            });
        });
    }, [posts, featured._id, activeCategory]);

    return (
        <>
            {/* Page Hero */}
            <section className="blog-redesign-hero text-center">
                <div className="organic-shape-sun" />
                {/* Embedded Inline SVG for Organic Leaves illustration */}
                <svg className="organic-leaf-illustration" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 15C50 15 25 35 25 60C25 75 37 85 50 85C63 85 75 75 75 60C75 35 50 15 50 15Z" stroke="#7D9182" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
                    <path d="M50 15V85" stroke="#7D9182" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M50 40C57 37 68 37 68 37" stroke="#7D9182" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M50 55C43 52 32 52 32 52" stroke="#7D9182" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M50 70C57 67 65 67 65 67" stroke="#7D9182" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="container">
                    <span className="blog-hero-label">Reflections & Resources</span>
                    <h1>A Space for Reflection, Growth & Healing</h1>
                    <p>
                        Thoughtful articles, reflections, and resources designed to support emotional wellbeing, 
                        self-understanding, and personal growth.
                    </p>
                </div>
            </section>

            {/* Featured Article */}
            <section className="section featured-editorial-section">
                <div className="container">
                    <div className="featured-editorial-card">
                        <div className="featured-editorial-img-wrap">
                            <ArticleImage
                                src={featured.mainImage}
                                alt={featured.title}
                                className="featured-editorial-img"
                            />
                        </div>
                        <div className="featured-editorial-content">
                            <span className="blog-category-tag">
                                {featured.categories[0] || 'Featured Entry'}
                            </span>
                            <h2>{featured.title}</h2>
                            <p>{featured.excerpt}</p>
                            <div className="featured-meta-bar">
                                <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {formatPublishDate(featured.publishedAt)}</span>
                                <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {featured.readingTime} min read</span>
                            </div>
                            <div>
                                <Link href={`/blog/${featured.slug}`} className="btn btn-primary">
                                    Read Article
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topic Collections */}
            <section className="topic-collections-section">
                <div className="container">
                    <div className="topic-collections-pills">
                        {REDESIGN_CATEGORIES.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`topic-pill${activeCategory === category ? ' active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Healing Journal */}
            <section className="section healing-journal-section">
                <div className="container">
                    <div className="journal-section-intro text-center">
                        <h2>From the Healing Journal</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem' }}>
                            Spacious reflections on recovery, mindfulness, and relationships.
                        </p>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="journal-editorial-grid">
                            {filteredPosts.map((post) => (
                                <article key={post._id} className="journal-editorial-card">
                                    <div className="journal-card-img-wrap">
                                        <ArticleImage
                                            src={post.mainImage}
                                            alt={post.title}
                                            className="journal-card-img"
                                        />
                                    </div>
                                    <span className="journal-card-category">
                                        {post.categories[0] || 'Wellness'}
                                    </span>
                                    <h3 className="journal-card-title">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="journal-card-excerpt">{post.excerpt}</p>
                                    <div className="journal-card-meta">
                                        <span>{formatPublishDate(post.publishedAt)}</span>
                                        <span>•</span>
                                        <span>{post.readingTime} min read</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="blog-empty-state">
                            <p>No journal entries found in this collection. Explore another topic.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Therapist Reflections */}
            <section className="section reflections-section">
                <div className="container">
                    <div className="journal-section-intro text-center">
                        <span className="blog-hero-label">Personal Thoughts</span>
                        <h2>Reflections from Mahima</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem' }}>
                            Shorter, personal insights on presence, healing, and sitting with emotions.
                        </p>
                    </div>

                    <div className="reflections-grid">
                        {REFLECTIONS.map((reflection, idx) => (
                            <div key={idx} className="reflection-card">
                                <h3>{reflection.title}</h3>
                                <p>{reflection.excerpt}</p>
                                <span className="reflection-card-signature">— Mahima</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resource Library */}
            <section className="section resource-library-section">
                <div className="container">
                    <div className="journal-section-intro text-center">
                        <span className="blog-hero-label">Wellness Library</span>
                        <h2>Resource Library</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem' }}>
                            Practical tools, grounding sheets, and guides designed for your healing journey.
                        </p>
                    </div>

                    <div className="resource-grid">
                        {RESOURCES.map((res, idx) => (
                            <div key={idx} className="resource-editorial-card">
                                <span className="resource-type">{res.type}</span>
                                <h3>{res.title}</h3>
                                <p className="resource-desc">{res.desc}</p>
                                <span className="resource-action-link">
                                    Access Tool <ArrowRight size={14} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="section newsletter-editorial-section">
                <div className="container">
                    <div className="newsletter-editorial-card">
                        <h2>Stay Connected</h2>
                        <p>
                            Receive occasional reflections, resources, and wellness updates from Sankalpa Counseling directly in your inbox.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="newsletter-form-row">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    aria-label="Email address"
                                />
                                <button type="submit" className="btn btn-primary">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

