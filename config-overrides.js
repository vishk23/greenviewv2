const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@features': path.resolve(__dirname, 'src/features'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@contexts': path.resolve(__dirname, 'src/contexts'),
    '@public': path.resolve(__dirname, 'public'),
    '@services': path.resolve(__dirname, 'src/services'),
  })
);