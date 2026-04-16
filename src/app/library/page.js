'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, Video, Image as ImageIcon, MoreVertical, FolderPlus, Check, X, List, Download } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Sidebar from '@/components/Sidebar';
import MediaPreviewModal from '@/components/generate/MediaPreviewModal';
import { COLORS, RADIUS, SHADOWS } from '@/theme/tokens';

function isVideoSource(src = '') {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

// ── Shared sample data ──────────────────────────────────────────────
const ALL_GENERATIONS = [
  { id: 'g1', src: 'https://picsum.photos/seed/gen1/400/500', prompt: 'Cinematic portrait of a young woman', type: 'image', date: 'Monday, 03 Feb 2025' },
  { id: 'g2', src: 'https://picsum.photos/seed/gen2/400/500', prompt: 'Traditional Indian devotional art', type: 'image', date: 'Sunday, 11 Jan 2026' },
  { id: 'g3', src: 'https://picsum.photos/seed/gen3/400/500', prompt: 'Fantasy landscape with mountains', type: 'image', date: 'Sunday, 11 Jan 2026' },
  { id: 'g4', src: 'https://picsum.photos/seed/gen4/400/500', prompt: 'Anime character in battle pose', type: 'image', date: 'Sunday, 11 Jan 2026' },
  { id: 'g5', src: 'https://picsum.photos/seed/gen5/400/300', prompt: 'StoryVoice India logo', type: 'image', date: 'Sunday, 29 Aug 2025' },
  { id: 'g6', src: 'https://picsum.photos/seed/gen6/400/300', prompt: 'StoryVoice India logo v2', type: 'image', date: 'Sunday, 29 Aug 2025' },
  { id: 'g7', src: 'https://picsum.photos/seed/gen7/400/300', prompt: 'ToolHub logo design', type: 'image', date: 'Sunday, 13 Jul 2025' },
  { id: 'g8', src: 'https://picsum.photos/seed/gen8/400/300', prompt: 'ToolHub logo v2', type: 'image', date: 'Sunday, 13 Jul 2025' },
  { id: 'g9', src: 'https://picsum.photos/seed/gen9/400/500', prompt: 'Cinematic video scene', type: 'video', date: 'Monday, 03 Feb 2025' },
  { id: 'g10', src: 'https://picsum.photos/seed/gen10/400/500', prompt: 'Anime video clip', type: 'video', date: 'Sunday, 11 Jan 2026' },
];

const INITIAL_COLLECTIONS = [
  { id: 1, name: 'TEST COLLECTION', images: ['https://picsum.photos/seed/gen1/400/500', 'https://picsum.photos/seed/gen2/400/500', 'https://picsum.photos/seed/gen3/400/500', 'https://picsum.photos/seed/gen4/400/500'] },
  { id: 2, name: 'Portraits', images: ['https://picsum.photos/seed/gen1/400/500', 'https://picsum.photos/seed/gen2/400/500'] },
  { id: 3, name: 'Logos', images: ['https://picsum.photos/seed/gen5/400/300', 'https://picsum.photos/seed/gen7/400/300'] },
];

const TABS = ['Your Generations', 'Liked Feed', 'Collections'];
const TYPE_FILTERS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'name', label: 'Name A-Z' },
];

