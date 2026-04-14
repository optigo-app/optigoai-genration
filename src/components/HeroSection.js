'use client';

import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import PromptBar from '@/components/PromptBar';
import ToolTabs from '@/components/ToolTabs';
import { COLORS } from '@/theme/tokens';

function AnimatedHeadline({ isDark }) {
  const words = ['YOURS', 'TO', 'CREATE'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ textAlign: 'center', marginBottom: 28 }}
    >
      {/* Word-by-word stagger */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: '0.3em', md: '0.4em' }, flexWrap: 'wrap', mb: 0.5 }}>
        {words.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.23, 1, 0.32, 1] }}
            style={{
              display: 'inline-block',
              fontWeight: 900,
              letterSpacing: '0.1em',
              fontSize: 'clamp(2rem, 6vw, 4.2rem)',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: i === 2
                ? COLORS.primary
                : isDark ? '#ffffff' : '#1a1a2e',
              position: 'relative',
            }}
          >
            {word}
            {/* Shimmer sweep on each word */}
            <motion.span
              initial={{ x: '-110%' }}
              animate={{ x: '110%' }}
              transition={{ duration: 1.2, delay: 0.6 + i * 0.14, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: isDark
                  ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                WebkitBackgroundClip: 'text',
                pointerEvents: 'none',
              }}
            />
          </motion.span>
        ))}
      </Box>

      {/* Subtitle — fade up */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        style={{
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(30,20,60,0.55)',
          fontSize: '1rem',
          fontWeight: 400,
          marginTop: 8,
          letterSpacing: '0.03em',
        }}
      >
        Transform your imagination into stunning visuals with AI
      </motion.p>
    </motion.div>
  );
}

export default function HeroSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const bgImage = 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80")';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '54vh',
        backgroundImage: bgImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        pt: 7,
        pb: 5,
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'linear-gradient(to bottom, rgba(10,6,20,0.58) 0%, rgba(10,6,20,0.8) 55%, rgba(15,15,15,0.94) 100%)'
            : '#f4f4f6',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 0,
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      }}
    >
      <AnimatedHeadline isDark={isDark} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 840 }}
      >
        <PromptBar redirectToGenerate />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 780, marginTop: 14 }}
      >
        <ToolTabs />
      </motion.div>
    </Box>
  );
}
