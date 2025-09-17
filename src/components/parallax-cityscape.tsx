
'use client';
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Vignette, BrightnessContrast } from '@react-three/postprocessing';

const createBuildingTexture = (isSilver: boolean, isTan: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const context = canvas.getContext('2d');
  
    if (!context) {
      return new THREE.MeshLambertMaterial({ color: '#333' });
    }
  
    context.fillStyle = isSilver ? '#C0C0C0' : (isTan ? '#C4A484' : '#A9A9A9');
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    for (let y = 8; y < canvas.height - 8; y += 12) {
        for (let x = 6; x < canvas.width - 6; x += 10) {
            context.fillStyle = 'rgba(0,0,0,0.6)';
            context.fillRect(x, y, 6, 8);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  
    return texture;
};
  
const Building = ({ position, isHospital, isSilver, isTan, isDigitalHub }: { position: [number, number, number], isHospital?: boolean, isSilver?: boolean, isTan?: boolean, isDigitalHub?: boolean }) => {
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

        const roofColor = '#555555';
        let buildingColor: string;

        if (isHospital) {
            buildingColor = '#FFFFFF';
        } else if (isDigitalHub) {
            buildingColor = '#101010'; // Updated to black
        } else if (isSilver) {
            buildingColor = '#C0C0C0';
        } else if (isTan) {
            buildingColor = '#D2B48C'; // A slightly different tan
        } else {
            buildingColor = '#A9A9A9';
        }
        
        const windowTexture = createBuildingTexture(!!isSilver, !!isTan);


        // Main tower
        parts.push({
            position: [0, mainHeight / 2, 0] as [number, number, number],
            size: [mainWidth, mainHeight, mainDepth] as [number, number, number],
            texture: isHospital || isDigitalHub ? null : windowTexture.clone(),
            color: buildingColor,
            isMain: true,
        });
        
        // Roof for main tower
         parts.push({
            position: [0, mainHeight + 0.1, 0] as [number, number, number],
            size: [mainWidth, 0.2, mainDepth] as [number, number, number],
            color: roofColor
        });
        
        // Apply texture repeats based on geometry
        parts.forEach(part => {
            if (part.texture) {
                part.texture.repeat.set(Math.round(part.size[0]/2), Math.round(part.size[1]/2));
                part.texture.needsUpdate = true;
            }
        });

        return parts;
    }, [isHospital, isSilver, isTan, isDigitalHub]);

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
                        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={1} flatShading={true} />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.4, 1.5, 0.1]} />
                        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={1} flatShading={true} />
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
                    {/* New "D" logo */}
                    <group position={[0, 7.5, doorZPosition]}>
                        <mesh position={[-0.4, 0, 0]}>
                            <boxGeometry args={[0.2, 2, 0.2]} />
                            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
                        </mesh>
                         <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                            <torusGeometry args={[1, 0.2, 16, 32, Math.PI]} />
                             <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
                        </mesh>
                    </group>

                     {/* Glowing Lines */}
                     {[3, 5, 10].map(y => (
                        <mesh key={y} position={[0, y, 0]}>
                            <boxGeometry args={[4.1, 0.15, 4.1]} />
                             <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} />
                        </mesh>
                     ))}
                </>
            )}
        </group>
    );
};

const Tree = ({ position, type = 'cone' }: { position: [number, number, number], type?: 'cone' | 'sphere' }) => {
    return (
        <group position={position}>
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                <meshLambertMaterial color="#8B4513" />
            </mesh>
            {type === 'cone' && (
                <mesh position={[0, 1.5, 0]} castShadow>
                    <coneGeometry args={[1, 2, 8]} />
                    <meshLambertMaterial color="#2E8B57" />
                </mesh>
            )}
            {type === 'sphere' && (
                 <mesh position={[0, 1.5, 0]} castShadow>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshLambertMaterial color="#3CB371" />
                </mesh>
            )}
        </group>
    )
}

const Fountain = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <cylinderGeometry args={[1.5, 1.5, 0.2, 16]} />
                <meshLambertMaterial color="#999999" />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[1.4, 1.4, 0.1, 16]} />
                <meshStandardMaterial color="#ADD8E6" transparent opacity={0.7} />
            </mesh>
             {/* Centerpiece */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
                <meshLambertMaterial color="#888888" />
            </mesh>
        </group>
    )
}

