const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 在 web 平台强制使用 .js 而非 .mjs，避免 import.meta 问题
config.resolver.sourceExts = ['tsx', 'ts', 'jsx', 'js', 'json'];

module.exports = config;

