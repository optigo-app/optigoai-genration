'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { COLORS } from '../theme/tokens';

const FILTERS = ['Trending', '4K', 'Video', 'All', 'Photography', 'Anime', 'Action', 'Architecture', 'Character', 'Food', 'Sci-Fi'];

// Placeholder community images using picsum with fixed seeds for consistency
const COMMUNITY_IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/leo1/400/500', span: 2 },
  { id: 2, url: 'https://picsum.photos/seed/leo2/400/400', span: 1 },
  { id: 3, url: 'https://picsum.photos/seed/leo3/400/600', span: 1 },
  { id: 4, url: 'https://picsum.photos/seed/leo4/400/400', span: 1 },
  { id: 5, url: 'https://picsum.photos/seed/leo5/400/500', span: 1 },
  { id: 6, url: 'https://picsum.photos/seed/leo6/400/400', span: 1 },
  { id: 7, url: 'https://picsum.photos/seed/leo7/400/600', span: 1 },
  { id: 8, url: 'https://picsum.photos/seed/leo8/400/400', span: 1 },
  { id: 9, url: 'https://picsum.photos/seed/leo9/400/500', span: 1 },
  { id: 10, url: 'https://picsum.photos/seed/leo10/400/400', span: 1 },
  { id: 11, url: 'https://picsum.photos/seed/leo11/400/600', span: 1 },
  { id: 12, url: 'https://picsum.photos/seed/leo12/400/400', span: 1 },
];

export default function CommunityCreations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ px: 3, py: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        Community Creations
      </Typography>

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            size="small"
            onClick={() => setActiveFilter(f)}
            sx={{
              cursor: 'pointer',
              bgcolor: activeFilter === f ? COLORS.primary : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: activeFilter === f ? '#000' : 'text.secondary',
              fontWeight: activeFilter === f ? 700 : 400,
              fontSize: '0.75rem',
              border: activeFilter === f ? 'none' : '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: activeFilter === f ? COLORS.primaryHover : isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)' },
            }}
          />
        ))}
      </Box>

      {/* Masonry-style grid */}
      <Box
        sx={{
          columns: { xs: 2, sm: 3, md: 4 },
          columnGap: '12px',
          '& > *': { breakInside: 'avoid', mb: '12px' },
        }}
      >
        {COMMUNITY_IMAGES.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            style={{ breakInside: 'avoid', marginBottom: 12, borderRadius: 8, overflow: 'hidden', cursor: 'pointer' }}
          >
            <Box
              component="img"
              src={img.url}
              alt=""
              sx={{ width: '100%', display: 'block', borderRadius: '8px' }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
