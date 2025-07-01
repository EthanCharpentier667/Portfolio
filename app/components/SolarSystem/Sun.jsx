import React, { useState, useMemo } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import SunParticles from './SunParticles'
import { sunVertexShader, sunFragmentShader } from './CartoonShaders'
import aboutMeData from '../../data/AboutMeData'

export default function Sun({ onSelect, isSelected }) {
  const [sunHovered, setSunHovered] = useState(false)
  const [particlesOpacity, setParticlesOpacity] = useState(0)
  const [sunScale, setSunScale] = useState(1)
  const [coronaScale, setCoronaScale] = useState(2.2)
  const { camera, controls } = useThree()
  const [tooltipProps, setTooltipProps] = useState({ position: [0, 3, 0], distanceFactor: 8 })

  const sunTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    try {
      const texture = loader.load('/sun.jpg')
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter
      texture.generateMipmaps = true
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      return texture
    } catch (error) {
      console.warn('Erreur de chargement de texture pour le soleil:', error)
      const canvas = document.createElement('canvas')
      canvas.width = 2048
      canvas.height = 1024
      const context = canvas.getContext('2d')
      const gradient = context.createRadialGradient(1024, 512, 0, 1024, 512, 512)
      gradient.addColorStop(0, '#ffff88')
      gradient.addColorStop(0.3, '#ffdd44')
      gradient.addColorStop(0.6, '#ffaa00')
      gradient.addColorStop(1, '#ff6600')
      
      context.fillStyle = gradient
      context.fillRect(0, 0, 2048, 1024)
      
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2048
        const y = Math.random() * 1024
        const radius = Math.random() * 50 + 10
        const alpha = Math.random() * 0.3 + 0.1
        
        context.fillStyle = `rgba(255, 100, 0, ${alpha})`
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
      }
      
      return new THREE.CanvasTexture(canvas)
    }
  }, [])

  const sunCartoonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        time: { value: 0 },
        sunTexture: { value: sunTexture },
        primaryColor: { value: new THREE.Color('#ffff88') },
        secondaryColor: { value: new THREE.Color('#ffdd44') },
        accentColor: { value: new THREE.Color('#ff6600') },
        emissiveColor: { value: new THREE.Color('#ffaa00') },
        glowColor: { value: new THREE.Color('#ffcc66') },
        isHovered: { value: false },
        noiseScale: { value: 8.0 },
        animSpeed: { value: 0.5 },
        rimPower: { value: 2.0 },
        emissiveStrength: { value: 0.6 },
        flameIntensity: { value: 0.2 },
        coronaIntensity: { value: 0.15 },
        textureRotation: { value: 0 }
      },
      transparent: false
    })
  }, [sunTexture])

  const handleSunClick = () => {
    onSelect()
  }

  const getTooltipProps = () => {
    let distance = camera.position.length()
    if (controls && controls.getDistance) {
      distance = controls.getDistance()
    }
    const minDistance = 1
    const maxDistance = 50
    const normalizedZoom = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)))
    const positionY = 2 + (normalizedZoom * 6)
    const distanceFactor = 1 + (normalizedZoom * 15)
    return {
      position: [0, positionY, 0],
      distanceFactor: distanceFactor
    }
  }
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  React.useEffect(() => {
    if (sunHovered) {
      setShowTooltip(true)
      setTimeout(() => setTooltipVisible(true), 10)
    } else if (showTooltip) {
      setTooltipVisible(false)
      const timeout = setTimeout(() => setShowTooltip(false), 250)
      return () => clearTimeout(timeout)
    }
  }, [sunHovered])

  useFrame(({ clock }) => {
    const newTooltipProps = getTooltipProps()
    setTooltipProps(newTooltipProps)
    const elapsed = clock.getElapsedTime()

    if (sunHovered && particlesOpacity < 1) {
      setParticlesOpacity(prev => Math.min(1, prev + 0.05))
    } else if (!sunHovered && particlesOpacity > 0) {
      setParticlesOpacity(prev => Math.max(0, prev - 0.03))
    }

    const targetSunScale = sunHovered ? 1.2 : 1
    const scaleSpeed = 5
    setSunScale(prev => {
      const diff = targetSunScale - prev
      return prev + diff * scaleSpeed * (1/60)
    })
    const targetCoronaScale = sunHovered ? 2.8 : 2.2
    setCoronaScale(prev => {
      const diff = targetCoronaScale - prev
      return prev + diff * scaleSpeed * (1/60)
    })

    if (sunCartoonMaterial) {
      sunCartoonMaterial.uniforms.time.value = elapsed
      sunCartoonMaterial.uniforms.isHovered.value = sunHovered
      sunCartoonMaterial.uniforms.textureRotation.value = elapsed * 0.02
      
      if (sunHovered) {
        sunCartoonMaterial.uniforms.flameIntensity.value = 0.4
        sunCartoonMaterial.uniforms.coronaIntensity.value = 0.3
        sunCartoonMaterial.uniforms.emissiveStrength.value = 1.0
      } else {
        sunCartoonMaterial.uniforms.flameIntensity.value = 0.2
        sunCartoonMaterial.uniforms.coronaIntensity.value = 0.15
        sunCartoonMaterial.uniforms.emissiveStrength.value = 0.6
      }
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y = -elapsed * 0.05
      coronaRef.current.rotation.z = Math.sin(elapsed * 0.3) * 0.1
      const pulseScale = 1 + Math.sin(elapsed * 2) * 0.05
      const baseScale = coronaScale
      coronaRef.current.scale.setScalar(baseScale * pulseScale)
      const baseOpacity = sunHovered ? 0.25 : 0.15
      const opacityVariation = Math.sin(elapsed * 1.5) * 0.03
      coronaRef.current.material.opacity = baseOpacity + opacityVariation
      const colorIntensity = 0.5 + Math.sin(elapsed * 0.8) * 0.2
      coronaRef.current.material.color.setRGB(
        1.0 * colorIntensity,
        0.67 * colorIntensity,
        0.0
      )
    }

    if (sunHovered) {
      const scale = 1 + Math.sin(elapsed * 2) * 0.05
    }
  })

  const skills = aboutMeData.skills || {
    languages: [],
    frameworks: [],
    tools: []
  }

  const coronaRef = React.useRef()

  return (
    <group>
      {/* Couronne solaire */}
      <mesh 
        ref={coronaRef}
        scale={coronaScale}
        renderOrder={1000}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={sunHovered ? 0.2 : 0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Particules solaires */}
      {particlesOpacity > 0 && (
        <group style={{ opacity: particlesOpacity }}>
          <SunParticles opacity={particlesOpacity} />
        </group>
      )}
      {/* Soleil principal */}
      <mesh
        scale={sunScale}
        onClick={handleSunClick}
        onPointerOver={() => setSunHovered(true)}
        onPointerOut={() => setSunHovered(false)}
        className="sun-mesh"
        renderOrder={3000}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <primitive object={sunCartoonMaterial} />
      </mesh>
      {/* Tooltip du soleil - COMPÉTENCES TECHNIQUES */}
      {showTooltip && (
        <Html 
          position={tooltipProps.position}
          center
          distanceFactor={tooltipProps.distanceFactor}
          occlude={false}
          transform
          sprite
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,204,0,0.95) 0%, rgba(255,170,0,0.95) 100%)',
              borderRadius: '16px',
              padding: '16px',
              minWidth: '320px',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(255,170,0,0.4), 0 0 0 1px rgba(255,255,255,0.2)',
              color: 'black',
              textAlign: 'left',
              pointerEvents: 'none',
              backdropFilter: 'blur(10px)',
              border: '2px solid #ffcc00',
              animation: tooltipVisible ? 'fadeInScale 0.3s ease-out' : 'fadeOutScale 0.25s ease-in',
              transformOrigin: 'center bottom',
              transition: 'all 0.2s ease-out',
              fontSize: '12px',
              opacity: tooltipVisible ? 1 : 0,
            }}
          >
            <style jsx>{`
              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.8) translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              @keyframes fadeOutScale {
                from {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
                to {
                  opacity: 0;
                  transform: scale(0.8) translateY(10px);
                }
              }
            `}</style>
            
            <div style={{
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ 
                margin: '0 0 8px', 
                fontSize: '18px',
                background: 'linear-gradient(45deg, #ff6600, #cc4400)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
              }}>
                💻 Stack Technique
              </h3>
              <p style={{ 
                fontSize: '11px',
                margin: '0',
                color: '#444',
                lineHeight: '1.3',
              }}>
                Technologies acquises via mes projets
              </p>
            </div>

            {/* Langages de Programmation */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ 
                fontSize: '13px', 
                margin: '0 0 6px', 
                color: '#333',
                fontWeight: 'bold',
                borderBottom: '1px solid #ffcc0040',
                paddingBottom: '2px'
              }}>
                🔤 Langages
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skills.languages.map((skill, i) => (
                  <span 
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      border: '1px solid rgba(255,204,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <span>{skill.icon}</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* frameworks */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ 
                fontSize: '13px', 
                margin: '0 0 6px', 
                color: '#333',
                fontWeight: 'bold',
                borderBottom: '1px solid #ffcc0040',
                paddingBottom: '2px'
              }}>
                🎨 Frameworks
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skills.frameworks.map((skill, i) => (
                  <span 
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      border: '1px solid rgba(255,204,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <span>{skill.icon}</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ 
                fontSize: '13px', 
                margin: '0 0 6px', 
                color: '#333',
                fontWeight: 'bold',
                borderBottom: '1px solid #ffcc0040',
                paddingBottom: '2px'
              }}>
                ⚙️ Outils
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skills.tools.map((skill, i) => (
                  <span 
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500',
                      border: '1px solid rgba(255,204,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <span>{skill.icon}</span>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ 
              fontSize: '9px', 
              color: '#666',
              textAlign: 'center',
              marginTop: '12px',
              fontStyle: 'italic',
              borderTop: '1px solid #ffcc0040',
              paddingTop: '8px'
            }}>
              💡 Compétences développées via projets concrets
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}