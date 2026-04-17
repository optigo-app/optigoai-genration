'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from '@/components/PromptInput';

export default function PromptBar({ onGenerate, redirectToGenerate = false, mode = 'image' }) {
  const [value, setValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUploadMode, setImageUploadMode] = useState('single');
  const router = useRouter();

  const handleGenerate = (promptOverride) => {
    const activePrompt = typeof promptOverride === 'string' ? promptOverride : value;
    if (!activePrompt.trim()) return;
    
    if (redirectToGenerate) {
      sessionStorage.setItem('home_prompt', activePrompt);
      sessionStorage.setItem('home_images', JSON.stringify(uploadedImages));
      sessionStorage.setItem('home_upload_mode', imageUploadMode);
      router.push(`/generate?mode=${mode}&from=home`);
      return;
    }
    onGenerate?.(activePrompt);
  };

  return (
    <PromptInput
      value={value}
      onChange={setValue}
      onGenerate={handleGenerate}
      uploadedImages={uploadedImages}
      onImagesChange={setUploadedImages}
      placeholder="Type a prompt..."
      buttonLabel="Generate"
      mode={mode}
      imageUploadMode={imageUploadMode}
      onImageUploadModeChange={setImageUploadMode}
    />
  );
}
