'use client'
const ACCENT = '#22d3ee'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
const parts = [
  { num: 1, range: 'Q1–Q32', href: `${BASE}/lec12/1` },
  { num: 2, range: 'Q33+', href: `${BASE}/lec12/2` },
]
export default function Lec12Index() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 12: Geometric Queries</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '2rem' }}>lectures/cg-12-lecture-quiz.md · questions</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {parts.map(p => (
          <a key={p.num} href={p.href} style={{ display: 'block', background: '#1e293b', border: `2px solid ${ACCENT}33`, borderRadius: '10px', padding: '1.5rem 2rem', textDecoration: 'none', textAlign: 'center', minWidth: '140px' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${ACCENT}33`}>
            <div style={{ color: ACCENT, fontWeight: 700, fontSize: '1.1rem' }}>Part {p.num}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>{p.range}</div>
          </a>
        ))}
      </div>
      <a href={`${BASE}/`} style={{ marginTop: '2rem', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
    </div>
  )
}
