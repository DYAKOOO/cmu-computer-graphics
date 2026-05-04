'use client'
import { useState, useEffect } from 'react'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const quizzes = [
  { id: 'lec2',  title: 'Lecture 2: Linear Algebra',               description: 'Vectors, linear maps, inner products, Gram-Schmidt, Fourier',                color: '#818cf8', href: `${BASE}/lec2`  },
  { id: 'lec3',  title: 'Lecture 3: Vector Calculus',              description: 'Gradient, divergence, curl, Laplacian, Hessian',                            color: '#38bdf8', href: `${BASE}/lec3`  },
  { id: 'lec4',  title: 'Lecture 4: Rasterization & Sampling',     description: 'Pipeline, coverage, aliasing, SSAA, point-in-triangle',                    color: '#34d399', href: `${BASE}/lec4`  },
  { id: 'lec5',  title: 'Lecture 5: Spatial Transformations',       description: 'Linear maps, homogeneous coords, rotation, scaling, translation, affine transforms',color: '#f59e0b', href: `${BASE}/lec5`  },
  { id: 'lec6',  title: 'Lecture 6: 3D Rotations',                 description: 'Euler angles, rotation matrices, quaternions, exponential maps',            color: '#f472b6', href: `${BASE}/lec6`  },
  { id: 'lec7',  title: 'Lecture 7: Texture Mapping',              description: 'UV mapping, mipmaps, filtering, environment maps, bump mapping',            color: '#a3e635', href: `${BASE}/lec7`  },
  { id: 'lec8',  title: 'Lecture 8: Depth & Transparency',         description: 'Z-buffer, painter\'s algorithm, alpha blending, order-independent',         color: '#67e8f9', href: `${BASE}/lec8`  },
  { id: 'lec9',  title: 'Lecture 9: Introduction to Geometry',     description: 'Implicit/explicit surfaces, point clouds, splines, level sets',             color: '#fbbf24', href: `${BASE}/lec9`  },
  { id: 'lec10', title: 'Lecture 10: Meshes & Manifolds',          description: 'Manifold surfaces, halfedge data structure, mesh connectivity',             color: '#fb923c', href: `${BASE}/lec10` },
  { id: 'lec11', title: 'Lecture 11: Geometry Processing',         description: 'Smoothing, subdivision, remeshing, simplification, Catmull-Clark',          color: '#e879f9', href: `${BASE}/lec11` },
  { id: 'lec12', title: 'Lecture 12: Geometric Queries',           description: 'BVH, ray-triangle intersection, closest point, inside-outside tests',       color: '#22d3ee', href: `${BASE}/lec12` },
  { id: 'lec13', title: 'Lecture 13: Spatial Data Structures',     description: 'BVH, KD-trees, octrees, uniform grids, spatial hashing',                   color: '#c084fc', href: `${BASE}/lec13` },
  { id: 'lec14', title: 'Lecture 14: Color',                       description: 'Radiometry, color spaces, tone mapping, gamma correction',                  color: '#f97316', href: `${BASE}/lec14` },
  { id: 'lec15', title: 'Lecture 15: Radiometry',                  description: 'Radiance, irradiance, BRDFs, rendering equation basics',                   color: '#facc15', href: `${BASE}/lec15` },
  { id: 'lec16', title: 'Lecture 16: The Rendering Equation',      description: 'Light transport, global illumination, Monte Carlo basics',                  color: '#4ade80', href: `${BASE}/lec16` },
  { id: 'lec17', title: 'Lecture 17: Numerical Integration',       description: 'Quadrature, Monte Carlo integration, importance sampling',                  color: '#818cf8', href: `${BASE}/lec17` },
  { id: 'lec18', title: 'Lecture 18: Monte Carlo Ray Tracing',     description: 'Path tracing, direct/indirect lighting, BRDF sampling',                    color: '#fb7185', href: `${BASE}/lec18` },
  { id: 'lec19', title: 'Lecture 19: Variance Reduction',          description: 'Stratified sampling, MIS, next-event estimation, photon mapping',           color: '#2dd4bf', href: `${BASE}/lec19` },
  { id: 'lec20', title: 'Lecture 20: Introduction to Animation',   description: 'Keyframing, splines, Hermite/Catmull-Rom/B-splines, skeletal animation, IK',color: '#34d399', href: `${BASE}/lec20` },
  { id: 'lec21', title: 'Lecture 21: Dynamics & Time Integration', description: 'ODEs, Lagrangian mechanics, Forward/Backward/Symplectic Euler, particle systems', color: '#a78bfa', href: `${BASE}/lec21` },
  { id: 'lec22', title: 'Lecture 22: Introduction to Optimization',description: "Gradient descent, Newton's method, convex opt, inverse kinematics",         color: '#f59e0b', href: `${BASE}/lec22` },
  { id: 'lec23', title: 'Lecture 23: PDEs & Physical Animation',   description: 'Elliptic/Parabolic/Hyperbolic PDEs, Laplacian, Wave/Heat equations',        color: '#f87171', href: `${BASE}/lec23` },
]

