import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Plane } from '@react-three/drei';
import SmartLight from './components/SmartLight';

function App() {
  const [items, setItems] = useState(() => {
    const savedData = localStorage.getItem("flux-room-data-v3");
    return savedData ? JSON.parse(savedData) : [
      { id: 1, position: [0, 0.4, 0], rotation: [0, 0, 0], color: "cyan", isOn: false, name: "기본 조명" },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState("translate");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'r') {
        setEditMode(prev => prev === "translate" ? "rotate" : "translate");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("flux-room-data-v3", JSON.stringify(items));
  }, [items]);

  const toggleLight = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isOn: !item.isOn } : item
    ));
  };

  const turnAllOn = () => setItems(prev => prev.map(item => ({ ...item, isOn: true })));
  const turnAllOff = () => setItems(prev => prev.map(item => ({ ...item, isOn: false })));

  const updateTransform = (id, newPos, newRot) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, position: newPos, rotation: newRot } : item
    ));
  };

  const addItem = () => {
    if (!searchTerm.trim()) return;
    const newItem = {
      id: Date.now(),
      position: [Math.round((Math.random() - 0.5) * 8), 0.4, Math.round((Math.random() - 0.5) * 8)],
      rotation: [0, 0, 0],
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      isOn: false,
      name: searchTerm
    };
    setItems(prev => [...prev, newItem]);
    setSearchTerm("");
  };

  const deleteItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{ marginBottom: '10px', color: '#00d4ff' }}>Flux Simulator</h2>
        <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '20px' }}>
          단축키: <b>R</b> (이동/회전 모드 전환)
        </div>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <button style={menuButtonStyle} onClick={turnAllOn}>전부 켜기</button>
          <button style={menuButtonStyle} onClick={turnAllOff}>전부 끄기</button>
        </div>

        <div style={{ marginBottom: '10px', padding: '10px', background: '#333', borderRadius: '4px', textAlign: 'center' }}>
          현재 모드: <b>{editMode === "translate" ? "이동" : "회전"}</b>
        </div>

        <button 
          style={{ ...menuButtonStyle, background: '#a52a2a' }} 
          onClick={() => { if(window.confirm("방을 초기화하시겠습니까?")) setItems([]); }}
        >
          방 비우기
        </button>
        
        <hr style={dividerStyle} />
        
        <h3>가구 추가</h3>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="가구 이름 입력..." 
            style={inputStyle} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} style={addButtonStyle}>추가</button>
        </div>

        <h3>배치된 기기 ({items.length})</h3>
        <div style={listContainerStyle}>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {items.map(item => (
              <li key={item.id} style={listItemStyle}>
                <span title={item.name} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                  • {item.name}
                </span>
                <button onClick={() => deleteItem(item.id)} style={deleteButtonStyle}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main style={{ flex: 1, position: "relative" }}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          <OrbitControls makeDefault /> 
          
          <ambientLight intensity={0.2} />
          
          <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <meshStandardMaterial color="#1a1a1a" />
          </Plane>
          <Plane args={[20, 10]} position={[0, 5, -10]} receiveShadow>
            <meshStandardMaterial color="#252525" />
          </Plane>
          <Plane args={[20, 10]} rotation={[0, Math.PI / 2, 0]} position={[-10, 5, 0]} receiveShadow>
            <meshStandardMaterial color="#252525" />
          </Plane>

          <Grid infiniteGrid cellSize={0.5} sectionSize={1} fadeDistance={20} cellColor="#444" sectionColor="#666" />

          {items.map((item) => (
            <SmartLight 
              key={item.id}
              position={item.position}
              rotation={item.rotation}
              color={item.color}
              isOn={item.isOn}
              mode={editMode}
              onToggle={() => toggleLight(item.id)}
              onMove={(newPos, newRot) => updateTransform(item.id, newPos, newRot)}
            />
          ))}
        </Canvas>
      </main>
    </div>
  );
}

const containerStyle = { width: "100vw", height: "100vh", display: "flex", background: "#111", overflow: "hidden" };
const sidebarStyle = { width: "260px", padding: "20px", background: "#1a1a1a", borderRight: "1px solid #333", color: "white", zIndex: 10, display: 'flex', flexDirection: 'column' };
const menuButtonStyle = { width: "100%", padding: "10px", cursor: "pointer", background: "#333", color: "white", border: "none", borderRadius: "4px", fontSize: "14px" };
const dividerStyle = { borderColor: "#333", margin: "20px 0" };
const inputStyle = { width: "100%", padding: "8px", background: "#222", color: "white", border: "1px solid #444", borderRadius: "4px" };
const addButtonStyle = { padding: "8px 12px", background: "#00d4ff", color: "black", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };
const listContainerStyle = { flex: 1, overflowY: 'auto', marginTop: '10px' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', background: '#222', padding: '8px', borderRadius: '4px', fontSize: '13px' };
const deleteButtonStyle = { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' };

export default App;