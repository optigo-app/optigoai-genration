'use client';

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { COLORS, RADIUS } from '@/theme/tokens';
import { handleDownloadFile } from '@/utils/globalFunc';
import useModelViewer from '@/hooks/useModelViewer';

export default function MediaPreviewModal({
  images = [],
  open = false,
  startIndex = 0,
  onClose
}) {

  const [current, setCurrent] = useState(startIndex);
  const [isLoaded, setIsLoaded] = useState(false);

  const modelViewerReady = useModelViewer(open);

  /* ------------------ */
  /* Sync index on open */
  /* ------------------ */

  useEffect(() => {
    if (open) {
      setCurrent(startIndex);
      setIsLoaded(false);
    }
  }, [open, startIndex]);

  /* ------------------ */

  const currentItem = useMemo(() => images[current], [images, current]);

  const source =
    typeof currentItem === 'string'
      ? currentItem
      : currentItem?.src || currentItem?.url || '';

  const label =
    typeof currentItem === 'string'
      ? `Result ${current + 1}`
      : currentItem?.prompt || `Result ${current + 1}`;

  const isVideo = /\.(mp4|webm|mov)$/i.test(source);
  const isModel = /\.(glb|gltf|usdz)$/i.test(source);

  /* ------------------ */
  /* Reset loader on src */
  /* ------------------ */

  useEffect(() => {
    if (open) setIsLoaded(false);
  }, [source, open]);

  /* ------------------ */
  /* Keyboard nav       */
  /* ------------------ */

  useEffect(() => {

    if (!open) return;

    const handleKeyDown = (e) => {

      if (e.key === 'Escape') onClose?.();

      if (images.length > 1) {

        if (e.key === 'ArrowRight')
          setCurrent((i) => (i + 1) % images.length);

        if (e.key === 'ArrowLeft')
          setCurrent((i) => (i - 1 + images.length) % images.length);

      }

    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [open, images.length]);

  /* ------------------ */

  const handleNext = () => {
    setCurrent((i) => (i + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    handleDownloadFile(source);
  };

  if (!source && open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(6px)'
          }
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >

      <Box
        sx={{
          outline: 'none',
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, md: 4 }
        }}
      >

        {/* TOP BAR */}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)'
          }}
        >

          <Box>

            <Typography
              sx={{
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                maxWidth: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {label}
            </Typography>

            {images.length > 1 && (
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.72rem'
                }}
              >
                {current + 1} of {images.length}
              </Typography>
            )}

          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>

            <IconButton
              onClick={handleDownload}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <Download size={20} />
            </IconButton>

            <IconButton
              onClick={onClose}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <X size={20} />
            </IconButton>

          </Box>

        </Box>

        {/* MEDIA */}

        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >

          <AnimatePresence mode="wait">

            <motion.div
              key={source}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >

              <Box
                sx={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  borderRadius: RADIUS.md,
                  overflow: 'hidden',
                  bgcolor: '#000',
                  position: 'relative'
                }}
              >

                {/* IMAGE */}

                {!isVideo && !isModel && (
                  <img
                    src={source}
                    alt={label}
                    onLoad={() => setIsLoaded(true)}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '82vh',
                      objectFit: 'contain'
                    }}
                  />
                )}

                {/* VIDEO */}

                {isVideo && (
                  <video
                    src={source}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsLoaded(true)}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '82vh'
                    }}
                  />
                )}

                {/* 3D MODEL */}

                {isModel && modelViewerReady && (
                  <model-viewer
                    ref={(node) => {
                      if (!node) return;

                      node.addEventListener("load", () => {
                        setIsLoaded(true);
                      });

                      node.addEventListener("error", () => {
                        setIsLoaded(true);
                      });
                    }}
                    src={source}
                    auto-rotate
                    camera-controls
                    interaction-prompt="none"
                    reveal="auto"
                    environment-image="neutral"
                    shadow-intensity="1"
                    exposure="1"
                    style={{
                      width: 'min(90vw, 960px)',
                      height: 'min(82vh, 720px)',
                      background: '#000'
                    }}
                  />
                )}

                {/* LOADER */}

                {(!isLoaded || (isModel && !modelViewerReady)) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#000'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          border: '3px solid rgba(255,255,255,0.2)',
                          borderTopColor: COLORS.primary
                        }}
                      />
                    </motion.div>
                  </Box>
                )}

              </Box>

            </motion.div>

          </AnimatePresence>

        </Box>

        {/* NAVIGATION */}

        {images.length > 1 && (
          <>

            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 30,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ChevronLeft size={32} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 30,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ChevronRight size={32} />
            </IconButton>

          </>
        )}

      </Box>

    </Modal>
  );
}