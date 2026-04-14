export async function processSketchImage(file, authorizationToken) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
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

  const headers = {};
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
  (files || []).forEach((file) => {
    if (file) {
      formData.append('file', file);
    }
  });

  formData.append('prompt', prompt || '');

  if (modelId) {
    formData.append('model', modelId);
  }

  if (durationSeconds !== undefined && durationSeconds !== null) {
    formData.append('duration_seconds', String(durationSeconds));
  }

  const headers = {};
  if (authorizationToken) {
    headers.Authorization = authorizationToken;
  }

  const response = await fetch('/api/genrate/gemini/generate-video', {
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
    const videoUrl = data?.video || data?.url || data?.result?.video || data?.result?.url || null;
    return { type: 'json', data, videoUrl };
  }

  const blob = await response.blob();
  return {
    type: 'blob',
    blob,
    videoUrl: URL.createObjectURL(blob),
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
