import Vuex from 'vuex';
import i18n from '~/common/i18n';
import ad from './modules/ad';
import order from './modules/order';
import member from './modules/member';
import account from './modules/account';
import other from './modules/other';
import Storage from '~/utils/storage';
import utils from '~/utils';

const createStore = () => {
  return new Vuex.Store({
    modules: {
      ad,
      order,
      member,
      account,
      other,
    },
    state: {
      locale: 'en_us',
      isLogin: false,
      i18n: i18n.get('en_us'),
      rightOrderShow: false,
      preRightOrderShow: false,
      currentNickname: '',
    },
    mutations: {
      setI18n(state, val) {
        state.i18n = i18n.get(val);
        state.locale = val;
      },
      setNickName(state, val) {
        state.currentNickname = val;
      },
      setLoginStatus(state, val) {
        state.isLogin = val;
      },
      setROrder(state, val) {
        state.rightOrderShow = !state.rightOrderShow;
        state.preRightOrderShow = state.rightOrderShow;
      },
      setOrderHide(state, val) {
        state.rightOrderShow = false;
      },
      setOrderShow(state, val) {
        state.rightOrderShow = true;
      },
    },
    actions: {
      async nuxtServerInit({ state, commit }, { isDev, req, redirect }) {
        console.log('req.headers.cookie', req.headers.cookie);
        let locale = utils.getCookie(req.headers.cookie, 'locale') || state.locale; //如果都一次打开浏览器没有的时候取本地默认
        let currentNickname = utils.getCookie(req.headers.cookie, 'currentNickname'); //如果都一次打开浏览器没有的时候取本地默认
        let isLogin = utils.getCookie(req.headers.cookie, 'isLogin');
        // 没有日文，从rightBTC日文跳OTC会出现nuxt server error
        if (locale && ['zh_cn', 'en_us'].includes(locale)) {
          commit('setI18n', locale);
        } else {
          commit('setI18n', 'en_us');
        }
        if (isLogin === 'true') {
          commit('setLoginStatus', true);
          if (!!currentNickname && currentNickname !== 'null') {
            commit('setNickName', currentNickname);
          }
        }
      },
    },
    getters: {
      isSettedNickName(state) {
        return !!state.currentNickname && state.currentNickname !== 'null';
      },
      isLogin(state) {
        return !!state.isLogin;
      },
    },
  });
};

export default createStore;
