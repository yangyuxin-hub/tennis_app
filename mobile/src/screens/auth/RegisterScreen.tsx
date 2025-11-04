/**
 * 注册页面
 * @figma 
 * - 05-01-signup-blank (空白状态)
 * - 05-02-signup-filled-pass-strong (强密码)
 * - 05-03-signup-filled-pass-weak (弱密码)
 * - 05-04-signup-filled-pass-weak-failed (注册失败)
 * - 05-05-signup-success-loading-circle (注册成功加载中)
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
import { authService } from '../../services/authService';
import { colors, typography, spacing } from '../../design-tokens';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }
    
    if (!email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 8) {
      newErrors.password = '密码至少8个字符';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理注册
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username,
        email,
        password,
      });
      
      // 注册成功，导航到主页面
      Alert.alert(
        '注册成功',
        '欢迎加入！',
        [
          {
            text: '确定',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('注册失败:', error);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          '注册失败，请稍后重试';
      
      // 处理特定错误
      if (error.response?.status === 400) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          if (detail.includes('username')) {
            setErrors({ username: '用户名已存在' });
            return;
          } else if (detail.includes('email')) {
            setErrors({ email: '邮箱已被注册' });
            return;
          }
        }
      }
      
      Alert.alert('注册失败', errorMessage);
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
          {/* 标题区域 */}
          <View style={styles.header}>
            <Text style={styles.title}>创建账户</Text>
            <Text style={styles.subtitle}>加入我们的社区</Text>
          </View>

          {/* 表单区域 */}
          <View style={styles.form}>
            <Input
              label="用户名"
              placeholder="请输入用户名（3-20个字符）"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors({ ...errors, username: undefined });
                }
              }}
              error={errors.username}
              autoCapitalize="none"
              autoComplete="username"
            />

            <Input
              label="邮箱"
              placeholder="请输入邮箱地址"
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
              placeholder="请输入密码（至少8个字符）"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              error={errors.password}
              showStrength={true}
            />

            <PasswordInput
              label="确认密码"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: undefined });
                }
              }}
              error={errors.confirmPassword}
            />

            {/* 注册按钮 */}
            <Button
              title="注册"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
            />

            {/* 登录链接 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>已有账户？</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>立即登录</Text>
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
  registerButton: {
    marginTop: spacing.md,
    width: '100%',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: '600',
  },
});

