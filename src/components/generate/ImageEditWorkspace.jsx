"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Sparkles,
  Video,
  ArrowUpCircle,
  RotateCw,
  ChevronDown,
  Send,
} from "lucide-react";
import { COLORS, RADIUS, SHADOWS } from "@/theme/tokens";

export default function ImageEditWorkspace({
  images = [],
  selectedImage = null,
  prompt = "",
  onClose,
  onPromptChange,
  onUpscale,
  onVideoGenerate,
  onRemix,
  onGenerate,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentImage, setCurrentImage] = useState(selectedImage || images[0]);
  const [currentPrompt, setCurrentPrompt] = useState(prompt);
  const [previousPrompt, setPreviousPrompt] = useState(prompt);
  const centerPanelRef = useRef(null);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState("");

  const promptTemplates = [
    { 
      id: 1, 
      label: "Enhance Details", 
      prompt: "Enhance the details, improve sharpness, add more texture and clarity to the image",
      category: "Enhancement"
    },
    { 
      id: 2, 
      label: "Change Style", 
      prompt: "Change the artistic style to [style], transform the visual aesthetic while keeping the subject",
      category: "Style"
    },
    { 
      id: 3, 
      label: "Add Lighting", 
      prompt: "Add dramatic lighting, enhance shadows and highlights, improve overall illumination",
      category: "Lighting"
    },
    { 
      id: 4, 
      label: "Remove Background", 
      prompt: "Remove the background and replace with [background color or scene], keep the main subject",
      category: "Background"
    },
    { 
      id: 5, 
      label: "Color Correction", 
      prompt: "Adjust colors, fix white balance, enhance saturation and vibrancy",
      category: "Color"
    },
    { 
      id: 6, 
      label: "Add Elements", 
      prompt: "Add [elements] to the scene, blend naturally with existing composition",
      category: "Composition"
    },
    { 
      id: 7, 
      label: "Change Mood", 
      prompt: "Change the mood to [mood], adjust colors and lighting to match desired atmosphere",
      category: "Mood"
    },
    { 
      id: 8, 
      label: "Professional Retouch", 
      prompt: "Professional retouching, smooth skin, remove blemishes, enhance features naturally",
      category: "Retouching"
    },
  ];

  // Handle mouse wheel to change images
  useEffect(() => {
    const handleWheel = (e) => {
      if (!centerPanelRef.current) return;
      
      const currentIndex = images.indexOf(currentImage);
      if (currentIndex === -1) return;

      if (e.deltaY > 0) {
        // Scroll down - next image
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentImage(images[nextIndex]);
      } else {
        // Scroll up - previous image
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentImage(images[prevIndex]);
      }
    };

    const element = centerPanelRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: true });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, [currentImage, images]);

  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setCurrentPrompt(newPrompt);
    setPreviousPrompt(prompt); // Store original as previous
    onPromptChange?.(newPrompt);
  };

  const handleDropdownClick = (e) => {
    setDropdownAnchorEl(e.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  const handleSelectTemplate = (template) => {
    setCurrentPrompt(template.prompt);
    setPreviousPrompt(prompt);
    onPromptChange?.(template.prompt);
    handleDropdownClose();
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleGenerate = () => {
    onGenerate?.(currentPrompt, currentImage);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = currentImage;
    a.download = `generated-image-${Date.now()}.jpg`;
    a.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Generated Image",
        url: currentImage,
      });
    } else {
      navigator.clipboard.writeText(currentImage);
      alert("Image URL copied to clipboard");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: isDark ? "background.default" : "#f8fafc",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: isDark ? "background.paper" : "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onClose} sx={{ color: "text.primary" }}>
            <ArrowLeft size={20} />
          </IconButton>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "text.primary" }}>
            Image Editor
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel - Image Gallery */}
        <Box
          sx={{
            width: 280,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: isDark ? "background.paper" : "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Generated Images
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {images.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentImage(img)}
                sx={{
                  position: "relative",
                  borderRadius: RADIUS.md,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: currentImage === img ? "2px solid" : "2px solid",
                  borderColor: currentImage === img ? COLORS.primary : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: COLORS.primary,
                    transform: "scale(1.02)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Generated ${idx + 1}`}
                  sx={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                />
                {currentImage === img && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: COLORS.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#000" }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Center Panel - Preview */}
        <Box
          ref={centerPanelRef}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
            gap: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              borderRadius: RADIUS.lg,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              component="img"
              src={currentImage}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Prompt Input */}
          <Box
            sx={{
              bgcolor: isDark ? "background.paper" : "#ffffff",
              borderRadius: RADIUS.lg,
              border: "1.5px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.2s",
              "&:focus-within": {
                borderColor: COLORS.primary,
                boxShadow: isDark ? `0 4px 24px ${COLORS.primary}40` : `0 4px 24px ${COLORS.primary}30`,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2 }}>
              <Sparkles size={20} color={COLORS.primary} sx={{ mt: 0.5, flexShrink: 0 }} />
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={currentPrompt}
                onChange={handlePromptChange}
                placeholder="Describe what you want to change or enhance in this image..."
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: "0.95rem",
                    color: "text.primary",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  },
                }}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    padding: 0,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, borderTop: "1px solid", borderColor: "divider", bgcolor: isDark ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0.01)" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={handleDropdownClick}
                  size="small"
                  sx={{
                    borderRadius: RADIUS.sm,
                    bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
                    color: COLORS.primary,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 2,
                    py: 0.8,
                    "&:hover": {
                      bgcolor: isDark ? "rgba(115,103,240,0.12)" : "rgba(115,103,240,0.1)",
                    },
                  }}
                  endIcon={<ChevronDown size={14} />}
                >
                  Templates
                </Button>
              </Box>
              <Button
                onClick={handleGenerate}
                size="small"
                variant="contained"
                sx={{
                  borderRadius: RADIUS.md,
                  bgcolor: COLORS.primary,
                  color: "#000",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2.5,
                  py: 0.8,
                  minWidth: 120,
                  "&:hover": {
                    bgcolor: COLORS.primaryHover,
                  },
                }}
                endIcon={<Send size={16} />}
              >
                Generate
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Panel - Tools */}
        <Box
          sx={{
            width: 260,
            borderLeft: "1px solid",
            borderColor: "divider",
            bgcolor: isDark ? "background.paper" : "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Previous Prompt */}
          <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>
              Previous Prompt
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {previousPrompt || "No previous prompt"}
            </Typography>
          </Box>

          <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Tools
            </Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Upscale */}
            <Button
              onClick={onUpscale}
              startIcon={<ArrowUpCircle size={18} />}
              fullWidth
              sx={{
                py: 2,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
                color: COLORS.primary,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(115,103,240,0.12)" : "rgba(115,103,240,0.1)",
                },
              }}
            >
              Upscale
            </Button>

            {/* Video Generate */}
            <Button
              onClick={onVideoGenerate}
              startIcon={<Video size={18} />}
              fullWidth
              sx={{
                py: 2,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.06)",
                color: COLORS.cyan,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(34,211,238,0.12)" : "rgba(34,211,238,0.1)",
                },
              }}
            >
              Generate Video
            </Button>

            {/* Remix */}
            <Button
              onClick={onRemix}
              startIcon={<RotateCw size={18} />}
              fullWidth
              sx={{
                py: 2,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(236,72,153,0.08)" : "rgba(236,72,153,0.06)",
                color: COLORS.pink,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(236,72,153,0.12)" : "rgba(236,72,153,0.1)",
                },
              }}
            >
              Remix
            </Button>

            <Box sx={{ my: 1, borderBottom: "1px solid", borderColor: "divider" }} />

            {/* Download */}
            <Button
              onClick={handleDownload}
              startIcon={<Download size={18} />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                color: "text.primary",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              Download
            </Button>

            {/* Share */}
            <Button
              onClick={handleShare}
              startIcon={<Share2 size={18} />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                color: "text.primary",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              Share
            </Button>

            {/* Copy Prompt */}
            <Button
              onClick={handleCopyPrompt}
              startIcon={<Copy size={18} />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: RADIUS.md,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                color: "text.primary",
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              Copy Prompt
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Prompt Templates Dropdown */}
      <Menu
        anchorEl={dropdownAnchorEl}
        open={Boolean(dropdownAnchorEl)}
        onClose={handleDropdownClose}
        PaperProps={{
          sx: {
            borderRadius: RADIUS.md,
            bgcolor: isDark ? "background.paper" : "#ffffff",
            minWidth: 200,
            maxHeight: 300,
          },
        }}
      >
        {promptTemplates.map((template) => (
          <MenuItem
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            sx={{
              fontSize: "0.85rem",
              color: "text.primary",
              "&:hover": {
                bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
              },
            }}
          >
            {template.label}
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleModalOpen}
          sx={{
            fontSize: "0.85rem",
            color: COLORS.primary,
            fontWeight: 600,
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 0.5,
            pt: 1.5,
            "&:hover": {
              bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
            },
          }}
        >
          More Templates...
        </MenuItem>
      </Menu>

      {/* Prompt Templates Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: RADIUS.lg,
            bgcolor: isDark ? "background.paper" : "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: 700, color: "text.primary", pb: 1 }}>
          Image Editing Templates
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mb: 2 }}>
            Select a template to get started, then customize it to your needs
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { category: "Enhancement", templates: promptTemplates.filter(t => t.category === "Enhancement") },
              { category: "Style & Mood", templates: promptTemplates.filter(t => t.category === "Style" || t.category === "Mood") },
              { category: "Lighting & Color", templates: promptTemplates.filter(t => t.category === "Lighting" || t.category === "Color") },
              { category: "Composition", templates: promptTemplates.filter(t => t.category === "Background" || t.category === "Composition") },
              { category: "Retouching", templates: promptTemplates.filter(t => t.category === "Retouching") },
            ].map((group) => (
              group.templates.length > 0 && (
                <Box key={group.category}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>
                    {group.category}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
                    {group.templates.map((template) => (
                      <Box
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        sx={{
                          p: 1.5,
                          borderRadius: RADIUS.md,
                          border: "1.5px solid",
                          borderColor: "divider",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                          "&:hover": {
                            borderColor: COLORS.primary,
                            bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
                            transform: "translateY(-2px)",
                            boxShadow: isDark ? "0 4px 12px rgba(115,103,240,0.15)" : "0 4px 12px rgba(115,103,240,0.1)",
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                          {template.label}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.4 }}>
                          {template.prompt}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button
            onClick={handleModalClose}
            sx={{
              borderRadius: RADIUS.md,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
