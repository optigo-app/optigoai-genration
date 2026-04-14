'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { COLORS, SHADOWS, RADIUS } from '@/theme/tokens';

export default function BlueprintCard({ title, imageUrl, isNew, index = 0 }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ flexShrink: 0 }}
    >
      <Box
        sx={{
          width: 200,
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          bgcolor: isDark ? '#1e1e1e' : '#f8f8fa',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: isDark
              ? SHADOWS.cardGlow
              : '0 8px 32px rgba(192,132,252,0.15)',
          },
        }}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box
            component="img"
            src={imageUrl || ''}
            alt={title}
            sx={{
              width: '100%',
              height: 200,
                objectFit: 'cover',
              display: 'block',
              bgcolor: isDark ? '#2a2a2a' : '#e8e8ec',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.06)' },
            }}
          />
          {/* Gradient overlay at bottom of image */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: isDark
                ? 'linear-gradient(to top, rgba(30,30,30,0.9), transparent)'
                : 'linear-gradient(to top, rgba(248,248,250,0.9), transparent)',
            }}
          />
        </Box>

        {/* NEW badge */}
        {isNew && (
          <Chip
            label="NEW"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              height: 18,
              fontSize: '0.55rem',
              fontWeight: 700,
              bgcolor: COLORS.primary,
              color: '#000',
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        )}

        {/* Title */}
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled', mt: 0.25 }}>
            Blueprint
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
