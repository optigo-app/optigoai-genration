"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  ChevronLeft,
  MousePointer2,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { COLORS, RADIUS, SHADOWS, palette } from "@/theme/tokens";
import {
  PREMADE_MODELS,
  PREMADE_CATEGORIES
} from "@/data/premadeModels";
import { motion, AnimatePresence } from "framer-motion";

function isVideoSource(src = "") {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

export default function ImageGuidanceCard({
  guidanceType = "image",
  uploadedMedia = [],
  onClose,
  onOpenSelectMedia,
  onContinue,
  onFilesDrop,
  onUpdateMediaCategory,
  onRemoveMediaCategory,
  onDeleteMedia,
  onClearAllMedia,
  imageUploadMode = "single",
  onImageUploadModeChange,
  onPremadeModelSelect
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const p = palette(isDark);

  const [isDragging, setIsDragging] = useState(false);
  const [showModelGallery, setShowModelGallery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("bridal");
  const bulkInputRef = useRef(null);

  const filteredModels = PREMADE_MODELS.filter(m => m.category === selectedCategory);

  let title = "Reference Studio";
  let description = "Curate your generation references";

  if (guidanceType === "sketch") title = "Sketch Studio";
  else if (guidanceType === "video") title = "Video Reference Studio";

  const uploadSteps = guidanceType === "sketch"
    ? [{ label: "Sketch", hint: "Main design", id: "sketch" }]
    : guidanceType === "video"
      ? [{ label: "Jewelry", hint: "Main product", id: "jewelry" }, { label: "Model", hint: "Reference person", id: "model" }]
      : imageUploadMode === "single"
        ? [{ label: "Jewelry", hint: "Primary item", id: "jewelry" }, { label: "Model", hint: "Optional person", id: "model" }]
        : [
          { label: "Model", hint: "Required", id: "model" },
          { label: "Ring", hint: "Products", id: "ring" },
          { label: "Necklace", hint: "Products", id: "necklace" },
          { label: "Bangle", hint: "Products", id: "bangle" },
          { label: "Earring", hint: "Products", id: "earring" },
          { label: "Other", hint: "Addons", id: "other" },
        ];

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.types.includes("Files")) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFilesDrop?.(files);
      }
    }
  };

  const onSlotDrop = (e, targetCategory) => {
    e.preventDefault();
    const mediaId = e.dataTransfer.getData("mediaId");
    if (mediaId && onUpdateMediaCategory) {
      onUpdateMediaCategory(mediaId, targetCategory);
    }
  };

  const onPoolDragStart = (e, mediaId) => {
    e.dataTransfer.setData("mediaId", mediaId);
  };

  const renderMediaPool = () => {
    const unboundMedia = uploadedMedia.filter(m => !uploadSteps.some(step => step.id === m.category));

    return (
      <Box sx={{ px: 2, pt: 0.5, pb: 0 }}>
        {uploadedMedia.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: p.textSecondary, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>
              Studio Media Pool ({unboundMedia.length})
            </Typography>
            <Button
              size="small"
              variant="text"
              startIcon={<Trash2 size={14} />}
              onClick={onClearAllMedia}
              sx={{
                color: "#ef4444", fontSize: "0.7rem", fontWeight: 700,
                textTransform: "none", py: 0, px: 1,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" }
              }}
            >
              Clear All
            </Button>
          </Box>
        )}

        <Box sx={{
          display: "flex", gap: 1.5, overflowX: "auto", py: 1,
          scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }
        }}>
          {unboundMedia.length === 0 ? (
            <Box sx={{
              flex: 1, height: 80, borderRadius: 3, border: "1px dashed",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: p.textSecondary, fontSize: "0.8rem", bgcolor: isDark ? "rgba(255,255,255,0.01)" : "transparent"
            }}>
              {uploadedMedia.length > 0
                ? "All images are assigned to slots. Add more to the pool."
                : "No images uploaded yet. Drop them here to start."}
            </Box>
          ) : (
            unboundMedia.map((media) => (
              <Box
                key={media.id}
                sx={{ position: "relative", flexShrink: 0 }}
              >
                <Box
                  draggable
                  onDragStart={(e) => onPoolDragStart(e, media.id)}
                  sx={{
                    width: 80, height: 80, borderRadius: 2.5, overflow: "hidden",
                    cursor: "grab", border: "2px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    boxShadow: "none",
                    "&:active": { cursor: "grabbing" },
                    transition: "all 0.2s"
                  }}
                >
                  <img src={media.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onDeleteMedia?.(media.id); }}
                  sx={{
                    position: "absolute", top: -8, right: -8, width: 22, height: 22,
                    bgcolor: isDark ? "#111" : "#fff",
                    border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
                    color: COLORS.primary, p: 0, zIndex: 10,
                    "&:hover": { bgcolor: "#ef4444", color: "#fff", borderColor: "#ef4444" }
                  }}
                >
                  <X size={14} />
                </IconButton>
              </Box>
            ))
          )}
        </Box>
      </Box>
    );
  };

  const renderGallery = () => (
    <Box sx={{ display: "flex", height: 600, animation: "fadeIn 0.4s" }}>
      {/* Sidebar */}
      <Box sx={{
        width: 180,
        borderRight: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(10px)"
      }}>
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: p.textSecondary, mb: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Reference Library
        </Typography>
        {PREMADE_CATEGORIES.map((cat) => (
          <Box
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: RADIUS.md,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              color: selectedCategory === cat.id ? COLORS.primary : p.textSecondary,
              bgcolor: selectedCategory === cat.id ? COLORS.primaryAlpha[10] : "transparent",
              "&:hover": {
                bgcolor: COLORS.primaryAlpha[5],
                color: COLORS.primary,
                transform: "translateX(4px)"
              }
            }}
          >
            {cat.label}
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflowY: "auto", position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton size="small" onClick={() => setShowModelGallery(false)} sx={{ color: p.textSecondary, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
              <ChevronLeft size={20} />
            </IconButton>
            <Typography fontSize={18} fontWeight={800}>{PREMADE_CATEGORIES.find(c => c.id === selectedCategory)?.label} Collection</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: p.textSecondary, fontWeight: 500 }}>{filteredModels.length} Premium Samples</Typography>
        </Box>

        <Grid container spacing={2}>
          {filteredModels.map((model) => (
            <Grid key={model.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                onClick={() => {
                  onPremadeModelSelect?.(model);
                  setShowModelGallery(false);
                }}
                sx={{
                  aspectRatio: "3/4", borderRadius: 3, overflow: "hidden", cursor: "pointer", position: "relative",
                  border: "2px solid", borderColor: "transparent", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.03) translateY(-4px)",
                    borderColor: COLORS.primary,
                    boxShadow: `0 12px 30px ${COLORS.primaryAlpha[25]}`
                  }
                }}
              >
                <Box component="img" src={model.url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <Box sx={{
                  position: "absolute", bottom: 0, left: 0, right: 0, p: 1.5,
                  background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                  backdropFilter: "blur(2px)"
                }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700, textAlign: "center", letterSpacing: 0.5 }}>{model.name}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  const renderSlots = () => (
    <Box>
      {renderMediaPool()}

      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => bulkInputRef.current?.click()}
              sx={{
                height: "100%",
                minHeight: 260,
                borderRadius: 5,
                border: "2px dashed",
                borderColor: isDragging ? COLORS.primary : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                bgcolor: isDragging ? COLORS.primaryAlpha[10] : isDark ? "rgba(255,255,255,0.01)" : "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
                cursor: "pointer", transition: "all 0.3s ease", p: 3,
                "&:hover": {
                  borderColor: COLORS.primary,
                  bgcolor: COLORS.primaryAlpha[5],
                  transform: "translateY(-2px)"
                }
              }}
            >
              <input
                type="file"
                ref={bulkInputRef}
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    onFilesDrop?.(e.target.files);
                    e.target.value = ''; // Reset for same-file re-selection
                  }
                }}
              />
              <Box sx={{
                width: 72, height: 72, borderRadius: "50%",
                bgcolor: isDragging ? COLORS.primary : COLORS.primaryAlpha[10],
                display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5,
                transition: "all 0.3s"
              }}>
                <UploadCloud size={36} color={isDragging ? "#fff" : COLORS.primary} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>Bulk Collection</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: p.textSecondary, mt: 1 }}>
                Drag your jewelry references here to populate the pool
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{
              maxHeight: 450, overflowY: "auto", pr: 1.5,
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: 10 }
            }}>
              <Grid container spacing={2}>
                {uploadSteps.map((step, index) => {
                  const media = uploadedMedia.find(m => m && m.category === step.id);
                  const isModel = step.id === 'model';
                  return (
                    <Grid key={step.id} size={{ xs: 12, md: 6 }}>
                      <Box
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.primary; }}
                        onDragLeave={(e) => { e.currentTarget.style.borderColor = media ? COLORS.primaryAlpha[40] : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"; }}
                        onDrop={(e) => {
                          e.currentTarget.style.borderColor = media ? COLORS.primaryAlpha[40] : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
                          onSlotDrop(e, step.id);
                        }}
                        sx={{
                          display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: 3,
                          border: "1px solid",
                          borderColor: media ? COLORS.primaryAlpha[40] : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                          bgcolor: media ? COLORS.primaryAlpha[5] : "transparent", transition: "all 0.25s",
                          "&:hover": { borderColor: COLORS.primaryAlpha[60] }
                        }}
                      >
                        <Box sx={{
                          width: 64, height: 64, borderRadius: 2, overflow: "hidden",
                          border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                          cursor: isModel ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center",
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"
                        }} onClick={() => isModel && onOpenSelectMedia?.(index)}>
                          {media ? <img src={media.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={28} color={p.textSecondary} />}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontSize={14} fontWeight={900}>{step.label}</Typography>
                          <Typography fontSize={12} color={p.textSecondary} noWrap>{media?.name || `Drag & Bind ${step.label}`}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {isModel && (
                            <Tooltip title="Gallery Mode">
                              <IconButton size="small" onClick={() => setShowModelGallery(true)} sx={{ bgcolor: COLORS.primaryAlpha[15], color: COLORS.primary, p: 1, borderRadius: 2, "&:hover": { bgcolor: COLORS.primaryAlpha[25] } }}>
                                <MousePointer2 size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {media ? (
                            <Tooltip title="Unbind Image">
                              <IconButton size="small" onClick={() => onRemoveMediaCategory?.(media.id)} sx={{ bgcolor: "rgba(239, 68, 68, 0.08)", color: "#ef4444", p: 1, borderRadius: 2 }}>
                                <X size={16} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Local Upload">
                              <IconButton size="small" onClick={() => onOpenSelectMedia?.(index)} sx={{ bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", p: 1, borderRadius: 2 }}>
                                <FolderPlus size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "90vh",
        background: "transparent",
        color: p.text,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        pb: 2,
        borderBottom: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: -0.5 }}>{title}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: p.textSecondary, mt: -0.2 }}>{description}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {guidanceType === "image" && !showModelGallery && (
            <ToggleButtonGroup
              value={imageUploadMode}
              exclusive
              onChange={(e, newMode) => newMode && onImageUploadModeChange?.(newMode)}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
                p: 0.5, borderRadius: 3,
                "& .MuiToggleButton-root": {
                  border: "none", px: 2, py: 0.6, borderRadius: 2.5, fontSize: "0.75rem", fontWeight: 700,
                  "&.Mui-selected": { bgcolor: COLORS.primary, color: "#000" }
                }
              }}
            >
              <ToggleButton value="single">Single</ToggleButton>
              <ToggleButton value="multi">Batch Mode</ToggleButton>
            </ToggleButtonGroup>
          )}

          <IconButton
            onClick={onClose}
            size="medium"
            sx={{
              color: p.textSecondary,
              bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
            }}
          >
            <X size={24} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Body */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" }
      }}>
        {showModelGallery ? renderGallery() : renderSlots()}
      </Box>

      {/* Footer Actions */}
      <Box sx={{
        p: 2.5,
        display: "flex",
        justifyContent: "flex-end",
        gap: 1.5,
        borderTop: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        bgcolor: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
        backdropFilter: "blur(20px)"
      }}>
        <Button
          onClick={onClose}
          sx={{
            px: 3,
            py: 1.2,
            minWidth: 110,
            borderRadius: 2.5,
            fontWeight: 600,
            textTransform: "none",
            color: p.textSecondary,
            fontSize: "0.95rem",
            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onContinue}
          sx={{
            px: 4,
            py: 1.2,
            minWidth: 180,
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: "none",
            background: COLORS.gradientPrimary,
            color: "#fff",
            fontSize: "1rem",
            boxShadow: `0 10px 30px ${COLORS.primaryAlpha[30]}`,
            "&:hover": { background: COLORS.gradientDeep, transform: "scale(1.02)" }
          }}
        >
          Deploy Reference Studio
        </Button>
      </Box>
    </Box>
  );
}