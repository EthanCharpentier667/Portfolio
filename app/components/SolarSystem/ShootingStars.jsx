import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 12
const MIN_SPEED = 0.25
const MAX_SPEED = 1.2
const MIN_LENGTH = 0.25
const MAX_LENGTH = 0.7
const MIN_SIZE = 0.01
const MAX_SIZE = 0.025
const AREA = 30

function randomStar() {
  const angle = Math.random() * Math.PI * 2
  const radius = AREA * (0.7 + Math.random() * 0.3)
  const x = Math.cos(angle) * radius
  const y = Math.random() * 10 + 5
  const z = Math.sin(angle) * radius
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
  const length = MIN_LENGTH + Math.random() * (MAX_LENGTH - MIN_LENGTH)
  const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE)
  const direction = new THREE.Vector3(-1 + Math.random() * 2, -1.5 - Math.random(), -1 + Math.random() * 2).normalize()
  return { x, y, z, speed, length, size, direction, t: Math.random() * 100 }
}

export default function ShootingStars() {
  const stars = useMemo(() => Array.from({ length: STAR_COUNT }, randomStar), [])
  const group = useRef()

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.children.forEach((mesh, i) => {
      const star = stars[i]
      mesh.position.x += star.direction.x * star.speed * delta * 8
      mesh.position.y += star.direction.y * star.speed * delta * 8
      mesh.position.z += star.direction.z * star.speed * delta * 8
      star.t += delta
      if (
        mesh.position.x < -AREA || mesh.position.x > AREA ||
        mesh.position.y < -5 || mesh.position.y > AREA ||
        mesh.position.z < -AREA || mesh.position.z > AREA
      ) {
        const s = randomStar()
        mesh.position.set(s.x, s.y, s.z)
        star.direction = s.direction
        star.speed = s.speed
        star.length = s.length
        star.size = s.size
        star.t = 0
      }
    })
  })

  return (
    <group ref={group}>
      {stars.map((star, i) => (
        <mesh key={i} position={[star.x, star.y, star.z]}>
          <cylinderGeometry args={[star.size, star.size * 0.5, star.length, 6]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}
