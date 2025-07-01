import React from 'react'
import planetData from '../../../data/PlanetData'

export default function PlanetDetailUI({ selected, onClose }) {
  const getTheme = () => {
    const planetInfo = planetData.find(planet => 
      planet.name.toLowerCase() === selected.name?.toLowerCase()
    )
    
    if (planetInfo) {
      return {
        primary: planetInfo.color,
        accent: planetInfo.theme?.secondary || planetInfo.color,
        backgroundImage: `linear-gradient(135deg, ${planetInfo.color}95 0%, ${planetInfo.color}CC 100%)`,
        pattern: `radial-gradient(circle at 30% 70%, ${planetInfo.theme?.accent || planetInfo.color}1A 0%, transparent 50%)`,
        icon: planetInfo.icon || '🪐'
      }
    }
    return {
      primary: '#60a5fa',
      accent: '#93c5fd',
      backgroundImage: 'linear-gradient(135deg, rgba(96,165,250,0.95) 0%, rgba(59,130,246,0.95) 100%)',
      pattern: 'radial-gradient(circle at 40% 60%, rgba(147,197,253,0.1) 0%, transparent 50%)',
      icon: '🪐'
    }
  }

  const theme = getTheme()

  const getProjectDetails = () => {
    const projectData = planetData.find(planet => 
      planet.name.toLowerCase() === selected.name?.toLowerCase()
    )
    if (projectData && projectData.projectDetails) {
      return projectData.projectDetails
    }
    return {
      technologies: ['React', 'JavaScript', 'CSS'],
      features: [
        'Interface moderne',
        'Design responsive',
        'Performance optimisée'
      ],
      challenges: [
        'Architecture scalable',
        'Expérience utilisateur',
        'Performance'
      ],
      stats: {
        'Lignes de code': '5,000+',
        'Performance': '90/100',
        'Temps de développement': '2 mois'
      }
    }
  }

  const projectDetails = getProjectDetails()

  const getStatus = () => {
    const planetInfo = planetData.find(planet => 
      planet.name.toLowerCase() === selected.name?.toLowerCase()
    )
    return planetInfo?.status || 'done'
  }
  const status = getStatus()

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
      backgroundImage: `${theme.backgroundImage}, ${theme.pattern}`,
      padding: '24px',
      color: '#ffffff',
      borderRadius: '20px',
      maxWidth: '420px',
      minWidth: '380px',
      maxHeight: '85vh',
      overflowY: 'auto',
      zIndex: 10,
      boxShadow: `
        0 25px 50px ${theme.primary}40,
        0 0 0 1px rgba(255,255,255,0.1),
        inset 0 1px 0 rgba(255,255,255,0.2)
      `,
      border: `2px solid ${theme.primary}`,
      backdropFilter: 'blur(15px)',
      animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%) translateY(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
        }
        .status-badge {
          font-size: 2.3em;
          font-weight: 900;
          letter-spacing: 2px;
          padding: 0.18em 1.2em 0.18em 1.2em;
          border-radius: 2em;
          margin-bottom: 22px;
          display: inline-flex;
          align-items: center;
          gap: 0.7em;
          background: linear-gradient(90deg, ${status === 'done' ? '#22c55e' : '#fbbf24'}33 0%, #fff1 100%);
          box-shadow: 0 6px 32px ${theme.primary}50, 0 1.5px 0.5px #fff4 inset;
          border: 2.5px solid ${status === 'done' ? '#22c55e' : '#fbbf24'};
          color: ${status === 'done' ? '#22c55e' : '#fbbf24'};
          text-shadow: 0 2px 12px ${theme.primary}60, 0 0 2px #0008;
          animation: popStatus 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .status-badge::before {
          content: '';
          position: absolute;
          left: 0; top: 0; right: 0; bottom: 0;
          background: ${status === 'done' ? 'linear-gradient(120deg, #22c55e22 40%, #fff0 100%)' : 'linear-gradient(120deg, #fbbf2422 40%, #fff0 100%)'};
          z-index: 0;
          pointer-events: none;
        }
        .status-badge span {
          position: relative;
          z-index: 1;
        }
        .status-badge .dot {
          width: 0.7em;
          height: 0.7em;
          border-radius: 50%;
          background: ${status === 'done' ? '#22c55e' : '#fbbf24'};
          box-shadow: 0 0 16px 4px ${status === 'done' ? '#22c55e88' : '#fbbf2488'};
          display: inline-block;
          animation: pulseDot 1.2s infinite alternate;
        }
        @keyframes popStatus {
          0% { transform: scale(0.7) translateY(-20px); opacity: 0; }
          60% { transform: scale(1.15) translateY(2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes pulseDot {
          0% { box-shadow: 0 0 8px 2px ${status === 'done' ? '#22c55e88' : '#fbbf2488'}; }
          100% { box-shadow: 0 0 24px 8px ${status === 'done' ? '#22c55e44' : '#fbbf2444'}; }
        }
        .tech-tag {
          transition: all 0.3s ease;
        }
        .tech-tag:hover {
          transform: scale(1.05);
          background: ${theme.primary}40;
        }
      `}</style>

      {/* Status badge animé amélioré */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span className="status-badge">
          <span className="dot"></span>
          <span>{status === 'done' ? 'Terminé' : 'En cours'}</span>
        </span>
      </div>

      {/* Header avec icône du projet */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '20px',
        borderBottom: `2px solid ${theme.primary}40`,
        paddingBottom: '16px'
      }}>
        <div style={{
          fontSize: '2.5em',
          filter: `drop-shadow(0 0 12px ${theme.primary}80)`,
        }}>
          {theme.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            margin: '0 0 8px',
            fontSize: '24px',
            fontWeight: '800',
            backgroundImage: `linear-gradient(45deg, ${theme.accent}, #ffffff)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            {selected.name}
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            lineHeight: '1.4',
            opacity: 0.9
          }}>
            {selected.description}
          </p>
        </div>
      </div>

      {/* Image du projet */}
      {selected.image && (
        <div style={{
          width: '100%',
          borderRadius: '16px',
          marginBottom: '20px',
          overflow: 'hidden',
          border: `1px solid ${theme.primary}30`,
          boxShadow: `0 8px 24px ${theme.primary}30`
        }}>
          <img
            src={selected.image}
            alt={selected.name}
            style={{ 
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
      )}

      {/* Technologies */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚡</span> Technologies
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {projectDetails.technologies.map((tech, i) => (
            <span key={i} className="tech-tag" style={{
              backgroundColor: `${theme.primary}20`,
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1px solid ${theme.primary}40`,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Fonctionnalités */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✨</span> Fonctionnalités
        </h3>
        {projectDetails.features.map((feature, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            border: `1px solid ${theme.primary}30`
          }}>
            <span style={{ color: theme.accent }}>•</span>
            <span style={{ fontSize: '13px' }}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Défis techniques */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎯</span> Défis relevés
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {projectDetails.challenges.map((challenge, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.primary}30`,
              fontSize: '12px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {challenge}
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📊</span> Statistiques
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          {Object.entries(projectDetails.stats).map(([key, value], i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${theme.primary}30`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.accent }}>{value}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.primary}30`
      }}>
        {selected.link !== '#' && (
          <a
            href={selected.link}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: `${theme.primary}20`,
              border: `1px solid ${theme.primary}50`,
              borderRadius: '12px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${theme.primary}30`
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${theme.primary}20`
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <span>🔗</span>
            <span>Voir le projet</span>
          </a>
        )}
      </div>
    </div>
  )
}