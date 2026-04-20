'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Zap, Sparkles, Settings, UploadCloud } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';
import JewelryPromptBuilder from '@/components/PromptTemplates';
import ImageGuidanceCard from '@/components/ImageGuidanceCard';
import ReferenceCategorizationModal from '@/components/generate/ReferenceCategorizationModal';
import { COLORS, ANIM, RADIUS, SHADOWS, palette } from '@/theme/tokens';
import { useConfirmation } from '@/hooks/useConfirmation';
import toast from 'react-hot-toast';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      {...props}
    />
  );
});

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
  mode = 'image',
  imageUploadMode = 'single',
  onImageUploadModeChange,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [promptBuilderOpen, setPromptBuilderOpen] = useState(false);
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [uploadSlotIndex, setUploadSlotIndex] = useState(null);
  const [categorizationModalOpen, setCategorizationModalOpen] = useState(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const dragCounter = useRef(0);
  const [draftValue, setDraftValue] = useState(value);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = palette(isDark);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const isGenerateEnabled = typeof canGenerate === 'boolean' ? canGenerate : Boolean(draftValue.trim());
  const isPromptlessMode = mode === 'sketch' || mode === 'cad';
  const shouldStackActions = !isPromptlessMode && draftValue.trim().length > 90;
  const { confirm, ConfirmationComponent } = useConfirmation();

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const placeholderSuggestions = useMemo(() => {
    const suggestions = [
      placeholder,
      "Luxury diamond ring glowing under soft studio lighting.",
      "Elegant gold necklace displayed on a dark velvet background.",
      "Sparkling diamond earrings with dramatic lighting.",
      "Minimalist silver bracelet on a clean white background.",
      "Premium jewelry set with soft reflections and luxury feel.",
      "Close-up macro shot of a diamond ring with brilliant sparkle.",
    ];
    return [...new Set(suggestions.filter(Boolean))];
  }, [placeholder]);

  useEffect(() => {
    if (draftValue.length > 0 || placeholderSuggestions.length < 2) return;

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [draftValue, placeholderSuggestions]);

  useEffect(() => {
    const handleWindowDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (guidanceOpen) return;
      if (e.dataTransfer.types.includes('Files')) {
        setIsGlobalDragging(true);
      }
    };

    const handleWindowDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (guidanceOpen) return;
      if (e.dataTransfer.types.includes('Files')) {
        dragCounter.current++;
        setIsGlobalDragging(true);
      }
    };

    const handleWindowDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        setIsGlobalDragging(false);
        dragCounter.current = 0;
      }
    };

    const handleWindowDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsGlobalDragging(false);
      setIsOverDropZone(false);
      dragCounter.current = 0;
      // Note: We don't handle files here anymore, only on the explicit target box
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [imageUploadMode, uploadedImages]); // Re-bind if dependencies of handleFilesDrop change

  const handleFilesDrop = (droppedFiles) => {
    const files = Array.from(droppedFiles || []);
    if (files.length === 0) return;

    if (uploadedImages.length >= 6) {
      toast.error('Maximum of 6 reference images allowed');
      return;
    }

    // Category mapping based on upload mode and slot index
    // Single mode: ['jewelry', 'model'] matches ImageGuidanceCard uploadSteps
    // Multi mode: ['model', 'ring', 'necklace', 'bangle', 'earring', 'other'] matches ImageGuidanceCard uploadSteps
    const categoryMapping = imageUploadMode === 'single'
      ? ['jewelry', 'model']
      : ['model', 'ring', 'necklace', 'bangle', 'earring', 'other'];

    // For sketch and CAD modes, use specific categories instead of 'other'
    const defaultCategory = mode === 'sketch' ? 'sketch' : mode === 'cad' ? 'cad' : (imageUploadMode === 'single' ? 'jewelry' : null);

    // Reject files that would exceed the 6-slot limit
    const availableSlots = 6 - uploadedImages.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.error(`Only first ${availableSlots} images accepted (Limit: 6)`);
    }

    const newImgs = filesToAdd.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      name: f.name,
      category: (uploadSlotIndex !== null && uploadSlotIndex < categoryMapping.length)
        ? categoryMapping[uploadSlotIndex]
        : defaultCategory,
    }));

    if (uploadSlotIndex !== null && uploadSlotIndex >= 0) {
      const updated = [...uploadedImages];
      updated[uploadSlotIndex] = newImgs[0];
      onImagesChange?.(updated);
      setUploadSlotIndex(null);
    } else {
      const updated = [...uploadedImages, ...newImgs];
      onImagesChange?.(updated);
    }
  };

  const handleFileChange = (e) => {
    handleFilesDrop(e.target.files);
    e.target.value = '';
  };

  const handlePremadeModelSelect = (pmModel) => {
    const newImg = {
      id: `premade-${pmModel.id}-${Date.now()}`,
      url: pmModel.url,
      name: pmModel.name,
      category: 'model',
      isPremade: true
    };

    // Replace existing model if any, otherwise prepend
    const existingModelIndex = uploadedImages.findIndex(img => img.category === 'model');
    let updated;
    if (existingModelIndex !== -1) {
      updated = [...uploadedImages];
      updated[existingModelIndex] = newImg;
    } else {
      updated = [newImg, ...uploadedImages];
    }
    onImagesChange?.(updated);
  };

  const removeImage = (id) => onImagesChange?.(uploadedImages.filter((img) => img.id !== id));

  const openLightbox = (index) => { setLightboxIndex(index); setLightboxOpen(true); };

  const openImageGuidance = (event) => {
    // For sketch and CAD modes, skip Reference Studio and just open file input directly
    if (mode === 'sketch' || mode === 'cad') {
      setTimeout(() => fileInputRef.current?.click(), 0);
    } else {
      setGuidanceOpen(true);
    }
  };

  const closeImageGuidance = () => {
    setGuidanceOpen(false);
    onImagesChange?.([]);
  };

  const handleUpdateMediaCategory = (mediaId, category) => {
    const updated = uploadedImages.map(img =>
      img.id === mediaId ? { ...img, category } : img
    );
    onImagesChange?.(updated);
  };

  const handleRemoveMediaCategory = (mediaId) => {
    const updated = uploadedImages.map(img =>
      img.id === mediaId ? { ...img, category: null } : img
    );
    onImagesChange?.(updated);
  };

  const openSelectMediaDialog = (slotIndex = null) => {
    setUploadSlotIndex(slotIndex);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleContinue = () => {
    setGuidanceOpen(false); // Just close the dialog, keep images for generation
  };

  const handlePromptApply = (prompt) => {
    setDraftValue(prompt);
    onChange?.(prompt);
  };

  const handleGenerateClick = () => {
    if (!isGenerateEnabled || isGenerating) return;
    onChange?.(draftValue);
    onGenerate?.(draftValue);
  };

  const actionIconSx = {
    flexShrink: 0,
    width: 35,
    height: 35,
    borderRadius: RADIUS.lg,
  };

  const templateIconSx = {
    ...actionIconSx,
    color: COLORS.primary,
    border: '1px solid',
    borderColor: COLORS.primaryAlpha[30],
    bgcolor: COLORS.primaryAlpha[10],
    '&:hover': { bgcolor: COLORS.primaryAlpha[18], borderColor: COLORS.primaryAlpha[40] },
  };

  const getUploadIconSx = ({ active = false, alignWithImages = false } = {}) => ({
    ...actionIconSx,
    color: active ? COLORS.primary : p.uploadIcon,
    border: '1px solid',
    borderColor: active ? COLORS.primaryAlpha[35] : p.borderMid,
    bgcolor: active
      ? COLORS.primaryAlpha[10]
      : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(17, 24, 39, 0.03)'),
    ...(alignWithImages ? { alignSelf: 'flex-start', mt: 0.25 } : {}),
    '&:hover': {
      color: COLORS.primary,
      borderColor: COLORS.primaryAlpha[40],
      bgcolor: COLORS.primaryAlpha[10],
    },
  });

  const generateButtonSx = {
    background: COLORS.gradientPrimary,
    color: '#fff', fontWeight: 700, fontSize: '0.82rem',
    px: 2.5, py: 0.9, borderRadius: RADIUS.sm, whiteSpace: 'nowrap', flexShrink: 0,
    boxShadow: SHADOWS.buttonGlow,
    '&:hover': { background: COLORS.gradientDeep, boxShadow: SHADOWS.buttonGlowHover },
    '&.Mui-disabled': { background: COLORS.primaryAlpha[18], color: p.textDisabled, boxShadow: 'none' },
  };

  const renderTemplateButton = () => (
    <Tooltip title="Prompt templates" placement="top">
      <IconButton
        size="small"
        onClick={() => setPromptBuilderOpen(true)}
        sx={templateIconSx}
      >
        <Sparkles size={17} strokeWidth={1.8} />
      </IconButton>
    </Tooltip>
  );

  const renderUploadButton = ({ active = false, alignWithImages = false } = {}) => (
    <Tooltip title="Upload reference media" placement="top">
      <IconButton
        size="small"
        onClick={openImageGuidance}
        sx={getUploadIconSx({ active, alignWithImages })}
      >
        <ImagePlus size={17} strokeWidth={1.8} />
      </IconButton>
    </Tooltip>
  );

  const renderGenerateButton = () => (
    <Button
      variant="contained"
      disabled={!isGenerateEnabled || isGenerating}
      onClick={handleGenerateClick}
      size="small"
      startIcon={
        isGenerating
          ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
          : <Zap size={14} />
      }
      sx={generateButtonSx}
    >
      {isGenerating ? 'Generating...' : buttonLabel}
    </Button>
  );

  return (
    <>
      <Box
        ref={inputRef}
        sx={{
          position: 'relative',
          borderRadius: RADIUS.lg,
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
            borderRadius: RADIUS.lg,
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
          borderRadius: RADIUS.lg,
          overflow: 'hidden',
        }}>
          {/* Input row */}
          <Box sx={{ display: 'flex', alignItems: uploadedImages.length > 0 ? 'flex-start' : 'center', px: 1.5, py: 1, gap: 1, minHeight: 58 }}>
            {!(uploadedImages.length === 0 && shouldStackActions) && (
              renderUploadButton({
                active: uploadedImages.length > 0,
                alignWithImages: uploadedImages.length > 0,
              })
            )}
            <input ref={fileInputRef} type="file" accept={uploadAccept} multiple style={{ display: 'none' }} onChange={handleFileChange} />

            <Box sx={{ position: 'relative', flex: 1, minHeight: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.4 }}>
              {!isPromptlessMode ? (
                <>
                  <AnimatePresence mode="wait" initial={false}>
                    {draftValue.length === 0 && (
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
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    placeholder=""
                    fullWidth
                    multiline
                    maxRows={5}
                    sx={{
                      color: p.text,
                      fontSize: '0.9rem',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(148, 163, 184, 0.55) rgba(148, 163, 184, 0.14)',
                      '& textarea': {
                        position: 'relative',
                        zIndex: 1,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        lineHeight: 1.45,
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(148, 163, 184, 0.55) rgba(148, 163, 184, 0.14)',
                      },
                      '& textarea::-webkit-scrollbar': { width: 7 },
                      '& textarea::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(148, 163, 184, 0.14)',
                        borderRadius: 8,
                      },
                      '& textarea::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(148, 163, 184, 0.55)',
                        borderRadius: 8,
                      },
                      '& textarea::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'rgba(148, 163, 184, 0.75)',
                      },
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isGenerateEnabled && !isGenerating) {
                        handleGenerateClick();
                      }
                    }}
                  />
                </>
              ) : (
                <Typography sx={{ color: p.textSecondary, fontSize: '0.82rem' }}>
                  {mode === 'sketch'
                    ? 'Prompt is not required for Sketch. Upload an image and click Generate.'
                    : 'Prompt is not required for CAD. Upload an image and click Generate.'}
                </Typography>
              )}

              {/* Action buttons - shown inline when no images and prompt is short */}
              {uploadedImages.length === 0 && !shouldStackActions && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 1 }}>
                  {!isPromptlessMode && renderTemplateButton()}
                  {renderGenerateButton()}
                </Box>
              )}
            </Box>

          </Box>

          {/* Bottom row for long prompt (no uploaded images) */}
          {uploadedImages.length === 0 && shouldStackActions && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 0.75,
                px: 1.5,
                pb: 1,
                pt: 0.25,
              }}
            >
              {renderUploadButton()}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {!isPromptlessMode && renderTemplateButton()}
                {renderGenerateButton()}
              </Box>
            </Box>
          )}

          {/* Bottom row (Uploads + Actions) - only shown when there are uploaded images */}
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
                  {uploadedImages.filter(img => ['model', 'ring', 'necklace', 'bangle', 'earring', 'sketch', 'jewelry', 'cad'].includes(img.category)).map((img, i) => (
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

                {uploadedImages.length > 0 && (
                  <Box
                    onClick={() => confirm('clearAllUploads', () => onImagesChange?.([]))}
                    sx={{ px: 0.75, py: 0.25, borderRadius: RADIUS.xs, border: '1px dashed', borderColor: p.borderMid, cursor: 'pointer', color: 'text.disabled', fontSize: '0.62rem', '&:hover': { color: COLORS.primary, borderColor: COLORS.primary } }}
                  >
                    Clear all
                  </Box>
                )}

                {imageUploadMode === 'multi' && uploadedImages.length > 0 && (
                  <Box
                    onClick={() => setCategorizationModalOpen(true)}
                    sx={{
                      px: 0.75,
                      py: 0.25,
                      borderRadius: RADIUS.xs,
                      border: '1px solid',
                      borderColor: COLORS.primaryAlpha[30],
                      cursor: 'pointer',
                      color: COLORS.primary,
                      fontSize: '0.62rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: COLORS.primaryAlpha[10],
                      '&:hover': { bgcolor: COLORS.primaryAlpha[18], borderColor: COLORS.primary }
                    }}
                  >
                    <Settings size={10} />
                    Categorize
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                {!isPromptlessMode && renderTemplateButton()}
                {renderGenerateButton()}
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

      <Dialog
        open={guidanceOpen}
        onClose={closeImageGuidance}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Transition}
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(12px)', bgcolor: 'rgba(0,0,0,0.4)' } },
          paper: {
            sx: {
              borderRadius: RADIUS.lg,
              bgcolor: isDark ? '#141414' : '#fff',
              backgroundImage: 'none',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }
          }
        }}
      >
        <ImageGuidanceCard
          guidanceType={mode}
          uploadedMedia={uploadedImages}
          onClose={closeImageGuidance}
          onOpenSelectMedia={openSelectMediaDialog}
          onFilesDrop={handleFilesDrop}
          onUpdateMediaCategory={handleUpdateMediaCategory}
          onRemoveMediaCategory={handleRemoveMediaCategory}
          onDeleteMedia={removeImage}
          onClearAllMedia={() => onImagesChange?.([])}
          onContinue={handleContinue}
          imageUploadMode={imageUploadMode}
          onImageUploadModeChange={onImageUploadModeChange}
          onPremadeModelSelect={handlePremadeModelSelect}
        />
      </Dialog>

      {/* Lightbox */}
      <ImageLightbox
        images={uploadedImages}
        startIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onRemove={removeImage}
        onAddMore={() => { setLightboxOpen(false); setTimeout(() => fileInputRef.current?.click(), 100); }}
      />
      <ReferenceCategorizationModal
        open={categorizationModalOpen}
        onClose={() => setCategorizationModalOpen(false)}
        images={uploadedImages}
        onUpdateImages={onImagesChange}
      />
      <ConfirmationComponent />

      {/* Full Page Drop Overlay */}
      <AnimatePresence>
        {isGlobalDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none', // Allow drop to pass through to the listener
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: isOverDropZone ? 1.05 : 1,
                opacity: 1,
                borderColor: isOverDropZone ? COLORS.primary : `rgba(115,103,240,0.5)`,
                backgroundColor: isOverDropZone ? 'rgba(115,103,240,0.15)' : 'rgba(115,103,240,0.05)',
                boxShadow: isOverDropZone ? `0 0 50px ${COLORS.primaryAlpha[30]}` : 'none'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsOverDropZone(true);
              }}
              onDragLeave={() => setIsOverDropZone(false)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsGlobalDragging(false);
                setIsOverDropZone(false);
                dragCounter.current = 0;
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFilesDrop(e.dataTransfer.files);
                  // Don't open Reference Studio for sketch and CAD modes - they accept single image directly
                  if (mode !== 'sketch' && mode !== 'cad') {
                    setGuidanceOpen(true);
                  }
                }
              }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                textAlign: 'center',
                padding: '100px 60px',
                width: 'min(800px, 90%)',
                borderRadius: RADIUS.xl,
                border: `4px dashed`,
                color: COLORS.primary,
                pointerEvents: 'auto', // Important: Capture events here
                cursor: 'copy',
              }}
            >
              <UploadCloud size={80} style={{ marginBottom: '20px' }} />
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -2, mb: 1.5 }}>
                REFERENCE DROP
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600 }}>
                Drop inside this box to accept images
              </Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '0.75rem', mt: 1 }}>
                Drops outside this area will be ignored.
              </Typography>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
