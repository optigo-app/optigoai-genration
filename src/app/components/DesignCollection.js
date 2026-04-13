'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COLORS, RADIUS } from '../theme/tokens';

// Sample design collection items — link to generate page with pre-filled mode
const DESIGN_ITEMS = [
  { id: 1, title: 'Cinematic Portrait',    imageUrl: 'https://picsum.photos/seed/dc1/400/500', mode: 'image', tag: 'Portrait' },
  { id: 2, title: 'Fantasy Landscape',     imageUrl: 'https://picsum.photos/seed/dc2/400/500', mode: 'image', tag: 'Landscape' },
  { id: 3, title: 'Anime Character',       imageUrl: 'https://picsum.photos/seed/dc3/400/500', mode: 'image', tag: 'Anime' },
  { id: 4, title: 'Cinematic Video',       imageUrl: 'https://picsum.photos/seed/dc4/400/300', mode: 'video', tag: 'Video' },
  { id: 5, title: 'Logo Design',           imageUrl: 'https://picsum.photos/seed/dc5/400/400', mode: 'image', tag: 'Logo' },
  { id: 6, title: 'Abstract Art',          imageUrl: 'https://picsum.photos/seed/dc6/400/500', mode: 'image', tag: 'Abstract' },
  { id: 7, title: 'Product Photography',   imageUrl: 'https://picsum.photos/seed/dc7/400/400', mode: 'image', tag: 'Product' },
  { id: 8, title: 'Motion Reel',           imageUrl: 'https://picsum.photos/seed/dc8/400/300', mode: 'video', tag: 'Motion' },
];

function DesignCard({ item, index }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ flexShrink: 0 }}
    >
      <Link href={`/generate?mode=${item.mode}`} style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            width: 160,
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
            bgcolor: isDark ? '#1c1c1c' : '#f5f5f7',
            cursor: 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': {
              borderColor: 'rgba(192,132,252,0.5)',
              boxShadow: '0 8px 28px rgba(192,132,252,0.18)',
            },
          }}
        >
          {/* Image */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box
              component="img"
              src={item.imageUrl}
              alt={item.title}
              sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', transition: 'transform 0.35s', '&:hover': { transform: 'scale(1.06)' } }}
            />
            {/* Mode badge */}
            {item.mode === 'video' && (
              <Box sx={{ position: 'absolute', top: 7, right: 7, px: 0.75, py: 0.2, borderRadius: '5px', bgcolor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
                <Typography sx={{ fontSize: '0.55rem', color: COLORS.cyan, fontWeight: 700 }}>VIDEO</Typography>
              </Box>
            )}
            {/* Gradient overlay */}
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: isDark ? 'linear-gradient(to top, rgba(28,28,28,0.9), transparent)' : 'linear-gradient(to top, rgba(245,245,247,0.9), transparent)' }} />
          </Box>

          {/* Footer */}
          <Box sx={{ px: 1.25, py: 1 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.title}
            </Typography>
            <Chip label={item.tag} size="small" sx={{ mt: 0.5, height: 16, fontSize: '0.55rem', fontWeight: 600, bgcolor: COLORS.primaryAlpha[10], color: COLORS.primary, border: `1px solid ${COLORS.primaryAlpha[20]}`, '& .MuiChip-label': { px: 0.6 } }} />
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

export default function DesignCollection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={15} color={COLORS.primary} strokeWidth={1.8} />
          <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
            Design Collection
          </Typography>
          <Chip label="From your library" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: COLORS.primaryAlpha[10], color: COLORS.primary, border: `1px solid ${COLORS.primaryAlpha[20]}`, '& .MuiChip-label': { px: 0.75 } }} />
        </Box>
        <Link href="/library" style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.primary, fontSize: '0.78rem', textDecoration: 'none', opacity: 0.9 }}>
          View Library <ArrowRight size={13} />
        </Link>
      </Box>

      {/* Horizontal scroll */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1.5,
          pb: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: isDark ? 'rgba(255,255,255,0.08) transparent' : 'rgba(0,0,0,0.08) transparent',
          '&::-webkit-scrollbar': { height: 3 },
          '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 2 },
        }}
      >
        {DESIGN_ITEMS.map((item, i) => (
          <DesignCard key={item.id} item={item} index={i} />
        ))}
      </Box>
    </Box>
  );
}
