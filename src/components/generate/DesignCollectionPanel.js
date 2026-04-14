'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ImagePlus, Sparkles } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '@/theme/tokens';

const COLLECTION_IMAGES = [
  { id: 1, src: 'https://picsum.photos/seed/dc1/400/500', title: 'Cinematic Portrait',  tag: 'Portrait' },
  { id: 2, src: 'https://picsum.photos/seed/dc2/400/500', title: 'Fantasy Landscape',   tag: 'Landscape' },
  { id: 3, src: 'https://picsum.photos/seed/dc3/400/500', title: 'Anime Character',     tag: 'Anime' },
  { id: 4, src: 'https://picsum.photos/seed/dc4/400/300', title: 'Cinematic Video',     tag: 'Video' },
  { id: 5, src: 'https://picsum.photos/seed/dc5/400/400', title: 'Logo Design',         tag: 'Logo' },
  { id: 6, src: 'https://picsum.photos/seed/dc6/400/500', title: 'Abstract Art',        tag: 'Abstract' },
  { id: 7, src: 'https://picsum.photos/seed/dc7/400/400', title: 'Product Photography', tag: 'Product' },
  { id: 8, src: 'https://picsum.photos/seed/dc8/400/300', title: 'Motion Reel',         tag: 'Motion' },
  { id: 9, src: 'https://picsum.photos/seed/dc9/400/500', title: 'Neon Cityscape',      tag: 'Urban' },
  { id: 10, src: 'https://picsum.photos/seed/dc10/400/400', title: 'Sci-Fi Character',  tag: 'Sci-Fi' },
  { id: 11, src: 'https://picsum.photos/seed/dc11/400/500', title: 'Vintage Portrait',  tag: 'Vintage' },
  { id: 12, src: 'https://picsum.photos/seed/dc12/400/300', title: 'Watercolor Scene',  tag: 'Art' },
];

export default function DesignCollectionPanel({ open, onClose, onUseImage }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [search, setSearch] = useState('');

  const filtered = COLLECTION_IMAGES.filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase()) ||
    img.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          style={{ overflow: 'hidden', flexShrink: 0, height: '100%' }}
        >
          <Box
            sx={{
              width: 280,
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Sparkles size={14} color={COLORS.primary} strokeWidth={1.8} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.primary' }}>
                  Design Collection
                </Typography>
              </Box>
              <IconButton size="small" onClick={onClose} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                <X size={15} strokeWidth={2} />
              </IconButton>
            </Box>

            {/* Search */}
            <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.6, borderRadius: '8px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: '1px solid', borderColor: 'divider' }}>
                <Search size={13} strokeWidth={1.8} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
                <InputBase
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search collection..."
                  fullWidth
                  sx={{ fontSize: '0.78rem', color: 'text.primary', '& input::placeholder': { color: 'text.disabled', opacity: 1 } }}
                />
                {search && (
                  <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'text.disabled', p: 0 }}>
                    <X size={11} />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* Count */}
            <Box sx={{ px: 2, py: 0.75 }}>
              <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>
                {filtered.length} image{filtered.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {/* Image grid */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: 1.5,
                pb: 2,
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? 'rgba(255,255,255,0.08) transparent' : 'rgba(0,0,0,0.08) transparent',
                '&::-webkit-scrollbar': { width: 3 },
                '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 2 },
              }}
            >
              {filtered.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 1.5, color: 'text.disabled' }}>
                  <Search size={28} strokeWidth={1} />
                  <Typography sx={{ fontSize: '0.75rem' }}>No results found</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <AnimatePresence>
                    {filtered.map((img, i) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        style={{ position: 'relative' }}
                      >
                        <Box
                          sx={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'border-color 0.15s, box-shadow 0.15s',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: `0 4px 16px ${COLORS.primaryAlpha[20]}`,
                            },
                            '&:hover .use-btn': { opacity: 1 },
                            '&:hover img': { transform: 'scale(1.06)' },
                          }}
                        >
                          <Box
                            component="img"
                            src={img.src}
                            alt={img.title}
                            sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                          />

                          {/* Hover overlay */}
                          <Box
                            className="use-btn"
                            onClick={() => onUseImage?.(img)}
                            sx={{
                              position: 'absolute', inset: 0,
                              bgcolor: 'rgba(0,0,0,0.55)',
                              display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center',
                              gap: 0.5, opacity: 0,
                              transition: 'opacity 0.2s',
                              borderRadius: '8px',
                            }}
                          >
                            <ImagePlus size={18} color={COLORS.primary} strokeWidth={1.8} />
                            <Typography sx={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600 }}>Use as ref</Typography>
                          </Box>
                        </Box>

                        {/* Tag */}
                        <Chip
                          label={img.tag}
                          size="small"
                          sx={{ mt: 0.4, height: 14, fontSize: '0.52rem', fontWeight: 600, bgcolor: 'rgba(192,132,252,0.08)', color: COLORS.primary, border: `1px solid ${COLORS.primaryAlpha[15]}`, '& .MuiChip-label': { px: 0.5 } }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              )}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
