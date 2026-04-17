import JSZip from 'jszip';

export const getAuthData = () => {
    if (typeof window === 'undefined') return null;

    try {
        const authData =
            sessionStorage.getItem('AuthqueryParams') ||
            localStorage.getItem('AuthqueryParams');

        return authData ? JSON.parse(authData) : null;
    } catch (error) {
        console.error('Error parsing AuthData:', error);
        return null;
    }
};

export const getClientIpAddress = async () => {
    if (typeof window === 'undefined') return '';

    try {
        const cachedIp = sessionStorage.getItem('client_ip_address');
        if (cachedIp) return cachedIp;

        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) return '';

        const data = await response.json();
        const ip = data?.ip || '';
        if (ip) {
            sessionStorage.setItem('client_ip_address', ip);
        }
        return ip;
    } catch {
        return '';
    }
};

const getFileExt = (url) => {
  const match = url?.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/);
  return match ? match[1] : '';
};

const getHeaders = () => ({
  // Add any auth headers if needed
});

export const handleDownloadFile = async (fileUrlOrMessage, filename = null, options = {}) => {
    if (typeof fileUrlOrMessage === 'object' && fileUrlOrMessage !== null && !options?.isRecursive) {
        const msg = fileUrlOrMessage;
        const mediaItems = Array.isArray(msg?.mediaItems) ? msg.mediaItems : [];
        if (mediaItems.length === 1 || (!mediaItems.length && (msg.FileUrl || msg.src || msg.FileUrlOrMessage))) {
            const url = mediaItems[0]?.url || msg.FileUrl || msg.src || msg.FileUrlOrMessage;
            const name = mediaItems[0]?.filename || msg.FileName || msg.name || filename;
            return handleDownloadFile(url, name, { ...options, isRecursive: true });
        }
        if (mediaItems.length > 1) {
            try {
                const zip = new JSZip();
                const timestamp = new Date().getTime();
                const zipFileName = `attachments_${timestamp}.zip`;

                const fetchPromises = mediaItems.map(async (item, idx) => {
                        try {
                            const url = item.url;
                            if (!url) return;

                            const name =
                                item.filename ||
                                `file_${idx + 1}${getFileExt(url) ? "." + getFileExt(url) : ""}`;
                            try {
                                const response = await fetch(url, {
                                    responseType: 'blob',
                                    headers: {
                                        ...(url.startsWith('http') ? {} : getHeaders())
                                    }
                                });

                                const blob = response.data;
                                zip.file(name, blob);
                            } catch (err) {
                                console.warn("CORS or Download blocked for:", url, err);
                            }
                        } catch (err) {
                            console.error(`Failed to add item ${idx} to ZIP:`, err);
                        }
                });

                await Promise.all(fetchPromises);
                const content = await zip.generateAsync({ type: "blob" });
                const zipUrl = window.URL.createObjectURL(content);
                const link = document.createElement("a");
                link.href = zipUrl;
                link.download = zipFileName;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(zipUrl);
                return { success: true, filename: zipFileName };
            } catch (error) {
                console.error("Bulk download ZIP creation failed:", error);
                return { success: false, error: error.message };
            }
        }
    }
    const fileUrl =
        typeof fileUrlOrMessage === "string"
            ? fileUrlOrMessage
            : fileUrlOrMessage?.FileUrl || fileUrlOrMessage?.src;

    if (!fileUrl) return { success: false, error: "No URL provided" };

    // Generate filename
    if (!filename) {
        const extensionMatch = fileUrl.match(/\.([a-zA-Z0-9]+)(?:$|[?#])/);
        const extension = extensionMatch?.[1] || 'jpg';
        filename = `generated-${Date.now()}.${extension}`;
    }

    // Try fetch blob first
    try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);
        return { success: true, filename };
    } catch {
        // Fallback to direct anchor download
        try {
            const anchor = document.createElement('a');
            anchor.href = fileUrl;
            anchor.download = filename;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            return { success: true, filename, fallback: true };
        } catch (fallbackError) {
            console.error("Fallback download failed:", fallbackError);
            return { success: false, error: fallbackError.message };
        }
    }
};