import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { cartoonVertexShader, cartoonFragmentShader } from './CartoonShaders'
import AboutMeData from '../../data/AboutMeData'

export default function AboutMeSatellite({ onSelect, resetTrigger, sunPosition = [0, 0, 0] }) {
  const satelliteRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const [satelliteScale, setSatelliteScale] = useState(1.4)
  const [tooltipProps, setTooltipProps] = useState({ position: [0, 1.5, 0], distanceFactor: 6 })
  const { camera, controls } = useThree()
  const pausedTimeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const scale = 0.3

  const satelliteBodyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cartoonVertexShader,
      fragmentShader: cartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color('#00aaff') },
        secondaryColor: { value: new THREE.Color('#0088dd') },
        accentColor: { value: new THREE.Color('#00ccff') },
        emissiveColor: { value: new THREE.Color('#004488') },
        glowColor: { value: new THREE.Color('#00aaff') },
        isHovered: { value: false },
        noiseScale: { value: 10.0 },
        animSpeed: { value: 0.8 },
        rimPower: { value: 2.0 },
        emissiveStrength: { value: 0.4 },
        patternIntensity: { value: 0.6 },
        patternType: { value: 0 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) },
        opacity: { value: 1.0 }
      },
      transparent: true
    })
  }, [sunPosition])

  const solarPanelMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cartoonVertexShader,
      fragmentShader: cartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color('#1a1a2e') },
        secondaryColor: { value: new THREE.Color('#0066cc') },
        accentColor: { value: new THREE.Color('#00aaff') },
        emissiveColor: { value: new THREE.Color('#004488') },
        glowColor: { value: new THREE.Color('#0066cc') },
        isHovered: { value: false },
        noiseScale: { value: 15.0 },
        animSpeed: { value: 0.5 },
        rimPower: { value: 1.5 },
        emissiveStrength: { value: 0.3 },
        patternIntensity: { value: 0.8 },
        patternType: { value: 1 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) },
        opacity: { value: 1.0 }
      },
      transparent: true
    })
  }, [sunPosition])

  const antennaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cartoonVertexShader,
      fragmentShader: cartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color('#cccccc') },
        secondaryColor: { value: new THREE.Color('#aaaaaa') },
        accentColor: { value: new THREE.Color('#ffffff') },
        emissiveColor: { value: new THREE.Color('#888888') },
        glowColor: { value: new THREE.Color('#cccccc') },
        isHovered: { value: false },
        noiseScale: { value: 8.0 },
        animSpeed: { value: 0.3 },
        rimPower: { value: 3.0 },
        emissiveStrength: { value: 0.2 },
        patternIntensity: { value: 0.3 },
        patternType: { value: 4 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) },
        opacity: { value: 1.0 }
      },
      transparent: true
    })
  }, [sunPosition])

  useEffect(() => {
    if (resetTrigger > 0) {
      setPaused(false)
    }
  }, [resetTrigger])

  const getTooltipProps = () => {
    let distance = camera.position.length()
    if (controls && controls.getDistance) {
      distance = controls.getDistance()
    }
    const minDistance = 5
    const maxDistance = 50
    const normalizedZoom = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)))
    const positionY = 10 + (normalizedZoom * 10)
    const distanceFactor = 3 + (normalizedZoom * 15)
    return {
      position: [0, positionY, 0],
      distanceFactor: distanceFactor
    }
  }

  const handleClick = () => {
    setPaused(!paused)
    onSelect({
      name: 'À propos de moi',
    })
  }

  const handleHover = () => {
    setHovered(true)
  }

  const handleUnhover = () => {
    setHovered(false)
  }
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  useEffect(() => {
    if (hovered) {
      setShowTooltip(true)
      setTimeout(() => setTooltipVisible(true), 10)
    } else if (showTooltip) {
      setTooltipVisible(false)
      const timeout = setTimeout(() => setShowTooltip(false), 250)
      return () => clearTimeout(timeout)
    }
  }, [hovered])

  useFrame(({ clock }) => {
    const newTooltipProps = getTooltipProps()
    setTooltipProps(newTooltipProps)
    const currentTime = clock.getElapsedTime()

    if (satelliteBodyMaterial) {
      satelliteBodyMaterial.uniforms.time.value = currentTime
      satelliteBodyMaterial.uniforms.isHovered.value = hovered
      satelliteBodyMaterial.uniforms.emissiveStrength.value = hovered ? 0.8 : 0.4
    }
    
    if (solarPanelMaterial) {
      solarPanelMaterial.uniforms.time.value = currentTime
      solarPanelMaterial.uniforms.isHovered.value = hovered
      solarPanelMaterial.uniforms.emissiveStrength.value = hovered ? 0.6 : 0.3
    }
    
    if (antennaMaterial) {
      antennaMaterial.uniforms.time.value = currentTime
      antennaMaterial.uniforms.isHovered.value = hovered
      antennaMaterial.uniforms.emissiveStrength.value = hovered ? 0.4 : 0.2
    }

    if (satelliteRef.current) {
      const currentTime = clock.getElapsedTime()
      
      const shouldPause = hovered || paused
      
      if (!shouldPause) {
        const orbitRadius = 4
        const orbitSpeed = 0.3
        const effectiveTime = (currentTime - pausedTimeRef.current) * orbitSpeed
        const x = Math.cos(effectiveTime) * orbitRadius
        const z = Math.sin(effectiveTime) * orbitRadius
        satelliteRef.current.position.set(x, 0, z)
        
        lastTimeRef.current = currentTime
      } else {
        pausedTimeRef.current += currentTime - lastTimeRef.current
        lastTimeRef.current = currentTime
      }
      satelliteRef.current.rotation.y = currentTime * 2
      satelliteRef.current.rotation.x = Math.sin(currentTime) * 0.2
      
      const baseScale = scale
      const targetScale = hovered ? baseScale * 1.5 : baseScale * 1.2
      const currentScale = satelliteRef.current.scale.x
      const lerpFactor = 0.1
      if (Math.abs(currentScale - targetScale) > 0.01) {
        const newScale = currentScale + (targetScale - currentScale) * lerpFactor
        satelliteRef.current.scale.setScalar(newScale)
      }
    }
  })

  return (
    <>
      {/* Orbite visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={2000}>
        <ringGeometry args={[3.8, 4, 64]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Satellite About Me - Modèle 3D */}
      <group ref={satelliteRef}>
        {/* Glow effect cartoon */}
        <mesh scale={hovered ? 1.8 : 1.4}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color="#00aaff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Corps principal du satellite - forme plus complexe */}
        <group>
          {/* Corps central */}
          <mesh
            onClick={handleClick}
            onPointerOver={handleHover}
            onPointerOut={handleUnhover}
          >
            <boxGeometry args={[0.5, 0.8, 0.5]} />
            <primitive object={satelliteBodyMaterial} />
          </mesh>
          
          {/* Module technique supérieur */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.25, 0.3, 8]} />
            <primitive object={satelliteBodyMaterial} />
          </mesh>
          
          {/* Module de communication */}
          <mesh position={[0, -0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <primitive object={satelliteBodyMaterial} />
          </mesh>
        </group>

        {/* Panneaux solaires */}
        <group>
          {/* Panneau droit */}
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 12]}>
            <boxGeometry args={[1.0, 0.08, 0.8]} />
            <primitive object={solarPanelMaterial} />
          </mesh>
          
          {/* Panneau gauche */}
          <mesh position={[-0.8, 0, 0]} rotation={[0, 0, -Math.PI / 12]}>
            <boxGeometry args={[1.0, 0.08, 0.8]} />
            <primitive object={solarPanelMaterial} />
          </mesh>
          
          {/* Supports de panneaux */}
          <mesh position={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <primitive object={antennaMaterial} />
          </mesh>
          <mesh position={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <primitive object={antennaMaterial} />
          </mesh>
        </group>

        {/* Antennes et équipements */}
        <group>
          {/* Antenne principale */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <primitive object={antennaMaterial} />
          </mesh>
          
          {/* Parabole */}
          <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 6, 0, 0]}>
            <coneGeometry args={[0.15, 0.1, 8]} />
            <primitive object={antennaMaterial} />
          </mesh>
          
          {/* Antennes latérales */}
          <mesh position={[0.2, 0.4, 0.2]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3]} />
            <primitive object={antennaMaterial} />
          </mesh>
          <mesh position={[-0.2, 0.4, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.01, 0.01, 0.3]} />
            <primitive object={antennaMaterial} />
          </mesh>
        </group>

        {/* Lumières clignotantes avec effets */}
        <group>
          <mesh position={[0.15, 0.2, 0.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial 
              color={hovered ? "#00ff88" : "#ff4444"}
              transparent
              opacity={0.9}
            />
          </mesh>
          
          <mesh position={[-0.15, 0.2, 0.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial 
              color={hovered ? "#ff4444" : "#00ff88"}
              transparent
              opacity={0.9}
            />
          </mesh>
          
          {/* LED de statut */}
          <mesh position={[0, 0.1, 0.3]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial 
              color={paused ? "#ffaa00" : "#00aaff"}
              transparent
              opacity={1.0}
            />
          </mesh>
        </group>

        {/* Particules d'échappement/propulsion */}
        {hovered && (
          <group position={[0, -0.6, 0]}>
            {[...Array(6)].map((_, i) => (
              <mesh 
                key={i} 
                position={[
                  (Math.random() - 0.5) * 0.2,
                  -Math.random() * 0.5,
                  (Math.random() - 0.5) * 0.2
                ]}
              >
                <sphereGeometry args={[0.02, 6, 6]} />
                <meshBasicMaterial 
                  color="#00ccff"
                  transparent
                  opacity={0.6}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Indicateur visuel quand le satellite est en pause */}
        {paused && (
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        )}

        {/* Tooltip du satellite - À propos de moi */}
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
                background: 'linear-gradient(135deg, rgba(0,170,255,0.95) 0%, rgba(0,102,204,0.95) 100%)',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '260px',
                maxWidth: '340px',
                boxShadow: '0 20px 40px rgba(0,170,255,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
                color: 'white',
                textAlign: 'left',
                pointerEvents: 'none',
                backdropFilter: 'blur(10px)',
                border: '2px solid #00aaff',
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
                width: '100%',
                height: '100px',
                borderRadius: '12px',
                marginBottom: '12px',
                background: 'linear-gradient(45deg, #00aaff40, #0066cc60)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(0, 170, 255, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 170, 255, 0.3)',
                }}>
                  <img
                    src="/avataar.png"
                    alt="Ethan Charpentier"
                    style={{ 
                      width: '76px',
                      height: '76px',
                      borderRadius: '14px',
                      filter: 'drop-shadow(0 0 8px rgba(0, 170, 255, 0.5))',
                      objectFit: 'cover',
                      objectPosition: 'center 1%',
                    }}
                  />
                </div>
              </div>
              
              <h3 style={{ 
                margin: '0 0 8px', 
                fontSize: '16px',
                background: 'linear-gradient(45deg, #ffffff, #ccddff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
              }}>
                🚀 {AboutMeData?.name || 'No Name found'}
              </h3>
              
              <p style={{ 
                fontSize: '12px',
                margin: '0 0 12px',
                color: '#e0f0ff',
                lineHeight: '1.4',
              }}>
                {AboutMeData?.description || 'No description available.'}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '10px',
                marginBottom: '12px'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>🎓 Formation</div>
                  <div>{AboutMeData?.education[0]?.institution || "Epitech Nantes"}</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>💼 Experience</div>
                  <div>+{AboutMeData?.experienceYears} years</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>🌍 Localisation</div>
                  <div>{AboutMeData?.location || "Nantes, France"}</div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>🎯 Passion</div>
                  <div>
                    {AboutMeData?.interests.join(', ') || "Game Development, AI, Optimization"}
                  </div>
                </div>
              </div>
              
              {/* Instructions d'interaction */}
              <div style={{ 
                fontSize: '9px', 
                color: '#b0d0ff',
                fontStyle: 'italic',
                marginBottom: '8px'
              }}>
                🛰️ Satellite personnel en orbite autour du système solaire
              </div>
              
              <div style={{ 
                fontSize: '8px', 
                color: '#90c0ff',
                fontStyle: 'italic',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '8px'
              }}>
                {paused 
                  ? 'Cliquez pour relancer l\'orbite' 
                  : 'Cliquez pour arrêter l\'orbite'
                }
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  )
}