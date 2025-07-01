import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'
import SatelliteOrbit from './SatelliteOrbit'
import { cartoonVertexShader, cartoonFragmentShader, texturedCartoonVertexShader, texturedCartoonFragmentShader } from './CartoonShaders'

export default function Planet({ 
  data, 
  onClick, 
  paused, 
  setPaused, 
  resetTrigger, 
  isActivePlanet, 
  sunPosition = [0, 0, 0], 
  camera: propCamera, 
  controls: propControls, 
  gl,
  overviewCameraPosition = [0, 8, 16],
  overviewCameraTarget = [0, 0, 0]
}) {
  const planetMeshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [hoveredSatellite, setHoveredSatellite] = useState(null)
  const [planetPaused, setPlanetPaused] = useState(false)
  const [showSatellites, setShowSatellites] = useState(false)
  const [planetScale, setPlanetScale] = useState(1)
  const [atmosphereScale, setAtmosphereScale] = useState(1.2)
  const pausedTimeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const { camera: threeCamera, controls: threeControls } = useThree()
  const [tooltipProps, setTooltipProps] = useState({ position: [0, 3, 0], distanceFactor: 8 })
  const camera = propCamera || threeCamera
  const controls = propControls || threeControls
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [isDezooming, setIsDezooming] = useState(false)
  const zoomProgressRef = useRef(0)
  const originalCameraPos = useRef(null)
  const originalControlsTarget = useRef(null)
  const targetCameraPos = useRef(null)
  const targetControlsTarget = useRef(null)
  const zoomSpeed = 0.02
  const initialPositionsSaved = useRef(false)

  const planetTexture = useMemo(() => {
    if (data.texture) {
      const loader = new THREE.TextureLoader()
      try {
        const texture = loader.load(data.texture)
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        texture.generateMipmaps = false
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        
        return texture
      } catch (error) {
        console.warn(`Erreur de chargement de texture pour ${data.name}:`, error)
      }
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')
    
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, data.color)
    gradient.addColorStop(1, '#000000')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
    
    return new THREE.CanvasTexture(canvas)
  }, [data.color, data.texture, data.name])

  const glowIntensity = useMemo(() => {
    const minDistance = 2
    const maxDistance = 15
    const baseEmissive = data.shaderVars?.emissiveStrength || 0.1
    
    const normalizedDistance = Math.max(0, Math.min(1, (data.distance - minDistance) / (maxDistance - minDistance)))
    const distanceMultiplier = 1 - normalizedDistance
    
    return baseEmissive * (0.5 + distanceMultiplier * 2)
  }, [data.distance, data.shaderVars?.emissiveStrength, data.materialType])

  const texturedCartoonMaterial = useMemo(() => {
    if (!data.texture || !data.theme) return null
    
    return new THREE.ShaderMaterial({
      vertexShader: texturedCartoonVertexShader,
      fragmentShader: texturedCartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        planetTexture: { value: planetTexture },
        primaryColor: { value: new THREE.Color(data.theme.primary) },
        secondaryColor: { value: new THREE.Color(data.theme.secondary) },
        accentColor: { value: new THREE.Color(data.theme.accent) },
        emissiveColor: { value: new THREE.Color(data.theme.emissive) },
        glowColor: { value: new THREE.Color(data.color) },
        isHovered: { value: false },
        noiseScale: { value: data.shaderVars?.noiseScale || 8.0 },
        animSpeed: { value: data.shaderVars?.animSpeed || 0.1 },
        rimPower: { value: data.shaderVars?.rimPower || 2.0 },
        emissiveStrength: { value: glowIntensity },
        patternIntensity: { value: data.materialType === 'none' ? 0 : 0.8 },
        patternType: { value: data.materialType === 'gaming' ? 0 : data.materialType === 'tech' ? 1 : data.materialType === 'money' ? 2 : data.materialType === 'love' ? 3 : data.materialType === 'hexagon' ? 4 : data.materialType === 'matrix' ? 5 : 0 },
        textureBoost: { value: 2 },
        cartoonPosterize: { value: 6.0 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) }
      },
      transparent: true
    })
  }, [data.texture, data.theme, data.shaderVars, data.materialType, data.color, planetTexture, glowIntensity, sunPosition])

  const cartoonMaterial = useMemo(() => {
    if (data.texture || !data.theme) return null
    
    return new THREE.ShaderMaterial({
      vertexShader: cartoonVertexShader,
      fragmentShader: cartoonFragmentShader,
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(data.theme.primary) },
        secondaryColor: { value: new THREE.Color(data.theme.secondary) },
        accentColor: { value: new THREE.Color(data.theme.accent) },
        emissiveColor: { value: new THREE.Color(data.theme.emissive) },
        glowColor: { value: new THREE.Color(data.color) },
        isHovered: { value: false },
        noiseScale: { value: data.shaderVars?.noiseScale || 8.0 },
        animSpeed: { value: data.shaderVars?.animSpeed || 0.1 },
        rimPower: { value: data.shaderVars?.rimPower || 2.0 },
        emissiveStrength: { value: data.materialType === 'none' ? 0 : glowIntensity },
        patternIntensity: { value: data.materialType === 'none' ? 0 : 0.8 },
        patternType: { value: data.materialType === 'gaming' ? 0 : data.materialType === 'tech' ? 1 : data.materialType === 'money' ? 2 : data.materialType === 'love' ? 3 : data.materialType === 'hexagon' ? 4 : data.materialType === 'matrix' ? 5 : 0 },
        sunPosition: { value: new THREE.Vector3(...sunPosition) }
      },
      transparent: true
    })
  }, [data.texture, data.theme, data.shaderVars, data.materialType, data.color, glowIntensity, sunPosition])

  const getTooltipProps = () => {
    let distance = camera.position.length()
    if (controls && controls.getDistance) {
      distance = controls.getDistance()
    }
    const minDistance = 1
    const maxDistance = 50
    const normalizedZoom = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)))
        const positionY = (data.size + 1.5) + (normalizedZoom * 3)
    const distanceFactor = 1 + (normalizedZoom * 15)
    return {
      position: [0, positionY, 0],
      distanceFactor: distanceFactor
    }
  }

  useEffect(() => {
    if (resetTrigger > 0 && !isActivePlanet) {
      setIsZooming(false)
      setIsDezooming(false)
      setIsZoomedIn(false)
      zoomProgressRef.current = 0
      targetCameraPos.current = null
      targetControlsTarget.current = null
      setPlanetPaused(false)
      setShowSatellites(false)
      setHoveredSatellite(null)
    }
  }, [resetTrigger, isActivePlanet])

  useFrame(({ clock }) => {
    setTooltipProps(getTooltipProps())
    const currentTime = clock.getElapsedTime()
    
    const targetPlanetScale = hovered ? 1.3 : 1
    const targetAtmosphereScale = hovered ? 1.5 : 1.2
    const scaleSpeed = 5
    
    setPlanetScale(prev => {
      const diff = targetPlanetScale - prev
      return prev + diff * scaleSpeed * (1/60)
    })
    
    setAtmosphereScale(prev => {
      const diff = targetAtmosphereScale - prev
      return prev + diff * scaleSpeed * (1/60)
    })
    
    if (!initialPositionsSaved.current) {
      saveInitialPositions()
    }
    if (isZooming && camera && controls && controls.target && isActivePlanet) {
      zoomProgressRef.current += zoomSpeed
      if (zoomProgressRef.current >= 1) {
        zoomProgressRef.current = 1
        setIsZooming(false)
        setIsZoomedIn(true)
      }
      const t = easeInOutCubic(zoomProgressRef.current)
      if (originalCameraPos.current && targetCameraPos.current) {
        camera.position.lerpVectors(originalCameraPos.current, targetCameraPos.current, t)
      }
      if (originalControlsTarget.current && targetControlsTarget.current) {
        controls.target.lerpVectors(originalControlsTarget.current, targetControlsTarget.current, t)
      }
      controls.update()
    }
    if (isDezooming && camera && controls && controls.target && isActivePlanet) {
      zoomProgressRef.current += zoomSpeed
      if (zoomProgressRef.current >= 1) {
        zoomProgressRef.current = 1
        setIsDezooming(false)
        setIsZoomedIn(false)
        targetCameraPos.current = null
        targetControlsTarget.current = null
        setPlanetPaused(false)
        setShowSatellites(false)
        setHoveredSatellite(null)
        // Correction : forcer la caméra et le target à la position de base
        camera.position.set(...overviewCameraPosition)
        controls.target.set(...overviewCameraTarget)
        controls.update()
      } else {
        const t = easeInOutCubic(zoomProgressRef.current)
        if (originalCameraPos.current && targetCameraPos.current) {
          camera.position.lerpVectors(originalCameraPos.current, targetCameraPos.current, t)
        }
        if (originalControlsTarget.current && targetControlsTarget.current) {
          controls.target.lerpVectors(originalControlsTarget.current, targetControlsTarget.current, t)
        }
        controls.update()
      }
    }
    if (texturedCartoonMaterial) {
      texturedCartoonMaterial.uniforms.time.value = currentTime
      texturedCartoonMaterial.uniforms.isHovered.value = hovered
    }
    
    if (cartoonMaterial) {
      cartoonMaterial.uniforms.time.value = currentTime
      cartoonMaterial.uniforms.isHovered.value = hovered
    }
    const shouldPause = paused || planetPaused || isZooming || isDezooming
    if (!shouldPause) {
      const effectiveTime = (currentTime - pausedTimeRef.current) * data.speed
      const x = Math.cos(effectiveTime) * data.distance
      const z = Math.sin(effectiveTime) * data.distance
      if (planetMeshRef.current) {
        planetMeshRef.current.position.set(x, 0, z)
      } 
      lastTimeRef.current = currentTime
    } else {
      pausedTimeRef.current += currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime
    }
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += data.rotationSpeed || 0.005
    }
  })

  const handleHover = () => {
    setHovered(true)
    setPaused(true)
    if (data.satellites && data.satellites.length > 0) {
      setShowSatellites(true)
    }
  }

  const handleUnhover = () => {
    setHovered(false)
    setPaused(false)
    if (!planetPaused) {
      setShowSatellites(false)
    }
  }

  const handleZoom = () => {
    if (isZooming || isDezooming) {
      console.log('Animation en cours, clic ignoré')
      return
    }
    if (!isZoomedIn) {
      const zoomPositions = calculateZoomPosition()
      if (zoomPositions) {
        originalCameraPos.current = camera.position.clone()
        originalControlsTarget.current = controls.target.clone()
        targetCameraPos.current = zoomPositions.cameraPos
        targetControlsTarget.current = zoomPositions.targetPos
        zoomProgressRef.current = 0
        setIsZooming(true)
        setIsDezooming(false)
      }
    } else {
      originalCameraPos.current = camera.position.clone()
      originalControlsTarget.current = controls.target.clone()
      targetCameraPos.current = new THREE.Vector3(...overviewCameraPosition)
      targetControlsTarget.current = new THREE.Vector3(...overviewCameraTarget)
      zoomProgressRef.current = 0
      setIsDezooming(true)
      setIsZooming(false)
    }
  }

  const handlePlanetClick = () => {
    console.log('=== Planet clicked ===')
    console.log('Planet:', data.name)
    console.log('Current state - isZoomedIn:', isZoomedIn, 'isZooming:', isZooming, 'isDezooming:', isDezooming, 'planetPaused:', planetPaused)
    console.log('Camera available:', !!camera, 'Controls available:', !!controls, 'Controls target:', !!controls?.target)
    saveInitialPositions()
    if (isZoomedIn) {
      if (camera && controls && controls.target) {
        handleZoom()
      }
      setTimeout(() => {
        onClick(null)
      }, 600)
      return
    }
    setPlanetPaused(!planetPaused)
    if (showSatellites && planetPaused) {
      setShowSatellites(false)
    } else {
      setShowSatellites(true)
    }
    if (camera && controls && controls.target) {
      handleZoom()
    } else {
      console.log('Camera or controls not available for zoom')
      console.log('Debug - camera:', camera, 'controls:', controls, 'controls.target:', controls?.target)
    }
    
    onClick(data)
  }

  const handleSatelliteClick = (satellite) => {
    if (satellite.link) {
      window.open(satellite.link, '_blank')
    }
  }
  const calculateZoomPosition = () => {
    if (!planetMeshRef.current) return null
    
    const planetPos = planetMeshRef.current.position
    const zoomDistance = Math.max(data.size * 3, 4)
    const cameraOffset = new THREE.Vector3(
      zoomDistance,
      zoomDistance * 0.5,
      zoomDistance
    )
    
    return {
      cameraPos: planetPos.clone().add(cameraOffset),
      targetPos: planetPos.clone()
    }
  }

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const saveInitialPositions = () => {
    if (!initialPositionsSaved.current && camera && controls && controls.target) {
      originalCameraPos.current = new THREE.Vector3(...overviewCameraPosition)
      originalControlsTarget.current = new THREE.Vector3(...overviewCameraTarget)
      initialPositionsSaved.current = true
      console.log('Overview positions set:', {
        camera: originalCameraPos.current,
        target: originalControlsTarget.current,
        overviewCameraPosition,
        overviewCameraTarget
      })
    }
  }

  return (
    <>
      {/* Se déplace en orbite autour du soleil */}
      <group ref={planetMeshRef}>
        {/* Atmosphère/Glow effect */}
        {data.hasAtmosphere && data.materialType !== 'none' && <mesh scale={atmosphereScale}>
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={glowIntensity * 0.15}
            side={THREE.BackSide}
          />
        </mesh>
        }
        {/* Planète principale */}
        <mesh
          scale={planetScale}
          onClick={handlePlanetClick}
          onPointerOver={handleHover}
          onPointerOut={handleUnhover}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[data.size, 64, 64]} />
          {texturedCartoonMaterial ? (
            <primitive object={texturedCartoonMaterial} />
          ) : cartoonMaterial ? (
            <primitive object={cartoonMaterial} />
          ) : (
            <meshStandardMaterial
              map={planetTexture}
              color={data.texture ? "#ffffff" : data.color}
              emissive={data.texture ? "#444444" : data.color}
              emissiveIntensity={data.texture ? (hovered ? glowIntensity * 0.1 : glowIntensity * 0.05) : (hovered ? glowIntensity * 0.4 : glowIntensity * 0.2)} // ✨ Émission dynamique selon distance
              metalness={data.metalness || 0.2}
              roughness={data.roughness || 0.8}
              transparent
              opacity={hovered ? 1 : 0.9}
              bumpScale={0.1}
              normalScale={new THREE.Vector2(0.5, 0.5)}
            />
          )}
        </mesh>

        {/* Titre du projet au-dessus de la planète */}
        <Html
          position={[0, data.size + 0.4, 0]}
          center
          distanceFactor={8}
          occlude={false}
          transform
          sprite
          zIndexRange={[10, 0]}
        >
          <div style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6), 1px 1px 2px rgba(0,0,0,1)',
            padding: '4px 8px',
            borderRadius: '4px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            filter: 'brightness(1.2)',
            zIndex: 10,
            position: 'relative',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.5px'
          }}>
            {data.name}
          </div>
        </Html>

        {/* Indicateur visuel quand la planète est en pause */}
        {planetPaused && (
          <Html
            position={[0, data.size + 1.2, 0]}
            center
            distanceFactor={6}
            occlude={false}
            transform
            sprite
            zIndexRange={[50, 0]}
          >
            <div style={{
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center',
              textShadow: '0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.6)',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'Arial, sans-serif',
              animation: 'gentleBlink 2s ease-in-out infinite',
              backdropFilter: 'blur(4px)'
            }}>
              <style jsx>{`
                @keyframes gentleBlink {
                  0%, 100% { opacity: 0.7; }
                  50% { opacity: 1; }
                }
              `}</style>
              Cliquez pour reprendre l'orbite
            </div>
          </Html>
        )}

        {/* Anneaux pour certaines planètes */}
        {data.hasRings && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.size * 1.5, data.size * 2.2, 64]} />
            <meshBasicMaterial
              color={data.ringColor || '#ffffff'}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Tooltip de la planète - ADAPTATIF AU ZOOM CANVAS */}
        {hovered && (
          <Html 
            position={tooltipProps.position}
            center
            distanceFactor={tooltipProps.distanceFactor}
            occlude={false}
            transform
            sprite
            zIndexRange={[100, 0]}
          >
            <div style={{
              background: `linear-gradient(135deg, rgba(15,15,15,0.95) 0%, rgba(30,30,30,0.95) 100%)`,
              borderRadius: '12px',
              padding: '12px',
              minWidth: '250px',
              maxWidth: '300px',
              boxShadow: `0 20px 40px rgba(0,0,0,0.7), 0 0 0 1px ${data.color}40`,
              color: 'white',
              textAlign: 'center',
              pointerEvents: 'none',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${data.color}`,
              animation: 'fadeInScale 0.3s ease-out',
              transformOrigin: 'center bottom',
              transition: 'all 0.2s ease-out',
              zIndex: 100,
              position: 'relative'
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
              
              <div style={{
                width: '100%',
                height: '80px',
                borderRadius: '12px',
                marginBottom: '12px',
                background: `linear-gradient(45deg, ${data.color}20, ${data.color}40)`,
                border: `1px solid ${data.color}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8em',
              }}>
                {data.icon || '🪐'}
              </div>
              <h3 style={{ 
                margin: '0 0 8px', 
                fontSize: '16px',
                background: `linear-gradient(45deg, ${data.color}, white)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                {data.name}
              </h3>
              <p style={{ 
                fontSize: '12px', 
                margin: '0 0 8px',
                color: '#cccccc',
                lineHeight: '1.4'
              }}>
                {data.description}
              </p>
              {data.satellites && (
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    🌙 Équipe ({data.satellites.length} membres)
                  </div>
                  <div>
                    {showSatellites 
                      ? 'Survolez les satellites pour voir l\'équipe' 
                      : 'Hover ou cliquez pour voir l\'équipe'
                    }
                  </div>
                </div>
              )}
              {data.stats && (
                <div style={{ fontSize: '10px', color: '#999' }}>
                  <div>Taille: {data.stats.size}</div>
                  <div>Distance: {data.stats.distance}</div>
                </div>
              )}
              
              <div style={{ 
                fontSize: '9px', 
                color: '#aaa',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {planetPaused 
                  ? (showSatellites ? 'Cliquez pour cacher l\'équipe et relancer' : 'Cliquez pour relancer l\'orbite')
                  : 'Cliquez pour fixer l\'équipe et arrêter l\'orbite'
                }
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* SATELLITES : Groupe séparé qui suit la planète */}
      {showSatellites && data.satellites && data.satellites.map((satellite, index) => {
        const satelliteDistance = data.size * 2.5 + (index * 0.8)
        const satelliteSpeed = data.speed * (2 + index)
        
        return (
          <group 
            key={`satellite-group-${index}`}
            position={planetMeshRef.current?.position || [0, 0, 0]}
          >
            {/* Orbite du satellite */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[satelliteDistance - 0.02, satelliteDistance + 0.02, 64]} />
              <meshBasicMaterial
                color={satellite.orbitColor || '#666666'}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
                depthTest={true}
                renderOrder={50}
              />
            </mesh>

            {/* Satellite en orbite */}
            <SatelliteOrbit
              satellite={satellite}
              satelliteDistance={satelliteDistance}
              satelliteSpeed={satelliteSpeed}
              index={index}
              hoveredSatellite={hoveredSatellite}
              setHoveredSatellite={setHoveredSatellite}
              handleSatelliteClick={handleSatelliteClick}
              planetPaused={planetPaused}
              showSatellites={showSatellites}
              sunPosition={sunPosition}
            />
          </group>
        )
      })}
    </>
  )
}