import Link from 'next/link';
import { CreditCard, CalendarX, Info, User, Users, HeartHandshake, Sparkles, Clock } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { feesPageQuery } from '@/sanity/lib/queries';
import { PortableText } from '@portabletext/react';

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => <p className="mb-4">{children}</p>,
        strong: ({ children }: any) => <strong>{children}</strong>,
    }
};

export default async function FeesPage() {
    let data = null;
    try {
        data = await safeFetch(feesPageQuery);
    } catch (error) {
        console.error("Fees fetch failed:", error);
    }


    type FeeItem = {
        id: string;
        title: string;
        duration: string;
        description: string;
        price: string;
        badge?: string;
        icon?: any;
        note?: string;
    };

    const fallbackFees: FeeItem[] = [
        {
            id: 'initial',
            title: 'Initial Consultation',
            duration: '15 minutes',
            description: 'Complimentary introductory consultation to discuss your needs and determine the best therapeutic fit.',
            price: 'FREE',
            badge: 'Start Here',
            icon: User
        },
        {
            id: 'individual',
            title: 'Individual Counseling',
            duration: '50 minutes',
            description: 'Dedicated one-on-one therapy sessions focused on personal growth, emotional wellbeing, and healing.',
            price: '₹1,500 / session',
            icon: HeartHandshake
        },
        {
            id: 'couples',
            title: 'Couples Counseling',
            duration: '50 minutes',
            description: 'Sessions designed to strengthen communication, rebuild trust, and foster emotional connection.',
            price: '₹2,000 / session',
            icon: Users
        },
        {
            id: 'extended',
            title: 'Extended Session',
            duration: '90 minutes',
            description: 'Extended sessions for deeper therapeutic processing work. Most commonly requested by people looking to do trauma work like Eye Movement Desensitization Reprocessing (EMDR), but available to anyone who feels like they might benefit from longer sessions.',
            price: '₹2,500 / session',
            icon: Sparkles
        },
        {
            id: 'group',
            title: 'Group Counseling',
            duration: '90–120 minutes',
            description: 'Group counseling sessions are priced at ₹800 per person, per session. This pricing applies to each participant attending the group session.',
            price: '₹800 per person / session',
            badge: 'Coming Soon',
            icon: Clock,
            note: 'Pricing is charged per participant for each group counseling session.'
        }
    ];

    const fees: FeeItem[] = data?.feeStructures || fallbackFees;
    const paymentMethods = data?.paymentMethods || [
        "UPI & Bank Transfer (Preferred)",
        "Debit & Credit Cards",
        "Digital Wallets"
    ];

    return (
        <>
            <section className="section fees-hero">
                <div className="container text-center">
                    <div className="section-tag">INVESTMENT IN YOUR WELLBEING</div>
                    <h1 className="mb-4">Session Fees <span className="accent-highlight">& Policies</span></h1>
                    <p className="hero-text">Transparent pricing with no hidden costs. Your healing journey is an investment in yourself that ripples into every area of your life.</p>
                </div>
            </section>

            <section className="section section-bg-white">
                <div className="fees-container">
                    <div className="fees-row fees-row-top">
                        {fees.slice(0, 3).map((f) => {
                            const Icon = f.icon || Info;
                            const isIndividual = f.id === 'individual';
                            const isCouples = f.id === 'couples';
                            const isExtended = f.id === 'extended';
                            return (
                                <article key={f.id} className="fee-card card">
                                    <div className="fee-card-top">
                                        <div className="fee-icon"><Icon size={28} color="var(--eucalyptus-green)" /></div>
                                        {isIndividual ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                <span className="fee-badge" style={{ whiteSpace: 'nowrap' }}>Trauma Counseling</span>
                                                <span className="fee-badge" style={{ whiteSpace: 'nowrap' }}>Adolescent Counseling</span>
                                            </div>
                                        ) : (
                                            f.badge && <div className="fee-badge">{f.badge}</div>
                                        )}
                                    </div>
                                    <h3 className="fee-title">{isExtended ? 'Extended Session' : f.title}</h3>
                                    <p className="fee-duration">{isIndividual || isCouples ? '50 minutes' : f.duration}</p>
                                    <p className="fee-desc">{isExtended ? 'Extended sessions for deeper therapeutic processing work. Most commonly requested by people looking to do trauma work like Eye Movement Desensitization Reprocessing (EMDR), but available to anyone who feels like they might benefit from longer sessions.' : f.description}</p>
                                    <div style={{ marginTop: 'auto' }}>
                                        <div className="fee-price">{f.price}</div>
                                        {f.note && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>{f.note}</p>}
                                        <Link href="/contact" className="btn btn-outline" style={{ marginTop: '1rem' }}>Book / Enquire</Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="fees-row fees-row-bottom">
                        {fees.slice(3).map((f) => {
                            const Icon = f.icon || Info;
                            const isIndividual = f.id === 'individual';
                            const isCouples = f.id === 'couples';
                            const isExtended = f.id === 'extended';
                            return (
                                <article key={f.id} className="fee-card card">
                                    <div className="fee-card-top">
                                        <div className="fee-icon"><Icon size={28} color="var(--eucalyptus-green)" /></div>
                                        {isIndividual ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                <span className="fee-badge" style={{ whiteSpace: 'nowrap' }}>Trauma Counseling</span>
                                                <span className="fee-badge" style={{ whiteSpace: 'nowrap' }}>Adolescent Counseling</span>
                                            </div>
                                        ) : (
                                            f.badge && <div className="fee-badge">{f.badge}</div>
                                        )}
                                    </div>
                                    <h3 className="fee-title">{isExtended ? 'Extended Session' : f.title}</h3>
                                    <p className="fee-duration">{isIndividual || isCouples ? '50 minutes' : f.duration}</p>
                                    <p className="fee-desc">{isExtended ? 'Extended sessions for deeper therapeutic processing work. Most commonly requested by people looking to do trauma work like Eye Movement Desensitization Reprocessing (EMDR), but available to anyone who feels like they might benefit from longer sessions.' : f.description}</p>
                                    <div style={{ marginTop: 'auto' }}>
                                        <div className="fee-price">{f.price}</div>
                                        {f.note && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>{f.note}</p>}
                                        <Link href="/contact" className="btn btn-outline" style={{ marginTop: '1rem' }}>Book / Enquire</Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="fees-note">
                        <p><em>Fees may be revised periodically. Existing clients will be given advance notice of any changes.</em></p>
                    </div>
                </div>
            </section>

            <section className="section section-bg-white">
                <div className="container">
                    <div className="policy-grid">
                        <div className="policy-card">
                            <div className="flex items-center gap-4 mb-4">
                                <CalendarX color="var(--warm-terracotta)" />
                                <h3 style={{ margin: 0 }}>Cancellation Policy</h3>
                            </div>
                            <p>Please provide at least 24 hours notice if you need to cancel or reschedule.</p>
                            <p>Late cancellations or no-shows may be charged the full session fee.</p>
                            <p>I understand emergencies happen — please communicate with me and we'll work something out.</p>
                        </div>

                        <div className="policy-card">
                            <div className="flex items-center gap-4 mb-4">
                                <CreditCard color="var(--eucalyptus-green)" />
                                <h3 style={{ margin: 0 }}>Payment Terms</h3>
                            </div>
                            <p>Payment is due at the time of service.</p>
                            <p>For online sessions, payment must be completed before the session begins.</p>
                            <p>As virtual counseling is currently being offered, payment should be completed before the scheduled appointment.</p>
                        </div>

                        <div className="policy-card">
                            <div className="flex items-center gap-4 mb-4">
                                <Info color="var(--eucalyptus-green)" />
                                <h3 style={{ margin: 0 }}>Insurance</h3>
                            </div>
                            <p>I am not currently on insurance panels.</p>
                            <p>However, I can provide a receipt/superbill if you wish to seek reimbursement from your insurance provider.</p>
                            <p>Please check with your insurance company regarding out-of-network mental health benefits.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-bg-white">
                <div className="container">
                    <div className="card flex" style={{ flexDirection: 'row', alignItems: 'center', gap: '2rem', padding: '2rem', backgroundColor: 'var(--warm-cream)' }}>
                        <Info size={48} color="var(--eucalyptus-green)" />
                        <div>
                            <h3 className="mb-2">A Note on Insurance</h3>
                            <p style={{ marginBottom: 0 }}>While we do not currently bill insurance providers directly, we can provide you with a monthly &quot;superbill&quot; (itemized receipt) that you may submit to your insurance company for potential out-of-network reimbursement. Please check with your provider regarding their mental health benefits.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