const Streetlight = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Pole */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <boxGeometry args={[0.1, 3, 0.1]} />
                <meshLambertMaterial color="#696969" />
            </mesh>
            {/* Arm */}
            <mesh position={[0, 3, 0.5]} castShadow>
                <boxGeometry args={[0.1, 0.1, 1]} />
                <meshLambertMaterial color="#696969" />
            </mesh>
            {/* Light */}
            <mesh position={[0, 2.9, 1]}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={20} />
            </mesh>
        </group>
    )
}

const Road = ({ position, size, markings }: { position: [number, number, number], size: [number, number, number], markings?: boolean }) => {
    const roadMarkings = useMemo(() => {
        if (!markings) return null;
        const marks = [];
        const isVertical = size[0] < size[2];
        const length = isVertical ? size[2] : size[0];
        const dashLength = 2;
        const gapLength = 2;
        const numDashes = Math.floor(length / (dashLength + gapLength));
        
        for (let i = -numDashes / 2; i < numDashes / 2; i++) {
            const pos = i * (dashLength + gapLength);
            if (isVertical) {
                marks.push(<mesh key={i} position={[0, 0.01, pos]}><boxGeometry args={[0.1, 0.01, dashLength]} /><meshLambertMaterial color="#FFFFFF" /></mesh>);
            } else {
                 marks.push(<mesh key={i} position={[pos, 0.01, 0]}><boxGeometry args={[dashLength, 0.01, 0.1]} /><meshLambertMaterial color="#FFFFFF" /></mesh>);
            }
        }
        return marks;

    }, [size, markings]);

    return (
        <group position={position}>
            <mesh receiveShadow>
                <boxGeometry args={size} />
                <meshLambertMaterial color="#696969" />
            </mesh>
            {roadMarkings}
        </group>
    )
}


