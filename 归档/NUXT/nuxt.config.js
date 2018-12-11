// import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

export default {
  /*
   ** 页面头部信息
   */
  head: {
    title: 'RightBTC',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'RightBtc' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      // {src: `//g.alicdn.com/sd/ncpc/nc.js?t=${new Date().getTime()}`},
      // {src: `//g.alicdn.com/sd/nch5/index.js?t=${new Date().getTime()}`},
      // {src: 'https://static.zdassets.com/ekr/snippet.js?key=b2d70176-39d4-4e38-9667-236aa0221027', id: "ze-snippet", async: 'asnyc' } //引入本地js文件
      { src: '/lib/rightbtc/lib.min.js' },
    ],
  },
  env: {
    myEnv: process.env.MY_ENV || 'dev',
  },
  /*
   ** 插件
   */
  plugins: [{ src: '~/plugins/', ssr: false }, { src: '~/plugins/ga', ssr: false }, { src: '~/plugins/element', ssr: true }, { src: '~/plugins/swiper.js', ssr: false }],
  /*
   ** loadingbar颜色
   */
  loading: { color: '#5693FF' },
  /*
   ** css预编译
   */
  css: [
    { src: '~assets/css/main.scss', lang: 'scss' }, // 指定 scss 而非 sass
    { src: '~assets/icon-font/iconfont.css' },
    'swiper/dist/css/swiper.css',
  ],
  /*
   ** 处理路由跳转前
   */
  router: {
    linkActiveClass: 'active',
  },
  //增加缓存 cache: {
  //   max: 1000,
  //   maxAge: 900000
  // }
  cache: true,
  //增加多模块同时loading组组件
  modules: [
    // Optionally passing options in module configuration
    // ['vue-wait/nuxt', { useVuex: true, accessorName: '$l' }]
  ],

  // Optionally passing options in module top level configuration
  // wait: { useVuex: true },
  /*
   ** 构建配置
   */
  build: {
    publicPath: '/rightbtc/',
    // analyze: false,
    // vendor: ['axios', '~/plugins/', '~/plugins/element', '~/plugins/swiper', '~/plugins/ga', 'moment'],
    loaders: [
      {
        test: /\.(sass|scss)$/,
        loaders: ['style', 'css', 'scss'],
      },
    ],
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      // if (isClient && !isDev) {
      //   console.log('1');
      //   config.plugins.push(
      //     new UglifyJSPlugin({
      //       uglifyOptions: {
      //         compress: {
      //           warnings: false,
      //           drop_debugger: true,
      //           drop_console: true,
      //         },
      //       },
      //     }),
      //   );
      // }

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
