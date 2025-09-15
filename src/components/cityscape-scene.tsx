
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

function Buildings() {
    const buildings = useMemo(() => {
        const buildingData = [];
        for (let i = -20; i <= 20; i += 5) {
            for (let j = -20; j <= 20; j += 5) {
                if (Math.abs(i) < 10 && Math.abs(j) < 10) continue; 
                const height = 2 + Math.random() * 8;
                const position = new THREE.Vector3(i, height / 2 - 0.5, j);
                buildingData.push({ position, height });
            }
        }
        return buildingData;
    }, []);

    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((building, index) => {
                const { height } = buildings[index];
                const yPos = Math.sin(clock.getElapsedTime() * 0.5 + index * 0.5) * 0.5;
                building.position.y = (height / 2 - 0.5) + yPos;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {buildings.map((data, index) => (
                 <mesh key={index} position={data.position}>
                    <boxGeometry args={[2.5, data.height, 2.5]} />
                    <meshLambertMaterial color={'#4760e6'} />
                </mesh>
            ))}
        </group>
    );
}

function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'#56c156'} roughness={0.8} metalness={0.2} />
        </mesh>
    )
}

function CameraController() {
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        camera.position.x = Math.sin(t * 0.1) * 30;
        camera.position.z = 30 + Math.cos(t * 0.1) * 10;
        camera.lookAt(0, 0, 0);
    });

    return null;
}


export function CityscapeScene() {
  return (
    <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 10, 40], fov: 50 }}>
            <ambientLight intensity={1.0} color="#b4e7b4" />
            <directionalLight 
                position={[30, 50, 20]} 
                intensity={1.5}
                color="#ffffff"
                castShadow
            />
            <hemisphereLight skyColor={"#1e3572"} groundColor={"#56c156"} intensity={0.8} />
            <fog attach="fog" args={['#b4e7b4', 20, 100]} />

            <Ground />
            <Buildings />
            <CameraController />
        </Canvas>
    </div>
  );
}
