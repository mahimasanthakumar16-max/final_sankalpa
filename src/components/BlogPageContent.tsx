import Link from 'next/link';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { blogPostsQuery } from '@/sanity/lib/queries';
import { formatPublishDate } from '@/lib/blog';
import ClientBlogPage from './ClientBlogPage';

const RESOURCES = [
    {
        icon: 'BookOpen',
        title: "Anxiety Coping Skills",
        desc: "Practical strategies and exercises to help manage anxiety and build healthier coping habits.",
        buttonText: "Download Worksheet",
        comingSoon: false,
        downloadLink: "/resources/coping-skills-anxiety-standard-english.pdf"
    },
    {
        icon: 'Heart',
        title: "Grounding Exercises",
        desc: "Simple grounding techniques to help reduce anxiety, manage overwhelming emotions, and reconnect with the present moment.",
        buttonText: "Download Worksheet",
        comingSoon: false,
        downloadLink: "/resources/grounding-techniques-standard-english.pdf"
    },
    {
        icon: 'FileText',
        title: "Self-Reflection Prompts",
        desc: "A collection of thoughtful journal prompts to encourage self-awareness, personal growth, and emotional reflection.",
        buttonText: "View Prompts",
        comingSoon: false,
        isPrompts: true
    },
    {
        icon: 'CheckCircle',
        title: "Emotion Regulation Skills",
        desc: "Evidence-based skills to better understand, regulate, and respond to emotions in healthier ways.",
        buttonText: "Download Worksheet",
        comingSoon: false,
        downloadLink: "/resources/dbt-emotion-regulation-skills-standard-english.pdf"
    },
    {
        icon: 'FileText',
        title: "Daily Wellness Checklist",
        desc: "A practical daily checklist to support healthy routines and emotional wellbeing.",
        buttonText: "Coming Soon",
        comingSoon: true
    },
    {
        icon: 'BookOpen',
        title: "Mental Health Resources",
        desc: "A curated collection of trusted mental health resources, crisis supports, and recommended reading.",
        buttonText: "Coming Soon",
        comingSoon: true
    }
];

const SELF_REFLECTION_PROMPTS = [
    "What makes me feel excited to get up in the morning?",
    "If I had all the money and time in the world, what would I be doing?",
    "What am I afraid of?",
    "What do I need to stop doing and start doing?",
    "What do I need to let go of from the past?",
    "Do I love myself? What do I need to do to unconditionally love myself?",
    "What does success mean to me?",
    "What do I really want in life? Not what my family, friends, or society think I should want—what do I want?",
    "What are my top three strengths?",
    "What are three things I can improve on?",
    "I am proud of myself for ______.",
    "What do I have now that I dreamed of having years ago?",
    "Am I holding onto something that is hurting me more than helping?",
    "When someone gives me a compliment, do I say \"thank you\" or refuse it? If I refuse it, where did I learn that from?",
    "Do I believe I am beautiful and worthy of love? If not, where did I learn that from?",
    "If someone tries to give me money or buy me a meal, do I accept or refuse? If I have trouble accepting money, where did that come from?",
    "What do I believe to be true about myself? Is it hurting or helping me?",
    "A cluttered or messy environment can represent a cluttered mind. What is one thing I can do right now to make my environment cleaner or more organized?",
    "What is one thing I can do today to get closer to my goal?",
    "Who or what is stopping me from doing what I want to do? Do I need them in my life? How can I change my environment or my mindset to move past them and their influence?",
    "What do I want my life to look like in five or ten years?"
];

export default async function BlogPageContent() {
    const posts = await safeFetch(blogPostsQuery);

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
                    <h1>The Wellness Journal</h1>
                    <p>
                        Thoughtful articles, reflections, and resources designed to support emotional wellbeing, 
                        self-understanding, and personal growth.
                    </p>
                </div>
            </section>

            {/* Blog Posts Section */}
            <section className="section featured-editorial-section">
                <div className="container">
                    <div className="journal-section-intro text-center">
                        <span className="blog-hero-label">Blog Posts</span>
                        <h2>Latest Articles</h2>
                    </div>
                    
                    {!posts || posts.length === 0 ? (
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '2rem',
                            padding: '3rem',
                            backgroundColor: 'var(--surface-sage)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(168,181,162,0.3)',
                            textAlign: 'center'
                        }}>
                            <BookOpen size={64} color="#7D9182" />
                            <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Blog Posts Coming Soon</h2>
                            <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: '600px' }}>
                                New articles on mental health, emotional wellbeing, relationships, trauma recovery, mindfulness, and personal growth will be published here soon.
                            </p>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '1rem' }}>
                                Check back soon for new resources.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {posts.map((post: any) => (
                                <Link key={post._id} href={`/blog/${post.slug}`} className="card group" style={{ textDecoration: 'none' }}>
                                    {post.mainImage && (
                                        <div style={{ 
                                            width: '100%', 
                                            height: '200px', 
                                            borderRadius: 'var(--radius-md)', 
                                            overflow: 'hidden', 
                                            marginBottom: '1rem' 
                                        }}>
                                            <img 
                                                src={post.mainImage} 
                                                alt={post.title} 
                                                style={{ 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                className="group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    {post.categories && post.categories.length > 0 && (
                                        <span className="section-tag" style={{ marginBottom: '0.5rem' }}>
                                            {post.categories[0]}
                                        </span>
                                    )}
                                    <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                                    {post.excerpt && (
                                        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>{post.excerpt}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                                        {post.author && <span>By {post.author}</span>}
                                        {post.publishedAt && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={14} />
                                                {formatPublishDate(post.publishedAt)}
                                            </span>
                                        )}
                                        {post.readingTime && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={14} />
                                                {post.readingTime} min read
                                            </span>
                                        )}
                                    </div>
                                    <span className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                                        Read More <ArrowRight size={16} />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Resource Library */}
            <ClientBlogPage 
                resources={RESOURCES} 
                prompts={SELF_REFLECTION_PROMPTS} 
            />
        </>
    );
}
