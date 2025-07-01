import React from 'react'

export default function PortfolioHelpUI() {
  return (
    <>
      {/* Titre du système centré en haut */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '2.1em',
          fontWeight: 900,
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, #60a5fa 30%, #a855f7 80%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 2px 16px #0008, 0 0 1px #fff8',
          filter: 'drop-shadow(0 2px 8px #60a5fa44)',
          padding: '0.15em 1.5em',
          borderRadius: 18,
          pointerEvents: 'auto',
          userSelect: 'text',
        }}>
          Charpentier's System
        </div>
      </div>

      {/* Aide discrète en bas à gauche */}
      <div style={{
        position: 'absolute',
        left: 24,
        bottom: 24,
        zIndex: 1000,
        maxWidth: 320,
        background: 'linear-gradient(120deg, #18181bcc 60%, #27272acc 100%)',
        color: '#fff',
        borderRadius: 14,
        boxShadow: '0 4px 18px #0006',
        padding: '18px 20px 14px 20px',
        fontFamily: 'inherit',
        fontSize: 15,
        border: '1.5px solid #60a5fa33',
        backdropFilter: 'blur(6px)',
        animation: 'fadeInHelp 0.7s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'auto',
        userSelect: 'text',
        opacity: 0.92,
      }}>
        <style jsx>{`
          @keyframes fadeInHelp {
            from { opacity: 0; transform: translateY(30px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .help-section {
            margin-bottom: 10px;
          }
          .help-section strong {
            color: #60a5fa;
          }
          .help-list {
            margin: 0 0 0 0;
            padding: 0 0 0 16px;
            font-size: 0.97em;
          }
          .kbd {
            display: inline-block;
            background: #2226;
            border-radius: 6px;
            border: 1px solid #fff2;
            padding: 2px 7px;
            font-size: 0.93em;
            font-family: inherit;
            margin: 0 2px;
            color: #fff;
            box-shadow: 0 1px 2px #0002;
          }
        `}</style>
        <div className="help-section">
          <strong>Navigation :</strong>
          <ul className="help-list">
            <li><span className="kbd">Clic</span> sur une planète : détails & zoom</li>
            <li><span className="kbd">Survol</span> : aperçu rapide</li>
            <li><span className="kbd">Molette</span> : zoom/dézoom</li>
            <li><span className="kbd">Clic gauche</span> + déplacer : tourner</li>
          </ul>
        </div>
        <div className="help-section">
          <strong>Astuce :</strong>
          <ul className="help-list">
            <li>Re-cliquez sur la planète pour revenir à la vue d'ensemble.</li>
          </ul>
        </div>
        <div style={{fontSize: '0.91em', color: '#aaa', marginTop: 6, textAlign: 'left'}}>
          <span style={{opacity: 0.7}}>Contact : <a href="mailto:ethan.charpentier@epitech.eu" style={{color:'#60a5fa'}}>ethan.charpentier@epitech.eu</a></span>
        </div>
      </div>

      {/* Badge projet en bas à droite */}
      <div style={{
        position: 'absolute',
        right: 24,
        bottom: 24,
        zIndex: 1000,
        background: 'linear-gradient(120deg, #18181bcc 60%, #27272acc 100%)',
        color: '#fff',
        borderRadius: 14,
        boxShadow: '0 4px 18px #0006',
        padding: '14px 20px 12px 20px',
        fontFamily: 'inherit',
        fontSize: 15,
        border: '1.5px solid #60a5fa33',
        backdropFilter: 'blur(6px)',
        animation: 'fadeInHelp 0.7s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'auto',
        userSelect: 'text',
        opacity: 0.92,
      }}>
        <div style={{fontWeight: 700, fontSize: '1.08em', marginBottom: 4, color: '#60a5fa'}}>À propos</div>
        <div style={{fontSize: '0.98em', color: '#eee'}}>
          Chaque planète = un projet ou une expérience.<br/>
          Satellites = membres d'équipe.<br/>
          Badge <span className="kbd">Terminé</span> ou <span className="kbd">En cours</span> sur la fiche projet.<br/>
          Lien direct vers le code ou la démo.
        </div>
      </div>
    </>
  )
}
