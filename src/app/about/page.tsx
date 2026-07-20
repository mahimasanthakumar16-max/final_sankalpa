import Link from 'next/link';
import { GraduationCap, IdCard, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section style={{
        paddingTop: 'calc(var(--spacing-xxl) + 60px)',
        paddingBottom: 'var(--spacing-xl)',
        textAlign: 'center',
        backgroundColor: 'var(--warm-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Organic accent */}
        <div className="organic-shape" style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '300px', height: '300px',
          background: 'var(--sage-green)', opacity: 0.06, filter: 'blur(60px)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
            ABOUT SANKALPA COUNSELING
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: 'var(--soft-charcoal)',
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
            animation: 'fadeIn 1s ease-out both',
          }}>
            Healing Begins with <span style={{ fontStyle: 'italic', color: 'var(--warm-terracotta)' }}>Connection</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--soft-charcoal)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.8,
            animation: 'fadeInUp 0.8s ease-out 0.3s both',
          }}>
            A compassionate, culturally sensitive, and affirming space where healing, growth, and self-discovery can unfold naturally.
          </p>
        </div>
      </section>

      {/* ─── Main 2-Column Editorial Layout ─── */}
      <section className="section" style={{
        backgroundColor: 'var(--section-bg)',
        animation: 'fadeIn 1s ease-out 0.4s both',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'start',
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ position: 'sticky', top: '120px' }}>
              {/* Image with organic accents */}
              <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                {/* Sage blob behind */}
                <div className="organic-shape animate-pulse-soft" style={{
                  position: 'absolute', top: '-25px', left: '-25px',
                  width: '180px', height: '200px',
                  background: 'var(--sage-green)', opacity: 0.12,
                  filter: 'blur(20px)', zIndex: 0,
                }} />
                {/* Terracotta accent shape */}
                <div style={{
                  position: 'absolute', bottom: '-15px', right: '-15px',
                  width: '100px', height: '100px',
                  background: 'var(--warm-terracotta)', opacity: 0.1,
                  borderRadius: '50%', filter: 'blur(15px)', zIndex: 0,
                }} />
                {/* Image frame */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  aspectRatio: '4/5',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  border: '5px solid var(--sand-beige)',
                  boxShadow: '0 20px 50px -15px rgba(0,0,0,0.1)',
                  backgroundColor: 'var(--surface-cream)',
                }}>
                  <img
                    src="/images/Mahima.png"
                    alt="Mahima Tirunelveli Santhakumar — Licensed Psychotherapist"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

              {/* ── Credentials Card ── */}
              <div style={{
                background: 'var(--surface-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                border: '1px solid rgba(220, 205, 184, 0.4)',
                boxShadow: '0 12px 35px -10px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--eucalyptus-green), var(--warm-terracotta))',
                }} />

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                  color: 'var(--soft-charcoal)',
                  marginBottom: '1.5rem',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}>Credentials &amp; Training</h3>

                {/* Education */}
                <div style={{ marginBottom: '1.75rem' }}>
                  {[
                    { icon: '🎓', title: 'BSc in Psychology', sub: 'University of Toronto (Canada)' },
                    { icon: '🎓', title: 'MA in Counseling Psychology', sub: 'University of Denver (USA)' },
                    { icon: '🪪', title: 'Licensed Professional Counselor Candidate', sub: 'Colorado USA (LPCC.0023442)' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      marginBottom: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(220,205,184,0.2)',
                    }}>
                      <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--soft-charcoal)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--soft-charcoal)', marginTop: '2px' }}>
                          {item.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Training */}
                <div style={{
                  borderTop: '1px solid rgba(220,205,184,0.3)',
                  paddingTop: '1.25rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontWeight: 500,
                    fontSize: '0.85rem', textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: 'var(--eucalyptus-green)',
                    marginBottom: '0.75rem',
                  }}>Training</div>
                  {[
                    'Trauma Focused Cognitive Behavioral Therapy',
                    'EMDR Basic Training',
                    'Narrative Therapy Training',
                    'Multicultural Orientation Training',
                  ].map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      marginBottom: '0.5rem',
                      fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                      color: 'var(--soft-charcoal)',
                    }}>
                      <CheckCircle2 size={16} color="var(--eucalyptus-green)" style={{ flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div>
              {/* Name & Subtitle */}
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 400,
                color: 'var(--soft-charcoal)',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
              }}>
                Mahima Tirunelveli Santhakumar
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                color: 'var(--warm-terracotta)',
                fontWeight: 500,
                marginBottom: '2.5rem',
                lineHeight: 1.6,
              }}>
                Counselling Psychologist | Psychotherapist
              </p>

              {/* ── Section 1: Namaste ── */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
                  fontWeight: 400,
                  color: 'var(--soft-charcoal)',
                  marginBottom: '1.25rem',
                  fontStyle: 'italic',
                }}>
                  Namaste! Vannakam!
                </h3>

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I&apos;m Mahima Tirunelveli Santhakumar, and I founded Sankalpa Counseling with a deep belief that everyone deserves access to compassionate, culturally sensitive mental health support.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  The word &ldquo;Sankalpa&rdquo; comes from Sanskrit, meaning a heartfelt intention or resolve. It represents a sacred determination to unite your thoughts, words, and actions toward your true purpose.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I bring to my work the hope that we can all work towards living our lives in alignment with our intentions and values and the belief that everyone has the capacity for healing, growth, and transformation within themselves.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)' }}>
                  I hope you will give me the honor of walking alongside you on your journey.
                </p>
              </div>

              {/* ── Quote Card ── */}
              <div style={{
                position: 'relative',
                padding: '2rem 2.5rem',
                marginBottom: '3rem',
                backgroundColor: 'var(--surface-sand)',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--warm-terracotta)',
                boxShadow: '0 8px 25px -8px rgba(0,0,0,0.06)',
              }}>
                <div className="organic-shape" style={{
                  position: 'absolute', top: '-10px', right: '-10px',
                  width: '80px', height: '80px',
                  background: 'var(--warm-terracotta)', opacity: 0.08,
                  filter: 'blur(10px)',
                }} />
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                  fontStyle: 'italic',
                  color: 'var(--warm-terracotta)',
                  lineHeight: 1.6,
                  margin: 0,
                  position: 'relative', zIndex: 1,
                }}>
                  &ldquo;Healing begins when we feel seen, safe, and accepted for who we truly are.&rdquo;
                </p>
              </div>

              {/* ── Section 2: My Approach ── */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 400,
                  color: 'var(--soft-charcoal)',
                  marginBottom: '1.25rem',
                  letterSpacing: '0.02em',
                }}>
                  My Approach
                </h3>

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  Have you ever felt like parts of your identity are misunderstood, or completely unseen in the therapy room?
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I believe that healing begins when we feel seen, safe, and accepted for who we truly are.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  In my work, I strive to create a supportive space where you can show up fully without having to leave any part of your identity at the door.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I work with adolescents, adults, and couples facing a wide range of challenges, including depression, anxiety, trauma, life transitions, identity exploration, and sub-clinical levels of disordered eating.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  Whether you are exploring who you are, carrying the weight of generational or personal trauma, or seeking a more grounded, authentic connection to yourself and others, I am here to support you with curiosity, compassion, and cultural humility.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  My approach is warm, collaborative, and rooted in the belief that you are the expert of your own story.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  Clients have often shared that they feel safe, respected, and truly heard in their work with me and I hope you will say the same.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)' }}>
                  I draw from culturally responsive, research-informed practices like Humanistic, Cultural-relational, Narrative Therapy, Mindfulness, Eye Movement Desensitization and Reprocessing, and other interventions to tailor therapy to your needs, values, and lived experience.
                </p>
              </div>

              {/* ── Section 3: A Bit More About Me ── */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 400,
                  color: 'var(--soft-charcoal)',
                  marginBottom: '1.25rem',
                  letterSpacing: '0.02em',
                }}>
                  A Bit More About Me
                </h3>

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I bring a globally informed lens to my work.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  Originally from India, I have lived in several countries around the world so I have a deep understanding of how culture, migration, and identity shape our inner world.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I hope to create space for my clients&apos; heritage, traditions, and unique worldviews to be reflected and honored in therapy so that healing can be reclaimed on your own terms.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I am committed to creating an affirming, inclusive, and welcoming environment where individuals from all backgrounds, identities, and life experiences feel seen, respected, and supported.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  I work with people of all gender identities and sexual orientations and strive to ensure that every client feels safe, valued, and able to show up authentically.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)', marginBottom: '1rem' }}>
                  If you are navigating challenges, seeking greater self-understanding, or simply looking for a space to reflect and be heard, I strive to provide a therapeutic relationship that honors your whole self.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.8, color: 'var(--soft-charcoal)' }}>
                  If you are ready to explore your story in a supportive, affirming, and nonjudgmental environment, I would be delighted to connect with you.
                </p>
              </div>

              {/* ── Specialization Pills ── */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                  fontWeight: 400,
                  color: 'var(--soft-charcoal)',
                  marginBottom: '1.25rem',
                  letterSpacing: '0.02em',
                }}>
                  Areas of Specialization
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {[
                    'Trauma-Informed Care',
                    'Anxiety',
                    'Depression',
                    'Life Transitions',
                    'Identity Exploration',
                    'Disordered Eating',
                    'Neurodivergence',
                  ].map((spec, i) => (
                    <span key={i} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1.1rem',
                      backgroundColor: 'var(--surface-sage)',
                      color: 'var(--soft-charcoal)',
                      borderRadius: 'var(--radius-pill)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      border: '1px solid rgba(168,181,162,0.25)',
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle2 size={14} color="var(--eucalyptus-green)" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="section" style={{
        backgroundColor: 'var(--surface-sand)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Organic accents */}
        <div className="organic-shape" style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '200px', height: '200px',
          background: 'var(--sage-green)', opacity: 0.08,
          filter: 'blur(40px)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color: 'var(--soft-charcoal)',
            marginBottom: '1.25rem',
            letterSpacing: '0.02em',
          }}>
            Begin Your Healing Journey
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--soft-charcoal)',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
          }}>
            If you are ready to explore your story in a supportive, affirming, and nonjudgmental environment, I would be delighted to connect with you.
          </p>
          <Link href="/booking" className="btn btn-primary" style={{
            padding: '1.25rem 3rem',
            fontSize: 'var(--button-text)',
          }}>
            Book a Consultation →
          </Link>
        </div>
      </section>
    </>
  );
}
