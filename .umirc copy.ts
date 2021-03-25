import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/assets/fav.png',
  routes,
  fastRefresh: {},
  cssModulesTypescriptLoader: {},
  alias: {
    lib: '@/lib',
    i18n: '@/i18n',
    components: '@/components',
    common: '@/common'
  },
  proxy: {
    '/api.json': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
    }
  },
  copy: [
    {
      from: 'public/assets/',
      to: 'assets/'
    }
  ],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react)[\\/]/,
              priority: 9,
              enforce: true,
            },
            reactDom: {
              name: "react-dom",
              test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
              priority: 9,
              enforce: true,
            },
            echarts: {
              name: "echarts",
              test: /[\\/]node_modules[\\/](echarts)[\\/]/,
              priority: 9,
              enforce: true,
            },
            antd: {
              name: "antd",
              test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
              priority: 10,
              enforce: true,
            },
            vendors: {
              name: "vendors",
              test: /[\\/]node_modules[\\/](?!react-dom|react|echarts|@ant-design|antd|antd-mobile).*$/,
              priority: 11,
              enforce: true,
            },
          },
        },
      }
    });
  },
});
