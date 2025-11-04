/**
 * 按钮组件
 * @figma Tennis-Frog 设计规范
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../design-tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant]];
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    if (style) {
      baseStyle.push(style);
    }
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${variant}Text` as keyof typeof styles]];
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.white : colors.primary.main}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  // Primary 按钮 - 深绿色背景
  primary: {
    backgroundColor: colors.primary.main,
  },
  primaryText: {
    color: colors.text.white,
    ...typography.button,
  },
  
  // Secondary 按钮 - 网球绿背景
  secondary: {
    backgroundColor: colors.secondary.tennis,
  },
  secondaryText: {
    color: colors.text.white,
    ...typography.button,
  },
  
  // Outline 按钮 - 边框样式
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  outlineText: {
    color: colors.primary.main,
    ...typography.button,
  },
  
  // Text 按钮 - 文本样式
  text: {
    backgroundColor: 'transparent',
  },
  textText: {
    color: colors.primary.main,
    ...typography.button,
  },
  
  // 禁用状态
  disabled: {
    opacity: 0.5,
  },
  
  text: {
    ...typography.button,
  },
});

