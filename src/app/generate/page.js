'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PromptInput from '@/components/PromptInput';
import GenerateSettingsPanel from '@/components/generate/GenerateSettingsPanel';
import GeneratedImageGroup from '@/components/generate/GeneratedImageGroup';
import ModeToggle from '@/components/generate/ModeToggle';
import SelectionBar from '@/components/generate/SelectionBar';
import CollectionsModal from '@/components/generate/CollectionsModal';
import DesignCollectionPanel from '@/components/generate/DesignCollectionPanel';
import ModelSelectPanel, { IMAGE_MODELS, VIDEO_MODELS } from '@/components/generate/ModelSelectPanel';
import { COLORS, RADIUS, SHADOWS } from '@/theme/tokens';
import { fileFromImageUrl, processSketchImage, processImageDynamicPrompt } from '@/utils/processServices';
import { IconButton, Tooltip } from '@mui/material';

const SAMPLE_HISTORY = [
  {
    id: 1,
    date: 'Monday, 03 February 2025',
    prompt: 'A young woman with a warm smile sitting in a cozy café, natural lighting, photorealistic, 8k resolution',
    images: ['https://picsum.photos/seed/gen1/400/500'],
    tags: ['photorealistic', 'portrait', 'cinematic'],
    dimension: '1:1',
  },
  {
    id: 2,
    date: 'Sunday, 11 January 2026',
    prompt: 'Traditional Indian devotional art featuring Rama, Sita, Lakshmana and Hanuman in classical painting style',
    images: ['https://picsum.photos/seed/gen2/400/500', 'https://picsum.photos/seed/gen3/400/500', 'https://picsum.photos/seed/gen4/400/500'],
    tags: ['traditional', 'painting', 'devotional'],
    dimension: '1:1',
  },
  {
    id: 3,
    date: 'Sunday, 29 August 2025',
    prompt: 'A logo for StoryVoice India, a storytelling brand, elegant typography with cultural motifs',
    images: ['https://picsum.photos/seed/gen5/400/300', 'https://picsum.photos/seed/gen6/400/300', 'https://picsum.photos/seed/gen7/400/300', 'https://picsum.photos/seed/gen8/400/300'],
    tags: ['logo', 'branding', 'typography'],
    dimension: '4:3',
  },
];

const DEFAULT_SETTINGS = {
  dimension: '1:1', count: 1, preset: 'Cinematic', guidance: 7, addToCollection: false,
  videoQuality: '1080p', videoDuration: '5s', videoFps: '30', videoStyle: 'Cinematic', motionStrength: 5,
};

