'use client'
const ACCENT = '#e879f9'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
export default function Lec11Index() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 11: Geometry Processing</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '2rem' }}>lectures/cg-11-lecture-quiz.md · 27 questions</p>
      <a href={`${BASE}/lec11/1`} style={{ display: 'block', background: '#1e293b', border: `2px solid ${ACCENT}`, borderRadius: '10px', padding: '1.5rem 2.5rem', textDecoration: 'none', textAlign: 'center' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        <div style={{ color: ACCENT, fontWeight: 700, fontSize: '1.1rem' }}>Start Quiz</div>
        <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Q1–Q27</div>
      </a>
      <a href={`${BASE}/`} style={{ marginTop: '2rem', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
    </div>
  )
}
