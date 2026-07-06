'use client';

import { HeartHandshake, ShieldCheck, Sparkles, Heart, MessageCircle } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import GroupCounselingForm from '@/components/GroupCounselingForm';
import TherapyAccordion from '@/components/TherapyAccordion';
import CTASection from '@/components/CTASection';
import ServiceInquiryForm from '@/components/ServiceInquiryForm';

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    idealFor: string[];
    duration: string;
    icon: typeof HeartHandshake;
    subtitle?: string;
}

export default function ServicesPage() {
    const services: ServiceItem[] = [
        {
            id: 'individual',
            title: 'Individual Counseling',
            description: 'Dedicated 50-minute sessions focused entirely on your personal growth, healing, and skill-building in a deeply confidential environment.',
            idealFor: ['Anxiety', 'Depression', 'Life transitions', 'Identity exploration', 'Emotional regulation', 'Stress management'],
            duration: '50 minutes',
            icon: HeartHandshake,
        },
        {
            id: 'couples',
            title: 'Couples Counseling',
            description: 'Sessions designed to help partners strengthen communication, rebuild trust, navigate conflict, and foster deeper emotional connection in their relationship.',
            idealFor: ['Communication challenges', 'Conflict resolution', 'Trust rebuilding', 'Relationship strengthening', 'Emotional connection'],
            duration: '50 minutes',
            icon: Sparkles,
        },
        {
            id: 'trauma',
            title: 'Trauma Counseling',
            subtitle: 'EMDR • TF-CBT • Narrative Exposure Therapy',
            description: 'Specialized treatment focused on helping clients process difficult experiences, reduce the impact of trauma, and move toward healing, resilience, and renewed wellbeing.',
            idealFor: ['Childhood trauma', 'PTSD', 'Emotional distress', 'Difficult life experiences', 'Trauma recovery'],
            duration: '50-90 minutes',
            icon: ShieldCheck,
        },
        {
            id: 'adolescent',
            title: 'Adolescent Counseling',
            description: 'Supportive counseling designed specifically for adolescents navigating emotional, social, academic, family, and developmental challenges. Sessions provide a safe, compassionate, and non-judgmental space where young people can build resilience, develop healthy coping skills, and strengthen emotional wellbeing.',
            idealFor: ['Academic Stress', 'Anxiety', 'Depression', 'Identity Exploration', 'Family Challenges', 'Emotional Regulation', 'Self-Esteem', 'Life Transitions'],
            duration: '50–60 Minutes',
            icon: Heart,
        },
    ];

    const groupTags = [
        'Shared Experiences',
        'Emotional Support',
        'Community Building',
        'Peer Connection',
    ];

    return (
        <>
            {/* Intro Section */}
            <section className="section services-intro-section">
                <div className="container services-intro-content">
                    <span className="section-tag">THERAPEUTIC SERVICES</span>
                    <h1 className="services-intro-heading">Healing That Meets You Where You Are</h1>
                    <p className="services-intro-text">
                        Therapy is not one-size-fits-all. Every person journey is unique. I create individualized services to support your emotional wellbeing, relationships, and personal growth through a calm, compassionate, and deeply intuitive process.
                    </p>
                </div>
            </section>

            {/* Language Support Banner */}
            <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--spacing-lg)' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1.5rem 2rem',
                        backgroundColor: 'var(--surface-sage)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(168, 181, 162, 0.3)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--sage-green)',
                            opacity: 0.15,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <MessageCircle size={20} color="var(--eucalyptus-green)" />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <h3 style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--soft-charcoal)',
                                margin: 0,
                                marginBottom: '0.25rem'
                            }}>
                                Counseling Services Available in English & Tamil
                            </h3>
                            <p style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.875rem',
                                color: 'var(--soft-charcoal)',
                                margin: 0,
                                opacity: 0.8
                            }}>
                                Therapy sessions are available in both English and Tamil to help clients feel comfortable expressing themselves in the language they prefer.
                            </p>
                        </div>
                        <span style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--surface-cream)',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--eucalyptus-green)',
                            border: '1px solid rgba(168, 181, 162, 0.3)'
                        }}>
                            English | தமிழ்
                        </span>
                    </div>
                </div>
            </section>

            {/* Therapeutic Services */}
            <section className="section section-bg-white services-offerings-section">
                <div className="container">
                    <div className="services-offerings-grid">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                title={service.title}
                                description={service.description}
                                subtitle={service.subtitle}
                                idealFor={service.idealFor}
                                duration={service.duration}
                                icon={service.icon}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Group Counseling — unified compact card */}
            <section className="section section-bg-sand group-counseling-section">
                <div className="container">
                    <div className="group-counseling-card">
                        <div className="group-counseling-info">
                            <span className="section-tag">COMING SOON</span>
                            <h2>Group Counseling</h2>
                            <p>
                                Warm, community-centered support designed to bring individuals together
                                around shared experiences, learning, and healing.
                            </p>
                            <div className="group-tags">
                                {groupTags.map((tag) => (
                                    <span key={tag} className="group-tag">✓ {tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="group-counseling-form-area">
                            <GroupCounselingForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Types of Therapy Section */}
            <section className="section section-bg-white therapy-accordion-section">
                <div className="container">
                    <div className="section-heading text-center">
                        <span className="section-tag">THERAPY APPROACHES</span>
                        <h2>Types of Therapy I Offer</h2>
                        <p>Explore the modalities and therapeutic approaches that guide my practice. Click to learn more about each.</p>
                    </div>
                    <TherapyAccordion />
                </div>
            </section>

            {/* Therapy Service Inquiry Form */}
            <section className="section section-bg-sand service-inquiry-section">
                <div className="container">
                    <div className="section-heading text-center inquiry-section-header">
                        <span className="section-tag">SERVICE INQUIRY</span>
                        <h2>Therapy Service Inquiry Form</h2>
                        <p>
                            Share your details and areas of support you&apos;re looking for. We will
                            respond within 24–48 business hours.
                        </p>
                    </div>
                    <ServiceInquiryForm />
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="section bg-color final-cta-section">
                <div className="container">
                    <CTASection />
                </div>
            </section>
        </>
    );
}
