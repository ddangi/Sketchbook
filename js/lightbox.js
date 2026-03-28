// ══════════════════════════════════════════════
//  lightbox.js — 사진 상세 보기 + 댓글
// ══════════════════════════════════════════════

import { loadPhotos, loadComments, addComment } from './storage.js';
import { escHtml, showToast, formatTimeKo } from './utils.js';
import { renderGallery } from './gallery.js';

let _currentPhotoId = null;

/** 라이트박스를 열고 해당 사진을 표시합니다. */
export function openLightbox(photoId) {
  const photos = loadPhotos();
  const photo = photos.find((p) => p.id === photoId);
  if (!photo) return;

  _currentPhotoId = photoId;

  document.getElementById('lbImg').src = photo.src;
  document.getElementById('lbDate').textContent = photo.date;
  document.getElementById('lbNote').textContent = photo.note || '';

  _renderComments();

  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** 라이트박스를 닫습니다. */
export function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  _currentPhotoId = null;
}

/** 댓글 목록을 렌더링합니다. */
function _renderComments() {
  const comments = loadComments(_currentPhotoId);
  const list = document.getElementById('commentList');

  if (comments.length === 0) {
    list.innerHTML = '<p class="no-comments">아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!</p>';
    return;
  }

  list.innerHTML = comments.map(_buildComment).join('');
}

/** 댓글 아이템 HTML을 생성합니다. */
function _buildComment(comment) {
  return `
    <div class="comment-item">
      <div class="comment-author">${escHtml(comment.author)}</div>
      <div class="comment-body">${escHtml(comment.body)}</div>
      <div class="comment-time">${comment.time}</div>
    </div>
  `;
}

/** 댓글을 제출합니다. */
function _submitComment() {
  const author = document.getElementById('commentAuthor').value.trim();
  const body = document.getElementById('commentBody').value.trim();

  if (!author) { showToast('이름을 입력해주세요'); return; }
  if (!body)   { showToast('댓글 내용을 입력해주세요'); return; }

  addComment(_currentPhotoId, { author, body, time: formatTimeKo() });

  document.getElementById('commentAuthor').value = '';
  document.getElementById('commentBody').value = '';

  _renderComments();
  renderGallery(); // 카드의 댓글 수 업데이트
  showToast('댓글이 등록됐어요 ✓');
}

/** 이벤트 리스너 등록 (main.js 에서 호출) */
export function initLightbox() {
  // 닫기 버튼
  document.getElementById('lbClose').addEventListener('click', closeLightbox);

  // 배경 클릭으로 닫기
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  // 댓글 등록
  document.getElementById('submitCommentBtn').addEventListener('click', _submitComment);

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 갤러리 카드 클릭 — 이벤트 위임
  document.getElementById('galleryGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openLightbox(card.dataset.id);
  });

  // 키보드 접근성
  document.getElementById('galleryGrid').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.card');
      if (card) { e.preventDefault(); openLightbox(card.dataset.id); }
    }
  });
}
