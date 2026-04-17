'use client';

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { X, User2, Gem, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, RADIUS, SHADOWS, palette } from '@/theme/tokens';

const CATEGORIES = [
  { id: 'model', label: 'Model', icon: User2, description: 'The person wearing the jewelry' },
  { id: 'ring', label: 'Ring', icon: Gem, description: 'Ring reference' },
  { id: 'necklace', label: 'Necklace', icon: Gem, description: 'Necklace reference' },
  { id: 'bangle', label: 'Bangle', icon: Gem, description: 'Bangle/Bracelet reference' },
  { id: 'earring', label: 'Earring', icon: Gem, description: 'Earring reference' },
  { id: 'other', label: 'Other', icon: Gem, description: 'Additional jewelry items' },
];

export default function ReferenceCategorizationModal({
  open = false,
  onClose,
  images = [],
  onUpdateImages,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const p = palette(isDark);

  const [localImages, setLocalImages] = useState(images);

  // Sync with props when modal opens
  useMemo(() => {
    if (open) {
      setLocalImages(images);
    }
  }, [open, images]);

  const handleUpdateCategory = (imageId, category) => {
    setLocalImages(prev => prev.map(img => {
      if (img.id === imageId) {
        return { ...img, category };
      }
      // If setting a new model, remove model category from others
      if (category === 'model' && img.category === 'model') {
        return { ...img, category: 'other' };
      }
      return img;
    }));
  };

  const handleSave = () => {
    onUpdateImages(localImages);
    onClose();
  };

  const modelCount = localImages.filter(img => img.category === 'model').length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: isDark ? 'background.paper' : '#fff',
          borderRadius: RADIUS.lg,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: SHADOWS.modal,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
              Reference Categorization
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Assign each image a category for better AI generation results
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {localImages.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.disabled' }}>No reference images uploaded yet.</Typography>
            </Box>
          ) : (
            localImages.map((img) => (
              <Box
                key={img.id}
                sx={{
                  display: 'flex',
                  gap: 3,
                  p: 2,
                  borderRadius: RADIUS.md,
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
                }}
              >
                {/* Image Preview */}
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: RADIUS.sm,
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: img.category === 'model' ? COLORS.primary : 'transparent',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <Box component="img" src={img.url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {img.category === 'model' && (
                    <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: COLORS.primary, borderRadius: '50%', p: 0.5, display: 'flex' }}>
                      <CheckCircle2 size={12} color="#fff" />
                    </Box>
                  )}
                </Box>

                {/* Categories */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Category
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = img.category === cat.id;
                      return (
                        <Button
                          key={cat.id}
                          size="small"
                          variant={isSelected ? 'contained' : 'outlined'}
                          onClick={() => handleUpdateCategory(img.id, cat.id)}
                          startIcon={<Icon size={14} />}
                          sx={{
                            borderRadius: RADIUS.full,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 1.5,
                            minWidth: 90,
                            borderColor: isSelected ? COLORS.primary : 'divider',
                            bgcolor: isSelected ? COLORS.primary : 'transparent',
                            color: isSelected ? '#fff' : 'text.primary',
                            '&:hover': {
                              bgcolor: isSelected ? COLORS.primaryHover : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                              borderColor: isSelected ? COLORS.primaryHover : COLORS.primary,
                            }
                          }}
                        >
                          {cat.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            ))
          )}

          {modelCount === 0 && localImages.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'rgba(248, 113, 113, 0.1)', borderRadius: RADIUS.sm, border: '1px solid rgba(248, 113, 113, 0.2)' }}>
              <AlertCircle size={16} color="#f87171" />
              <Typography sx={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 500 }}>
                Please set at least one image as "Model" for best results in multi-jewelry mode.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: COLORS.gradientPrimary,
              color: '#fff',
              px: 4,
              borderRadius: RADIUS.sm,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: SHADOWS.buttonGlow,
              '&:hover': { background: COLORS.gradientDeep },
            }}
          >
            Apply Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
