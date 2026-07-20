"use client";

import { useState } from 'react';
import { ArrowRight, BookOpen, Heart, FileText, CheckCircle } from 'lucide-react';

// Create an icon map
const iconMap: Record<string, any> = {
    BookOpen,
    Heart,
    FileText,
    CheckCircle
};

interface Resource {
    icon: string;
    title: string;
    desc: string;
    buttonText: string;
    comingSoon: boolean;
    isPrompts?: boolean;
    downloadLink?: string;
}

interface ClientBlogPageProps {
    resources: Resource[];
    prompts: string[];
}

export default function ClientBlogPage({ resources, prompts }: ClientBlogPageProps) {
    const [showPrompts, setShowPrompts] = useState(false);

    return (
        <>
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
                        {resources.map((res, idx) => {
                            const Icon = iconMap[res.icon] || BookOpen;
                            return (
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
                                        <Icon size={24} color="#7D9182" />
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
                                        res.comingSoon ? (
                                            <span className="resource-action-link" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                                                {res.buttonText} <ArrowRight size={14} />
                                            </span>
                                        ) : (
                                            <a 
                                                href={res.downloadLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="resource-action-link" 
                                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                                                download
                                            >
                                                {res.buttonText} <ArrowRight size={14} />
                                            </a>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Self-Reflection Prompts Expandable Section */}
                    {showPrompts && (
                        <div style={{ marginTop: '3rem', padding: '2.5rem', backgroundColor: 'var(--surface-sage)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(168, 181, 162, 0.3)' }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--soft-charcoal)' }}>
                                Self-Reflection Prompts
                            </h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {prompts.map((prompt, idx) => (
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
