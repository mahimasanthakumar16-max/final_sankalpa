import Link from 'next/link';

interface FooterProps {
    settings?: {
        title?: string;
        description?: string;
        footerText?: string;
        socialLinks?: { platform: string; url: string; }[];
    }
}

export default function Footer({ settings }: FooterProps) {
    return (
        <footer className="footer">
            <div className="container grid grid-cols-4">
                <div>
                    <h3>{settings?.title || "Sankalpa Counseling"}</h3>
                    <p className="mb-4">{settings?.description || "Cultivating emotional wellness and therapeutic healing in a safe, warm environment."}</p>
                    <address style={{ fontStyle: 'normal' }}>
                        <p>Virtual Counseling Available Across India<br />Providing secure online counseling sessions for clients throughout India.</p>
                    </address>
                </div>

                <div>
                    <h3>Services</h3>
                    <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/services#individual">Individual Therapy</Link>
                        <Link href="/services#couples">Couples Therapy</Link>
                        <Link href="/services#adolescent">Adolescent Counseling</Link>
                        <Link href="/services#trauma">Trauma Recovery</Link>
                    </div>
                </div>

                <div>
                    <h3>Quick Links</h3>
                    <div className="flex" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                        <Link href="/about">About the Therapist</Link>
                        <Link href="/blog">Wellness Journal</Link>
                        <Link href="/fees">Fees & Financials</Link>
                        <Link href="/faq">FAQ</Link>
                        <Link href="/contact">Contact Us</Link>
                    </div>
                </div>

                <div>
                    <h3>Connect</h3>
                    <p className="mb-4">Follow us for mental wellness insights and updates.</p>
                    <div className="flex gap-4">
                        {settings?.socialLinks?.map((social, i) => (
                            <Link key={i} href={social.url} className="nav-link">{social.platform}</Link>
                        )) || (
                                <>
                                    <Link href="#" className="nav-link">Instagram</Link>
                                    <Link href="#" className="nav-link">LinkedIn</Link>
                                </>
                            )}
                    </div>
                </div>
            </div>
            <div className="container footer-bottom">
                <p>&copy; {new Date().getFullYear()} {settings?.footerText || "Sankalpa Counseling. All rights reserved."} | <Link href="/privacy">Privacy Policy</Link> | <Link href="/accessibility">Accessibility</Link></p>
            </div>
        </footer>
    );
}

