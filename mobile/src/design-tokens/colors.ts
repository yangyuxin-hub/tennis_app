/**
 * 颜色设计规范
 * 根据 Figma 设计文件提取
 * @figma Tennis-Frog
 */
export const colors = {
  // 主色调 - 深绿色（品牌色）
  primary: {
    main: '#274125',      // RGB(39, 65, 37) - 从启动页背景提取
    dark: '#1a2e19',
    light: '#3d5a3b',
  },
  
  // 辅助色
  secondary: {
    tennis: '#7CB342',    // 网球绿
    accent: '#4CAF50',     // 强调色
  },
  
  // 灰度
  gray: {
    light: '#DADADA',      // RGB(218, 218, 218)
    medium: '#888888',
    dark: '#383838',       // RGB(56, 56, 56)
  },
  
  // 背景色
  background: {
    main: '#FFFFFF',
    secondary: '#F5F5F5',
    dark: '#274125',
  },
  
  // 文本色
  text: {
    primary: '#000000',
    secondary: '#666666',
    white: '#FFFFFF',
    disabled: '#999999',
  },
  
  // 状态色
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  
  // 边框色
  border: {
    light: '#E0E0E0',
    default: '#DADADA',
    dark: '#CCCCCC',
  },
};

