
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

function Buildings() {
    const buildings = useMemo(() => {
        const buildingData = [];
        const citySize = 40; 
        const density = 4; 

        for (let i = -citySize; i <= citySize; i += density) {
            for (let j = -citySize; j <= citySize; j += density) {
                if (Math.random() > 0.3) { 
                    const height = 2 + Math.random() * 15;
                    const position = new THREE.Vector3(i, height / 2, j);
                    buildingData.push({ position, height });
                }
            }
        }
        return buildingData;
    }, []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((building, index) => {
                const yPos = Math.sin(clock.getElapsedTime() * 0.5 + index * 0.3) * 0.2;
                building.position.y = (buildings[index].height / 2) + yPos;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {buildings.map((data, index) => (
                 <mesh key={index} position={data.position}>
                    <boxGeometry args={[2.8, data.height, 2.8]} />
                    <meshLambertMaterial color={'#1E3A8A'} />
                </mesh>
            ))}
        </group>
    );
}

function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'#1D4ED8'} roughness={0.8} metalness={0.2} />
        </mesh>
    )
}

function CameraController() {
    const { camera } = useThree();
    const scrollY = useRef(0);

    const handleScroll = () => {
        scrollY.current = window.scrollY;
    };

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const scrollFactor = scrollY.current * 0.05;

        camera.position.x = Math.sin(t * 0.05) * 5;
        camera.position.y = 5 + scrollFactor;
        camera.position.z = 20 - scrollFactor;
        camera.lookAt(0, 0, 0);
    });

    return null;
}


export function CityscapeScene() {
  return (
    <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 20], fov: 75 }}>
            <ambientLight intensity={0.5} color="#4060ff" />
            <directionalLight 
                position={[10, 20, 5]} 
                intensity={1}
                color="#ffffff"
            />
            <hemisphereLight skyColor={"#3b82f6"} groundColor={"#1e3a8a"} intensity={1} />
            <fog attach="fog" args={['#1e3a8a', 20, 60]} />

            <Ground />
            <Buildings />
            <CameraController />
        </Canvas>
    </div>
  );
}
