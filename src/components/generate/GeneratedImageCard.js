'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import {
  Check, Share2, Download,
  Expand, Wand2, Video, ImagePlus, MoreHorizontal
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/theme/tokens';

function isVideoSource(src = '') {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

async function downloadMedia(src, isVideo) {
  const extensionMatch = src.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/);
  const extension = extensionMatch?.[1] || (isVideo ? 'mp4' : 'jpg');
  const filename = `generated-${Date.now()}.${extension}`;

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const anchor = document.createElement('a');
    anchor.href = src;
    anchor.download = filename;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}

// Shimmer skeleton shown while generating
export function GeneratingCard({ index = 0, aspectRatio = '1/1' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      style={{ borderRadius: 12, overflow: 'hidden', aspectRatio }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 160,
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${COLORS.primaryAlpha[20]}`,
          bgcolor: 'rgba(192,132,252,0.04)',
        }}
      >
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }}
          style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.primaryAlpha[15]} 40%, ${COLORS.cyanAlpha[12]} 60%, transparent 100%)`,
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${COLORS.primaryAlpha[35]}` }}
        />
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            style={{ width: 28, height: 28, borderRadius: '50%', border: `2.5px solid ${COLORS.primaryAlpha[20]}`, borderTopColor: COLORS.primary }}
          />
        </Box>
      </Box>
    </motion.div>
  );
}

function HoverBtn({ title, onClick, children, variant = 'default' }) {
  const bgMap = {
    default: { bg: 'rgba(0,0,0,0.55)', hover: 'rgba(255,255,255,0.15)' },
    select:  { bg: 'rgba(0,0,0,0.55)', hover: COLORS.primary },
    action:  { bg: 'rgba(0,0,0,0.55)', hover: COLORS.primary },
  };
  const v = bgMap[variant] || bgMap.default;
  return (
    <Tooltip title={title} placement="top" arrow>
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        sx={{
          width: 32, height: 32,
          bgcolor: v.bg,
          color: '#fff',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.12)',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: v.hover, transform: 'scale(1.1)' },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default function GeneratedImageCard({ src, alt, index = 0, onAction, selected = false, onSelect, onPreview, prompt = '' }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = isVideoSource(src);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (hovered) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
      return;
    }

    videoRef.current.pause();
  }, [hovered, isVideo]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onPreview?.(index)}
      style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1.5px solid',
          borderColor: selected ? COLORS.primary : hovered ? COLORS.primaryAlpha[45] : 'rgba(255,255,255,0.07)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: hovered ? SHADOWS.cardGlow : 'none',
        }}
      >
        {isVideo ? (
          <Box
            component="video"
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            preload="metadata"
            sx={{
              width: '100%',
              display: 'block',
              aspectRatio: '16/9',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            component="img"
            src={src}
            alt={alt || 'Generated image'}
            sx={{
              width: '100%',
              display: 'block',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}

        {/* Dark overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        />

        {/* ── TOP-LEFT: Select ── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.18 }}
          style={{ position: 'absolute', top: 8, left: 8, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <HoverBtn title="Select" variant="select" onClick={() => onSelect?.(src)}>
            <Check size={15} strokeWidth={selected ? 3 : 2} color={selected ? COLORS.primary : '#fff'} />
          </HoverBtn>
        </motion.div>

        {/* ── TOP-RIGHT: Share, Download ── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.18, delay: 0.03 }}
          style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <HoverBtn title="Share"><Share2 size={14} /></HoverBtn>
          <HoverBtn title="Download" onClick={() => downloadMedia(src, isVideo)}><Download size={14} /></HoverBtn>
        </motion.div>

        {/* ── BOTTOM-LEFT: Upscale ── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.18, delay: 0.05 }}
          style={{ position: 'absolute', bottom: 8, left: 8, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          {!isVideo && (
            <HoverBtn title="Upscale" onClick={() => onAction?.('upscale', src, prompt)}>
              <Expand size={14} />
            </HoverBtn>
          )}
        </motion.div>

        {/* ── BOTTOM-RIGHT: Image, Edit, Video, More ── */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.18, delay: 0.05 }}
          style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 4, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          {!isVideo && <HoverBtn title="Generate Image" onClick={() => onAction?.('image', src, prompt)}><ImagePlus size={14} /></HoverBtn>}
          {!isVideo && <HoverBtn title="Edit" onClick={() => onAction?.('edit', src, prompt)}><Wand2 size={14} /></HoverBtn>}
          {!isVideo && <HoverBtn title="Generate Video" onClick={() => onAction?.('video', src, prompt)}><Video size={14} /></HoverBtn>}
          <HoverBtn title="More options"><MoreHorizontal size={14} /></HoverBtn>
        </motion.div>
      </Box>
    </motion.div>
  );
}
