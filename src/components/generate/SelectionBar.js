'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FolderOpen, Trash2, X, CheckSquare, ChevronDown } from 'lucide-react';
import OrganizeDropdown from '@/components/generate/OrganizeDropdown';
import { COLORS } from '@/theme/tokens';
import { useConfirmation } from '@/hooks/useConfirmation';

const ACTIONS = [
  { id: 'download', label: 'Download All', icon: Download, color: COLORS.primary },
  { id: 'organize', label: 'Organize',     icon: FolderOpen, color: COLORS.cyan, hasDropdown: true },
  { id: 'delete',   label: 'Delete All',   icon: Trash2,    color: COLORS.red },
];

export default function SelectionBar({ selectedCount, onAction, onClear, selectedImages = [], collections = [], onToggleCollection, onCreateCollection, onViewAll }) {
  const [organizeOpen, setOrganizeOpen] = useState(false);
  const organizeRef = useRef(null);
  const { confirm, ConfirmationComponent } = useConfirmation();

  const handleActionClick = (actionId) => {
    if (actionId === 'organize') {
      setOrganizeOpen((v) => !v);
      return;
    }
    if (actionId === 'delete') {
      confirm('deleteSelectedImages', () => onAction?.(actionId));
      return;
    }
    onAction?.(actionId);
  };

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '14px',
                bgcolor: 'background.paper',
                border: `1px solid ${COLORS.primaryAlpha[35]}`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${COLORS.primaryAlpha[15]}`,
                backdropFilter: 'blur(16px)',
                whiteSpace: 'nowrap',
              }}
            >
              {/* Count */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pr: 1 }}>
                <CheckSquare size={15} color={COLORS.primary} strokeWidth={2} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'primary.main' }}>
                  {selectedCount} selected
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />

              {/* Action buttons */}
              {ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Box key={action.id} sx={{ position: 'relative' }} ref={action.id === 'organize' ? organizeRef : null}>
                    <Tooltip title={action.label} placement="bottom" arrow>
                      <Button
                        size="small"
                        startIcon={<Icon size={14} strokeWidth={2} />}
                        endIcon={action.hasDropdown ? <ChevronDown size={12} /> : null}
                        onClick={() => handleActionClick(action.id)}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: action.color,
                          px: 1.25,
                          py: 0.6,
                          borderRadius: '8px',
                          textTransform: 'none',
                          bgcolor: action.id === 'organize' && organizeOpen ? `${action.color}14` : 'transparent',
                          border: '1px solid',
                          borderColor: action.id === 'organize' && organizeOpen ? `${action.color}44` : 'transparent',
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: `${action.color}14`, borderColor: `${action.color}44` },
                        }}
                      >
                        {action.label}
                      </Button>
                    </Tooltip>

                    {/* Organize dropdown */}
                    {action.hasDropdown && (
                      <OrganizeDropdown
                        open={organizeOpen}
                        onClose={() => setOrganizeOpen(false)}
                        selectedImages={selectedImages}
                        anchorRef={organizeRef}
                        collections={collections}
                        onToggleCollection={onToggleCollection}
                        onCreateCollection={onCreateCollection}
                        onViewAll={onViewAll}
                      />
                    )}
                  </Box>
                );
              })}

              <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />

              {/* Clear */}
              <Tooltip title="Clear selection" placement="bottom" arrow>
                <IconButton
                  size="small"
                  onClick={onClear}
                  sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}
                >
                  <X size={15} strokeWidth={2} />
                </IconButton>
              </Tooltip>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmationComponent />
    </>
  );
}
