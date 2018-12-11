import Vuex from 'vuex';
import i18n from '~/common/i18n';
import home from './modules/home';
import user from './modules/user';
import settings from './modules/settings';
import Storage from '~/utils/storage';
import utils from '~/utils';
import asset from './modules/asset';
import tokensell from './modules/tokensell';
import assets from './modules/assets';
import bake from './modules/bake';
import trade from './modules/trade';

const createStore = () => {
  return new Vuex.Store({
    modules: {
      home,
      user,
      settings,
      asset,
      tokensell,
      assets,
      bake,
      trade,
    },
    state: {
      locale: 'en_us',
      isLogin: false,
      userName: '',
      i18n: i18n.get('en_us'),
      theme: 'light', // 全局主题 light/dark
      crumb: 'Asset',
      activePage: '',
    },
    mutations: {
      setI18n(state, val) {
        state.i18n = i18n.get(val);
        state.locale = val;
        Storage.set('locale', val);
      },
      setCrumb(state, val) {
        state.crumb = val;
      },
      setLoginStatus(state, obj) {
        state[obj.key] = obj.val;
      },
      // 设置主题
      setTheme(state, val) {
        if (val) {
          state.theme = val;
          process.browser && document.documentElement.setAttribute('data-theme', val);
        } else {
          state.theme = state.theme === 'light' ? 'dark' : 'light';
          process.browser && document.documentElement.setAttribute('data-theme', state.theme);
        }
        // debugger;

        Storage.set('theme', state.theme);
      },
      //仅交易页使用 目前
      setActivePage(state, val) {
        state.activePage = val;
      },
    },
    actions: {
      async nuxtServerInit({ state, commit }, { query, isDev, res, req, redirect }) {
        if (query.at) {
          const { isLogin, locale } = JSON.parse(atob(query.at));
          // http://localhost:4000/u/login?at=eyJpc0xvZ2luIjpmYWxzZSwibG9jYWxlIjoiZW5fdXMifQ%3D%3D
          if (process.server) {
            res.setHeader('Set-Cookie', [`isLogin=${isLogin}`, `locale=${locale}`]); // Server-side
          } else {
            document.cookie = `isLogin=${isLogin};locale=${locale}`; // Client-side
          }
        }
        let locale = utils.getCookie(req.headers.cookie, 'locale') || state.locale; //如果都一次打开浏览器没有的时候取本地默认
        let isLogin = utils.getCookie(req.headers.cookie, 'isLogin');
        let userName = utils.getCookie(req.headers.cookie, 'username');
        let theme = utils.getCookie(req.headers.cookie, 'theme');
        if (locale) {
          commit('setI18n', locale);
        } else {
          commit('setI18n', 'en_us');
        }
        if (isLogin === 'true') {
          commit('setLoginStatus', { key: 'isLogin', val: true });
          if (userName) {
            commit('setLoginStatus', { key: 'userName', val: userName });
          }
        }
        if (theme) {
          commit('setTheme', theme);
        }
      },

      //仅交易页使用 目前
      setTradePage({ state, commit }, val) {
        console.log('222222', val);
        commit('setActivePage', val);
      },
    },
  });
};

export default createStore;
