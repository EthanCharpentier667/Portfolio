import React, { useEffect, useState } from 'react'
import aboutMeData from '../../../data/AboutMeData'
import { a } from 'framer-motion/client'

export default function AboutMeDetailUI({ selected, onClose }) {
  const personalInfo = {
    name: aboutMeData?.name || 'Ethan Charpentier',
    role: aboutMeData?.role || 'Étudiant en informatique',
    location: aboutMeData?.location || 'Nantes, France',
    experience: `+${aboutMeData?.experienceYears || 1} years`,
    education: aboutMeData?.education?.[0]?.institution || 'Epitech Nantes',
    interests: aboutMeData?.interests || ['Développement de jeux vidéo', 'Intelligence artificielle', 'Optimisation des performances', 'Architecture logicielle'],
    values: aboutMeData?.values || ['Innovation', 'Performance', 'Collaboration', 'Apprentissage continu'],
    journey: aboutMeData?.journey || [],
  }
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)
  useEffect(() => {
    setVisible(true)
  }, [])
  useEffect(() => {
    if (!selected && visible) {
      setVisible(false)
      const timeout = setTimeout(() => {
        setShouldRender(false)
        if (onClose) onClose()
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [selected])
  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      setShouldRender(false)
      if (onClose) onClose()
    }, 300)
  }

  if (!shouldRender) return null

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
      backgroundImage: 'linear-gradient(135deg, rgba(0,170,255,0.95) 0%, rgba(0,102,204,0.95) 100%), radial-gradient(circle at 80% 20%, rgba(102,204,255,0.1) 0%, transparent 50%)',
      padding: '24px',
      color: '#ffffff',
      borderRadius: '20px',
      maxWidth: '420px',
      minWidth: '380px',
      maxHeight: '85vh',
      overflowY: 'auto',
      zIndex: 10,
      boxShadow: `
        0 25px 50px rgba(0,170,255,0.4),
        0 0 0 1px rgba(255,255,255,0.1),
        inset 0 1px 0 rgba(255,255,255,0.2)
      `,
      border: '2px solid #00aaff',
      backdropFilter: 'blur(15px)',
      animation: visible ? 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'fadeOutLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .timeline-item {
          transition: all 0.3s ease;
        }
        .timeline-item:hover {
          transform: translateX(8px);
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Header avec photo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
        borderBottom: '2px solid rgba(0,170,255,0.4)',
        paddingBottom: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '3px solid rgba(0,170,255,0.4)',
          boxShadow: '0 8px 20px rgba(0,170,255,0.3)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <img
            src="/avataar.png"
            alt="Ethan Charpentier"
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 1%',
            }}
          />
        </div>
        <div>
          <h2 style={{ 
            margin: '0 0 4px',
            fontSize: '24px',
            fontWeight: '800',
            backgroundImage: 'linear-gradient(45deg, #66ccff, #ffffff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            {personalInfo.name}
          </h2>
          <p style={{ 
            margin: '0 0 4px', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#e0f0ff'
          }}>
            {personalInfo.role}
          </p>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
            📍 {personalInfo.location}
          </p>
        </div>
      </div>

      {/* Informations personnelles */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>ℹ️</span> Informations
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(0,170,255,0.3)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>🎓 Formation</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{personalInfo.education}</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(0,170,255,0.3)'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>💼 Expérience</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{personalInfo.experience}</div>
          </div>
        </div>
      </div>

      {/* Centres d'intérêt */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎯</span> Centres d'intérêt
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {personalInfo.interests.map((interest, i) => (
            <span key={i} style={{
              backgroundColor: 'rgba(102,204,255,0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(102,204,255,0.4)',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Valeurs */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💎</span> Valeurs
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {personalInfo.values.map((value, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(0,170,255,0.3)',
              fontSize: '13px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {value}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🚀</span> Parcours
        </h3>
        {personalInfo.journey.map((item, i) => (
          <div key={i} className="timeline-item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(0,170,255,0.3)'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.description}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{item.year}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(0,170,255,0.3)'
      }}>
        <a
          href="https://www.linkedin.com/in/ethan-charpentier-epitech"
          target="_blank"
          rel="noreferrer"
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: 'rgba(0,170,255,0.2)',
            border: '1px solid rgba(0,170,255,0.5)',
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
            e.target.style.backgroundColor = 'rgba(0,170,255,0.3)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0,170,255,0.2)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <span>💼</span>
          <span>LinkedIn</span>
        </a>
        
        <a
          href="mailto:ethan.charpentier@epitech.eu"
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(0,170,255,0.3)',
            borderRadius: '12px',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <span role="img" aria-label="email">✉️</span>
          <span>Email</span>
        </a>
      </div>
    </div>
  )
}