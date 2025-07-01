'use client'

import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import TransitionOverlay from '../components/TransitionOverlay'

export default function LauncherDownloadPage() {
  const [showTransition, setShowTransition] = useState(true)

  useEffect(() => {
    if (!showTransition) return
    const timeout = setTimeout(() => setShowTransition(false), 3500)
    return () => clearTimeout(timeout)
  }, [showTransition])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at 60% 40%, #232946 60%, #18181b 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'inherit',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Transition spatiale immersive */}
      <TransitionOverlay isActive={showTransition} duration={3500} onComplete={() => setShowTransition(false)} />
      {/* Effet d'étoiles de fond */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={120} depth={40} count={4000} factor={12} fade speed={0.7} />
        </Canvas>
      </div>
      {/* Glow central */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b44 60%, #0000 100%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Contenu principal */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: 'linear-gradient(120deg, #232946ee 60%, #18181bee 100%)',
        borderRadius: 28,
        boxShadow: '0 8px 40px #000a, 0 0 0 2px #fbbf2444',
        padding: '48px 38px 38px 38px',
        minWidth: 350,
        maxWidth: 420,
        textAlign: 'center',
        border: '2.5px solid #fbbf24',
        backdropFilter: 'blur(8px)',
        marginTop: 40,
      }}>
        <div style={{
          fontSize: '2.2em',
          fontWeight: 900,
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, #fbbf24 30%, #f59e0b 80%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 2px 16px #fbbf2444, 0 0 1px #fff8',
          filter: 'drop-shadow(0 2px 8px #fbbf2444)',
          marginBottom: 10,
        }}>
          🚀 Launcher Download
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 18, color: '#fbbf24' }}>
          Télécharge tous mes jeux depuis une seule appli !
        </div>
        <div style={{ fontSize: 15, color: '#eee', marginBottom: 24 }}>
          <ul style={{ textAlign: 'left', margin: '0 auto 18px auto', maxWidth: 320, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 8 }}><span style={{ color: '#fbbf24', fontWeight: 700 }}>•</span> Téléchargement automatique des jeux</li>
            <li style={{ marginBottom: 8 }}><span style={{ color: '#fbbf24', fontWeight: 700 }}>•</span> Interface fluide et ergonomique</li>
            <li style={{ marginBottom: 8 }}><span style={{ color: '#fbbf24', fontWeight: 700 }}>•</span> Mises à jour automatiques</li>
            <li><span style={{ color: '#fbbf24', fontWeight: 700 }}>•</span> Lancement direct des jeux installés</li>
          </ul>
        </div>
        <a
          href="https://github.com/EthanCharpentier667/Launcher/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '16px 38px',
            fontSize: 18,
            fontWeight: 800,
            color: '#232946',
            background: 'linear-gradient(90deg, #fbbf24 60%, #f59e0b 100%)',
            borderRadius: 16,
            boxShadow: '0 4px 24px #fbbf2444',
            border: 'none',
            textDecoration: 'none',
            marginTop: 10,
            marginBottom: 8,
            letterSpacing: 1.2,
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Télécharger le Launcher
        </a>
        <div style={{ fontSize: 13, color: '#aaa', marginTop: 18 }}>
          <span style={{ opacity: 0.7 }}>Compatible Windows & Linux & Mac • Open Source</span>
        </div>
      </div>
      {/* Mascotte ou illustration */}
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 40,
        zIndex: 3,
        opacity: 0.85,
        pointerEvents: 'none',
      }}>
        <img src="/images/projects/6.png" alt="Launcher mascot" style={{ width: 120, borderRadius: 18, boxShadow: '0 4px 24px #0006' }} />
      </div>
    </div>
  )
}