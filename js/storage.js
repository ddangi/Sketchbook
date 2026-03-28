// ══════════════════════════════════════════════
//  storage.js — 데이터 저장·불러오기 (localStorage)
//  나중에 Firebase 등으로 교체할 때 이 파일만 수정하면 됩니다.
// ══════════════════════════════════════════════

import { CONFIG } from './config.js';

// ── 사진 ──

/** 저장된 사진 목록을 불러옵니다. */
export function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_PHOTOS) || '[]');
  } catch {
    return [];
  }
}

/** 사진 목록을 저장합니다. */
export function savePhotos(photos) {
  localStorage.setItem(CONFIG.STORAGE_KEY_PHOTOS, JSON.stringify(photos));
}

/** 새 사진을 목록 맨 앞에 추가합니다. */
export function addPhoto(photo) {
  const photos = loadPhotos();
  photos.unshift(photo);
  savePhotos(photos);
  return photos;
}

// ── 댓글 ──

/** 특정 사진의 댓글 목록을 불러옵니다. */
export function loadComments(photoId) {
  try {
    const key = CONFIG.STORAGE_KEY_COMMENTS_PREFIX + photoId;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

/** 특정 사진의 댓글 목록을 저장합니다. */
export function saveComments(photoId, comments) {
  const key = CONFIG.STORAGE_KEY_COMMENTS_PREFIX + photoId;
  localStorage.setItem(key, JSON.stringify(comments));
}

/** 특정 사진에 댓글을 추가합니다. */
export function addComment(photoId, comment) {
  const comments = loadComments(photoId);
  comments.push(comment);
  saveComments(photoId, comments);
  return comments;
}
