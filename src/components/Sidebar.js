'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sun, Moon, MoreHorizontal,
} from 'lucide-react';
import { useColorMode } from '@/components/ThemeRegistry';
import { SIDEBAR_MAIN_NAV, SIDEBAR_LIBRARY_NAV } from '@/data/tools';
import { COLORS, RADIUS, SHADOWS } from '@/theme/tokens';

function NavItem({ item, active = false }) {
  const Icon = item.icon;
  const href = item.href || '#';
  const isHash = href === '#';
  const activeBg = 'rgba(115, 103, 240, 0.15)';
  const labelColor = isHash ? 'text.disabled' : 'text.secondary';

  return (
    <Tooltip title={item.label} placement="right" arrow>
      <motion.div
        whileHover={isHash ? {} : { scale: 1.04 }}
        whileTap={isHash ? {} : { scale: 0.96 }}
        style={{ width: '100%' }}
      >
        <Box
          className="nav-item-link"
          component={isHash ? 'div' : Link}
          href={isHash ? undefined : href}
          scroll={isHash ? undefined : false}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.65,
            py: 1.05,
            px: 0.65,
            borderRadius: '14px',
            cursor: isHash ? 'default' : 'pointer',
            textDecoration: 'none',
            position: 'relative',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': isHash ? {} : {
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: active ? COLORS.primary : labelColor,
              bgcolor: active ? activeBg : 'transparent',
              boxShadow: active ? SHADOWS.gradientActive : 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '.nav-item-link:hover &': isHash ? {} : {
                color: COLORS.primary,
                bgcolor: activeBg,
                boxShadow: SHADOWS.gradientHover,
              },
            }}
          >
            {Icon && <Icon size={23} strokeWidth={active ? 2.3 : 1.9} />}
          </Box>
          <Typography sx={{
            fontSize: '0.68rem',
            lineHeight: 1.15,
            textAlign: 'center',
            color: labelColor,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            {item.label}
          </Typography>
          {item.isNew && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                height: 15,
                fontSize: '0.52rem',
                fontWeight: 700,
                bgcolor: COLORS.primary,
                color: '#000',
                '& .MuiChip-label': { px: 0.55 },
              }}
            />
          )}
        </Box>
      </motion.div>
    </Tooltip>
  );
}

function SectionLabel({ label }) {
  return (
    <Typography sx={{
      fontSize: '0.6rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: 'text.disabled',
      textTransform: 'uppercase',
      textAlign: 'center',
      px: 0.5,
      py: 0.6,
    }}>
      {label}
    </Typography>
  );
} 

export default function Sidebar() {
  const { mode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get('mode') || 'image';

  const isActive = (item) => {
    if (!item.matchPath) return false;
    if (item.matchPath === '/') return pathname === '/';
    if (!pathname.startsWith(item.matchPath)) return false;
    // For generate page, differentiate by mode param
    if (item.matchMode !== null) return currentMode === item.matchMode;
    return true;
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 12, left: 12,
        width: 68,
        height: 'calc(100vh - 24px)',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 200,
        borderRadius: RADIUS.lg,
        border: '1px solid',
        borderColor: 'divider',
        py: 1.5,
        px: 0.75,
        boxShadow: SHADOWS.sidebar,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Box
          component={Link}
          href="/"
          scroll={false}
          sx={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(115, 103, 240, 0.4)',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 6px 20px rgba(115, 103, 240, 0.5)' },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box
            component="img"
            src="/icons/base-icon1.svg"
            alt="Optigo AI"
            sx={{
              width: 36,
              height: 36,
              borderRadius: RADIUS.md,
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.4 }}>
        {SIDEBAR_MAIN_NAV.map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item)} />
        ))}
      </Box>

      <Box sx={{ width: '80%', height: '1px', bgcolor: 'divider', my: 1 }} />

      <SectionLabel label="Library" />
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.25 }}>
        {SIDEBAR_LIBRARY_NAV.map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item)} />
        ))}
      </Box>

      {/* More */}
      <Tooltip title="More" placement="right" arrow>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.65, py: 1.05, px: 0.65, borderRadius: '14px', cursor: 'pointer', color: 'text.secondary', mt: 0.25, width: '100%', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { color: COLORS.primary, bgcolor: 'rgba(115, 103, 240, 0.15)', transform: 'translateY(-2px)' } }}>
            <MoreHorizontal size={23} strokeWidth={1.9} />
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 500, color: 'inherit' }}>More</Typography>
          </Box>
        </motion.div>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      {/* Theme toggle */}
      <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right" arrow>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{
              mb: 0.7,
              width: 40,
              height: 40,
              borderRadius: '12px',
              color: mode === 'dark' ? '#ffd166' : COLORS.primary,
              bgcolor: mode === 'dark' ? 'rgba(255, 209, 102, 0.14)' : 'rgba(115, 103, 240, 0.14)',
              boxShadow: mode === 'dark' ? '0 8px 20px rgba(255, 209, 102, 0.25)' : '0 8px 20px rgba(115, 103, 240, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                color: mode === 'dark' ? '#ffe08a' : COLORS.primaryHover,
                bgcolor: mode === 'dark' ? 'rgba(255, 209, 102, 0.22)' : 'rgba(115, 103, 240, 0.22)',
                boxShadow: mode === 'dark' ? '0 10px 24px rgba(255, 209, 102, 0.35)' : '0 10px 24px rgba(115, 103, 240, 0.35)',
              },
            }}
          >
            {mode === 'dark' ? <Sun size={20} strokeWidth={1.9} /> : <Moon size={20} strokeWidth={1.9} />}
          </IconButton>
        </motion.div>
      </Tooltip>

      {/* <NavItem item={{ id: 'settings', label: 'Settings', icon: Settings, href: '#' }} /> */}
      {/* 
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: '100%' }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mt: 0.75,
            mb: 1,
            fontSize: '0.65rem',
            fontWeight: 700,
            border: 'none',
            color: '#fff',
            background: COLORS.gradientPrimary,
            borderRadius: RADIUS.sm,
            py: 0.7,
            minWidth: 0,
            letterSpacing: '0.03em',
            boxShadow: '0 4px 14px rgba(115, 103, 240, 0.35)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: COLORS.gradientDeep,
              boxShadow: '0 6px 20px rgba(115, 103, 240, 0.45)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Upgrade
        </Button>
      </motion.div>

      <Avatar sx={{ width: 32, height: 32, background: COLORS.gradientPrimary, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, color: '#fff', boxShadow: '0 4px 12px rgba(115, 103, 240, 0.35)' }}>U</Avatar> */}
    </Box>
  );
}
