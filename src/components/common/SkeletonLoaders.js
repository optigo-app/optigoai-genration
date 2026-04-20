'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { SHADOWS, COLORS } from '@/theme/tokens';

/**
 * Standard Skeleton settings for a premium feel
 */
const getSkeletonProps = (isDark) => ({
  animation: "wave",
  sx: {
    bgcolor: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.05)',
  }
});

/**
 * Skeleton for the Home Page Community Creations (Masonry)
 * Improved with more varied heights for a true masonry preview
 */
export const CommunityMasonrySkeleton = ({ count = 8 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const skeletonProps = getSkeletonProps(isDark);

  return (
    <Box
      sx={{
        columns: { xs: 2, sm: 3, md: 4 },
        columnGap: '12px',
        '& > *': { breakInside: 'avoid', mb: '12px' },
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          {...skeletonProps}
          sx={{
            ...skeletonProps.sx,
            width: '100%',
            height: [220, 160, 280, 200, 320, 180, 240, 260][i % 8],
            borderRadius: '8px',
          }}
        />
      ))}
    </Box>
  );
};

/**
 * Skeleton for the Library Page grid items
 * Added a small badge placeholder to mimic the type labels
 */
export const LibraryCardSkeleton = ({ count = 12 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const skeletonProps = getSkeletonProps(isDark);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ position: 'relative' }}>
          <Skeleton
            variant="rectangular"
            {...skeletonProps}
            sx={{
              ...skeletonProps.sx,
              width: '100%',
              aspectRatio: '1/1',
              height: 180, // Explicit height for better cross-browser visibility
              borderRadius: '10px',
            }}
          />
          {/* Badge Placeholder */}
          <Skeleton
            variant="rectangular"
            {...skeletonProps}
            sx={{
              ...skeletonProps.sx,
              position: 'absolute',
              top: 8,
              right: 8,
              width: 35,
              height: 14,
              borderRadius: '4px',
              bgcolor: 'rgba(255, 255, 255, 0.03)'
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

/**
 * Skeleton for the Generate Page historical groups
 * High-fidelity version that mirrors the exact layout of GeneratedImageGroup.js
 */
export const GenerationGroupSkeleton = ({ count = 2 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const skeletonProps = getSkeletonProps(isDark);

  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ mb: 4 }}>
          {/* Header Area (Calendar icon + Date) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Skeleton variant="circular" width={12} height={12} {...skeletonProps} />
            <Skeleton variant="text" width={140} height={18} {...skeletonProps} />
          </Box>

          {/* Main Card Container */}
          <Box sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: SHADOWS.sidebar,
            p: 2,
            display: 'flex',
            gap: 2,
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'
          }}>

            {/* Grid Area (70% - Images) */}
            <Box sx={{ flex: 7 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton
                    key={j}
                    variant="rectangular"
                    {...skeletonProps}
                    sx={{
                      ...skeletonProps.sx,
                      width: '100%',
                      aspectRatio: '1/1',
                      height: 550, // Explicit height for better cross-browser visibility
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Panel Area (30% - Metadata & Actions) */}
            <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Prompt Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Skeleton variant="text" width="30%" height={12} {...skeletonProps} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="100%" height={15} {...skeletonProps} />
                <Skeleton variant="text" width="100%" height={15} {...skeletonProps} />
                <Skeleton variant="text" width="60%" height={15} {...skeletonProps} />
              </Box>

              {/* Reference Images Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Skeleton variant="text" width="60%" height={12} {...skeletonProps} sx={{ mb: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {Array.from({ length: 4 }).map((_, r) => (
                    <Skeleton key={r} variant="rectangular" width={52} height={52} {...skeletonProps} sx={{ ...skeletonProps.sx, borderRadius: '6px' }} />
                  ))}
                </Box>
              </Box>

              {/* Actions Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Skeleton variant="text" width="30%" height={12} {...skeletonProps} sx={{ mb: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="circular" width={32} height={32} {...skeletonProps} />
                  <Skeleton variant="circular" width={32} height={32} {...skeletonProps} />
                  <Skeleton variant="circular" width={32} height={32} {...skeletonProps} />
                </Box>
              </Box>

              {/* Tags Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Skeleton variant="text" width="20%" height={12} {...skeletonProps} sx={{ mb: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Skeleton variant="rectangular" width={45} height={18} {...skeletonProps} sx={{ ...skeletonProps.sx, borderRadius: '10px' }} />
                  <Skeleton variant="rectangular" width={60} height={18} {...skeletonProps} sx={{ ...skeletonProps.sx, borderRadius: '10px' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
