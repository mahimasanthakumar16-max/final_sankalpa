'use client';

import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
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
