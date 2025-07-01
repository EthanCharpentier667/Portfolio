import React, { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { cartoonVertexShader, cartoonFragmentShader } from './CartoonShaders'
import Image from 'next/image'

export default function SatelliteOrbit({ 
  satellite, 
  satelliteDistance, 
  satelliteSpeed, 
  index, 
  hoveredSatellite, 
  setHoveredSatellite, 
  handleSatelliteClick,
  planetPaused,
  showSatellites,
  sunPosition = [0, 0, 0]
}) {
  const satelliteRef = useRef()
  const pausedTimeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [satelliteScale, setSatelliteScale] = useState(1.2)
  const animationStartTime = useRef(null)
  const { camera, controls } = useThree()
  const [tooltipProps, setTooltipProps] = useState({ position: [0, 1, 0], distanceFactor: 4 })

  const satelliteCartoonMaterial = useMemo(() => {
    const satelliteColor = satellite.color || '#cccccc'
    
    return new THREE.ShaderMaterial({
      vertexShader: cartoonVertexShader,
      fragmentShader: cartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(satelliteColor) },
        secondaryColor: { value: new THREE.Color(satelliteColor).multiplyScalar(0.8) },
        accentColor: { value: new THREE.Color(satelliteColor).multiplyScalar(1.2) },
        emissiveColor: { value: new THREE.Color(satelliteColor) },
        glowColor: { value: new THREE.Color(satelliteColor) },
        isHovered: { value: false },
        noiseScale: { value: 12.0 },
        animSpeed: { value: 0.6 },
        rimPower: { value: 2.5 },
        emissiveStrength: { value: 0.3 },
        patternIntensity: { value: 0.4 },
        patternType: { value: 1 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) },
        opacity: { value: 1.0 }
      },
      transparent: true
    })
  }, [satellite.color, sunPosition])

  const getTooltipProps = () => {
    let distance = camera.position.length()
    if (controls && controls.getDistance) {
      distance = controls.getDistance()
    }
    const minDistance = 0
    const maxDistance = 50
    const normalizedZoom = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)))
    const positionY = 0.25 + (normalizedZoom * 2)
    const distanceFactor = 1 + (normalizedZoom * 10)
    return {
      position: [0, positionY, 0],
      distanceFactor: distanceFactor
    }
  }

  useFrame(({ clock }) => {
    const newTooltipProps = getTooltipProps()
    setTooltipProps(newTooltipProps)
    const currentTime = clock.getElapsedTime()
    
    if (satelliteCartoonMaterial) {
      satelliteCartoonMaterial.uniforms.time.value = currentTime
      satelliteCartoonMaterial.uniforms.isHovered.value = hoveredSatellite === index
      satelliteCartoonMaterial.uniforms.emissiveStrength.value = hoveredSatellite === index ? 0.6 : 0.3
      satelliteCartoonMaterial.uniforms.opacity.value = animationProgress
    }
    
    if (satelliteRef.current) {
      const currentTime = clock.getElapsedTime()
      
      if (showSatellites && animationStartTime.current === null) {
        animationStartTime.current = currentTime
        lastTimeRef.current = currentTime
        pausedTimeRef.current = 0
      }
      
      if (showSatellites && animationStartTime.current !== null) {
        const elapsed = currentTime - animationStartTime.current
        const progress = Math.min(1, elapsed * 2)
        setAnimationProgress(progress)
      } else if (!showSatellites) {
        animationStartTime.current = null
        setAnimationProgress(0)
      }

      if (showSatellites && animationStartTime.current !== null) {
        const anySatelliteHovered = hoveredSatellite !== null

        if (anySatelliteHovered) {
          pausedTimeRef.current += currentTime - lastTimeRef.current
          lastTimeRef.current = currentTime
        } else if (planetPaused) {
          const slowedSpeed = satelliteSpeed * 0.4
          const effectiveTime = (currentTime - pausedTimeRef.current) * slowedSpeed
          const x = Math.cos(effectiveTime) * satelliteDistance
          const z = Math.sin(effectiveTime) * satelliteDistance
          satelliteRef.current.position.set(x, 0, z)
          lastTimeRef.current = currentTime
        } else {
          const effectiveTime = (currentTime - pausedTimeRef.current) * satelliteSpeed
          const x = Math.cos(effectiveTime) * satelliteDistance
          const z = Math.sin(effectiveTime) * satelliteDistance
          satelliteRef.current.position.set(x, 0, z)
          lastTimeRef.current = currentTime
        }
      }
      
      // Animation scale fluide pour le satellite (0.2s)
      const targetSatelliteScale = hoveredSatellite === index ? 1.8 : 1.2
      const scaleSpeed = 5 // Vitesse d'interpolation (5 = ~0.2s)
      
      setSatelliteScale(prev => {
        const diff = targetSatelliteScale - prev
        return prev + diff * scaleSpeed * (1/60) // Approximation 60fps
      })
      
      const animatedScale = satelliteScale * animationProgress
      satelliteRef.current.scale.setScalar(animatedScale)
    }
  })

  const handlePointerOver = () => {
    setHoveredSatellite(index)
  }

  const handlePointerOut = () => {
    setHoveredSatellite(null)
  }

  if (!showSatellites) return null

  return (
    <group ref={satelliteRef}>
      <mesh
        onClick={() => handleSatelliteClick(satellite)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <primitive object={satelliteCartoonMaterial} />
      </mesh>

      {/* Tooltip du satellite - ADAPTATIF AU ZOOM CANVAS */}
      {hoveredSatellite === index && animationProgress > 0.8 && (
        <Html 
          position={tooltipProps.position}
          center
          distanceFactor={tooltipProps.distanceFactor}
          occlude={false}
          transform
          sprite
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(40,40,40,0.95) 0%, rgba(60,60,60,0.95) 100%)',
            borderRadius: '12px',
            padding: '12px',
            minWidth: '200px',
            maxWidth: '250px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
            color: 'white',
            textAlign: 'center',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
            border: `2px solid ${satellite.color || '#cccccc'}`,
            animation: 'fadeInScale 0.3s ease-out',
            transformOrigin: 'center bottom',
            transition: 'all 0.2s ease-out',
          }}>
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
            `}</style>
            
            {/* Photo du coéquipier */}
            {satellite.photo && (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 10px',
                border: `2px solid ${satellite.color || '#cccccc'}`,
                boxShadow: `0 4px 12px ${satellite.color}40`,
              }}>
                <img
                  src={satellite.photo}
                  alt={satellite.name}
                  width={60}
                  height={60}
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center center',
                  }}
                />
              </div>
            )}
            
            <h4 style={{ 
              margin: '0 0 6px', 
              fontSize: '14px',
              background: `linear-gradient(45deg, ${satellite.color || '#cccccc'}, white)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}>
              {satellite.name}
            </h4>
            
            <p style={{ 
              fontSize: '11px', 
              margin: '0 0 8px',
              color: '#cccccc',
              lineHeight: '1.3'
            }}>
              {satellite.role}
            </p>
            
            {satellite.skills && (
              <div style={{ 
                fontSize: '9px', 
                color: '#999',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                justifyContent: 'center'
              }}>
                {satellite.skills.map((skill, i) => (
                  <span 
                    key={i}
                    style={{
                      background: `${satellite.color}20`,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      border: `1px solid ${satellite.color}40`
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            <div style={{
              fontSize: '10px',
              color: '#aaa',
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              Cliquez pour voir le profil LinkedIn
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}