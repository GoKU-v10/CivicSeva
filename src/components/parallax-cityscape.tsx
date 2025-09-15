
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

  useFrame(({ camera, clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // 1. Continuous revolving and pulsing animation
    const radius = 20 - (scrollY.current * 18); // Decrease radius as user scrolls in
    const angle = elapsedTime * 0.1;
    const continuousX = Math.sin(angle) * radius;
    const continuousZ = Math.cos(angle) * radius;
    
    // 2. Scroll-based animation
    const scrollBasedY = 10 - scrollY.current * 7;
    const scrollBasedFov = 75 - scrollY.current * 40;

    // Combine animations
    camera.position.x = continuousX;
    camera.position.z = continuousZ;
    camera.position.y = scrollBasedY + Math.sin(elapsedTime) * 0.5; // Add a gentle bobbing motion
    
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = scrollBasedFov;
        camera.updateProjectionMatrix();
    }
    
    // Always look at the center of the scene
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
