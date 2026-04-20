'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { COLORS } from '@/theme/tokens';
import { fetchAndNormalizeHistory } from '@/utils/historyServices';
import { CommunityMasonrySkeleton } from '@/components/common/SkeletonLoaders';
import { useEffect } from 'react';
import { Play } from 'lucide-react';

const FILTERS = ['All', 'Trending', 'Sketch', 'Image', 'Video', 'CAD'];

// Fallback community images if API returns no data
const FALLBACK_IMAGES = [
  { id: 1, url: 'https://picsum.photos/seed/leo1/400/500', span: 2 },
  { id: 2, url: 'https://picsum.photos/seed/leo2/400/400', span: 1 },
  { id: 3, url: 'https://picsum.photos/seed/leo3/400/600', span: 1 },
  { id: 4, url: 'https://picsum.photos/seed/leo4/400/400', span: 1 },
  { id: 5, url: 'https://picsum.photos/seed/leo5/400/500', span: 1 },
  { id: 6, url: 'https://picsum.photos/seed/leo6/400/400', span: 1 },
];

function isVideoSource(src = '') {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

function CommunityCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = isVideoSource(item.url);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      style={{ breakInside: 'avoid', marginBottom: 12, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
      onHoverStart={handleMouseEnter}
      onHoverEnd={handleMouseLeave}
    >
      {isVideo ? (
        <>
          <Box
            component="video"
            ref={videoRef}
            src={item.url}
            muted
            loop
            playsInline
            controls={false}
            preload="auto"
            sx={{ width: '100%', display: 'block', borderRadius: '8px', objectFit: 'cover', aspectRatio: '1/1' }}
          />
          {/* Play icon overlay */}
          {!hovered && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.2)',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play size={20} strokeWidth={2.5} fill="#000" color="#000" style={{ marginLeft: 2 }} />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Box
          component="img"
          src={item.url}
          alt={item.prompt || ""}
          sx={{ width: '100%', display: 'block', borderRadius: '8px' }}
        />
      )}
    </motion.div>
  );
}

export default function CommunityCreations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    const loadCreations = async () => {
      setIsLoading(true);
      const data = await fetchAndNormalizeHistory();
      // Mix live data with fallbacks or just use live data
      setCreations(data.length > 0 ? data : FALLBACK_IMAGES);
      setIsLoading(false);
    };
    loadCreations();
  }, []);

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
      {isLoading ? (
        <CommunityMasonrySkeleton />
      ) : (
        <Box
          sx={{
            columns: { xs: 2, sm: 3, md: 4 },
            columnGap: '12px',
            '& > *': { breakInside: 'avoid', mb: '12px' },
          }}
        >
          {creations.map((img, i) => (
            <CommunityCard key={img.id} item={img} index={i} />
          ))}
        </Box>
      )}
    </Box>
  );
}
