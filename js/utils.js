// ══════════════════════════════════════════════
//  utils.js — 공통 유틸리티 함수
// ══════════════════════════════════════════════

/** HTML 특수문자를 이스케이프해서 XSS를 방지합니다. */
export function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 토스트 알림을 잠깐 보여줍니다. */
export function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/** 현재 날짜를 한국어 형식으로 반환합니다. */
export function formatDateKo(date = new Date()) {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** 현재 시각을 간단한 한국어 형식으로 반환합니다. */
export function formatTimeKo(date = new Date()) {
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** 파일을 base64 Data URL로 변환합니다. */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('파일을 읽을 수 없어요.'));
    reader.readAsDataURL(file);
  });
}
