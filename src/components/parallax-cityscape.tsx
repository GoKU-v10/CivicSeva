
'use client';
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const createBuildingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const context = canvas.getContext('2d');
  
    if (!context) {
      // Fallback in case canvas is not supported
      return new THREE.MeshLambertMaterial({ color: '#A9A9A9' });
    }
  
    // Building color
    context.fillStyle = '#A9A9A9';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Window color
    context.fillStyle = '#444466'; // Dark blue/grey for windows
    
    // Increased gap to reduce window count
    const windowWidth = 8;
    const windowHeight = 10;
    const xGap = 16; 
    const yGap = 24;
  
    // Create a grid of windows
    for (let y = yGap / 2; y < canvas.height; y += windowHeight + yGap) {
      for (let x = xGap / 2; x < canvas.width; x += windowWidth + xGap) {
        context.fillRect(x, y, windowWidth, windowHeight);
      }
    }
  
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // This will be scaled per building part
  
    return texture;
};
  
const Building = ({ position, isHospital }: { position: [number, number, number], isHospital?: boolean }) => {
    const ref = useRef<THREE.Group>(null!);

    const buildingData = useMemo(() => {
        const parts = [];
        const mainHeight = isHospital ? 8 : 4 + Math.random() * 10;
        const mainWidth = isHospital ? 5 : 2 + Math.random();
        const mainDepth = isHospital ? 5 : 2 + Math.random();
        
        const roofColor = '#696969';
        const buildingColor = isHospital ? '#FFFFFF' : '#A9A9A9';
        const windowTexture = createBuildingTexture();


        // Main tower
        parts.push({
            position: [0, mainHeight / 2, 0] as [number, number, number],
            size: [mainWidth, mainHeight, mainDepth] as [number, number, number],
            texture: isHospital ? null : windowTexture.clone(),
            color: buildingColor
        });

        // Roof
         parts.push({
            position: [0, mainHeight + 0.1, 0] as [number, number, number],
            size: [mainWidth, 0.2, mainDepth] as [number, number, number],
            color: roofColor
        });

        // Lower section (bungalow-like)
        if (Math.random() > 0.5 && !isHospital) {
            const sideHeight = 1 + Math.random() * 2;
            const sideWidth = mainWidth * (0.6 + Math.random() * 0.4);
            const sideDepth = mainDepth * (0.6 + Math.random() * 0.4);
            const sideX = (mainWidth / 2 + sideWidth / 2) * (Math.random() > 0.5 ? 1 : -1);
            
            parts.push({
                position: [sideX, sideHeight / 2, 0] as [number, number, number],
                size: [sideWidth, sideHeight, sideDepth] as [number, number, number],
                texture: windowTexture.clone(),
                color: buildingColor
            });
             parts.push({
                position: [sideX, sideHeight + 0.1, 0] as [number, number, number],
                size: [sideWidth, 0.2, sideDepth] as [number, number, number],
                color: roofColor
            });
        }
        
        // Apply texture repeats based on geometry
        parts.forEach(part => {
            if (part.texture) {
                const [width, height, depth] = part.size;
                // Rough estimation for texture repeat based on surface area
                part.texture.repeat.set(Math.floor(width / 2), Math.floor(height / 2));
                part.texture.needsUpdate = true;
            }
        });

        return parts;
    }, [isHospital]);

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
                    <meshLambertMaterial 
                        color={part.color} 
                        map={part.texture || null}
                    />
                </mesh>
            ))}
            {isHospital && (
                <>
                {/* Red Cross */}
                <group position={[0, 6.5, 2.51]}>
                    <mesh>
                        <boxGeometry args={[1.5, 0.4, 0.1]} />
                        <meshStandardMaterial color="#FF0000" flatShading={true} />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.4, 1.5, 0.1]} />
                        <meshStandardMaterial color="#FF0000" flatShading={true} />
                    </mesh>
                </group>
                {/* Glass Door */}
                <mesh position={[0, 1, 2.51]}>
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial color="#6699CC" transparent opacity={0.6} />
                </mesh>
                 {/* Minimal Windows */}
                <mesh position={[0, 4, 2.51]}>
                    <boxGeometry args={[3, 0.2, 0.1]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <mesh position={[0, 5, 2.51]}>
                    <boxGeometry args={[3, 0.2, 0.1]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                </>
            )}
        </group>
    );
};

const City = () => {
    const buildings = useMemo(() => {
        const buildingData = [];
        let hospitalPlaced = false;
        // Increase the step to reduce building density
        for (let i = -20; i <= 20; i += 8) {
            for (let j = -30; j <= 2; j += 8) {
                // Add some randomness to position to avoid a perfect grid
                const x = i + (Math.random() - 0.5) * 4;
                const z = j + (Math.random() - 0.5) * 4;
                if (Math.abs(x) < 3 && Math.abs(z) < 3) continue; // Keep center clear

                let isHospital = false;
                if (!hospitalPlaced && x > 5 && z > -5) {
                    isHospital = true;
                    hospitalPlaced = true;
                }

                buildingData.push({
                    position: [x, 0, z] as [number, number, number],
                    isHospital: isHospital
                });
            }
        }
        return buildingData;
    }, []);

    return (
        <group>
            {buildings.map((b, index) => (
                <Building key={index} position={b.position} isHospital={b.isHospital} />
            ))}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
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
    const newScrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    scrollY.current = isNaN(newScrollY) ? 0 : newScrollY;

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
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