const PANEL_HEIGHT = 'calc(100vh - 24px)';

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptInputRef = useRef(null);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState(searchParams.get('mode') || 'image');

  // Restore state passed from home page
  useEffect(() => {
    if (searchParams.get('from') === 'home') {
      const savedPrompt = sessionStorage.getItem('home_prompt');
      const savedImages = sessionStorage.getItem('home_images');
      if (savedPrompt) setPrompt(savedPrompt);
      if (savedImages) {
        try { setUploadedImages(JSON.parse(savedImages)); } catch { }
      }
      sessionStorage.removeItem('home_prompt');
      sessionStorage.removeItem('home_images');
    }
  }, []);

  // Sync mode to URL so sidebar highlights correctly
  const handleModeChange = (newMode) => {
    setMode(newMode);
    router.replace(`/generate?mode=${newMode}`, { scroll: false });
  };

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m && m !== mode) setMode(m);
  }, [searchParams]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [history, setHistory] = useState(SAMPLE_HISTORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingPrompt, setGeneratingPrompt] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [collectionsModalOpen, setCollectionsModalOpen] = useState(false);
  const [designPanelOpen, setDesignPanelOpen] = useState(false);
  const [modelPanelOpen, setModelPanelOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const canGenerate = mode === 'sketch' ? uploadedImages.length > 0 : Boolean(prompt.trim());
  const uploadAccept = mode === 'video' ? 'image/*,video/*' : 'image/*';

  const handleToggleCollection = (colId, images) => {
    setCollections((prev) => prev.map((c) => {
      if (c.id !== colId) return c;
      const alreadyHas = images.some((img) => c.images.includes(img));
      if (alreadyHas) {
        return { ...c, images: c.images.filter((img) => !images.includes(img)) };
      } else {
        return { ...c, images: [...new Set([...c.images, ...images])] };
      }
    }));
  };

  const handleCreateCollection = (name, images) => {
    setCollections((prev) => [...prev, { id: Date.now(), name: name.toUpperCase(), images: [...new Set(images)] }]);
  };

  const handleDeleteCollection = (colId) => {
    setCollections((prev) => prev.filter((c) => c.id !== colId));
  };

  const handleUseCollectionImage = (img) => {
    setUploadedImages([{ id: `col-${img.id}-${Date.now()}`, url: img.src, name: img.title }]);
    setDesignPanelOpen(false);
    setTimeout(() => promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleSelect = (imgSrc) => {
    setSelectedImages((prev) =>
      prev.includes(imgSrc) ? prev.filter((s) => s !== imgSrc) : [...prev, imgSrc]
    );
  };

  const handleSelectionAction = (actionId) => {
    if (actionId === 'download') {
      selectedImages.forEach((src, i) => {
        const a = document.createElement('a');
        a.href = src; a.download = `image-${i + 1}.jpg`; a.click();
      });
    } else if (actionId === 'delete') {
      setHistory((prev) => prev.map((g) => ({ ...g, images: g.images.filter((img) => !selectedImages.includes(img)) })).filter((g) => g.images.length > 0));
      setSelectedImages([]);
    } else if (actionId === 'organize') {
      alert(`Organizing ${selectedImages.length} images into a collection`);
    }
  };

  // Action configs per type
  const ACTION_CONFIG = {
    upscale: { prompt: 'Upscale this image to maximum resolution, enhance details and sharpness', mode: 'image' },
    image: { prompt: 'Generate a refined image variation based on this reference', mode: 'image' },
    edit: { prompt: 'Edit and enhance this image: ', mode: 'image' },
    video: { prompt: 'Animate this image into a smooth cinematic video', mode: 'video' },
  };

  const handleAction = (type, imgSrc) => {
    const config = ACTION_CONFIG[type];
    if (!config) return;
    // Set image as reference inside input
    fetch(imgSrc)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], `ref-${type}.jpg`, { type: blob.type });
        const url = URL.createObjectURL(file);
        setUploadedImages([{ id: `action-${Date.now()}`, url, name: file.name }]);
      })
      .catch(() => {
        // fallback: just use the url directly
        setUploadedImages([{ id: `action-${Date.now()}`, url: imgSrc, name: `ref-${type}.jpg` }]);
      });
    setPrompt(config.prompt);
    setMode(config.mode);
    // Scroll prompt into view
    setTimeout(() => promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;

    if (mode === 'sketch' && uploadedImages.length === 0) {
      alert('Please upload at least one image for sketch conversion.');
      return;
    }

    setIsGenerating(true);
    setGeneratingPrompt(prompt);

    try {
      if (mode === 'sketch') {
        const sourceImage = uploadedImages[0];
        const file = await fileFromImageUrl(sourceImage.url, sourceImage.name || 'sketch-source.png');
        const result = await processSketchImage(file);
        const sketchImageUrl = result.imageUrl || sourceImage.url;

        setHistory((prev) => [{
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt,
          images: [sketchImageUrl],
          tags: ['sketch', settings.dimension],
          dimension: settings.dimension,
        }, ...prev]);

        setPrompt('');
        return;
      }

      if (mode === 'image' && uploadedImages.length > 0) {
        const sourceImage = uploadedImages[0];
        const file = await fileFromImageUrl(sourceImage.url, sourceImage.name || 'image-source.png');
        const modelId = settings.imageModel || IMAGE_MODELS[0]?.id;

        const result = await processImageDynamicPrompt({
          file,
          prompt,
          modelId,
        });

        const generatedImageUrl = result.imageUrl || sourceImage.url;

        setHistory((prev) => [{
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt,
          images: [generatedImageUrl],
          tags: [modelId, 'image', settings.dimension].filter(Boolean),
          dimension: settings.dimension,
        }, ...prev]);

        setPrompt('');
        return;
      }

      setTimeout(() => {
        const h = settings.dimension === '16:9' ? 225 : settings.dimension === '9:16' ? 711 : 400;
        const seeds = Array.from({ length: settings.count }, (_, i) =>
          `https://picsum.photos/seed/${Date.now() + i}/400/${h}`
        );
        setHistory((prev) => [{
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt, images: seeds,
          tags: [settings.preset?.toLowerCase(), mode, settings.dimension].filter(Boolean),
          dimension: settings.dimension,
        }, ...prev]);
        setPrompt('');
      }, 2200);
    } catch (error) {
      console.error('Sketch generation failed:', error);
      alert(error?.message || 'Sketch conversion failed. Please try again.');
    } finally {
      if (mode === 'sketch') {
        setIsGenerating(false);
        setGeneratingPrompt('');
      } else {
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratingPrompt('');
        }, 2200);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', p: '12px', gap: '12px' }}>
      <Sidebar />

      <Box sx={{ flex: 1, ml: '80px', display: 'flex', gap: '12px', height: PANEL_HEIGHT }}>

        {/* ── LEFT PANEL: Settings only ── */}
        <Box
          sx={{
            width: designPanelOpen || modelPanelOpen ? 560 : 260,
            flexShrink: 0,
            height: PANEL_HEIGHT,
            bgcolor: 'background.paper',
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sidebar,
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            transition: 'width 0.28s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* Settings column */}
          <Box sx={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Left header */}
            <Box sx={{ px: 2, pt: 2, pb: 1.35, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                Settings
              </Typography>
              <Tooltip title="Design Collection" placement="right" arrow>
                <motion.div whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    size="small"
                    onClick={() => { setDesignPanelOpen((v) => !v); setModelPanelOpen(false); }}
                    sx={{
                      color: designPanelOpen ? 'primary.main' : 'text.secondary',
                      bgcolor: designPanelOpen ? COLORS.primaryAlpha[12] : 'transparent',
                      border: '1px solid',
                      borderColor: designPanelOpen ? COLORS.primaryAlpha[40] : 'divider',
                      borderRadius: '8px',
                      p: 0.55,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { color: 'primary.main', bgcolor: COLORS.primaryAlpha[12], borderColor: COLORS.primaryAlpha[40] },
                    }}
                  >
                    <Sparkles size={15} strokeWidth={1.9} />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Box>

            {/* Settings panel fills rest */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <GenerateSettingsPanel settings={settings} onChange={setSettings} mode={mode} onOpenModelPanel={() => { setModelPanelOpen(true); setDesignPanelOpen(false); }} />
            </Box>
          </Box>{/* end settings column */}

          {/* Design Collection Panel */}
          <DesignCollectionPanel
            open={designPanelOpen}
            onClose={() => setDesignPanelOpen(false)}
            onUseImage={handleUseCollectionImage}
          />

          {/* Model Select Panel */}
          <ModelSelectPanel
            open={modelPanelOpen}
            onClose={() => setModelPanelOpen(false)}
            models={mode === 'video' ? VIDEO_MODELS : IMAGE_MODELS}
            value={mode === 'video' ? (settings.videoModel || VIDEO_MODELS[0].id) : (settings.imageModel || IMAGE_MODELS[0].id)}
            onChange={(val) => setSettings((prev) => ({ ...prev, [mode === 'video' ? 'videoModel' : 'imageModel']: val }))}
          />
        </Box>

        {/* ── RIGHT PANEL: Mode toggle + Prompt + Results ── */}
        <Box
          sx={{
            flex: 1,
            height: PANEL_HEIGHT,
            bgcolor: 'background.paper',
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sidebar,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Right panel top: prompt + generate + mode toggle */}
          <Box
            sx={{
              px: 2.5,
              pt: 2,
              pb: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
            }}
          >
            {/* Prompt input — shared reusable component */}
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              canGenerate={canGenerate}
              buttonLabel={isGenerating ? 'Generating...' : 'Generate'}
              uploadedImages={uploadedImages}
              uploadAccept={uploadAccept}
              onImagesChange={setUploadedImages}
              inputRef={promptInputRef}
              radius="12px"
            />

            {/* Mode toggle */}
            <ModeToggle value={mode} onChange={handleModeChange} />
          </Box>

          {/* Results header */}
          <Box sx={{ px: 2.5, py: 1.25, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Generated Results
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
              {history.length} generation{history.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Scrollable results */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                px: 3,
                py: 2.5,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.08) transparent',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
              }}
            >
              {/* Empty state */}
              {history.length === 0 && !isGenerating && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 2 }}>
                    <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
                      <Sparkles size={52} strokeWidth={1} color={COLORS.primary} />
                    </motion.div>
                    <Typography sx={{ fontSize: '0.88rem', color: 'text.disabled', textAlign: 'center' }}>
                      Your generated images will appear here
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', opacity: 0.6 }}>
                      Type a prompt and click Generate
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Generating skeleton */}
              <AnimatePresence>
                {isGenerating && (
                  <GeneratedImageGroup
                    key="generating"
                    date={new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    prompt={generatingPrompt}
                    images={[]}
                    tags={[]}
                    isGenerating={true}
                    count={settings.count}
                    dimension={settings.dimension}
                  />
                )}
              </AnimatePresence>

              {/* History */}
              <AnimatePresence>
                {history.map((group) => (
                  <GeneratedImageGroup
                    key={group.id}
                    date={group.date}
                    prompt={group.prompt}
                    images={group.images}
                    tags={group.tags}
                    dimension={group.dimension}
                    onAction={handleAction}
                    selectedImages={selectedImages}
                    onSelect={handleSelect}
                  />
                ))}
              </AnimatePresence>
            </Box>

            {/* Floating selection bar */}
            <SelectionBar
              selectedCount={selectedImages.length}
              onAction={handleSelectionAction}
              onClear={() => setSelectedImages([])}
              selectedImages={selectedImages}
              collections={collections}
              onToggleCollection={handleToggleCollection}
              onCreateCollection={handleCreateCollection}
              onViewAll={() => setCollectionsModalOpen(true)}
            />
          </Box>
        </Box>
      </Box>

      {/* Collections modal */}
      <CollectionsModal
        open={collectionsModalOpen}
        onClose={() => setCollectionsModalOpen(false)}
        collections={collections}
        onDeleteCollection={handleDeleteCollection}
      />
    </Box>
  );
}
