'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import { COLORS, RADIUS } from '../theme/tokens';

export default function ImageLightbox({ images, startIndex = 0, open, onClose, onRemove, onAddMore }) {
  const [current, setCurrent] = useState(startIndex);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Sync startIndex when opening
  useEffect(() => { if (open) setCurrent(startIndex); }, [open, startIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') setCurrent((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % images.length);
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, images.length, onClose]);

  const img = images[current];
  if (!img) return null;

  const handleRemove = () => {
    onRemove?.(img.id);
    if (images.length <= 1) { onClose?.(); return; }
    setCurrent((i) => Math.min(i, images.length - 2));
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, zIndex: 1400 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        style={{ outline: 'none', width: '100%', maxWidth: 700 }}
      >
        <Box sx={{ bgcolor: isDark ? '#0f0a1e' : '#fff', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>
              {current + 1} / {images.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Add more images" placement="top">
                <IconButton size="small" onClick={() => { onClose?.(); setTimeout(() => onAddMore?.(), 80); }} sx={{ color: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryAlpha[10] } }}>
                  <Plus size={16} strokeWidth={2} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove this image" placement="top">
                <IconButton size="small" onClick={handleRemove} sx={{ color: COLORS.red, '&:hover': { bgcolor: 'rgba(248,113,113,0.1)' } }}>
                  <Trash2 size={16} strokeWidth={2} />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={onClose} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                <X size={16} strokeWidth={2} />
              </IconButton>
            </Box>
          </Box>

          {/* Main image */}
          <Box sx={{ position: 'relative', bgcolor: isDark ? '#0a0614' : '#f0ecff', minHeight: 200 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={img.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
              >
                <Box component="img" src={img.url} alt={img.name} sx={{ width: '100%', maxHeight: '62vh', objectFit: 'contain', display: 'block' }} />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <IconButton onClick={() => setCurrent((i) => (i - 1 + images.length) % images.length)} sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: `${COLORS.primaryHover}b3` } }}>
                  <ChevronLeft size={20} />
                </IconButton>
                <IconButton onClick={() => setCurrent((i) => (i + 1) % images.length)} sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: `${COLORS.primaryHover}b3` } }}>
                  <ChevronRight size={20} />
                </IconButton>
              </>
            )}
          </Box>

          {/* Filename */}
          <Box sx={{ px: 2.5, py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {img.name}
            </Typography>
          </Box>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 0.75, px: 2, pb: 1.5, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {images.map((im, i) => (
                <Box key={im.id} onClick={() => setCurrent(i)} sx={{ width: 48, height: 48, borderRadius: RADIUS.sm, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: '2px solid', borderColor: i === current ? COLORS.primary : 'transparent', opacity: i === current ? 1 : 0.5, transition: 'all 0.15s', '&:hover': { opacity: 1 } }}>
                  <Box component="img" src={im.url} alt={im.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </motion.div>
    </Modal>
  );
}
