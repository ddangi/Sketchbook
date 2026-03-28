// ══════════════════════════════════════════════
//  upload.js — 사진 업로드 패널
// ══════════════════════════════════════════════

import { addPhoto } from './storage.js';
import { showToast, formatDateKo, fileToDataUrl } from './utils.js';
import { renderGallery } from './gallery.js';
import { isAdmin } from './auth.js';

let _selectedImageData = null;

/** 업로드 패널 토글 */
export function toggleUploadPanel() {
  const panel = document.getElementById('uploadPanel');
  panel.hidden = !panel.hidden;
}

/** 사진 선택 시 미리보기 표시 */
async function _onFileSelect(file) {
  if (!file || !file.type.startsWith('image/')) return;

  try {
    _selectedImageData = await fileToDataUrl(file);
    const img = document.getElementById('previewImg');
    img.src = _selectedImageData;
    img.hidden = false;
    document.getElementById('dropText').style.display = 'none';
  } catch (err) {
    showToast('사진을 읽을 수 없어요.');
    console.error(err);
  }
}

/** 업로드 폼 초기화 */
function _resetUploadForm() {
  _selectedImageData = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('previewImg').hidden = true;
  document.getElementById('dropText').style.display = '';
  document.getElementById('noteInput').value = '';
  document.getElementById('uploadPanel').hidden = true;
}

/** 사진 제출 */
function _submitPhoto() {
  if (!isAdmin()) return;
  if (!_selectedImageData) { showToast('사진을 선택해주세요'); return; }

  const note = document.getElementById('noteInput').value.trim();

  addPhoto({
    id: Date.now().toString(),
    src: _selectedImageData,
    note,
    date: formatDateKo(),
  });

  renderGallery();
  _resetUploadForm();
  showToast('사진이 올라갔어요 ✓');
}

/** 이벤트 리스너 등록 (main.js 에서 호출) */
export function initUpload() {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');

  document.getElementById('uploadToggleBtn').addEventListener('click', toggleUploadPanel);
  document.getElementById('submitPhotoBtn').addEventListener('click', _submitPhoto);

  // 파일 선택
  fileInput.addEventListener('change', () => _onFileSelect(fileInput.files[0]));

  // 드래그 앤 드롭
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    _onFileSelect(e.dataTransfer.files[0]);
  });
}
