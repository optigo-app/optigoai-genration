'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import GeneratedImageCard, { GeneratingCard } from './GeneratedImageCard';
import { COLORS } from '@/theme/tokens';

export default function GeneratedImageGroup({ date, prompt, images, tags = [], isGenerating = false, count = 1, dimension = '1:1', onAction, selectedImages = [], onSelect }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const aspectRatio = dimension === '16:9' ? '16/9' : dimension === '9:16' ? '9/16' : '1/1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Date header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'text.disabled' }}>
            <Calendar size={12} strokeWidth={1.8} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', color: 'text.disabled' }}>
              {date}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>

        {/* Prompt text */}
        <Box
          sx={{
            mb: 2,
            px: 1.5,
            py: 1,
            borderRadius: '8px',
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 3,
              height: '100%',
              minHeight: 20,
              borderRadius: 4,
              bgcolor: COLORS.primary,
              flexShrink: 0,
              mt: 0.25,
            }}
          />
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: 'text.secondary',
              lineHeight: 1.65,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt}
          </Typography>
        </Box>

        {/* Images grid — always 4 columns */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1.25,
            mb: 1.5,
          }}
        >
          {isGenerating
            ? Array.from({ length: count }).map((_, i) => (
                <GeneratingCard key={i} index={i} aspectRatio={aspectRatio} />
              ))
            : images.map((img, i) => (
                <GeneratedImageCard key={i} src={img} alt={prompt} index={i} onAction={onAction} selected={selectedImages.includes(img)} onSelect={onSelect} />
              ))}
        </Box>

        {/* Tags */}
        {!isGenerating && tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 500,
                  bgcolor: isDark ? COLORS.primaryAlpha[10].replace('0.10','0.08') : COLORS.primaryAlpha[10],
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primaryAlpha[20]}`,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
