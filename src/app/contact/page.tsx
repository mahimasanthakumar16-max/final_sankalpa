import { Mail, Phone, MapPin, Clock } from 'lucide-react';
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
        email: data?.email || "hello@sankalpacare.com",
        phone: data?.phone || "+91 98765 43210",
        address: data?.address || "Adyar, Chennai\nTamil Nadu, India",
        officeHours: data?.officeHours || [
            "Monday – Friday: 9am – 7pm",
            "Saturday: 10am – 2pm"
        ],
        mapsUrl: data?.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15549.497746206!2d80.24479901170701!3d13.003932788338927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267ed2a15993b%3A0xe543df661ec48074!2sAdyar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1715856000000!5m2!1sen!2sin"
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
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>{contact.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Phone</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)' }}>{contact.phone}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin color="var(--eucalyptus-green)" size={20} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>Location</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--soft-charcoal)', whiteSpace: 'pre-line' }}>{contact.address}</p>
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
                            </div>

                            {/* Interactive Map */}
                            <div style={{
                                marginTop: '3rem',
                                aspectRatio: '16/9',
                                backgroundColor: 'var(--warm-cream)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(0,0,0,0.05)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <iframe
                                    src={contact.mapsUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
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

