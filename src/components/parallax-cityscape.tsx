
'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position }: { position: [number, number, number] }) => {
    const ref = useRef<THREE.Group>(null!);

    const buildingData = useMemo(() => {
        const parts = [];
        const mainHeight = 4 + Math.random() * 10;
        const mainWidth = 2 + Math.random();
        const mainDepth = 2 + Math.random();
        
        const colors = ['#A9A9A9', '#BEBEBE', '#D3D3D3', '#C0C0C0'];
        const roofColor = '#696969';

        // Main tower
        parts.push({
            position: [0, mainHeight / 2, 0] as [number, number, number],
            size: [mainWidth, mainHeight, mainDepth] as [number, number, number],
            color: colors[Math.floor(Math.random() * colors.length)]
        });

        // Roof
         parts.push({
            position: [0, mainHeight + 0.1, 0] as [number, number, number],
            size: [mainWidth, 0.2, mainDepth] as [number, number, number],
            color: roofColor
        });

        // Lower section (bungalow-like)
        if (Math.random() > 0.5) {
            const sideHeight = 1 + Math.random() * 2;
            const sideWidth = mainWidth * (0.6 + Math.random() * 0.4);
            const sideDepth = mainDepth * (0.6 + Math.random() * 0.4);
            const sideX = (mainWidth / 2 + sideWidth / 2) * (Math.random() > 0.5 ? 1 : -1);
            
            parts.push({
                position: [sideX, sideHeight / 2, 0] as [number, number, number],
                size: [sideWidth, sideHeight, sideDepth] as [number, number, number],
                color: colors[Math.floor(Math.random() * colors.length)]
            });
             parts.push({
                position: [sideX, sideHeight + 0.1, 0] as [number, number, number],
                size: [sideWidth, 0.2, sideDepth] as [number, number, number],
                color: roofColor
            });
        }
        
        return parts;
    }, []);

    useFrame((state) => {
        // Gentle bobbing animation
        const t = state.clock.getElapsedTime();
        ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.05;
    });

    return (
        <group ref={ref} position={position}>
            {buildingData.map((part, index) => (
                <mesh key={index} position={part.position}>
                    <boxGeometry args={part.size} />
                    <meshLambertMaterial color={part.color} />
                </mesh>
            ))}
        </group>
    );
};

const City = () => {
    const buildings = useMemo(() => {
        const buildingData = [];
        // Increase the step to reduce building density
        for (let i = -20; i <= 20; i += 6) {
            for (let j = -30; j <= 2; j += 6) {
                // Add some randomness to position to avoid a perfect grid
                const x = i + (Math.random() - 0.5) * 3;
                const z = j + (Math.random() - 0.5) * 3;
                if (Math.abs(x) < 3 && Math.abs(z) < 3) continue; // Keep center clear
                buildingData.push({
                    position: [x, 0, z] as [number, number, number],
                });
            }
        }
        return buildingData;
    }, []);

    return (
        <group>
            {buildings.map((b, index) => (
                <Building key={index} position={b.position} />
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

  useFrame(({ camera, clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // 1. Continuous revolving and pulsing animation when not scrolling
    const radius = 25 - (scrollY.current * 22); // Decrease radius as user scrolls in
    const angle = elapsedTime * 0.08; // Slower revolution
    const continuousX = Math.sin(angle) * radius;
    const continuousZ = Math.cos(angle) * radius;
    
    // 2. Scroll-based animation
    const scrollBasedY = 12 - scrollY.current * 9;
    const scrollBasedFov = 75 - scrollY.current * 50; // Enhanced "dolly zoom"

    // Combine animations
    camera.position.x = continuousX;
    camera.position.z = continuousZ;
    // Add a gentle "breathing" bobbing motion
    camera.position.y = scrollBasedY + Math.sin(elapsedTime * 0.5) * 0.5; 
    
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, scrollBasedFov, 0.1);
        camera.updateProjectionMatrix();
    }
    
    // Always look at the center of the scene
    camera.lookAt(0, 2, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 10, 25]} fov={75} />
      <ambientLight intensity={0.9} />
      <directionalLight 
        position={[15, 25, 10]}
        intensity={1.8}
        castShadow
      />
      {/* Add fog for atmospheric effect */}
      <fog attach="fog" args={['#34495e', 25, 60]} />
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
