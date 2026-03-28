// ══════════════════════════════════════════════
//  gallery.js — 갤러리 그리드 렌더링
// ══════════════════════════════════════════════

import { loadPhotos, loadComments } from './storage.js';
import { escHtml } from './utils.js';

/** 갤러리 전체를 다시 렌더링합니다. */
export function renderGallery() {
  const photos = loadPhotos();
  const grid = document.getElementById('galleryGrid');
  const empty = document.getElementById('emptyState');

  if (photos.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = photos.map((photo) => _buildCard(photo)).join('');
}

/** 사진 카드 HTML을 생성합니다. */
function _buildCard(photo) {
  const commentCount = loadComments(photo.id).length;

  return `
    <div class="card" data-id="${photo.id}" role="button" tabindex="0" aria-label="사진 보기">
      <img src="${photo.src}" alt="스케치" loading="lazy">
      <div class="card-meta">
        <div class="card-date">${photo.date}</div>
        ${photo.note ? `<div class="card-note">${escHtml(photo.note)}</div>` : ''}
        ${commentCount > 0 ? `<div class="card-comment-count">${_commentIcon()} ${commentCount}개의 댓글</div>` : ''}
      </div>
    </div>
  `;
}

function _commentIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>`;
}
