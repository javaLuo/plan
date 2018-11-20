import axios from 'axios';
import Configs from '../common/config';
import Utils from '~/utils/';
import Storage from '~/utils/storage';

//axios.defaults.timeout = TIMEOUT; //tslint:disable-line

// 禁止缓存
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = Configs.DEFAULT.OTC_API;
console.log(Configs.DEFAULT.OTC_API)
//request to show loading

axios.interceptors.request.use(
  config => {
    // const { token } = this.$cookies.get('globals') ? this.$cookies.get('globals') : '';
    // config.headers.token = token;
    // if (config.url.indexOf('user') > 0) {
    //   config.baseURL = Configs.DEFAULT.ORIGINAL_API;
    // } else if (config.url.indexOf('ticket') > 0) {
    //   config.baseURL = Configs.DEFAULT.TICKET_API;
    // } else {
    //   config.baseURL = Configs.DEFAULT.OTC_API;
    // }

    //	const { token } = cookies.get("globals") ? cookies.get("globals") : "";
    // if (config.url.indexOf("kyc") > 0) {
    // 	config.baseURL = configs.kycUrl;
    // 	if (token) {
    // 		config.headers.token = token;
    // 	}
    // } else if (config.url.indexOf("google") > 0 && config.url.indexOf("user") > 0) {
    // 	config.baseURL = configs.googleUrl;
    // 	if (token) {
    // 		config.headers.token = token;
    // 	}
    // } else if (config.url.indexOf("user") > 0) {
    // 	config.baseURL = configs.userUrl;
    // 	if (token) {
    // 		config.headers.token = token;
    // 	}
    // } else if (config.url.indexOf("ticket") > 0) {
    // 	config.baseURL = configs.workorder;
    // 	if (token) {
    // 		config.headers.token = token;
    // 	}
    // } else {
    // 	config.baseURL = configs.baseUrl;
    // }
    //	config.baseURL = configs.baseUrl;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//response to hide loading
axios.interceptors.response.use(
  response => {
    // return response;
    const code = response && response.data ? response.data.code : 200;

    const errorCode =
			(response && response.data && response.data.code && response.data.code !== 200) || false;

    //映射错误消息
    // if (response && response.data && Utils.isObject(response.data) && errorCode && ErrorCode) {
    //   let message = ErrorCode[code];
    //   if (code == 452 || code == 224) {
    //     message = message.replace(/count/, response.data.description);
    //   }
    //   response.data.message = message;
    // }
    if (code === 401) {
      if (typeof window === 'undefined') return
      console.log('登录状态已失效1', Configs.DEFAULT.LOGIN_URL);
      location.href = Configs.DEFAULT.LOGIN_URL + `?returnUrl=${location.pathname}`;
      // Storage.remove('globals');
      // Storage.remove('isLogin');
      // Storage.remove('username');
      // Storage.remove('currentNickname');
      // Router.push(`/${cookies.get("locale")}/login`);
    } else {
      return response && response.data
        ? response.data
        : response && response.status
          ? response.status
          : null;
    }
  },
  error => {
    let code = error.response ? error.response.status : '';
    // //没有权限，登出，跳转登录
    if (code === 401) {
      if (typeof window === 'undefined') return
      console.log('登录状态已失效2', Configs.DEFAULT.LOGIN_URL);
      location.href = Configs.DEFAULT.LOGIN_URL + `?returnUrl=${location.pathname}`;
      // Storage.remove('globals');
      // Storage.remove('isLogin');
      // Storage.remove('username');
      // Storage.remove('currentNickname');
    }
  }
);

// debug(axios.defaults)
export default axios;
