'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Sun, Moon, Home, Image, Video, BookOpen,
  Library, ArrowUpCircle, PenTool, Pencil,
  Settings, MoreHorizontal,
} from 'lucide-react';
import { useColorMode } from './ThemeRegistry';
import { NAV_ITEMS } from '../data/navItems';
import { COLORS, RADIUS } from '../theme/tokens';

const MAIN_NAV = [
  { id: 'home',             label: 'Home',       icon: Home,     href: '/',                  matchPath: '/',         matchMode: null },
  { id: 'image-generation', label: 'Image',      icon: Image,    href: '/generate?mode=image', matchPath: '/generate', matchMode: 'image' },
  { id: 'video',            label: 'Video',      icon: Video,    href: '/generate?mode=video', matchPath: '/generate', matchMode: 'video' },
  { id: 'blueprints',       label: 'Blueprints', icon: BookOpen, href: '#',                  matchPath: null,        matchMode: null, isNew: true },
];

const LIBRARY_NAV = [
  { id: 'library',  label: 'Library',  icon: Library,       href: '/library', matchPath: '/library', matchMode: null },
  { id: 'upscaler', label: 'Upscaler', icon: ArrowUpCircle, href: '#',        matchPath: null,       matchMode: null },
  { id: 'canvas',   label: 'Canvas',   icon: PenTool,       href: '#',        matchPath: null,       matchMode: null },
  { id: 'draw',     label: 'Draw',     icon: Pencil,        href: '#',        matchPath: null,       matchMode: null },
];

function NavItem({ item, active = false }) {
  const Icon = item.icon;
  return (
    <Tooltip title={item.label} placement="right" arrow>
      <Box
        component="a"
        href={item.href || '#'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          py: 0.9,
          px: 0.5,
          borderRadius: '10px',
          cursor: 'pointer',
          textDecoration: 'none',
          color: active ? COLORS.primary : 'text.secondary',
          position: 'relative',
          bgcolor: active ? COLORS.primaryAlpha[12] : 'transparent',
          transition: 'all 0.15s',
          '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
        }}
      >
        {Icon && <Icon size={19} strokeWidth={active ? 2 : 1.6} />}
        <Typography sx={{ fontSize: '0.58rem', lineHeight: 1.2, textAlign: 'center', color: 'inherit', fontWeight: active ? 700 : 400 }}>
          {item.label}
        </Typography>
        {item.isNew && (
          <Chip label="NEW" size="small" sx={{ position: 'absolute', top: 3, right: 3, height: 13, fontSize: '0.48rem', fontWeight: 700, bgcolor: COLORS.primary, color: '#000', '& .MuiChip-label': { px: 0.5 } }} />
        )}
        {/* Active indicator dot */}
        {active && (
          <Box sx={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, borderRadius: '0 3px 3px 0', bgcolor: COLORS.primary }} />
        )}
      </Box>
    </Tooltip>
  );
}

function SectionLabel({ label }) {
  return (
    <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', color: 'text.disabled', textTransform: 'uppercase', textAlign: 'center', px: 0.5, py: 0.5 }}>
      {label}
    </Typography>
  );
}

export default function Sidebar({ navItems = NAV_ITEMS }) {
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
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        py: 1.5,
        px: 0.75,
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Box component="a" href="/" sx={{ width: 34, height: 34, borderRadius: RADIUS.md, bgcolor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: '#000', flexShrink: 0, textDecoration: 'none' }}>
          ✦
        </Box>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {MAIN_NAV.map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item)} />
        ))}
      </Box>

      <Box sx={{ width: '80%', height: '1px', bgcolor: 'divider', my: 1 }} />

      <SectionLabel label="Library" />
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.25 }}>
        {LIBRARY_NAV.map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item)} />
        ))}
      </Box>

      {/* More */}
      <Tooltip title="More" placement="right" arrow>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 0.9, px: 0.5, borderRadius: '10px', cursor: 'pointer', color: 'text.secondary', mt: 0.25, width: '100%', '&:hover': { color: 'text.primary', bgcolor: 'action.hover' } }}>
          <MoreHorizontal size={19} strokeWidth={1.6} />
          <Typography sx={{ fontSize: '0.58rem', color: 'inherit' }}>More</Typography>
        </Box>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      {/* Theme toggle */}
      <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right" arrow>
        <IconButton onClick={toggleColorMode} size="small" sx={{ color: 'text.secondary', mb: 0.5, '&:hover': { color: 'text.primary' } }}>
          {mode === 'dark' ? <Sun size={18} strokeWidth={1.6} /> : <Moon size={18} strokeWidth={1.6} />}
        </IconButton>
      </Tooltip>

      <NavItem item={{ id: 'settings', label: 'Settings', icon: Settings, href: '#' }} />

      <Button variant="outlined" size="small" fullWidth sx={{ mt: 0.75, mb: 1, fontSize: '0.6rem', fontWeight: 700, borderColor: COLORS.primary, color: COLORS.primary, borderRadius: RADIUS.sm, py: 0.5, minWidth: 0, '&:hover': { bgcolor: COLORS.primaryAlpha[10], borderColor: COLORS.primary } }}>
        Upgrade
      </Button>

      <Avatar sx={{ width: 30, height: 30, bgcolor: COLORS.primary, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700, color: '#000' }}>U</Avatar>
    </Box>
  );
}
