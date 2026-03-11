import React, { useRef } from 'react';
import { TransformControls } from '@react-three/drei';

function SmartLight({ position, rotation = [0, 0, 0], color, isOn, onToggle, onMove, mode }) {
  const meshRef = useRef();

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        castShadow
      >
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        {/* 면별 재질 설정: +Z(앞면)를 빨간색으로 표시하여 회전 확인 가능 */}
        <meshStandardMaterial attach="material-0" color={isOn ? color : "#444"} emissive={isOn ? color : "#000"} emissiveIntensity={1} />
        <meshStandardMaterial attach="material-1" color={isOn ? color : "#444"} emissive={isOn ? color : "#000"} emissiveIntensity={1} />
        <meshStandardMaterial attach="material-2" color={isOn ? color : "#444"} emissive={isOn ? color : "#000"} emissiveIntensity={1} />
        <meshStandardMaterial attach="material-3" color={isOn ? color : "#444"} emissive={isOn ? color : "#000"} emissiveIntensity={1} />
        <meshStandardMaterial attach="material-4" color={isOn ? "red" : "#222"} emissive={isOn ? "red" : "#000"} emissiveIntensity={1.5} />
        <meshStandardMaterial attach="material-5" color={isOn ? color : "#444"} emissive={isOn ? color : "#000"} emissiveIntensity={1} />
        
        {isOn && (
          <pointLight intensity={5} distance={10} color={color} castShadow />
        )}
      </mesh>

      <TransformControls 
        object={meshRef} 
        mode={mode} 
        translationSnap={0.5} 
        rotationSnap={Math.PI / 4} 
        onMouseUp={() => {
          if (meshRef.current) {
            const { x, y, z } = meshRef.current.position;
            const { x: rx, y: ry, z: rz } = meshRef.current.rotation;
            onMove([x, y, z], [rx, ry, rz]);
          }
        }}
      />
    </>
  );
}

export default SmartLight;