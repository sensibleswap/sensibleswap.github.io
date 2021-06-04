import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  history: {
    type: 'hash',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '/assets/ts.png',
  routes,
  fastRefresh: {},
  cssModulesTypescriptLoader: {},
  alias: {
    lib: '@/lib',
    i18n: '@/i18n',
    components: '@/components',
    common: '@/common',
    api: '@/api'
  },
  proxy: {
      context: ['/allpairs', '/swapinfo'],
      target: 'http://47.244.2.233:18333',
  },
  copy: [
    {
      from: 'public/assets/',
      to: 'assets/'
    }
  ],
  chunks: ['vendors', 'umi', 'echarts', 'react'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {

            // voltsdk: {
            //   name: "voltsdk",
            //   test: /[\\/]node_modules[\\/](voltsdk)[\\/]/,
            //   priority: 10,
            //   enforce: true,
            // },
            umi: {
              name: "umi",
              test: /[\\/]node_modules[\\/](umi)[\\/]/,
              priority: 10,
              enforce: true,
            },
            echarts: {
              name: "echarts",
              test: /[\\/]node_modules[\\/](echarts)[\\/]/,
              priority: 10,
              enforce: true,
            },
            react: {
              name: "react",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 10,
              enforce: true,
            },
            vendors: {
              name: "vendors",
              test: /[\\/]node_modules[\\/](?!voltsdk|umi|echarts|msgpack5|react|react-dom).*$/,
              priority: 11,
              enforce: true,
            },
          },
        },
      }
    });
  },
});
