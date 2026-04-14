'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { TOOL_TABS } from '@/data/tools';
import { COLORS } from '@/theme/tokens';

export default function ToolTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.4,
        flexWrap: 'wrap',
        overflowX: 'auto',
        justifyContent: 'center',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        px: 0.75,
        py: 0.5,
      }}
    >
      {TOOL_TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === index;
        return (
          <motion.div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(index)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                px: 0.55,
                py: 0.45,
                borderRadius: '14px',
                color: isActive ? COLORS.primary : isDark ? 'rgba(255,255,255,0.75)' : 'rgba(30,20,60,0.75)',
              }}
            >
              <Box
                className="tool-tab-icon"
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  bgcolor: isActive
                    ? COLORS.primaryAlpha[20]
                    : isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.05)',
                  border: '1.5px solid',
                  borderColor: isActive
                    ? COLORS.primaryAlpha[50]
                    : isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)',
                  boxShadow: isActive ? `0 10px 24px ${COLORS.primaryAlpha[30]}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: COLORS.primaryAlpha[40],
                    bgcolor: COLORS.primaryAlpha[14],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {Icon && <Icon size={18} strokeWidth={1.8} />}
                {tab.isNew && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -6,
                      height: 15,
                      fontSize: '0.5rem',
                      fontWeight: 700,
                      bgcolor: COLORS.primary,
                      color: '#000',
                      '& .MuiChip-label': { px: 0.6 },
                    }}
                  />
                )}
              </Box>

              <Typography sx={{ fontSize: '0.76rem', fontWeight: isActive ? 600 : 500, lineHeight: 1, whiteSpace: 'nowrap' }}>
                {tab.label}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
