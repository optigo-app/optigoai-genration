'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Gauge, Timer, ChevronRight, Folder, Plus, Check, X, ChevronDown, Search, HelpCircle, ExternalLink, Workflow } from 'lucide-react';
import { IMAGE_MODELS, VIDEO_MODELS } from '@/components/generate/ModelSelectPanel';
import { COLORS, RADIUS, SHADOWS } from '@/theme/tokens';

const DIMENSIONS = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
];

const VIDEO_QUALITIES = ['360p', '480p', '720p', '1080p', '4K'];
const VIDEO_DURATIONS = ['3s', '5s', '8s', '10s', '15s'];

// ── Sub-components ──────────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65, mb: 1.1 }}>
      {Icon && <Icon size={13} strokeWidth={1.95} color={COLORS.primary} />}
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.085em' }}>
        {children}
      </Typography>
    </Box>
  );
}

function OptionChip({ label, active, onClick }) {
  return (
    <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Box onClick={onClick} sx={{ px: 1.2, py: 0.42, borderRadius: RADIUS.sm, cursor: 'pointer', border: '1px solid', borderColor: active ? COLORS.primaryAlpha[40] : 'divider', bgcolor: active ? COLORS.primaryAlpha[15] : 'transparent', color: active ? 'primary.main' : 'text.secondary', fontSize: '0.7rem', fontWeight: active ? 600 : 500, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { borderColor: COLORS.primaryAlpha[40], bgcolor: COLORS.primaryAlpha[12], color: 'primary.main' } }}>
        {label}
      </Box>
    </motion.div>
  );
}

function DimensionBox({ d, active, onClick }) {
  return (
    <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          py: 1.2,
          px: 0.8,
          borderRadius: '10px',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: active ? COLORS.primaryAlpha[40] : 'divider',
          bgcolor: active ? COLORS.primaryAlpha[12] : 'transparent',
          boxShadow: active ? '0 4px 14px rgba(115, 103, 240, 0.18)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: COLORS.primaryAlpha[40],
            bgcolor: COLORS.primaryAlpha[12],
            boxShadow: '0 4px 14px rgba(115, 103, 240, 0.15)',
          },
        }}
      >
        <Box
          sx={{
            width: d.w > d.h ? 32 : d.w === d.h ? 24 : 18,
            height: d.h > d.w ? 32 : d.w === d.h ? 24 : 18,
            border: '2px solid',
            borderColor: active ? 'primary.main' : 'text.disabled',
            borderRadius: '4px',
            bgcolor: active ? COLORS.primaryAlpha[8] : 'transparent',
            transition: 'all 0.2s',
          }}
        />
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: active ? 'primary.main' : 'text.primary',
            fontWeight: active ? 600 : 500,
          }}
        >
          {d.label}
        </Typography>
      </Box>
    </motion.div>
  );
}

// ── Model trigger button ────────────────────────────────────────────
function ModelTrigger({ models, value, onOpen }) {
  const selected = models.find((m) => m.id === value) || models[0];
  return (
    <Box>
      <SectionLabel icon={Sparkles}>Model</SectionLabel>
      <motion.div whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Box
          onClick={onOpen}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.3, py: 0.9, borderRadius: '10px', cursor: 'pointer',
            border: '1px solid', borderColor: 'divider',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { borderColor: COLORS.primaryAlpha[40], bgcolor: COLORS.primaryAlpha[12], boxShadow: '0 4px 16px rgba(115, 103, 240, 0.2)' },
          }}
        >
          {/* Thumbnail */}
          <Box
            component="img"
            src={selected.image}
            alt={selected.name}
            sx={{ width: 36, height: 24, objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.76rem', fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selected.name}
            </Typography>
            <Chip label={selected.tag} size="small" sx={{ height: 14, fontSize: '0.5rem', fontWeight: 700, bgcolor: `${selected.color}18`, color: selected.color, border: `1px solid ${selected.color}33`, '& .MuiChip-label': { px: 0.5 } }} />
          </Box>
          <ChevronRight size={14} strokeWidth={2} color="rgba(115, 103, 240, 0.72)" />
        </Box>
      </motion.div>
    </Box>
  );
}

