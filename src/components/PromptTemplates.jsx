"use client";

import { useState, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Switch,
    FormControlLabel,
    Typography,
    Box,
    TextField,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    alpha,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import {
    Sparkles,
    Copy,
    X,
    ChevronDown,
    Gem,
    SlidersHorizontal,
    Palette,
    Camera,
    Lightbulb,
    CheckCircle,
    RefreshCw,
    Expand,
    RefreshCcw,
    LocateFixed
} from "lucide-react";

// ─── Luxury Gold Theme ───────────────────────────────────────────────────────
const luxuryTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#B8963E", light: "#D4AF6A", dark: "#8B6914" },
        secondary: { main: "#2C2C2A", light: "#444441", dark: "#1a1a18" },
        background: { default: "#FAFAF8", paper: "#FFFFFF" },
        text: { primary: "#1a1a18", secondary: "#5F5E5A" },
    },
    typography: {
        fontFamily: '"Cormorant Garamond", "Georgia", serif',
        h5: { fontWeight: 600, letterSpacing: "0.04em" },
        h6: { fontWeight: 600, letterSpacing: "0.03em" },
        subtitle2: {
            fontFamily: '"Montserrat", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
        },
        body2: {
            fontFamily: '"Montserrat", sans-serif',
            fontSize: "0.8rem",
        },
        caption: {
            fontFamily: '"Montserrat", sans-serif',
            fontSize: "0.72rem",
        },
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    backgroundImage: "none",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:before": { display: "none" },
                    "&.Mui-expanded": { margin: 0 },
                    border: "0.5px solid #E8E4DA",
                    borderRadius: "8px !important",
                    marginBottom: 8,
                    overflow: "hidden",
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 44,
                    "&.Mui-expanded": { minHeight: 44 },
                    backgroundColor: "#FAFAF8",
                    "&:hover": { backgroundColor: "#F5EDD6" },
                },
                content: { margin: "10px 0", "&.Mui-expanded": { margin: "10px 0" } },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: { borderRadius: 8, fontSize: "0.82rem" },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: "none", fontFamily: '"Montserrat", sans-serif', fontWeight: 600, letterSpacing: "0.06em" },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontFamily: '"Montserrat", sans-serif', fontSize: "0.72rem", fontWeight: 600 },
            },
        },
    },
});

// ─── Config Options ───────────────────────────────────────────────────────────
const OPTIONS = {
    jewelryType: ["Solitaire Ring", "Engagement Ring", "Cocktail Ring", "Pendant Necklace", "Tennis Necklace", "Drop Earrings", "Stud Earrings", "Bangle Bracelet", "Brooch", "Tennis Bracelet"],
    metal: ["18k Yellow Gold", "18k White Gold", "18k Rose Gold", "Platinum 950", "Sterling Silver", "Palladium", "Two-tone Gold"],
    finish: ["High Polish", "Brushed Satin", "Hammered Texture", "Matte", "Florentine Engraved"],
    stone: ["Round Brilliant Diamond", "Princess Cut Diamond", "Oval Diamond", "Emerald Cut Diamond", "Pear Diamond", "Cushion Diamond", "Ruby", "Sapphire", "Emerald", "Tanzanite", "Morganite", "Pearl"],
    clarity: ["FL (Flawless)", "IF (Internally Flawless)", "VVS1", "VVS2", "VS1", "VS2"],
    colorGrade: ["D", "E", "F", "G", "H", "I"],
    setting: ["Prong / Claw (6-prong)", "Bezel Set", "Pavé", "Channel Set", "Tension Set", "Flush / Gypsy Set", "Cathedral"],
    style: ["Contemporary Minimalist", "Art Deco", "Victorian Vintage", "Mid-Century Modern", "Baroque Ornate", "Futuristic / Avant-garde", "Romantic Floral"],
    renderer: ["Photorealistic CGI", "Studio Product Shot", "Octane Render", "V-Ray Hyperreal", "Watercolor Editorial"],
    quality: ["4K", "8K", "16K"],
    lighting: ["Three-point Studio", "Rim / Backlit Halo", "Natural Window Light", "Dramatic Chiaroscuro", "Overhead Soft Box"],
    background: ["Pure White Seamless", "Black Velvet", "Marble Surface", "Bokeh Gold Dust", "Jewel-toned Silk"],
    camera: ["45° Beauty Shot", "Bird's Eye Overhead", "Macro Close-up", "Side Profile", "Worm's Eye Dramatic"],
};

