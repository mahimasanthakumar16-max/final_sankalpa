import { ChevronDown } from 'lucide-react';
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
            answer: "The first session (often called an intake session) is about getting to know each other. I will ask about your history, what brings you to therapy now, and what you hope to achieve. It's also an opportunity for you to see how I work and ask any questions you might have."
        },
        {
            _id: '2',
            question: "How long does each session last?",
            answer: "A standard individual session lasts 50 minutes. This is often referred to as a 'therapeutic hour.' Couples sessions are typically 75 minutes to allow enough time for both partners to be heard."
        },
        {
            _id: '3',
            question: "Do you offer virtual or in-person therapy?",
            answer: "We currently offer both virtual (secure video call) and in-person sessions at our Chennai office. Many clients find virtual therapy just as effective and more convenient for their schedules."
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
        }
    ];

    const faqs = cmsFaqs?.length > 0 ? cmsFaqs : fallbackFaqs;

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
                                    <p style={{ marginBottom: 0, borderTop: '1px solid var(--warm-cream)', paddingTop: '1.5rem' }}>{faq.answer}</p>
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

