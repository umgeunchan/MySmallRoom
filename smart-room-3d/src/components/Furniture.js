import React, { useRef } from 'react';
import { TransformControls } from '@react-three/drei';

function Furniture({ item, isSelected, onSelect, onMove, mode }) {
  const meshRef = useRef();

  // 끄기 상태일 때 가구 본체의 색상 (구분을 위해 밝게 조정)
  const offColor = "#aaaaaa"; 
  // 끄기 상태일 때 정면(빨간색 표시)의 색상
  const offFrontColor = "#555555";

  return (
    <>
      <mesh
        ref={meshRef}
        position={item.position}
        rotation={item.rotation}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        castShadow
      >
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        {/* 면별 재질 설정 (정면 표시 포함) */}
        <meshStandardMaterial attach="material-0" color={item.isOn ? item.color : offColor} emissive={item.isOn ? item.color : "#000"} emissiveIntensity={item.intensity / 5} />
        <meshStandardMaterial attach="material-1" color={item.isOn ? item.color : offColor} emissive={item.isOn ? item.color : "#000"} emissiveIntensity={item.intensity / 5} />
        <meshStandardMaterial attach="material-2" color={item.isOn ? item.color : offColor} emissive={item.isOn ? item.color : "#000"} emissiveIntensity={item.intensity / 5} />
        <meshStandardMaterial attach="material-3" color={item.isOn ? item.color : offColor} emissive={item.isOn ? item.color : "#000"} emissiveIntensity={item.intensity / 5} />
        <meshStandardMaterial attach="material-4" color={item.isOn ? "red" : offFrontColor} emissive={item.isOn ? "red" : "#000"} emissiveIntensity={item.intensity / 5} />
        <meshStandardMaterial attach="material-5" color={item.isOn ? item.color : offColor} emissive={item.isOn ? item.color : "#000"} emissiveIntensity={item.intensity / 5} />
        
        {item.isOn && item.type === 'light' && (
          <pointLight intensity={item.intensity} distance={10} color={item.color} castShadow />
        )}
      </mesh>

      {isSelected && (
        <TransformControls 
          object={meshRef} 
          mode={mode} 
          translationSnap={0.5} 
          rotationSnap={Math.PI / 4} 
          onMouseUp={() => {
            if (meshRef.current) {
              const { x, y, z } = meshRef.current.position;
              const { x: rx, y: ry, z: rz } = meshRef.current.rotation;
              onMove(item.id, [x, y, z], [rx, ry, rz]);
            }
          }}
        />
      )}
    </>
  );
}

export default Furniture;