// ── Collection card ──────────────────────────────────────────────────
function CollectionCard({ collection, onDelete, index }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const imgs = collection.images.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
    >
      <Box
        sx={{
          width: 210,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': { borderColor: 'primary.main', boxShadow: `0 6px 24px ${COLORS.primaryAlpha[18]}` },
        }}
      >
        {/* 2x2 image grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', bgcolor: isDark ? '#111' : '#e8e8ec' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ aspectRatio: '1/1', overflow: 'hidden', bgcolor: isDark ? '#222' : '#ddd' }}>
              {imgs[i] && <Box component="img" src={imgs[i]} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 1 }}>
          <FolderPlus size={13} strokeWidth={1.8} color={COLORS.primary} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'text.primary', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {collection.name}
          </Typography>
          <Tooltip title="More options" placement="top">
            <IconButton size="small" sx={{ color: 'text.disabled', p: 0.25, '&:hover': { color: 'text.primary' } }}>
              <MoreVertical size={13} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </motion.div>
  );
}

// ── Generation card ──────────────────────────────────────────────────
function GenerationCard({ item, selected, onSelect, index, onPreview }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = isVideoSource(item.src);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onPreview?.(item.src)}
      style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1.5px solid',
          borderColor: selected ? 'primary.main' : hovered ? COLORS.primaryAlpha[40] : 'rgba(255,255,255,0.07)',
          boxShadow: selected ? `0 0 0 2px ${COLORS.primaryAlpha[30]}` : 'none',
          transition: 'all 0.2s',
        }}
      >
        {isVideo ? (
          <Box component="video" src={item.src} muted loop playsInline sx={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
        ) : (
          <Box component="img" src={item.src} alt={item.prompt}
            sx={{ width: '100%', display: 'block', transition: 'transform 0.3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        )}

        {/* Overlay */}
        <motion.div
          animate={{ opacity: hovered || selected ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }}
        />

        {/* Select checkbox — top left */}
        <motion.div
          animate={{ opacity: hovered || selected ? 1 : 0, scale: hovered || selected ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
          style={{ position: 'absolute', top: 8, left: 8 }}
        >
          <Box
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            sx={{
              width: 24, height: 24, borderRadius: '6px',
              border: '2px solid', borderColor: selected ? 'primary.main' : 'rgba(255,255,255,0.7)',
              bgcolor: selected ? 'primary.main' : 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', transition: 'all 0.15s', cursor: 'pointer',
            }}
          >
            {selected && <Check size={13} strokeWidth={3} color="#000" />}
          </Box>
        </motion.div>

        {/* Type badge */}
        {item.type === 'video' && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, px: 0.75, py: 0.25, borderRadius: '5px', bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <Typography sx={{ fontSize: '0.58rem', color: COLORS.cyan, fontWeight: 700 }}>VIDEO</Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export default function LibraryPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState('Your Generations');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [moveToColOpen, setMoveToColOpen] = useState(false);
  const [moveColSearch, setMoveColSearch] = useState('');
  const [moveNewName, setMoveNewName] = useState('');
  const [creatingMoveCol, setCreatingMoveCol] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const menuRef = useRef(null);

  const toggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMoveToColOpen(false);
      }
    };
    if (moveToColOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [moveToColOpen]);

  const handlePreview = (src) => {
    const allSrcs = filteredGenerations.map((g) => g.src);
    const idx = allSrcs.indexOf(src);
    setPreviewItems(allSrcs);
    setPreviewIndex(idx >= 0 ? idx : 0);
    setPreviewOpen(true);
  };

  const filteredGenerations = ALL_GENERATIONS
    .filter((g) => typeFilter === 'all' || g.type === typeFilter)
    .filter((g) => searchQuery === '' || g.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return 0; // Already sorted by index
      if (sortBy === 'oldest') return 0;
      if (sortBy === 'name') return a.prompt.localeCompare(b.prompt);
      return 0;
    });

  const handleNewCollection = () => {
    if (!newColName.trim()) return;
    setCollections((prev) => [...prev, { id: Date.now(), name: newColName.trim().toUpperCase(), images: [] }]);
    setNewColName('');
    setCreatingCollection(false);
  };

  const selectedSrcs = ALL_GENERATIONS.filter((g) => selectedIds.includes(g.id)).map((g) => g.src);

  const handleMoveToCollection = (colId) => {
    setCollections((prev) => prev.map((c) => {
      if (c.id !== colId) return c;
      return { ...c, images: [...new Set([...c.images, ...selectedSrcs])] };
    }));
    setSelectedIds([]);
    setSelectMode(false);
    setMoveToColOpen(false);
  };

  const handleCreateAndMove = () => {
    if (!moveNewName.trim()) return;
    const newCol = { id: Date.now(), name: moveNewName.trim().toUpperCase(), images: [...new Set(selectedSrcs)] };
    setCollections((prev) => [...prev, newCol]);
    setMoveNewName('');
    setCreatingMoveCol(false);
    setSelectedIds([]);
    setSelectMode(false);
    setMoveToColOpen(false);
  };

  const filteredMoveCollections = collections.filter((c) => c.name.toLowerCase().includes(moveColSearch.toLowerCase()));

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', p: '12px', gap: '12px' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1, ml: '80px',
          minHeight: 'calc(100vh - 24px)',
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: SHADOWS.sidebar,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <Box sx={{ px: 3, pt: 2.5, pb: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: 'text.primary', mb: 1.5 }}>
            Library
          </Typography>

          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 0 }}>
            {TABS.map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  px: 2, py: 1.25, cursor: 'pointer', fontSize: '0.82rem', fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'text.primary' : 'text.disabled',
                  borderBottom: '2px solid', borderColor: activeTab === tab ? 'primary.main' : 'transparent',
                  transition: 'all 0.15s', '&:hover': { color: 'text.primary' },
                }}
              >
                {tab}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Toolbar ── */}
        <Box sx={{ px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            {/* Left: search + filters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              {/* Search */}
              <TextField
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: 240,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.8rem',
                    borderRadius: '10px',
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider', borderWidth: '1.5px' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                  },
                }}
              />

              {/* Type filters */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.default', borderRadius: '10px', p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                {TYPE_FILTERS.map((f) => {
                  const Icon = f.icon;
                  const active = typeFilter === f.id;
                  return (
                    <Box
                      key={f.id}
                      onClick={() => setTypeFilter(f.id)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        px: 1, py: 0.5, borderRadius: '8px', cursor: 'pointer',
                        bgcolor: active ? 'primary.main' : 'transparent',
                        color: active ? '#fff' : 'text.secondary',
                        fontSize: '0.75rem', fontWeight: active ? 600 : 400,
                        transition: 'all 0.2s', '&:hover': { bgcolor: active ? 'primary.main' : 'action.hover' },
                      }}
                    >
                      <Icon size={12} strokeWidth={2} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'inherit', fontWeight: 'inherit' }}>{f.label}</Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Sorting */}
              <Select
                size="small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.8rem',
                    bgcolor: 'background.default',
                    '& fieldset': { borderColor: 'divider', borderWidth: '1.5px' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
                  },
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: '0.8rem' }}>{opt.label}</MenuItem>
                ))}
              </Select>
            </Box>

            {/* Right: select + view mode + new collection */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!selectMode ? (
                <>
                  {/* Select button */}
                  <Button
                    size="small"
                    startIcon={<Check size={14} />}
                    onClick={() => { setSelectMode(true); setSelectedIds([]); }}
                    sx={{
                      fontSize: '0.8rem', borderRadius: '10px', textTransform: 'none',
                      color: 'text.secondary', px: 1.5, py: 0.6,
                      '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                    }}
                  >
                    Select
                  </Button>

                  {/* View mode toggle */}
                  <Tooltip title={viewMode === 'grid' ? 'List view' : 'Grid view'}>
                    <IconButton
                      size="small"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      sx={{
                        borderRadius: '10px',
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                        border: '1.5px solid', borderColor: 'divider',
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                      }}
                    >
                      {viewMode === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
                    </IconButton>
                  </Tooltip>

                  {/* New collection button (only on Collections tab) */}
                  {activeTab === 'Collections' && (
                    creatingCollection ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.default', borderRadius: '10px', p: 0.5, border: '1.5px solid', borderColor: 'primary.main' }}>
                        <Box
                          component="input"
                          value={newColName}
                          onChange={(e) => setNewColName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleNewCollection(); if (e.key === 'Escape') setCreatingCollection(false); }}
                          placeholder="Collection name..."
                          autoFocus
                          sx={{
                            bgcolor: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem',
                            color: 'text.primary', width: 140,
                          }}
                        />
                        <IconButton size="small" onClick={handleNewCollection} sx={{ color: 'primary.main', p: 0.3 }}><Check size={14} /></IconButton>
                        <IconButton size="small" onClick={() => setCreatingCollection(false)} sx={{ color: 'text.disabled', p: 0.3 }}><X size={14} /></IconButton>
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<FolderPlus size={14} />}
                        onClick={() => setCreatingCollection(true)}
                        sx={{
                          fontSize: '0.8rem', borderRadius: '10px', textTransform: 'none',
                          bgcolor: 'primary.main', color: '#000', fontWeight: 700, px: 1.5, py: 0.6,
                          '&:hover': { bgcolor: COLORS.primaryHover },
                        }}
                      >
                        New
                      </Button>
                    )
                  )}
                </>
              ) : (
                <Button
                  size="small"
                  onClick={() => { setSelectedIds([]); setSelectMode(false); setMoveToColOpen(false); }}
                  sx={{
                    fontSize: '0.8rem', color: 'text.secondary', textTransform: 'none', borderRadius: '10px', px: 1.5, py: 0.6,
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  }}
                >
                  Exit Select
                </Button>
              )}
            </Box>
          </Box>

          {/* Select mode action bar (separate row) */}
          <AnimatePresence>
            {selectMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, px: 1.5, py: 1, borderRadius: '10px', bgcolor: 'background.default', border: '1.5px solid', borderColor: 'divider' }}>
                  {/* Left: count */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 700 }}>
                      {selectedIds.length} selected
                    </Typography>
                  </Box>

                  {/* Right: actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Button
                      size="small"
                      startIcon={<FolderPlus size={13} />}
                      disabled={selectedIds.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMoveToColOpen((v) => !v);
                      }}
                      sx={{ fontSize: '0.8rem', textTransform: 'none', borderRadius: '8px', px: 1.25, py: 0.6, bgcolor: 'background.default', border: '1.5px solid', borderColor: 'divider', color: selectedIds.length > 0 ? 'text.secondary' : 'text.disabled', opacity: selectedIds.length > 0 ? 1 : 0.5, '&:hover': selectedIds.length > 0 ? { bgcolor: 'action.hover', borderColor: 'divider', color: 'text.primary' } : {}, '&.Mui-disabled': { opacity: 0.5, color: 'text.disabled' } }}
                    >
                      Move to Collection
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Download size={13} />}
                      disabled={selectedIds.length === 0}
                      onClick={() => {
                        selectedSrcs.forEach((src, i) => {
                          const a = document.createElement('a');
                          a.href = src; a.download = `library-${i + 1}.jpg`; a.click();
                        });
                      }}
                      sx={{ fontSize: '0.8rem', textTransform: 'none', borderRadius: '8px', px: 1.25, py: 0.6, bgcolor: 'background.default', border: '1.5px solid', borderColor: 'divider', color: selectedIds.length > 0 ? 'text.secondary' : 'text.disabled', opacity: selectedIds.length > 0 ? 1 : 0.5, '&:hover': selectedIds.length > 0 ? { bgcolor: 'action.hover', borderColor: 'divider', color: 'text.primary' } : {}, '&.Mui-disabled': { opacity: 0.5, color: 'text.disabled' } }}
                    >
                      Download all
                    </Button>
                    <Button
                      size="small"
                      disabled={selectedIds.length === 0}
                      onClick={() => { setSelectedIds([]); setMoveToColOpen(false); }}
                      sx={{ fontSize: '0.8rem', textTransform: 'none', borderRadius: '8px', px: 1.25, py: 0.6, bgcolor: 'background.default', border: '1.5px solid', borderColor: 'divider', color: selectedIds.length > 0 ? COLORS.red : 'text.disabled', opacity: selectedIds.length > 0 ? 1 : 0.5, '&:hover': selectedIds.length > 0 ? { bgcolor: `${COLORS.red}10`, borderColor: COLORS.red } : {}, '&.Mui-disabled': { opacity: 0.5, color: 'text.disabled' } }}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ── Content ── */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 } }}>

          <AnimatePresence mode="wait">
            {activeTab === 'Collections' ? (
              <motion.div key="collections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Breadcrumb */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Collections</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>›</Typography>
                </Box>

                {collections.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 2, color: 'text.disabled' }}>
                    <FolderPlus size={48} strokeWidth={1} color={COLORS.primary} />
                    <Typography sx={{ fontSize: '0.9rem' }}>No collections yet</Typography>
                    <Button onClick={() => setCreatingCollection(true)} variant="outlined" size="small" sx={{ borderColor: 'primary.main', color: 'primary.main', borderRadius: '8px', textTransform: 'none' }}>
                      Create your first collection
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {collections.map((col, i) => (
                      <CollectionCard key={col.id} collection={col} index={i} onDelete={(id) => setCollections((prev) => prev.filter((c) => c.id !== id))} />
                    ))}
                  </Box>
                )}
              </motion.div>
            ) : activeTab === 'Your Generations' ? (
              <motion.div key="generations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Box sx={{ position: 'relative' }}>
                  {/* Inline collection picker (for Move to Collection) */}
                  <AnimatePresence>
                    {moveToColOpen && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.18 }}
                        style={{ position: 'absolute', top: 0, right: 0, zIndex: 200, minWidth: 280 }}
                      >
                        <Box sx={{ bgcolor: 'background.paper', border: '1.5px solid', borderColor: 'divider', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                          {/* Search */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Box component="input" value={moveColSearch} onChange={(e) => setMoveColSearch(e.target.value)} placeholder="Search collections..." autoFocus
                              sx={{ bgcolor: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', color: 'text.primary', flex: 1 }} />
                          </Box>
                          {/* List */}
                          <Box sx={{ maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'none' }}>
                            {filteredMoveCollections.map((col) => (
                              <Box key={col.id} onClick={() => handleMoveToCollection(col.id)}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '8px', overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                                  {col.images[0] && <Box component="img" src={col.images[0]} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.name}</Typography>
                                  <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>{col.images.length} images</Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                          <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                            {creatingMoveCol ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 1 }}>
                                <Box component="input" value={moveNewName} onChange={(e) => setMoveNewName(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAndMove(); if (e.key === 'Escape') setCreatingMoveCol(false); }}
                                  placeholder="Collection name..." autoFocus
                                  sx={{ bgcolor: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', color: 'text.primary', flex: 1 }} />
                                <IconButton size="small" onClick={handleCreateAndMove} sx={{ color: 'primary.main', p: 0.3 }}><Check size={14} /></IconButton>
                                <IconButton size="small" onClick={() => setCreatingMoveCol(false)} sx={{ color: 'text.disabled', p: 0.3 }}><X size={14} /></IconButton>
                              </Box>
                            ) : (
                              <Box onClick={() => setCreatingMoveCol(true)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}>
                                <Plus size={14} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'inherit' }}>New collection</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
                  {filteredGenerations.map((item, i) => (
                    <GenerationCard
                      key={item.id}
                      item={item}
                      index={i}
                      selected={selectedIds.includes(item.id)}
                      onSelect={selectMode ? toggleSelect : () => {}}
                      onPreview={handlePreview}
                    />
                  ))}
                </Box>
                </Box>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 2, color: 'text.disabled' }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>Nothing here yet</Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <MediaPreviewModal
          items={previewItems}
          open={previewOpen}
          startIndex={previewIndex}
          onClose={() => setPreviewOpen(false)}
        />
      </Box>
    </Box>
  );
}
