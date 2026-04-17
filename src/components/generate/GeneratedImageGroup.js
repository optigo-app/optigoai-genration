'use client';

import { memo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Download, Copy, ArrowUp, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import GeneratedImageCard, { GeneratingCard } from './GeneratedImageCard';
import MediaPreviewModal from './MediaPreviewModal';
import Tooltip from '@mui/material/Tooltip';
import { COLORS, SHADOWS } from '@/theme/tokens';
import { useConfirmation } from '@/hooks/useConfirmation';
import { handleDownloadFile } from '@/utils/globalFunc';

const loadingTexts = [
  'Generating your masterpiece...',
  'Applying AI magic...',
  'Rendering pixels...',
  'Almost there...',
  'Finalizing the image...'
];

function GeneratedImageGroup({ date, prompt, images, referenceImages = [], tags = [], isGenerating = false, count = 1, dimension = '1:1', onAction, selectedImages = [], onSelect }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { confirm, ConfirmationComponent } = useConfirmation();
  const [feedback, setFeedback] = useState(null); // { type: 'like' | 'dislike', label: string } | null
  const [feedbackAnchorEl, setFeedbackAnchorEl] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null); // 'like' | 'dislike' | null
  const feedbackOpen = Boolean(feedbackAnchorEl);
  const [copied, setCopied] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const hasPrompt = Boolean(prompt?.trim());

  const aspectRatio = dimension === '16:9' ? '16/9' : dimension === '9:16' ? '9/16' : '1/1';

  useEffect(() => {
    if (!isGenerating) {
      setLoadingTextIndex(0);
      return;
    }

    const intervalId = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1700);

    return () => clearInterval(intervalId);
  }, [isGenerating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Date header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: theme.palette.text.secondary }}>
            <Calendar size={12} strokeWidth={1.8} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', color: theme.palette.text.secondary }}>
              {date}
            </Typography>
          </Box>
        </Box>

        {/* Main content wrapper with rounded corners */}
        <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: SHADOWS.sidebar }}>
          {/* Main content: images grid (70%) + prompt/actions (30%) */}
          <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Images grid — dynamic columns based on dimension */}
          <Box sx={{ flex: 7 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: dimension === '16:9' || dimension === '4:3' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 1.25,
              }}
            >
              {isGenerating
                ? Array.from({ length: count }).map((_, i) => (
                    <GeneratingCard key={i} index={i} aspectRatio={aspectRatio} loadingText={loadingTexts[loadingTextIndex]} />
                  ))
                : images.map((img, i) => (
                    <GeneratedImageCard
                      key={i}
                      src={img}
                      alt={prompt}
                      index={i}
                      onAction={onAction}
                      selected={selectedImages.includes(img)}
                      onSelect={onSelect}
                      onPreview={(idx) => {
                        setPreviewIndex(idx);
                        setPreviewOpen(true);
                      }}
                      prompt={prompt}
                    />
                  ))}
            </Box>
          </Box>

          {/* Right panel: prompt, ref images, actions — 30% width */}
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Prompt + reference images + actions */}
            <Box
              sx={{
                px: 1.5,
                py: 1.5,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {/* Prompt text */}
              {hasPrompt && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Prompt
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '0.78rem',
                          fontWeight: 400,
                          color: 'text.secondary',
                          lineHeight: 1.65,
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 5,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {prompt}
                      </Typography>
                      <Tooltip title={copied ? "Copied!" : "Copy prompt"} arrow>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(prompt);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            sx={{
                              bgcolor: copied ? `${COLORS.primary}22` : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                              color: copied ? COLORS.primary : 'text.secondary',
                              flexShrink: 0,
                              p: 0.5,
                              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary' },
                            }}
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </IconButton>
                        </motion.div>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Reference images */}
              {referenceImages && referenceImages.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Reference Images
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {referenceImages.slice(0, 6).map((refImg, i) => (
                      <Tooltip title={`Reference image ${i + 1}`} arrow key={i}>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            component="img"
                            src={refImg}
                            alt={`Reference ${i + 1}`}
                            sx={{
                              width: 52,
                              height: 52,
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid',
                              borderColor: 'divider',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: COLORS.primaryAlpha[40],
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              },
                            }}
                          />
                        </motion.div>
                      </Tooltip>
                    ))}
                    {referenceImages.length > 6 && (
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          fontSize: '0.7rem',
                          color: 'text.disabled',
                          fontWeight: 600,
                        }}
                      >
                        +{referenceImages.length - 6}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Action buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  <Tooltip title="Download all" arrow>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                      <IconButton
                        size="small"
                        onClick={() => images.forEach(img => handleDownloadFile(img))}
                        sx={{
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          color: 'text.secondary',
                          p: 0.75,
                          '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary' },
                        }}
                      >
                        <Download size={16} />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                  <Tooltip title="Delete all" arrow>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                      <IconButton
                        size="small"
                        onClick={() => confirm('deleteAllImages', () => onAction?.('delete', images))}
                        sx={{
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          color: 'text.secondary',
                          p: 0.75,
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                  <Tooltip title="Reuse prompt and settings" arrow>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                      <IconButton
                        size="small"
                        onClick={() => onAction?.('reuse', { prompt, referenceImages })}
                        sx={{
                          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          color: 'text.secondary',
                          p: 0.75,
                          '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary' },
                        }}
                      >
                        <ArrowUp  size={16} />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                </Box>
              </Box>

              {/* Tags */}
              {!isGenerating && tags.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          bgcolor: isDark ? COLORS.gray200 : COLORS.gray200,
                          color: COLORS.gray500,
                          border: `1px solid ${COLORS.gray100}`,
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Feedback: How was this output? */}
              {!isGenerating && (
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    How was this output?
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {feedback ? (
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: feedback.type === 'like' ? COLORS.primary : '#ef4444' }}>
                        {feedback.label}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Tooltip title="Like" arrow>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setFeedbackType('like');
                                setFeedbackAnchorEl(e.currentTarget);
                              }}
                              sx={{
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                color: 'text.secondary',
                                p: 0.75,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                  color: 'text.primary',
                                },
                              }}
                            >
                              <ThumbsUp size={16} />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                        <Tooltip title="Dislike" arrow>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setFeedbackType('dislike');
                                setFeedbackAnchorEl(e.currentTarget);
                              }}
                              sx={{
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                color: 'text.secondary',
                                p: 0.75,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                },
                              }}
                            >
                              <ThumbsDown size={16} />
                            </IconButton>
                          </motion.div>
                        </Tooltip>
                      </Box>
                    )}
                    {feedback && (
                      <Tooltip title="Clear feedback" arrow>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.15 }}>
                          <IconButton
                            size="small"
                            onClick={() => setFeedback(null)}
                            sx={{
                              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              color: 'text.secondary',
                              p: 0.5,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                color: 'text.primary',
                              },
                            }}
                          >
                            <X size={12} />
                          </IconButton>
                        </motion.div>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}

              <Popover
                open={feedbackOpen}
                anchorEl={feedbackAnchorEl}
                onClose={() => {
                  setFeedbackAnchorEl(null);
                  setFeedbackType(null);
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    minWidth: 160,
                    p: 0.5,
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {feedbackType === 'like' && (
                    <>
                      <Typography sx={{ px: 1, py: 0.5, fontSize: '0.68rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Like
                      </Typography>
                      {['Excellent', 'Good', 'Amazing', 'Perfect'].map((label) => (
                        <Box
                          key={label}
                          onClick={() => {
                            setFeedback({ type: 'like', label });
                            setFeedbackAnchorEl(null);
                            setFeedbackType(null);
                          }}
                          sx={{
                            px: 1,
                            py: 1,
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.15s',
                            '&:hover': {
                              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                              color: 'text.primary',
                            },
                          }}
                        >
                          {label}
                        </Box>
                      ))}
                    </>
                  )}
                  {feedbackType === 'dislike' && (
                    <>
                      <Typography sx={{ px: 1, py: 0.5, fontSize: '0.68rem', fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Dislike
                      </Typography>
                      {['Poor', 'Bad', 'Needs improvement', 'Not good'].map((label) => (
                        <Box
                          key={label}
                          onClick={() => {
                            setFeedback({ type: 'dislike', label });
                            setFeedbackAnchorEl(null);
                            setFeedbackType(null);
                          }}
                          sx={{
                            px: 1,
                            py: 1,
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            transition: 'all 0.15s',
                            '&:hover': {
                              bgcolor: 'rgba(239, 68, 68, 0.08)',
                              color: '#ef4444',
                            },
                          }}
                        >
                          {label}
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Popover>
            </Box>
          </Box>
        </Box>
        </Box>

        <MediaPreviewModal
          items={images}
          open={previewOpen}
          startIndex={previewIndex}
          onClose={() => setPreviewOpen(false)}
        />
        <ConfirmationComponent />
      </Box>
    </motion.div>
  );
}

export default memo(GeneratedImageGroup);