const PRESETS = {
    "Luxury Solitaire Ring": {
        jewelryType: "Solitaire Ring", metal: "18k Yellow Gold", finish: "High Polish",
        stone: "Round Brilliant Diamond", clarity: "FL (Flawless)", colorGrade: "D",
        setting: "Prong / Claw (6-prong)", style: "Contemporary Minimalist",
        renderer: "Photorealistic CGI", quality: "8K", lighting: "Three-point Studio",
        background: "Pure White Seamless", camera: "45° Beauty Shot",
        carat: 1.5, halo: true, milgrain: false, filigree: false,
        rotation360: true, depthOfField: true, causticIntensity: 65, intricacy: 7,
    },
    "Vintage Pearl Necklace": {
        jewelryType: "Pendant Necklace", metal: "18k White Gold", finish: "Brushed Satin",
        stone: "Pearl", clarity: "IF (Internally Flawless)", colorGrade: "F",
        setting: "Bezel Set", style: "Victorian Vintage",
        renderer: "Studio Product Shot", quality: "8K", lighting: "Natural Window Light",
        background: "Jewel-toned Silk", camera: "Bird's Eye Overhead",
        carat: 0.8, halo: false, milgrain: true, filigree: true,
        rotation360: false, depthOfField: true, causticIntensity: 40, intricacy: 9,
    },
    "Diamond Drop Earrings": {
        jewelryType: "Drop Earrings", metal: "Platinum 950", finish: "High Polish",
        stone: "Round Brilliant Diamond", clarity: "VVS1", colorGrade: "E",
        setting: "Pavé", style: "Art Deco",
        renderer: "Octane Render", quality: "8K", lighting: "Rim / Backlit Halo",
        background: "Black Velvet", camera: "45° Beauty Shot",
        carat: 1.2, halo: false, milgrain: false, filigree: false,
        rotation360: true, depthOfField: true, causticIntensity: 80, intricacy: 8,
    },
};

// ─── Prompt Generator ─────────────────────────────────────────────────────────
function buildPrompt(cfg) {
    const parts = [
        `A stunning ${cfg.jewelryType} crafted in ${cfg.metal} with ${cfg.finish.toLowerCase()} finish`,
        cfg.milgrain ? "featuring elegant milgrain detailing" : null,
        cfg.filigree ? "with intricate filigree engraving" : null,
        `showcasing a ${cfg.carat.toFixed(1)} carat ${cfg.stone}`,
        `(${cfg.clarity} clarity, color grade ${cfg.colorGrade})`,
        `set in ${cfg.setting.toLowerCase()}`,
        cfg.halo ? "with a brilliant double diamond halo" : null,
        `${cfg.style.toLowerCase()} aesthetic design with intricacy level ${cfg.intricacy}/10`,
        `rendered as ${cfg.renderer.toLowerCase()} in ${cfg.quality} resolution`,
        `${cfg.lighting.toLowerCase()} lighting with ${cfg.causticIntensity}% caustic light reflections`,
        `${cfg.background.toLowerCase()} background`,
        `shot from ${cfg.camera.toLowerCase()} angle`,
        cfg.rotation360 ? "with slow 360° rotation" : null,
        cfg.depthOfField ? "cinematic depth-of-field blur" : null,
        "ultra-detailed, luxury jewelry photography, commercial product shot",
    ].filter(Boolean);
    return parts.join(", ");
}

// ─── Section Icon Map ─────────────────────────────────────────────────────────
const SECTION_ICONS = {
    "Jewelry Type": <Gem size={16} />,
    "Metal & Finish": <Palette size={16} />,
    "Gemstone Details": <Gem size={16} />,
    "Stone Setting": <SlidersHorizontal size={16} />,
    "Design Style": <SlidersHorizontal size={16} />,
    "Rendering": <Camera size={16} />,
    "Lighting & Background": <Lightbulb size={16} />,
    "Camera & Motion": <Camera size={16} />,
};

