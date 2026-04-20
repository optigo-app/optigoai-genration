'use client';

export function isVideoSource(src = '') {
  if (!src) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

export function isModelSource(src = '') {
  if (!src) return false;
  return /\.(glb|gltf)(?:$|[?#])/i.test(src) || src.includes('.glb') || src.includes('.gltf');
}
