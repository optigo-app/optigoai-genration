'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check, Share2, Download,
  Expand, Wand2, Video, ImagePlus, MoreHorizontal, Play,
  BoxIcon, Pencil, Workflow
} from 'lucide-react';
import { COLORS, SHADOWS } from '@/theme/tokens';
import { handleDownloadFile } from '@/utils/globalFunc';
import { isVideoSource, isModelSource } from '@/utils/mediaType';
import useModelViewer from '@/hooks/useModelViewer';

// Shimmer skeleton shown while generating
export function GeneratingCard({ index = 0, aspectRatio = '1/1', loadingText = 'Generating...' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      style={{ borderRadius: 12, overflow: "hidden", aspectRatio }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 160,
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
          bgcolor: "rgba(192,132,252,0.04)"
        }}
      >
        {/* moving shimmer */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.2
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.primaryAlpha[15]} 40%, ${COLORS.cyanAlpha[12]} 60%, transparent 100%)`,
            zIndex: 1
          }}
        />

        {/* subtle glow border */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            boxShadow: `inset 0 0 0 1px ${COLORS.primaryAlpha[35]}`
          }}
        />

        {/* center content */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1
          }}
        >
          <CircularProgress
            size={18}
            thickness={5}
            sx={{ color: COLORS.primary }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textAlign: "center"
                }}
              >
                {loadingText}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
}

function HoverBtn({ title, onClick, children, variant = 'default' }) {
  const bgMap = {
    default: { bg: 'rgba(0,0,0,0.55)', hover: 'rgba(255,255,255,0.15)' },
    select: { bg: 'rgba(0,0,0,0.55)', hover: COLORS.primary },
    action: { bg: 'rgba(0,0,0,0.55)', hover: COLORS.primary },
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

export default function GeneratedImageCard({ src, alt, index = 0, onAction, selected = false, onSelect, onPreview, prompt = '', aspectRatio = '1/1' }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = isVideoSource(src);
  const isModel = isModelSource(src);
  const isModelViewerReady = useModelViewer(isModel);
  const canRunImageActions = !isVideo && !isModel;
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const cardRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    if (!isModel || !cardRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.75] }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isModel]);

  useEffect(() => {
    if (!isModel || !isModelViewerReady || !modelRef.current) return;

    if (isInViewport) {
      modelRef.current.setAttribute('auto-rotate', '');
      modelRef.current.play?.();
      return;
    }

    modelRef.current.removeAttribute('auto-rotate');
    modelRef.current.pause?.();
  }, [isModel, isModelViewerReady, isInViewport]);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (hovered) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => { });
      }
      return;
    }

    videoRef.current.pause();
  }, [hovered, isVideo]);

  return (
    <motion.div
      ref={cardRef}
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
          aspectRatio,
          border: '1.5px solid',
          borderColor: selected ? COLORS.primary : hovered ? COLORS.primaryAlpha[45] : 'rgba(255,255,255,0.07)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: hovered ? SHADOWS.cardGlow : 'none',
        }}
      >
        {isModel ? (
          <Box
            component={isModelViewerReady ? 'model-viewer' : 'div'}
            ref={isModelViewerReady ? modelRef : null}
            src={isModelViewerReady ? src : undefined}
            camera-controls={isModelViewerReady ? true : undefined}
            interaction-prompt={isModelViewerReady ? 'none' : undefined}
            disable-pan={isModelViewerReady ? true : undefined}
            disable-tap={isModelViewerReady ? true : undefined}
            sx={{
              width: '100%',
              height: '100%',
              display: 'block',
              bgcolor: '#0b0b0b',
            }}
          />
        ) : isVideo ? (
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
              height: '100%',
              display: 'block',
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
              height: '100%',
              display: 'block',
              objectFit: 'cover',
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
          <HoverBtn title="Download" onClick={() => handleDownloadFile(src)}><Download size={14} /></HoverBtn>
        </motion.div>

        {/* Play icon overlay for videos */}
        {isVideo && !hovered && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.2)',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={20} strokeWidth={2.5} fill="#000" color="#000" style={{ marginLeft: 2 }} />
            </Box>
          </Box>
        )}

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.18, delay: 0.05 }}
          style={{ position: 'absolute', bottom: 8, left: 8, pointerEvents: hovered ? 'auto' : 'none' }}
        >
          {canRunImageActions && (
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
          {canRunImageActions && <HoverBtn title="Generate Image" onClick={() => onAction?.('image', src, prompt)}><ImagePlus size={14} /></HoverBtn>}
          {canRunImageActions && <HoverBtn title="Generate Sketch" onClick={() => onAction?.('sketch', src, prompt)}><Pencil size={14} /></HoverBtn>}
          {canRunImageActions && <HoverBtn title="Generate CAD" onClick={() => onAction?.('cad', src, prompt)}><Workflow size={14} /></HoverBtn>}
          {canRunImageActions && <HoverBtn title="Edit" onClick={() => onAction?.('edit', src, prompt)}><Wand2 size={14} /></HoverBtn>}
          {canRunImageActions && <HoverBtn title="Generate Video" onClick={() => onAction?.('video', src, prompt)}><Video size={14} /></HoverBtn>}
          <HoverBtn title="More options"><MoreHorizontal size={14} /></HoverBtn>
        </motion.div>
      </Box>
    </motion.div>
  );
}
