'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Gauge, Timer, ChevronRight } from 'lucide-react';
import { IMAGE_MODELS, VIDEO_MODELS } from './ModelSelectPanel';
import { COLORS, RADIUS } from '../../theme/tokens';

// ── Model data ──────────────────────────────────────────────────────
// const IMAGE_MODELS = [
//   { id: 'phoenix',    name: 'Leonardo Phoenix',    tag: 'Recommended', color: '#c084fc' },
//   { id: 'flux-dev',   name: 'Flux Dev',            tag: 'Fast',        color: '#67e8f9' },
//   { id: 'sdxl',       name: 'SDXL 1.0',            tag: 'Classic',     color: '#f472b6' },
//   { id: 'alchemy',    name: 'Alchemy v2',           tag: 'HD',          color: '#a78bfa' },
//   { id: 'diffusion',  name: 'Stable Diffusion 3',  tag: 'New',         color: '#34d399' },
// ];

// const VIDEO_MODELS = [
//   { id: 'motion-xl',  name: 'Motion XL',           tag: 'Recommended', color: '#67e8f9' },
//   { id: 'animate',    name: 'AnimateDiff',          tag: 'Smooth',      color: '#c084fc' },
//   { id: 'svd',        name: 'Stable Video Diffusion', tag: 'Classic',   color: '#f472b6' },
//   { id: 'kling',      name: 'Kling v1.5',           tag: 'Cinematic',   color: '#fbbf24' },
// ];

const DIMENSIONS = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
];

const IMAGE_PRESETS = ['Cinematic', 'Anime', 'Portrait', 'Sketch', 'Fantasy', 'Realistic'];
const VIDEO_QUALITIES = ['360p', '480p', '720p', '1080p', '4K'];
const VIDEO_DURATIONS = ['3s', '5s', '8s', '10s', '15s'];
const VIDEO_STYLES = ['Cinematic', 'Anime', 'Slow-Mo', 'Timelapse', 'Smooth'];

// ── Sub-components ──────────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
      {Icon && <Icon size={12} strokeWidth={2} color={COLORS.primary} />}
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {children}
      </Typography>
    </Box>
  );
}

function OptionChip({ label, active, onClick }) {
  return (
    <Box onClick={onClick} sx={{ px: 1.1, py: 0.35, borderRadius: RADIUS.xs, cursor: 'pointer', border: '1px solid', borderColor: active ? 'primary.main' : 'divider', bgcolor: active ? COLORS.primaryAlpha[12] : 'transparent', color: active ? 'primary.main' : 'text.secondary', fontSize: '0.68rem', fontWeight: active ? 600 : 400, transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main', bgcolor: COLORS.primaryAlpha[10] } }}>
      {label}
    </Box>
  );
}

function DimensionBox({ d, active, onClick }) {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, py: 1, borderRadius: RADIUS.sm, cursor: 'pointer', border: '1px solid', borderColor: active ? 'primary.main' : 'divider', bgcolor: active ? COLORS.primaryAlpha[10] : 'transparent', transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main', bgcolor: COLORS.primaryAlpha[10] } }}>
      <Box sx={{ width: d.w > d.h ? 26 : d.w === d.h ? 20 : 14, height: d.h > d.w ? 26 : d.w === d.h ? 20 : 14, border: '1.5px solid', borderColor: active ? 'primary.main' : 'text.disabled', borderRadius: '3px' }} />
      <Typography sx={{ fontSize: '0.62rem', color: active ? 'primary.main' : 'text.secondary', fontWeight: 600 }}>{d.label}</Typography>
    </Box>
  );
}

// ── Model trigger button ────────────────────────────────────────────
function ModelTrigger({ models, value, onOpen }) {
  const selected = models.find((m) => m.id === value) || models[0];
  return (
    <Box>
      <SectionLabel icon={Sparkles}>Model</SectionLabel>
      <Box
        onClick={onOpen}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 1.25, py: 0.85, borderRadius: '9px', cursor: 'pointer',
          border: '1px solid', borderColor: 'divider',
          transition: 'all 0.15s',
          '&:hover': { borderColor: 'primary.main', bgcolor: COLORS.primaryAlpha[10] },
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
          <Typography sx={{ fontSize: '0.73rem', fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selected.name}
          </Typography>
          <Chip label={selected.tag} size="small" sx={{ height: 14, fontSize: '0.5rem', fontWeight: 700, bgcolor: `${selected.color}18`, color: selected.color, border: `1px solid ${selected.color}33`, '& .MuiChip-label': { px: 0.5 } }} />
        </Box>
        <ChevronRight size={14} strokeWidth={2} color="rgba(255,255,255,0.3)" />
      </Box>
    </Box>
  );
}

// ── Main panel ──────────────────────────────────────────────────────
export default function GenerateSettingsPanel({ settings, onChange, mode = 'image', onOpenModelPanel }) {
  const isVideo = mode === 'video';
  const update = (key, val) => onChange({ ...settings, [key]: val });
  const models = isVideo ? VIDEO_MODELS : IMAGE_MODELS;
  const defaultModel = models[0].id;

  const DEFAULT = {
    dimension: '1:1', count: 1, preset: 'Cinematic', guidance: 7, addToCollection: false,
    videoQuality: '1080p', videoDuration: '5s', videoFps: '30', videoStyle: 'Cinematic', motionStrength: 5,
    imageModel: IMAGE_MODELS[0].id, videoModel: VIDEO_MODELS[0].id,
  };

  const modelKey = isVideo ? 'videoModel' : 'imageModel';
  const currentModel = settings[modelKey] || defaultModel;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      style={{ height: '100%', display: 'flex', width: '100%' }}
    >
      <Box sx={{ width: '100%', flexShrink: 0, height: '100%', overflowY: 'auto', px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>

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
          {isVideo ? (
            <motion.div key="video" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <Divider />
              <Box>
                <SectionLabel icon={Sparkles}>Video Style</SectionLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {VIDEO_STYLES.map((s) => <OptionChip key={s} label={s} active={settings.videoStyle === s} onClick={() => update('videoStyle', s)} />)}
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
              <Divider />
              <Box>
                <SectionLabel icon={Sparkles}>Preset Mode</SectionLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {IMAGE_PRESETS.map((p) => <OptionChip key={p} label={p} active={settings.preset === p} onClick={() => update('preset', p)} />)}
                </Box>
              </Box>
              <Divider />
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <SectionLabel>Guidance Scale</SectionLabel>
                  <Typography sx={{ fontSize: '0.68rem', color: 'primary.main', fontWeight: 700 }}>{settings.guidance}</Typography>
                </Box>
                <Slider value={settings.guidance} onChange={(_, v) => update('guidance', v)} min={1} max={20} step={0.5} size="small" sx={{ color: 'primary.main', '& .MuiSlider-thumb': { width: 12, height: 12 } }} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Divider />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Add to collection</Typography>
          <Switch checked={settings.addToCollection} onChange={(e) => update('addToCollection', e.target.checked)} size="small" sx={{ '& .MuiSwitch-thumb': { bgcolor: settings.addToCollection ? COLORS.primary : undefined } }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button variant="outlined" size="small" startIcon={<RotateCcw size={13} />} onClick={() => onChange(DEFAULT)} sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.7rem', borderRadius: '8px', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
          Reset to defaults
        </Button>
      </Box>
    </motion.div>
  );
}
