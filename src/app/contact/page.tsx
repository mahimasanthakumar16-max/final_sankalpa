import { Mail, Clock } from 'lucide-react';
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="var(--eucalyptus-green)">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.487a.5.5 0 0 0 .608.625l5.805-1.525A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.4l-.371-.22-3.844 1.01 1.03-3.727-.242-.385A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>WhatsApp</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>
                                            <a href="https://wa.me/message/CFABZDBLQVSIE1" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--eucalyptus-green)', textDecoration: 'none', fontWeight: 600 }}>
                                                Contact Us
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
