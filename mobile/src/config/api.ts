/**
 * API 配置
 */
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:8000'  // 开发环境
    : 'https://api.tennis.yourdomain.com', // 生产环境
  TIMEOUT: 10000,
};

