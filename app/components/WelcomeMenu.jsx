import React, { useState } from 'react'

export default function WelcomeMenu({ onStartJourney, onStartTransition, isPreparingTransition }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStart = () => {
    setIsTransitioning(true)
    
    if (onStartTransition) {
      onStartTransition()
    }
    
    setTimeout(() => {
      setIsVisible(false)
      if (onStartJourney) {
        onStartJourney()
      }
    }, 500)
  }

  if (!isVisible) return null

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, rgba(0,10,30,0.9) 0%, rgba(0,0,0,0.95) 70%, rgba(0,0,0,1) 100%)',
        color: 'white',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
        pointerEvents: 'all',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.8s ease-out'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(2px 2px at 20px 30px, #fff, transparent),
            radial-gradient(1px 1px at 40px 70px, #fff, transparent),
            radial-gradient(2px 2px at 80px 10px, #fff, transparent),
            radial-gradient(1px 1px at 100px 50px, #fff, transparent),
            radial-gradient(2px 2px at 150px 80px, #fff, transparent),
            radial-gradient(1px 1px at 200px 20px, #fff, transparent),
            radial-gradient(2px 2px at 250px 60px, #fff, transparent),
            radial-gradient(1px 1px at 300px 90px, #fff, transparent)
          `,
          backgroundSize: '300px 300px',
          animation: 'twinkle 3s infinite alternate',
          opacity: 0.6
        }} />

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes twinkle {
              0% { opacity: 0.3; transform: translateY(0); }
              50% { opacity: 0.8; transform: translateY(-2px); }
              100% { opacity: 0.3; transform: translateY(0); }
            }
            
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes glow {
              0%, 100% { text-shadow: 0 0 20px rgba(100, 200, 255, 0.5); }
              50% { text-shadow: 0 0 30px rgba(100, 200, 255, 0.8), 0 0 40px rgba(100, 200, 255, 0.3); }
            }
            
            @keyframes buttonHover {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            
            @keyframes fadeOutPulse {
              0% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.05); }
              100% { opacity: 0; transform: scale(1.1); }
            }
            
            .transitioning {
              animation: fadeOutPulse 0.8s ease-out forwards;
            }
            
            .welcome-title {
              animation: fadeInUp 1s ease-out, glow 2s infinite;
            }
            
            .welcome-subtitle {
              animation: fadeInUp 1s ease-out 0.3s both;
            }
            
            .welcome-buttons {
              animation: fadeInUp 1s ease-out 0.6s both;
            }
            
            .menu-button {
              transition: all 0.3s ease;
            }
            
            .menu-button:hover {
              animation: buttonHover 0.6s ease infinite;
              box-shadow: 0 10px 30px rgba(100, 200, 255, 0.4);
            }
          `
        }} />

        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          padding: '40px'
        }}>
          {/* Titre principal */}
          <h1 className="welcome-title" style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #64c8ff, #a855f7, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Bienvenue dans mon Univers
          </h1>

          {/* Sous-titre */}
          <h2 className="welcome-subtitle" style={{
            fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
            fontWeight: '300',
            color: '#e2e8f0',
            marginBottom: '15px',
            textShadow: '0 2px 10px rgba(255,255,255,0.2)'
          }}>
            Ethan Charpentier
          </h2>

          {/* Description */}
          <p className="welcome-subtitle" style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: '1.6',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Explorez mon portfolio interactif à travers un système solaire unique.
            Chaque planète révèle mes projets, compétences et expériences.
          </p>

          {/* Boutons d'action */}
          <div className="welcome-buttons" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            <button
              className="menu-button"
              onClick={handleStart}
              style={{
                padding: '15px 40px',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              🚀 Commencer l'Exploration
            </button>
          </div>

          {/* Instructions */}
          <p style={{
            fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
            color: '#64748b',
            marginTop: '40px',
            fontStyle: 'italic'
          }}>
            ✨ Préparez-vous pour un voyage interstellaire épique
          </p>

          {/* Indicateur de progression pendant la préparation */}
          {isPreparingTransition && (
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              color: '#64c8ff',
              fontSize: '1rem',
              fontWeight: 'bold',
              animation: 'fadeInScale 0.5s ease-out'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #3b82f6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(45deg, #64c8ff, #a855f7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 10px rgba(100, 200, 255, 0.5)'
              }}>
                🚀 Préparation du vaisseau...<br />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Initialisation des moteurs supersoniques
                </span>
              </div>
            </div>
          )}

          {/* Indicateur de progression (ancien, maintenant non utilisé) */}
          {!isVisible && !isTransitioning && (
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#64748b',
              fontSize: '0.9rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #3b82f6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Préparation du voyage...
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInScale {
            0% { 
              opacity: 0;
              transform: translateX(-50%) scale(0.8);
            }
            100% { 
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </>
  )
}
