// ══════════════════════════════════════════════
//  upload.js — 사진 업로드 패널
//  - 아이폰 사파리 호환 수정 (FileReader 직접 사용)
//  - 다중 파일 선택 지원
// ══════════════════════════════════════════════

import { addPhoto } from './storage.js';
import { showToast, formatDateKo } from './utils.js';
import { renderGallery } from './gallery.js';
import { isAdmin } from './auth.js';

/** 선택된 이미지 데이터 목록 { file, dataUrl } */
let _selectedFiles = [];

// ── 업로드 패널 토글 ──────────────────────────

export function toggleUploadPanel() {
  const panel = document.getElementById('uploadPanel');
  panel.hidden = !panel.hidden;
}

// ── 파일 읽기 (Safari 호환) ───────────────────
// crypto.subtle / async FileReader 대신
// 콜백 기반 FileReader를 Promise로 감싸서 사용

function _readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('파일을 읽을 수 없어요.'));
    reader.readAsDataURL(file);
  });
}

// ── 파일 선택 처리 ────────────────────────────

async function _onFilesSelected(files) {
  const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (imageFiles.length === 0) return;

  showToast(`${imageFiles.length}장 읽는 중...`);

  try {
    // 모든 파일을 병렬로 읽기
    const results = await Promise.all(
      imageFiles.map(async (file) => ({
        file,
        dataUrl: await _readFileAsDataUrl(file),
      }))
    );

    _selectedFiles = [..._selectedFiles, ...results];
    _renderPreviewGrid();

    // 드롭존 텍스트 업데이트
    document.getElementById('dropText').textContent =
      `✓ ${_selectedFiles.length}장 선택됨 — 더 추가하려면 다시 클릭하세요`;

  } catch (err) {
    showToast('사진을 읽는 중 오류가 났어요.');
    console.error(err);
  }
}

// ── 미리보기 그리드 렌더링 ────────────────────

function _renderPreviewGrid() {
  const grid = document.getElementById('previewGrid');
  grid.innerHTML = _selectedFiles.map((item, index) => `
    <div class="preview-item">
      <img src="${item.dataUrl}" alt="미리보기 ${index + 1}">
      <button class="preview-remove" data-index="${index}" aria-label="삭제">✕</button>
    </div>
  `).join('');

  // 개별 삭제 버튼
  grid.querySelectorAll('.preview-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.index);
      _selectedFiles.splice(i, 1);
      _renderPreviewGrid();

      if (_selectedFiles.length === 0) {
        document.getElementById('dropText').textContent =
          '📎 클릭하거나 사진을 여기로 드래그하세요';
      } else {
        document.getElementById('dropText').textContent =
          `✓ ${_selectedFiles.length}장 선택됨 — 더 추가하려면 다시 클릭하세요`;
      }
    });
  });
}

// ── 폼 초기화 ─────────────────────────────────

function _resetUploadForm() {
  _selectedFiles = [];
  document.getElementById('fileInput').value = '';
  document.getElementById('previewGrid').innerHTML = '';
  document.getElementById('dropText').textContent =
    '📎 클릭하거나 사진을 여기로 드래그하세요';
  document.getElementById('noteInput').value = '';
  document.getElementById('uploadPanel').hidden = true;
}

// ── 사진 제출 ─────────────────────────────────

function _submitPhoto() {
  if (!isAdmin()) return;
  if (_selectedFiles.length === 0) { showToast('사진을 선택해주세요'); return; }

  const note = document.getElementById('noteInput').value.trim();
  const date = formatDateKo();

  // 선택된 순서대로 저장 (가장 나중 것이 갤러리 맨 앞에 오도록 역순)
  [..._selectedFiles].reverse().forEach((item, i) => {
    addPhoto({
      id: (Date.now() + i).toString(),
      src: item.dataUrl,
      note,
      date,
    });
  });

  const count = _selectedFiles.length;
  renderGallery();
  _resetUploadForm();
  showToast(`${count > 1 ? `${count}장이` : '사진이'} 올라갔어요 ✓`);
}

// ── 이벤트 리스너 등록 ────────────────────────

export function initUpload() {
  const fileInput = document.getElementById('fileInput');
  const dropZone  = document.getElementById('dropZone');

  document.getElementById('uploadToggleBtn').addEventListener('click', toggleUploadPanel);
  document.getElementById('submitPhotoBtn').addEventListener('click', _submitPhoto);

  // 파일 선택 (change 이벤트 — Safari 호환)
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) _onFilesSelected(fileInput.files);
  });

  // 드래그 앤 드롭
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) _onFilesSelected(e.dataTransfer.files);
  });
}
