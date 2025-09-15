
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
      // Fallback material if canvas is not supported
      return new THREE.MeshLambertMaterial({ color: '#A9A9A9' });
    }
  
    // Building Color - This will be overridden by the material color, but good for texture background
    context.fillStyle = '#A9A9A9';
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
  
const Building = ({ position, isHospital, isSilver, isDigitalHub }: { position: [number, number, number], isHospital?: boolean, isSilver?: boolean, isDigitalHub?: boolean }) => {
    const ref = useRef<THREE.Group>(null!);

    const buildingData = useMemo(() => {
        const parts = [];
        let mainHeight = 4 + Math.random() * 10;
        let mainWidth = mainHeight < 6 ? 3 + Math.random() * 2 : 2 + Math.random();
        let mainDepth = mainHeight < 6 ? 3 + Math.random() * 2 : 2 + Math.random();

        if (isHospital) {
            mainHeight = 8;
            mainWidth = 5;
            mainDepth = 5;
        } else if (isDigitalHub) {
            mainHeight = 12;
            mainWidth = 4;
            mainDepth = 4;
        }
        
        const roofColor = '#696969';
        let buildingColor = '#D2B48C'; // Default skin color
        if (isHospital) {
            buildingColor = '#FFFFFF';
        } else if (isSilver) {
            buildingColor = '#C0C0C0'; // Silver color
        } else if(isDigitalHub) {
            buildingColor = '#222222';
        }
        const windowTexture = createBuildingTexture();


        // Main tower
        parts.push({
            position: [0, mainHeight / 2, 0] as [number, number, number],
            size: [mainWidth, mainHeight, mainDepth] as [number, number, number],
            texture: (isHospital || isDigitalHub) ? null : windowTexture.clone(),
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
        if (Math.random() > 0.5 && !isHospital && !isDigitalHub) {
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
                // We set repeat to 1,1 because the texture itself now defines the window layout
                part.texture.repeat.set(1, 1);
                part.texture.needsUpdate = true;
            }
        });

        return parts;
    }, [isHospital, isSilver, isDigitalHub]);

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
             {isDigitalHub && (
                <>
                    {/* Glowing Lines */}
                    {[2, 4, 6, 8, 10].map(y => (
                         <mesh key={y} position={[0, y, doorZPosition]}>
                            <boxGeometry args={[4.1, 0.1, 0.1]} />
                            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                        </mesh>
                    ))}
                    <mesh position={[0, 1, doorZPosition]}>
                        <boxGeometry args={[2, 2, 0.1]} />
                        <meshStandardMaterial color="#00ffff" transparent opacity={0.3} />
                    </mesh>
                </>
            )}
        </group>
    );
};

const Cloud = ({ position }: { position: [number, number, number] }) => {
    const ref = useRef<THREE.Mesh>(null!);
  
    useFrame((state) => {
      // Move clouds slowly from right to left
      ref.current.position.x -= 0.01;
      // If cloud moves off screen, reset its position to the right
      if (ref.current.position.x < -30) {
        ref.current.position.x = 30;
      }
    });
  
    return (
      <mesh ref={ref} position={position}>
        <planeGeometry args={[5 + Math.random() * 5, 2 + Math.random() * 2]} />
        <meshStandardMaterial
          color="#FFFFFF"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
};

const Tree = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[1, 2, 8]} />
                <meshLambertMaterial color="#228B22" />
            </mesh>
        </group>
    )
}

const Fountain = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
                <meshLambertMaterial color="#AAAAAA" />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[1.4, 1.4, 0.1, 16]} />
                <meshStandardMaterial color="#6699CC" transparent opacity={0.8} />
            </mesh>
             {/* Centerpiece */}
            <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                <meshLambertMaterial color="#888888" />
            </mesh>
        </group>
    )
}


const City = () => {
    const buildings = useMemo(() => {
        const buildingData = [];
        let hospitalPlaced = false;
        let digitalHubPlaced = false;
        
        // Place Digital Hub
        buildingData.push({
            position: [8, 0, -8] as [number, number, number],
            isDigitalHub: true,
        });
        digitalHubPlaced = true;

        for (let i = -20; i <= 20; i += 8) {
            for (let j = -30; j <= 2; j += 8) {
                // Add some randomness to position to avoid a perfect grid
                const x = i + (Math.random() - 0.5) * 4;
                const z = j + (Math.random() - 0.5) * 4;
                
                // Keep park area clear
                if (Math.abs(x) < 5 && Math.abs(z) < 5) continue; 
                // Avoid placing buildings on top of digital hub
                if (x > 5 && x < 11 && z > -11 && z < -5) continue;


                let isHospital = false;
                if (!hospitalPlaced && x > 5 && z > -5) {
                    isHospital = true;
                    hospitalPlaced = true;
                }

                buildingData.push({
                    position: [x, 0, z] as [number, number, number],
                    isHospital: isHospital,
                    isSilver: !isHospital && Math.random() > 0.5,
                });
            }
        }
        return buildingData;
    }, []);

    const clouds = useMemo(() => {
        const cloudData = [];
        for (let i = 0; i < 10; i++) {
          cloudData.push({
            position: [
              (Math.random() - 0.5) * 60,
              15 + Math.random() * 5,
              -15 - Math.random() * 10,
            ] as [number, number, number],
          });
        }
        return cloudData;
      }, []);

    const parkTrees = useMemo(() => {
        const treeData = [];
        for (let i=0; i<5; i++) {
            treeData.push({
                position: [
                    (Math.random() - 0.5) * 8,
                    0,
                    (Math.random() - 0.5) * 8
                ] as [number, number, number]
            });
        }
        return treeData;
    }, []);

    return (
        <group>
            {buildings.map((b, index) => (
                <Building key={`building-${index}`} position={b.position} isHospital={b.isHospital} isSilver={b.isSilver} isDigitalHub={b.isDigitalHub} />
            ))}
             {clouds.map((c, index) => (
                <Cloud key={`cloud-${index}`} position={c.position} />
            ))}
             {parkTrees.map((t, index) => (
                <Tree key={`tree-${index}`} position={t.position} />
            ))}
            <Fountain position={[0, 0, 0]} />
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

    

    

    