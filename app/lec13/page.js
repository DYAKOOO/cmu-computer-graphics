'use client'
const ACCENT = '#c084fc'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
export default function Lec13Index() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lecture 13: Spatial Data Structures</h1>
      <p style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '2rem' }}>lectures/cg-13-lecture-quiz.md · 51 questions · 2 parts</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      
      <a href={`${BASE}/lec13/1`} style={{ display: 'block', background: '#1e293b', border: `2px solid ${ACCENT}`, borderRadius: '10px', padding: '1.25rem 2rem', textDecoration: 'none', textAlign: 'center' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        <div style={{ color: ACCENT, fontWeight: 700 }}>Part 1</div>
      </a>
      <a href={`${BASE}/lec13/2`} style={{ display: 'block', background: '#1e293b', border: `2px solid ${ACCENT}`, borderRadius: '10px', padding: '1.25rem 2rem', textDecoration: 'none', textAlign: 'center' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        <div style={{ color: ACCENT, fontWeight: 700 }}>Part 2</div>
      </a>
      </div>
      <a href={`${BASE}/`} style={{ marginTop: '2rem', color: '#475569', fontSize: '0.875rem' }}>← All quizzes</a>
    </div>
  )
}
