import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Plane } from '@react-three/drei';
import Furniture from './components/Furniture';

function App() {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("flux-rooms-v5-final");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editMode, setEditMode] = useState("translate");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("flux-rooms-v5-final", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'r') setEditMode(prev => prev === "translate" ? "rotate" : "translate");
      if (e.key === 'Escape') setSelectedItemId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentRoom = rooms.find(r => r.id === currentRoomId);
  const selectedItem = currentRoom?.items.find(i => i.id === selectedItemId);

  const updateCurrentRoom = (updater) => {
    setRooms(prev => prev.map(r => r.id === currentRoomId ? { ...r, ...updater(r), lastModified: new Date().toISOString() } : r));
  };

  const createNewRoom = () => {
    const name = prompt("새 방의 이름을 입력하세요:", `Room ${rooms.length + 1}`);
    if (!name) return;
    const newRoom = { id: Date.now(), name, size: { width: 10, depth: 10 }, items: [], lastModified: new Date().toISOString() };
    setRooms([...rooms, newRoom]);
    setCurrentRoomId(newRoom.id);
  };

  const addItem = (type) => {
    const newItem = {
      id: Date.now(), type, position: [0, 0.4, 0], rotation: [0, 0, 0],
      color: type === 'light' ? "#ffffff" : "#87ceeb", isOn: false, intensity: 5,
      name: searchTerm || (type === 'light' ? "조명" : "가구")
    };
    updateCurrentRoom(r => ({ items: [...r.items, newItem] }));
    setSearchTerm("");
  };

  const updateItemProp = (id, prop, val) => {
    updateCurrentRoom(r => ({
      items: r.items.map(i => i.id === id ? { ...i, [prop]: val } : i)
    }));
  };

  // --- 홈 화면 UI ---
  if (!currentRoomId) {
    return (
      <div style={homeContainerStyle}>
        <header style={headerHeaderStyle}>
          <h1 style={{ color: '#00d4ff', margin: 0 }}>MySmallRoom Registry</h1>
          <button onClick={createNewRoom} style={addBtnLargeStyle}>+ 새 프로젝트</button>
        </header>
        <div style={registryGridStyle}>
          {rooms.map(room => (
            <div key={room.id} style={roomCardStyle} onClick={() => setCurrentRoomId(room.id)}>
              <div style={roomPreviewStyle}>3D VIEW</div>
              <div style={roomInfoStyle}>
                <div style={{fontWeight:'bold'}}>{room.name}</div>
                <div style={{fontSize:'12px', color:'#aaaaaa'}}>{room.size.width}x{room.size.depth}m | 기기 {room.items.length}개</div>
                <button onClick={(e) => { e.stopPropagation(); setRooms(rooms.filter(r => r.id !== room.id)); }} style={delBtnSmallStyle}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 편집 화면 UI ---
  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <button onClick={() => {setCurrentRoomId(null); setSelectedItemId(null);}} style={{...menuButtonStyle, background: '#444', marginBottom: '15px'}}>← 목록으로</button>
        
        {selectedItem ? (
          <div style={propertyPanelStyle}>
            <h3 style={{marginTop: 0, fontSize: '16px'}}>속성 편집</h3>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>기기 이름</label>
              <input type="text" value={selectedItem.name} onChange={e => updateItemProp(selectedItem.id, 'name', e.target.value)} style={inputStyle} />
            </div>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>상태</label>
              <button onClick={() => updateItemProp(selectedItem.id, 'isOn', !selectedItem.isOn)} style={menuButtonStyle}>
                {selectedItem.isOn ? "끄기" : "켜기"}
              </button>
            </div>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>색상</label>
              <input type="color" value={selectedItem.color} onChange={e => updateItemProp(selectedItem.id, 'color', e.target.value)} style={{...inputStyle, height:'35px', padding:'2px'}} />
            </div>
            {selectedItem.type === 'light' && (
              <div style={controlGroupStyle}>
                <label style={labelStyle}>밝기: {selectedItem.intensity}</label>
                <input type="range" min="1" max="15" step="0.5" value={selectedItem.intensity} onChange={e => updateItemProp(selectedItem.id, 'intensity', parseFloat(e.target.value))} />
              </div>
            )}
            <button onClick={() => { updateCurrentRoom(r => ({ items: r.items.filter(i => i.id !== selectedItemId) })); setSelectedItemId(null); }} style={{...menuButtonStyle, background: '#a52a2a', marginTop: '15px'}}>삭제</button>
            <button onClick={() => setSelectedItemId(null)} style={{...menuButtonStyle, marginTop: '5px', background: '#555'}}>닫기</button>
          </div>
        ) : (
          <div>
            <h2 style={{fontSize:'18px', color:'#00d4ff'}}>{currentRoom.name}</h2>
            <div style={controlGroupStyle}>
              <label style={labelStyle}>방 크기: {currentRoom.size.width}x{currentRoom.size.depth}</label>
              <input type="range" min="5" max="30" value={currentRoom.size.width} onChange={e => updateCurrentRoom(r => ({ size: {...r.size, width: +e.target.value} }))} />
              <input type="range" min="5" max="30" value={currentRoom.size.depth} onChange={e => updateCurrentRoom(r => ({ size: {...r.size, depth: +e.target.value} }))} />
            </div>
            <hr style={dividerStyle} />
            <h3>기기 추가</h3>
            <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
              <button onClick={() => addItem('light')} style={addBtnSmallStyle}>+ 조명</button>
              <button onClick={() => addItem('furniture')} style={{...addBtnSmallStyle, background:'#ff9800'}}>+ 가구</button>
            </div>
            <input type="text" placeholder="이름 입력..." style={inputStyle} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem('furniture')} />
          </div>
        )}
      </aside>

      <main style={{ flex: 1, position: "relative" }}>
        {/* 캔버스 배경색 설정 (눈이 편안한 다크 차콜) */}
        <Canvas shadows style={{ background: '#1e1e1e' }}>
          <PerspectiveCamera makeDefault position={[12, 12, 12]} />
          <OrbitControls makeDefault /> 
          <ambientLight intensity={0.4} /> {/* 기본 조명을 약간 밝게 */}
          
          {/* 바닥 색상 설정 (미드나잇 그레이, 가구와 구분됨) */}
          <Plane args={[currentRoom.size.width, currentRoom.size.depth]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial color="#2a2a2a" /></Plane>
          
          <Grid infiniteGrid cellSize={0.5} sectionSize={1} fadeDistance={30} cellColor="#3a3a3a" sectionColor="#555555" />
          {currentRoom.items.map(item => (
            <Furniture 
              key={item.id} item={item} isSelected={item.id === selectedItemId} mode={editMode}
              onSelect={() => setSelectedItemId(item.id)}
              onMove={(id, pos, rot) => updateCurrentRoom(r => ({ items: r.items.map(i => i.id === id ? {...i, position: pos, rotation: rot} : i) }))}
            />
          ))}
        </Canvas>
      </main>
    </div>
  );
}

// --- 스타일 (버그 수정 및 가독성 개선) ---
const homeContainerStyle = { width: '100vw', minHeight: '100vh', background: '#111', color: 'white', padding: '50px', boxSizing: 'border-box' };
// 헤더에 padding-right를 추가하여 버튼이 잘리지 않게 수정
const headerHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px', paddingRight: '20px' };
const addBtnLargeStyle = { padding: '12px 24px', background: '#00d4ff', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const registryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' };
const roomCardStyle = { background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #333' };
const roomPreviewStyle = { height: '150px', background: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '14px', fontWeight: 'bold' };
const roomInfoStyle = { padding: '15px', position: 'relative' };
const delBtnSmallStyle = { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px', marginTop: '10px' };

const containerStyle = { width: "100vw", height: "100vh", display: "flex", background: "#111", overflow: "hidden" };
const sidebarStyle = { width: "280px", padding: "20px", background: "#151515", borderRight: "1px solid #333", color: "white", zIndex: 10 };
const inputStyle = { width: "100%", padding: "10px", background: "#222", color: "white", border: "1px solid #444", borderRadius: "5px", fontSize: "13px" };
const addBtnSmallStyle = { flex: 1, padding: "10px", background: "#00d4ff", color: "black", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: '12px' };
const menuButtonStyle = { width: "100%", padding: "12px", cursor: "pointer", background: "#333", color: "white", border: "none", borderRadius: "5px", fontSize: "14px", fontWeight: 'bold' };
const dividerStyle = { borderColor: "#333", margin: "20px 0" };
const controlGroupStyle = { marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' };
const propertyPanelStyle = { background: '#202020', padding: '18px', borderRadius: '10px', border: '1px solid #444' };
const labelStyle = { fontSize: '12px', color: '#aaaaaa' };

export default App;