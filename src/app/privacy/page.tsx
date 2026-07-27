import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Sankalpa Counseling",
  description: "Learn about how Sankalpa Counseling handles patient confidentiality, records, and digital data privacy.",
  alternates: {
    canonical: '/privacy',
  }
};

export default function PrivacyPage() {
  return (
    <>
      <section className="section" style={{ 
        paddingTop: 'calc(var(--spacing-xxl) + 40px)', 
        paddingBottom: 'var(--spacing-xl)',
        backgroundColor: 'var(--warm-cream)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ marginBottom: '1rem' }}>CONFIDENTIALITY & LEGAL</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400 }}>Privacy Policy</h1>
          <p style={{ marginTop: '1rem', color: 'var(--soft-charcoal)', opacity: 0.8 }}>Last updated: July 2026</p>
        </div>
      </section>

      <section className="section section-bg-white" style={{ padding: 'var(--spacing-xl) 0' }}>
        <div className="container" style={{ maxWidth: '800px', fontFamily: 'var(--font-sans)', color: 'var(--soft-charcoal)', lineHeight: '1.8' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>1. Confidentiality & Trust</h2>
          <p style={{ marginBottom: '2rem' }}>
            Trust and confidentiality are the foundations of effective psychotherapy. Everything shared within your sessions at Sankalpa Counseling is strictly confidential. Information will not be released to any third party without your explicit, written consent.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>2. Exceptions to Confidentiality</h2>
          <p style={{ marginBottom: '1rem' }}>
            By law and professional ethics, confidentiality is protected except under the following circumstances:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <li>If there is a clear, imminent danger of harm to yourself or to another person.</li>
            <li>If child abuse, elder abuse, or abuse of a dependent adult is suspected.</li>
            <li>In response to a legally binding court order or subpoena.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>3. Data and Booking Security</h2>
          <p style={{ marginBottom: '2rem' }}>
            When you request an inquiry or book a session through our website, the personal data you share (including name, email address, phone number, and message notes) is securely stored. We use professional industry-standard security protocols to prevent unauthorized access or disclosure of information.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>4. Your Rights</h2>
          <p style={{ marginBottom: '2rem' }}>
            You have the right to request access to your records, request corrections to any stored details, or ask to withdraw/delete your inquiry information from our active databases at any time.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>5. Contact</h2>
          <p>
            If you have questions about privacy practices or session records, please contact us directly via our <a href="/contact" style={{ color: 'var(--eucalyptus-green)', textDecoration: 'underline' }}>contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
