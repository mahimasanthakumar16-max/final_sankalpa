import React from 'react';
import { Phone, Clock, Globe } from 'lucide-react';

const CRISIS_RESOURCES = [
    {
        name: "AASRA – Suicide Prevention and Emotional Support",
        description: "AASRA provides emotional support to individuals experiencing severe distress or suicidal thoughts. It is widely used as a depression helpline India relies on during crisis situations.",
        phone: "+91-22-2754-6669",
        availability: "24/7",
        languages: "हिंदी, English"
    },
    {
        name: "Vandrevala Foundation Mental Health Helpline",
        description: "The Vandrevala Foundation offers round-the-clock support for anxiety, depression, panic attacks, and suicidal thoughts. Support is available through phone calls and WhatsApp messages, with referrals provided when necessary.",
        phone: "+91-99996-66555",
        availability: "24/7",
        languages: "English, हिंदी, ગુજરાતી, বাংলা, ಕನ್ನಡ, தமிழ், తెలుగు, മലയാളം, ଓଡ଼ିଆ, मराठी, ತುಳು"
    },
    {
        name: "Tele-MANAS – National Tele Mental Health Programme",
        description: "Tele-MANAS is a government-run mental health helpline available across India. It operates through state-level centres, many coordinated by institutions such as NIMHANS. Counsellors provide basic psychological support, assess the level of distress, and offer referrals to nearby mental health services when required.",
        phone: "14416 or 1800-891-4416",
        availability: "24/7, 7 days a week",
        languages: "অসমীয়া, বাংলা, English, ગુજરાતી, हिंदी, ಕನ್ನಡ, മലയാളം, मराठी, नेपाली, ਪੰਜਾਬੀ, سنڌي/सिन्धी, தமிழ், తెలుగు, اردو"
    },
    {
        name: "1 Life – Crisis Support and Suicide Prevention",
        description: "1 Life is a non-profit organisation focused on suicide prevention. It provides support through trained mental health professionals and tele-counsellors using a non-judgmental approach. The helpline encourages individuals to seek medical or psychiatric support when required.",
        phone: "78930 78930",
        availability: "24/7, 7 days a week",
        languages: "हिंदी, English, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം, ગુજરાતી, मराठी, ਪੰਜਾਬੀ, سنڌي, भोजपुरी, বাংলা"
    },
    {
        name: "Sneha Foundation",
        description: "Sneha Foundation offers emotional support to individuals dealing with anxiety, depression, loneliness, grief, or suicidal thoughts. The service focuses on listening and emotional reassurance.",
        phone: "044-2464-0050",
        availability: "10:00 am to 10:00 pm",
        languages: null
    },
    {
        name: "Sumaitri",
        description: "Sumaitri is a crisis intervention centre for individuals experiencing depression, distress, or suicidal thoughts. It provides confidential and free emotional support through trained volunteers.",
        phone: "011-2338-9090 or +91-9315767849",
        availability: "12:30 pm to 5:00 pm, 7 days a week",
        languages: "हिंदी, English"
    },
    {
        name: "Arpita Suicide Prevention Centre",
        description: "Arpita Suicide Prevention Centre provides crisis counselling and suicide prevention services, particularly for individuals in eastern India.",
        phone: "+91-80-2365-5557, +91-80-2365-6667",
        availability: "7:00 am to 9:00 pm, 7 days a week",
        languages: "English, हिंदी, اردو, ಕನ್ನಡ, தமிழ், తెలుగు, മലയാളം, कोंकणी, অসমীয়া, ગુજરાતી, বাংলা"
    }
];

export default function CrisisResourcesPage() {
    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '6rem 1rem 4rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--soft-charcoal)', marginBottom: '1.5rem', fontWeight: 400 }}>
                        Crisis Resources & Helplines
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem', color: '#6B7280', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
                        If you or someone you know is going through a tough time or in crisis, please reach out for help. You don't have to face this alone. Below are trusted helplines available to provide immediate support and guidance.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {CRISIS_RESOURCES.map((resource, idx) => (
                        <div key={idx} style={{ 
                            padding: '2rem', 
                            backgroundColor: 'var(--surface-sage)', 
                            borderRadius: 'var(--radius-lg)', 
                            border: '1px solid rgba(168, 181, 162, 0.3)' 
                        }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--soft-charcoal)', marginBottom: '1rem', fontWeight: 500 }}>
                                {resource.name}
                            </h2>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                {resource.description}
                            </p>
                            
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--soft-charcoal)' }}>
                                    <Phone size={18} color="var(--eucalyptus-green)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span><strong>Phone:</strong> {resource.phone}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--soft-charcoal)' }}>
                                    <Clock size={18} color="var(--eucalyptus-green)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                    <span><strong>Availability:</strong> {resource.availability}</span>
                                </div>
                                {resource.languages && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--soft-charcoal)' }}>
                                        <Globe size={18} color="var(--eucalyptus-green)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                        <span><strong>Languages:</strong> {resource.languages}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
