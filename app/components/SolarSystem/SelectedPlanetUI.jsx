import React from 'react'
import SunDetailUI from './SelectedUI/SunDetailUI'
import PlanetDetailUI from './SelectedUI/PlanetDetailUI'
import SatelliteDetailUI from './SelectedUI/SatelliteDetailUI'
import AboutMeDetailUI from './SelectedUI/AboutMeDetailUI'

export default function SelectedPlanetUI({ selected, onClose }) {
  if (!selected) return null

  const renderDetailUI = () => {
    const name = selected.name?.toLowerCase() || ''
    if (name.includes('about') || name.includes('propos')) {
      return <AboutMeDetailUI selected={selected} onClose={onClose} />
    }
    if (name.includes('soleil') || name.includes('sun') || name.includes('compétences')) {
      return <SunDetailUI selected={selected} onClose={onClose} />
    }
    if (selected.type === 'satellite' || name.includes('équipe') || name.includes('team')) {
      return <SatelliteDetailUI selected={selected} onClose={onClose} />
    }
    return <PlanetDetailUI selected={selected} onClose={onClose} />
  }
  return renderDetailUI()
}