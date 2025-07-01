import React from 'react'

export default function SatelliteDetailUI({ selected, onClose }) {
  const memberDetails = {
    skills: selected.skills || ['React', 'Node.js', 'Design'],
    experience: selected.experience || '3+ ans',
    specialties: selected.specialties || ['Frontend', 'UX/UI'],
    projects: selected.projects || [
      'E-commerce Platform',
      'Mobile App',
      'Dashboard Analytics'
    ],
    achievements: selected.achievements || [
      'Lead technique sur 5+ projets',
      'Mentor de développeurs junior',
      'Speaker en conférences tech'
    ],
    contact: {
      linkedin: selected.linkedin || '#',
      email: selected.email || 'contact@example.com',
      portfolio: selected.portfolio || '#'
    },
    availability: selected.availability || 'Disponible',
    location: selected.location || 'Paris, France'
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '20px',
      transform: 'translateY(-50%)',
      backgroundImage: 'linear-gradient(135deg, rgba(40,40,40,0.95) 0%, rgba(60,60,60,0.95) 100%), radial-gradient(circle at 50% 50%, rgba(128,128,128,0.1) 0%, transparent 50%)',
      padding: '24px',
      color: '#ffffff',
      borderRadius: '20px',
      maxWidth: '420px',
      minWidth: '380px',
      maxHeight: '85vh',
      overflowY: 'auto',
      zIndex: 10,
      boxShadow: `
        0 25px 50px rgba(0,0,0,0.6),
        0 0 0 1px rgba(255,255,255,0.1),
        inset 0 1px 0 rgba(255,255,255,0.2)
      `,
      border: `2px solid ${selected.color || '#cccccc'}`,
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
        .skill-item {
          transition: all 0.3s ease;
        }
        .skill-item:hover {
          transform: scale(1.05);
          background: ${selected.color || '#cccccc'}40;
        }
      `}</style>

      {/* Header avec photo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
        borderBottom: `2px solid ${selected.color || '#cccccc'}40`,
        paddingBottom: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `3px solid ${selected.color || '#cccccc'}`,
          boxShadow: `0 8px 20px ${selected.color || '#cccccc'}30`,
        }}>
          {selected.photo ? (
            <img
              src={selected.photo}
              alt={selected.name}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: `${selected.color || '#cccccc'}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              👤
            </div>
          )}
        </div>
        <div>
          <h2 style={{ 
            margin: '0 0 4px',
            fontSize: '24px',
            fontWeight: '800',
            backgroundImage: `linear-gradient(45deg, ${selected.color || '#cccccc'}, #ffffff)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            {selected.name}
          </h2>
          <p style={{ 
            margin: '0 0 4px', 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#e0e0e0'
          }}>
            {selected.role}
          </p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', opacity: 0.8 }}>
            <span>📍 {memberDetails.location}</span>
            <span>⏱️ {memberDetails.experience}</span>
          </div>
        </div>
      </div>

      {/* Disponibilité */}
      <div style={{
        backgroundColor: memberDetails.availability === 'Disponible' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: `1px solid ${memberDetails.availability === 'Disponible' ? '#22c55e' : '#ef4444'}40`,
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>
          {memberDetails.availability === 'Disponible' ? '🟢' : '🔴'} {memberDetails.availability}
        </span>
      </div>

      {/* Compétences */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💻</span> Compétences
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {memberDetails.skills.map((skill, i) => (
            <span key={i} className="skill-item" style={{
              backgroundColor: `${selected.color || '#cccccc'}20`,
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1px solid ${selected.color || '#cccccc'}40`,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Spécialités */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎯</span> Spécialités
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {memberDetails.specialties.map((specialty, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: `1px solid ${selected.color || '#cccccc'}30`,
              fontSize: '13px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {specialty}
            </div>
          ))}
        </div>
      </div>

      {/* Projets récents */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🚀</span> Projets récents
        </h3>
        {memberDetails.projects.map((project, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            border: `1px solid ${selected.color || '#cccccc'}30`
          }}>
            <span style={{ color: selected.color || '#cccccc' }}>•</span>
            <span style={{ fontSize: '13px' }}>{project}</span>
          </div>
        ))}
      </div>

      {/* Réalisations */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🏆</span> Réalisations
        </h3>
        {memberDetails.achievements.map((achievement, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            border: `1px solid ${selected.color || '#cccccc'}30`
          }}>
            <span style={{ color: selected.color || '#cccccc', marginTop: '2px' }}>✓</span>
            <span style={{ fontSize: '13px', lineHeight: '1.4' }}>{achievement}</span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{
        display: 'flex',
        gap: '8px',
        paddingTop: '16px',
        borderTop: `1px solid ${selected.color || '#cccccc'}30`,
        flexWrap: 'wrap'
      }}>
        {memberDetails.contact.linkedin !== '#' && (
          <a
            href={memberDetails.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              minWidth: '100px',
              padding: '10px 16px',
              backgroundColor: `${selected.color || '#cccccc'}20`,
              border: `1px solid ${selected.color || '#cccccc'}50`,
              borderRadius: '12px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${selected.color || '#cccccc'}30`
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${selected.color || '#cccccc'}20`
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <span>💼</span>
            <span>LinkedIn</span>
          </a>
        )}
        
        <button 
          onClick={onClose} 
          style={{ 
            padding: '10px 16px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: `1px solid ${selected.color || '#cccccc'}30`,
            borderRadius: '12px',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
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
          <span>✕</span>
          <span>Fermer</span>
        </button>
      </div>
    </div>
  )
}