// ── Main panel ──────────────────────────────────────────────────────
export default function GenerateSettingsPanel({ settings, onChange, mode = 'image', onOpenModelPanel, collections = [], onCreateCollection }) {
  const isVideo = mode === 'video';
  const update = (key, val) => onChange({ ...settings, [key]: val });
  const models = isVideo ? VIDEO_MODELS : IMAGE_MODELS;
  const defaultModel = models[0].id;

  // Collection accordion state
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const selectedCollection = collections?.find(c => c.id === settings.collectionId);

  const handleCreateCollection = () => {
    if (!newName.trim()) return;
    const newCollection = { id: Date.now(), name: newName.trim(), images: [] };
    onCreateCollection?.(newName.trim(), []);
    update('collectionId', newCollection.id);
    setNewName('');
    setCreating(false);
  };

  const filteredCollections = (collections || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const DEFAULT = {
    dimension: '1:1', count: 1, collectionId: null,
    videoQuality: '1080p', videoDuration: '5s', videoFps: '30', motionStrength: 5,
    imageModel: IMAGE_MODELS[0].id, videoModel: VIDEO_MODELS[0].id,
    cadImageEnhancement: true, cadMultiView: true, cadEnablePbr: true,
  };

  const modelKey = isVideo ? 'videoModel' : 'imageModel';
  const currentModel = settings[modelKey] || defaultModel;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      style={{ height: '100%', display: 'flex', width: '100%' }}
    >
      <Box sx={{ width: '100%', flexShrink: 0, height: '100%', overflowY: 'auto', px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2.1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>

        {/* Model trigger */}
        <ModelTrigger
          models={models}
          value={currentModel}
          onOpen={onOpenModelPanel}
        />

        <Divider />

        {/* Dimensions */}
        <Box>
          <SectionLabel>{isVideo ? 'Video Dimensions' : 'Image Dimensions'}</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
            {DIMENSIONS.map((d) => (
              <DimensionBox key={d.label} d={d} active={settings.dimension === d.label} onClick={() => update('dimension', d.label)} />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Mode-specific sections */}
        <AnimatePresence mode="wait">
          {mode === 'cad' ? (
            <motion.div key="cad" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Box>
                <SectionLabel icon={Workflow}>CAD Settings</SectionLabel>
                <Stack gap={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Image Enhancement</Typography>
                    <Checkbox checked={settings.cadImageEnhancement} onChange={(e) => update('cadImageEnhancement', e.target.checked)} size="small" sx={{ p: 0.5, color: COLORS.primary }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Multi-View</Typography>
                    <Checkbox checked={settings.cadMultiView} onChange={(e) => update('cadMultiView', e.target.checked)} size="small" sx={{ p: 0.5, color: COLORS.primary }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Enable PBR</Typography>
                    <Checkbox checked={settings.cadEnablePbr} onChange={(e) => update('cadEnablePbr', e.target.checked)} size="small" sx={{ p: 0.5, color: COLORS.primary }} />
                  </Box>
                </Stack>
              </Box>
            </motion.div>
          ) : isVideo ? (
            <motion.div key="video" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Box>
                <SectionLabel>Number of Generations</SectionLabel>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <Box key={n} onClick={() => update('count', n)} sx={{ flex: 1, textAlign: 'center', py: 0.7, borderRadius: '8px', cursor: 'pointer', border: '1px solid', borderColor: settings.count === n ? COLORS.primaryAlpha[40] : 'divider', bgcolor: settings.count === n ? COLORS.primaryAlpha[15] : 'transparent', color: settings.count === n ? 'primary.main' : 'text.secondary', fontSize: '0.8rem', fontWeight: settings.count === n ? 700 : 500, transition: 'all 0.2s', '&:hover': { borderColor: COLORS.primaryAlpha[40], bgcolor: COLORS.primaryAlpha[12] } }}>
                      {n}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Divider />
              <Box>
                <SectionLabel icon={Gauge}>Quality</SectionLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {VIDEO_QUALITIES.map((q) => <OptionChip key={q} label={q} active={settings.videoQuality === q} onClick={() => update('videoQuality', q)} />)}
                </Box>
              </Box>
              <Divider />
              <Box>
                <SectionLabel icon={Timer}>Duration</SectionLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {VIDEO_DURATIONS.map((d) => <OptionChip key={d} label={d} active={settings.videoDuration === d} onClick={() => update('videoDuration', d)} />)}
                </Box>
              </Box>
            </motion.div>
          ) : (
            <motion.div key="image" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Box>
                <SectionLabel>Number of Generations</SectionLabel>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <Box key={n} onClick={() => update('count', n)} sx={{ flex: 1, textAlign: 'center', py: 0.6, borderRadius: '7px', cursor: 'pointer', border: '1px solid', borderColor: settings.count === n ? 'primary.main' : 'divider', bgcolor: settings.count === n ? COLORS.primaryAlpha[12] : 'transparent', color: settings.count === n ? 'primary.main' : 'text.secondary', fontSize: '0.78rem', fontWeight: settings.count === n ? 700 : 400, transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main' } }}>
                      {n}
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        <Divider />
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={() => onChange(DEFAULT)} sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.73rem', fontWeight: 500, borderRadius: '9px', py: 0.65, transition: 'all 0.2s', '&:hover': { borderColor: COLORS.primaryAlpha[40], color: 'primary.main', bgcolor: COLORS.primaryAlpha[10] } }}>
          Reset to defaults
        </Button>
      </Box>
    </motion.div>
  );
}
