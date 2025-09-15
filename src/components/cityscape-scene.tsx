
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

function Box(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta * 0.1));
  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#4760e6'} />
    </mesh>
  );
}

function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'#56c156'} />
        </mesh>
    )
}

function Buildings() {
    const buildings = [];
    for (let i = -20; i <= 20; i += 5) {
        for (let j = -20; j <= 20; j += 5) {
            const h = 2 + Math.random() * 6;
            buildings.push(
                 <mesh key={`${i}-${j}`} position={[i, h / 2 - 0.5, j]}>
                    <boxGeometry args={[2, h, 2]} />
                    <meshLambertMaterial color={'#4760e6'} />
                </mesh>
            )
        }
    }
    return <>{buildings}</>
}


export function CityscapeScene() {
  return (
    <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 10, 40], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[30, 50, 20]} intensity={0.9} />
            <Ground />
            <Buildings />
            <OrbitControls 
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </Canvas>
    </div>
  );
}
