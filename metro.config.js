/**
 * Metro configuration for React Native with performance optimizations
 * https://facebook.github.io/metro/docs/configuration
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      drop_console: true, // Remove console.logs in production
    },
  },
  // Enable Hermes for better performance
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true, // Inline requires for faster startup
    },
  }),
};

// Optimize resolver
config.resolver = {
  ...config.resolver,
  // Asset extensions
  assetExts: [...config.resolver.assetExts, 'db', 'mp3', 'jpg', 'png', 'gif'],
  // Source extensions
  sourceExts: [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'json'],
};

module.exports = config;
