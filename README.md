# 🏠 MySmallRoom (Flux Simulator)
> **React & Three.js 기반의 스마트 홈 IoT 가구 배치 시뮬레이터**

MySmallRoom은 사용자가 3D 공간에서 가구를 자유롭게 배치하고, 가상의 IoT 기기(조명 등)를 실시간으로 제어해 볼 수 있는 인터랙티브 웹 애플리케이션입니다.

---

## 📸 ScreenShots

| 메인 레지스트리 (홈) | 3D 편집 및 IoT 제어 |
| :---: | :---: |
| ![Home Screenshot](./screenshots/home.png) | ![Editor Screenshot](./screenshots/editor.png) |
| *저장된 방 목록을 관리하는 홈 화면* | *가구 배치 및 조명 속성 편집 화면* |

---

## ✨ 주요 기능 (Key Features)

### 1. 다중 프로젝트 관리 (Room Registry)
- **방 생성/삭제**: 여러 개의 독립적인 방 디자인을 생성하고 관리할 수 있습니다.
- **메타데이터 확인**: 각 방의 크기와 배치된 기기 개수를 한눈에 확인합니다.

### 2. 정교한 3D 가구 배치
- **드래그 앤 드롭**: 마우스를 이용해 가구를 직관적으로 이동시킵니다.
- **그리드 스냅 (0.5m)**: 모든 가구는 0.5m 단위로 격자에 딱딱 맞춰 배치되어 정렬이 쉽습니다.
- **회전 모드 (Rotation)**: `R` 키를 눌러 이동/회전 모드를 전환하며 원하는 방향으로 가구를 돌릴 수 있습니다.

### 3. 실시간 IoT 시뮬레이션
- **개별 속성 편집**: 가구별 이름 변경, 색상(RGB) 변경이 가능합니다.
- **스마트 조명**: 조명 기기의 전원을 끄고 켜며, 밝기(Intensity)를 실시간으로 조절하여 방의 분위기를 확인합니다.
- **전역 제어**: 버튼 하나로 방 안의 모든 전원을 동시에 제어합니다.

### 4. 사용자 맞춤 설정 및 저장
- **방 크기 커스텀**: 실시간 슬라이더를 통해 방의 가로/세로 길이를 조절하면 벽면이 동적으로 반응합니다.
- **로컬 스토리지 저장**: 모든 편집 사항은 브라우저에 자동 저장되어 새로고침 후에도 유지됩니다.

---

## ⌨️ 단축키 (Hotkeys)

| 키 | 기능 |
| :--- | :--- |
| **`R`** | 이동(Translate) ↔ 회전(Rotate) 모드 전환 |
| **`Esc`** | 가구 선택 해제 (속성창 닫기) |
| **`Enter`** | 가구 검색 및 추가 확정 |

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React.js
- **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
- **State**: React Hooks (useState, useEffect)
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel (추천)

---

## 🚀 시작하기 (Getting Started)

```bash
# 저장소 복제
git clone [https://github.com/umgeunchan/MySmallRoom.git](https://github.com/umgeunchan/MySmallRoom.git)

# 의존성 설치
npm install

# 프로젝트 실행
npm start
