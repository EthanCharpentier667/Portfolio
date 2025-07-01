import React, { useEffect, useState } from 'react'
import aboutMeData from '../../../data/AboutMeData'

export default function SunDetailUI({ selected, onClose, clickableClose }) {
  const skills = aboutMeData.skills || {
    languages: [],
    frameworks: [],
    tools: []
  }

  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    setVisible(true)
    return () => {
      setVisible(false)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      setShouldRender(false)
      if (onClose) onClose()
    }, 300)
  }

  if (!shouldRender) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '20px',
        transform: 'translateY(-50%)',
        backgroundImage: 'linear-gradient(135deg, rgba(255,204,0,0.95) 0%, rgba(255,136,0,0.95) 100%), radial-gradient(circle at 20% 80%, rgba(255,242,0,0.1) 0%, transparent 50%)',
        padding: '24px',
        color: '#1a1a1a',
        borderRadius: '20px',
        maxWidth: '420px',
        minWidth: '380px',
        maxHeight: '85vh',
        overflowY: 'auto',
        zIndex: 10,
        boxShadow: `
          0 25px 50px rgba(255,204,0,0.4),
          0 0 0 1px rgba(255,255,255,0.2),
          inset 0 1px 0 rgba(255,255,255,0.3)
        `,
        border: '2px solid #ffcc00',
        backdropFilter: 'blur(15px)',
        animation: visible ? 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'fadeOutLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: visible ? 1 : 0,
        cursor: clickableClose ? 'pointer' : 'default',
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={clickableClose ? handleClose : undefined}
    >
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
        @keyframes fadeOutLeft {
          from {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          to {
            transform: translateX(-100%) translateY(-50%);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .skill-bar {
          transition: all 0.3s ease;
        }
        .skill-bar:hover {
          transform: translateX(4px);
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        borderBottom: '2px solid rgba(255,204,0,0.4)',
        paddingBottom: '16px'
      }}>
        <div style={{
          fontSize: '2.5em',
          filter: 'drop-shadow(0 0 12px rgba(255,204,0,0.8))',
          animation: 'pulse 2s infinite'
        }}>
          ☀️
        </div>
        <div>
          <h2 style={{ 
            margin: '0 0 4px',
            fontSize: '24px',
            fontWeight: '800',
            backgroundImage: 'linear-gradient(45deg,rgb(200, 107, 0),rgb(186, 127, 0))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Stack Technique
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
            Technologies maîtrisées
          </p>
        </div>
      </div>

      {/* Languages Skills */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎨</span> Languages
        </h3>
        {skills.languages.map((skill, i) => (
          <div key={i} className="skill-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,204,0,0.3)'
          }}>
            <span style={{ fontSize: '16px' }}>{skill.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{skill.name}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{skill.level}%</span>
              </div>
              <div style={{
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.level}%`,
                  backgroundColor: '#ff8800',
                  borderRadius: '2px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Frameworks Skills */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚙️</span> Frameworks
        </h3>
        {skills.frameworks.map((skill, i) => (
          <div key={i} className="skill-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,204,0,0.3)'
          }}>
            <span style={{ fontSize: '16px' }}>{skill.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{skill.name}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{skill.level}%</span>
              </div>
              <div style={{
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.level}%`,
                  backgroundColor: '#ff8800',
                  borderRadius: '2px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🛠️</span> Outils
        </h3>
        {skills.tools.map((skill, i) => (
          <div key={i} className="skill-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,204,0,0.3)'
          }}>
            <span style={{ fontSize: '16px' }}>{skill.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{skill.name}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>{skill.level}%</span>
              </div>
              <div style={{
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.level}%`,
                  backgroundColor: '#ff8800',
                  borderRadius: '2px',
                  transition: 'width 1s ease-out'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}