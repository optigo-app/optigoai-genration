'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Plus, ExternalLink, X, Folder } from 'lucide-react';
import { COLORS, RADIUS } from '../../theme/tokens';

export default function OrganizeDropdown({ open, onClose, selectedImages = [], anchorRef, collections, onToggleCollection, onCreateCollection, onViewAll }) {
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) { setSearch(''); setCreating(false); setNewName(''); return; }
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose, anchorRef]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateCollection?.(newName.trim(), selectedImages);
    setNewName('');
    setCreating(false);
  };

  const filtered = (collections || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // A collection is "active" if it already contains at least one selected image
  const isActive = (col) => selectedImages.some((img) => col.images.includes(img));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ position: 'absolute', top: 44, left: 0, zIndex: 300, minWidth: 270 }}
        >
          <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.55)', overflow: 'hidden' }}>

            {/* Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Search size={13} strokeWidth={1.8} color="rgba(255,255,255,0.35)" />
              <InputBase
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections"
                autoFocus
                sx={{ fontSize: '0.78rem', color: 'text.primary', flex: 1, '& input::placeholder': { color: 'text.disabled', opacity: 1 } }}
              />
              {search && <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'text.disabled', p: 0 }}><X size={11} /></IconButton>}
            </Box>

            {/* Collections list */}
            <Box sx={{ maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {filtered.length === 0 && (
                <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', px: 2, py: 1.5, textAlign: 'center' }}>
                  No collections found
                </Typography>
              )}
              {filtered.map((col) => {
                const active = isActive(col);
                return (
                  <Box
                    key={col.id}
                    onClick={() => onToggleCollection?.(col.id, selectedImages)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.25,
                      px: 1.5, py: 0.9, cursor: 'pointer',
                      bgcolor: active ? COLORS.primaryAlpha[10] : 'transparent',
                      transition: 'background 0.15s',
                      '&:hover': { bgcolor: active ? COLORS.primaryAlpha[15] : 'action.hover' },
                    }}
                  >
                    {/* Thumbnail */}
                    <Box sx={{ width: 30, height: 30, borderRadius: '6px', overflow: 'hidden', flexShrink: 0, bgcolor: 'rgba(255,255,255,0.06)' }}>
                      {col.images[0]
                        ? <Box component="img" src={col.images[0]} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : <Folder size={14} color="rgba(255,255,255,0.2)" style={{ margin: '8px auto', display: 'block' }} />
                      }
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: active ? 'primary.main' : 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {col.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.62rem', color: 'text.disabled' }}>
                        {col.images.length} image{col.images.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    {/* Checkbox */}
                    <Box sx={{
                      width: 18, height: 18, borderRadius: '5px', border: '1.5px solid',
                      borderColor: active ? 'primary.main' : 'divider',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      {active && <Check size={11} strokeWidth={3} color="#000" />}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            {/* New collection */}
            {creating ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.9 }}>
                <Folder size={14} color={COLORS.primary} />
                <InputBase
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Collection name..."
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
                  sx={{ fontSize: '0.78rem', color: 'text.primary', flex: 1 }}
                />
                <IconButton size="small" onClick={handleCreate} sx={{ color: 'primary.main', p: 0.25 }}><Check size={14} strokeWidth={2.5} /></IconButton>
                <IconButton size="small" onClick={() => setCreating(false)} sx={{ color: 'text.disabled', p: 0.25 }}><X size={14} /></IconButton>
              </Box>
            ) : (
              <Box
                onClick={() => setCreating(true)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.9, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'action.hover' }, transition: 'all 0.15s' }}
              >
                <Plus size={14} strokeWidth={2} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: 'inherit' }}>New collection</Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: 'divider' }} />

            {/* View all */}
            <Box
              onClick={() => { onClose?.(); onViewAll?.(); }}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.9, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, transition: 'background 0.15s' }}
            >
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>View all collections</Typography>
              <ExternalLink size={12} color="rgba(255,255,255,0.3)" />
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
