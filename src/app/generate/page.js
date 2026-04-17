'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
import ImageEditWorkspace from '@/components/generate/ImageEditWorkspace';
import { COLORS, RADIUS, SHADOWS } from '@/theme/tokens';
import { handleDownloadFile } from '@/utils/globalFunc';
import { fileFromImageUrl, processSketchImage, processImageDynamicPrompt, processGeminiVideoGenerate, processMultiReferenceJewelry } from '@/utils/processServices';
import { fileToBase64 } from '@/utils/historyUtils';
import { IconButton, Tooltip, useTheme } from '@mui/material';



const DEFAULT_SETTINGS = {
  dimension: '1:1', count: 1, preset: 'Cinematic', guidance: 7, addToCollection: false,
  videoQuality: '1080p', videoDuration: '5s', videoFps: '30', videoStyle: 'Cinematic', motionStrength: 5,
};

const PANEL_HEIGHT = 'calc(100vh - 24px)';

const ACTION_CONFIG = {
  upscale: { prompt: 'Upscale this image to maximum resolution, enhance details and sharpness', mode: 'image' },
  image: { prompt: 'Generate a refined image variation based on this reference', mode: 'image' },
  edit: { prompt: 'Edit and enhance this image: ', mode: 'image' },
  video: { prompt: 'Animate this image into a smooth cinematic video', mode: 'video' },
};

