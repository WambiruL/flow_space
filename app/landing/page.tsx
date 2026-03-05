'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Flame, Zap } from 'lucide-react'

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  bg:        '#3C1518',
  bgMid:     '#521A10',
  bgDeep:    '#69140E',
  rust:      '#A44200',
  amber:     '#D58936',
  cream:     '#F2F3AE',
  creamDim:  '#C8C97A',
  creamMute: '#8A8A45',
  border:    '#6B2420',
  borderMid: '#7D2D20',
} as const

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Nunito:wght@300;400;500;600;700&display=swap');

  :root {
    --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out:    cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes blobDrift1 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33%       { transform: translate(18px, -14px) scale(1.04); }
    66%       { transform: translate(-12px, 10px) scale(0.97); }
  }
  @keyframes blobDrift2 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    40%       { transform: translate(-20px, 16px) scale(1.06); }
    70%       { transform: translate(14px, -8px) scale(0.96); }
  }
  @keyframes blobDrift3 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    50%       { transform: translate(10px, 20px) scale(1.03); }
  }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pillShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes floatA {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes floatC {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes floatD {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0  6px #D5893660; }
    50%       { box-shadow: 0 0 18px #D5893699; }
  }
  @keyframes typingDot {
    0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
    30%            { opacity: 1;    transform: translateY(-3px); }
  }
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0);   opacity: 0.5; }
    50%       { transform: translateY(5px); opacity: 1; }
  }
  @keyframes drawPath {
    from { stroke-dashoffset: 320; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes barFill {
    from { width: 0%; }
    to   { width: 78%; }
  }

  .blob1 { animation: blobDrift1 18s ease-in-out infinite; }
  .blob2 { animation: blobDrift2 22s ease-in-out infinite 3s; }
  .blob3 { animation: blobDrift3 26s ease-in-out infinite 6s; }

  .card-float-a { animation: floatA 5.5s ease-in-out infinite; }
  .card-float-b { animation: floatB 7.0s ease-in-out infinite 1.1s; }
  .card-float-c { animation: floatC 4.8s ease-in-out infinite 0.6s; }
  .card-float-d { animation: floatD 6.2s ease-in-out infinite 2.0s; }

  .hero-item { opacity: 0; animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .hero-item-1 { animation-delay: 0.10s; }
  .hero-item-2 { animation-delay: 0.22s; }
  .hero-item-3 { animation-delay: 0.34s; }
  .hero-item-4 { animation-delay: 0.46s; }
  .hero-item-5 { animation-delay: 0.58s; }
  .hero-item-6 { animation-delay: 0.70s; }
  .hero-mock   { opacity: 0; animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.30s both; }

  .glow-pulse { animation: glowPulse 2.8s ease-in-out infinite; }

  .typing-dot   { animation: typingDot 1.4s ease-in-out infinite; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .typing-dot-2 { animation-delay: 0.2s; }
  .typing-dot-3 { animation-delay: 0.4s; }

  .scroll-cue { animation: scrollBounce 1.8s ease-in-out infinite; }

  .mood-path {
    stroke-dasharray: 320;
    stroke-dashoffset: 320;
    animation: drawPath 2.2s cubic-bezier(0.16, 1, 0.3, 1) 1.0s both;
  }

  .energy-bar-fill { animation: barFill 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both; }

  .fs-nav-scrolled {
    background: rgba(60, 21, 24, 0.88) !important;
    backdrop-filter: blur(20px) !important;
    border-bottom-color: rgba(107, 36, 32, 0.45) !important;
  }

  .btn-primary-hero {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 14px 28px; border-radius: 16px;
    background: linear-gradient(135deg, #A44200 0%, #C05020 50%, #D58936 100%);
    background-size: 200% 200%;
    color: #F2F3AE; font-family: 'Nunito', sans-serif;
    font-weight: 700; font-size: 15px;
    border: none; cursor: pointer; text-decoration: none;
    box-shadow: 0 0 28px #A4420045, 0 4px 16px #00000055, inset 0 1px 0 #F2F3AE18;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative; overflow: hidden;
    letter-spacing: 0.01em;
  }
  .btn-primary-hero:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 44px #A4420065, 0 8px 24px #00000065, inset 0 1px 0 #F2F3AE22;
  }
  .btn-primary-hero:active { transform: translateY(0) scale(0.99); }

  .btn-glass-hero {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 26px; border-radius: 16px;
    background: rgba(213, 137, 54, 0.07);
    color: #D58936; font-family: 'Nunito', sans-serif;
    font-weight: 600; font-size: 15px;
    border: 1.5px solid rgba(213, 137, 54, 0.40);
    backdrop-filter: blur(12px);
    cursor: pointer; text-decoration: none;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.01em;
  }
  .btn-glass-hero:hover {
    border-color: rgba(213, 137, 54, 0.75);
    color: #F2F3AE;
    background: rgba(213, 137, 54, 0.14);
    transform: translateY(-1px);
    box-shadow: 0 0 22px #D5893628, inset 0 1px 0 rgba(242,243,174,0.08);
  }

  .ui-card {
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(74, 26, 28, 0.92) 0%, rgba(60, 21, 24, 0.94) 100%);
    border: 1px solid rgba(125, 45, 32, 0.55);
    backdrop-filter: blur(24px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(242,243,174,0.04), inset 0 1px 0 rgba(242,243,174,0.06);
    font-family: 'Nunito', sans-serif;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .ui-card:hover {
    box-shadow: 0 12px 40px rgba(0,0,0,0.65), 0 0 24px rgba(164,66,0,0.14);
    transform: translateY(-2px) !important;
  }

  .nav-link {
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #8A8A45; text-decoration: none;
    transition: color 0.2s ease;
    letter-spacing: 0.01em;
  }
  .nav-link:hover { color: #C8C97A; }

  .grain-overlay::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1; border-radius: inherit;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px; opacity: 0.032;
  }

  .avatar-ring {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: #F2F3AE;
    font-family: 'Nunito', sans-serif;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div style={{ background: P.bg, minHeight: '100vh', fontFamily: "'Nunito', system-ui, sans-serif" }}>

        {/* ══════════════════════════════════════════ NAV */}
        <nav
          className={scrolled ? 'fs-nav-scrolled' : ''}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0 48px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'transparent',
            backdropFilter: 'none',
            borderBottom: '1px solid transparent',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px #A4420042, inset 0 1px 0 #F2F3AE18',
            }}>
              <Flame size={15} color="#F2F3AE" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 21, fontWeight: 700, color: P.cream, letterSpacing: '-0.01em',
            }}>
              Flow
              <span style={{
                background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Space</span>
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['Features', 'How It Works', 'Inner Council', 'Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="nav-link">{l}</a>
            ))}
          </div>

          {/* Nav CTA */}
          <Link href="/auth" className="btn-primary-hero" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 12 }}>
            Get Started
          </Link>
        </nav>


        {/* ══════════════════════════════════════════ HERO */}
        <section
          className="grain-overlay"
          style={{
            position: 'relative', minHeight: '100vh', overflow: 'hidden',
            display: 'flex', alignItems: 'center', paddingTop: 64,
          }}
        >
          {/* Background gradient */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: `
              radial-gradient(ellipse 90% 70% at 60% 40%, #69140E28 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 20% 80%, #A4420012 0%, transparent 55%),
              radial-gradient(ellipse 50% 40% at 85% 15%, #D5893610 0%, transparent 50%),
              linear-gradient(165deg, #3C1518 0%, #4A1A1C 35%, #521A10 65%, #3C1518 100%)
            `,
          }} />

          {/* Ambient blobs */}
          <div className="blob1" style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(ellipse, #A4420014 0%, transparent 68%)', top: '-15%', right: '5%' }} />
          <div className="blob2" style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(ellipse, #D5893610 0%, transparent 68%)', bottom: '-10%', left: '-5%' }} />
          <div className="blob3" style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, #F2F3AE07 0%, transparent 65%)', top: '30%', left: '38%' }} />

          {/* Ember glow behind mockup */}
          <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, #A4420018 0%, transparent 65%)', top: '50%', right: '5%', transform: 'translateY(-50%)' }} />

          {/* Main grid */}
          <div style={{
            position: 'relative', zIndex: 2,
            maxWidth: 1200, width: '100%',
            margin: '0 auto',
            padding: '60px 48px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
          }}>

            {/* ── LEFT: Copy ── */}
            <div>

              {/* Pill badge */}
              <div className="hero-item hero-item-1" style={{ marginBottom: 36 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '7px 16px', borderRadius: 24,
                  background: 'rgba(164, 66, 0, 0.14)',
                  border: '1px solid rgba(164, 66, 0, 0.32)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                    <span className="glow-pulse" style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: '#D58936' }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#D58936', opacity: 0.35, animation: 'glowPulse 2.8s ease-in-out infinite', transform: 'scale(2.2)' }} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D58936', fontFamily: "'Nunito', sans-serif" }}>
                    The Mental Operating System
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="hero-item hero-item-2" style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(54px, 5.6vw, 82px)',
                fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.015em',
                marginBottom: 28,
              }}>
                <span style={{ display: 'block', color: P.cream }}>
                  Think{' '}
                  <span style={{
                    fontStyle: 'italic',
                    background: 'linear-gradient(90deg, #D58936 0%, #F2F3AE 35%, #E8B84B 65%, #D58936 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    animation: 'pillShimmer 4.5s linear infinite',
                  }}>clearly.</span>
                </span>
                <span style={{ display: 'block', color: P.cream, marginTop: 2 }}>Work with</span>
                <span style={{
                  display: 'block', fontStyle: 'italic', marginTop: 2,
                  background: 'linear-gradient(135deg, #A44200, #D58936)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>intention.</span>
                <span style={{ display: 'block', fontStyle: 'italic', color: `${P.cream}80`, fontSize: '0.92em', marginTop: 4 }}>
                  Feel less overwhelmed.
                </span>
              </h1>

              {/* Subcopy — improved colour from review */}
              <p className="hero-item hero-item-3" style={{ fontSize: 16, lineHeight: 1.78, color: P.creamDim, maxWidth: 430, marginBottom: 40, fontWeight: 400 }}>
                FlowSpace is your private mental operating system.{' '}
                Energy-aware tasks. Structured reflection.{' '}
                <span style={{ color: P.amber, fontWeight: 500 }}>Intelligent clarity.</span>
              </p>

              {/* CTAs */}
              <div className="hero-item hero-item-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
                <Link href="/auth" className="btn-primary-hero">
                  <ArrowRight size={16} />
                  Begin Your Flow
                </Link>
                <Link href="#features" className="btn-glass-hero">
                  <Zap size={15} />
                  Watch Demo
                </Link>
              </div>

              {/* Social proof — amber avatar rings (from review improvement) */}
              <div className="hero-item hero-item-5" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex' }}>
                  {[
                    { bg: '#7A3A28', initials: 'AO' },
                    { bg: '#4A2E58', initials: 'EK' },
                    { bg: '#26483A', initials: 'PR' },
                    { bg: '#5A3A18', initials: 'MT' },
                    { bg: '#2A3858', initials: 'YL' },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="avatar-ring"
                      style={{
                        background: a.bg,
                        marginLeft: i === 0 ? 0 : -10,
                        boxShadow: `0 0 0 2px ${P.bg}, 0 0 0 3.5px rgba(213,137,54,0.30)`,
                      }}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: P.cream, lineHeight: 1.2 }}>2,400+</div>
                  <div style={{ fontSize: 12, color: P.creamMute, marginTop: 1 }}>minds operating in flow</div>
                </div>
              </div>

            </div>


            {/* ── RIGHT: UI Mockup ── */}
            <div className="hero-mock" style={{ position: 'relative', display: 'flex', justifyContent: 'center', minHeight: 480 }}>

              {/* Glow halo behind cards */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse, #A4420020 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

              {/* Main dashboard card */}
              <div className="card-float-a ui-card" style={{ width: 330, padding: '22px 24px', zIndex: 3, marginTop: 40 }}>

                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #A44200, #D58936)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #A4420040', flexShrink: 0 }}>
                      <Flame size={11} color="#F2F3AE" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, color: P.cream, letterSpacing: '0.04em' }}>FLOWSPACE</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div className="glow-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#D58936' }} />
                    <span style={{ fontSize: 10, color: '#D58936', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
                  </div>
                </div>

                {/* Energy */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: P.creamMute, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 600 }}>Today's Energy</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: 'italic', color: P.amber, fontWeight: 600 }}>Flow State ⚡</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#6B2420', overflow: 'hidden', marginBottom: 5 }}>
                    <div className="energy-bar-fill" style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #A44200, #D58936, #F2F3AE)', boxShadow: '0 0 10px #D5893650', width: 0 }} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: P.amber, fontWeight: 700 }}>78%</span>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(107,36,32,0.5)', marginBottom: 14 }} />

                {/* Intentions */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: P.creamMute, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 600, marginBottom: 10 }}>Today's Intentions</div>
                  {[
                    { label: 'Deep work session',    done: true  },
                    { label: 'Review proposal draft', done: false },
                    { label: 'Team energy check-in', done: false },
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 2 ? '1px solid rgba(107,36,32,0.3)' : 'none' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, background: t.done ? 'linear-gradient(135deg, #A44200, #D58936)' : 'transparent', border: t.done ? 'none' : '1.5px solid #7D2D20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.done ? '0 0 8px #A4420055' : 'none' }}>
                        {t.done && <span style={{ color: P.cream, fontSize: 9, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: t.done ? P.creamMute : P.cream, textDecoration: t.done ? 'line-through' : 'none', fontWeight: t.done ? 400 : 500, lineHeight: 1.3 }}>{t.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: 'rgba(107,36,32,0.5)', marginBottom: 14 }} />

                {/* Inner Council */}
                <div>
                  <div style={{ fontSize: 10, color: P.creamMute, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 600, marginBottom: 10 }}>Inner Council</div>
                  <div style={{ background: 'rgba(60,21,24,0.6)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(107,36,32,0.6)' }}>
                    <p style={{ fontSize: 12, color: P.creamDim, fontStyle: 'italic', lineHeight: 1.55, marginBottom: 8 }}>"Your momentum is building — now is the time to act."</p>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span className="typing-dot"   style={{ color: P.amber }} />
                      <span className="typing-dot typing-dot-2" style={{ color: P.amber }} />
                      <span className="typing-dot typing-dot-3" style={{ color: P.amber }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Float: Flow State */}
              <div className="card-float-b ui-card" style={{ position: 'absolute', top: 0, right: -8, padding: '12px 15px', width: 158, zIndex: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #A44200, #D58936)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px #A4420040', flexShrink: 0 }}>
                    <Zap size={13} color="#F2F3AE" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: P.cream, lineHeight: 1.2 }}>Flow State</div>
                    <div style={{ fontSize: 10, color: P.creamMute, marginTop: 1 }}>78% energy</div>
                  </div>
                </div>
              </div>

              {/* Float: High-Energy Tasks */}
              <div className="card-float-c ui-card" style={{ position: 'absolute', top: 110, right: -24, padding: '13px 16px', width: 166, zIndex: 5 }}>
                <div style={{ fontSize: 10, color: P.creamMute, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7, fontWeight: 600 }}>High-Energy Tasks</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 16, color: P.amber, lineHeight: 1 }}>↑</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>3 tasks surfaced</span>
                </div>
              </div>

              {/* Float: Mood 7 Days */}
              <div className="card-float-d ui-card" style={{ position: 'absolute', bottom: 28, right: -16, padding: '13px 15px', width: 150, zIndex: 5 }}>
                <div style={{ fontSize: 10, color: P.creamMute, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 9, fontWeight: 600 }}>Mood · 7 Days</div>
                <svg width="118" height="32" viewBox="0 0 118 32" fill="none" style={{ display: 'block', marginBottom: 8 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#A44200" />
                      <stop offset="100%" stopColor="#D58936" />
                    </linearGradient>
                    <linearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D58936" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#D58936" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d="M4,22 C14,22 16,18 24,16 C32,14 38,22 46,18 C54,14 60,10 68,8 C76,6 82,14 90,10 C98,6 106,8 114,6" fill="none" stroke="url(#moodGrad)" strokeWidth="2" strokeLinecap="round" className="mood-path" />
                  <path d="M4,22 C14,22 16,18 24,16 C32,14 38,22 46,18 C54,14 60,10 68,8 C76,6 82,14 90,10 C98,6 106,8 114,6 L114,32 L4,32 Z" fill="url(#moodArea)" />
                  <circle cx="114" cy="6" r="3.5" fill="#D58936" style={{ filter: 'drop-shadow(0 0 4px #D5893680)' }} />
                </svg>
                <div style={{ fontSize: 11, color: '#D58936', fontWeight: 700 }}>↑ 7-day streak</div>
              </div>

              {/* Float: Inner Council snippet */}
              <div className="card-float-b ui-card" style={{ position: 'absolute', bottom: 80, left: -32, padding: '12px 14px', width: 176, zIndex: 5, animationDelay: '1.8s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: 'rgba(213,137,54,0.18)', border: '1px solid rgba(213,137,54,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: P.amber }}>IC</div>
                  <span style={{ fontSize: 10, color: P.creamMute, fontWeight: 600 }}>Inner Council</span>
                </div>
                <p style={{ fontSize: 11, fontStyle: 'italic', color: P.creamDim, lineHeight: 1.5 }}>"Your clarity is sharp today."</p>
              </div>

            </div>
          </div>

          {/* Scroll cue */}
          <div className="hero-item hero-item-6" style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, zIndex: 3 }}>
            <span style={{ fontSize: 10, color: P.creamMute, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Explore</span>
            <div style={{ width: 22, height: 34, borderRadius: 11, border: `1.5px solid ${P.creamMute}50`, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
              <div className="scroll-cue" style={{ width: 3, height: 7, borderRadius: 2, background: `linear-gradient(180deg, ${P.amber}, transparent)` }} />
            </div>
          </div>

        </section>

      </div>
    </>
  )
}
