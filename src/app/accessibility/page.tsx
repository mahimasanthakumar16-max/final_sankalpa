import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accessibility | Sankalpa Counseling",
  description: "Learn about Sankalpa Counseling's commitment to web accessibility and creating an inclusive online environment.",
  alternates: {
    canonical: '/accessibility',
  }
};

export default function AccessibilityPage() {
  return (
    <>
      <section className="section" style={{ 
        paddingTop: 'calc(var(--spacing-xxl) + 40px)', 
        paddingBottom: 'var(--spacing-xl)',
        backgroundColor: 'var(--warm-cream)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-tag" style={{ marginBottom: '1rem' }}>INCLUSIVITY & STANDARDS</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400 }}>Accessibility Statement</h1>
          <p style={{ marginTop: '1rem', color: 'var(--soft-charcoal)', opacity: 0.8 }}>Last updated: July 2026</p>
        </div>
      </section>

      <section className="section section-bg-white" style={{ padding: 'var(--spacing-xl) 0' }}>
        <div className="container" style={{ maxWidth: '800px', fontFamily: 'var(--font-sans)', color: 'var(--soft-charcoal)', lineHeight: '1.8' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>Our Commitment</h2>
          <p style={{ marginBottom: '2rem' }}>
            Sankalpa Counseling is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee an inclusive and user-friendly digital environment.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>Conformance Status</h2>
          <p style={{ marginBottom: '2rem' }}>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We actively design our website layouts, font contrasts, interactive structures, and forms to conform to the **WCAG 2.1 Level AA** standards.
          </p>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>Key Accessibility Features</h2>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>**Semantic HTML**: Standard header tags, buttons, form controls, and lists are used to ensure screen readers can easily parse and read content.</li>
            <li style={{ marginBottom: '0.5rem' }}>**Contrast & Sizing**: High contrast ratios on text variables and a flexible body font size (minimum 16px on mobile viewports) ensure readable layouts.</li>
            <li style={{ marginBottom: '0.5rem' }}>**Keyboard Navigation**: Forms and accordions support direct keyboard focus and toggles.</li>
            <li style={{ marginBottom: '0.5rem' }}>**Alt Text**: Text descriptions are provided for illustrative images.</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '1rem' }}>Feedback & Assistance</h2>
          <p>
            We welcome your feedback on the accessibility of the Sankalpa Counseling website. If you encounter any accessibility barriers, please contact us directly via our <a href="/contact" style={{ color: 'var(--eucalyptus-green)', textDecoration: 'underline' }}>contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
