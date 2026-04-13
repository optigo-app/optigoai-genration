'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BLUEPRINTS } from '../data/blueprints';
import BlueprintCard from './BlueprintCard';
import { COLORS } from '../theme/tokens';

export default function FeaturedBlueprints() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        px: 3,
        pt: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: '0.95rem',
                letterSpacing: '0.01em',
              }}
            >
              Featured Blueprints
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: '6px',
                bgcolor: isDark ? COLORS.primaryAlpha[12] : COLORS.primaryAlpha[15],
                border: `1px solid ${COLORS.primaryAlpha[30]}`,
              }}
            >
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.primary, fontWeight: 600 }}>
                {BLUEPRINTS.length} templates
              </Typography>
            </Box>
          </Box>
          <Link
            href="#"
            style={{
              color: COLORS.primary,
              fontSize: '0.78rem',
              textDecoration: 'none',
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            View More →
          </Link>
        </Box>
      </motion.div>

      {/* Horizontal scroll row */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1.75,
          pb: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: isDark
            ? 'rgba(255,255,255,0.1) transparent'
            : 'rgba(0,0,0,0.1) transparent',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        {BLUEPRINTS.map((blueprint, i) => (
          <BlueprintCard
            key={blueprint.id}
            title={blueprint.title}
            imageUrl={blueprint.imageUrl}
            isNew={blueprint.isNew}
            index={i}
          />
        ))}
      </Box>
    </Box>
  );
}
