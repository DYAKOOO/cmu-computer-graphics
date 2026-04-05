'use client'
const ACCENT = '#38bdf8'
const parts = [
  { num: 1, range: 'Q1–Q32', href: '/lec3/1' },
  { num: 2, range: 'Q33–Q64', href: '/lec3/2' },
  { num: 3, range: 'Q65–Q70', href: '/lec3/3' },
]
export default function Lec3Index() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 3: Vector Calculus</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '2rem' }}>lectures/cg-03-lecture-quiz.md · 70 questions</p>
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
      <a href='/' style={{ marginTop: '2rem', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
    </div>
  )
}
