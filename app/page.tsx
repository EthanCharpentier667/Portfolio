'use client'

import dynamic from 'next/dynamic'

const SolarSystem = dynamic(() => import('./components/SolarSystem'), { ssr: false })

export default function Page() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <SolarSystem />
    </main>
  )
}
