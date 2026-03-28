# Sketchbook 🎨

손으로 그린 그림을 올리고 감상할 수 있는 개인 갤러리 웹사이트입니다.

## 폴더 구조

```
sketchbook/
├── index.html          # HTML 뼈대
├── css/
│   └── style.css       # 전체 스타일
├── js/
│   ├── main.js         # 앱 진입점 (각 모듈 초기화)
│   ├── config.js       # 사이트 설정 (비밀번호 등)
│   ├── auth.js         # 관리자 로그인/로그아웃
│   ├── gallery.js      # 갤러리 그리드 렌더링
│   ├── upload.js       # 사진 업로드 패널
│   ├── lightbox.js     # 라이트박스 + 댓글
│   ├── storage.js      # 데이터 저장/불러오기
│   └── utils.js        # 공통 유틸리티
└── assets/             # 폰트, 아이콘 등 정적 파일
```

## 로컬에서 실행하기

JS 모듈(`type="module"`)을 사용하므로 **로컬 서버**가 필요합니다.

### VS Code Live Server (추천)
1. VS Code 확장 프로그램 `Live Server` 설치
2. `index.html` 우클릭 → **Open with Live Server**

### Python
```bash
python -m http.server 8080
# http://localhost:8080 접속
```

### Node.js
```bash
npx serve .
```

## 관리자 비밀번호 변경

`js/config.js` 파일에서 수정하세요:

```js
export const CONFIG = {
  ADMIN_PASSWORD: '새비밀번호',
  ...
};
```

## 데이터 저장 방식

현재는 브라우저 **localStorage**에 저장됩니다.
여러 기기에서 동기화하려면 `js/storage.js`를 Firebase 등 백엔드로 교체하면 됩니다.
