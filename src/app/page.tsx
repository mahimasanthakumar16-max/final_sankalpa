import Link from 'next/link';
import { Heart, Users, Sparkles } from 'lucide-react';
import { safeFetch } from '@/sanity/lib/client';
import { homePageQuery, servicesQuery } from '@/sanity/lib/queries';

export default async function Home() {
  let homeData = null;
  let services = [];

  try {
    const [fetchedHome, fetchedServices] = await Promise.all([
      safeFetch(homePageQuery),
      safeFetch(servicesQuery)
    ]);
    homeData = fetchedHome;
    services = fetchedServices || [];
  } catch (error) {
    console.error("Home page data fetch failed:", error);
  }


  // Fallback Content
  const content = {
    heroTitlePrefix: homeData?.heroTitlePrefix || "Supporting Healing,",
    heroTitleHighlight: homeData?.heroTitleHighlight || "Growth",
    heroTitleSuffix: homeData?.heroTitleSuffix || "and Emotional Wellbeing",
    heroSubtitle: homeData?.heroSubtitle || "A trust-centered sanctuary in Tamil Nadu, bridging modern clinical excellence with deeply intuitive, human-first emotional support.",
    heroImage: homeData?.heroImage || "/images/hero.png",
    ctaText: homeData?.ctaText || "Begin Consultation",
    secondaryCtaText: homeData?.secondaryCtaText || "Explore Modalities",
    introTitle: homeData?.introTitle || "Our Core Pillars",
    showcaseTitle: homeData?.showcaseTitle || "We believe therapy is an art of listening to the unspoken.",
  };

  return (
    <>
      {/* Immersive Aesthetic Hero Section */}
      <section className="section" style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 0',
        backgroundImage: `linear-gradient(rgba(247, 244, 238, 0.75), rgba(247, 244, 238, 0.75)), url(${content.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Artistic Background Accents */}
        <div className="organic-shape animate-float" style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '350px',
          background: 'var(--sage-green)',
          opacity: 0.1,
          filter: 'blur(60px)',
          zIndex: 0
        }}></div>

        {/* Vertical Branding Accent */}
        <div className="text-vertical" style={{
          position: 'absolute',
          right: '40px',
          height: '60%',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--eucalyptus-green)',
          fontSize: '0.75rem',
          letterSpacing: '0.8em',
          fontWeight: 700,
          opacity: 0.9,
          textTransform: 'uppercase',
          borderRight: '1px solid currentColor',
          paddingRight: '10px'
        }}>
          ESTABLISHED 2026 — SANKALPA COUNSELING — PREMIUM PSYCHOTHERAPY
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex" style={{ flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span className="section-tag" style={{ margin: 0, backgroundColor: 'transparent', padding: 0, fontWeight: 600, color: 'var(--soft-charcoal)' }}>A Private Sanctuary</span>
              <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--eucalyptus-green)' }}></div>
            </div>

            <h1 className="mb-6" style={{
              fontSize: 'clamp(3.5rem, 10vw, 6rem)',
              maxWidth: '900px',
              lineHeight: 1.0,
              animation: 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both'
            }}>
              Supporting Healing, Growth, and Emotional Wellbeing
            </h1>

            <div style={{ maxWidth: '650px' }}>
              <p className="mb-8" style={{
                fontSize: '1.25rem',
                color: '#1A1A1A',
                fontWeight: 400,
                lineHeight: 1.8,
                animation: 'fadeInUp 1s ease-out 0.4s both'
              }}>
                {content.heroSubtitle}
              </p>
              <div className="flex gap-6" style={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}>
                <Link href="/booking" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1rem', borderRadius: '4px' }}>
                  {content.ctaText}
                </Link>
                <Link href="/services" className="btn btn-secondary" style={{ padding: '1.25rem 2rem', fontSize: '1rem' }}>
                  {content.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Introduction to the Practice */}
        <section className="section about-section">
          {/* Organic background shape */}
          <div className="organic-shape" style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '300px',
            height: '350px',
            background: 'var(--sand-beige)',
            opacity: 0.1,
            filter: 'blur(60px)',
            zIndex: 0
          }}></div>

          {/* Left Image */}
          <div className="about-image-card">
            <img src="/images/sun.png" alt="Forest with sunlight rays" className="about-image" />
          </div>

          {/* Right Content */}
          <div className="about-content">
            <span className="section-tag" style={{ backgroundColor: 'rgba(125,145,130,0.1)', color: 'var(--soft-charcoal)' }}>ABOUT SANKALPA COUNSELING</span>
            <h2 className="about-heading">
              A Space for Healing, <span style={{ fontStyle: 'italic', color: 'var(--warm-terracotta)' }}>Reflection</span> &amp; Growth
            </h2>
            <div className="about-copy">
              <p>
                Welcome to Sankalpa Counseling. I'm Mahima Tirunelveli Santhakumar, a licensed psychotherapist dedicated to creating a warm, non‑judgmental space where healing can unfold naturally.
              </p>
              <p>
                The Sanskrit word “Sankalpa” means intention — a heartfelt resolve towards healing and growth. This philosophy guides every therapeutic relationship we build together.
              </p>
              <p>
                I specialize in trauma‑informed care, anxiety, depression, life transitions, and disordered eating, to name a few. I work with youth, adults, and couples, supporting each age group through their unique challenges.
              </p>
            </div>
            <ul className="about-list">
              <li>Trauma‑Informed Care</li>
              <li>Compassionate Support</li>
              <li>Culturally Sensitive</li>
              <li>Personalized Approach</li>
            </ul>
            <Link href="/about" className="btn btn-primary" style={{ fontSize: 'var(--button-text)', padding: '1rem 2.5rem' }}>
              Learn More About My Approach →
            </Link>
          </div>
        </section>


      {/* Unique Philosophy Showcase */}
      <section className="section bg-white" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="grid grid-cols-2 items-center" style={{ gap: '5rem' }}>
            <div style={{ position: 'relative' }}>
              <div className="organic-shape shadow-soft" style={{
                width: '100%',
                aspectRatio: '1/1',
                backgroundColor: 'var(--surface-sand)',
                border: '1px solid rgba(220, 205, 184, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem',
                textAlign: 'center'
              }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2, fontWeight: 400 }}>
                  {content.showcaseTitle.includes("art") ? (
                    <>
                      {content.showcaseTitle.split("art")[0]}
                      <span style={{ fontStyle: 'italic', color: 'var(--eucalyptus-green)' }}>art</span>
                      {content.showcaseTitle.split("art")[1]}
                    </>
                  ) : content.showcaseTitle}
                </h2>
              </div>
              {/* Floating Decorative Element - Integrated better */}
              <div className="animate-pulse-soft" style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                background: 'rgba(220, 205, 184, 0.4)', // var(--sand-beige) with opacity
                borderRadius: '50%',
                zIndex: -1,
                filter: 'blur(10px)'
              }}></div>
            </div>

            <div>
              <span className="section-tag">{content.introTitle}</span>
              <div style={{ marginTop: '3rem' }}>
                {[
                  { title: 'Confidentiality', text: 'A secure vault for your innermost thoughts and vulnerabilities.' },
                  { title: 'Compassion', text: 'Radiating warmth and zero-judgment empathy in every interaction.' },
                  { title: 'Competence', text: 'Evidence-based clinical rigor meeting deep therapeutic intuition.' }
                ].map((pillar, i) => (
                  <div key={i} style={{
                    marginBottom: '3rem',
                    paddingLeft: '2rem',
                    borderLeft: '2px solid var(--eucalyptus-green)',
                    backgroundColor: 'var(--surface-cream)',
                    padding: '1.5rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.3s ease'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--eucalyptus-green)' }}>0{i + 1}. {pillar.title}</h3>
                    <p style={{ fontSize: '1rem', color: '#444', margin: 0 }}>{pillar.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Services */}
      <section className="section bg-color">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-tag">How I Can Help</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginTop: '0.5rem' }}>Therapeutic Services</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* Card 1 – Individual Therapy */}
            <div className="card" style={{
              backgroundColor: 'var(--surface-sage)',
              borderColor: 'rgba(168,181,162,0.2)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Heart color="var(--eucalyptus-green)" size={32} />
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: 0 }}>Individual Therapy</h3>
              <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
                Deep one-on-one sessions designed to untangle complex emotions and build lasting resilience.
              </p>
              <Link href="/services#individual" className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Explore →
              </Link>
            </div>

            {/* Card 2 – Couples Counseling */}
            <div className="card" style={{
              backgroundColor: 'var(--surface-blue)',
              borderColor: 'rgba(170,187,200,0.2)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Users color="var(--eucalyptus-green)" size={32} />
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: 0 }}>Couples Counseling</h3>
              <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
                Restoring communication and intimacy through guided, compassionate collaborative work.
              </p>
              <Link href="/services#couples" className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Explore →
              </Link>
            </div>

            {/* Card 3 – Trauma Recovery */}
            <div className="card" style={{
              backgroundColor: 'var(--surface-sand)',
              borderColor: 'rgba(220,205,184,0.3)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Sparkles color="var(--warm-terracotta)" size={32} />
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: 0 }}>Trauma Recovery</h3>
              <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
                A gentle, paced approach to reclaiming your narrative and sense of safety.
              </p>
              <Link href="/services#trauma" className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Explore →
              </Link>
            </div>

            {/* Card 4 – Adolescent Support */}
            <div className="card" style={{
              backgroundColor: 'var(--surface-cream)',
              borderColor: 'rgba(0,0,0,0.03)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Heart color="var(--dusty-blue)" size={32} />
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: 0 }}>Adolescent Support</h3>
              <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
                Navigating the emotional landscape of growth with specialized, youth-centered counseling.
              </p>
              <Link href="/services#adolescent" className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Explore →
              </Link>
            </div>

            {/* Card 5 – Group Counseling */}
            <div className="card" style={{
              backgroundColor: 'var(--surface-sage)',
              borderColor: 'rgba(168,181,162,0.2)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <Users color="var(--warm-terracotta)" size={32} />
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginBottom: 0 }}>Group Counseling</h3>
              <p style={{ fontSize: '1rem', margin: 0, lineHeight: 1.7 }}>
                Heal in community. Structured group sessions offering shared support, connection, and growth.
              </p>
              <Link href="/services#group" className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Therapy Process */}
      <section className="section section-bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-tag">The Journey</span>
            <h2>Your Path to Wellness</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>Starting therapy is a courageous step. We have designed our process to be as gentle, transparent, and supportive as possible.</p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Free Consultation', desc: 'A brief 15-minute call to discuss your needs and ensure we are a good fit.', color: 'var(--surface-blue)' },
              { step: '02', title: 'First Session', desc: 'An intake session to gather history, explore concerns, and set goals.', color: 'var(--surface-sage)' },
              { step: '03', title: 'Ongoing Therapy', desc: 'Regular sessions focusing on emotional exploration and skill-building.', color: 'var(--surface-sand)' },
              { step: '04', title: 'Growth & Healing', desc: 'Reviewing progress, stepping down frequency, and maintaining wellness.', color: 'var(--surface-cream)' }
            ].map((item, i) => (
              <div key={i} style={{
                padding: '2.5rem 2rem',
                backgroundColor: item.color,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(0,0,0,0.03)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                <div style={{ color: 'var(--sand-beige)', fontSize: '3rem', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: '1.5rem' }}>{item.step}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--eucalyptus-green)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-tag">Client Stories</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginTop: '0.5rem' }}>What Clients Say</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Testimonial 1 */}
            <div style={{
              backgroundColor: 'var(--surface-cream)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '1rem',
                left: '1.5rem',
                fontSize: '5rem',
                lineHeight: 1,
                color: 'rgba(125, 145, 130, 0.15)',
                fontFamily: 'var(--font-serif)',
                zIndex: 0
              }}>“</span>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'var(--soft-charcoal)',
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 1,
                fontStyle: 'italic'
              }}>
                I am so grateful to Mahima for creating a safe space where me and my husband have been able to start to heal our relationship. I have seen my husband get vulnerable for the first time and we are starting to connect again after many years.
              </p>
              <div className="flex items-center gap-4">
                <div style={{ width: '30px', height: '2px', backgroundColor: 'var(--eucalyptus-green)' }}></div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--eucalyptus-green)' }}>— Couples Counseling Client</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div style={{
              backgroundColor: 'var(--surface-cream)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '1rem',
                left: '1.5rem',
                fontSize: '5rem',
                lineHeight: 1,
                color: 'rgba(125, 145, 130, 0.15)',
                fontFamily: 'var(--font-serif)',
                zIndex: 0
              }}>“</span>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'var(--soft-charcoal)',
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 1,
                fontStyle: 'italic'
              }}>
                Mahima has been there for me through a lot of ups and downs in my life in the past few years, and her consistent presence has been such a helpful source of strength and support for me as I have navigated career changes and a major loss in my life.
              </p>
              <div className="flex items-center gap-4">
                <div style={{ width: '30px', height: '2px', backgroundColor: 'var(--eucalyptus-green)' }}></div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--eucalyptus-green)' }}>— Individual Counseling Client</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Aesthetic CTA Journey Section */}
      <section className="section" style={{
        backgroundColor: '#F8F9F7',
        color: 'var(--soft-charcoal)',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-tag" style={{ backgroundColor: 'rgba(125, 145, 130, 0.1)', color: 'var(--eucalyptus-green)', marginBottom: '1.5rem' }}>The Final Step</span>
            <h2 style={{ color: 'var(--soft-charcoal)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>Ready to begin?</h2>
            <p style={{
              color: '#444',
              fontSize: '1.25rem',
              lineHeight: 1.8,
              marginBottom: '3rem',
              fontStyle: 'italic',
              fontWeight: 400
            }}>
              "Healing is not just the discovery of what is broken, but the quiet reclamation of what has always been whole. Your journey back to yourself starts here."
            </p>
            <div className="flex justify-center">
              <Link href="/booking" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem' }}>
                Schedule Your Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

