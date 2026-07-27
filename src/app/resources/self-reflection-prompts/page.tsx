import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SELF_REFLECTION_PROMPTS = [
    "What makes me feel excited to get up in the morning?",
    "If I had all the money and time in the world, what would I be doing?",
    "What am I afraid of?",
    "What do I need to stop doing and start doing?",
    "What do I need to let go of from the past?",
    "Do I love myself? What do I need to do to unconditionally love myself?",
    "What does \"success\" mean to me?",
    "What do I really want in life? Not what my family, friends, or society think I should want... What do I want?",
    "What are my top three strengths? What are three things I can improve on?",
    "I am proud of myself for ______.",
    "What do I have now that I dreamed of having years ago?",
    "Am I holding onto something that is hurting me more than helping?",
    "When someone gives me a compliment, do I say \"thank you\" or refuse it? If I refuse it, where did I learn that from?",
    "Do I believe I am beautiful and worthy of love? If not, where did I learn that from?",
    "If someone tries to give me money or buy me a meal, do I accept or refuse? If I have trouble accepting money, where did that come from?",
    "What do I believe to be true about myself? Is it hurting or helping me?",
    "A cluttered or messy environment can represent a cluttered mind. What is one thing I can do right now to make my environment cleaner/more organized?",
    "What is one thing I can do today to get closer to my goal?",
    "Who or what is stopping me from doing what I want to do? Do I need them in my life? How can I change my environment or my mindset to move past them and their influence?",
    "What do I want my life to look like in five or ten years?"
];

export default function SelfReflectionPromptsPage() {
    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '6rem 1rem 4rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--soft-charcoal)', marginBottom: '1.5rem', fontWeight: 400 }}>
                        Self-Reflection Journal Prompts
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem', color: '#6B7280', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
                        Take a few quiet moments to reflect on these questions. There are no right or wrong answers—these prompts are designed to encourage self-awareness and personal growth.
                    </p>
                </div>

                <div style={{ paddingLeft: '1rem' }}>
                    <ul style={{ 
                        fontFamily: 'var(--font-sans)', 
                        fontSize: '1.05rem', 
                        color: 'var(--soft-charcoal)', 
                        lineHeight: 1.8,
                        listStyleType: 'disc',
                        paddingLeft: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}>
                        {SELF_REFLECTION_PROMPTS.map((prompt, idx) => (
                            <li key={idx} style={{ paddingLeft: '0.5rem' }}>
                                {prompt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'flex-start', paddingLeft: '1rem' }}>
                    {/* Assuming there might be a PDF for download in the future, currently just a placeholder or disabled button */}
                    <button 
                        className="btn btn-primary"
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderRadius: '9999px',
                            backgroundColor: '#7D9182',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Download PDF <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
