import React, { useState, useEffect } from 'react'

export default function TransitionOverlay({ isActive, duration = 3500, onComplete }) {
  const [opacity, setOpacity] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [phase, setPhase] = useState('fadeIn')

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      setPhase('fadeIn')
      setOpacity(1)
      setPhase('active')
      
      setTimeout(() => {
        setPhase('fadeOut')
        setOpacity(0)
      }, duration - 1200)
      
      setTimeout(() => {
        setIsVisible(false)
        setPhase('fadeIn')
        if (onComplete) {
          onComplete()
        }
      }, duration - 400)
    }
  }, [isActive, duration])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(0,20,50,0.95) 0%, rgba(0,0,0,0.98) 50%, rgba(0,0,0,1) 100%)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: opacity,
      transition: phase === 'fadeIn' ? 'opacity 0.8s ease-in' : 
                 phase === 'fadeOut' ? 'opacity 1.2s ease-out' : 
                 'opacity 0.2s ease-in-out',
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      
      {/* Lignes de vitesse supersonique */}
      {Array.from({ length: 100 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${50 + Math.random() * 200}px`,
            backgroundImage: `linear-gradient(180deg, 
              transparent 0%, 
              rgba(100, 200, 255, ${0.3 + Math.random() * 0.7}) 50%, 
              transparent 100%)`,
            animation: `hyperSpeed ${0.5 + Math.random() * 1}s linear infinite`,
            transform: `rotate(${-10 + Math.random() * 20}deg)`,
            transformOrigin: 'center top'
          }}
        />
      ))}
      
      {/* Étoiles qui filent */}
      {Array.from({ length: 50 }, (_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            animation: `starTrail ${0.3 + Math.random() * 0.8}s linear infinite`,
            boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(255,255,255,0.8)`
          }}
        />
      ))}

      {/* Interface de vaisseau */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        color: 'white',
        textAlign: 'center',
        zIndex: 10
      }}>
        
        {/* Cockpit du vaisseau */}
        <div style={{
          width: '120px',
          height: '120px',
          border: '3px solid #64c8ff',
          borderRadius: '50%',
          backgroundImage: 'radial-gradient(circle, rgba(100,200,255,0.1) 0%, rgba(0,20,50,0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          animation: 'hyperGlow 0.5s infinite alternate',
          boxShadow: '0 0 30px rgba(100,200,255,0.6), inset 0 0 20px rgba(100,200,255,0.2)'
        }}>
          
          {/* Réacteurs du vaisseau */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '20%',
            width: '8px',
            height: '40px',
            backgroundImage: 'linear-gradient(180deg, #64c8ff, transparent)',
            animation: 'reactor 0.3s infinite alternate'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            right: '20%',
            width: '8px',
            height: '40px',
            backgroundImage: 'linear-gradient(180deg, #ec4899, transparent)',
            animation: 'reactor 0.3s infinite alternate reverse'
          }} />
          
          <div style={{
            fontSize: '32px',
            filter: 'drop-shadow(0 0 10px #64c8ff)'
          }}>
            ⚡
          </div>
        </div>

        {/* Console de bord */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(100,200,255,0.3)',
          borderRadius: '10px',
          padding: '20px',
          minWidth: '300px',
          boxShadow: 'inset 0 0 20px rgba(100,200,255,0.1)'
        }}>
          
          {/* Texte principal */}
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #64c8ff, #ffffff, #64c8ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: 'hyperTextGlow 0.5s infinite',
            marginBottom: '10px'
          }}>
            ⚡ VITESSE SUPERSONIQUE ACTIVÉE
          </div>

          {/* Sous-texte */}
          <div style={{
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            color: '#64c8ff',
            opacity: 0.8,
            marginBottom: '15px'
          }}>
            🌟 Traversée de l'espace-temps en cours
          </div>

          {/* Indicateurs de vaisseau */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{ color: '#4ade80', fontSize: '0.8rem' }}>
              ⚡ ÉNERGIE: 99%
            </div>
            <div style={{ color: '#60a5fa', fontSize: '0.8rem' }}>
              🛡️ BOUCLIERS: OK
            </div>
            <div style={{ color: '#f472b6', fontSize: '0.8rem' }}>
              📡 NAVIGATION: ACTIF
            </div>
          </div>

          {/* Barre de progression de voyage */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              backgroundImage: 'linear-gradient(90deg, #64c8ff, #ffffff, #64c8ff)',
              borderRadius: '3px',
              animation: 'hyperProgress 2.5s ease-in-out',
              boxShadow: '0 0 10px #64c8ff'
            }} />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes hyperGlow {
            0% { 
              box-shadow: 0 0 30px rgba(100,200,255,0.6), inset 0 0 20px rgba(100,200,255,0.2);
              transform: scale(1);
            }
            100% { 
              box-shadow: 0 0 50px rgba(100,200,255,0.9), inset 0 0 30px rgba(100,200,255,0.4);
              transform: scale(1.05);
            }
          }
          
          @keyframes reactor {
            0% { height: 40px; opacity: 0.8; }
            100% { height: 60px; opacity: 1; }
          }
          
          @keyframes hyperSpeed {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(5deg); opacity: 0; }
          }
          
          @keyframes starTrail {
            0% { transform: translateY(-100vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) translateX(50px); opacity: 0; }
          }
          
          @keyframes hyperTextGlow {
            0% { 
              filter: brightness(1) drop-shadow(0 0 5px #64c8ff);
              transform: scale(1);
            }
            100% { 
              filter: brightness(1.5) drop-shadow(0 0 15px #64c8ff);
              transform: scale(1.02);
            }
          }
          
          @keyframes hyperProgress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); box-shadow: 0 0 20px #64c8ff; }
          }
        `
      }} />
    </div>
  )
}
