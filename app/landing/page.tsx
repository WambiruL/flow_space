'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Flame, Zap, CheckCircle2 } from 'lucide-react'

// ─── useInView: fires once when element enters viewport ───────────────────────
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

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

  /* ── How It Works: scroll-reveal ── */
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes revealLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes revealRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Bar fill animations for landscape step */
  @keyframes barFill68  { from { width: 0% } to { width: 68% } }
  @keyframes barFill45  { from { width: 0% } to { width: 45% } }
  @keyframes barFill30  { from { width: 0% } to { width: 30% } }

  /* Energy circle pulse for step 01 */
  @keyframes energyPop {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Step line draw */
  @keyframes lineDraw {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }

  /* NOW badge pulse */
  @keyframes nowPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.6; }
  }

  .hiw-reveal {
    opacity: 0;
  }
  .hiw-reveal.visible {
    animation: revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .hiw-reveal-left.visible {
    animation: revealLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .hiw-reveal-right.visible {
    animation: revealRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .step-line {
    transform-origin: top center;
    transform: scaleY(0);
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .step-line.visible { transform: scaleY(1); }

  .bar-68.visible { animation: barFill68 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .bar-45.visible { animation: barFill45 1.2s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
  .bar-30.visible { animation: barFill30 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both; }

  .energy-circle.visible { animation: energyPop 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .energy-circle-1.visible { animation-delay: 0.1s; }
  .energy-circle-2.visible { animation-delay: 0.2s; }
  .energy-circle-3.visible { animation-delay: 0.3s; }
  .energy-circle-4.visible { animation-delay: 0.4s; }
  .energy-circle-5.visible { animation-delay: 0.5s; }

  .now-badge { animation: nowPulse 2.2s ease-in-out infinite; }

  /* Step card hover */
  .step-demo-card {
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(82,26,16,0.60) 0%, rgba(60,21,24,0.80) 100%);
    border: 1px solid rgba(125, 45, 32, 0.45);
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(242,243,174,0.05);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .step-demo-card:hover {
    border-color: rgba(164,66,0,0.45);
    box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 0 28px rgba(164,66,0,0.10);
  }

  /* Step number */
  .step-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px; font-weight: 700; line-height: 1;
    background: linear-gradient(135deg, #A44200 0%, #D58936 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    opacity: 0.45;
    letter-spacing: -0.02em;
  }

  /* Alternating row backgrounds */
  .hiw-row-alt {
    background: linear-gradient(180deg, rgba(82,26,16,0.18) 0%, rgba(60,21,24,0) 100%);
  }

  /* ── Energy Engine section ── */

  /* Arc dial spin-in on mount */
  @keyframes arcReveal {
    from { stroke-dashoffset: 565; opacity: 0; }
    to   { opacity: 1; }
  }

  /* Percentage counter fade-up */
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Orbiting dots around the dial */
  @keyframes orbitA {
    0%   { transform: rotate(0deg)   translateX(88px) rotate(0deg);   }
    100% { transform: rotate(360deg) translateX(88px) rotate(-360deg); }
  }
  @keyframes orbitB {
    0%   { transform: rotate(180deg) translateX(88px) rotate(-180deg); }
    100% { transform: rotate(540deg) translateX(88px) rotate(-540deg); }
  }

  /* Task card slide-in from right */
  @keyframes taskSlideIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* Task card slide-out to left */
  @keyframes taskSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-14px); }
  }

  /* Engine recalibrating pulse */
  @keyframes engineSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Panel fade transition */
  @keyframes panelFade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .engine-task-enter {
    animation: taskSlideIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .engine-task-enter-1 { animation-delay: 0.05s; }
  .engine-task-enter-2 { animation-delay: 0.12s; }
  .engine-task-enter-3 { animation-delay: 0.19s; }

  .engine-panel-enter {
    animation: panelFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .engine-spin {
    animation: engineSpin 2.4s linear infinite;
    transform-origin: center;
  }

  .orbit-a { animation: orbitA 6s linear infinite; }
  .orbit-b { animation: orbitB 9s linear infinite; }

  /* Energy level pill tab */
  .energy-tab {
    padding: 6px 16px; border-radius: 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 600;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
    color: #6B2420;
    letter-spacing: 0.01em;
  }
  .energy-tab:hover {
    color: #C8C97A;
    border-color: rgba(107,36,32,0.6);
  }
  .energy-tab.active {
    background: rgba(164,66,0,0.15);
    border-color: rgba(164,66,0,0.45);
    color: #D58936;
    box-shadow: inset 0 0 10px rgba(164,66,0,0.18), 0 0 12px rgba(164,66,0,0.12);
  }

  /* Surfaced badge */
  .surfaced-badge {
    font-size: 9px; font-weight: 800;
    letter-spacing: 0.1em; font-family: 'Nunito', sans-serif;
    padding: 3px 9px; border-radius: 6px;
    background: rgba(164,66,0,0.20);
    border: 1px solid rgba(164,66,0,0.38);
    color: #D58936;
    white-space: nowrap; flex-shrink: 0;
  }

  /* Engine task row */
  .engine-task-row {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px; border-radius: 12px;
    background: linear-gradient(145deg, rgba(74,26,28,0.70) 0%, rgba(60,21,24,0.80) 100%);
    border: 1px solid rgba(125,45,32,0.40);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .engine-task-row:hover {
    border-color: rgba(164,66,0,0.38);
    box-shadow: 0 0 18px rgba(164,66,0,0.08);
  }

  /* ── Inner Council section ── */

  /* Chat bubble slides in from below */
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  /* Active voice avatar pulse ring */
  @keyframes voiceRing {
    0%   { transform: scale(1);    opacity: 0.7; }
    50%  { transform: scale(1.35); opacity: 0;   }
    100% { transform: scale(1.35); opacity: 0;   }
  }

  /* Typing dot bounce */
  @keyframes councilDot {
    0%, 60%, 100% { transform: translateY(0);    opacity: 0.3; }
    30%            { transform: translateY(-4px); opacity: 1;   }
  }

  /* Voice avatar idle float */
  @keyframes avatarFloat {
    0%, 100% { transform: translateY(0px);  }
    50%       { transform: translateY(-3px); }
  }

  /* Radial glow breathe behind chat window */
  @keyframes stageBreathe {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 0.85; }
  }

  /* Input cursor blink */
  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  /* Message entrance — used per bubble with stagger */
  .council-bubble {
    animation: bubbleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .council-bubble-1 { animation-delay: 0.0s;  }
  .council-bubble-2 { animation-delay: 0.55s; }
  .council-bubble-3 { animation-delay: 1.1s;  }
  .council-bubble-4 { animation-delay: 1.65s; }

  /* Voice avatar — active speaking state */
  .voice-avatar-active::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    animation: voiceRing 1.4s ease-out infinite;
  }

  /* Council typing dots */
  .council-dot   { animation: councilDot 1.3s ease-in-out infinite; display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .council-dot-2 { animation-delay: 0.18s; }
  .council-dot-3 { animation-delay: 0.36s; }

  /* Voice avatar float */
  .voice-float-1 { animation: avatarFloat 5.0s ease-in-out infinite 0.0s; }
  .voice-float-2 { animation: avatarFloat 5.8s ease-in-out infinite 0.6s; }
  .voice-float-3 { animation: avatarFloat 4.6s ease-in-out infinite 1.1s; }
  .voice-float-4 { animation: avatarFloat 6.2s ease-in-out infinite 0.3s; }
  .voice-float-5 { animation: avatarFloat 5.4s ease-in-out infinite 1.8s; }

  /* Stage glow */
  .stage-glow { animation: stageBreathe 4s ease-in-out infinite; }

  /* Input cursor */
  .input-cursor { animation: cursorBlink 1.1s step-end infinite; }

  /* Chat container */
  .council-window {
    border-radius: 20px;
    background: linear-gradient(160deg, rgba(52,16,18,0.96) 0%, rgba(42,12,14,0.98) 100%);
    border: 1px solid rgba(125,45,32,0.50);
    box-shadow:
      0 24px 64px rgba(0,0,0,0.65),
      0 0 0 0.5px rgba(242,243,174,0.04),
      inset 0 1px 0 rgba(242,243,174,0.06);
    overflow: hidden;
  }

  /* Voice avatar button */
  .voice-btn {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    background: none; border: none; cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    position: relative;
  }
  .voice-btn:hover { transform: translateY(-3px); }

  /* Message row */
  .council-msg-row {
    display: flex; gap: 14px; align-items: flex-start;
  }

  /* You message bubble */
  .you-bubble {
    flex: 1; padding: 13px 16px; border-radius: 12px;
    background: rgba(82,26,16,0.50);
    border: 1px solid rgba(125,45,32,0.40);
    font-family: 'Nunito', sans-serif;
    font-size: 14px; color: #C8C97A; line-height: 1.55;
  }

  /* Voice message bubble */
  .voice-bubble {
    flex: 1; padding: 13px 16px; border-radius: 12px;
    background: rgba(42,12,14,0.70);
    border: 1px solid rgba(107,36,32,0.35);
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 15px;
    color: #C8C97A; line-height: 1.6;
    font-weight: 500;
  }

  /* ── Mood & Patterns section ── */

  /* Chart line draws itself left-to-right on scroll */
  @keyframes chartDraw {
    from { stroke-dashoffset: 1200; }
    to   { stroke-dashoffset: 0;    }
  }

  /* Chart area fades up after line draws */
  @keyframes areaFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Stat card entrance — staggers in */
  @keyframes statCardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Peak dot pulse on chart */
  @keyframes peakPulse {
    0%, 100% { r: 4;   opacity: 1;   }
    50%       { r: 6.5; opacity: 0.7; }
  }

  /* Feature row entrance from right */
  @keyframes featureSlideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* Icon badge soft glow */
  @keyframes iconGlow {
    0%, 100% { box-shadow: 0 0  8px rgba(164,66,0,0.20); }
    50%       { box-shadow: 0 0 16px rgba(164,66,0,0.40); }
  }

  .chart-line {
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
  }
  .chart-line.visible {
    animation: chartDraw 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
  }

  .chart-area {
    opacity: 0;
  }
  .chart-area.visible {
    animation: areaFadeIn 0.9s ease 1.6s both;
  }

  .stat-card-anim { opacity: 0; }
  .stat-card-anim.visible { animation: statCardIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .stat-1.visible { animation-delay: 0.9s;  }
  .stat-2.visible { animation-delay: 1.0s;  }
  .stat-3.visible { animation-delay: 1.1s;  }
  .stat-4.visible { animation-delay: 1.2s;  }

  .feature-row-anim { opacity: 0; }
  .feature-row-anim.visible { animation: featureSlideIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .feat-1.visible { animation-delay: 0.3s; }
  .feat-2.visible { animation-delay: 0.5s; }
  .feat-3.visible { animation-delay: 0.7s; }

  .icon-badge-glow { animation: iconGlow 3s ease-in-out infinite; }

  /* Premium icon badge */
  .premium-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(145deg, rgba(74,26,28,0.90), rgba(52,16,18,0.95));
    border: 1px solid rgba(164,66,0,0.30);
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,243,174,0.06);
    transition: all 0.3s ease;
  }
  .premium-icon:hover {
    border-color: rgba(164,66,0,0.55);
    box-shadow: 0 0 16px rgba(164,66,0,0.25), inset 0 1px 0 rgba(242,243,174,0.08);
    transform: translateY(-1px);
  }

  /* Stat mini-card */
  .stat-mini-card {
    border-radius: 14px;
    background: linear-gradient(145deg, rgba(52,16,18,0.90), rgba(42,12,14,0.95));
    border: 1px solid rgba(107,36,32,0.45);
    padding: 16px 18px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .stat-mini-card:hover {
    border-color: rgba(164,66,0,0.40);
    box-shadow: 0 0 20px rgba(164,66,0,0.08);
  }

  /* ── Brain Dump section ── */

  /* Words drift very slowly — different speeds/directions per word */
  @keyframes wordDrift1 {
    0%         { transform: translate(0px,   0px)   opacity: 0.07; }
    33%        { transform: translate(6px,  -18px);  }
    66%        { transform: translate(-4px, -32px);  }
    100%       { transform: translate(2px,  -48px);  opacity: 0.04; }
  }
  @keyframes wordDrift2 {
    0%         { transform: translate(0px, 0px)    opacity: 0.09; }
    40%        { transform: translate(-8px, -22px); }
    100%       { transform: translate(4px,  -44px); opacity: 0.05; }
  }
  @keyframes wordDrift3 {
    0%         { transform: translate(0px, 0px)   opacity: 0.06; }
    50%        { transform: translate(10px, -16px); }
    100%       { transform: translate(-2px, -36px); opacity: 0.03; }
  }
  @keyframes wordDrift4 {
    0%         { transform: translate(0px, 0px)    opacity: 0.08; }
    60%        { transform: translate(-6px, -28px); }
    100%       { transform: translate(3px,  -50px); opacity: 0.04; }
  }
  @keyframes wordDrift5 {
    0%         { transform: translate(0px, 0px)   opacity: 0.05; }
    45%        { transform: translate(8px, -20px); }
    100%       { transform: translate(-3px,-40px); opacity: 0.03; }
  }

  /* Capture card entrance */
  @keyframes captureCardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Recent capture rows slide in */
  @keyframes captureRowIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0);     }
  }

  /* Cursor blink in textarea */
  @keyframes textCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  /* Chip hover shimmer sweep */
  @keyframes chipSweep {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }

  /* Word cloud items — atmospheric, barely visible */
  .brain-word {
    position: absolute;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: #F2F3AE;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }

  /* Capture card */
  .capture-card {
    border-radius: 18px;
    background: linear-gradient(160deg, rgba(52,16,18,0.95) 0%, rgba(40,10,12,0.98) 100%);
    border: 1px solid rgba(125,45,32,0.45);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.55),
      0 0 0 0.5px rgba(242,243,174,0.03),
      inset 0 1px 0 rgba(242,243,174,0.05);
    overflow: hidden;
  }

  /* Category chip */
  .category-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700;
    border: 1px solid rgba(107,36,32,0.50);
    background: rgba(60,21,24,0.60);
    color: #8A8A45;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: 0.02em;
    position: relative; overflow: hidden;
  }
  .category-chip:hover {
    border-color: rgba(164,66,0,0.55);
    background: rgba(82,26,16,0.70);
    color: #C8C97A;
    box-shadow: 0 0 14px rgba(164,66,0,0.12);
  }
  .category-chip.active {
    border-color: rgba(213,137,54,0.55);
    background: rgba(164,66,0,0.18);
    color: #D58936;
    box-shadow: 0 0 18px rgba(164,66,0,0.18), inset 0 1px 0 rgba(242,243,174,0.06);
  }

  /* Recent capture row */
  .capture-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px; border-radius: 12px;
    background: linear-gradient(145deg, rgba(52,16,18,0.80), rgba(40,10,12,0.90));
    border: 1px solid rgba(107,36,32,0.35);
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .capture-row:hover {
    border-color: rgba(164,66,0,0.38);
    box-shadow: 0 0 18px rgba(164,66,0,0.07);
  }

  .capture-anim { opacity: 0; }
  .capture-anim.visible { animation: captureRowIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .cap-1.visible { animation-delay: 0.20s; }
  .cap-2.visible { animation-delay: 0.35s; }
  .cap-3.visible { animation-delay: 0.50s; }

  .capture-card-anim { opacity: 0; }
  .capture-card-anim.visible {
    animation: captureCardIn 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  /* ── Testimonials section ── */

  /* Independent float loops — clearly visible, each card different */
  @keyframes tFloat1 {
    0%, 100% { transform: translateY(0px)   rotate(-1.5deg); }
    50%       { transform: translateY(-10px) rotate(-1.5deg); }
  }
  @keyframes tFloat2 {
    0%, 100% { transform: translateY(0px)  rotate(1.2deg); }
    50%       { transform: translateY(-8px) rotate(1.2deg); }
  }
  @keyframes tFloat3 {
    0%, 100% { transform: translateY(0px)   rotate(-0.8deg); }
    50%       { transform: translateY(-12px) rotate(-0.8deg); }
  }
  @keyframes tFloat4 {
    0%, 100% { transform: translateY(0px)  rotate(2deg); }
    50%       { transform: translateY(-7px) rotate(2deg); }
  }
  @keyframes tFloat5 {
    0%, 100% { transform: translateY(0px)   rotate(-1deg); }
    50%       { transform: translateY(-14px) rotate(-1deg); }
  }
  @keyframes tFloat6 {
    0%, 100% { transform: translateY(0px)  rotate(0.8deg); }
    50%       { transform: translateY(-9px) rotate(0.8deg); }
  }
  @keyframes tFloat7 {
    0%, 100% { transform: translateY(0px)   rotate(-2deg); }
    50%       { transform: translateY(-11px) rotate(-2deg); }
  }

  /* Halo glow pulse on selected card */
  @keyframes haloBreath {
    0%, 100% { box-shadow: 0 0 30px #D5893650, 0 0 60px #A4420030, 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(213,137,54,0.60); }
    50%       { box-shadow: 0 0 50px #D5893670, 0 0 90px #A4420045, 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(213,137,54,0.80); }
  }

  /* Card stagger entrance */
  @keyframes cardConstella {
    from { opacity: 0; transform: translateY(20px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* Stat counter count-up feel */
  @keyframes statReveal {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Testimonial card base */
  .t-card {
    border-radius: 18px;
    background: linear-gradient(145deg, rgba(58,18,20,0.92) 0%, rgba(44,12,14,0.96) 100%);
    border: 1px solid rgba(107,36,32,0.45);
    box-shadow: 0 8px 32px rgba(0,0,0,0.50), inset 0 1px 0 rgba(242,243,174,0.05);
    padding: 22px;
    cursor: pointer;
    transition:
      box-shadow 0.4s cubic-bezier(0.4,0,0.2,1),
      border-color 0.4s cubic-bezier(0.4,0,0.2,1),
      transform 0.4s cubic-bezier(0.16,1,0.3,1);
    position: absolute;
    /* float animation applied via inline style per card */
  }
  .t-card:hover {
    border-color: rgba(164,66,0,0.45);
    box-shadow: 0 12px 40px rgba(0,0,0,0.60), 0 0 20px rgba(164,66,0,0.10), inset 0 1px 0 rgba(242,243,174,0.07);
  }
  /* Active/selected card gets halo */
  .t-card.selected {
    border-color: rgba(213,137,54,0.70);
    animation: haloBreath 2.8s ease-in-out infinite !important;
    z-index: 20 !important;
  }

  /* Card stagger entrance */
  .t-card-enter { opacity: 0; }
  .t-card-enter.visible { animation: cardConstella 0.65s cubic-bezier(0.16,1,0.3,1) both; }

  /* Stat items */
  .stat-item-enter { opacity: 0; }
  .stat-item-enter.visible { animation: statReveal 0.55s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── Pricing section ── */

  /* Toggle pill spring */
  @keyframes pillSpring {
    0%   { transform: translateX(0) scale(0.9); }
    60%  { transform: translateX(var(--pill-x)) scale(1.08); }
    100% { transform: translateX(var(--pill-x)) scale(1); }
  }

  /* Price swap — old price out */
  @keyframes priceOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-10px); }
  }

  /* Price swap — new price in */
  @keyframes priceIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Save badge pop */
  @keyframes badgePop {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Card entrance stagger */
  @keyframes pricingCardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Flow card featured shimmer border */
  @keyframes borderShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Trust bar entrance */
  @keyframes trustIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .price-val-in  { animation: priceIn  0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .price-val-out { animation: priceOut 0.20s ease-in both; }

  .save-badge-pop { animation: badgePop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  .pricing-card-enter { opacity: 0; }
  .pricing-card-enter.visible {
    animation: pricingCardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .pc-1.visible { animation-delay: 0.05s; }
  .pc-2.visible { animation-delay: 0.15s; }
  .pc-3.visible { animation-delay: 0.25s; }

  .trust-enter { opacity: 0; }
  .trust-enter.visible {
    animation: trustIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .tr-1.visible { animation-delay: 0.3s; }
  .tr-2.visible { animation-delay: 0.4s; }
  .tr-3.visible { animation-delay: 0.5s; }
  .tr-4.visible { animation-delay: 0.6s; }

  /* Toggle track */
  .pricing-toggle-track {
    width: 44px; height: 24px; border-radius: 12px;
    background: rgba(107,36,32,0.50);
    border: 1px solid rgba(125,45,32,0.60);
    position: relative; cursor: pointer;
    transition: background 0.3s ease, border-color 0.3s ease;
    flex-shrink: 0;
  }
  .pricing-toggle-track.on {
    background: linear-gradient(135deg, #A44200, #D58936);
    border-color: transparent;
    box-shadow: 0 0 14px #A4420050;
  }

  /* Toggle thumb */
  .pricing-toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #F2F3AE;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .pricing-toggle-thumb.on { transform: translateX(20px); }

  /* Spark card — hairline gradient border from review */
  .spark-card-wrap {
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(145deg, rgba(164,66,0,0.18) 0%, rgba(107,36,32,0.25) 50%, rgba(164,66,0,0.12) 100%);
  }

  /* Flow featured card — animated gradient border */
  .flow-card-wrap {
    border-radius: 22px;
    padding: 1.5px;
    background: linear-gradient(135deg, #A44200, #D58936, #F2F3AE, #D58936, #A44200);
    background-size: 300% 300%;
    animation: borderShimmer 4s ease infinite;
    box-shadow: 0 0 40px #A4420035, 0 0 80px #D5893618;
  }

  /* Radiant ghost button — more visible from review */
  .radiant-btn {
    width: 100%; padding: 14px; border-radius: 14px;
    background: transparent;
    border: 1.5px solid rgba(164,66,0,0.45);
    color: #D58936; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .radiant-btn:hover {
    border-color: rgba(213,137,54,0.70);
    background: rgba(164,66,0,0.10);
    box-shadow: 0 0 20px rgba(164,66,0,0.15);
    color: #F2F3AE;
  }

  /* Most popular badge — refined pill from review */
  .most-popular-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 16px; border-radius: 20px;
    background: rgba(164,66,0,0.18);
    border: 1px solid rgba(213,137,54,0.50);
    font-family: 'Nunito', sans-serif;
    font-size: 11px; font-weight: 800;
    color: #D58936; letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: 0 0 16px rgba(164,66,0,0.20);
  }

  /* ── Closing CTA section ── */

  /* Particle float upward — embers drifting */
  @keyframes emberRise1 {
    0%   { transform: translate(0px,   0px)   scale(1);    opacity: 0;    }
    10%  { opacity: var(--ember-opacity); }
    85%  { opacity: var(--ember-opacity); }
    100% { transform: translate(var(--ember-dx), -130px) scale(0.6); opacity: 0; }
  }
  @keyframes emberRise2 {
    0%   { transform: translate(0px, 0px) scale(1);    opacity: 0;    }
    12%  { opacity: var(--ember-opacity); }
    80%  { opacity: var(--ember-opacity); }
    100% { transform: translate(var(--ember-dx), -110px) scale(0.5); opacity: 0; }
  }
  @keyframes emberRise3 {
    0%   { transform: translate(0px, 0px) scale(1);    opacity: 0;    }
    8%   { opacity: var(--ember-opacity); }
    90%  { opacity: var(--ember-opacity); }
    100% { transform: translate(var(--ember-dx), -150px) scale(0.7); opacity: 0; }
  }

  /* Headline entrance — two lines stagger */
  @keyframes ctaLine1 {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes ctaLine2 {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* CTA button breath glow */
  @keyframes ctaGlow {
    0%, 100% { box-shadow: 0 0 28px #A4420050, 0 0 56px #D5893622, 0 6px 20px rgba(0,0,0,0.5); }
    50%       { box-shadow: 0 0 44px #A4420070, 0 0 80px #D5893635, 0 6px 20px rgba(0,0,0,0.5); }
  }

  /* Feature chips entrance — fan in from centre */
  @keyframes chipFanIn {
    from { opacity: 0; transform: translateY(12px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* Footer fade */
  @keyframes footerFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* CTA button */
  .cta-enter-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 18px 42px; border-radius: 18px;
    background: linear-gradient(135deg, #A44200 0%, #C05020 45%, #D58936 100%);
    border: none; cursor: pointer;
    font-family: 'Nunito', sans-serif;
    font-size: 17px; font-weight: 800;
    color: #F2F3AE; letter-spacing: 0.02em;
    animation: ctaGlow 3s ease-in-out infinite;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease;
    position: relative; overflow: hidden;
  }
  .cta-enter-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(242,243,174,0.12) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  .cta-enter-btn:hover::before { transform: translateX(100%); }
  .cta-enter-btn:hover {
    transform: translateY(-3px) scale(1.02);
    filter: brightness(1.08);
  }
  .cta-enter-btn:active { transform: translateY(0) scale(0.99); }

  /* Feature chip in CTA */
  .cta-chip {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 20px;
    background: rgba(52,16,18,0.70);
    border: 1px solid rgba(107,36,32,0.45);
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 600;
    color: #8A8A45; letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
    transition: border-color 0.25s ease, color 0.25s ease;
  }
  .cta-chip:hover {
    border-color: rgba(164,66,0,0.40);
    color: #C8C97A;
  }

  /* Ember particle */
  .ember {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background: #D58936;
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

        {/* ══════════════════════════════════════════ HOW IT WORKS */}
        <HowItWorksSection />

        {/* ══════════════════════════════════════════ ENERGY ENGINE */}
        <EnergyEngineSection />

        {/* ══════════════════════════════════════════ INNER COUNCIL */}
        <InnerCouncilSection />

        {/* ══════════════════════════════════════════ MOOD & PATTERNS */}
        <MoodPatternsSection />

        {/* ══════════════════════════════════════════ BRAIN DUMP */}
        <BrainDumpSection />

        {/* ══════════════════════════════════════════ TESTIMONIALS */}
        <TestimonialsSection />

        {/* ══════════════════════════════════════════ PRICING */}
        <PricingSection />

        {/* ══════════════════════════════════════════ CLOSING CTA */}
        <ClosingCTASection />

      </div>
    </>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        position: 'relative',
        background: '#3C1518',
        overflow: 'hidden',
        paddingBottom: 120,
      }}
    >
      {/* Subtle top fade from hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, rgba(82,26,16,0.3) 0%, transparent 100%)', pointerEvents: 'none' }} />

      {/* ── Section header ── */}
      <SectionHeader />

      {/* ── Vertical connector spine ── */}
      <StepSpine />

      {/* ── Steps ── */}
      <Step01 />
      <Step02 />
      <Step03 />
      <Step04 />
    </section>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader() {
  const { ref, visible } = useInView(0.3)
  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '100px 48px 80px',
        position: 'relative', zIndex: 2,
      }}
    >
      {/* Pill */}
      <div
        className={`hiw-reveal ${visible ? 'visible' : ''}`}
        style={{ marginBottom: 28 }}
      >
        <span style={{
          display: 'inline-block',
          padding: '6px 18px', borderRadius: 20,
          background: 'rgba(164,66,0,0.14)',
          border: '1px solid rgba(164,66,0,0.30)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#D58936',
          fontFamily: "'Nunito', sans-serif",
        }}>
          How It Works
        </span>
      </div>

      {/* Headline */}
      <h2
        className={`hiw-reveal ${visible ? 'visible' : ''}`}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(42px, 5vw, 68px)',
          fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.015em',
          color: '#F2F3AE',
          marginBottom: 20,
          animationDelay: '0.1s',
        }}
      >
        A rhythm designed{' '}
        <span style={{
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #A44200, #D58936)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          for your mind
        </span>
      </h2>

      {/* Subtext */}
      <p
        className={`hiw-reveal ${visible ? 'visible' : ''}`}
        style={{
          fontSize: 16, color: '#8A8A45', maxWidth: 480,
          margin: '0 auto', lineHeight: 1.7,
          fontFamily: "'Nunito', sans-serif",
          animationDelay: '0.2s',
        }}
      >
        Not another productivity system. A living practice that adapts to how you actually feel.
      </p>
    </div>
  )
}

// ─── Vertical spine (connecting line) ─────────────────────────────────────────
function StepSpine() {
  const { ref, visible } = useInView(0.05)
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '50%', top: 280, bottom: 80,
        width: 1, marginLeft: -0.5,
        zIndex: 1, overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        className={`step-line ${visible ? 'visible' : ''}`}
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(164,66,0,0.20) 8%, rgba(213,137,54,0.25) 50%, rgba(164,66,0,0.15) 92%, transparent 100%)',
        }}
      />
    </div>
  )
}

// ─── Step 01: Check in with yourself ─────────────────────────────────────────
function Step01() {
  const { ref, visible } = useInView(0.2)
  const LEVELS = [
    { label: 'Very Low', active: false },
    { label: 'Low',      active: false },
    { label: 'Medium',   active: false },
    { label: 'Good',     active: true  },
    { label: 'Peak',     active: false },
  ]
  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80, alignItems: 'center',
        position: 'relative', zIndex: 2,
      }}
    >
      {/* Left — copy */}
      <div className={`hiw-reveal hiw-reveal-left ${visible ? 'visible' : ''}`}>
        <div className="step-number" style={{ marginBottom: 16 }}>01</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700,
          color: '#F2F3AE', lineHeight: 1.1, marginBottom: 18,
          letterSpacing: '-0.01em',
        }}>
          Check in with yourself
        </h3>
        <p style={{
          fontSize: 15, color: '#8A8A45', lineHeight: 1.78,
          fontFamily: "'Nunito', sans-serif", maxWidth: 380,
        }}>
          Every day begins with a gentle energy check-in. No pressure, just awareness. Your system adapts to where you actually are — not where you think you should be.
        </p>
      </div>

      {/* Right — energy selector demo */}
      <div className={`hiw-reveal hiw-reveal-right ${visible ? 'visible' : ''}`} style={{ animationDelay: '0.12s' }}>
        <div className="step-demo-card" style={{ padding: '32px 28px' }}>
          <div style={{
            fontSize: 10, color: '#8A8A45',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontWeight: 600, marginBottom: 28,
            fontFamily: "'Nunito', sans-serif",
          }}>
            How's your energy today?
          </div>
          {/* Circles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {LEVELS.map((lvl, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div
                  className={`energy-circle energy-circle-${i + 1} ${visible ? 'visible' : ''}`}
                  style={{
                    width: lvl.active ? 48 : 38,
                    height: lvl.active ? 48 : 38,
                    borderRadius: '50%',
                    background: lvl.active
                      ? 'linear-gradient(135deg, #A44200, #D58936)'
                      : i < 3
                        ? `rgba(164,66,0,${0.15 + i * 0.08})`
                        : 'rgba(60,21,24,0.6)',
                    border: lvl.active
                      ? 'none'
                      : `1.5px solid rgba(125,45,32,${i < 3 ? 0.5 : 0.3})`,
                    boxShadow: lvl.active
                      ? '0 0 20px #A4420060, 0 0 40px #D5893630'
                      : 'none',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontSize: 10, color: lvl.active ? '#D58936' : '#6B2420',
                  fontWeight: lvl.active ? 700 : 500,
                  fontFamily: "'Nunito', sans-serif",
                  letterSpacing: '0.03em',
                }}>
                  {lvl.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 02: See your landscape ─────────────────────────────────────────────
function Step02() {
  const { ref, visible } = useInView(0.2)
  const projects = [
    { name: 'Q4 Strategy Doc',  pct: 68 },
    { name: 'Team Sync Prep',   pct: 45 },
    { name: 'Design Review',    pct: 30 },
  ]
  return (
    <div
      ref={ref}
      className="hiw-row-alt"
      style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80, alignItems: 'center',
        position: 'relative', zIndex: 2,
        borderRadius: 0,
      }}
    >
      {/* Left — landscape demo */}
      <div className={`hiw-reveal hiw-reveal-left ${visible ? 'visible' : ''}`}>
        <div className="step-demo-card" style={{ padding: '28px 24px' }}>
          <div style={{
            fontSize: 10, color: '#8A8A45',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontWeight: 600, marginBottom: 18,
            fontFamily: "'Nunito', sans-serif",
          }}>
            Active Projects
          </div>
          {projects.map((p, i) => (
            <div key={i} style={{
              paddingBottom: i < 2 ? 14 : 0,
              marginBottom: i < 2 ? 14 : 0,
              borderBottom: i < 2 ? '1px solid rgba(107,36,32,0.3)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 13, color: '#C8C97A', fontWeight: 500, fontFamily: "'Nunito', sans-serif" }}>{p.name}</span>
                <span style={{ fontSize: 12, color: '#8A8A45', fontFamily: "'Nunito', sans-serif" }}>{p.pct}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'rgba(107,36,32,0.5)', overflow: 'hidden' }}>
                <div
                  className={`bar-${p.pct} ${visible ? 'visible' : ''}`}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #A44200, #D58936)',
                    boxShadow: '0 0 8px #D5893640',
                    width: 0,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — copy */}
      <div className={`hiw-reveal hiw-reveal-right ${visible ? 'visible' : ''}`} style={{ animationDelay: '0.12s' }}>
        <div className="step-number" style={{ marginBottom: 16 }}>02</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700,
          color: '#F2F3AE', lineHeight: 1.1, marginBottom: 18,
          letterSpacing: '-0.01em',
        }}>
          See your landscape
        </h3>
        <p style={{
          fontSize: 15, color: '#8A8A45', lineHeight: 1.78,
          fontFamily: "'Nunito', sans-serif", maxWidth: 380,
        }}>
          A clear, calm view of your projects and intentions. Everything in one place, without the noise. Understand what matters, at a glance.
        </p>
      </div>
    </div>
  )
}

// ─── Step 03: Work with intention ────────────────────────────────────────────
function Step03() {
  const { ref, visible } = useInView(0.2)
  const tasks = [
    { icon: '⚡', label: 'Draft product vision',  badge: 'NOW',  dim: false },
    { icon: '▪',  label: 'Reply to emails',        badge: null,   dim: true  },
    { icon: '✎',  label: 'Write design spec',      badge: 'NOW',  dim: false },
  ]
  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80, alignItems: 'center',
        position: 'relative', zIndex: 2,
      }}
    >
      {/* Left — copy */}
      <div className={`hiw-reveal hiw-reveal-left ${visible ? 'visible' : ''}`}>
        <div className="step-number" style={{ marginBottom: 16 }}>03</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700,
          color: '#F2F3AE', lineHeight: 1.1, marginBottom: 18,
          letterSpacing: '-0.01em',
        }}>
          Work with intention
        </h3>
        <p style={{
          fontSize: 15, color: '#8A8A45', lineHeight: 1.78,
          fontFamily: "'Nunito', sans-serif", maxWidth: 380,
        }}>
          Tasks surface based on your current energy level. High-focus work rises when you're at peak. Lighter tasks appear when you need space to breathe.
        </p>
      </div>

      {/* Right — task list demo */}
      <div className={`hiw-reveal hiw-reveal-right ${visible ? 'visible' : ''}`} style={{ animationDelay: '0.12s' }}>
        <div className="step-demo-card" style={{ padding: '24px 20px' }}>
          <div style={{
            fontSize: 10, color: '#8A8A45',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontWeight: 600, marginBottom: 14,
            fontFamily: "'Nunito', sans-serif",
          }}>
            Surfaced for you
          </div>
          {tasks.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10, marginBottom: 8,
                background: t.dim
                  ? 'rgba(60,21,24,0.4)'
                  : 'rgba(82,26,16,0.55)',
                border: `1px solid ${t.dim ? 'rgba(107,36,32,0.2)' : 'rgba(125,45,32,0.45)'}`,
                opacity: t.dim ? 0.55 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0, color: t.dim ? '#6B2420' : '#D58936' }}>{t.icon}</span>
              <span style={{
                flex: 1, fontSize: 13,
                color: t.dim ? '#6B2420' : '#C8C97A',
                fontFamily: "'Nunito', sans-serif", fontWeight: 500,
              }}>
                {t.label}
              </span>
              {t.badge && (
                <span
                  className="now-badge"
                  style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                    color: '#3C1518', background: 'linear-gradient(135deg, #A44200, #D58936)',
                    padding: '3px 8px', borderRadius: 6,
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: '0 0 10px #A4420040',
                  }}
                >
                  {t.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 04: Process what's hard ─────────────────────────────────────────────
function Step04() {
  const { ref, visible } = useInView(0.2)
  const voices = [
    { initial: 'A', name: 'Ambition', color: '#D58936', bg: 'rgba(213,137,54,0.18)', border: 'rgba(213,137,54,0.35)', msg: 'This moment has potential.' },
    { initial: 'L', name: 'Logic',    color: '#90C4E8', bg: 'rgba(144,196,232,0.14)', border: 'rgba(144,196,232,0.30)', msg: 'Analyze before acting.' },
  ]
  return (
    <div
      ref={ref}
      className="hiw-row-alt"
      style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80, alignItems: 'center',
        position: 'relative', zIndex: 2,
      }}
    >
      {/* Left — Inner Council demo */}
      <div className={`hiw-reveal hiw-reveal-left ${visible ? 'visible' : ''}`}>
        <div className="step-demo-card" style={{ padding: '24px 22px' }}>
          <div style={{
            fontSize: 10, color: '#8A8A45',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontWeight: 600, marginBottom: 18,
            fontFamily: "'Nunito', sans-serif",
          }}>
            Inner Council
          </div>
          {voices.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < voices.length - 1 ? 14 : 10 }}>
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: v.bg, border: `1px solid ${v.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: v.color,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {v.initial}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: v.color, marginBottom: 4, fontFamily: "'Nunito', sans-serif", letterSpacing: '0.04em' }}>
                  {v.name}
                </div>
                <div style={{
                  fontSize: 13, fontStyle: 'italic',
                  color: '#C8C97A', lineHeight: 1.45,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                }}>
                  "{v.msg}"
                </div>
              </div>
            </div>
          ))}
          {/* Typing dots */}
          <div style={{ display: 'flex', gap: 5, paddingLeft: 40, marginTop: 6, alignItems: 'center' }}>
            <span className="typing-dot"   style={{ color: '#8A8A45', width: 5, height: 5 }} />
            <span className="typing-dot typing-dot-2" style={{ color: '#8A8A45', width: 5, height: 5 }} />
            <span className="typing-dot typing-dot-3" style={{ color: '#8A8A45', width: 5, height: 5 }} />
          </div>
        </div>
      </div>

      {/* Right — copy */}
      <div className={`hiw-reveal hiw-reveal-right ${visible ? 'visible' : ''}`} style={{ animationDelay: '0.12s' }}>
        <div className="step-number" style={{ marginBottom: 16 }}>04</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 700,
          color: '#F2F3AE', lineHeight: 1.1, marginBottom: 18,
          letterSpacing: '-0.01em',
        }}>
          Process what's hard
        </h3>
        <p style={{
          fontSize: 15, color: '#8A8A45', lineHeight: 1.78,
          fontFamily: "'Nunito', sans-serif", maxWidth: 380,
        }}>
          When you're stuck, the Inner Council thinks with you — not for you. Five distinct perspectives help you navigate complex decisions with clarity.
        </p>

        {/* Feature list */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Ambition, Fear, Logic, Creativity, Relationships',
            'Each voice surfaces a different truth',
            'Synthesized into one clear direction',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CheckCircle2 size={14} color="#D58936" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: '#8A8A45', fontFamily: "'Nunito', sans-serif", lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Energy Engine Section ────────────────────────────────────────────────────

type EnergyLevel = 'empty' | 'low' | 'medium' | 'good' | 'peak'

const ENERGY_DATA: Record<EnergyLevel, {
  pct: number
  label: string
  mode: string
  badge: string
  tagline: string
  tasks: { icon: string; name: string; type: string }[]
}> = {
  empty: {
    pct: 10,
    label: 'Empty',
    mode: 'Rest & recover',
    badge: 'Empty energy',
    tagline: '"Low energy? Rest tasks surface. Honor your limits."',
    tasks: [
      { icon: '✦', name: 'Gentle journaling', type: 'REST' },
      { icon: '▪', name: 'Light reading',     type: 'REST' },
      { icon: '↑', name: 'Short walk',        type: 'REST' },
    ],
  },
  low: {
    pct: 30,
    label: 'Low',
    mode: 'Light & easy',
    badge: 'Low energy',
    tagline: '"Low energy? Administrative tasks bubble to the top."',
    tasks: [
      { icon: '▪', name: 'Reply to emails', type: 'ADMIN' },
      { icon: '▪', name: 'Organize files',  type: 'ADMIN' },
      { icon: '▪', name: 'Review notes',    type: 'ADMIN' },
    ],
  },
  medium: {
    pct: 55,
    label: 'Medium',
    mode: 'Collaborative',
    badge: 'Medium energy',
    tagline: '"Medium energy? Collaborative and creative work rises."',
    tasks: [
      { icon: '◈', name: 'Team sync call',   type: 'COLLAB' },
      { icon: '◈', name: 'Code review',      type: 'COLLAB' },
      { icon: '◈', name: 'Draft feedback',   type: 'COLLAB' },
    ],
  },
  good: {
    pct: 75,
    label: 'Good',
    mode: 'Creative flow',
    badge: 'Good energy',
    tagline: '"Good energy? Creative and complex work surfaces now."',
    tasks: [
      { icon: '⚡', name: 'Product strategy',   type: 'CREATIVE' },
      { icon: '⚡', name: 'UI design work',      type: 'CREATIVE' },
      { icon: '⚡', name: 'Writing & drafting',  type: 'CREATIVE' },
    ],
  },
  peak: {
    pct: 95,
    label: 'Peak',
    mode: 'Deep focus',
    badge: 'Peak energy',
    tagline: '"Peak energy? High-impact work rises. This is your moment."',
    tasks: [
      { icon: '⚡', name: 'Deep work session',      type: 'DEEP' },
      { icon: '⚡', name: 'Strategic planning',      type: 'DEEP' },
      { icon: '⚡', name: 'Complex problem-solving', type: 'DEEP' },
    ],
  },
}

const LEVEL_ORDER: EnergyLevel[] = ['empty', 'low', 'medium', 'good', 'peak']

// Arc geometry helpers
// We draw on a 200×200 viewBox, circle centered at 100,100 radius 80
// Arc starts at ~225° (bottom-left) and sweeps ~270° clockwise
const R = 80
const CX = 100
const CY = 100
const START_DEG = 225   // where arc begins
const SWEEP_DEG = 270   // total sweep range

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function buildArcPath(pct: number): string {
  // clamp so arc is always between 3% and 97% of sweep to avoid path collapse
  const clamped = Math.max(3, Math.min(97, pct))
  const endDeg = START_DEG + (clamped / 100) * SWEEP_DEG
  const start  = polarToXY(CX, CY, R, START_DEG)
  const end    = polarToXY(CX, CY, R, endDeg)
  const large  = (clamped / 100) * SWEEP_DEG > 180 ? 1 : 0
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`
}

// Orbit dot position along arc at a given fraction of the sweep
function orbitDotPos(pct: number, offset = 0): { x: number; y: number } {
  const fraction = Math.max(0.05, Math.min(0.95, pct / 100))
  const deg = START_DEG + (fraction + offset) * SWEEP_DEG
  return polarToXY(CX, CY, R, deg)
}

function EnergyEngineSection() {
  const { ref, visible } = useInView(0.15)
  const [active, setActive]   = useState<EnergyLevel>('good')
  const [prev, setPrev]       = useState<EnergyLevel | null>(null)
  const [animKey, setAnimKey] = useState(0)

  const data = ENERGY_DATA[active]

  function selectLevel(lvl: EnergyLevel) {
    if (lvl === active) return
    setPrev(active)
    setActive(lvl)
    setAnimKey(k => k + 1)
  }

  // Arc circumference for the track circle
  const fullCircumference = 2 * Math.PI * R  // ≈ 502.65
  const trackStart = polarToXY(CX, CY, R, START_DEG)
  const trackEnd   = polarToXY(CX, CY, R, START_DEG + SWEEP_DEG)

  // Orbit dots — shown at good/peak with gentle float
  const showOrbits = active === 'good' || active === 'peak'
  const dot1 = orbitDotPos(data.pct, -0.08)
  const dot2 = orbitDotPos(data.pct,  0.04)

  return (
    <section
      id="features"
      style={{
        position: 'relative',
        // Darker base so the amber dial glows *against* darkness — fixes the
        // background-merge issue from the review
        background: 'linear-gradient(180deg, #2E1012 0%, #321214 60%, #3C1518 100%)',
        overflow: 'hidden',
        padding: '120px 48px 140px',
      }}
    >
      {/* Ambient glow — reduced opacity vs screenshots to give dial room */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 30% 55%, rgba(164,66,0,0.10) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 75% 40%, rgba(213,137,54,0.06) 0%, transparent 60%)
        `,
      }} />

      <div
        ref={ref}
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Energy-Aware Task Engine
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(42px, 5vw, 68px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE', marginBottom: 20,
          }}>
            Tasks that{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              understand you
            </span>
          </h2>

          <p style={{
            fontSize: 16, color: '#8A8A45', lineHeight: 1.7,
            maxWidth: 460, margin: '0 auto',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Hover over each energy level to see how your task landscape intelligently shifts.
          </p>
        </div>

        {/* ── Main interactive grid ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80, alignItems: 'center',
            animationDelay: '0.15s',
          }}
        >

          {/* ════ LEFT — Dial ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>

            {/* SVG Dial */}
            <div style={{ position: 'relative', width: 220, height: 220 }}>

              {/* Outer glow halo — dims at low energy, brightens at peak */}
              <div style={{
                position: 'absolute', inset: -20,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, rgba(164,66,0,${
                  active === 'peak' ? '0.22' :
                  active === 'good' ? '0.15' :
                  active === 'medium' ? '0.10' : '0.05'
                }) 0%, transparent 70%)`,
                transition: 'background 0.6s ease',
                pointerEvents: 'none',
              }} />

              <svg
                width="220" height="220"
                viewBox="0 0 200 200"
                style={{ display: 'block', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%"
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#A44200" />
                    <stop offset="50%"  stopColor="#D58936" />
                    <stop offset="100%" stopColor="#F2F3AE" />
                  </linearGradient>
                  <filter id="arcGlow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Track arc (background) */}
                <path
                  d={`M ${trackStart.x.toFixed(3)} ${trackStart.y.toFixed(3)}
                      A ${R} ${R} 0 1 1 ${trackEnd.x.toFixed(3)} ${trackEnd.y.toFixed(3)}`}
                  fill="none"
                  stroke="rgba(107,36,32,0.45)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Live arc — redraws on level change */}
                <path
                  key={`arc-${animKey}`}
                  d={buildArcPath(data.pct)}
                  fill="none"
                  stroke="url(#arcGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#arcGlow)"
                  style={{
                    strokeDasharray: fullCircumference,
                    strokeDashoffset: fullCircumference,
                    animation: `arcReveal 0.65s cubic-bezier(0.16,1,0.3,1) both`,
                    // stroke-dashoffset animates to 0 (full draw)
                    // We override with keyframe that goes from fullCircumference to 0
                  }}
                />

                {/* Arc end-cap glow dot */}
                {(() => {
                  const clamped = Math.max(3, Math.min(97, data.pct))
                  const endDeg  = START_DEG + (clamped / 100) * SWEEP_DEG
                  const ep      = polarToXY(CX, CY, R, endDeg)
                  return (
                    <circle
                      key={`cap-${animKey}`}
                      cx={ep.x} cy={ep.y} r="5"
                      fill="#F2F3AE"
                      style={{
                        filter: 'drop-shadow(0 0 5px #F2F3AE) drop-shadow(0 0 10px #D58936)',
                        animation: `countUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both`,
                      }}
                    />
                  )
                })()}

                {/* Orbit dots — only at good/peak */}
                {showOrbits && (
                  <>
                    <circle
                      key={`orb1-${animKey}`}
                      cx={dot1.x} cy={dot1.y} r="3.5"
                      fill="#D58936" opacity="0.75"
                      style={{
                        filter: 'drop-shadow(0 0 4px #D58936)',
                        animation: `countUp 0.4s ease 0.5s both`,
                      }}
                    />
                    <circle
                      key={`orb2-${animKey}`}
                      cx={dot2.x} cy={dot2.y} r="2.5"
                      fill="#F2F3AE" opacity="0.50"
                      style={{
                        filter: 'drop-shadow(0 0 3px #F2F3AE)',
                        animation: `countUp 0.4s ease 0.65s both`,
                      }}
                    />
                  </>
                )}

                {/* Center: percentage + label */}
                <text
                  key={`pct-${animKey}`}
                  x={CX} y={CY - 8}
                  textAnchor="middle"
                  fill="#F2F3AE"
                  fontSize="34"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight="700"
                  style={{ animation: 'countUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
                >
                  {data.pct}
                </text>
                <text
                  x={CX} y={CY + 10}
                  textAnchor="middle"
                  fill="#8A8A45"
                  fontSize="10"
                  fontFamily="'Nunito', sans-serif"
                  fontWeight="600"
                  letterSpacing="0.5"
                >
                  %
                </text>
                <text
                  key={`lbl-${animKey}`}
                  x={CX} y={CY + 26}
                  textAnchor="middle"
                  fill="#D58936"
                  fontSize="9"
                  fontFamily="'Nunito', sans-serif"
                  fontWeight="700"
                  letterSpacing="2"
                  style={{ animation: 'countUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}
                >
                  {data.label.toUpperCase()}
                </text>
              </svg>
            </div>

            {/* Energy level tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
              {LEVEL_ORDER.map(lvl => (
                <button
                  key={lvl}
                  className={`energy-tab ${active === lvl ? 'active' : ''}`}
                  onClick={() => selectLevel(lvl)}
                  onMouseEnter={() => selectLevel(lvl)}
                >
                  {ENERGY_DATA[lvl].label}
                </button>
              ))}
            </div>

            {/* Tagline */}
            <p
              key={`tag-${animKey}`}
              style={{
                fontSize: 13, fontStyle: 'italic',
                fontFamily: "'Cormorant Garamond', serif",
                color: '#8A8A45', textAlign: 'center',
                maxWidth: 280, lineHeight: 1.6,
                animation: 'panelFade 0.4s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              {data.tagline}
            </p>
          </div>
          {/* end left */}

          {/* ════ RIGHT — Task panel ════ */}
          <div
            key={`panel-${animKey}`}
            className="engine-panel-enter"
          >
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28, fontWeight: 700,
                  color: '#F2F3AE', letterSpacing: '-0.01em',
                  marginBottom: 6,
                }}>
                  {data.mode}
                </h3>
                <p style={{
                  fontSize: 12, color: '#8A8A45',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  Suggested tasks for your current state
                </p>
              </div>
              <span style={{
                padding: '5px 14px', borderRadius: 20,
                background: 'rgba(164,66,0,0.14)',
                border: '1px solid rgba(164,66,0,0.30)',
                fontSize: 11, fontWeight: 700,
                color: '#D58936', letterSpacing: '0.04em',
                fontFamily: "'Nunito', sans-serif",
                whiteSpace: 'nowrap' as const, flexShrink: 0,
                marginLeft: 16, marginTop: 2,
              }}>
                {data.badge}
              </span>
            </div>

            {/* Task rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {data.tasks.map((task, i) => (
                <div
                  key={`${animKey}-${i}`}
                  className={`engine-task-row engine-task-enter engine-task-enter-${i + 1}`}
                >
                  {/* Icon badge */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: 'rgba(164,66,0,0.18)',
                    border: '1px solid rgba(164,66,0,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: '#D58936',
                  }}>
                    {task.icon}
                  </div>

                  {/* Name + type */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: '#C8C97A',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.2, marginBottom: 3,
                    }}>
                      {task.name}
                    </div>
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: '#6B2420', letterSpacing: '0.1em',
                      fontFamily: "'Nunito', sans-serif",
                    }}>
                      {task.type}
                    </div>
                  </div>

                  {/* Surfaced badge — only for good/peak */}
                  {(active === 'good' || active === 'peak') && (
                    <span className="surfaced-badge">SURFACED</span>
                  )}
                </div>
              ))}
            </div>

            {/* Engine recalibrating row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 16px', borderRadius: 12,
              background: 'rgba(60,21,24,0.50)',
              border: '1px solid rgba(107,36,32,0.30)',
              marginTop: 4,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: 'rgba(107,36,32,0.40)',
                border: '1px solid rgba(107,36,32,0.40)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Spinning cog */}
                <svg
                  className="engine-spin"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="#6B2420" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize: 13, color: '#6B2420', fontWeight: 600,
                  fontFamily: "'Nunito', sans-serif", marginBottom: 2,
                }}>
                  Engine recalibrating…
                </div>
                <div style={{
                  fontSize: 11, color: '#4A1A1C',
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  Based on your energy check-in
                </div>
              </div>
            </div>

          </div>
          {/* end right */}

        </div>
        {/* end grid */}

      </div>
    </section>
  )
}

// ─── Inner Council Section ────────────────────────────────────────────────────

const VOICES = [
  {
    id: 'ambition',
    initial: 'A',
    name: 'Ambition',
    role: 'Drives you forward',
    color: '#D58936',
    bg: 'rgba(213,137,54,0.22)',
    border: 'rgba(213,137,54,0.40)',
    ringColor: '#D58936',
  },
  {
    id: 'fear',
    initial: 'F',
    name: 'Fear',
    role: 'Keeps you grounded',
    color: '#C9A8F5',
    bg: 'rgba(201,168,245,0.18)',
    border: 'rgba(201,168,245,0.35)',
    ringColor: '#C9A8F5',
  },
  {
    id: 'logic',
    initial: 'L',
    name: 'Logic',
    role: 'Finds the facts',
    color: '#7EC8E3',
    bg: 'rgba(126,200,227,0.18)',
    border: 'rgba(126,200,227,0.35)',
    ringColor: '#7EC8E3',
  },
  {
    id: 'creativity',
    initial: 'C',
    name: 'Creativity',
    role: 'Opens new paths',
    color: '#A8E6CF',
    bg: 'rgba(168,230,207,0.15)',
    border: 'rgba(168,230,207,0.30)',
    ringColor: '#A8E6CF',
  },
  {
    id: 'relationships',
    initial: 'R',
    name: 'Relationships',
    role: 'Considers others',
    color: '#E8855A',
    bg: 'rgba(232,133,90,0.18)',
    border: 'rgba(232,133,90,0.35)',
    ringColor: '#E8855A',
  },
]

// The scripted conversation — each message appears sequentially
const SCRIPT = [
  {
    type: 'user' as const,
    text: "I'm at a crossroads — should I launch the project now or wait until everything is perfect?",
    delay: 0,
  },
  {
    type: 'voice' as const,
    voiceId: 'ambition',
    text: '"This is the moment. Your momentum is building — don\'t slow down now."',
    delay: 900,
  },
  {
    type: 'voice' as const,
    voiceId: 'fear',
    text: '"What if you fail? Have you considered the risks here?"',
    delay: 1800,
  },
  {
    type: 'typing' as const,
    voiceId: 'logic',
    delay: 2600,
  },
  {
    type: 'voice' as const,
    voiceId: 'logic',
    text: '"The data suggests shipping at 80% is faster than waiting for 100%. Ship and iterate."',
    delay: 4000,
  },
  {
    type: 'voice' as const,
    voiceId: 'creativity',
    text: '"What if the imperfection IS the story? Constraints breed originality."',
    delay: 5000,
  },
  {
    type: 'voice' as const,
    voiceId: 'relationships',
    text: '"Who are you building this for? Have you asked them what they actually need?"',
    delay: 6000,
  },
]

// Replay interval — restart the animation loop
const REPLAY_DELAY = 9500

function InnerCouncilSection() {
  const { ref, visible } = useInView(0.15)
  const [activeVoice, setActiveVoice]   = useState<string | null>(null)
  const [shownCount, setShownCount]     = useState(0)
  const [showTyping, setShowTyping]     = useState(false)
  const [cycleKey, setCycleKey]         = useState(0)
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  // Clear all timers
  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
  }

  // Run the scripted animation sequence
  const runSequence = useCallback(() => {
    clearTimers()
    setShownCount(0)
    setShowTyping(false)
    setActiveVoice(null)

    SCRIPT.forEach((step, i) => {
      if (step.type === 'typing') {
        const t1 = setTimeout(() => {
          setShowTyping(true)
          setActiveVoice(step.voiceId)
        }, step.delay)
        timerRefs.current.push(t1)
      } else {
        const t2 = setTimeout(() => {
          setShowTyping(false)
          setShownCount(i + 1)
          if (step.type === 'voice') setActiveVoice(step.voiceId)
        }, step.delay)
        timerRefs.current.push(t2)
      }
    })

    // Restart loop
    const tReplay = setTimeout(() => {
      setCycleKey(k => k + 1)
    }, REPLAY_DELAY)
    timerRefs.current.push(tReplay)
  }, [])

  // Start when section enters viewport
  useEffect(() => {
    if (!visible) return
    runSequence()
    return clearTimers
  }, [visible, cycleKey, runSequence])

  // Messages to render (filter out typing steps — those are handled separately)
  const renderedMessages = SCRIPT
    .filter(s => s.type !== 'typing')
    .slice(0, shownCount)

  return (
    <section
      id="inner-council"
      style={{
        position: 'relative',
        background: '#3C1518',
        overflow: 'hidden',
        padding: '120px 48px 140px',
      }}
    >
      {/* Subtle top separator from energy section */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Radial stage glow — centres behind the chat window */}
      <div
        className="stage-glow"
        style={{
          position: 'absolute',
          top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(164,66,0,0.10) 0%, transparent 68%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      <div
        ref={ref}
        style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            AI Reflection Engine
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(38px, 4.8vw, 64px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE', marginBottom: 20,
          }}>
            Five perspectives.{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              One clear decision.
            </span>
          </h2>

          <p style={{
            fontSize: 16, color: '#8A8A45', lineHeight: 1.7,
            maxWidth: 460, margin: '0 auto',
            fontFamily: "'Nunito', sans-serif",
          }}>
            When you're stuck, FlowSpace thinks <strong style={{ color: '#C8C97A', fontWeight: 600 }}>with</strong> you — not for you.
          </p>
        </div>

        {/* ── Voice avatars row ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            display: 'flex', justifyContent: 'center',
            gap: 28, marginBottom: 40,
            animationDelay: '0.12s',
          }}
        >
          {VOICES.map((v, i) => {
            const isActive = activeVoice === v.id
            return (
              <button
                key={v.id}
                className={`voice-btn voice-float-${i + 1}`}
                onClick={() => setActiveVoice(v.id)}
                aria-label={v.name}
              >
                {/* Avatar circle */}
                <div style={{ position: 'relative' }}>
                  {/* Pulse ring when speaking */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', inset: -5,
                      borderRadius: '50%',
                      border: `1.5px solid ${v.ringColor}`,
                      animation: 'voiceRing 1.4s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                  )}
                  <div style={{
                    width: isActive ? 54 : 46,
                    height: isActive ? 54 : 46,
                    borderRadius: '50%',
                    background: isActive ? v.bg : 'rgba(60,21,24,0.6)',
                    border: `2px solid ${isActive ? v.border : 'rgba(107,36,32,0.40)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isActive ? 18 : 15,
                    fontWeight: 800, color: isActive ? v.color : '#6B2420',
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: isActive
                      ? `0 0 20px ${v.color}35, 0 0 40px ${v.color}18`
                      : 'none',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}>
                    {v.initial}
                  </div>
                </div>
                {/* Label */}
                <span style={{
                  fontSize: 11, fontFamily: "'Nunito', sans-serif",
                  color: isActive ? v.color : '#6B2420',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.02em',
                  transition: 'color 0.3s ease',
                }}>
                  {v.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Chat window ── */}
        <div
          className={`council-window hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ animationDelay: '0.22s' }}
        >

          {/* Window header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 22px',
            borderBottom: '1px solid rgba(107,36,32,0.40)',
            background: 'rgba(42,12,14,0.60)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {/* Live dot */}
              <div style={{ position: 'relative', width: 8, height: 8 }}>
                <div className="glow-pulse" style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#4ADE80',
                  boxShadow: '0 0 6px #4ADE8088',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: '#4ADE80', opacity: 0.3,
                  animation: 'voiceRing 2s ease-out infinite',
                  transform: 'scale(2)',
                }} />
              </div>
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#C8C97A',
                fontFamily: "'Nunito', sans-serif", letterSpacing: '0.02em',
              }}>
                Inner Council — Active Session
              </span>
            </div>
            <span style={{
              fontSize: 11, color: '#6B2420',
              fontFamily: "'Nunito', sans-serif", fontWeight: 500,
            }}>
              5 voices connected
            </span>
          </div>

          {/* Messages area */}
          <div style={{
            padding: '24px 22px',
            minHeight: 300,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>

            {renderedMessages.map((msg, i) => {
              if (msg.type === 'user') {
                return (
                  <div
                    key={`msg-${cycleKey}-${i}`}
                    className="council-bubble council-msg-row"
                    style={{ animationDelay: '0s' }}
                  >
                    {/* You label */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(164,66,0,0.20)',
                      border: '1px solid rgba(164,66,0,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: '#D58936',
                      fontFamily: "'Nunito', sans-serif",
                    }}>
                      You
                    </div>
                    {/* Slightly tinted user bubble — improvement from review */}
                    <div style={{
                      flex: 1, padding: '13px 16px', borderRadius: 12,
                      background: 'rgba(82,26,16,0.45)',
                      border: '1px solid rgba(125,45,32,0.40)',
                      // faint cream tint to distinguish from voice messages
                      boxShadow: 'inset 0 0 0 1px rgba(242,243,174,0.04)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 14, color: '#C8C97A', lineHeight: 1.6,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                )
              }

              // Voice message
              const voice = VOICES.find(v => v.id === msg.voiceId)!
              return (
                <div
                  key={`msg-${cycleKey}-${i}`}
                  className="council-bubble council-msg-row"
                  style={{ animationDelay: '0s' }}
                >
                  {/* Voice avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: voice.bg,
                    border: `1.5px solid ${voice.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: voice.color,
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: `0 0 12px ${voice.color}28`,
                  }}>
                    {voice.initial}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Voice name + role */}
                    <div style={{
                      display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6,
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: voice.color,
                        fontFamily: "'Nunito', sans-serif", letterSpacing: '0.03em',
                      }}>
                        {voice.name}
                      </span>
                      <span style={{
                        fontSize: 11, color: '#6B2420',
                        fontFamily: "'Nunito', sans-serif", fontStyle: 'italic',
                      }}>
                        {voice.role}
                      </span>
                    </div>
                    {/* Message bubble */}
                    <div style={{
                      padding: '12px 16px', borderRadius: 12,
                      background: 'rgba(42,12,14,0.65)',
                      border: `1px solid rgba(107,36,32,0.30)`,
                      borderLeft: `2px solid ${voice.color}55`,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic', fontSize: 15,
                      color: '#C8C97A', lineHeight: 1.65,
                      fontWeight: 500,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator — shown between Logic queuing and speaking */}
            {showTyping && (() => {
              const voice = VOICES.find(v => v.id === 'logic')!
              return (
                <div className="council-bubble council-msg-row" style={{ animationDelay: '0s' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: voice.bg,
                    border: `1.5px solid ${voice.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: voice.color,
                    fontFamily: "'Nunito', sans-serif",
                    boxShadow: `0 0 12px ${voice.color}28`,
                    // pulse ring while typing
                    animation: 'voiceRing 1.4s ease-out infinite',
                  }}>
                    {voice.initial}
                  </div>
                  <div style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: 'rgba(42,12,14,0.65)',
                    border: '1px solid rgba(107,36,32,0.30)',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span className="council-dot"   style={{ color: '#7EC8E3' }} />
                    <span className="council-dot council-dot-2" style={{ color: '#7EC8E3' }} />
                    <span className="council-dot council-dot-3" style={{ color: '#7EC8E3' }} />
                  </div>
                </div>
              )
            })()}

          </div>
          {/* end messages */}

          {/* Input bar */}
          <div style={{
            padding: '16px 22px',
            borderTop: '1px solid rgba(107,36,32,0.35)',
            background: 'rgba(42,12,14,0.50)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              flex: 1, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(60,21,24,0.60)',
              border: '1px solid rgba(107,36,32,0.40)',
              fontSize: 14, color: '#6B2420',
              fontFamily: "'Nunito', sans-serif",
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>Share your dilemma with the Council</span>
              <span style={{ color: '#8A8A45', opacity: 0.7 }}>...</span>
              {/* Blinking cursor */}
              <span
                className="input-cursor"
                style={{
                  display: 'inline-block', width: 1.5, height: 14,
                  background: '#D58936', marginLeft: 2, borderRadius: 1,
                }}
              />
            </div>
            {/* Send button */}
            <button style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px #A4420045',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1.08)'
                el.style.boxShadow = '0 0 28px #A4420065'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1)'
                el.style.boxShadow = '0 0 18px #A4420045'
              }}
            >
              <ArrowRight size={16} color="#F2F3AE" strokeWidth={2.5} />
            </button>
          </div>

        </div>
        {/* end chat window */}

        {/* Closing quote */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            textAlign: 'center', marginTop: 40,
            animationDelay: '0.35s',
          }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontStyle: 'italic',
            color: '#6B2420', lineHeight: 1.7,
          }}>
            "Not every voice inside you is right. But every voice deserves to be heard."
          </p>
        </div>

      </div>
    </section>
  )
}

// ─── Mood & Patterns Section ──────────────────────────────────────────────────

// Chart data — 7 days Mon–Sun
const CHART_POINTS = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 55 },
  { day: 'Wed', value: 48 },
  { day: 'Thu', value: 72 },
  { day: 'Fri', value: 68 },
  { day: 'Sat', value: 88 },  // peak
  { day: 'Sun', value: 76 },
]

// Build SVG path from normalised points
function buildChartPath(
  points: { day: string; value: number }[],
  w: number,
  h: number,
  padX: number,
  padY: number,
): { line: string; area: string } {
  const minV = 0
  const maxV = 100
  const xs = points.map((_, i) => padX + (i / (points.length - 1)) * (w - padX * 2))
  const ys = points.map(p => h - padY - ((p.value - minV) / (maxV - minV)) * (h - padY * 2))

  // Smooth cubic bezier
  let line = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    line += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  const area = `${line} L ${xs[xs.length - 1]},${h - padY} L ${xs[0]},${h - padY} Z`
  return { line, area }
}

// Feature list data — SVG icons instead of emojis for premium feel
const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Weekly & Monthly Insights',
    body: 'See your emotional landscape across time.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Task-Mood Correlation',
    body: 'Discover which activities elevate your state.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    title: 'Night & Morning Patterns',
    body: 'Learn your natural rhythms and honor them.',
  },
]

// Stat cards — SVG icons for premium feel
const STATS = [
  {
    label: 'BEST DAY',
    value: 'Saturday',
    valueColor: '#F2F3AE',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: 'AVG MOOD',
    value: '72 / 100',
    valueColor: '#D58936',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    label: 'CURRENT STREAK',
    value: '7 days',
    valueColor: '#F2F3AE',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#A44200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    label: 'TOP PATTERN',
    value: 'Thu peak',
    valueColor: '#D58936',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="#D58936" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

function MoodPatternsSection() {
  const { ref, visible } = useInView(0.15)

  // Chart SVG dimensions
  const W = 380, H = 180, PX = 20, PY = 18
  const { line: chartLine, area: chartArea } = buildChartPath(CHART_POINTS, W, H, PX, PY)

  // Peak point coords (Saturday = index 5)
  const peakIdx = 5
  const peakX = PX + (peakIdx / (CHART_POINTS.length - 1)) * (W - PX * 2)
  const peakY = H - PY - ((CHART_POINTS[peakIdx].value / 100) * (H - PY * 2))

  return (
    <section
      id="mood-patterns"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #3C1518 0%, #381316 50%, #3C1518 100%)',
        overflow: 'hidden',
        padding: '120px 48px 140px',
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow — kept subtle so chart glows against dark */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 50% at 35% 55%, rgba(164,66,0,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 40% 35% at 75% 45%, rgba(213,137,54,0.05) 0%, transparent 60%)
        `,
      }} />

      <div
        ref={ref}
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Mood & Patterns
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 4.8vw, 64px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE',
          }}>
            Patterns emerge when you{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              pay attention
            </span>
          </h2>
        </div>

        {/* ── Main two-column layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: 72,
          alignItems: 'start',
        }}>

          {/* ════ LEFT — Dashboard panel ════ */}
          <div className={`hiw-reveal hiw-reveal-left ${visible ? 'visible' : ''}`}>

            {/* Unified dashboard container — chart + stats as one panel */}
            <div style={{
              borderRadius: 20,
              background: 'linear-gradient(160deg, rgba(52,16,18,0.95) 0%, rgba(38,10,12,0.98) 100%)',
              border: '1px solid rgba(107,36,32,0.50)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.60), inset 0 1px 0 rgba(242,243,174,0.05)',
            }}>

              {/* Chart header */}
              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '22px 24px 0',
              }}>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: '#C8C97A',
                    fontFamily: "'Nunito', sans-serif", marginBottom: 4,
                  }}>
                    Weekly Energy Map
                  </div>
                  <div style={{
                    fontSize: 11, color: '#6B2420',
                    fontFamily: "'Nunito', sans-serif",
                  }}>
                    Mar 3 — Mar 9, 2026
                  </div>
                </div>
                {/* +12% badge — improved text colour from review */}
                <div style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: 'rgba(164,66,0,0.18)',
                  border: '1px solid rgba(164,66,0,0.35)',
                  fontSize: 11, fontWeight: 700,
                  color: '#F2F3AE',           // cream — fixed from near-invisible
                  fontFamily: "'Nunito', sans-serif",
                  letterSpacing: '0.03em',
                }}>
                  +12% vs last week
                </div>
              </div>

              {/* SVG chart */}
              <div style={{ padding: '16px 24px 0' }}>
                <svg
                  width="100%"
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ display: 'block', overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#A44200" />
                      <stop offset="55%"  stopColor="#D58936" />
                      <stop offset="100%" stopColor="#F2F3AE" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%"   stopColor="#D58936" stopOpacity="0.40" />
                      <stop offset="55%"  stopColor="#A44200" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#A44200" stopOpacity="0.00" />
                    </linearGradient>
                    <filter id="lineGlow">
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[25, 50, 75].map(v => {
                    const y = H - PY - (v / 100) * (H - PY * 2)
                    return (
                      <line
                        key={v}
                        x1={PX} x2={W - PX} y1={y} y2={y}
                        stroke="rgba(107,36,32,0.25)"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                      />
                    )
                  })}

                  {/* Area fill — fades in after line draws */}
                  <path
                    d={chartArea}
                    fill="url(#areaGrad)"
                    className={`chart-area ${visible ? 'visible' : ''}`}
                  />

                  {/* Chart line — draws left to right */}
                  <path
                    d={chartLine}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#lineGlow)"
                    className={`chart-line ${visible ? 'visible' : ''}`}
                  />

                  {/* Peak dot with pulse */}
                  <circle
                    cx={peakX} cy={peakY} r="5"
                    fill="#F2F3AE"
                    style={{
                      filter: 'drop-shadow(0 0 6px #F2F3AE) drop-shadow(0 0 12px #D58936)',
                      opacity: visible ? 1 : 0,
                      transition: 'opacity 0.4s ease 2s',
                    }}
                  />
                  <circle
                    cx={peakX} cy={peakY} r="4"
                    fill="none"
                    stroke="#D58936"
                    strokeWidth="1.5"
                    style={{
                      opacity: visible ? 0.5 : 0,
                      transition: 'opacity 0.4s ease 2s',
                      animation: visible ? 'peakPulse 2s ease-in-out infinite 2s' : 'none',
                    }}
                  />

                </svg>
              </div>

              {/* Day labels */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 24px 20px',
              }}>
                {CHART_POINTS.map(p => (
                  <span key={p.day} style={{
                    fontSize: 11, color: '#6B2420',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 500,
                    width: `${100 / CHART_POINTS.length}%`,
                    textAlign: 'center',
                  }}>
                    {p.day}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(107,36,32,0.35)', margin: '0 0' }} />

              {/* Stat cards 2×2 — unified with chart above */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: 'rgba(107,36,32,0.25)',
              }}>
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className={`stat-card-anim stat-${i + 1} ${visible ? 'visible' : ''}`}
                    style={{
                      padding: '18px 20px',
                      background: 'linear-gradient(145deg, rgba(48,14,16,0.95), rgba(38,10,12,0.98))',
                      // Subtle corner radius on outer corners only
                      borderRadius:
                        i === 2 ? '0 0 0 20px' :
                        i === 3 ? '0 0 20px 0' : '0',
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginBottom: 8,
                    }}>
                      {s.icon}
                      <span style={{
                        fontSize: 9, fontWeight: 800, color: '#6B2420',
                        letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                        fontFamily: "'Nunito', sans-serif",
                      }}>
                        {s.label}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 18, fontWeight: 700,
                      color: s.valueColor,
                      fontFamily: "'Cormorant Garamond', serif",
                      letterSpacing: '-0.01em',
                    }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
            {/* end unified panel */}

          </div>
          {/* end left */}

          {/* ════ RIGHT — Copy + features ════ */}
          <div
            className={`hiw-reveal hiw-reveal-right ${visible ? 'visible' : ''}`}
            style={{ paddingTop: 8 }}
          >

            {/* Right column headline — anchored to top, aligned with chart header */}
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px, 3.2vw, 44px)',
              fontWeight: 700, lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: '#F2F3AE',
              marginBottom: 20,
            }}>
              Your emotional data,{' '}
              <span style={{
                display: 'block',
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #A44200, #D58936)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                beautifully mapped
              </span>
            </h3>

            <p style={{
              fontSize: 15, color: '#8A8A45', lineHeight: 1.78,
              fontFamily: "'Nunito', sans-serif",
              marginBottom: 40, maxWidth: 380,
            }}>
              Track how you feel daily and FlowSpace uncovers the patterns.
              Understand what drains you, what lifts you, and when your best work naturally emerges.
            </p>

            {/* Feature rows — premium SVG icons, slide in from right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`feature-row-anim feat-${i + 1} ${visible ? 'visible' : ''}`}
                  style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
                >
                  {/* Premium icon badge — replaces emoji */}
                  <div
                    className="premium-icon icon-badge-glow"
                    style={{ marginTop: 2 }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: '#C8C97A',
                      fontFamily: "'Nunito', sans-serif",
                      marginBottom: 5, letterSpacing: '0.01em',
                    }}>
                      {f.title}
                    </div>
                    <div style={{
                      fontSize: 13, color: '#6B2420',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.65,
                    }}>
                      {f.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          {/* end right */}

        </div>
        {/* end grid */}

      </div>
    </section>
  )
}

// ─── Brain Dump Section ───────────────────────────────────────────────────────

// Word cloud — atmospheric background words
// Varied: size, opacity, position, drift animation, delay
// All kept at very low opacity (5–10%) so they're felt, not read
const CLOUD_WORDS = [
  // top band
  { text: 'energy check-in',  top:  '4%',  left: '62%', size: 11, opacity: 0.07, anim: 'wordDrift1', delay: '0s',    duration: '28s' },
  { text: 'journal entry',    top:  '8%',  left: '38%', size: 10, opacity: 0.06, anim: 'wordDrift3', delay: '4s',    duration: '32s' },
  { text: 'strategic plan',   top:  '6%',  left: '80%', size: 12, opacity: 0.08, anim: 'wordDrift2', delay: '2s',    duration: '26s' },

  // upper-mid band
  { text: 'mindful morning',  top: '18%',  left:  '8%', size: 11, opacity: 0.06, anim: 'wordDrift4', delay: '6s',    duration: '34s' },
  { text: 'quarterly goals',  top: '22%',  left: '28%', size: 10, opacity: 0.05, anim: 'wordDrift5', delay: '1s',    duration: '30s' },
  { text: 'creative work',    top: '16%',  left: '74%', size: 13, opacity: 0.07, anim: 'wordDrift1', delay: '8s',    duration: '36s' },
  { text: 'team alignment',   top: '24%',  left: '88%', size:  9, opacity: 0.05, anim: 'wordDrift3', delay: '3s',    duration: '29s' },

  // mid band — flanking the central card
  { text: 'call mum',         top: '42%',  left:  '4%', size: 10, opacity: 0.06, anim: 'wordDrift2', delay: '5s',    duration: '31s' },
  { text: 'deep work session',top: '48%',  left:  '2%', size:  9, opacity: 0.05, anim: 'wordDrift4', delay: '9s',    duration: '27s' },
  { text: 'write proposal',   top: '38%',  left: '82%', size: 11, opacity: 0.07, anim: 'wordDrift5', delay: '0s',    duration: '33s' },
  { text: 'product vision',   top: '52%',  left: '85%', size: 10, opacity: 0.06, anim: 'wordDrift1', delay: '7s',    duration: '38s' },

  // lower-mid band
  { text: 'write a proposal', top: '64%',  left: '10%', size: 11, opacity: 0.05, anim: 'wordDrift3', delay: '2s',    duration: '35s' },
  { text: 'daily intention',  top: '68%',  left: '72%', size: 10, opacity: 0.06, anim: 'wordDrift2', delay: '6s',    duration: '29s' },

  // bottom band
  { text: 'sleep earlier',    top: '80%',  left: '20%', size:  9, opacity: 0.05, anim: 'wordDrift5', delay: '3s',    duration: '32s' },
  { text: 'clear my inbox',   top: '76%',  left: '58%', size: 10, opacity: 0.06, anim: 'wordDrift4', delay: '10s',   duration: '30s' },
  { text: 'exercise more',    top: '84%',  left: '40%', size:  9, opacity: 0.04, anim: 'wordDrift1', delay: '1s',    duration: '36s' },
]

// Category chips — premium SVG icons replacing emojis
const CATEGORIES = [
  {
    id: 'insight',
    label: 'Insight',
    color: '#D58936',
    bg: 'rgba(213,137,54,0.15)',
    border: 'rgba(213,137,54,0.40)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    id: 'action',
    label: 'Action',
    color: '#A8E6CF',
    bg: 'rgba(168,230,207,0.12)',
    border: 'rgba(168,230,207,0.30)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'feeling',
    label: 'Feeling',
    color: '#7EC8E3',
    bg: 'rgba(126,200,227,0.12)',
    border: 'rgba(126,200,227,0.30)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'idea',
    label: 'Idea',
    color: '#C9A8F5',
    bg: 'rgba(201,168,245,0.12)',
    border: 'rgba(201,168,245,0.30)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
    ),
  },
]

// Recent captures
const RECENT_CAPTURES = [
  {
    type: 'insight',
    text: 'The new positioning needs a fresh take — what if we focused on energy instead of productivity?',
    time: '2 min ago',
    color: '#D58936',
    bg: 'rgba(213,137,54,0.15)',
    border: 'rgba(213,137,54,0.35)',
  },
  {
    type: 'action',
    text: 'Remember to check in with team about Thursday sprint review.',
    time: '8 min ago',
    color: '#A8E6CF',
    bg: 'rgba(168,230,207,0.12)',
    border: 'rgba(168,230,207,0.28)',
  },
  {
    type: 'feeling',
    text: 'Feeling scattered today — maybe I need to simplify my focus before diving in.',
    time: '23 min ago',
    color: '#7EC8E3',
    bg: 'rgba(126,200,227,0.12)',
    border: 'rgba(126,200,227,0.28)',
  },
]

function BrainDumpSection() {
  const { ref, visible } = useInView(0.12)
  const [activeChip, setActiveChip] = useState<string | null>(null)

  return (
    <section
      id="brain-dump"
      style={{
        position: 'relative',
        background: '#3C1518',
        overflow: 'hidden',
        padding: '120px 48px 140px',
        minHeight: '100vh',
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* ── Word cloud — atmospheric, barely visible ── */}
      {/* Each word: tiny, very low opacity, slow independent drift */}
      {/* Clustered and varied in size — organic, not grid-like */}
      <div style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0,
      }}>
        {CLOUD_WORDS.map((w, i) => (
          <span
            key={i}
            className="brain-word"
            style={{
              top: w.top,
              left: w.left,
              fontSize: w.size,
              opacity: w.opacity,   // max 9% — felt, not read
              fontWeight: i % 3 === 0 ? 600 : 400,
              animation: `${w.anim} ${w.duration} ease-in-out infinite alternate`,
              animationDelay: w.delay,
            }}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* Very faint radial glow centred behind card */}
      <div style={{
        position: 'absolute',
        top: '45%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(164,66,0,0.08) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div
        ref={ref}
        style={{
          maxWidth: 720,
          margin: '0 auto',
          position: 'relative', zIndex: 2,
        }}
      >

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Brain Dump
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 4.8vw, 64px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE', marginBottom: 20,
          }}>
            Everything in{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              one place
            </span>
          </h2>

          <p style={{
            fontSize: 16, color: '#8A8A45', lineHeight: 1.7,
            maxWidth: 440, margin: '0 auto',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Pour out your thoughts, ideas, worries, and sparks.{' '}
            FlowSpace holds them safely until you're ready to act.
          </p>
        </div>

        {/* ── Capture card ── */}
        <div
          className={`capture-card capture-card-anim ${visible ? 'visible' : ''}`}
        >

          {/* Textarea area */}
          <div style={{ padding: '24px 24px 0' }}>
            <div style={{
              padding: '16px 18px',
              borderRadius: 12,
              background: 'rgba(30,8,10,0.60)',
              border: '1px solid rgba(107,36,32,0.35)',
              minHeight: 110,
              position: 'relative',
              transition: 'border-color 0.25s ease',
            }}>
              {/* Placeholder text */}
              <p style={{
                fontSize: 14, color: '#6B2420',
                fontFamily: "'Nunito', sans-serif",
                lineHeight: 1.6, margin: 0,
              }}>
                What's on your mind right now? No structure needed — just pour it out...
              </p>
              {/* Blinking cursor */}
              <span style={{
                display: 'inline-block',
                width: 1.5, height: 15,
                background: '#D58936',
                marginLeft: 3,
                verticalAlign: 'text-bottom',
                borderRadius: 1,
                animation: 'textCursor 1.1s step-end infinite',
              }} />
            </div>
          </div>

          {/* Chips + Capture button */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px 20px',
            gap: 12,
          }}>
            {/* Category chips — premium SVG icons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-chip ${activeChip === cat.id ? 'active' : ''}`}
                  style={activeChip === cat.id ? {
                    borderColor: cat.border,
                    background: cat.bg,
                    color: cat.color,
                  } : {}}
                  onClick={() => setActiveChip(activeChip === cat.id ? null : cat.id)}
                >
                  {/* Premium SVG icon — no emojis */}
                  <span style={{ color: activeChip === cat.id ? cat.color : '#6B2420', display: 'flex', alignItems: 'center' }}>
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Capture button */}
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', borderRadius: 12,
                background: 'linear-gradient(135deg, #A44200, #C05020 50%, #D58936)',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, color: '#F2F3AE',
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: '0.02em',
                boxShadow: '0 0 22px #A4420040, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,243,174,0.15)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                whiteSpace: 'nowrap' as const, flexShrink: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-1px) scale(1.02)'
                el.style.boxShadow = '0 0 36px #A4420060, 0 6px 18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(242,243,174,0.18)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0) scale(1)'
                el.style.boxShadow = '0 0 22px #A4420040, 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,243,174,0.15)'
              }}
            >
              Capture
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        {/* end capture card */}

        {/* ── Recent Captures ── */}
        <div style={{ marginTop: 32 }}>

          <div
            className={`hiw-reveal ${visible ? 'visible' : ''}`}
            style={{ marginBottom: 14, animationDelay: '0.1s' }}
          >
            <span style={{
              fontSize: 10, fontWeight: 800,
              color: '#6B2420', letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              fontFamily: "'Nunito', sans-serif",
            }}>
              Recent Captures
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RECENT_CAPTURES.map((c, i) => {
              // Find matching category for icon
              const cat = CATEGORIES.find(x => x.id === c.type)
              return (
                <div
                  key={i}
                  className={`capture-row capture-anim cap-${i + 1} ${visible ? 'visible' : ''}`}
                >
                  {/* Type badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    flexShrink: 0,
                  }}>
                    {/* SVG icon matching chip */}
                    <span style={{ color: c.color, display: 'flex', alignItems: 'center' }}>
                      {cat?.icon}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      color: c.color, letterSpacing: '0.08em',
                      fontFamily: "'Nunito', sans-serif",
                      textTransform: 'capitalize' as const,
                    }}>
                      {c.type}
                    </span>
                  </div>

                  {/* Text */}
                  <p style={{
                    flex: 1, margin: 0,
                    fontSize: 13, color: '#C8C97A',
                    fontFamily: "'Nunito', sans-serif",
                    lineHeight: 1.55, fontWeight: 400,
                  }}>
                    {c.text}
                  </p>

                  {/* Timestamp */}
                  <span style={{
                    fontSize: 11, color: '#6B2420',
                    fontFamily: "'Nunito', sans-serif",
                    flexShrink: 0, whiteSpace: 'nowrap' as const,
                  }}>
                    {c.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        {/* end recent captures */}

        {/* Closing quote */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            textAlign: 'center', marginTop: 48,
            animationDelay: '0.6s',
          }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, fontStyle: 'italic',
            color: '#6B2420', lineHeight: 1.7,
          }}>
            "A cluttered mind finds peace in release."
          </p>
        </div>

      </div>
    </section>
  )
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    id: 'amara',
    initials: 'AN',
    name: 'Amara N.',
    role: 'Product Designer',
    avatarBg: '#8B4A2F',
    stars: 5,
    quote: 'FlowSpace changed how I relate to my own mind. I no longer fight my energy — I work with it.',
    // constellation position + float
    top: '8%', left: '4%', width: 230,
    float: 'tFloat1', floatDuration: '6.2s', floatDelay: '0s',
    rotation: '-1.5deg', zIndex: 4,
    enterDelay: '0.05s',
  },
  {
    id: 'james',
    initials: 'JK',
    name: 'James K.',
    role: 'Startup Founder',
    avatarBg: '#A44200',
    stars: 5,
    quote: 'The Inner Council feature alone is worth it. I make better decisions because I hear all my own perspectives.',
    // centrepiece — larger, prominent
    top: '4%', left: '34%', width: 270,
    float: 'tFloat3', floatDuration: '7.0s', floatDelay: '0.8s',
    rotation: '0deg', zIndex: 10,
    enterDelay: '0.12s',
  },
  {
    id: 'priya',
    initials: 'PM',
    name: 'Priya M.',
    role: 'Creative Director',
    avatarBg: '#4A7C7E',
    stars: 5,
    quote: 'Finally, a tool that understands I\'m not a machine. Energy-aware tasks changed my productivity forever.',
    top: '6%', left: '70%', width: 230,
    float: 'tFloat2', floatDuration: '5.8s', floatDelay: '1.4s',
    rotation: '1.2deg', zIndex: 5,
    enterDelay: '0.18s',
  },
  {
    id: 'leo',
    initials: 'LR',
    name: 'Leo R.',
    role: 'Software Engineer',
    avatarBg: '#7A4A28',
    stars: 5,
    quote: 'The mood tracking revealed patterns I never noticed. My best code comes on Thursday mornings. Every time.',
    top: '40%', left: '2%', width: 230,
    float: 'tFloat4', floatDuration: '8.0s', floatDelay: '0.3s',
    rotation: '2deg', zIndex: 4,
    enterDelay: '0.22s',
  },
  {
    id: 'soojin',
    initials: 'SL',
    name: 'Soo-Jin L.',
    role: 'Executive Coach',
    avatarBg: '#6B3A6B',
    stars: 5,
    quote: 'I recommend FlowSpace to every client. It\'s not productivity software — it\'s a mental wellness companion.',
    top: '38%', left: '34%', width: 252,
    float: 'tFloat5', floatDuration: '6.8s', floatDelay: '2.0s',
    rotation: '-0.8deg', zIndex: 6,
    enterDelay: '0.28s',
  },
  {
    id: 'marco',
    initials: 'MV',
    name: 'Marco V.',
    role: 'UX Researcher',
    avatarBg: '#3A5A7A',
    stars: 5,
    quote: 'The Brain Dump feature alone cleared six months of mental fog. It\'s like having a second brain.',
    top: '40%', left: '70%', width: 228,
    float: 'tFloat6', floatDuration: '7.4s', floatDelay: '1.1s',
    rotation: '0.8deg', zIndex: 5,
    enterDelay: '0.32s',
  },
  {
    id: 'zara',
    initials: 'ZO',
    name: 'Zara O.',
    role: 'Writer & Creator',
    avatarBg: '#8B3A5A',
    stars: 5,
    quote: 'I write 3× more since using FlowSpace. Not because I work harder — because I work smarter, with my natural rhythm.',
    top: '68%', left: '18%', width: 244,
    float: 'tFloat7', floatDuration: '5.4s', floatDelay: '0.6s',
    rotation: '-2deg', zIndex: 7,
    enterDelay: '0.38s',
  },
  {
    id: 'david',
    initials: 'DT',
    name: 'David T.',
    role: 'Clinical Psychologist',
    avatarBg: '#2A6A5A',
    stars: 5,
    quote: 'As a psychologist, I\'m selective about tools I endorse. FlowSpace is genuinely therapeutic in its design.',
    top: '66%', left: '60%', width: 236,
    float: 'tFloat2', floatDuration: '9.0s', floatDelay: '3.0s',
    rotation: '1.5deg', zIndex: 5,
    enterDelay: '0.44s',
  },
]

const STATS_BAR = [
  { value: '2,400+', label: 'Active minds' },
  { value: '4.9 / 5', label: 'Average rating' },
  { value: '93%', label: 'Feel less overwhelmed' },
  { value: '3.2×', label: 'Focus improvement' },
]

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill="#D58936" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function TestimonialsSection() {
  const { ref, visible } = useInView(0.08)
  const [selected, setSelected] = useState<string>('james')

  return (
    <section
      id="testimonials"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #3C1518 0%, #381215 50%, #3C1518 100%)',
        overflow: 'hidden',
        paddingBottom: 0,
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow — very restrained so cards read clearly */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 45%, rgba(164,66,0,0.07) 0%, transparent 65%)
        `,
      }} />

      <div ref={ref} style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', padding: '100px 48px 0' }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Loved by minds like yours
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 4.8vw, 64px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE', marginBottom: 16,
          }}>
            Real people.{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Real clarity.
            </span>
          </h2>

          <p style={{
            fontSize: 14, color: '#6B2420',
            fontFamily: "'Nunito', sans-serif",
            marginBottom: 0,
          }}>
            Click any card to highlight it
          </p>
        </div>

        {/* ── Constellation ── */}
        {/* Fixed-height canvas — cards positioned absolutely within */}
        <div style={{
          position: 'relative',
          height: 620,
          maxWidth: 1100,
          margin: '40px auto 0',
          padding: '0 48px',
        }}>
          {TESTIMONIALS.map((t, i) => {
            const isSelected = selected === t.id
            return (
              <div
                key={t.id}
                className={`t-card t-card-enter ${visible ? 'visible' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelected(t.id)}
                style={{
                  top: t.top,
                  left: t.left,
                  width: t.width,
                  zIndex: isSelected ? 20 : t.zIndex,
                  // Float animation — each card unique, clearly perceptible
                  animation: isSelected
                    ? 'haloBreath 2.8s ease-in-out infinite'
                    : `${t.float} ${t.floatDuration} ease-in-out ${t.floatDelay} infinite, cardConstella 0.65s cubic-bezier(0.16,1,0.3,1) ${t.enterDelay} both`,
                  // Bake rotation into transform via CSS var — float keyframes
                  // already include rotation so it stays consistent
                  transform: isSelected
                    ? `rotate(${t.rotation}) scale(1.04)`
                    : `rotate(${t.rotation})`,
                  // Override transform when selected — lift + scale
                  transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), z-index 0s',
                }}
              >
                {/* Avatar + name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: t.avatarBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#F2F3AE',
                    fontFamily: "'Nunito', sans-serif",
                    // Amber ring on selected avatar
                    boxShadow: isSelected
                      ? `0 0 0 2px #3C1518, 0 0 0 3.5px rgba(213,137,54,0.55)`
                      : 'none',
                    transition: 'box-shadow 0.35s ease',
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: isSelected ? '#F2F3AE' : '#C8C97A',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: 1.2,
                      transition: 'color 0.3s ease',
                    }}>
                      {t.name}
                    </div>
                    <div style={{
                      fontSize: 10, color: '#6B2420',
                      fontFamily: "'Nunito', sans-serif",
                      marginTop: 1,
                    }}>
                      {t.role}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <StarRow count={t.stars} />

                {/* Quote */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic', fontSize: 14,
                  color: isSelected ? '#C8C97A' : '#8A8A45',
                  lineHeight: 1.65, margin: 0,
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                }}>
                  "{t.quote}"
                </p>

              </div>
            )
          })}
        </div>
        {/* end constellation */}

        {/* ── Stats bar ── */}
        <div style={{
          borderTop: '1px solid rgba(107,36,32,0.35)',
          marginTop: 20,
          padding: '52px 48px 80px',
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
        }}>
          {STATS_BAR.map((s, i) => (
            <div
              key={s.label}
              className={`stat-item-enter ${visible ? 'visible' : ''}`}
              style={{
                textAlign: 'center',
                padding: '0 60px',
                // Dividers between stats
                borderRight: i < STATS_BAR.length - 1
                  ? '1px solid rgba(107,36,32,0.35)'
                  : 'none',
                animationDelay: `${0.3 + i * 0.1}s`,
              }}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 700, lineHeight: 1,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #A44200, #D58936)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 10,
              }}>
                {s.value}
              </div>
              {/* Label — bumped to creamMute for legibility from review */}
              <div style={{
                fontSize: 12, color: '#8A8A45',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500, letterSpacing: '0.02em',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

// SVG check — filled amber circle with white tick
function CheckIcon({ dim = false }: { dim?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="10" cy="10" r="10"
        fill={dim ? 'rgba(107,36,32,0.35)' : 'rgba(164,66,0,0.30)'}/>
      <polyline points="5.5,10 8.5,13 14.5,7"
        stroke={dim ? '#6B2420' : '#D58936'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

// SVG cross — subtle rust circle with ×
function CrossIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="10" cy="10" r="10" fill="rgba(60,21,24,0.50)"/>
      <line x1="7" y1="7" x2="13" y2="13"
        stroke="#4A1A1C" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="13" y1="7" x2="7" y2="13"
        stroke="#4A1A1C" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// Feature row
function FeatureRow({ text, included, dim = false }: { text: string; included: boolean; dim?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 0' }}>
      {included ? <CheckIcon dim={dim} /> : <CrossIcon />}
      <span style={{
        fontSize: 13, lineHeight: 1.5,
        color: included
          ? (dim ? '#8A8A45' : '#C8C97A')
          : '#4A1A1C',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: included ? 500 : 400,
        textDecoration: included ? 'none' : 'none',
      }}>
        {text}
      </span>
    </div>
  )
}

// Trust bar items — SVG icons replacing emojis
const TRUST_ITEMS = [
  {
    label: 'End-to-end encrypted',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="#6B2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    label: 'No ads, ever',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="#6B2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
  },
  {
    label: 'Export your data anytime',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="#6B2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    label: 'Cancel anytime',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="#6B2420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
]

// Tier data
const TIERS = {
  spark: {
    features: [
      { text: 'Daily energy check-in',     included: true  },
      { text: 'Brain Dump (50 captures/mo)',included: true  },
      { text: '7-day mood history',         included: true  },
      { text: 'Up to 10 active tasks',      included: true  },
      { text: 'Inner Council (1 voice)',    included: true  },
      { text: 'Energy-aware task engine',  included: false },
      { text: 'Full mood pattern analysis',included: false },
      { text: 'Unlimited captures & tasks',included: false },
      { text: 'Data export',               included: false },
    ],
  },
  flow: {
    features: [
      { text: 'Everything in Spark',              included: true  },
      { text: 'Unlimited captures & tasks',       included: true  },
      { text: 'Full Inner Council (5 AI voices)', included: true  },
      { text: '90-day mood tracking & patterns',  included: true  },
      { text: 'Energy-aware task engine',         included: true  },
      { text: 'Weekly insight reports',           included: true  },
      { text: 'Dark mode & custom themes',        included: true  },
      { text: 'Data export (PDF, CSV)',           included: true  },
      { text: 'Priority support',                 included: false },
    ],
  },
  radiant: {
    features: [
      { text: 'Everything in Flow',           included: true },
      { text: 'Custom AI voice personas',     included: true },
      { text: 'Team energy spaces',           included: true },
      { text: 'Shared projects & tasks',      included: true },
      { text: 'Team pattern analytics',       included: true },
      { text: 'Priority & dedicated support', included: true },
      { text: 'API access',                   included: true },
      { text: 'Custom onboarding',            included: true },
      { text: 'SSO & enterprise security',    included: true },
    ],
  },
}

function PricingSection() {
  const { ref, visible } = useInView(0.10)
  const [annual, setAnnual]   = useState(false)
  const [priceKey, setPriceKey] = useState(0)

  function toggleBilling() {
    setAnnual(a => !a)
    setPriceKey(k => k + 1)
  }

  // Prices
  const flowMonthly    = 12,  flowAnnual    = 9
  const radiantMonthly = 28,  radiantAnnual = 22

  const flowPrice    = annual ? flowAnnual    : flowMonthly
  const radiantPrice = annual ? radiantAnnual : radiantMonthly

  const flowBilled    = annual ? `Billed $${flowAnnual * 12}/yr — save $${(flowMonthly - flowAnnual) * 12}` : null
  const radiantBilled = annual ? `Billed $${radiantAnnual * 12}/yr — save $${(radiantMonthly - radiantAnnual) * 12}` : null

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #3C1518 0%, #2E1012 40%, #321214 100%)',
        overflow: 'hidden',
        padding: '120px 48px 140px',
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(164,66,0,0.07) 0%, transparent 65%)',
      }} />

      <div
        ref={ref}
        style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >

        {/* ── Header ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{
            display: 'inline-block', marginBottom: 24,
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.14)',
            border: '1px solid rgba(164,66,0,0.30)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Simple Pricing
          </span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(40px, 4.8vw, 64px)',
            fontWeight: 700, lineHeight: 1.06,
            letterSpacing: '-0.015em',
            color: '#F2F3AE', marginBottom: 16,
          }}>
            Choose your{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200, #D58936)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              operating mode
            </span>
          </h2>

          <p style={{
            fontSize: 15, color: '#8A8A45',
            fontFamily: "'Nunito', sans-serif",
          }}>
            No hidden fees. No data selling. Cancel anytime.
          </p>
        </div>

        {/* ── Billing toggle ── */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 14,
            marginBottom: 52, animationDelay: '0.1s',
          }}
        >
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: !annual ? '#C8C97A' : '#6B2420',
            fontFamily: "'Nunito', sans-serif",
            transition: 'color 0.3s ease',
          }}>
            Monthly
          </span>

          {/* Toggle */}
          <div
            className={`pricing-toggle-track ${annual ? 'on' : ''}`}
            onClick={toggleBilling}
            role="switch"
            aria-checked={annual}
          >
            <div className={`pricing-toggle-thumb ${annual ? 'on' : ''}`} />
          </div>

          <span style={{
            fontSize: 14, fontWeight: 600,
            color: annual ? '#C8C97A' : '#6B2420',
            fontFamily: "'Nunito', sans-serif",
            transition: 'color 0.3s ease',
          }}>
            Annual
          </span>

          {/* Save 25% badge — animates in only when annual active */}
          {annual && (
            <span
              className="save-badge-pop"
              style={{
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(164,66,0,0.20)',
                border: '1px solid rgba(164,66,0,0.40)',
                fontSize: 11, fontWeight: 800,
                color: '#D58936', letterSpacing: '0.06em',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Save 25%
            </span>
          )}
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.12fr 1fr',
          gap: 20,
          alignItems: 'start',
        }}>

          {/* ════ SPARK ════ */}
          {/* Hairline gradient border wrap from review */}
          <div
            className={`spark-card-wrap pricing-card-enter pc-1 ${visible ? 'visible' : ''}`}
          >
            <div style={{
              borderRadius: 19,
              background: 'linear-gradient(160deg, rgba(52,16,18,0.95), rgba(40,12,14,0.98))',
              padding: '28px 24px 24px',
            }}>
              {/* Tier label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'rgba(164,66,0,0.60)',
                  boxShadow: '0 0 6px rgba(164,66,0,0.40)',
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#8A8A45', fontFamily: "'Nunito', sans-serif",
                }}>
                  Spark
                </span>
              </div>

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 32, fontWeight: 700,
                color: '#F2F3AE', marginBottom: 4,
                letterSpacing: '-0.01em',
              }}>
                Spark
              </h3>
              <p style={{ fontSize: 12, color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginBottom: 24 }}>
                Begin your practice
              </p>

              {/* Price */}
              <div style={{ marginBottom: 6 }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 52, fontWeight: 700,
                  color: '#F2F3AE', lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  Free
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginBottom: 28 }}>
                Forever free, no card needed
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(107,36,32,0.35)', marginBottom: 20 }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
                {TIERS.spark.features.map((f, i) => (
                  <FeatureRow key={i} text={f.text} included={f.included} />
                ))}
              </div>

              {/* CTA */}
              <button style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: 'transparent',
                border: '1.5px solid rgba(107,36,32,0.55)',
                color: '#D58936',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(164,66,0,0.55)'
                  el.style.background = 'rgba(164,66,0,0.08)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(107,36,32,0.55)'
                  el.style.background = 'transparent'
                }}
              >
                Start for Free
              </button>
            </div>
          </div>

          {/* ════ FLOW — featured ════ */}
          <div style={{ position: 'relative', marginTop: -16 }}>
            {/* Most Popular badge — refined pill from review */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div className="most-popular-badge">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="#D58936">
                  <polygon points="10 2 12.55 7.18 18 8.01 14 11.9 14.9 17.32 10 14.68 5.1 17.32 6 11.9 2 8.01 7.45 7.18 10 2"/>
                </svg>
                Most Popular
              </div>
            </div>

            {/* Animated gradient border wrap */}
            <div
              className={`flow-card-wrap pricing-card-enter pc-2 ${visible ? 'visible' : ''}`}
            >
              <div style={{
                borderRadius: 20,
                background: 'linear-gradient(160deg, rgba(58,18,20,0.97), rgba(38,10,12,0.99))',
                padding: '28px 24px 24px',
              }}>
                {/* Tier label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#D58936',
                    boxShadow: '0 0 8px #D5893680',
                    animation: 'glowPulse 2.8s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    color: '#D58936', fontFamily: "'Nunito', sans-serif",
                  }}>
                    Flow
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32, fontWeight: 700,
                  color: '#F2F3AE', marginBottom: 4,
                  letterSpacing: '-0.01em',
                }}>
                  Flow
                </h3>
                <p style={{ fontSize: 12, color: '#8A8A45', fontFamily: "'Nunito', sans-serif", marginBottom: 24 }}>
                  Your full operating system
                </p>

                {/* Price — animates on toggle */}
                <div key={`flow-price-${priceKey}`} className="price-val-in" style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <span style={{
                      fontSize: 24, fontWeight: 700,
                      color: '#C8C97A', fontFamily: "'Cormorant Garamond', serif",
                      marginTop: 8, lineHeight: 1,
                    }}>$</span>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 60, fontWeight: 700,
                      background: 'linear-gradient(135deg, #D58936, #F2F3AE)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1, letterSpacing: '-0.03em',
                    }}>
                      {flowPrice}
                    </span>
                    <span style={{
                      fontSize: 14, color: '#6B2420',
                      fontFamily: "'Nunito', sans-serif",
                      marginTop: 'auto', paddingBottom: 8,
                    }}>/mo</span>
                  </div>
                  {flowBilled && (
                    <p style={{
                      fontSize: 11, color: '#8A8A45',
                      fontFamily: "'Nunito', sans-serif", marginTop: 4,
                    }}>
                      {flowBilled}
                    </p>
                  )}
                </div>

                <div style={{ height: 1, background: 'rgba(107,36,32,0.35)', margin: '20px 0' }} />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
                  {TIERS.flow.features.map((f, i) => (
                    <FeatureRow key={i} text={f.text} included={f.included} />
                  ))}
                </div>

                {/* CTA — full amber gradient */}
                <button style={{
                  width: '100%', padding: '15px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #A44200, #C05020 50%, #D58936)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 15, fontWeight: 800, color: '#F2F3AE',
                  letterSpacing: '0.02em',
                  boxShadow: '0 0 28px #A4420050, 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,243,174,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(-1px)'
                    el.style.boxShadow = '0 0 44px #A4420068, 0 6px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(242,243,174,0.18)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 0 28px #A4420050, 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,243,174,0.15)'
                  }}
                >
                  Start 14-Day Trial
                </button>

              </div>
            </div>
          </div>

          {/* ════ RADIANT ════ */}
          <div
            className={`pricing-card-enter pc-3 ${visible ? 'visible' : ''}`}
            style={{
              borderRadius: 20,
              background: 'linear-gradient(160deg, rgba(52,16,18,0.95), rgba(40,12,14,0.98))',
              border: '1px solid rgba(107,36,32,0.45)',
              padding: '28px 24px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(242,243,174,0.04)',
            }}
          >
            {/* Tier label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'rgba(201,168,245,0.70)',
                boxShadow: '0 0 6px rgba(201,168,245,0.40)',
              }} />
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: '#8A8A45', fontFamily: "'Nunito', sans-serif",
              }}>
                Radiant
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32, fontWeight: 700,
              color: '#F2F3AE', marginBottom: 4,
              letterSpacing: '-0.01em',
            }}>
              Radiant
            </h3>
            <p style={{ fontSize: 12, color: '#6B2420', fontFamily: "'Nunito', sans-serif", marginBottom: 24 }}>
              For teams in flow
            </p>

            {/* Price */}
            <div key={`radiant-price-${priceKey}`} className="price-val-in" style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <span style={{
                  fontSize: 24, fontWeight: 700,
                  color: '#C8C97A', fontFamily: "'Cormorant Garamond', serif",
                  marginTop: 8, lineHeight: 1,
                }}>$</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 60, fontWeight: 700,
                  color: '#F2F3AE',
                  lineHeight: 1, letterSpacing: '-0.03em',
                }}>
                  {radiantPrice}
                </span>
                <span style={{
                  fontSize: 14, color: '#6B2420',
                  fontFamily: "'Nunito', sans-serif",
                  marginTop: 'auto', paddingBottom: 8,
                }}>/mo</span>
              </div>
              {radiantBilled && (
                <p style={{
                  fontSize: 11, color: '#8A8A45',
                  fontFamily: "'Nunito', sans-serif", marginTop: 4,
                }}>
                  {radiantBilled}
                </p>
              )}
            </div>

            <div style={{ height: 1, background: 'rgba(107,36,32,0.35)', margin: '20px 0' }} />

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
              {TIERS.radiant.features.map((f, i) => (
                <FeatureRow key={i} text={f.text} included={f.included} />
              ))}
            </div>

            {/* CTA — more visible ghost button from review */}
            <button className="radiant-btn">
              Talk to Us
            </button>

          </div>

        </div>
        {/* end cards grid */}

        {/* ── Trust bar ── */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 48, flexWrap: 'wrap' as const,
          marginTop: 60,
          paddingTop: 40,
          borderTop: '1px solid rgba(107,36,32,0.25)',
        }}>
          {TRUST_ITEMS.map((t, i) => (
            <div
              key={t.label}
              className={`trust-enter tr-${i + 1} ${visible ? 'visible' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
            >
              {t.icon}
              <span style={{
                fontSize: 12, color: '#6B2420',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500,
              }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Closing CTA Section ──────────────────────────────────────────────────────

// Ember particles — 14 unique dots at varied positions, sizes, opacities, timings
const EMBERS = [
  { left: '12%', top: '70%', size: 2.5, opacity: 0.18, anim: 'emberRise1', dur: '7.2s', delay: '0.0s', dx: '-8px'  },
  { left: '23%', top: '60%', size: 1.5, opacity: 0.12, anim: 'emberRise2', dur: '9.0s', delay: '1.4s', dx:  '6px'  },
  { left: '35%', top: '75%', size: 2.0, opacity: 0.15, anim: 'emberRise3', dur: '6.8s', delay: '3.1s', dx: '-4px'  },
  { left: '42%', top: '65%', size: 1.5, opacity: 0.10, anim: 'emberRise1', dur: '8.4s', delay: '5.2s', dx:  '10px' },
  { left: '50%', top: '72%', size: 2.0, opacity: 0.14, anim: 'emberRise2', dur: '7.6s', delay: '0.8s', dx: '-6px'  },
  { left: '58%', top: '68%', size: 1.5, opacity: 0.11, anim: 'emberRise3', dur: '10.0s',delay: '2.6s', dx:  '8px'  },
  { left: '66%', top: '74%', size: 2.5, opacity: 0.16, anim: 'emberRise1', dur: '8.0s', delay: '4.0s', dx: '-10px' },
  { left: '74%', top: '62%', size: 1.5, opacity: 0.10, anim: 'emberRise2', dur: '9.4s', delay: '1.8s', dx:  '5px'  },
  { left: '82%', top: '70%', size: 2.0, opacity: 0.13, anim: 'emberRise3', dur: '7.0s', delay: '6.5s', dx: '-7px'  },
  { left: '18%', top: '50%', size: 1.5, opacity: 0.09, anim: 'emberRise1', dur: '11.0s',delay: '7.0s', dx:  '4px'  },
  { left: '30%', top: '55%', size: 2.0, opacity: 0.12, anim: 'emberRise2', dur: '8.8s', delay: '3.8s', dx: '-5px'  },
  { left: '55%', top: '58%', size: 1.5, opacity: 0.10, anim: 'emberRise1', dur: '9.6s', delay: '5.8s', dx:  '9px'  },
  { left: '70%', top: '52%', size: 2.0, opacity: 0.11, anim: 'emberRise3', dur: '7.4s', delay: '2.2s', dx: '-8px'  },
  { left: '88%', top: '60%', size: 1.5, opacity: 0.09, anim: 'emberRise2', dur: '10.4s',delay: '4.6s', dx:  '6px'  },
]

// Feature chips — matching premium SVG icons from rest of page
const CTA_CHIPS = [
  {
    label: 'Energy Check-in',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    label: 'Inner Council',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Mood Tracking',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Brain Dump',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 3.18-1.65 5.97-4.13 7.59L17 21H7l.13-2.41A9 9 0 0 1 12 2z"/>
        <line x1="9" y1="21" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    label: 'Smart Tasks',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
]

function ClosingCTASection() {
  const { ref, visible } = useInView(0.12)

  return (
    <section
      style={{
        position: 'relative',
        // Deepest dark on the page — arriving somewhere quiet
        background: 'linear-gradient(180deg, #3C1518 0%, #1E080A 40%, #160608 100%)',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 48px 0',
      }}
    >
      {/* Top separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(107,36,32,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Deep amber radial — the ember heart of the section */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        width: 800, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(164,66,0,0.16) 0%, rgba(100,30,0,0.08) 40%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Secondary soft glow — right side */}
      <div style={{
        position: 'absolute',
        top: '30%', right: '-5%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(164,66,0,0.06) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Ember particles — living, meditative quality ── */}
      {EMBERS.map((e, i) => (
        <div
          key={i}
          className="ember"
          style={{
            left: e.left,
            top: e.top,
            width: e.size,
            height: e.size,
            ['--ember-opacity' as string]: e.opacity,
            ['--ember-dx' as string]: e.dx,
            animation: `${e.anim} ${e.dur} ease-in-out ${e.delay} infinite`,
            zIndex: 1,
          } as React.CSSProperties}
        />
      ))}

      {/* Grain texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        backgroundSize: '200px 200px',
        opacity: 0.025,
      }} />

      {/* ── Main content ── */}
      <div
        ref={ref}
        style={{
          position: 'relative', zIndex: 2,
          maxWidth: 700, width: '100%',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
        }}
      >

        {/* Pill badge — refined transparent style from review */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ marginBottom: 32 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '6px 18px', borderRadius: 20,
            background: 'rgba(164,66,0,0.12)',
            border: '1px solid rgba(164,66,0,0.28)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: '#D58936',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Begin Your Journey
          </span>
        </div>

        {/* Headline — two-line stagger */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(44px, 5.5vw, 72px)',
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 28,
          }}
        >
          <span
            style={{
              display: 'block', color: '#F2F3AE',
              opacity: visible ? 1 : 0,
              animation: visible ? 'ctaLine1 0.75s cubic-bezier(0.16,1,0.3,1) 0.1s both' : 'none',
            }}
          >
            Your mind deserves a
          </span>
          <span
            style={{
              display: 'block', fontStyle: 'italic',
              background: 'linear-gradient(135deg, #A44200 0%, #D58936 50%, #F2F3AE 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: visible ? 1 : 0,
              animation: visible ? 'ctaLine2 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s both' : 'none',
            }}
          >
            better operating system.
          </span>
        </h2>

        {/* Body — fixed max-width so no orphan line from review */}
        <p
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            fontSize: 16, color: '#8A8A45', lineHeight: 1.75,
            maxWidth: 420,              // prevents the short orphan third line
            fontFamily: "'Nunito', sans-serif",
            marginBottom: 44,
            animationDelay: '0.3s',
          }}
        >
          FlowSpace adapts to you — your energy, your rhythm, your mind.
          Start working in harmony with yourself, not against yourself.
        </p>

        {/* CTA button */}
        <div
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{ marginBottom: 18, animationDelay: '0.4s' }}
        >
          <Link href="/auth" className="cta-enter-btn">
            Enter FlowSpace
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Sub-reassurance */}
        <p
          className={`hiw-reveal ${visible ? 'visible' : ''}`}
          style={{
            fontSize: 12, color: '#4A1A1C',
            fontFamily: "'Nunito', sans-serif",
            letterSpacing: '0.04em',
            marginBottom: 52,
            animationDelay: '0.5s',
          }}
        >
          No ads. No noise. Private by design.
        </p>

        {/* Feature chips — fan in with stagger */}
        <div
          style={{
            display: 'flex', flexWrap: 'wrap' as const,
            justifyContent: 'center', gap: 10,
            marginBottom: 0,
          }}
        >
          {CTA_CHIPS.map((chip, i) => (
            <div
              key={chip.label}
              className="cta-chip"
              style={{
                opacity: visible ? 1 : 0,
                animation: visible
                  ? `chipFanIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.08}s both`
                  : 'none',
              }}
            >
              <span style={{ color: '#6B2420', display: 'flex', alignItems: 'center' }}>
                {chip.icon}
              </span>
              {chip.label}
            </div>
          ))}
        </div>

      </div>
      {/* end main content */}

      {/* ── Footer ── */}
      <footer
        style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 1100,
          margin: '80px auto 0',
          padding: '28px 48px',
          borderTop: '1px solid rgba(107,36,32,0.20)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          opacity: visible ? 1 : 0,
          animation: visible ? 'footerFade 0.7s ease 0.8s both' : 'none',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: 'linear-gradient(135deg, #A44200, #D58936)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 8px #A4420030',
          }}>
            <Flame size={10} color="#F2F3AE" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14, fontWeight: 700, color: '#6B2420',
            letterSpacing: '-0.01em',
          }}>
            © 2026 FlowSpace
          </span>
        </div>

        {/* Footer links */}
        <div style={{ display: 'flex', gap: 32 }}>
          {['Privacy', 'Terms', 'Security'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                fontSize: 12, color: '#4A1A1C',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 500, textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#8A8A45')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A1A1C')}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

    </section>
  )
}

