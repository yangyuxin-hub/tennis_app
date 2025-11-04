/**
 * 认证状态管理
 * 使用 Zustand 进行状态管理
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  is_verified: boolean;
}

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // 方法
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
  login: (user: User, token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 初始状态
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  
  // 设置用户
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  // 设置 Access Token
  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('access_token', token);
      set({ token, isAuthenticated: true });
    } else {
      await AsyncStorage.removeItem('access_token');
      set({ token: null });
    }
  },
  
  // 设置 Refresh Token
  setRefreshToken: async (refreshToken) => {
    if (refreshToken) {
      await AsyncStorage.setItem('refresh_token', refreshToken);
      set({ refreshToken });
    } else {
      await AsyncStorage.removeItem('refresh_token');
      set({ refreshToken: null });
    }
  },
  
  // 登录
  login: async (user, token, refreshToken) => {
    await AsyncStorage.setItem('access_token', token);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
    });
  },
  
  // 登出
  logout: async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
    
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
  
  // 初始化（从本地存储恢复状态）
  initialize: async () => {
    try {
      const [token, refreshToken, userStr] = await AsyncStorage.multiGet([
        'access_token',
        'refresh_token',
        'user',
      ]);
      
      const tokenValue = token[1];
      const refreshTokenValue = refreshToken[1];
      const userValue = userStr[1];
      
      if (tokenValue && refreshTokenValue && userValue) {
        const user = JSON.parse(userValue);
        set({
          user,
          token: tokenValue,
          refreshToken: refreshTokenValue,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error);
      set({ isLoading: false });
    }
  },
}));

