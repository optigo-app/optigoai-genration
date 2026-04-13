'use client';

import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, X, Zap } from 'lucide-react';
import ModeToggle from './ModeToggle';
import ImageLightbox from '../ImageLightbox';
import { COLORS, ANIM, RADIUS, SHADOWS, palette } from '../../theme/tokens';

export default function GenerateTopBar({ prompt, onPromptChange, mode, onModeChange, onGenerate, isGenerating, uploadedImages = [], onImagesChange }) {
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = palette(isDark);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map((f) => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(f), name: f.name }));
    onImagesChange?.([...uploadedImages, ...newImgs]);
    e.target.value = '';
  };

  const removeImage = (id) => onImagesChange?.(uploadedImages.filter((img) => img.id !== id));

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>

        {/* Prompt box with dot animation */}
        <Box sx={{ position: 'relative' }}>
          {/* Static border */}
          <Box sx={{ position: 'absolute', inset: 0, borderRadius: RADIUS.lg, border: '1px solid', borderColor: p.borderLight, pointerEvents: 'none', zIndex: 0 }} />

          {/* Dot 1 — purple, top */}
          <Box sx={{ position: 'absolute', inset: -1, borderRadius: RADIUS.lg, pointerEvents: 'none', zIndex: 1, overflow: 'hidden', '&::before': { content: '""', position: 'absolute', width: 80, height: 3, borderRadius: '50%', background: COLORS.gradientDotPurple, filter: 'blur(2px)', top: 0, left: '-80px', animation: `genDot1 ${ANIM.dotSpeed1} linear infinite` }, '@keyframes genDot1': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(calc(100vw + 80px))' } } }} />

          {/* Dot 2 — cyan, bottom */}
          <Box sx={{ position: 'absolute', inset: -1, borderRadius: RADIUS.lg, pointerEvents: 'none', zIndex: 1, overflow: 'hidden', '&::after': { content: '""', position: 'absolute', width: 60, height: 3, borderRadius: '50%', background: COLORS.gradientDotCyan, filter: 'blur(2px)', bottom: 0, right: '-60px', animation: `genDot2 ${ANIM.dotSpeed2} linear infinite`, animationDelay: '-1.5s' }, '@keyframes genDot2': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(calc(-100vw - 60px))' } } }} />

          {/* Inner */}
          <Box sx={{ position: 'relative', zIndex: 2, bgcolor: p.promptBg, backdropFilter: 'blur(16px)', borderRadius: '11px', overflow: 'hidden' }}>

            {/* Thumbnails */}
            <AnimatePresence>
              {uploadedImages.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, px: 1.5, pt: 0.75, pb: 0.25 }}>
                    <AnimatePresence>
                      {uploadedImages.map((img, i) => (
                        <motion.div key={img.id} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }} style={{ position: 'relative', flexShrink: 0 }}>
                          <Box
                            onClick={() => openLightbox(i)}
                            sx={{ width: 44, height: 44, borderRadius: RADIUS.sm, overflow: 'hidden', border: `1.5px solid ${COLORS.primaryAlpha[45]}`, cursor: 'pointer', transition: 'border-color 0.15s', '&:hover': { borderColor: COLORS.primary } }}
                          >
                            <Box component="img" src={img.url} alt={img.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </Box>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} sx={{ position: 'absolute', top: -5, right: -5, width: 15, height: 15, bgcolor: p.removeBg, border: `1px solid ${COLORS.primaryAlpha[45]}`, color: COLORS.primary, p: 0, zIndex: 2, '&:hover': { bgcolor: COLORS.primary, color: '#000' } }}>
                            <X size={8} strokeWidth={3} />
                          </IconButton>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {uploadedImages.length > 1 && (
                      <Box onClick={() => onImagesChange?.([])} sx={{ height: 44, px: 1, display: 'flex', alignItems: 'center', cursor: 'pointer', borderRadius: RADIUS.sm, border: '1px dashed', borderColor: p.borderMid, color: 'text.disabled', fontSize: '0.65rem', gap: 0.4, transition: 'all 0.15s', '&:hover': { borderColor: COLORS.primary, color: COLORS.primary } }}>
                        <X size={10} />Clear
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}>
              <Tooltip title="Upload reference images" placement="top">
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: uploadedImages.length > 0 ? 'primary.main' : 'text.disabled', flexShrink: 0, position: 'relative', '&:hover': { color: 'primary.main' } }}>
                  <ImagePlus size={17} strokeWidth={1.6} />
                  {uploadedImages.length > 0 && (
                    <Box sx={{ position: 'absolute', top: 1, right: 1, width: 13, height: 13, borderRadius: '50%', bgcolor: COLORS.primary, color: '#000', fontSize: '0.48rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                      {uploadedImages.length}
                    </Box>
                  )}
                </IconButton>
              </Tooltip>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />

              <InputBase
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Type a prompt..."
                fullWidth
                sx={{ fontSize: '0.88rem', color: 'text.primary', '& input::placeholder': { color: 'text.disabled', opacity: 1 } }}
                onKeyDown={(e) => e.key === 'Enter' && onGenerate?.()}
              />

              <Button
                variant="contained"
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                size="small"
                startIcon={isGenerating
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  : <Zap size={14} />}
                sx={{
                  background: COLORS.gradientPrimary,
                  color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                  px: 2, py: 0.75, borderRadius: RADIUS.sm, whiteSpace: 'nowrap', flexShrink: 0,
                  boxShadow: SHADOWS.buttonGlow,
                  '&:hover': { background: COLORS.gradientDeep },
                  '&.Mui-disabled': { background: COLORS.primaryAlpha[20], color: 'rgba(255,255,255,0.25)' },
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Mode toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ModeToggle value={mode} onChange={onModeChange} />
        </Box>
      </Box>

      {/* Lightbox */}
      <ImageLightbox
        images={uploadedImages}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onRemove={removeImage}
        onAddMore={() => fileInputRef.current?.click()}
      />
    </>
  );
}
