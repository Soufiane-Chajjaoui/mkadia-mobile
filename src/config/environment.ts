import {
  API_BASE_URL,
  APP_NAME,
  DEBUG_MODE,
  LOG_LEVEL,
  MIN_ORDER_AMOUNT,
  ENABLE_MOCK_DATA,
  ENABLE_FLIPPER,
  DEFAULT_LOCATION,
  API_TIMEOUT,
  MEDIA_HOST
} from '@env';

export const environment = {
  // API Configuration
  apiBaseUrl: API_BASE_URL || 'https://api.mkadia.com/api',
  mediaHost: MEDIA_HOST || 'https://media.mkadia.com',
  apiTimeout: parseInt(API_TIMEOUT || '10000'),
  
  // App Configuration
  appName: APP_NAME || 'Mkadia',
  defaultLocation: DEFAULT_LOCATION || 'Safi, Maroc',
  minOrderAmount: parseInt(MIN_ORDER_AMOUNT || '150'),
  
  // Debug & Development
  isDebug: DEBUG_MODE === 'true',
  logLevel: LOG_LEVEL || 'info',
  enableMockData: ENABLE_MOCK_DATA === 'true',
  enableFlipper: ENABLE_FLIPPER === 'true',
  
  // Computed values
  isDevelopment: DEBUG_MODE === 'true' && API_BASE_URL?.includes('localhost'),
  isStaging: API_BASE_URL?.includes('staging'),
  isProduction: DEBUG_MODE === 'false' && !API_BASE_URL?.includes('localhost') && !API_BASE_URL?.includes('staging'),
};

// Helper functions
export const getEnvironmentName = (): string => {
  if (environment.isDevelopment) return 'development';
  if (environment.isStaging) return 'staging';
  if (environment.isProduction) return 'production';
  return 'unknown';
};

export const shouldLog = (level: 'debug' | 'info' | 'warn' | 'error'): boolean => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevelIndex = levels.indexOf(environment.logLevel);
  const requestedLevelIndex = levels.indexOf(level);
  return requestedLevelIndex >= currentLevelIndex;
};
