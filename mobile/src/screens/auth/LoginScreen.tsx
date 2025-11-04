/**
 * 登录页面
 * @figma 
 * - 03-01-login-blank (空白状态)
 * - 03-02-login-filled-pass-hide (已填写，密码隐藏)
 * - 03-03-login-filled-pass-unhide (已填写，密码显示)
 * - 03-04-login-success-loading-circle (登录成功加载中)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Input } from '../../components/common/Input';
import { PasswordInput } from '../../components/common/PasswordInput';
import { Button } from '../../components/common/Button';
import { authService, LoginCredentials } from '../../services/authService';
import { colors, typography, spacing } from '../../design-tokens';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!email.trim()) {
      newErrors.email = '请输入邮箱或用户名';
    } else if (!email.includes('@') && email.length < 3) {
      newErrors.email = '用户名至少3个字符';
    } else if (email.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码至少6个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginCredentials = {
        password,
      };
      
      // 判断是邮箱还是用户名
      if (email.includes('@')) {
        credentials.email = email;
      } else {
        credentials.username = email;
      }
      
      await authService.login(credentials);
      
      // 登录成功，导航到主页面
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      console.error('登录失败:', error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          '登录失败，请检查您的账号和密码';
      
      Alert.alert('登录失败', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo 或标题区域 */}
          <View style={styles.header}>
            <Text style={styles.title}>欢迎回来</Text>
            <Text style={styles.subtitle}>登录您的账户</Text>
          </View>

          {/* 表单区域 */}
          <View style={styles.form}>
            <Input
              label="邮箱或用户名"
              placeholder="请输入邮箱或用户名"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <PasswordInput
              label="密码"
              placeholder="请输入密码"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              error={errors.password}
            />

            {/* 忘记密码链接 */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>忘记密码？</Text>
            </TouchableOpacity>

            {/* 登录按钮 */}
            <Button
              title="登录"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />

            {/* 注册链接 */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>还没有账户？</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>立即注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.bodySmall,
    color: colors.primary.main,
  },
  loginButton: {
    marginTop: spacing.md,
    width: '100%',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    ...typography.body,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  registerLink: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
});

