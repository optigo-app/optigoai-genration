'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FolderOpen, Image, Trash2 } from 'lucide-react';
import { COLORS, RADIUS } from '../../theme/tokens';

export default function CollectionsModal({ open, onClose, collections, onDeleteCollection }) {
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);

  const filtered = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = collections.find((c) => c.id === activeId) || filtered[0];

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        style={{ width: '100%', maxWidth: 960, outline: 'none' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px)',
          height: 'calc(100vh - 48px)',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderOpen size={18} color={COLORS.primary} strokeWidth={1.8} />
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>My Collections</Typography>
              <Chip label={`${collections.length}`} size="small" sx={{ height: 18, fontSize: '0.62rem', bgcolor: COLORS.primaryAlpha[15], color: COLORS.primary, '& .MuiChip-label': { px: 0.75 } }} />
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
              <X size={18} />
            </IconButton>
          </Box>

          {/* Search */}
          <Box sx={{ px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: '10px', bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: 'divider' }}>
              <Search size={14} strokeWidth={1.8} color="rgba(255,255,255,0.35)" />
              <InputBase
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections..."
                autoFocus
                fullWidth
                sx={{ fontSize: '0.85rem', color: 'text.primary', '& input::placeholder': { color: 'text.disabled', opacity: 1 } }}
              />
              {search && (
                <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'text.disabled', p: 0 }}>
                  <X size={12} />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Body: left list + right preview */}
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: collection list */}
            <Box sx={{ width: 240, flexShrink: 0, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {filtered.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>No collections found</Typography>
                </Box>
              ) : (
                filtered.map((col) => (
                  <Box
                    key={col.id}
                    onClick={() => setActiveId(col.id)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.25,
                      px: 2, py: 1.25, cursor: 'pointer',
                      bgcolor: active?.id === col.id ? COLORS.primaryAlpha[10] : 'transparent',
                      borderLeft: '2px solid',
                      borderColor: active?.id === col.id ? 'primary.main' : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {/* Folder thumbnail */}
                    <Box sx={{ width: 36, height: 36, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, bgcolor: 'rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px' }}>
                      {col.images.slice(0, 4).map((img, i) => (
                        <Box key={i} component="img" src={img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ))}
                      {col.images.length === 0 && <FolderOpen size={18} color="rgba(255,255,255,0.2)" style={{ margin: 'auto', gridColumn: '1/-1' }} />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: active?.id === col.id ? 'primary.main' : 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {col.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>
                        {col.images.length} image{col.images.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            {/* Right: image grid preview */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
              {!active ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1.5, color: 'text.disabled' }}>
                  <FolderOpen size={40} strokeWidth={1} />
                  <Typography sx={{ fontSize: '0.82rem' }}>Select a collection to preview</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>{active.name}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>{active.images.length} images</Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => { onDeleteCollection?.(active.id); setActiveId(null); }}
                      sx={{ color: COLORS.red, '&:hover': { bgcolor: 'rgba(248,113,113,0.1)' } }}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </Box>

                  {active.images.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 1.5, color: 'text.disabled', border: '1px dashed', borderColor: 'divider', borderRadius: '12px' }}>
                      <Image size={32} strokeWidth={1} />
                      <Typography sx={{ fontSize: '0.78rem' }}>No images in this collection yet</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1.25 }}>
                      <AnimatePresence>
                        {active.images.map((img, i) => (
                          <motion.div
                            key={img + i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                          >
                            <Box sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: 'primary.main' }, transition: 'border-color 0.15s' }}>
                              <Box component="img" src={img} alt="" sx={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '1/1' }} />
                            </Box>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Modal>
  );
}
