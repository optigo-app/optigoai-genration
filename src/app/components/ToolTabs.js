'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Image, Video, BookOpen, Workflow, ArrowUpCircle, PenTool, Pencil } from 'lucide-react';
import { TOOL_TABS } from '../data/toolTabs';
import { COLORS } from '../theme/tokens';

const TAB_ICONS = {
  image: Image,
  video: Video,
  blueprints: BookOpen,
  'flow-state': Workflow,
  upscaler: ArrowUpCircle,
  canvas: PenTool,
  draw: Pencil,
};

export default function ToolTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.75,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        justifyContent: 'flex-start',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        px: 0.25,
      }}
    >
      {TOOL_TABS.map((tab, index) => {
        const Icon = TAB_ICONS[tab.id];
        const isActive = activeTab === index;
        return (
          <Box
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(index)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              px: 1.4,
              py: 0.55,
              borderRadius: '8px',
              cursor: 'pointer',
              flexShrink: 0,
              bgcolor: isActive
                ? COLORS.primaryAlpha[18]
                : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
              border: '1px solid',
              borderColor: isActive
                ? COLORS.primaryAlpha[45]
                : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
              color: isActive
                ? COLORS.primary
                : isDark ? 'rgba(255,255,255,0.55)' : 'rgba(30,20,60,0.55)',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: COLORS.primaryAlpha[12],
                color: COLORS.primary,
                borderColor: COLORS.primaryAlpha[35],
              },
            }}
          >
            {Icon && <Icon size={13} strokeWidth={1.8} />}
            <Typography sx={{ fontSize: '0.76rem', fontWeight: isActive ? 600 : 400, lineHeight: 1, whiteSpace: 'nowrap' }}>
              {tab.label}
            </Typography>
            {tab.isNew && (
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
        );
      })}
    </Box>
  );
}
