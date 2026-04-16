'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function isVideoSource(src = '') {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

export default function MediaPreviewModal({ items = [], open = false, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (open) {
      setCurrent(startIndex);
    }
  }, [open, startIndex]);

  const currentItem = useMemo(() => items[current], [items, current]);

  useEffect(() => {
    if (!open || items.length <= 1) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key === 'ArrowLeft') {
        setCurrent((index) => (index - 1 + items.length) % items.length);
      }
      if (event.key === 'ArrowRight') {
        setCurrent((index) => (index + 1) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, items.length, onClose]);

  if (!currentItem) return null;

  const source = typeof currentItem === 'string' ? currentItem : currentItem?.src || '';
  const label = typeof currentItem === 'string' ? `Preview ${current + 1}` : currentItem?.label || `Preview ${current + 1}`;
  const isVideo = isVideoSource(source);

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, zIndex: 1500 }}>
      <Box sx={{ width: '100%', maxWidth: 980, maxHeight: '92vh', bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', maxWidth: '85%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </Box>

        <Box sx={{ position: 'relative', bgcolor: 'black' }}>
          {isVideo ? (
            <Box component="video" src={source} controls autoPlay playsInline sx={{ width: '100%', maxHeight: '78vh', display: 'block' }} />
          ) : (
            <Box component="img" src={source} alt={label} sx={{ width: '100%', maxHeight: '78vh', objectFit: 'contain', display: 'block' }} />
          )}

          {items.length > 1 && (
            <>
              <IconButton
                onClick={() => setCurrent((index) => (index - 1 + items.length) % items.length)}
                sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                <ChevronLeft size={22} />
              </IconButton>
              <IconButton
                onClick={() => setCurrent((index) => (index + 1) % items.length)}
                sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                <ChevronRight size={22} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
