/**
 * 认证服务
 * 处理所有与认证相关的 API 调用
 */
import apiClient from './api';
import { useAuthStore } from '../store/authStore';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  new_password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    is_verified: boolean;
  };
}

export const authService = {
  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    if (credentials.username) {
      formData.append('username', credentials.username!);
    } else if (credentials.email) {
      formData.append('email', credentials.email!);
    }
    formData.append('password', credentials.password);
    
    const response = await apiClient.post<AuthResponse>('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // 保存到 store
    await useAuthStore.getState().login(
      response.data.user,
      response.data.access_token,
      response.data.refresh_token
    );
    
    return response.data;
  },
  
  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    
    // 保存到 store
    await useAuthStore.getState().login(
      response.data.user,
      response.data.access_token,
      response.data.refresh_token
    );
    
    return response.data;
  },
  
  /**
   * 忘记密码 - 发送验证码
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/forgot-password', data);
    return response.data;
  },
  
  /**
   * 验证验证码
   */
  async verifyCode(data: VerifyCodeData): Promise<{ valid: boolean }> {
    const response = await apiClient.post('/api/auth/verify-code', data);
    return response.data;
  },
  
  /**
   * 重置密码
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/reset-password', data);
    return response.data;
  },
  
  /**
   * 刷新 Token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    // 更新 store
    await useAuthStore.getState().setToken(response.data.access_token);
    await useAuthStore.getState().setRefreshToken(response.data.refresh_token);
    
    return response.data;
  },
  
  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论请求成功与否，都清除本地状态
      await useAuthStore.getState().logout();
    }
  },
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    useAuthStore.getState().setUser(response.data);
    return response.data;
  },
  
  /**
   * 检查用户名是否可用
   */
  async checkUsername(username: string): Promise<{ available: boolean }> {
    const response = await apiClient.get(`/api/auth/check-username?username=${username}`);
    return response.data;
  },
  
  /**
   * 检查邮箱是否已注册
   */
  async checkEmail(email: string): Promise<{ registered: boolean }> {
    const response = await apiClient.get(`/api/auth/check-email?email=${email}`);
    return response.data;
  },
};

