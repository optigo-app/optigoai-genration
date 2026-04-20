import { getHistoryApi } from '@/app/api/getHistoryApi';

/**
 * Normalizes a raw history record from the backend into a standard UI format.
 * Handles stringified JSON and nested result structures.
 */
export const normalizeHistoryRecord = (record) => {
  try {
    if (!record || !record.PromptJson) return null;

    // 1. Parse the nested PromptJson (which is a stringified array)
    const promptDataArray = JSON.parse(record.PromptJson || '[]');
    const root = promptDataArray[0] || {};

    // 2. Locate the generation data (handles both new and slightly older structures)
    const gen = root.api_response?.data?.[0] || root.api_response || root;

    // 3. Extract the Result URL using multiple fallbacks to ensure visibility
    const url =
      gen.result?.url ||
      gen.url ||
      gen.result?.image ||
      gen.image ||
      gen.output_path ||
      record.FileUrl;

    if (!url) {
      console.warn("Could not find result URL in record:", record.id);
      return null;
    }

    // 4. Determine media type
    const isVideo = /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(url) || url.includes('/videos/') || gen.type === 'video';

    const entryTimestamp = new Date(record.EntryDate).getTime() || Date.now();
    const baseId = String(record.id || 'history-item');
    const urlToken = String(url).split('/').pop()?.split('?')[0] || 'result';

    return {
      id: `${baseId}-${entryTimestamp}-${urlToken}`,
      src: url,              // Used by Library cards
      url: url,              // Used by Masonry/Community
      images: [url],         // Used by GeneratedImageGroup
      prompt: gen.generation?.prompt || root.prompt || "No prompt available",
      date: new Date(record.EntryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      type: isVideo ? 'video' : 'image',
      tags: [...new Set([
        gen.model || root.model,
        gen.type || root.type,
        gen.generation?.provider
      ].filter(Boolean))],
      referenceImages: gen.references?.map(r => r.url) || root.referenceImages || [],
      dimension: '1:1',
      // Store raw metadata for any special handling in specific pages
      timestamp: entryTimestamp,
      numericId: Number.parseInt(record.id) || 0,
      meta: {
        tokens: gen.generation?.tokens,
        elapsed: gen.generation?.elapsed_seconds
      }
    };
  } catch (error) {
    console.error("Failed to normalize history record:", record?.id, error);
    return null;
  }
};

/**
 * Fetches history from the API and returns a normalized array of items.
 */
export const fetchAndNormalizeHistory = async () => {
  try {
    const response = await getHistoryApi();

    // Check Status as both string and number
    if (response?.rd?.length > 0) {
      const rawData = response?.rd || [];
      return rawData
        .map(normalizeHistoryRecord)
        .filter(Boolean)
        .sort((a, b) => {
          // Sort by numericId if available, otherwise by timestamp
          if (b.numericId !== a.numericId) return b.numericId - a.numericId;
          return b.timestamp - a.timestamp;
        });
    } else {
      console.error("History API returned non-200 status:", response?.Status);
      return [];
    }

  } catch (error) {
    console.error("Error in fetchAndNormalizeHistory:", error);
    return [];
  }
};
