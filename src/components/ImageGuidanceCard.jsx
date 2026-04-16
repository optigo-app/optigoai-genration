"use client";

import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { UploadCloud, X, Image as ImageIcon, Images } from "lucide-react";
import { COLORS, palette } from "@/theme/tokens";

function isVideoSource(src = "") {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(src) || src.includes('/videos/');
}

export default function ImageGuidanceCard({ guidanceType = "image", uploadedMedia = [], onClose, onOpenSelectMedia, onContinue, imageUploadMode = "single", onImageUploadModeChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const p = palette(isDark);

  // Determine guidance content based on mode
  let title, description, uploadSteps;

  if (guidanceType === "sketch") {
    title = "Sketch Guidance";
    description = "Upload a single sketch image to convert into a realistic render.";
    uploadSteps = [
      { label: "Upload Sketch Image", hint: "Your jewelry sketch or design" },
    ];
  } else if (guidanceType === "video") {
    title = "Video Guidance";
    description = "Upload reference images in order for accurate video generation.";
    uploadSteps = [
      { label: "1. Upload Jewelry Image", hint: "Primary product/object image" },
      { label: "2. Upload Model Image", hint: "Model wearing jewelry reference" },
    ];
  } else {
    // image mode
    title = "Image Guidance";
    
    if (imageUploadMode === "single") {
      description = "Upload jewelry and model images for AI generation.";
      uploadSteps = [
        { label: "1. Jewelry Image", hint: "Product or jewelry piece" },
        { label: "2. Model Image", hint: "Model reference (optional)" },
      ];
    } else {
      // multi mode
      description = "Upload a model image and multiple jewelry pieces to generate model wearing all items.";
      uploadSteps = [
        { label: "Model Image", hint: "Model photo (required)" },
        { label: "Ring Images", hint: "Ring products" },
        { label: "Necklace Images", hint: "Necklace products" },
        { label: "Bangle Images", hint: "Bangle products" },
        { label: "Earring Images", hint: "Earring products" },
        { label: "Other Jewelry", hint: "Additional items" },
      ];
    }
  }

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: guidanceType === "image" && imageUploadMode === "multi" ? 560 : 420 },
        maxWidth: "calc(100vw - 32px)",
        background: isDark
          ? "linear-gradient(180deg,#1c1c1c 0%,#111 100%)"
          : "linear-gradient(180deg,#ffffff 0%,#f7f8ff 100%)",
        color: p.text,
        border: "1px solid",
        borderColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(17,24,39,0.08)",
        boxShadow: isDark
          ? "0 8px 30px rgba(0,0,0,0.6)"
          : "0 8px 28px rgba(31,41,55,0.18)",
      }}
    >
      <CardContent sx={{ p: guidanceType === "image" && imageUploadMode === "multi" ? 2 : 2.2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.8,
          }}
        >
          <Typography fontSize={16} fontWeight={600}>
            {title}
          </Typography>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: p.textSecondary,
              p: 0.5,
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>

        <Box sx={{ mb: 0.8 }}>
          <Typography sx={{ fontSize: 13, color: p.textSecondary, lineHeight: 1.55 }}>
            {description}
          </Typography>
        </Box>

        {/* Toggle for single/multi mode (only in image mode) */}
        {guidanceType === "image" && (
          <Box sx={{ mb: 1.2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.8 }}>
            <ToggleButtonGroup
              value={imageUploadMode}
              exclusive
              onChange={(e, newMode) => newMode && onImageUploadModeChange?.(newMode)}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(17,24,39,0.03)",
                borderRadius: 1.5,
                p: 0.4,
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: 1.2,
                  px: 2,
                  py: 0.6,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: p.textSecondary,
                  "&.Mui-selected": {
                    bgcolor: COLORS.primary,
                    color: "#000",
                    "&:hover": {
                      bgcolor: COLORS.primaryHover,
                    },
                  },
                  "&:hover": {
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(17,24,39,0.05)",
                  },
                },
              }}
            >
              <ToggleButton value="single">
                <ImageIcon size={14} style={{ marginRight: 6 }} />
                Single Product
              </ToggleButton>
              <ToggleButton value="multi">
                <Images size={14} style={{ marginRight: 6 }} />
                Multi Jewelry
              </ToggleButton>
            </ToggleButtonGroup>
            
            {imageUploadMode === "multi" && (
              <Typography sx={{ fontSize: 11, color: p.textSecondary, textAlign: "center", fontStyle: "italic", opacity: 0.8 }}>
                Click each category to upload multiple images
              </Typography>
            )}
          </Box>
        )}

        <Box 
          sx={{ 
            mt: 1.8, 
            display: "grid",
            gridTemplateColumns: guidanceType === "image" && imageUploadMode === "multi" ? "1fr 1fr" : "1fr",
            gap: 0.9,
          }}
        >
          {uploadSteps.map((step, index) => (
            <Box
              key={step.label}
              onClick={() => onOpenSelectMedia?.(index)}
              sx={{
                gridColumn: guidanceType === "image" && imageUploadMode === "multi" && index === 0 ? "1 / -1" : "auto",
                border: "1px dashed",
                borderColor: uploadedMedia[index]
                  ? COLORS.primary
                  : isDark
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(17,24,39,0.2)",
                bgcolor: uploadedMedia[index]
                  ? (isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)")
                  : (isDark ? "rgba(255,255,255,0.02)" : "rgba(17,24,39,0.02)"),
                borderRadius: 2,
                px: 1.2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: COLORS.primary,
                  bgcolor: isDark ? "rgba(115,103,240,0.08)" : "rgba(115,103,240,0.06)",
                },
              }}
            >
              <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    border: "1.5px dashed",
                    borderColor: uploadedMedia[index]
                      ? COLORS.primary
                      : isDark
                        ? "rgba(255,255,255,0.24)"
                        : "rgba(17,24,39,0.24)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(17,24,39,0.03)",
                  }}
                >
                  {uploadedMedia[index]?.url ? (
                    isVideoSource(uploadedMedia[index].url) ? (
                      <Box component="video" src={uploadedMedia[index].url} muted playsInline sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <Box component="img" src={uploadedMedia[index].url} alt={uploadedMedia[index].name || step.label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )
                  ) : (
                    <UploadCloud size={18} color={isDark ? "#b9bfd1" : "#6b7280"} />
                  )}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: p.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {step.label}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: p.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {uploadedMedia[index]?.name || step.hint}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: uploadedMedia[index] ? COLORS.primary : "transparent",
                  border: "1.5px solid",
                  borderColor: uploadedMedia[index] ? COLORS.primary : isDark ? "rgba(255,255,255,0.25)" : "rgba(17,24,39,0.25)",
                  flexShrink: 0,
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={onContinue}
          sx={{
            mt: 2.2,
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            background: COLORS.gradientPrimary,
            color: "#fff",

            "&:hover": {
              background: COLORS.gradientDeep,
            },
          }}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}