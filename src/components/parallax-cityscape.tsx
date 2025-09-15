
'use client';
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const createBuildingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512; // Taller canvas for a single long window
    const context = canvas.getContext('2d');
  
    if (!context) {
      return new THREE.MeshLambertMaterial({ color: '#C0C0C0' });
    }
  
    // Building Color
    context.fillStyle = '#C0C0C0';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Single Modern Window
    context.fillStyle = '#333333'; // Dark window color
    const windowWidth = 24;
    const windowHeight = canvas.height * 0.7; // Make it 70% of the building height
    const x = (canvas.width - windowWidth) / 2; // Centered
    const y = (canvas.height - windowHeight) / 2; // Centered

    context.fillRect(x, y, windowWidth, windowHeight);
    
    // Add a light border for a sleeker look
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 4;
    context.strokeRect(x,y, windowWidth, windowHeight);


    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  
    return texture;
};
  
const Building = ({ position, isHospital }: { position: [number, number, number], isHospital?: boolean }) => {
    const ref = useRef<THREE.Group>(null!);

    const buildingData = useMemo(() => {
        const parts = [];
        const mainHeight = isHospital ? 8 : 4 + Math.random() * 10;
        const mainWidth = isHospital ? 5 : (mainHeight < 6 ? 3 + Math.random() * 2 : 2 + Math.random());
        const mainDepth = isHospital ? 5 : (mainHeight < 6 ? 3 + Math.random() * 2 : 2 + Math.random());
        
        const roofColor = '#696969';
        const buildingColor = isHospital ? '#FFFFFF' : '#C0C0C0';
        const windowTexture = createBuildingTexture();


        // Main tower
        parts.push({
            position: [0, mainHeight / 2, 0] as [number, number, number],
            size: [mainWidth, mainHeight, mainDepth] as [number, number, number],
            texture: isHospital ? null : windowTexture.clone(),
            color: buildingColor,
            isMain: true,
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
                const [width, height] = part.size;
                // We set repeat to 1,1 because the texture itself now defines the window layout
                part.texture.repeat.set(1, 1);
                part.texture.needsUpdate = true;
            }
        });

        return parts;
    }, [isHospital]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.05;
    });

    const mainBuildingPart = buildingData.find(p => p.isMain);
    const doorZPosition = mainBuildingPart ? mainBuildingPart.size[2] / 2 + 0.01 : 2.51;

    return (
        <group ref={ref} position={position}>
            {buildingData.map((part, index) => (
                <mesh key={index} position={part.position} castShadow receiveShadow>
                    <boxGeometry args={part.size} />
                    <meshLambertMaterial 
                        color={part.color} 
                        map={part.texture || null}
                    />
                </mesh>
            ))}

            {isHospital && (
                <>
                {/* Glass Door for hospital */}
                <mesh position={[0, 1, doorZPosition]}>
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial color="#6699CC" transparent opacity={0.6} />
                </mesh>
                {/* Red Cross */}
                <group position={[0, 6.5, doorZPosition]}>
                    <mesh>
                        <boxGeometry args={[1.5, 0.4, 0.1]} />
                        <meshStandardMaterial color="#FF0000" flatShading={true} />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.4, 1.5, 0.1]} />
                        <meshStandardMaterial color="#FF0000" flatShading={true} />
                    </mesh>
                </group>
                
                 {/* Minimal Windows */}
                <mesh position={[0, 4, doorZPosition]}>
                    <boxGeometry args={[3, 0.2, 0.1]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <mesh position={[0, 5, doorZPosition]}>
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshLambertMaterial color="#56c156" />
            </mesh>
        </group>
    );
};


const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const scrollY = useRef(0);

  const handleScroll = () => {
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

    const radius = 25 - (scrollY.current * 22); 
    const angle = elapsedTime * 0.08;
    const continuousX = Math.sin(angle) * radius;
    const continuousZ = Math.cos(angle) * radius;
    
    const scrollBasedY = 12 - scrollY.current * 9;
    const scrollBasedFov = 75 - scrollY.current * 50;

    camera.position.x = continuousX;
    camera.position.z = continuousZ;
    camera.position.y = scrollBasedY + Math.sin(elapsedTime * 0.5) * 0.5; 
    
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, scrollBasedFov, 0.1);
        camera.updateProjectionMatrix();
    }
    
    camera.lookAt(0, 2, 0);

    if (sunRef.current && lightRef.current) {
        const sunAngle = elapsedTime * 0.05;
        sunRef.current.position.x = Math.cos(sunAngle) * 40;
        sunRef.current.position.y = Math.sin(sunAngle) * 20 + 20;
        sunRef.current.position.z = -30;

        lightRef.current.position.copy(sunRef.current.position);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 10, 25]} fov={75} />
      <ambientLight intensity={0.6} />
      <directionalLight 
        ref={lightRef}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <mesh ref={sunRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial emissive="#FFDD00" color="#FFDD00" />
      </mesh>
      <fog attach="fog" args={['#87CEEB', 25, 80]} />
      <City />
    </>
  );
};

export default function ParallaxCityscape() {
  return (
    <div className="absolute inset-0 z-0 bg-[#87CEEB]">
      <Canvas shadows>
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

    