// Build a map from lec id → title for the export formatter
const lectureMap = {}
quizzes.forEach(q => { lectureMap[q.id] = q.title })

function buildExport() {
  const lines = [`=== Quiz Notes Export — ${new Date().toLocaleDateString()} ===`, '']

  const allNotes = {}, allText = {}, allHist = {}

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      const nm = key.match(/^quiz_(lec\d+)_notes$/)
      const tm = key.match(/^quiz_(lec\d+)_text$/)
      const hm = key.match(/^quiz_(lec\d+)_hist$/)
      if (nm) try { allNotes[nm[1]] = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
      if (tm) try { allText[tm[1]]  = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
      if (hm) try { allHist[hm[1]] = JSON.parse(localStorage.getItem(key) || '[]') } catch {}
    }
  } catch { return null }

  const lecs = [...new Set([
    ...Object.keys(allNotes),
    ...Object.keys(allText),
    ...Object.keys(allHist),
  ])].sort((a, b) => {
    const na = parseInt(a.replace('lec',''))
    const nb = parseInt(b.replace('lec',''))
    return na - nb
  })

  if (lecs.length === 0) return null

  for (const lec of lecs) {
    const title = lectureMap[lec] || lec
    lines.push(`${'─'.repeat(50)}`)
    lines.push(title)
    lines.push(`${'─'.repeat(50)}`)

    // Score history
    const hist = allHist[lec] || []
    if (hist.length) {
      lines.push('Score history:')
      hist.forEach(h => lines.push(`  ${h.date}  ${h.pct}%  (${h.score} correct)`))
      lines.push('')
    }

    // Notes + written answers, grouped by question ID
    const notes = allNotes[lec] || {}
    const text  = allText[lec]  || {}
    const qids  = [...new Set([...Object.keys(notes), ...Object.keys(text)])]
      .sort((a, b) => {
        // Sort QF1 before Q1, then numerically
        const toNum = s => {
          const m = s.match(/QF?(\d+)/)
          return m ? (s.startsWith('QF') ? -1000 + parseInt(m[1]) : parseInt(m[1])) : 9999
        }
        return toNum(a) - toNum(b)
      })

    if (qids.length === 0) {
      lines.push('(no notes yet)')
    }

    for (const qid of qids) {
      const ta = text[qid]?.trim()
      const n  = notes[qid]?.trim()
      if (!ta && !n) continue
      lines.push(`[${qid}]`)
      if (ta) { lines.push('  Written answer:'); ta.split('\n').forEach(l => lines.push('  ' + l)) }
      if (n)  { lines.push('  Notes:');          n.split('\n').forEach(l => lines.push('  ' + l))  }
      lines.push('')
    }

    lines.push('')
  }

  return lines.join('\n').trim()
}

function ExportModal({ onClose }) {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setText(buildExport() || '(No notes or written answers saved yet.)')
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: select the textarea so user can copy manually
      document.getElementById('export-ta')?.select()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: '#111118', border: '1px solid #2a2a3a', borderRadius: '16px',
        padding: '1.5rem', width: '100%', maxWidth: '700px', maxHeight: '85vh',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 700 }}>
            Export Notes
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
          }}>✕</button>
        </div>

        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
          Copy this and paste it into Claude. Includes your written answers, notes, and score history.
        </p>

        <textarea
          id="export-ta"
          readOnly
          value={text}
          style={{
            flex: 1, minHeight: '300px', background: '#0a0a0f',
            border: '1px solid #2a2a3a', borderRadius: '8px',
            color: '#e2e8f0', fontSize: '0.82rem', fontFamily: 'monospace',
            padding: '0.75rem', resize: 'none', lineHeight: 1.6,
            outline: 'none',
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={copy} style={{
            flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
            background: copied ? '#10b981' : '#fb923c', color: '#0a0a0f',
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s',
          }}>
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button onClick={onClose} style={{
            padding: '0.75rem 1.25rem', borderRadius: '8px',
            border: '1px solid #2a2a3a', background: 'none',
            color: '#94a3b8', fontSize: '1rem', cursor: 'pointer',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [showExport, setShowExport] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}

      <h1 style={{ color: '#f1f5f9', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        CMU 15-462 Quizzes
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1rem' }}>
        Computer Graphics — Interactive Study Quizzes
      </p>

      <button
        onClick={() => setShowExport(true)}
        style={{
          marginBottom: '2.5rem',
          padding: '0.6rem 1.4rem',
          borderRadius: '8px',
          border: '1px solid #334155',
          background: '#1e293b',
          color: '#94a3b8',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        ✏️ Export my notes &amp; answers
      </button>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px' }}>
        {quizzes.map(q => (
          <a
            key={q.id}
            href={q.href}
            style={{
              display: 'block',
              width: '260px',
              background: '#1e293b',
              border: `2px solid ${q.color}33`,
              borderRadius: '12px',
              padding: '1.75rem',
              textDecoration: 'none',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = q.color
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${q.color}33`
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px',
              background: `${q.color}22`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <div style={{ width: '20px', height: '20px', background: q.color, borderRadius: '4px' }} />
            </div>
            <h2 style={{ color: q.color, fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
              {q.title}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              {q.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
