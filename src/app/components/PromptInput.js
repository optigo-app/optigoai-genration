'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Zap } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import { COLORS, ANIM, RADIUS, SHADOWS, palette } from '../theme/tokens';

/**
 * Shared prompt input used on both home page and generate page.
 *
 * Props:
 *   value          – controlled prompt string
 *   onChange       – (string) => void
 *   onGenerate     – () => void  called when Generate clicked / Enter pressed
 *   isGenerating   – bool  shows spinner in button
 *   buttonLabel    – string  default "Generate"
 *   placeholder    – string
 *   uploadedImages – array of { id, url, name }
 *   onImagesChange – (images[]) => void
 *   inputRef       – optional ref forwarded to the outer wrapper
 *   radius         – border-radius string, default '14px'
 */
export default function PromptInput({
  value = '',
  onChange,
  onGenerate,
  isGenerating = false,
  buttonLabel = 'Generate',
  placeholder = 'Type a prompt...',
  uploadedImages = [],
  onImagesChange,
  inputRef,
  radius = '14px',
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = palette(isDark);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    onImagesChange?.([...uploadedImages, ...newImgs]);
    e.target.value = '';
  };

  const removeImage = (id) => onImagesChange?.(uploadedImages.filter((img) => img.id !== id));

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };

  const innerRadius = `calc(${radius} - 1.5px)`;

  return (
    <>
      <Box ref={inputRef} sx={{ position: 'relative' }}>
        {/* Static border */}
        <Box sx={{ position: 'absolute', inset: 0, borderRadius: radius, border: '1px solid', borderColor: p.borderLight, pointerEvents: 'none', zIndex: 0 }} />

        {/* Dot 1 — purple, top edge */}
        <Box sx={{
          position: 'absolute', inset: -1, borderRadius: radius,
          pointerEvents: 'none', zIndex: 3, overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute',
            width: 80, height: 3, borderRadius: '50%',
            background: COLORS.gradientDotPurple,
            filter: 'blur(2px)', top: 0, left: '-80px',
            animation: `piDot1 ${ANIM.dotSpeed1} linear infinite`,
          },
          '@keyframes piDot1': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(calc(100vw + 80px))' } },
        }} />

        {/* Dot 2 — cyan, bottom edge */}
        <Box sx={{
          position: 'absolute', inset: -1, borderRadius: radius,
          pointerEvents: 'none', zIndex: 3, overflow: 'hidden',
          '&::after': {
            content: '""', position: 'absolute',
            width: 60, height: 3, borderRadius: '50%',
            background: COLORS.gradientDotCyan,
            filter: 'blur(2px)', bottom: 0, right: '-60px',
            animation: `piDot2 ${ANIM.dotSpeed2} linear infinite`, animationDelay: '-1.5s',
          },
          '@keyframes piDot2': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(calc(-100vw - 60px))' } },
        }} />

        {/* Inner content */}
        <Box sx={{
          position: 'relative', zIndex: 2,
          bgcolor: p.promptBg,
          backdropFilter: 'blur(16px)',
          borderRadius: innerRadius,
          overflow: 'hidden',
        }}>
          {/* Uploaded image thumbnails */}
          <AnimatePresence>
            {uploadedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, pt: 1, pb: 0.5, flexWrap: 'wrap' }}>
                  <AnimatePresence>
                    {uploadedImages.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.18 }}
                        style={{ position: 'relative', flexShrink: 0 }}
                      >
                        <Box
                          onClick={() => openLightbox(i)}
                          sx={{
                            width: 40, height: 40, borderRadius: '7px', overflow: 'hidden',
                            border: `1.5px solid ${COLORS.primaryAlpha[45]}`, cursor: 'pointer',
                            transition: 'border-color 0.15s', '&:hover': { borderColor: COLORS.primary },
                          }}
                        >
                          <Box component="img" src={img.url} alt={img.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                          sx={{ position: 'absolute', top: -5, right: -5, width: 15, height: 15, bgcolor: p.removeBg, border: `1px solid ${COLORS.primaryAlpha[45]}`, color: COLORS.primary, p: 0, zIndex: 2, '&:hover': { bgcolor: COLORS.primary, color: '#000' } }}
                        >
                          <X size={8} strokeWidth={3} />
                        </IconButton>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {uploadedImages.length > 1 && (
                    <Box
                      onClick={() => onImagesChange?.([])}
                      sx={{ px: 0.75, py: 0.25, borderRadius: RADIUS.xs, border: '1px dashed', borderColor: p.borderMid, cursor: 'pointer', color: 'text.disabled', fontSize: '0.62rem', '&:hover': { color: COLORS.primary, borderColor: COLORS.primary } }}
                    >
                      Clear all
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.85, gap: 1 }}>
            <Tooltip title="Upload reference images" placement="top">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: uploadedImages.length > 0 ? COLORS.primary : p.uploadIcon, flexShrink: 0, '&:hover': { color: COLORS.primary } }}
              >
                <ImagePlus size={18} strokeWidth={1.6} />
              </IconButton>
            </Tooltip>
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />

            <InputBase
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              fullWidth
              sx={{
                color: p.text,
                fontSize: '0.9rem',
                '& input::placeholder': { color: p.textDisabled, opacity: 1 },
              }}
              onKeyDown={(e) => e.key === 'Enter' && onGenerate?.()}
            />

            <Button
              variant="contained"
              disabled={!value.trim() || isGenerating}
              onClick={onGenerate}
              size="small"
              startIcon={
                isGenerating
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  : <Zap size={14} />
              }
              sx={{
                background: COLORS.gradientPrimary,
                color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                px: 2.5, py: 0.8, borderRadius: RADIUS.sm, whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: SHADOWS.buttonGlow,
                '&:hover': { background: COLORS.gradientDeep, boxShadow: SHADOWS.buttonGlowHover },
                '&.Mui-disabled': { background: COLORS.primaryAlpha[18], color: p.textDisabled, boxShadow: 'none' },
              }}
            >
              {isGenerating ? 'Generating...' : buttonLabel}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Lightbox */}
      <ImageLightbox
        images={uploadedImages}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onRemove={removeImage}
        onAddMore={() => { setLightboxOpen(false); setTimeout(() => fileInputRef.current?.click(), 100); }}
      />
    </>
  );
}
