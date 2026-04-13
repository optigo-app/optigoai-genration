'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { Image, Video, Workflow, Sparkles } from 'lucide-react';
import { COLORS, RADIUS } from '../../theme/tokens';

const MODES = [
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'flow-state', label: 'Flow State', icon: Workflow },
  { id: 'motion', label: 'Motion', icon: Sparkles, isNew: true },
];

export default function ModeToggle({ value, onChange }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        gap: 0.5,
        width: 'fit-content',
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        p: 0.4,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.id;
        return (
          <Box
            key={mode.id}
            onClick={() => onChange(mode.id)}
            sx={{ position: 'relative', cursor: 'pointer' }}
          >
            {isActive && (
              <motion.div
                layoutId="modeIndicator"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  background: COLORS.primaryAlpha[18],
                  border: `1px solid ${COLORS.primaryAlpha[40]}`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.6,
                px: 1.25,
                py: 0.6,
                borderRadius: '8px',
                color: isActive ? COLORS.primary : 'text.secondary',
                position: 'relative',
                zIndex: 1,
                transition: 'color 0.15s',
                '&:hover': { color: isActive ? COLORS.primary : 'text.primary' },
              }}
            >
              <Icon size={13} strokeWidth={1.8} />
              <Typography sx={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 400, lineHeight: 1 }}>
                {mode.label}
              </Typography>
              {mode.isNew && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    height: 14,
                    fontSize: '0.48rem',
                    fontWeight: 700,
                    bgcolor: COLORS.primary,
                    color: '#000',
                    '& .MuiChip-label': { px: 0.5 },
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
