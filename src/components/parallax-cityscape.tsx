
'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position, size, color }: { position: [number, number, number], size: [number, number, number], color: string }) => {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    // Subtle animation
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};

const City = () => {
    const buildings = useMemo(() => {
        const buildingData = [];
        for (let i = -15; i <= 15; i += 3) {
            for (let j = -25; j <= 10; j += 3) {
                if (Math.abs(i) < 2 && Math.abs(j) < 2) continue;
                const height = 2 + Math.random() * 8;
                buildingData.push({
                    position: [i + (Math.random() - 0.5), height / 2, j + (Math.random() - 0.5)] as [number, number, number],
                    size: [2, height, 2] as [number, number, number],
                    color: ['#4760e6', '#ffb85c', '#ff8f61', '#f2e86d'][Math.floor(Math.random() * 4)]
                });
            }
        }
        return buildingData;
    }, []);

    return (
        <group>
            {buildings.map((b, index) => (
                <Building key={index} {...b} />
            ))}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshLambertMaterial color="#2c3e50" />
            </mesh>
        </group>
    );
};


const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const scrollY = useRef(0);

  const handleScroll = () => {
    scrollY.current = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(({ camera }) => {
    // Scroll-based camera animation
    const scrollFactor = scrollY.current / (document.body.scrollHeight - window.innerHeight);
    camera.position.z = 20 - scrollFactor * 15;
    camera.position.y = 10 - scrollFactor * 5;
    camera.rotation.x = -0.5 + scrollFactor * 0.3;
    camera.lookAt(0,0,0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 10, 20]} fov={75} />
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 20, 5]}
        intensity={1.5}
        castShadow
      />
      <City />
      <fog attach="fog" args={['#34495e', 20, 50]} />
    </>
  );
};

export default function ParallaxCityscape() {
  return (
    <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-transparent z-10" />
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  );
}