const City = () => {
    const buildings = useMemo(() => {
        const buildingData = [];
        
        const hospitalPosition: [number, number, number] = [-15, 0, 8];
        const digitalHubPosition: [number, number, number] = [15, 0, 8];

        buildingData.push({
            position: hospitalPosition,
            isHospital: true,
        });

        buildingData.push({
            position: digitalHubPosition,
            isDigitalHub: true,
        });


        for (let i = -20; i <= 20; i += 8) {
            for (let j = -30; j <= 8; j += 8) {
                const x = i + (Math.random() - 0.5) * 4;
                const z = j + (Math.random() - 0.5) * 4;
                
                if (Math.abs(x) < 8 && z > -8) continue;
                 if (Math.abs(x) > 4 && x < 12 && z > -8) continue;

                const distToHospital = Math.sqrt(Math.pow(x - hospitalPosition[0], 2) + Math.pow(z - hospitalPosition[2], 2));
                if (distToHospital < 6) continue;

                const distToHub = Math.sqrt(Math.pow(x - digitalHubPosition[0], 2) + Math.pow(z - digitalHubPosition[2], 2));
                if (distToHub < 6) continue;

                const randomValue = Math.random();
                buildingData.push({
                    position: [x, 0, z] as [number, number, number],
                    isSilver: randomValue > 0.66,
                    isTan: randomValue > 0.33 && randomValue <= 0.66,
                });
            }
        }
        return buildingData;
    }, []);

    const parkTrees = useMemo(() => {
        const treeData = [];
        for (let i=0; i<8; i++) {
            treeData.push({
                position: [
                    (Math.random() - 0.5) * 12,
                    0,
                    (Math.random() - 0.5) * 12 + 2
                ] as [number, number, number],
                type: Math.random() > 0.5 ? 'cone' : 'sphere'
            });
        }
        return treeData;
    }, []);

    const streetTrees = useMemo(() => {
        const treeData = [];
        for (let z = -30; z <= 10; z += 6) {
            if (z > -10 && z < 10) continue; // Don't block park entrance
            treeData.push({position: [8.5, 0, z] as [number, number, number], type: Math.random() > 0.5 ? 'cone' : 'sphere'});
            treeData.push({position: [-8.5, 0, z] as [number, number, number], type: Math.random() > 0.5 ? 'cone' : 'sphere'});
        }
        for (let x = -20; x <= 20; x += 8) {
             if (Math.abs(x) < 4) continue;
             treeData.push({position: [x, 0, -8.5] as [number, number, number], type: Math.random() > 0.5 ? 'cone' : 'sphere'});
        }
        return treeData;
    }, []);

    const streetlights = useMemo(() => {
        const lightData = [];
        for (let z = -30; z <= 12; z += 10) {
            if (z > -8 && z < 12) continue; 
            lightData.push({ position: [8, 0, z] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] });
            lightData.push({ position: [-8, 0, z] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] });
        }
        for (let x = -20; x <= 20; x += 10) {
             if (Math.abs(x) < 4) continue;
             lightData.push({ position: [x, 0, -10] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] });
             lightData.push({ position: [x, 0, -8] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] });
        }
        return lightData;
    }, []);

    return (
        <group>
            {/* Base ground and roads */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshLambertMaterial color="#4A4A4A" />
            </mesh>
            <Road position={[0, 0, -10]} size={[40, 0.1, 4]} markings={true} />
            <Road position={[10, 0, 0]} size={[4, 0.1, 40]} markings={false} />
            <Road position={[-10, 0, 0]} size={[4, 0.1, 40]} markings={false} />

            {/* Roadside grass strips */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -8.5]} receiveShadow>
                <planeGeometry args={[40, 1]} />
                <meshLambertMaterial color="#345834" />
            </mesh>
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, -0.04, -10]} receiveShadow>
                <planeGeometry args={[1, 40]} />
                <meshLambertMaterial color="#345834" />
            </mesh>
             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, -0.04, -10]} receiveShadow>
                <planeGeometry args={[1, 40]} />
                <meshLambertMaterial color="#345834" />
            </mesh>
            
            
            {/* Park Area */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 2]} receiveShadow>
                <planeGeometry args={[18, 24]} />
                <meshLambertMaterial color="#345834" />
            </mesh>

            {buildings.map((b, index) => (
                <Building key={`building-${index}`} position={b.position} isHospital={b.isHospital} isSilver={b.isSilver} isTan={b.isTan} isDigitalHub={b.isDigitalHub} />
            ))}
             {parkTrees.map((t, index) => (
                <Tree key={`park-tree-${index}`} position={t.position} type={t.type} />
            ))}
            {streetTrees.map((t, index) => (
                <Tree key={`street-tree-${index}`} position={t.position} type={t.type} />
            ))}
            {streetlights.map((sl, index) => (
                <Streetlight key={`streetlight-${index}`} position={sl.position} rotation={sl.rotation} />
            ))}
            <Fountain position={[0, 0, 2]} />
        </group>
    );
};


const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
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

    const radius = 28 - (scrollY.current * 25); 
    const angle = elapsedTime * 0.05;
    const continuousX = Math.sin(angle) * radius;
    const continuousZ = Math.cos(angle) * radius;
    
    const scrollBasedY = 15 - scrollY.current * 12;
    const scrollBasedFov = 75 - scrollY.current * 40;

    camera.position.x = continuousX;
    camera.position.z = continuousZ;
    camera.position.y = scrollBasedY + Math.sin(elapsedTime * 0.5) * 0.5; 
    
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, scrollBasedFov, 0.1);
        camera.updateProjectionMatrix();
    }
    
    camera.lookAt(0, 2, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 10, 25]} fov={75} />
      <ambientLight intensity={2.5} color="#FFFFFF" />
      <directionalLight 
        color="#FFFFFF"
        position={[40, 20, 30]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.005}
        shadow-normalBias={0.02}
      />
      <fog attach="fog" args={['#E67171', 80, 140]} />
      <City />
       <mesh position={[40, 20, 30]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
      </mesh>
      <EffectComposer>
        <Vignette eskil={false} offset={0.15} darkness={0.5} />
        <BrightnessContrast brightness={-0.05} contrast={0.15} />
      </EffectComposer>
    </>
  );
};

export default function ParallaxCityscape() {
  return (
    <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, #ff9a9e, #fad0c4)' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
