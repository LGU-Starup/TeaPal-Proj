/* craco.config.js */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                '@primary-color': '#73389b', // 全局主色
                '@link-color': '#eea333', // 链接色
                '@border-radius-base': '8px', // 组件/浮层圆角
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};