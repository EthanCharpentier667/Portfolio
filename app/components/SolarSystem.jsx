import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import React, { useState } from 'react'
import Sun from './SolarSystem/Sun'
import Planet from './SolarSystem/Planet'
import AboutMeSatellite from './SolarSystem/AboutMeSatellite'
import SelectedPlanetUI from './SolarSystem/SelectedPlanetUI'
import WelcomeMenu from './WelcomeMenu'
import TransitionOverlay from './TransitionOverlay'
import planetData from '../data/PlanetData'
import ShootingStars from './SolarSystem/ShootingStars'
import PortfolioHelpUI from './PortfolioHelpUI'

function SolarSystemScene({ 
  showWelcome, 
  isTransitioning, 
  sunPosition, 
  setSelected, 
  resetSatellite, 
  planetData, 
  handlePlanetClick, 
  paused, 
  setPaused, 
  resetPlanets, 
  activePlanetName 
}) {
  const { camera, gl } = useThree()
  const [controls, setControls] = useState(null)

  return (
    <>
      {/* Contrôles (seulement actifs quand pas en transition) */}
      <OrbitControls 
        ref={setControls}
        enabled={!isTransitioning}
        enableZoom 
        maxDistance={50}
        minDistance={5}
        enablePan={false}
      />
      
      {/* Étoiles de fond */}
      <Stars 
        radius={200} 
        depth={50} 
        count={8000} 
        factor={25} 
        fade 
        speed={0.5}
      />

      {/* Lumière principale pour le système solaire */}
      {!showWelcome && (
        <pointLight position={sunPosition} intensity={1.5} color="#ffffff" />
      )}
      
      {/* Système solaire (caché pendant le menu d'accueil) */}
      {!showWelcome && (
        <>
          <Sun onSelect={setSelected} />
          
          <AboutMeSatellite 
            onSelect={setSelected} 
            resetTrigger={resetSatellite}
            sunPosition={sunPosition}
          />
      
          {planetData.map((planet, idx) => (
            <Planet
              key={idx}
              data={planet}
              onClick={handlePlanetClick}
              paused={paused}
              setPaused={setPaused}
              resetTrigger={resetPlanets}
              isActivePlanet={activePlanetName === planet.name}
              sunPosition={sunPosition}
              camera={camera}
              controls={controls}
              gl={gl}
              overviewCameraPosition={[0, 5, 12]}
              overviewCameraTarget={[0, 0, 0]}
            />
          ))}
        </>
      )}

      {/* Étoiles filantes animées */}
      <ShootingStars />
    </>
  )
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(null)
  const [paused, setPaused] = useState(false)
  const [resetPlanets, setResetPlanets] = useState(0)
  const [activePlanetName, setActivePlanetName] = useState(null)
  const [resetSatellite, setResetSatellite] = useState(0)
  
  const [showWelcome, setShowWelcome] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPreparingTransition, setIsPreparingTransition] = useState(false)
  
  const sunPosition = [0, 0, 0]

  const handlePlanetClick = (planetData) => {
    if (!planetData) {
      handleClose()
      return
    }
    if (activePlanetName === planetData.name && selected) {
      handleClose()
      return
    }
    if (activePlanetName && activePlanetName !== planetData.name) {
      setResetPlanets(prev => prev + 1)
    }
    setActivePlanetName(planetData.name)
    setSelected(planetData)
  }

  const handleClose = () => {
    setSelected(null)
    setPaused(false)
    setActivePlanetName(null)
    setResetPlanets(prev => prev + 1)
    setResetSatellite(prev => prev + 1)
  }

  const handleStartJourney = () => {
    setShowWelcome(false)
  }

  const handleStartTransition = () => {
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    setIsTransitioning(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 2000 }}>
        <SelectedPlanetUI 
          selected={selected} 
          onClose={handleClose} 
        />
      </div>
      {!isTransitioning && !showWelcome && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 1200 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <PortfolioHelpUI />
          </div>
        </div>
      )}
      {/* Écran de transition */}
      <TransitionOverlay 
        isActive={isTransitioning} 
        duration={2500} 
        onComplete={handleTransitionComplete}
      />
      {/* Menu d'accueil */}
      {showWelcome && (
        <WelcomeMenu 
          onStartJourney={handleStartJourney} 
          onStartTransition={handleStartTransition}
          isPreparingTransition={isPreparingTransition}
        />
      )}
      <Canvas 
        camera={{ position: [0, 5, 12], fov: 60 }}
        gl={{ antialias: true }}
      >
        <SolarSystemScene 
          showWelcome={showWelcome}
          isTransitioning={isTransitioning}
          sunPosition={sunPosition}
          setSelected={setSelected}
          resetSatellite={resetSatellite}
          planetData={planetData}
          handlePlanetClick={handlePlanetClick}
          paused={paused}
          setPaused={setPaused}
          resetPlanets={resetPlanets}
          activePlanetName={activePlanetName}
        />
      </Canvas>
    </div>
  )
}