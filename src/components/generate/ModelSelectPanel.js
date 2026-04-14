'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { COLORS, RADIUS } from '@/theme/tokens';
import aiGenerators from '@/data/aiGenerators.json';

const MODEL_COLORS = [COLORS.primary, COLORS.cyan, COLORS.pink, '#a78bfa', '#34d399'];

export const IMAGE_MODELS = aiGenerators
  .filter((generator) => generator.category === 'ai-generation' && generator.enabled)
  .map((generator, index) => ({
    id: generator.id,
    name: generator.label,
    tag: index === 0 ? 'Recommended' : 'AI',
    color: MODEL_COLORS[index % MODEL_COLORS.length],
    image: `https://picsum.photos/seed/model-${generator.id}/120/80`,
    desc: `Prompt-based image generation via ${generator.label}.`,
  }));

export const VIDEO_MODELS = [
  {
    id: 'motion-xl',
    name: 'Motion XL',
    tag: 'Recommended',
    color: COLORS.cyan,
    image: 'https://picsum.photos/seed/model-motionxl/120/80',
    desc: 'Smooth, high-quality video generation. Best for cinematic and realistic motion.',
  },
  {
    id: 'animate',
    name: 'AnimateDiff',
    tag: 'Smooth',
    color: COLORS.primary,
    image: 'https://picsum.photos/seed/model-animate/120/80',
    desc: 'Specialises in fluid animations and character motion with consistent style.',
  },
  {
    id: 'svd',
    name: 'Stable Video Diffusion',
    tag: 'Classic',
    color: COLORS.pink,
    image: 'https://picsum.photos/seed/model-svd/120/80',
    desc: 'Reliable video model for short clips. Great for product and lifestyle content.',
  },
  {
    id: 'kling',
    name: 'Kling v1.5',
    tag: 'Cinematic',
    color: '#fbbf24',
    image: 'https://picsum.photos/seed/model-kling/120/80',
    desc: 'Cinematic-grade video with dramatic lighting and film-like colour grading.',
  },
];

export default function ModelSelectPanel({ open, onClose, models, value, onChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          style={{ overflow: 'hidden', flexShrink: 0, height: '100%' }}
        >
          <Box
            sx={{
              width: 300,
              height: '100%',
              borderLeft: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{ px: 2, pt: 2, pb: 1.25, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.primary' }}>
                Select Model
              </Typography>
              <IconButton size="small" onClick={onClose} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                <X size={15} strokeWidth={2} />
              </IconButton>
            </Box>

            {/* Model list */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {models.map((model, i) => {
                const isSelected = value === model.id;
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.05 }}
                  >
                    <Box
                      onClick={() => { onChange(model.id); onClose(); }}
                      sx={{
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: isSelected ? model.color : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        bgcolor: isSelected ? `${model.color}0f` : 'transparent',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'all 0.18s',
                        '&:hover': {
                          borderColor: model.color,
                          bgcolor: `${model.color}0a`,
                          boxShadow: `0 4px 16px ${model.color}22`,
                        },
                      }}
                    >
                      {/* Preview image */}
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={model.image}
                          alt={model.name}
                          sx={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }}
                        />
                        {/* Selected checkmark */}
                        {isSelected && (
                          <Box sx={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', bgcolor: model.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={13} strokeWidth={3} color="#000" />
                          </Box>
                        )}
                        {/* Tag badge */}
                        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                          <Chip
                            label={model.tag}
                            size="small"
                            sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: `${model.color}cc`, color: '#000', '& .MuiChip-label': { px: 0.75 } }}
                          />
                        </Box>
                      </Box>

                      {/* Info */}
                      <Box sx={{ px: 1.5, py: 1.25 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
                          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: model.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? model.color : 'text.primary' }}>
                            {model.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', lineHeight: 1.5 }}>
                          {model.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
