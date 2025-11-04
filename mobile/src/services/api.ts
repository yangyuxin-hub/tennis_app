/**
 * API 客户端
 * 使用 Axios 进行 HTTP 请求
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误和 token 刷新
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
    // 如果是 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          // 尝试刷新 token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/api/auth/refresh`,
            { refresh_token: refreshToken }
          );
          
          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          // 更新 store
          await useAuthStore.getState().setToken(access_token);
          await useAuthStore.getState().setRefreshToken(newRefreshToken);
          
          // 重试原请求
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除 token 并登出
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    // 其他错误直接返回
    return Promise.reject(error);
  }
);

export default apiClient;

