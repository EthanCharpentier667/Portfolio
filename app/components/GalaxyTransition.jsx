import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export default function GalaxyTransition({ 
  isActive, 
  onTransitionComplete,
  duration = 3500 
}) {
  const startTime = useRef(null)

  useFrame((state) => {
    if (!isActive) return

    if (!startTime.current) {
      startTime.current = state.clock.elapsedTime * 1000
    }

    const elapsed = state.clock.elapsedTime * 1000 - startTime.current
    const progress = Math.min(elapsed / duration, 1)

    if (progress >= 1) {
      if (onTransitionComplete) {
        onTransitionComplete()
      }
      startTime.current = null
    }
  })

  return null
}
