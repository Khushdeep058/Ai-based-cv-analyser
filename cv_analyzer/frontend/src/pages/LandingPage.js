import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const S = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: 'var(--color-background)',
    color: 'var(--color-on-surface)',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  noiseOverlay: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.028,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: '128px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 32px',
    position: 'relative',
    zIndex: 1,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'relative',
    zIndex: 10,
  },
  navLogo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '20px',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 30%, #7c6cff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
  },
  navLinks: { display: 'flex', gap: '32px', listStyle: 'none' },
  navLink: { fontSize: '14px', color: '#7a7a94', textDecoration: 'none', fontWeight: 400 },
  navCta: {
    background: '#7c6cff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    padding: '10px 22px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.01em',
  },
  hero: {
    padding: '100px 0 80px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'center',
    position: 'relative',
  },
  ambient1: {
    position: 'absolute',
    width: '700px', height: '700px',
    background: 'radial-gradient(circle, rgba(124,108,255,0.18) 0%, transparent 70%)',
    top: '-200px', left: '-100px',
    borderRadius: '50%',
    pointerEvents: 'none', zIndex: 0,
  },
  ambient2: {
    position: 'absolute',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)',
    top: '60px', right: '-80px',
    borderRadius: '50%',
    pointerEvents: 'none', zIndex: 0,
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 16px', borderRadius: '100px',
    background: 'rgba(124,108,255,0.12)',
    border: '1px solid rgba(124,108,255,0.3)',
    fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em',
    textTransform: 'uppercase', color: '#7c6cff', marginBottom: '28px',
  },
  eyebrowDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#7c6cff' },
  heroH1: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '58px',
    lineHeight: 1.05, letterSpacing: '-2px', color: 'var(--color-on-surface)', marginBottom: '24px',
  },
  heroGrad: {
    background: 'linear-gradient(135deg, #7c6cff 0%, #4ecdc4 60%, #ff6b9d 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  heroBody: {
    fontSize: '16px', lineHeight: 1.75, color: 'var(--color-on-surface-variant)',
    marginBottom: '40px', fontWeight: 300, maxWidth: '420px',
  },
  ctaRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  ctaPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'linear-gradient(135deg, #7c6cff, #9b8eff)',
    color: '#fff', border: 'none', cursor: 'pointer',
    padding: '14px 28px', borderRadius: '100px',
    fontSize: '15px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 0 40px rgba(124,108,255,0.3)', textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  ctaSecondary: {
    fontSize: '14px', color: '#7a7a94', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '6px',
  },

  /* Upload flow card */
  uploadCard: {
    background: 'var(--color-surface-container-low)',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: '20px',
    padding: '28px',
    position: 'relative', overflow: 'hidden',
  },
  uploadCardShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(124,108,255,0.6), rgba(78,205,196,0.4), transparent)',
  },
  uploadTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px',
    color: 'var(--color-on-surface)', marginBottom: '20px',
  },
  uploadSteps: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
  uploadStep: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px', padding: '12px 16px',
  },
  uploadStepIcon: (color) => ({
    width: '32px', height: '32px', borderRadius: '8px',
    background: color, display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  }),
  uploadStepLabel: { fontSize: '13px', fontWeight: 500, color: '#e8e8f0' },
  uploadStepSub: { fontSize: '11px', color: '#7a7a94', marginTop: '1px' },
  uploadArrow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '12px',
    background: 'linear-gradient(135deg, rgba(124,108,255,0.15), rgba(78,205,196,0.1))',
    borderRadius: '12px',
    fontSize: '13px', color: '#7a7a94',
  },
  outputChip: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.2)',
    color: '#4ecdc4', borderRadius: '100px', padding: '4px 12px', fontSize: '12px', fontWeight: 500,
  },

  /* Features */
  featHeader: { textAlign: 'center', marginBottom: '64px' },
  featOverline: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c6cff', fontWeight: 500, marginBottom: '16px' },
  featH2: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '40px',
    color: 'var(--color-on-surface)', lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '16px',
  },
  featSub: { fontSize: '16px', color: 'var(--color-on-surface-variant)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, fontWeight: 300 },
  featGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px',
    background: 'var(--color-outline-variant)',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: '20px', overflow: 'hidden',
  },
  featCell: {
    background: 'var(--color-surface)', padding: '40px 36px',
    position: 'relative', overflow: 'hidden', transition: 'background 0.3s', cursor: 'default',
  },
  featIcon: (bg) => ({
    width: '48px', height: '48px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.14)', background: bg,
  }),
  featH3: {
    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '20px',
    color: 'var(--color-on-surface)', marginBottom: '12px', letterSpacing: '-0.5px',
  },
  featBody: { fontSize: '14px', lineHeight: 1.75, color: 'var(--color-on-surface-variant)', fontWeight: 300 },

  /* How it works */
  howSection: { padding: '96px 0', borderTop: '1px solid rgba(255,255,255,0.07)' },
  howGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' },
  howSteps: { display: 'flex', flexDirection: 'column', gap: '32px' },
  howStep: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  howStepNum: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '13px', color: '#7c6cff',
    background: 'rgba(124,108,255,0.12)', border: '1px solid rgba(124,108,255,0.25)',
    borderRadius: '8px', padding: '4px 10px', minWidth: '32px', textAlign: 'center', marginTop: '2px', flexShrink: 0,
  },
  howStepTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '17px', color: 'var(--color-on-surface)', marginBottom: '6px' },
  howStepBody: { fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: 1.7, fontWeight: 300 },

  /* CTA */
  ctaSection: { padding: '96px 0', textAlign: 'center', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.07)' },
  ctaGlow: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '600px', height: '300px', pointerEvents: 'none',
    background: 'radial-gradient(ellipse, rgba(124,108,255,0.12) 0%, transparent 70%)',
  },
  ctaH2: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '50px',
    color: 'var(--color-on-surface)', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '20px', position: 'relative', zIndex: 1,
  },
  ctaP: { fontSize: '16px', color: 'var(--color-on-surface-variant)', marginBottom: '40px', fontWeight: 300, position: 'relative', zIndex: 1 },

  sep: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: 0 },

  footer: {
    borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 40px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'relative', zIndex: 1,
  },
  footerLogo: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '18px',
    background: 'linear-gradient(135deg, #fff 30%, #7c6cff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    textDecoration: 'none',
  },
  footerLinks: { display: 'flex', gap: '28px', listStyle: 'none' },
  footerLink: { fontSize: '13px', color: '#7a7a94', textDecoration: 'none' },
  footerCopy: { fontSize: '12px', color: '#7a7a94' },
};

