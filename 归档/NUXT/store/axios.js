import axios from 'axios';
import Configs from '../common/config';
import Storage from '~/utils/storage';
import bus from '~/plugins/bus';
import Vue from 'vue';
import vm from '~/app';

const hasTimeOutBox = () => {
  return Boolean(document.querySelector('.timeoutbox'));
};

const timeoutText = {
  zh_cn: {
    content: '登录超时，请重新登录！',
    title: '通知',
    confirmBtn: '确定',
  },
  en_us: {
    content: 'Login timeout, please login again!',
    title: 'Notice',
    confirmBtn: 'Confirm',
  },
  ja_jp: {
    content: 'ログインがタイムアウトしました。もう一度ログインしてください！',
    title: 'お知らせ',
    confirmBtn: '決定する',
  },
  ru_ru: {
    content: 'Ваш логин истек,входите снова！',
    title: 'Сообщение',
    confirmBtn: 'Подтвердить',
  },
};
// 禁止缓存
axios.defaults.withCredentials = true;

axios.defaults.baseURL = Configs.DEFAULT.RB_API;
// console.log('地址', Configs.DEFAULT.OTC_API)
//request to show loading
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

//response to hide loading
axios.interceptors.response.use(
  response => {
    Storage.setItem('ip', response.headers['client_ip']);
    const code = response && response.data ? response.data.code : 200;
    // const errorCode =
    //   (response && response.data && response.data.code && response.data.code != 200) || false;
    //没有权限，登出，跳转登录
    if (code === 401 || code === 14401) {
      console.log('登录状态已失效1');
      if (typeof window === 'undefined') return;
      let locale = !!Storage.get('locale') && Storage.get('locale') !== 'undefined' ? Storage.get('locale') : 'en_us';
      let text = timeoutText[locale];
      if (!hasTimeOutBox()) {
        vm.$alert(text.content, text.title, {
          confirmButtonText: text.confirmBtn,
          showClose: false,
          center: false,
          confirmButtonClass: 'timeoutbtn',
          customClass: 'timeoutbox',
          callback: action => {
            Storage.remove('globals');
            Storage.remove('isLogin');
            Storage.remove('username');

            location.href = '/u/login';
          },
        });
      }
    } else {
      return response && response.data ? response.data : response && response.status ? response.status : null;
    }
  },
  error => {
    let code = error.response ? error.response.status : '';
    //没有权限，登出，跳转登录
    if (code === 401 || code === 14401) {
      console.log('登录状态已失效2');
      if (typeof window === 'undefined') return;
      let locale = !!Storage.get('locale') && Storage.get('locale') !== 'undefined' ? Storage.get('locale') : 'en_us';
      let text = timeoutText[locale];

      if (!hasTimeOutBox()) {
        vm.$alert(text.content, text.title, {
          confirmButtonText: text.confirmBtn,
          showClose: false,
          center: false,
          confirmButtonClass: 'timeoutbtn',
          customClass: 'timeoutbox',
          callback: action => {
            Storage.remove('globals');
            Storage.remove('isLogin');
            Storage.remove('username');

            location.href = '/u/login';
          },
        });
      }
    }
    //出发一个事件 表示 请求 错误 或 超时
    bus.trigger('axios/error', error.response);
  },
);

export default axios;
