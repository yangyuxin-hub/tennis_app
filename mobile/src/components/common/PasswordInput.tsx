/**
 * 密码输入框组件（带显示/隐藏切换）
 * @figma 03-02-login-filled-pass-hide / 03-03-login-filled-pass-unhide
 */
import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../design-tokens';

interface PasswordInputProps extends TextInputProps {
  label?: string;
  error?: string;
  showStrength?: boolean;
  containerStyle?: ViewStyle;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  showStrength = false,
  containerStyle,
  style,
  value,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 密码强度检测
  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
    if (!password) return null;
    
    const length = password.length;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (length >= 8 && hasLetter && hasNumber && hasSpecial) {
      return 'strong';
    } else if (length >= 6 && (hasLetter || hasNumber)) {
      return 'medium';
    } else {
      return 'weak';
    }
  };
  
  const strength = showStrength ? getPasswordStrength(value as string) : null;
  
  const getStrengthColor = () => {
    switch (strength) {
      case 'strong':
        return colors.status.success;
      case 'medium':
        return colors.status.warning;
      case 'weak':
        return colors.status.error;
      default:
        return colors.border.default;
    }
  };
  
  const getStrengthText = () => {
    switch (strength) {
      case 'strong':
        return '强';
      case 'medium':
        return '中';
      case 'weak':
        return '弱';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={!isVisible}
          value={value}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsVisible(!isVisible)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
      
      {showStrength && strength && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthIndicator,
                {
                  width: strength === 'strong' ? '100%' : strength === 'medium' ? '66%' : '33%',
                  backgroundColor: getStrengthColor(),
                },
              ]}
            />
          </View>
          <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
            密码强度: {getStrengthText()}
          </Text>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingRight: 50, // 为眼睛图标留出空间
    ...typography.input,
    color: colors.text.primary,
    backgroundColor: colors.background.main,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: 15,
    padding: spacing.xs,
  },
  strengthContainer: {
    marginTop: spacing.sm,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: radius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  strengthIndicator: {
    height: '100%',
    borderRadius: radius.sm,
  },
  strengthText: {
    ...typography.caption,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});

