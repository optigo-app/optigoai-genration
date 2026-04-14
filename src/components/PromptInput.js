'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Zap, Sparkles } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';
import JewelryPromptBuilder from '@/components/PromptTemplates';
import ImageGuidanceCard from '@/components/ImageGuidanceCard';
import { COLORS, ANIM, RADIUS, SHADOWS, palette } from '@/theme/tokens';


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
  canGenerate,
  buttonLabel = 'Generate',
  placeholder = 'Type a prompt...',
  uploadedImages = [],
  uploadAccept = 'image/*',
  onImagesChange,
  inputRef,
  radius = '14px',
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [promptBuilderOpen, setPromptBuilderOpen] = useState(false);
  const [guidanceAnchorEl, setGuidanceAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = palette(isDark);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const isGenerateEnabled = typeof canGenerate === 'boolean' ? canGenerate : Boolean(value.trim());

  const placeholderSuggestions = useMemo(() => {
    const suggestions = [
      placeholder,
      'A cinematic portrait with soft rim lighting',
      'A futuristic city skyline at sunrise',
      'Minimal product shot on a clean background',
    ];
    return [...new Set(suggestions.filter(Boolean))];
  }, [placeholder]);

  useEffect(() => {
    if (value.trim() || placeholderSuggestions.length < 2) return;

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [value, placeholderSuggestions]);

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

  const openImageGuidance = (event) => {
    setGuidanceAnchorEl(event.currentTarget);
  };

  const closeImageGuidance = () => {
    setGuidanceAnchorEl(null);
  };

  const openSelectMediaDialog = () => {
    closeImageGuidance();
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handlePromptApply = (prompt) => {
    onChange?.(prompt);
  };

  const innerRadius = `calc(${radius} - 1.5px)`;

  return (
    <>
      <Box
        ref={inputRef}
        sx={{
          position: 'relative',
          borderRadius: radius,
          boxShadow: isDark
            ? '0 16px 34px rgba(0, 0, 0, 0.42)'
            : '0 10px 26px rgba(31, 41, 55, 0.12)',
        }}
      >
        {/* Static border */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            border: '1px solid',
            borderColor: isDark ? COLORS.primaryAlpha[35] : 'rgba(115, 103, 240, 0.22)',
            boxShadow: isDark
              ? 'inset 0 1px 0 rgba(255,255,255,0.08)'
              : 'inset 0 1px 0 rgba(255,255,255,0.9)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Dot 1 — purple, top edge */}
        <Box sx={{
          position: 'absolute', inset: -1, borderRadius: radius,
          pointerEvents: 'none', zIndex: 3, overflow: 'hidden',
          '&::before': {
            content: '""', position: 'absolute',
            width: 80, height: 3, borderRadius: '50%',
            background: isDark ? COLORS.gradientDotPurple : 'radial-gradient(ellipse at center, rgba(115,103,240,0.55) 0%, rgba(115,103,240,0) 100%)',
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
            background: isDark ? COLORS.gradientDotCyan : 'radial-gradient(ellipse at center, rgba(103,232,249,0.6) 0%, rgba(103,232,249,0) 100%)',
            filter: 'blur(2px)', bottom: 0, right: '-60px',
            animation: `piDot2 ${ANIM.dotSpeed2} linear infinite`, animationDelay: '-1.5s',
          },
          '@keyframes piDot2': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(calc(-100vw - 60px))' } },
        }} />

        {/* Inner content */}
        <Box sx={{
          position: 'relative', zIndex: 2,
          bgcolor: isDark ? p.promptBg : '#ffffff',
          backgroundImage: isDark ? 'none' : 'linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%)',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17, 24, 39, 0.08)',
          backdropFilter: 'blur(16px)',
          borderRadius: innerRadius,
          overflow: 'hidden',
        }}>
          {/* Input row */}
          <Box sx={{ display: 'flex', alignItems: uploadedImages.length > 0 ? 'flex-start' : 'center', px: 1.5, py: 1, gap: 1, minHeight: 58 }}>
            <Tooltip title="Upload reference media" placement="top">
              <IconButton
                size="small"
                onClick={openImageGuidance}
                sx={{
                  color: uploadedImages.length > 0 ? COLORS.primary : p.uploadIcon,
                  flexShrink: 0,
                  alignSelf: uploadedImages.length > 0 ? 'flex-start' : 'center',
                  mt: uploadedImages.length > 0 ? 0.25 : 0,
                  '&:hover': { color: COLORS.primary },
                }}
              >
                <ImagePlus size={18} strokeWidth={1.6} />
              </IconButton>
            </Tooltip>
            <input ref={fileInputRef} type="file" accept={uploadAccept} multiple style={{ display: 'none' }} onChange={handleFileChange} />

            <Box sx={{ position: 'relative', flex: 1, minHeight: 24, display: 'flex', alignItems: 'center', pt: 0.4 }}>
              <AnimatePresence mode="wait" initial={false}>
                {!value.trim() && (
                  <motion.span
                    key={placeholderSuggestions[placeholderIndex]}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      color: isDark ? p.textDisabled : 'rgba(68, 64, 80, 0.55)',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      pointerEvents: 'none',
                    }}
                  >
                    {placeholderSuggestions[placeholderIndex]}
                  </motion.span>
                )}
              </AnimatePresence>

              <InputBase
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder=""
                fullWidth
                multiline
                maxRows={5}
                sx={{
                  color: p.text,
                  fontSize: '0.9rem',
                  '& textarea': {
                    position: 'relative',
                    zIndex: 1,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    lineHeight: 1.45,
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isGenerateEnabled && !isGenerating) {
                    onGenerate?.();
                  }
                }}
              />
              {/* Action buttons - shown inline when no images */}
              {uploadedImages.length === 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 1 }}>
                  <Tooltip title="Prompt templates" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => setPromptBuilderOpen(true)}
                      sx={{
                        color: COLORS.primary,
                        border: '1px solid',
                        borderColor: COLORS.primaryAlpha[30],
                        bgcolor: COLORS.primaryAlpha[10],
                        flexShrink: 0,
                        '&:hover': { bgcolor: COLORS.primaryAlpha[18], borderColor: COLORS.primaryAlpha[40] },
                      }}
                    >
                      <Sparkles size={15} strokeWidth={1.8} />
                    </IconButton>
                  </Tooltip>

                  <Button
                    variant="contained"
                    disabled={!isGenerateEnabled || isGenerating}
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
                      px: 2.5, py: 0.9, borderRadius: RADIUS.sm, whiteSpace: 'nowrap', flexShrink: 0,
                      boxShadow: SHADOWS.buttonGlow,
                      '&:hover': { background: COLORS.gradientDeep, boxShadow: SHADOWS.buttonGlowHover },
                      '&.Mui-disabled': { background: COLORS.primaryAlpha[18], color: p.textDisabled, boxShadow: 'none' },
                    }}
                  >
                    {isGenerating ? 'Generating...' : buttonLabel}
                  </Button>
                </Box>
              )}
            </Box>

          </Box>

          {/* Bottom row - only shown when there are uploaded images */}
          {uploadedImages.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                px: 1.5,
                pt: 0.35,
                pb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', minHeight: 40, flex: 1 }}>
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
                          width: 52,
                          height: 52,
                          borderRadius: '7px',
                          overflow: 'hidden',
                          border: `1.5px solid ${COLORS.primaryAlpha[45]}`,
                          cursor: 'pointer',
                          transition: 'border-color 0.15s',
                          '&:hover': { borderColor: COLORS.primary },
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                <Tooltip title="Prompt templates" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => setPromptBuilderOpen(true)}
                    sx={{
                      color: COLORS.primary,
                      border: '1px solid',
                      borderColor: COLORS.primaryAlpha[30],
                      bgcolor: COLORS.primaryAlpha[10],
                      flexShrink: 0,
                      '&:hover': { bgcolor: COLORS.primaryAlpha[18], borderColor: COLORS.primaryAlpha[40] },
                    }}
                  >
                    <Sparkles size={15} strokeWidth={1.8} />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="contained"
                  disabled={!isGenerateEnabled || isGenerating}
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
                    px: 2.5, py: 0.9, borderRadius: RADIUS.sm, whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: SHADOWS.buttonGlow,
                    '&:hover': { background: COLORS.gradientDeep, boxShadow: SHADOWS.buttonGlowHover },
                    '&.Mui-disabled': { background: COLORS.primaryAlpha[18], color: p.textDisabled, boxShadow: 'none' },
                  }}
                >
                  {isGenerating ? 'Generating...' : buttonLabel}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <JewelryPromptBuilder
        open={promptBuilderOpen}
        onClose={() => setPromptBuilderOpen(false)}
        onApply={handlePromptApply}
        initialPrompt={value}
      />

      <Popover
        open={Boolean(guidanceAnchorEl)}
        anchorEl={guidanceAnchorEl}
        onClose={closeImageGuidance}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            bgcolor: 'transparent', boxShadow: 'none', mt: 1
          }
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: RADIUS.lg,
          }
        }}
      >
        <ImageGuidanceCard
          guidanceType={uploadAccept.includes('video') ? 'video' : 'image'}
          onClose={closeImageGuidance}
          onOpenSelectMedia={openSelectMediaDialog}
        />
      </Popover>

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
