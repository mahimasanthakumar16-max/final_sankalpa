"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, FileText, CheckCircle } from 'lucide-react';

const RESOURCES = [
    {
        icon: BookOpen,
        title: "Anxiety Coping Skills",
        desc: "Practical strategies and exercises to help manage anxiety and build healthier coping habits.",
        buttonText: "Download Worksheet",
        comingSoon: false
    },
    {
        icon: Heart,
        title: "Grounding Exercises",
        desc: "Simple grounding techniques to help reduce anxiety, manage overwhelming emotions, and reconnect with the present moment.",
        buttonText: "Download Worksheet",
        comingSoon: false
    },
    {
        icon: FileText,
        title: "Self-Reflection Prompts",
        desc: "A collection of thoughtful journal prompts to encourage self-awareness, personal growth, and emotional reflection.",
        buttonText: "View Prompts",
        comingSoon: false,
        isPrompts: true
    },
    {
        icon: CheckCircle,
        title: "Emotion Regulation Skills",
        desc: "Evidence-based skills to better understand, regulate, and respond to emotions in healthier ways.",
        buttonText: "Download Worksheet",
        comingSoon: false
    },
    {
        icon: FileText,
        title: "Daily Wellness Checklist",
        desc: "A practical daily checklist to support healthy routines and emotional wellbeing.",
        buttonText: "Coming Soon",
        comingSoon: true
    },
    {
        icon: BookOpen,
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

export default function BlogPageContent() {
    const [showPrompts, setShowPrompts] = useState(false);

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

            {/* Blog Posts Coming Soon Section */}
            <section className="section featured-editorial-section">
                <div className="container">
                    <div className="journal-section-intro text-center">
                        <span className="blog-hero-label">Blog Posts</span>
                        <h2>Coming Soon</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem' }}>
                            New articles on mental health, emotional wellbeing, relationships, trauma recovery, mindfulness, and personal growth will be published here soon.
                        </p>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: '2rem',
                        padding: '3rem',
                        backgroundColor: 'var(--surface-sage)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(168,181,162,0.3)'
                    }}>
                        <BookOpen size={64} color="#7D9182" />
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
                                {res.comingSoon && <span className="resource-type" style={{ color: 'var(--warm-terracotta)' }}>Coming Soon</span>}
                                <div className="resource-icon-wrap" style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'rgba(168, 181, 162, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <res.icon size={24} color="#7D9182" />
                                </div>
                                <h3>{res.title}</h3>
                                <p className="resource-desc">{res.desc}</p>
                                {res.isPrompts ? (
                                    <button
                                        type="button"
                                        className="resource-action-link"
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--eucalyptus-green)', fontWeight: 500 }}
                                        onClick={() => setShowPrompts(!showPrompts)}
                                    >
                                        {showPrompts ? "Hide Prompts" : "View Prompts"} <ArrowRight size={14} style={{ transform: showPrompts ? 'rotate(180deg)' : 'rotate(0)' }} />
                                    </button>
                                ) : (
                                    <span className="resource-action-link" style={{ opacity: res.comingSoon ? 0.5 : 1, pointerEvents: res.comingSoon ? 'none' : 'auto' }}>
                                        {res.buttonText} <ArrowRight size={14} />
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Self-Reflection Prompts Expandable Section */}
                    {showPrompts && (
                        <div style={{ marginTop: '3rem', padding: '2.5rem', backgroundColor: 'var(--surface-sage)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(168, 181, 162, 0.3)' }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--soft-charcoal)' }}>
                                Self-Reflection Prompts
                            </h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {SELF_REFLECTION_PROMPTS.map((prompt, idx) => (
                                    <div key={idx} style={{
                                        padding: '1.25rem',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(168, 181, 162, 0.2)'
                                    }}>
                                        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', color: 'var(--soft-charcoal)', fontSize: '1rem' }}>
                                            • {prompt}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
