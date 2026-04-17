/**
 * Utility to convert a File or Blob URL to a Base64 string
 * @param {File|string} fileOrUrl - The file object or blob URL to convert
 * @returns {Promise<string>} - The base64 string
 */
export async function fileToBase64(fileOrUrl) {
  if (!fileOrUrl) return null;

  // If it's already a base64 string or doesn't look like a blob URL, return it
  if (typeof fileOrUrl === 'string' && !fileOrUrl.startsWith('blob:')) {
    return fileOrUrl;
  }

  try {
    let blob;
    if (typeof fileOrUrl === 'string') {
      const response = await fetch(fileOrUrl);
      blob = await response.blob();
    } else {
      blob = fileOrUrl;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting file to base64:', error);
    return fileOrUrl; // Fallback to original
  }
}
