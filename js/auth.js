// ══════════════════════════════════════════════
//  auth.js — 관리자 로그인 / 로그아웃
// ══════════════════════════════════════════════

import { CONFIG } from './config.js';
import { showToast } from './utils.js';

let _isAdmin = false;

/** 현재 관리자 여부를 반환합니다. */
export function isAdmin() {
  return _isAdmin;
}

/** 로그인 모달을 엽니다. */
export function openLoginModal() {
  document.getElementById('loginModal').classList.add('open');
  setTimeout(() => document.getElementById('passwordInput').focus(), 100);
}

/** 로그인 모달을 닫습니다. */
export function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('open');
  document.getElementById('loginError').classList.remove('visible');
  document.getElementById('passwordInput').value = '';
}

/** 비밀번호를 확인하고 로그인 처리합니다. */
export function doLogin() {
  const pw = document.getElementById('passwordInput').value;

  if (pw === CONFIG.ADMIN_PASSWORD) {
    _isAdmin = true;
    closeLoginModal();
    _applyAdminUI(true);
    showToast('관리자로 로그인됐어요 ✓');
  } else {
    document.getElementById('loginError').classList.add('visible');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
  }
}

/** 로그아웃 처리합니다. */
export function logout() {
  _isAdmin = false;
  _applyAdminUI(false);

  // 업로드 패널 닫기
  document.getElementById('uploadPanel').hidden = true;

  showToast('로그아웃됐어요');
}

/** 관리자 여부에 따라 UI 요소를 보이거나 숨깁니다. */
function _applyAdminUI(admin) {
  document.getElementById('adminBar').classList.toggle('visible', admin);
  document.getElementById('loginBtn').hidden = admin;
  document.getElementById('uploadToggleBtn').hidden = !admin;
}

/** 이벤트 리스너를 등록합니다. (main.js 에서 호출) */
export function initAuth() {
  document.getElementById('loginBtn').addEventListener('click', openLoginModal);
  document.getElementById('doLoginBtn').addEventListener('click', doLogin);
  document.getElementById('loginModalClose').addEventListener('click', closeLoginModal);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // 엔터키로 로그인
  document.getElementById('passwordInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
}