export default function GeneratePage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const promptInputRef = useRef(null);
  const resultsScrollRef = useRef(null);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState(searchParams.get('mode') || 'image');
  const [imageUploadMode, setImageUploadMode] = useState('single');

  // Restore state passed from home page
  useEffect(() => {
    if (searchParams.get('from') === 'home') {
      const savedPrompt = sessionStorage.getItem('home_prompt');
      const savedImages = sessionStorage.getItem('home_images');
      const savedMode = sessionStorage.getItem('home_upload_mode');
      if (savedPrompt) setPrompt(savedPrompt);
      if (savedImages) {
        try { setUploadedImages(JSON.parse(savedImages)); } catch { }
      }
      if (savedMode) setImageUploadMode(savedMode);
      sessionStorage.removeItem('home_prompt');
      sessionStorage.removeItem('home_images');
      sessionStorage.removeItem('home_upload_mode');
    }
  }, []);

  // Sync mode to URL so sidebar highlights correctly
  const handleModeChange = (newMode) => {
    setMode(newMode);
    router.replace(`/generate?mode=${newMode}`, { scroll: false });
  };

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m && m !== mode) {
      setMode(m);
    }
  }, [searchParams]);

  // Auto-select multi-jewelry model when switching to multi mode
  useEffect(() => {
    if (imageUploadMode === 'multi') {
      setSettings((prev) => ({
        ...prev,
        imageModel: 'gemini-2.5-flash-image-preview',
      }));
    }
  }, [imageUploadMode]);

  // Fetch history from local API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };
    fetchHistory();
  }, []);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingPrompt, setGeneratingPrompt] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [collectionsModalOpen, setCollectionsModalOpen] = useState(false);
  const [designPanelOpen, setDesignPanelOpen] = useState(false);
  const [modelPanelOpen, setModelPanelOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [editWorkspaceOpen, setEditWorkspaceOpen] = useState(false);
  const [editSelectedImage, setEditSelectedImage] = useState(null);
  const [editSelectedPrompt, setEditSelectedPrompt] = useState('');
  const canGenerate = mode === 'sketch' ? uploadedImages.length > 0 : undefined;
  const uploadAccept = mode === 'video' ? 'image/*,video/*' : 'image/*';

  const saveHistory = async (newItem) => {
    try {
      // Convert reference image blob URLs to base64 for persistence
      if (newItem.referenceImages && newItem.referenceImages.length > 0) {
        newItem.referenceImages = await Promise.all(
          newItem.referenceImages.map(url => fileToBase64(url))
        );
      }

      await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
    } catch (error) {
      console.error('Failed to save to history file:', error);
    }
  };

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

  const handleSelect = useCallback((imgSrc) => {
    setSelectedImages((prev) =>
      prev.includes(imgSrc) ? prev.filter((s) => s !== imgSrc) : [...prev, imgSrc]
    );
  }, []);

  const handleSelectionAction = (actionId) => {
    if (actionId === 'download') {
      selectedImages.forEach((src) => handleDownloadFile(src));
    } else if (actionId === 'delete') {
      setHistory((prev) => prev.map((g) => ({ ...g, images: g.images.filter((img) => !selectedImages.includes(img)) })).filter((g) => g.images.length > 0));
      setSelectedImages([]);
    } else if (actionId === 'organize') {
      alert(`Organizing ${selectedImages.length} images into a collection`);
    }
  };

  const handleAction = useCallback((type, imgSrc, promptText) => {
    if (type === 'reuse') {
      const reusePrompt = imgSrc?.prompt || promptText || '';
      const reuseReferenceImages = Array.isArray(imgSrc?.referenceImages) ? imgSrc.referenceImages : [];

      setPrompt(reusePrompt);
      setUploadedImages(
        reuseReferenceImages.map((url, idx) => ({
          id: `reuse-${Date.now()}-${idx}`,
          url,
          name: `ref-reuse-${idx + 1}.jpg`,
        }))
      );
      setMode('image');
      return;
    }

    const config = ACTION_CONFIG[type];
    if (!config) return;

    // Open edit workspace for edit action
    if (type === 'edit') {
      setEditSelectedImage(imgSrc);
      setEditSelectedPrompt(promptText || '');
      setEditWorkspaceOpen(true);
      return;
    }

    // Set image as reference inside input for other actions
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
  }, []);

  const handleEditWorkspacePromptChange = (newPrompt) => {
    setEditSelectedPrompt(newPrompt);
  };

  const handleEditWorkspaceUpscale = () => {
    setUploadedImages([{ id: `upscale-${Date.now()}`, url: editSelectedImage, name: 'upscale-source.jpg' }]);
    setPrompt('Upscale this image to maximum resolution, enhance details and sharpness');
    setMode('image');
    setEditWorkspaceOpen(false);
    setTimeout(() => promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleEditWorkspaceVideo = () => {
    setUploadedImages([{ id: `video-${Date.now()}`, url: editSelectedImage, name: 'video-source.jpg' }]);
    setPrompt('Animate this image into a smooth cinematic video');
    setMode('video');
    setEditWorkspaceOpen(false);
    setTimeout(() => promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleEditWorkspaceRemix = () => {
    setUploadedImages([{ id: `remix-${Date.now()}`, url: editSelectedImage, name: 'remix-source.jpg' }]);
    setPrompt(editSelectedPrompt || 'Generate a refined image variation based on this reference');
    setMode('image');
    setEditWorkspaceOpen(false);
    setTimeout(() => promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleCloseEditWorkspace = () => {
    setEditWorkspaceOpen(false);
    setEditSelectedImage(null);
    setEditSelectedPrompt('');
  };

  const handleEditWorkspaceGenerate = (newPrompt, image) => {
    setUploadedImages([{ id: `edit-gen-${Date.now()}`, url: image, name: 'edit-source.jpg' }]);
    setPrompt(newPrompt);
    setMode('image');
    setEditWorkspaceOpen(false);
    setTimeout(() => {
      promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Auto-trigger generate after a short delay
      setTimeout(() => {
        handleGenerate(newPrompt);
      }, 300);
    }, 100);
  };

  const handleGenerate = async (promptOverride) => {
    const activePrompt = typeof promptOverride === 'string' ? promptOverride : prompt;
    const canGenerateNow = mode === 'sketch' ? uploadedImages.length > 0 : Boolean(activePrompt.trim());
    if (!canGenerateNow || isGenerating) return;

    if (mode === 'sketch' && uploadedImages.length === 0) {
      alert('Please upload at least one image for sketch conversion.');
      return;
    }

    if (mode === 'video' && uploadedImages.length === 0) {
      alert('Please upload at least one media file for video generation.');
      return;
    }

    if (activePrompt !== prompt) {
      setPrompt(activePrompt);
    }

    setIsGenerating(true);
    setGeneratingPrompt(activePrompt);

    try {
      if (mode === 'sketch') {
        const sourceImage = uploadedImages[0];
        const file = await fileFromImageUrl(sourceImage.url, sourceImage.name || 'sketch-source.png');
        const result = await processSketchImage(file);
        const sketchImageUrl = result.imageUrl || sourceImage.url;

        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt: activePrompt,
          images: [sketchImageUrl],
          referenceImages: uploadedImages.map(img => img.url),
          tags: ['sketch', settings.dimension],
          dimension: settings.dimension,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        saveHistory(newHistoryItem);

        setPrompt('');
        return;
      }

      if (mode === 'video') {
        const files = await Promise.all(
          uploadedImages.map((item, idx) => fileFromImageUrl(item.url, item.name || `video-source-${idx + 1}.mp4`))
        );
        const modelId = settings.videoModel || VIDEO_MODELS[0]?.id;
        const durationSeconds = Number.parseInt(String(settings.videoDuration || '5').replace(/\D/g, ''), 10) || 5;

        const result = await processGeminiVideoGenerate({
          files,
          prompt: activePrompt,
          modelId,
          durationSeconds,
        });

        const generatedVideoUrl = result.videoUrl;
        if (!generatedVideoUrl) {
          throw new Error('Video generation succeeded but no video URL was returned.');
        }

        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt: activePrompt,
          images: [generatedVideoUrl],
          referenceImages: uploadedImages.map(img => img.url),
          tags: [modelId, 'video', settings.dimension, `${durationSeconds}s`].filter(Boolean),
          dimension: settings.dimension,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        saveHistory(newHistoryItem);

        setPrompt('');
        return;
      }

      if (mode === 'image' && uploadedImages.length > 0) {
        const modelId = settings.imageModel || IMAGE_MODELS[0]?.id;

        // Check if using a multi-jewelry model or in multi-jewelry mode
        const isMultiJewelryModel = modelId === 'gemini-2.5-flash-image-preview' || modelId === 'gemini-2.5-flash-image';
        const useMultiJewelryApi = isMultiJewelryModel || (imageUploadMode === 'multi' && uploadedImages.length > 1);

        if (useMultiJewelryApi) {
          // Multi-jewelry mode: Categorize images based on their category property
          const modelImg = uploadedImages.find(img => img.category === 'model') || uploadedImages[0];
          const jewelryItems = uploadedImages;
          const ringImgs = jewelryItems.filter(img => img.category === 'ring');
          const necklaceImgs = jewelryItems.filter(img => img.category === 'necklace');
          const bangleImgs = jewelryItems.filter(img => img.category === 'bangle');
          const earingImgs = jewelryItems.filter(img => img.category === 'earring');
          const otherImgs = jewelryItems.filter(img => img.category === 'other' || !img.category);

          const ringImages = await Promise.all(ringImgs.map(img => fileFromImageUrl(img.url, img.name || 'ring.jpg')));
          const necklaceImages = await Promise.all(necklaceImgs.map(img => fileFromImageUrl(img.url, img.name || 'necklace.jpg')));
          const bangleImages = await Promise.all(bangleImgs.map(img => fileFromImageUrl(img.url, img.name || 'bangle.jpg')));
          const earingImages = await Promise.all(earingImgs.map(img => fileFromImageUrl(img.url, img.name || 'earing.jpg')));
          const otherImages = await Promise.all(otherImgs.map(img => fileFromImageUrl(img.url, img.name || 'other.jpg')));

          const modelFile = await fileFromImageUrl(modelImg.url, modelImg.name || 'model.jpg');

          const result = await processMultiReferenceJewelry({
            modelImage: modelFile,
            ringImages,
            necklaceImages,
            bangleImages,
            earingImages,
            otherImages,
            prompt: activePrompt,
            geminiModel: modelId,
            maxJewelryReferences: jewelryItems.length,
          });

          const generatedImageUrl = result.imageUrl || modelImg.url;

          const newHistoryItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
            prompt: activePrompt,
            images: [generatedImageUrl],
            referenceImages: uploadedImages.map(img => img.url),
            tags: [modelId, 'multi-jewelry', settings.dimension].filter(Boolean),
            dimension: settings.dimension,
          };
          setHistory((prev) => [newHistoryItem, ...prev]);
          saveHistory(newHistoryItem);

          setPrompt('');
          return;
        }

        // Single mode or regular image mode
        const sourceImage = uploadedImages[0];
        const file = await fileFromImageUrl(sourceImage.url, sourceImage.name || 'image-source.png');

        const result = await processImageDynamicPrompt({
          file,
          prompt: activePrompt,
          modelId,
        });

        console.log("result", result);

        const generatedImageUrl = result.imageUrl || sourceImage.url;

        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt: activePrompt,
          images: [generatedImageUrl],
          referenceImages: uploadedImages.map(img => img.url),
          tags: [modelId, 'image', settings.dimension].filter(Boolean),
          dimension: settings.dimension,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        saveHistory(newHistoryItem);

        setPrompt('');
        return;
      }

      setTimeout(() => {
        const h = settings.dimension === '16:9' ? 225 : settings.dimension === '9:16' ? 711 : 400;
        const seeds = Array.from({ length: settings.count }, (_, i) =>
          `https://picsum.photos/seed/${Date.now() + i}/400/${h}`
        );
        const newHistoryItem = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
          prompt: activePrompt,
          images: seeds,
          referenceImages: uploadedImages.map(img => img.url),
          tags: [settings.preset?.toLowerCase(), mode, settings.dimension].filter(Boolean),
          dimension: settings.dimension,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        saveHistory(newHistoryItem);
        setPrompt('');
      }, 2200);
    } catch (error) {
      console.error('Sketch generation failed:', error);
      alert(error?.message || 'Sketch conversion failed. Please try again.');
    } finally {
      if (mode === 'sketch' || mode === 'image' || mode === 'video') {
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
              <GenerateSettingsPanel settings={settings} onChange={setSettings} mode={mode} onOpenModelPanel={() => { setModelPanelOpen(true); setDesignPanelOpen(false); }} collections={collections} onCreateCollection={handleCreateCollection} />
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
              mode={mode}
              imageUploadMode={imageUploadMode}
              onImageUploadModeChange={setImageUploadMode}
            />

            {/* Mode toggle */}
            <ModeToggle value={mode} onChange={handleModeChange} />
          </Box>

          {/* Results header */}
          <Box sx={{ px: 2.5, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Generated Results
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: theme.palette.text.secondary }}>
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
              ref={resultsScrollRef}
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
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: 'text.disabled', textAlign: 'center' }}>
                      Your generated images will appear here
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 400, color: 'text.disabled', opacity: 0.7 }}>
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
                    referenceImages={group.referenceImages}
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

      {/* Image edit workspace */}
      {editWorkspaceOpen && (
        <ImageEditWorkspace
          images={history.flatMap(h => h.images)}
          selectedImage={editSelectedImage}
          prompt={editSelectedPrompt}
          onClose={handleCloseEditWorkspace}
          onPromptChange={handleEditWorkspacePromptChange}
          onUpscale={handleEditWorkspaceUpscale}
          onVideoGenerate={handleEditWorkspaceVideo}
          onRemix={handleEditWorkspaceRemix}
          onGenerate={handleEditWorkspaceGenerate}
        />
      )}
    </Box>
  );
}
