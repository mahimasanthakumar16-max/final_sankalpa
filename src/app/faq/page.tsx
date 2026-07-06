import { ChevronDown, Info } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { faqsQuery } from '@/sanity/lib/queries';

export default async function FAQPage() {
    let cmsFaqs = [];
    try {
        cmsFaqs = await safeFetch(faqsQuery);
    } catch (error) {
        console.error("FAQ fetch failed:", error);
    }

    const fallbackFaqs = [
        {
            _id: '1',
            question: "What can I expect in the first session?",
            answer: "The first session is a free initial consultation. We will get to know each other, I will ask about your history, what brings you to therapy now, and what you hope to achieve. It's also an opportunity for you to see how I work and ask any questions you might have."
        },
        {
            _id: '2',
            question: "How long does each session last?",
            answer: "A standard individual session lasts 50 minutes. This is often referred to as a 'therapeutic hour.' Couples sessions are typically 75 minutes to allow enough time for both partners to be heard."
        },
        {
            _id: '3',
            question: "Do you offer online or in-person sessions?",
            answer: "Currently, all counseling sessions are offered virtually to provide accessible and flexible support for clients across India.\n\nYou can choose between:\n\n• Virtual (Video Call)\n• Phone Call\n\nIn-person counseling sessions will be available soon. Updates will be shared once this service becomes available."
        },
        {
            _id: '4',
            question: "How often should I attend therapy?",
            answer: "Most clients begin with weekly sessions to build momentum and establish the therapeutic relationship. As you progress and start meeting your goals, we may move to bi-weekly or monthly sessions."
        },
        {
            _id: '5',
            question: "Is everything I say confidential?",
            answer: "Yes, confidentiality is a cornerstone of therapy. Everything discussed remains private with a few legal exceptions (such as if there is an immediate risk of harm to yourself or others, or if a court orders the release of information)."
        },
        {
            _id: '6',
            question: "What age groups do you serve?",
            answer: "We work with adolescents (ages 13+), young adults, and adults. For clients under 18, we require initial consent from a parent or legal guardian."
        },
        {
            _id: '7',
            question: "What is your cancellation policy?",
            answer: "Please provide at least 24 hours notice if you need to cancel or reschedule. Late cancellations or no-shows may be charged the full session fee. I understand emergencies happen — please communicate with me and we'll work something out."
        },
        {
            _id: '8',
            question: "Do you accept insurance?",
            answer: "I am not currently on insurance panels. However, I can provide a receipt/superbill if you wish to seek reimbursement from your insurance provider. Please check with your insurance company regarding out-of-network mental health benefits."
        },
        {
            _id: '9',
            question: "What languages do you offer counseling in?",
            answer: "Counseling services are available in both English and Tamil to help clients feel comfortable expressing themselves in the language they prefer."
        },
        {
            _id: '10',
            question: "How soon will I hear back from you after reaching out?",
            answer: "Thank you for reaching out. I will get back to you within 48–72 business hours."
        }
    ];

    const faqs = cmsFaqs?.length > 0 ? cmsFaqs : fallbackFaqs;
    const isSessionFormatQuestion = (question: string) => 
        question.toLowerCase().includes("online") || 
        question.toLowerCase().includes("in-person") || 
        question.toLowerCase().includes("offer");

    return (
        <>
            <section className="section section-bg-sand" style={{ paddingTop: 'calc(var(--spacing-xxl) + 40px)' }}>
                <div className="container text-center" style={{ maxWidth: '800px' }}>
                    <h1 className="mb-4">Common Questions</h1>
                    <p style={{ fontSize: '1.25rem' }}>We understand that starting therapy can raise many questions. Here are answers to some of the ones we hear most often.</p>
                </div>
            </section>

            <section className="section section-bg-white">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
                        {faqs.map((faq: any, i: number) => (
                            <details key={faq._id} className="card" style={{ padding: '0', cursor: 'pointer', overflow: 'hidden' }}>
                                <summary className="flex items-center justify-between" style={{ padding: '2rem', listStyle: 'none' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>{faq.question}</h3>
                                    <ChevronDown color="var(--eucalyptus-green)" />
                                </summary>
                                <div style={{ padding: '0 2rem 2rem 2rem', color: '#5A5A5A' }}>
                                    <p style={{ marginBottom: isSessionFormatQuestion(faq.question) ? '1.5rem' : 0, borderTop: '1px solid var(--warm-cream)', paddingTop: '1.5rem', whiteSpace: 'pre-line' }}>{faq.answer}</p>
                                    {isSessionFormatQuestion(faq.question) && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            gap: '1rem', 
                                            padding: '1.5rem 2rem', 
                                            backgroundColor: 'var(--surface-sage)', 
                                            borderRadius: 'var(--radius-lg)', 
                                            border: '1px solid rgba(168, 181, 162, 0.3)' 
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
                                                <Info size={20} color="var(--eucalyptus-green)" />
                                            </div>
                                            <div>
                                                <h4 style={{ 
                                                    fontFamily: 'var(--font-sans)', 
                                                    fontSize: '1rem', 
                                                    fontWeight: 600, 
                                                    color: 'var(--soft-charcoal)', 
                                                    marginBottom: '0.75rem', 
                                                    marginTop: 0 
                                                }}>
                                                    Current Availability
                                                </h4>
                                                <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '1rem', color: 'var(--soft-charcoal)' }}>
                                                    <li style={{ marginBottom: '0.5rem' }}>✔ Virtual (Video Call)</li>
                                                    <li style={{ marginBottom: '0.5rem' }}>✔ Phone Call</li>
                                                    <li>⏳ In-Person Counseling – Coming Soon</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-color text-center">
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 className="mb-4">Still have questions?</h2>
                    <p className="mb-8">We are happy to provide more information. Feel free to reach out directly through our contact page.</p>
                    <a href="/contact" className="btn btn-primary">Reach Out to Us</a>
                </div>
            </section>
        </>
    );
}
