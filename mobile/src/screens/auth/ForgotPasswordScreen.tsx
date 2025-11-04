/**
 * 忘记密码流程页面
 * @figma 
 * - 04-01-forgot-password-email-blank (邮箱空白)
 * - 04-02-forgot-password-email-filled (邮箱已填写)
 * - 04-03-code-verification (验证码验证)
 * - 04-04-reset-password-blank (重置密码空白)
 * - 04-05-reset-password-filled-strong (强密码)
 * - 04-06-reset-password-filled-weak (弱密码)
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

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

type Step = 'email' | 'code' | 'reset';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // 发送验证码
  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrors({ email: '请输入邮箱' });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: '请输入有效的邮箱地址' });
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      Alert.alert('验证码已发送', '请查看您的邮箱');
      setStep('code');
      setCountdown(60); // 60秒倒计时
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      Alert.alert('发送失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setErrors({ code: '请输入验证码' });
      return;
    }
    
    if (code.length !== 6) {
      setErrors({ code: '验证码为6位数字' });
      return;
    }

    setLoading(true);
    try {
      await authService.verifyCode({ email, code });
      setStep('reset');
    } catch (error: any) {
      console.error('验证码验证失败:', error);
      const errorMessage = error.response?.data?.detail || '验证码无效或已过期';
      setErrors({ code: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    const newErrors: typeof errors = {};
    
    if (!newPassword) {
      newErrors.password = '请输入新密码';
    } else if (newPassword.length < 8) {
      newErrors.password = '密码至少8个字符';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        code,
        new_password: newPassword,
      });
      
      Alert.alert(
        '密码重置成功',
        '请使用新密码登录',
        [
          {
            text: '确定',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('重置密码失败:', error);
      const errorMessage = error.response?.data?.detail || '重置密码失败，请稍后重试';
      Alert.alert('重置失败', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 重新发送验证码
  const handleResendCode = () => {
    if (countdown > 0) return;
    handleSendCode();
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
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 'email' && '忘记密码'}
              {step === 'code' && '验证邮箱'}
              {step === 'reset' && '重置密码'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'email' && '请输入您的邮箱地址'}
              {step === 'code' && '请输入收到的验证码'}
              {step === 'reset' && '请设置新密码'}
            </Text>
          </View>

          <View style={styles.form}>
            {/* 步骤1: 输入邮箱 */}
            {step === 'email' && (
              <>
                <Input
                  label="邮箱"
                  placeholder="请输入注册邮箱"
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
                <Button
                  title="发送验证码"
                  onPress={handleSendCode}
                  loading={loading}
                />
              </>
            )}

            {/* 步骤2: 输入验证码 */}
            {step === 'code' && (
              <>
                <Input
                  label="验证码"
                  placeholder="请输入6位验证码"
                  value={code}
                  onChangeText={(text) => {
                    setCode(text.replace(/[^0-9]/g, '').slice(0, 6));
                    if (errors.code) {
                      setErrors({ ...errors, code: undefined });
                    }
                  }}
                  error={errors.code}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Button
                  title="验证"
                  onPress={handleVerifyCode}
                  loading={loading}
                  style={styles.button}
                />
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={countdown > 0}
                  style={styles.resendContainer}
                >
                  <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
                    {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送验证码'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* 步骤3: 重置密码 */}
            {step === 'reset' && (
              <>
                <PasswordInput
                  label="新密码"
                  placeholder="请输入新密码（至少8个字符）"
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  error={errors.password}
                  showStrength={true}
                />
                <PasswordInput
                  label="确认密码"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  error={errors.confirmPassword}
                />
                <Button
                  title="重置密码"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={styles.button}
                />
              </>
            )}

            {/* 返回登录 */}
            <TouchableOpacity
              style={styles.backContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backText}>返回登录</Text>
            </TouchableOpacity>
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
  button: {
    marginTop: spacing.md,
    width: '100%',
  },
  resendContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  resendText: {
    ...typography.bodySmall,
    color: colors.primary.main,
  },
  resendDisabled: {
    color: colors.text.disabled,
  },
  backContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  backText: {
    ...typography.body,
    color: colors.primary.main,
  },
});

