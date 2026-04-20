import { getHeaders } from '@/app/api/config/config';

export async function processSketchImage(file, authorizationToken) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = getHeaders();
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch('/api/process/sketch', {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let message = 'Failed to process sketch image';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      const errorText = await response.text().catch(() => '');
      if (errorText) {
        message = errorText;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const imageUrl = data?.image || data?.url || data?.result?.image || data?.result?.url || null;
    return { type: 'json', data, imageUrl };
  }

  const blob = await response.blob();
  return {
    type: 'blob',
    blob,
    imageUrl: URL.createObjectURL(blob),
  };
}

export async function processImageDynamicPrompt({ file, prompt, modelId, authorizationToken }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);

  const headers = getHeaders();
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch(`/api/image-dynamic-prompts/${modelId}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let message = `Failed to process image with ${modelId}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      const errorText = await response.text().catch(() => '');
      if (errorText) {
        message = errorText;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const imageUrl = data?.image || data?.url || data?.result?.image || data?.result?.url || null;
    return { type: 'json', data, imageUrl };
  }

  const blob = await response.blob();
  return {
    type: 'blob',
    blob,
    imageUrl: URL.createObjectURL(blob),
  };
}

export async function processGeminiVideoGenerate({ files, prompt, modelId, durationSeconds, authorizationToken }) {
  const formData = new FormData();
  const primaryFile = (files || [])[0];
  const secondaryFile = (files || [])[1];
  if (primaryFile) {
    formData.append('image1_object', primaryFile);
  }

  formData.append('prompt', prompt || '');

  if (secondaryFile) {
    formData.append('image2_model', secondaryFile);
  }

  if (modelId) {
    formData.append('model', modelId);
  }

  if (durationSeconds !== undefined && durationSeconds !== null) {
    formData.append('duration_seconds', String(durationSeconds));
  }

  const headers = getHeaders();
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch('/api/generate-video', {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let message = 'Failed to generate video with Gemini';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      const errorText = await response.text().catch(() => '');
      if (errorText) {
        message = errorText;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const videoUrl =
      data?.data?.[0]?.result?.url ||
      data?.local_video_url ||
      data?.video ||
      data?.url ||
      data?.output_video ||
      data?.result?.local_video_url ||
      data?.result?.video ||
      data?.result?.url ||
      data?.result?.output_video ||
      null;
    return { type: 'json', data, videoUrl };
  }

  const blob = await response.blob();
  return {
    type: 'blob',
    blob,
    videoUrl: URL.createObjectURL(blob),
  };
}

export async function processMultiReferenceJewelry({
  modelImage,
  ringImages,
  necklaceImages,
  bangleImages,
  earingImages,
  otherImages,
  prompt,
  maxJewelryReferences,
  geminiModel,
  authorizationToken,
}) {
  const formData = new FormData();

  if (modelImage) {
    formData.append('model_image', modelImage);
  }

  if (ringImages && ringImages.length > 0) {
    ringImages.forEach((file) => formData.append('ring_images', file));
  }

  if (necklaceImages && necklaceImages.length > 0) {
    necklaceImages.forEach((file) => formData.append('necklace_images', file));
  }

  if (bangleImages && bangleImages.length > 0) {
    bangleImages.forEach((file) => formData.append('bangle_images', file));
  }

  if (earingImages && earingImages.length > 0) {
    earingImages.forEach((file) => formData.append('earing_images', file));
  }

  if (otherImages && otherImages.length > 0) {
    otherImages.forEach((file) => formData.append('other_images', file));
  }

  formData.append('prompt', prompt || '');

  if (maxJewelryReferences !== undefined && maxJewelryReferences !== null) {
    formData.append('max_jewelry_references', String(maxJewelryReferences));
  }

  if (geminiModel) {
    formData.append('gemini_model', geminiModel);
  }

  const headers = getHeaders();
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch('/api/multi-reference-jewelry', {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let message = 'Failed to generate jewelry image with multi-reference';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      const errorText = await response.text().catch(() => '');
      if (errorText) {
        message = errorText;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const imageUrl = 
      data?.glb_file_url ||
      data?.download_url ||
      data?.uploaded?.generated?.url ||
      data?.data?.[0]?.result?.url ||
      data?.output_path || 
      data?.image || 
      data?.url || 
      data?.result?.image || 
      data?.result?.url || 
      null;
    return { type: 'json', data, imageUrl };
  }

  const blob = await response.blob();
  return {
    type: 'blob',
    blob,
    imageUrl: URL.createObjectURL(blob),
  };
}

export async function processSyncCadGenerate({
  file,
  image_enhancement = 'true',
  multi_view = 'true',
  enable_pbr = 'true',
  uKey,
  uniqueNo,
  authorizationToken,
}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('image_enhancement', String(image_enhancement));
  formData.append('multi_view', String(multi_view));
  formData.append('enable_pbr', String(enable_pbr));
  formData.append('uKey', uKey || '');
  formData.append('uniqueNo', uniqueNo || '');
  formData.append('generatedFolderName', 'Generated');
  formData.append('referenceFolderName', 'Reference');
  formData.append('f', 'AI Sync CAD Generate');

  const headers = getHeaders();
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch('/api/sync-cad-generate', {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let message = 'Failed to generate CAD';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      const errorText = await response.text().catch(() => '');
      if (errorText) {
        message = errorText;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const imageUrl = 
      data?.glb_file_url ||
      data?.download_url ||
      data?.uploaded?.generated?.url ||
      data?.data?.[0]?.result?.url ||
      data?.output_path || 
      data?.image || 
      data?.url || 
      data?.result?.image || 
      data?.result?.url || 
      null;
    return { type: 'json', data, imageUrl };
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return {
    type: 'blob',
    blob,
    imageUrl: url + '#.glb',
  };
}

export async function fileFromImageUrl(imageUrl, fallbackName = 'reference-image.png') {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Unable to read uploaded image');
  }

  const blob = await response.blob();
  const extension = blob.type?.split('/')[1] || 'png';
  const safeName = fallbackName.includes('.') ? fallbackName : `${fallbackName}.${extension}`;

  return new File([blob], safeName, { type: blob.type || 'image/png' });
}
