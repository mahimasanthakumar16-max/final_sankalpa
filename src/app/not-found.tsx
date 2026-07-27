import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--warm-cream)',
      color: 'var(--soft-charcoal)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative organic shapes matching the homepage design */}
      <div className="organic-shape" style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '250px',
        height: '250px',
        background: 'var(--sage-green)',
        opacity: 0.08,
        filter: 'blur(50px)',
        zIndex: 0
      }} />
      <div className="organic-shape" style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '300px',
        height: '300px',
        background: 'var(--warm-terracotta)',
        opacity: 0.06,
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
        <span className="section-tag" style={{ 
          marginBottom: '1.5rem', 
          display: 'inline-block',
          backgroundColor: 'rgba(125, 145, 130, 0.1)',
          color: 'var(--soft-charcoal)'
        }}>
          404 ERROR
        </span>
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          fontWeight: 400, 
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          color: 'var(--soft-charcoal)'
        }}>
          Page Not Found
        </h1>
        <p style={{ 
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          lineHeight: '1.8', 
          marginBottom: '3rem',
          color: 'var(--soft-charcoal)',
          opacity: 0.85
        }}>
          The page you are looking for might have been moved, had its name changed, or is temporarily unavailable. Let us help you find your way back to wellness.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1.25rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Back to Home
          </Link>
          <Link href="/services" className="btn btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}
