'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from '@/components/PromptInput';

export default function PromptBar({ onGenerate, redirectToGenerate = false }) {
  const [value, setValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const router = useRouter();

  const handleGenerate = () => {
    if (!value.trim()) return;
    if (redirectToGenerate) {
      sessionStorage.setItem('home_prompt', value);
      sessionStorage.setItem('home_images', JSON.stringify(uploadedImages));
      router.push('/generate?mode=image&from=home');
      return;
    }
    onGenerate?.(value);
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
    />
  );
}
