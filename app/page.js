'use client'
import { useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
const quizzes = [
  {
    id: 'lec2',
    title: 'Lecture 2: Linear Algebra',
    description: 'Vectors, linear maps, inner products, Gram-Schmidt, Fourier',
    color: '#818cf8',
    href: `${BASE}/lec2`,
  },
  {
    id: 'lec3',
    title: 'Lecture 3: Vector Calculus',
    description: 'Gradient, divergence, curl, Laplacian, Hessian',
    color: '#38bdf8',
    href: `${BASE}/lec3`,
  },
  {
    id: 'lec4',
    title: 'Lecture 4: Rasterization & Sampling',
    description: 'Pipeline, coverage, aliasing, SSAA, point-in-triangle',
    color: '#34d399',
    href: `${BASE}/lec4`,
  },
  {
    id: 'lec10',
    title: 'Lecture 10: Meshes & Manifolds',
    description: 'Manifold surfaces, halfedge data structure, mesh connectivity',
    color: '#fb923c',
    href: `${BASE}/lec10`,
  },
  {
    id: 'lec11',
    title: 'Lecture 11: Geometry Processing',
    description: 'Smoothing, subdivision, remeshing, simplification, Catmull-Clark',
    color: '#e879f9',
    href: `${BASE}/lec11`,
  },
  {
    id: 'lec12',
    title: 'Lecture 12: Geometric Queries',
    description: 'BVH, ray-triangle intersection, closest point, inside-outside tests',
    color: '#22d3ee',
    href: `${BASE}/lec12`,
  },
  {
    id: 'lec20',
    title: 'Lecture 20: Introduction to Animation',
    description: 'Keyframing, splines, Hermite/Catmull-Rom/B-splines, skeletal animation, IK',
    color: '#34d399',
    href: `${BASE}/lec20`,
  },
  {
    id: 'lec21',
    title: 'Lecture 21: Dynamics & Time Integration',
    description: 'ODEs, Lagrangian mechanics, Forward/Backward/Symplectic Euler, particle systems',
    color: '#a78bfa',
    href: `${BASE}/lec21`,
  },
  {
    id: 'lec22',
    title: 'Lecture 22: Introduction to Optimization',
    description: 'Gradient descent, Newton\'s method, convex opt, inverse kinematics',
    color: '#f59e0b',
    href: `${BASE}/lec22`,
  },
  {
    id: 'lec23',
    title: 'Lecture 23: PDEs & Physical Animation',
    description: 'Elliptic/Parabolic/Hyperbolic PDEs, Laplacian, Wave/Heat equations',
    color: '#f87171',
    href: `${BASE}/lec23`,
  },
]

export default function Home() {
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
      <h1 style={{ color: '#f1f5f9', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        CMU 15-462 Quizzes
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1rem' }}>
        Computer Graphics — Interactive Study Quizzes
      </p>
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
