export const ENV_CONFIG = {
  OPTIGO_API_BASE_URL: process.env.OPTIGO_API_BASE_URL,
  OPTIGO_API_KEY: process.env.OPTIGO_API_KEY,
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
  DEBUG_API: process.env.DEBUG_API === 'true',
  BACKEND_NZEN_API_URL: process.env.BACKEND_NZEN_API_URL,
  BACEKND_LIVE_API_URL: process.env.BACEKND_LIVE_API_URL,
};

export const getBackendApiUrl = () => {
  const isLocal = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  return isLocal ? ENV_CONFIG.BACKEND_NZEN_API_URL : ENV_CONFIG.BACEKND_LIVE_API_URL;
};

export const getApiHeaders = (authorizationHeader, additionalHeaders = {}) => {
  const headers = {
    ...additionalHeaders,
  };

  if (authorizationHeader) {
    headers['Authorization'] = authorizationHeader;
  } else if (ENV_CONFIG.OPTIGO_API_KEY) {
    headers['Authorization'] = `Bearer ${ENV_CONFIG.OPTIGO_API_KEY}`;
  }

  return headers;
};

export const getApiUrl = (endpoint) => {
  return `${ENV_CONFIG.OPTIGO_API_BASE_URL}${endpoint}`;
};
