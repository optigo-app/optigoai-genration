"use client";

import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X } from "lucide-react";
import { COLORS, palette } from "@/theme/tokens";

export default function ImageGuidanceCard({ guidanceType = "image", onClose, onOpenSelectMedia }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const p = palette(isDark);
  const isVideoMode = guidanceType === "video";

  const title = isVideoMode ? "Video Guidance" : "Image Guidance";
  const heading = isVideoMode ? "Video Reference" : "Image Reference";
  const description = isVideoMode
    ? "References the subject, motion style, framing, and visual tone of media to influence generated video output."
    : "References the visual style and composition of an image to influence the output.";

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: 420 },
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
      <CardContent sx={{ p: 2.2}}>
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

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Images */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={isVideoMode
                ? "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43"
                : "https://images.unsplash.com/photo-1607746882042-944635dfe10e"}
              sx={{
                width: 88,
                height: 88,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />

            <Box
              sx={{
                position: "relative",
                width: 88,
                height: 88,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={isVideoMode
                  ? "https://images.unsplash.com/photo-1516570161787-2fd917215a3d"
                  : "https://images.unsplash.com/photo-1544005313-94ddf0286df2"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Red highlight */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 22,
                  height: 22,
                  border: `3px solid ${COLORS.red}`,
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Box>

          {/* Text */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 15,
                mb: 0.5,
              }}
            >
              {heading}
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: p.textSecondary,
                lineHeight: 1.55,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={onOpenSelectMedia}
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
          Select Media
        </Button>
      </CardContent>
    </Card>
  );
}