const FeatCell = ({ iconBg, iconColor, iconClass, title, body }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
      <div
      style={{ ...S.featCell, background: hovered ? 'var(--color-surface-container-low)' : 'var(--color-surface)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.featIcon(iconBg)}>
        <i className={iconClass} style={{ color: iconColor, fontSize: '22px' }} aria-hidden="true" />
      </div>
      <h3 style={S.featH3}>{title}</h3>
      <p style={S.featBody}>{body}</p>
    </div>
  );
};

const LandingPage = () => {
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = '0%';
      setTimeout(() => { if (barRef.current) barRef.current.style.width = '100%'; }, 300);
    }
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" rel="stylesheet" />

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)} }
        @keyframes float-up { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        .eyebrow-dot-anim { animation: pulse-dot 2s ease-in-out infinite; }
        .hero-card-anim { animation: float-up 4s ease-in-out infinite; }
        .bar-grow { transition: width 1.4s cubic-bezier(.4,0,.2,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(124,108,255,.45) !important; }
        .nav-cta-btn:hover { opacity: .85; transform: translateY(-1px); }
        a { text-decoration: none; }
      `}</style>

      <div style={S.root}>
        <div style={S.noiseOverlay} />

        {/* Nav is handled by App.js globally */}

        {/* Hero */}
        <div style={S.container}>
          <div style={S.hero}>
            <div style={S.ambient1} />
            <div style={S.ambient2} />

            {/* Copy */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={S.eyebrow}>
                <div className="eyebrow-dot-anim" style={S.eyebrowDot} />
                AI-powered career analysis
              </div>
              <h1 style={S.heroH1}>
                Know exactly how<br />
                <span style={S.heroGrad}>recruiters see you</span>
              </h1>
              <p style={S.heroBody}>
                Upload your resume, paste a job description, and share your LinkedIn PDF. Our AI breaks down every gap, mismatch, and missed signal — so you can fix them before applying.
              </p>
              <div style={S.ctaRow}>
                <Link to="/dashboard" className="cta-btn" style={S.ctaPrimary}>
                  Start your analysis
                  <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: '16px' }} />
                </Link>
                <a href="#how-it-works" style={S.ctaSecondary}>
                  See how it works
                  <i className="ti ti-chevron-down" aria-hidden="true" style={{ fontSize: '14px' }} />
                </a>
              </div>
            </div>

            {/* Visual: upload flow card */}
            <div className="hero-card-anim" style={{ position: 'relative', zIndex: 2 }}>
              <div style={S.uploadCard}>
                <div style={S.uploadCardShine} />
                <div style={S.uploadTitle}>What you bring</div>
                <div style={S.uploadSteps}>
                  {[
                    { icon: 'ti ti-file-text', color: 'rgba(124,108,255,0.18)', iconColor: '#7c6cff', label: 'Your Resume', sub: 'PDF or DOCX' },
                    { icon: 'ti ti-clipboard-text', color: 'rgba(78,205,196,0.15)', iconColor: '#4ecdc4', label: 'Job Description', sub: 'Paste the JD text' },
                    { icon: 'ti ti-brand-linkedin', color: 'rgba(255,107,157,0.13)', iconColor: '#ff6b9d', label: 'LinkedIn Profile', sub: 'Export as PDF' },
                  ].map(({ icon, color, iconColor, label, sub }) => (
                    <div key={label} style={S.uploadStep}>
                      <div style={S.uploadStepIcon(color)}>
                        <i className={icon} style={{ color: iconColor, fontSize: '16px' }} aria-hidden="true" />
                      </div>
                      <div>
                        <div style={S.uploadStepLabel}>{label}</div>
                        <div style={S.uploadStepSub}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.uploadArrow}>
                  <i className="ti ti-sparkles" style={{ color: '#7c6cff', fontSize: '16px' }} aria-hidden="true" />
                  <span>AI analyses all three together</span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['ATS fit score', 'LinkedIn audit', 'GitHub signals', 'Keyword gaps'].map(t => (
                    <span key={t} style={S.outputChip}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style={S.sep} />

        {/* Features */}
        <div style={{ padding: '96px 0' }} id="features">
          <div style={S.container}>
            <div style={S.featHeader}>
              <div style={S.featOverline}>What we analyse</div>
              <h2 style={S.featH2}>Three lenses on your<br />professional presence</h2>
              <p style={S.featSub}>
                Most candidates guess what's wrong. SkillSync AI tells you exactly — across every signal recruiters and ATS systems actually use.
              </p>
            </div>
            <div style={S.featGrid}>
              <FeatCell
                iconBg="rgba(124,108,255,0.15)"
                iconColor="#7c6cff"
                iconClass="ti ti-scan"
                title="Deep ATS Resume Parsing"
                body="Our NLP model breaks down your resume exactly as enterprise ATS systems do — exposing keyword gaps, formatting traps, and compatibility issues before you apply."
              />
              <FeatCell
                iconBg="rgba(78,205,196,0.12)"
                iconColor="#4ecdc4"
                iconClass="ti ti-topology-star-3"
                title="Multi-Agent LinkedIn Audit"
                body="Specialized agents analyze distinct profile segments — from headline impact scoring to network density — with recommendations tuned to trigger recruiter search algorithms."
              />
              <FeatCell
                iconBg="rgba(255,107,157,0.12)"
                iconColor="#ff6b9d"
                iconClass="ti ti-code"
                title="Live GitHub Scraping"
                body="Our engine connects directly to your repos, scraping commit history and language usage to generate verifiable credentials engineering managers can trust."
              />
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={S.howSection} id="how-it-works">
          <div style={S.container}>
            <div style={S.howGrid}>
              <div>
                <div style={S.featOverline}>How it works</div>
                <h2 style={{ ...S.featH2, textAlign: 'left', marginBottom: '40px' }}>
                  Upload once,<br />understand everything
                </h2>
                <div style={S.howSteps}>
                  {[
                    {
                      num: '01',
                      title: 'Upload your resume',
                      body: 'Drop in your PDF or DOCX. Our parser reads it the same way an enterprise ATS would.',
                    },
                    {
                      num: '02',
                      title: 'Paste the job description',
                      body: 'Copy the JD from any job board. We extract the exact keywords and requirements the role demands.',
                    },
                    {
                      num: '03',
                      title: 'Share your LinkedIn PDF',
                      body: 'Export your LinkedIn profile as a PDF and upload it. We audit every section for recruiter-algorithm visibility.',
                    },
                    {
                      num: '04',
                      title: 'Get your full report',
                      body: 'Receive a detailed breakdown of ATS compatibility, LinkedIn gaps, and GitHub credential signals — with prioritised fixes.',
                    },
                  ].map(s => (
                    <div key={s.num} style={S.howStep}>
                      <div style={S.howStepNum}>{s.num}</div>
                      <div>
                        <div style={S.howStepTitle}>{s.title}</div>
                        <div style={S.howStepBody}>{s.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal mockup — shows what the analysis produces */}
              <div style={{
                background: '#12121a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  background: '#0e0e18',
                }}>
                  {['#ff6b9d', '#ffd700', '#4ecdc4'].map((c, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.8 }} />
                  ))}
                  <span style={{ fontSize: '12px', color: '#7a7a94', marginLeft: '8px', fontFamily: 'monospace' }}>analysis_report.json</span>
                </div>
                <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 2.1 }}>
                  <div><span style={{ color: '#7a7a94' }}>{'{'}</span></div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span style={{ color: '#7c6cff' }}>"ats_compatibility"</span>
                    <span style={{ color: '#7a7a94' }}>: </span>
                    <span style={{ color: '#ff6b9d' }}>"72% — 8 keyword gaps found"</span><span style={{ color: '#7a7a94' }}>,</span>
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span style={{ color: '#7c6cff' }}>"missing_keywords"</span>
                    <span style={{ color: '#7a7a94' }}>: [</span>
                    <span style={{ color: '#4ecdc4' }}>"Docker"</span>
                    <span style={{ color: '#7a7a94' }}>, </span>
                    <span style={{ color: '#4ecdc4' }}>"CI/CD"</span>
                    <span style={{ color: '#7a7a94' }}>, </span>
                    <span style={{ color: '#4ecdc4' }}>"GraphQL"</span>
                    <span style={{ color: '#7a7a94' }}>...],</span>
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span style={{ color: '#7c6cff' }}>"linkedin_headline"</span>
                    <span style={{ color: '#7a7a94' }}>: </span>
                    <span style={{ color: '#ff6b9d' }}>"weak — add role keywords"</span><span style={{ color: '#7a7a94' }}>,</span>
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span style={{ color: '#7c6cff' }}>"github_top_langs"</span>
                    <span style={{ color: '#7a7a94' }}>: [</span>
                    <span style={{ color: '#4ecdc4' }}>"TypeScript"</span>
                    <span style={{ color: '#7a7a94' }}>, </span>
                    <span style={{ color: '#4ecdc4' }}>"Python"</span>
                    <span style={{ color: '#7a7a94' }}>],</span>
                  </div>
                  <div style={{ paddingLeft: '16px' }}>
                    <span style={{ color: '#7c6cff' }}>"priority_fixes"</span>
                    <span style={{ color: '#7a7a94' }}>: </span>
                    <span style={{ color: '#ffd700' }}>3</span>
                    <span style={{ color: '#7a7a94' }}> high-impact actions</span>
                  </div>
                  <div><span style={{ color: '#7a7a94' }}>{'}'}</span></div>
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ color: '#4ecdc4' }}>✓</span>
                    <span style={{ color: '#7a7a94' }}> Report ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div style={S.ctaSection}>
          <div style={S.ctaGlow} />
          <div style={S.container}>
            <h2 style={S.ctaH2}>See what you're missing.</h2>
            <p style={S.ctaP}>Upload your resume, JD, and LinkedIn PDF — get your full analysis in seconds.</p>
            <Link to="/dashboard" className="cta-btn" style={{ ...S.ctaPrimary, fontSize: '16px', padding: '16px 36px', position: 'relative', zIndex: 1 }}>
              Start your analysis
              <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: '16px' }} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer style={S.footer}>
          <Link to="/" style={S.footerLogo}>SkillSync AI</Link>
          <ul style={S.footerLinks}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <li key={l}><Link to="/" style={S.footerLink}>{l}</Link></li>
            ))}
          </ul>
          <div style={S.footerCopy}>© 2025 SkillSync AI</div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
