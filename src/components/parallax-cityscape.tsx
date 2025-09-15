
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
        // Reduce the number of buildings by increasing the step in the loops
        for (let i = -15; i <= 15; i += 5) {
            for (let j = -25; j <= 5; j += 5) {
                if (Math.abs(i) < 2 && Math.abs(j) < 2) continue;
                const height = 2 + Math.random() * 8;
                // Add some variety to width and depth
                const width = 2 + Math.random() * 0.5;
                const depth = 2 + Math.random() * 0.5;
                buildingData.push({
                    position: [i + (Math.random() - 0.5), height / 2, j + (Math.random() - 0.5)] as [number, number, number],
                    size: [width, height, depth] as [number, number, number],
                    color: '#4760e6'
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
                <meshLambertMaterial color="#56c156" />
            </mesh>
        </group>
    );
};


const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const scrollY = useRef(0);

  const handleScroll = () => {
    // We get the scroll position as a percentage (0-1)
    scrollY.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(({ camera }) => {
    // Animate camera position and zoom based on scroll
    // Move from z=20 to z=5 for a zoom-in effect
    camera.position.z = 20 - scrollY.current * 15;

    // Move from y=10 down to y=3
    camera.position.y = 10 - scrollY.current * 7;
    
    // Dolly zoom effect: zoom fov from 75 to 60
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 75 - scrollY.current * 15;
        camera.updateProjectionMatrix();
    }
    
    // Pan the camera view slightly
    camera.lookAt(0, 0, 0);
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
      {/* Add fog for atmospheric effect */}
      <fog attach="fog" args={['#34495e', 20, 50]} />
      <City />
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