// ─── Gold Slider Styling ──────────────────────────────────────────────────────
const goldSliderSx = {
    color: "#B8963E",
    "& .MuiSlider-thumb": { width: 16, height: 16, backgroundColor: "#B8963E", border: "2px solid white", boxShadow: "0 2px 6px rgba(184,150,62,0.4)" },
    "& .MuiSlider-rail": { backgroundColor: "#E8E4DA" },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JewelryPromptBuilder({ open, onClose, onApply, initialPrompt = '' }) {
    const [cfg, setCfg] = useState({
        jewelryType: "Solitaire Ring", metal: "18k Yellow Gold", finish: "High Polish",
        stone: "Round Brilliant Diamond", clarity: "FL (Flawless)", colorGrade: "D",
        setting: "Prong / Claw (6-prong)", style: "Contemporary Minimalist",
        renderer: "Photorealistic CGI", quality: "8K", lighting: "Three-point Studio",
        background: "Pure White Seamless", camera: "45° Beauty Shot",
        carat: 1.5, halo: true, milgrain: false, filigree: false,
        rotation360: true, depthOfField: true, causticIntensity: 65, intricacy: 7,
    });

    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [promptText, setPromptText] = useState(() => buildPrompt({
        jewelryType: "Solitaire Ring", metal: "18k Yellow Gold", finish: "High Polish",
        stone: "Round Brilliant Diamond", clarity: "FL (Flawless)", colorGrade: "D",
        setting: "Prong / Claw (6-prong)", style: "Contemporary Minimalist",
        renderer: "Photorealistic CGI", quality: "8K", lighting: "Three-point Studio",
        background: "Pure White Seamless", camera: "45° Beauty Shot",
        carat: 1.5, halo: true, milgrain: false, filigree: false,
        rotation360: true, depthOfField: true, causticIntensity: 65, intricacy: 7,
    }));

    const update = useCallback((key, value) => {
        setCfg(prev => {
            const next = { ...prev, [key]: value };
            setPromptText(buildPrompt(next));
            return next;
        });
    }, []);

    const applyPreset = (name) => {
        const p = PRESETS[name];
        setCfg(p);
        setPromptText(buildPrompt(p));
    };

    const handleGenerate = async () => {
        setGenerating(true);
        // Simulate API call — replace with your actual generation endpoint
        await new Promise(r => setTimeout(r, 2000));
        setGenerating(false);
        // onGenerate(promptText); // call your handler here
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const GOLD = "#B8963E";
    const GOLD_PALE = "#F5EDD6";
    const BORDER = "#E8E4DA";

    const SectionLabel = ({ children }) => (
        <Typography variant="subtitle2" sx={{ color: GOLD, mb: 1.5, display: "flex", alignItems: "center", gap: 0.75 }}>
            {SECTION_ICONS[children]}
            {children}
        </Typography>
    );

    const FieldLabel = ({ children }) => (
        <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5, display: "block", fontFamily: '"Montserrat", sans-serif', letterSpacing: "0.05em" }}>
            {children}
        </Typography>
    );

    return (
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        maxHeight: "92vh",
                        background: "#FAFAF8",
                        border: `0.5px solid ${BORDER}`,
                    },
                }}
            >
                {/* ── Title Bar ── */}
                <DialogTitle
                    sx={{
                        background: "white",
                        borderBottom: `0.5px solid ${BORDER}`,
                        px: 3, py: 1.75,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 32, height: 32, borderRadius: "8px",
                                background: `linear-gradient(135deg, ${GOLD} 0%, #D4AF6A 100%)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <Gem size={16} color="white" />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ color: "text.primary", lineHeight: 1.1, fontSize: "1.15rem" }}>
                                Lumière · AI Jewelry Prompt Builder
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: "0.06em" }}>
                                Configure parameters → Generate prompt → Create image
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            label="Pro"
                            size="small"
                            sx={{ bgcolor: GOLD_PALE, color: GOLD, fontWeight: 600, fontSize: "0.7rem", height: 22 }}
                        />
                        {onClose && (
                            <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary", ml: 0.5 }}>
                                <X size={16} />
                            </IconButton>
                        )}
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 0, display: "flex", overflow: "hidden", height: "calc(92vh - 130px)" }}>
                    <Grid container sx={{ height: "100%" }}>

                        {/* ── LEFT: Config Panel ── */}
                        <Grid
                            item xs={12} md={7}
                            sx={{
                                borderRight: `0.5px solid ${BORDER}`,
                                overflowY: "auto",
                                p: 2.5,
                                "&::-webkit-scrollbar": { width: 4 },
                                "&::-webkit-scrollbar-thumb": { background: BORDER, borderRadius: 2 },
                            }}
                        >
                            {/* Presets */}
                            <Box sx={{ mb: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                                    Quick Presets
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {Object.keys(PRESETS).map((name) => (
                                        <Chip
                                            key={name}
                                            label={name}
                                            onClick={() => applyPreset(name)}
                                            variant={cfg.jewelryType === PRESETS[name].jewelryType && cfg.stone === PRESETS[name].stone ? "filled" : "outlined"}
                                            sx={{
                                                cursor: "pointer",
                                                fontSize: "0.72rem",
                                                borderColor: BORDER,
                                                color: cfg.jewelryType === PRESETS[name].jewelryType && cfg.stone === PRESETS[name].stone ? "white" : GOLD,
                                                bgcolor: cfg.jewelryType === PRESETS[name].jewelryType && cfg.stone === PRESETS[name].stone ? GOLD : "transparent",
                                                "&:hover": { bgcolor: GOLD_PALE, borderColor: GOLD },
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* ── Section: Jewelry Type ── */}
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Jewelry Type</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FieldLabel>Category</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.jewelryType} onChange={e => update("jewelryType", e.target.value)}>
                                                    {OPTIONS.jewelryType.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FieldLabel>Design Style</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.style} onChange={e => update("style", e.target.value)}>
                                                    {OPTIONS.style.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                                <FieldLabel>Intricacy Level</FieldLabel>
                                                <Typography variant="caption" sx={{ color: GOLD, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>{cfg.intricacy}/10</Typography>
                                            </Box>
                                            <Slider value={cfg.intricacy} min={1} max={10} step={1} onChange={(_, v) => update("intricacy", v)} sx={goldSliderSx} />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Metal & Finish ── */}
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Metal & Finish</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FieldLabel>Metal Type</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.metal} onChange={e => update("metal", e.target.value)}>
                                                    {OPTIONS.metal.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FieldLabel>Surface Finish</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.finish} onChange={e => update("finish", e.target.value)}>
                                                    {OPTIONS.finish.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Switch checked={cfg.milgrain} onChange={e => update("milgrain", e.target.checked)} size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: GOLD }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GOLD } }} />}
                                                label={<Typography variant="caption" sx={{ fontFamily: '"Montserrat", sans-serif', color: "text.secondary" }}>Milgrain Detailing</Typography>}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Switch checked={cfg.filigree} onChange={e => update("filigree", e.target.checked)} size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: GOLD }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GOLD } }} />}
                                                label={<Typography variant="caption" sx={{ fontFamily: '"Montserrat", sans-serif', color: "text.secondary" }}>Filigree Engraving</Typography>}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Gemstone ── */}
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Gemstone Details</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FieldLabel>Stone Type</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.stone} onChange={e => update("stone", e.target.value)}>
                                                    {OPTIONS?.stone.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FieldLabel>Clarity Grade</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.clarity} onChange={e => update("clarity", e.target.value)}>
                                                    {OPTIONS?.clarity.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                                <FieldLabel>Carat Weight</FieldLabel>
                                                <Typography variant="caption" sx={{ color: GOLD, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>{cfg.carat.toFixed(1)} ct</Typography>
                                            </Box>
                                            <Slider value={cfg.carat} min={0.3} max={5} step={0.1} onChange={(_, v) => update("carat", v)} sx={goldSliderSx} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FieldLabel>Color Grade</FieldLabel>
                                            <Stack direction="row" spacing={0.75}>
                                                {OPTIONS?.colorGrade.map(g => (
                                                    <Chip
                                                        key={g} label={g} size="small" onClick={() => update("colorGrade", g)}
                                                        sx={{
                                                            cursor: "pointer", fontWeight: 600, fontSize: "0.72rem",
                                                            bgcolor: cfg.colorGrade === g ? GOLD : "transparent",
                                                            color: cfg.colorGrade === g ? "white" : "text.secondary",
                                                            border: `0.5px solid ${cfg.colorGrade === g ? GOLD : BORDER}`,
                                                            "&:hover": { bgcolor: cfg.colorGrade === g ? GOLD : GOLD_PALE },
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Stone Setting ── */}
                            <Accordion>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Stone Setting</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <FieldLabel>Setting Style</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.setting} onChange={e => update("setting", e.target.value)}>
                                                    {OPTIONS?.setting.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4} sx={{ display: "flex", alignItems: "flex-end" }}>
                                            <FormControlLabel
                                                control={<Switch checked={cfg.halo} onChange={e => update("halo", e.target.checked)} size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: GOLD }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GOLD } }} />}
                                                label={<Typography variant="caption" sx={{ fontFamily: '"Montserrat", sans-serif', color: "text.secondary" }}>Halo Setting</Typography>}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Rendering ── */}
                            <Accordion>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Rendering</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={7}>
                                            <FieldLabel>Render Engine</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.renderer} onChange={e => update("renderer", e.target.value)}>
                                                    {OPTIONS.renderer.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FieldLabel>Output Quality</FieldLabel>
                                            <Stack direction="row" spacing={0.75}>
                                                {OPTIONS.quality.map(q => (
                                                    <Chip key={q} label={q} size="small" onClick={() => update("quality", q)}
                                                        sx={{
                                                            cursor: "pointer", fontWeight: 600, fontSize: "0.72rem",
                                                            bgcolor: cfg.quality === q ? GOLD : "transparent",
                                                            color: cfg.quality === q ? "white" : "text.secondary",
                                                            border: `0.5px solid ${cfg.quality === q ? GOLD : BORDER}`,
                                                            "&:hover": { bgcolor: cfg.quality === q ? GOLD : GOLD_PALE },
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Lighting & Background ── */}
                            <Accordion>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Lighting & Background</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FieldLabel>Lighting Rig</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.lighting} onChange={e => update("lighting", e.target.value)}>
                                                    {OPTIONS.lighting.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FieldLabel>Background Scene</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.background} onChange={e => update("background", e.target.value)}>
                                                    {OPTIONS.background.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                                <FieldLabel>Caustic Intensity</FieldLabel>
                                                <Typography variant="caption" sx={{ color: GOLD, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>{cfg.causticIntensity}%</Typography>
                                            </Box>
                                            <Slider value={cfg.causticIntensity} min={0} max={100} step={1} onChange={(_, v) => update("causticIntensity", v)} sx={goldSliderSx} />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* ── Section: Camera & Motion ── */}
                            <Accordion>
                                <AccordionSummary expandIcon={<Expand sx={{ color: GOLD, fontSize: 18 }} />}>
                                    <SectionLabel>Camera & Motion</SectionLabel>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FieldLabel>Shot Angle</FieldLabel>
                                            <FormControl fullWidth size="small">
                                                <Select value={cfg.camera} onChange={e => update("camera", e.target.value)}>
                                                    {OPTIONS.camera.map(o => <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Switch checked={cfg.rotation360} onChange={e => update("rotation360", e.target.checked)} size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: GOLD }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GOLD } }} />}
                                                label={<Typography variant="caption" sx={{ fontFamily: '"Montserrat", sans-serif', color: "text.secondary" }}>360° Rotation</Typography>}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Switch checked={cfg.depthOfField} onChange={e => update("depthOfField", e.target.checked)} size="small" sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: GOLD }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: GOLD } }} />}
                                                label={<Typography variant="caption" sx={{ fontFamily: '"Montserrat", sans-serif', color: "text.secondary" }}>Depth of Field</Typography>}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* ── RIGHT: Prompt Preview Panel ── */}
                        <Grid
                            item xs={12} md={5}
                            sx={{
                                display: "flex", flexDirection: "column",
                                background: "white", overflowY: "auto",
                                "&::-webkit-scrollbar": { width: 4 },
                                "&::-webkit-scrollbar-thumb": { background: BORDER, borderRadius: 2 },
                            }}
                        >
                            {/* Live Indicator */}
                            <Box
                                sx={{
                                    px: 3, py: 1.5,
                                    borderBottom: `0.5px solid ${BORDER}`,
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    background: "#FAFAF8",
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Generated Prompt</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: GOLD, animation: "pulse 1.5s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                                    <Typography variant="caption" sx={{ color: GOLD, fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>Live</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3, flex: 1 }}>
                                {/* Prompt Text Area */}
                                <TextField
                                    multiline
                                    minRows={6}
                                    maxRows={10}
                                    fullWidth
                                    value={promptText}
                                    onChange={e => setPromptText(e.target.value)}
                                    variant="outlined"
                                    placeholder="Configure parameters on the left to generate your prompt..."
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            fontSize: "0.8rem",
                                            fontFamily: '"Montserrat", sans-serif',
                                            lineHeight: 1.7,
                                            bgcolor: "#FAFAF8",
                                            "& fieldset": { borderColor: BORDER },
                                            "&:hover fieldset": { borderColor: "#D4AF6A" },
                                            "&.Mui-focused fieldset": { borderColor: GOLD },
                                        },
                                    }}
                                />

                                {/* Copy Button */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={copied ? <CheckCircle sx={{ fontSize: 16 }} /> : <Copy sx={{ fontSize: 16 }} />}
                                    onClick={handleCopy}
                                    sx={{
                                        mb: 2, borderColor: BORDER, color: copied ? "#2E7D32" : "text.secondary",
                                        borderColor: copied ? "#2E7D32" : BORDER,
                                        "&:hover": { borderColor: GOLD, color: GOLD, bgcolor: GOLD_PALE },
                                        fontSize: "0.78rem",
                                    }}
                                >
                                    {copied ? "Copied to clipboard!" : "Copy Prompt"}
                                </Button>

                                <Divider sx={{ mb: 2, borderColor: BORDER }} />

                                {/* Config Summary */}
                                <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1.5 }}>
                                    Configuration Summary
                                </Typography>
                                <Stack spacing={0.75} sx={{ mb: 2.5 }}>
                                    {[
                                        ["Type", cfg.jewelryType],
                                        ["Metal", `${cfg.metal} · ${cfg.finish}`],
                                        ["Stone", `${cfg.carat.toFixed(1)}ct ${cfg.stone} · ${cfg.colorGrade} · ${cfg.clarity}`],
                                        ["Setting", `${cfg.setting}${cfg.halo ? " + Halo" : ""}`],
                                        ["Render", `${cfg.renderer} · ${cfg.quality}`],
                                        ["Lighting", `${cfg.lighting} · ${cfg.causticIntensity}% caustic`],
                                        ["Camera", cfg.camera],
                                    ].map(([label, value]) => (
                                        <Box key={label} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                            <Typography variant="caption" sx={{ color: GOLD, fontFamily: '"Montserrat", sans-serif', fontWeight: 600, minWidth: 54, flexShrink: 0, pt: "1px" }}>
                                                {label}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: '"Montserrat", sans-serif', lineHeight: 1.5 }}>
                                                {value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* ── Action Bar ── */}
                <DialogActions
                    sx={{
                        px: 3, py: 2,
                        background: "white",
                        borderTop: `0.5px solid ${BORDER}`,
                        gap: 1.5,
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCcw sx={{ fontSize: 16 }} />}
                        onClick={() => { const fresh = buildPrompt(cfg); setPromptText(fresh); }}
                        sx={{
                            borderColor: BORDER, color: "text.secondary", fontSize: "0.78rem",
                            "&:hover": { borderColor: GOLD, color: GOLD, bgcolor: GOLD_PALE },
                        }}
                    >
                        Regenerate
                    </Button>

                    {onClose && (
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                borderColor: BORDER, color: "text.secondary", fontSize: "0.78rem",
                                "&:hover": { borderColor: "#ccc" },
                            }}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        startIcon={generating ? <CircularProgress size={14} sx={{ color: "white" }} /> : <LocateFixed sx={{ fontSize: 16 }} />}
                        onClick={handleGenerate}
                        disabled={generating}
                        sx={{
                            bgcolor: GOLD, color: "white", fontSize: "0.78rem", px: 3,
                            boxShadow: `0 4px 14px ${alpha(GOLD, 0.35)}`,
                            "&:hover": { bgcolor: "#D4AF6A", boxShadow: `0 6px 20px ${alpha(GOLD, 0.45)}` },
                            "&.Mui-disabled": { bgcolor: alpha(GOLD, 0.5), color: "white" },
                        }}
                    >
                        {generating ? "Generating..." : "Generate Image"}
                    </Button>
                </DialogActions>
            </Dialog>
    );
}