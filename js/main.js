// ══════════════════════════════════════════════
//  main.js — 앱 진입점
//  각 모듈을 초기화하고 갤러리를 최초 렌더링합니다.
// ══════════════════════════════════════════════

import { initAuth } from './auth.js';
import { initUpload } from './upload.js';
import { initLightbox } from './lightbox.js';
import { renderGallery } from './gallery.js';

function init() {
  initAuth();
  initUpload();
  initLightbox();
  renderGallery();
}

// DOM이 준비되면 실행
document.addEventListener('DOMContentLoaded', init);
