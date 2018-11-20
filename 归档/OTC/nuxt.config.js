// 配置参考 https://zh.nuxtjs.org/guide/configuration
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'RightBTC OTC',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: 'OTC' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // script: [
    //   { innerHTML: `window.$zopim||(function(d,s){var z=$zopim=function(c){
    //     z._.push(c)},$=z.s=
    //     d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
    //     _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
    //     $.src='https://v2.zopim.com/?5kSl85wM8lJgVCC1JALToX5nQ2YzmUT8';z.t=+new Date;$.
    //     type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');`, type: 'text/javascript', charset: 'utf-8'}
    // ],
    // __dangerouslyDisableSanitizers: ['script']
  },
  env: {
    __ENV: process.env.__ENV,
  },
  plugins: [{ src: '~/plugins/', ssr: false }, { src: '~/plugins/element', ssr: true }],
  // modules: ['@nuxtjs/proxy'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#5693FF' },
  /*
  ** Build configuration
  */
  // proxy: [
  //   ['/ad',{target: 'http://10.10.10.142:8080'}]
  // ],
  css: [
    { src: '~assets/css/main.scss', lang: 'scss' }, // 指定 scss 而非 sass
    { src: '~assets/css/_Header.scss', lang: 'scss' }, // 指定 scss 而非 sass
    { src: '~assets/css/_Layout.scss', lang: 'scss' }, // 指定 scss 而非 sass
    { src: '~assets/css/_Element.scss', lang: 'scss' }, // 指定 scss 而非 sass
    { src: '~assets/css/_Modal.scss', lang: 'scss' },
    { src: '~assets/icon-font/iconfont.css' },
  ],
  router: {
    linkActiveClass: 'active',
    middleware: 'nickname',
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'updateAd',
        path: '/ad/updateAd/:id',
        component: resolve(__dirname, './pages/ad/editAd.vue'),
      });
    },
    // middleware: 'userInfo'
  },
  cache: true,
  build: {
    // analyze: true,
    publicPath: '/rightbtcotc/',
    vendor: ['axios', '~/plugins/', '~/plugins/element'],
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
