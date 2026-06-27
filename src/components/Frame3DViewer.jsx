import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { SAMPLE_FRAME } from '../constants'

function PictureFrame({ imageUrl, width, height }) {
  const texture = useTexture(imageUrl, undefined, undefined, (loader) => {
    loader.setCrossOrigin('anonymous')
  })
  const border = 0.07
  const depth = 0.05

  const frameColor = SAMPLE_FRAME.color
  const innerW = width
  const innerH = height
  const outerW = innerW + border * 2
  const outerH = innerH + border * 2

  const pieces = useMemo(
    () => [
      { pos: [0, innerH / 2 + border / 2, 0], size: [outerW, border, depth] },
      { pos: [0, -(innerH / 2 + border / 2), 0], size: [outerW, border, depth] },
      { pos: [-(innerW / 2 + border / 2), 0, 0], size: [border, innerH, depth] },
      { pos: [innerW / 2 + border / 2, 0, 0], size: [border, innerH, depth] },
    ],
    [innerW, innerH, outerW, border, depth],
  )

  return (
    <group>
      <mesh position={[0, 0, -depth / 2]}>
        <boxGeometry args={[innerW, innerH, depth * 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[0, 0, depth * 0.05]}>
        <planeGeometry args={[innerW * 0.96, innerH * 0.96]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {pieces.map((piece, i) => (
        <mesh key={i} position={piece.pos}>
          <boxGeometry args={piece.size} />
          <meshStandardMaterial
            color={frameColor}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ imageUrl, width, height }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <PictureFrame imageUrl={imageUrl} width={width} height={height} />
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.4}
      />
    </>
  )
}

export default function Frame3DViewer({ imageUrl, width, height }) {
  return (
    <div className="viewer-canvas">
      <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene imageUrl={imageUrl} width={width} height={height} />
        </Suspense>
      </Canvas>
      <p className="viewer-hint">Drag to rotate 360°</p>
    </div>
  )
}
