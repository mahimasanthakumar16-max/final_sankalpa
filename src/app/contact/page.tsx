import { Mail, Phone, Clock } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { contactPageQuery } from '@/sanity/lib/queries';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
    let data = null;
    try {
        data = await safeFetch(contactPageQuery);
    } catch (error) {
        console.error("Contact fetch failed:", error);
    }

    const contact = {
        email: data?.email || "tsmahimatherapy@gmail.com",
        phone: data?.phone || "+91 70586 00849",
        officeHours: data?.officeHours || [
            "Monday – Friday: 1:00 PM – 10:00 PM",
            "Saturday: 12:00 PM – 10:00 PM",
            "Sunday: Closed"
        ]
    };


    return (
        <>
            <section className="section section-bg-sand" style={{ paddingTop: 'calc(var(--spacing-xxl) + 40px)' }}>
                <div className="container text-center" style={{ maxWidth: '800px' }}>
                    <h1 className="mb-4">Get in Touch</h1>
                    <p style={{ fontSize: '1.25rem' }}>The first step toward healing is often the hardest. We are here to make it as gentle and supportive as possible.</p>
                </div>
            </section>

            <section className="section section-bg-white">
                <div className="container">
                    <div className="grid grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="mb-8">Contact Information</h2>
                            <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Mail color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Email</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>
                                            <a href={`mailto:${contact.email}`} style={{ color: 'var(--soft-charcoal)', textDecoration: 'none' }}>
                                                {contact.email}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Phone</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>
                                            <a href={`tel:${contact.phone}`} style={{ color: 'var(--soft-charcoal)', textDecoration: 'none' }}>
                                                {contact.phone}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Office Hours</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>
                                            {contact.officeHours.map((hour: string, i: number) => (
                                                <span key={i}>{hour}<br /></span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Location</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)', whiteSpace: 'pre-line' }}>
                                            Virtual
                                            <br />
                                            Online Counseling Available Across India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
}
