import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SunParticles({ opacity = 1 }) {
  const timeRef = useRef(0)
  const groupRef = useRef()
  
  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime()
    
    if (groupRef.current) {
      const time = timeRef.current
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.type === 'flare') {
          const i = child.userData.index
          const angle = (i / 6) * Math.PI * 2
          const distance = 2.8 + Math.sin(time * 3 + i) * 0.3
          child.position.set(
            Math.cos(angle) * distance,
            Math.sin(angle * 0.5) * 0.8,
            Math.sin(angle) * distance
          )
          const delay = i * 0.1
          if (time > delay) {
            const progress = Math.min(1, (time - delay) * 3)
            child.scale.setScalar(progress * (0.8 + Math.sin(time * 4 + i) * 0.2))
            child.material.opacity = opacity * progress * (0.9 + Math.sin(time * 3 + i) * 0.1)
          }
        }
        
        if (child.userData.type === 'plasma') {
          const i = child.userData.index
          const angle = (i / 12) * Math.PI * 2 + time * 2
          const radius = 2.2 + Math.sin(i * 0.5) * 0.4
          const height = Math.sin(time * 4 + i) * 0.6
          child.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          )
          const delay = 0.2 + i * 0.05
          if (time > delay) {
            const progress = Math.min(1, (time - delay) * 4)
            child.scale.setScalar(progress)
            child.material.opacity = opacity * progress * (0.7 + Math.sin(time * 5 + i) * 0.3)
          }
        }
        
        if (child.userData.type === 'fire') {
          const i = child.userData.index
          const angle = (i / 20) * Math.PI * 2 + time * 8
          const radius = 1.8 + (Math.sin(i * 2) * 0.4)
          const height = Math.sin(time * 3 + i) * 0.6
          child.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          )
          const delay = 0.4 + i * 0.02
          if (time > delay) {
            const progress = Math.min(1, (time - delay) * 6)
            child.scale.setScalar(progress)
            child.material.opacity = opacity * progress * 0.8
          }
        }
        
        if (child.userData.type === 'ray') {
          const i = child.userData.index
          const rayMesh = child.children[0]
          if (rayMesh) {
            const delay = 0.6 + i * 0.1
            if (time > delay) {
              const progress = Math.min(1, (time - delay) * 2)
              child.scale.set(progress, 1, progress)
              rayMesh.material.opacity = opacity * progress * (0.6 + Math.sin(time * 6 + i) * 0.3)
            }
          }
        }
        
        if (child.userData.type === 'halo') {
          const baseScale = 3.5 + Math.sin(time * 3) * 0.3
          if (time > 0.1) {
            const progress = Math.min(1, time * 0.5)
            child.scale.setScalar(progress * baseScale)
            child.material.opacity = opacity * progress * (0.05 + Math.sin(time * 4) * 0.02)
          }
        }
        
        if (child.userData.type === 'ring') {
          const i = child.userData.index
          const delay = 0.8 + i * 0.2
          if (time > delay) {
            const progress = Math.min(1, (time - delay) * 1.5)
            const baseScale = progress * (2 + i * 0.5)
            child.scale.set(baseScale, baseScale, baseScale)
            child.rotation.z = time * (i + 1)
            child.material.opacity = opacity * progress * (0.3 - i * 0.08)
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} renderOrder={4000}>
      {/* Éruptions solaires principales */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={`flare-${i}`}
          userData={{ type: 'flare', index: i }}
          scale={[0, 0, 0]}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent 
            opacity={0}
          />
        </mesh>
      ))}

      {/* Plasma en orbite */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={`plasma-${i}`}
          userData={{ type: 'plasma', index: i }}
          scale={[0, 0, 0]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0}
          />
        </mesh>
      ))}

      {/* Particules de feu rapides */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={`fire-${i}`}
          userData={{ type: 'fire', index: i }}
          scale={[0, 0, 0]}
        >
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? "#ffff00" : i % 2 === 0 ? "#ff6600" : "#ff0000"} 
            transparent 
            opacity={0}
          />
        </mesh>
      ))}

      {/* Rayons solaires */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <group 
            key={`ray-${i}`} 
            rotation={[0, angle, 0]}
            userData={{ type: 'ray', index: i }}
            scale={[0, 1, 0]}
          >
            <mesh position={[3.5, 0, 0]} scale={[0.8, 0.05, 0.05]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial 
                color="#ffff99" 
                transparent 
                opacity={0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Halo pulsant */}
      <mesh userData={{ type: 'halo' }} scale={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Anneaux d'énergie */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={`ring-${i}`}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0, 0, 0]}
          userData={{ type: 'ring', index: i }}
        >
          <ringGeometry args={[1.8, 2, 32]} />
          <meshBasicMaterial
            color="#ff8800"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}