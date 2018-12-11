import * as types from './type';
import * as api from './api';
import Storage from '~/utils/storage';
import Utils from '~/utils/';
import { __await } from 'tslib';

let timer = null;
export default {
  state: {
    imgParameter: '',
    phoneArea: '0044',
    isAccountExist: false,
    loginData: {},
    currentOtc: {},
    areaList: [], //国家列表
    areaNumberList: null, //区号列表
    //isSendCode: false, //是否可以发送验证码
    sendCodeParams: {
      //发送验证码参数
      captcha: '', //验证码
      phoneArea: '0044',
      userName: '',
    },
    isSendCodeSuccess: false, //是否发送验证码成功
    isShowCountDown: false, //是否显示倒计时
    countDown: 60, //倒计时秒
    registerSuccess: false, //是否注册成功
    isGoogleCodeCorrect: false, //谷歌验证是否通过
    googleBindUrl: '', //谷歌url
    googleSecretKey: '', //谷歌验证码
    isVerificationCode: false, //找回密码时验证码是否验证成功
    userStatus: {}, //用户绑定状态
    nationalityId: 182, //注册，选中的区域Id 默认为英国
    isShowCodeModal: false,
    isForGot: false, //是否为注册
    userInfo: {
      userId: '',
      userName: '',
      nickName: '',
      userLevel: '',
      phoneBinded: '',
      emailBinded: '',
      secertStatus: 0,
      c1Status: 1,
      realName: '',
      nationalName: '',
      credential: '',
      idNumber: '',
      c2Status: 1,
      gooleBinded: false,
      registerDate: '',
      totalTrade: 0,
      avgPassMin: 0,
      phoneArea: '',
    },
    isShowTwoFa: false, //是否显示谷歌验证
    LoginParams: {
      //如果有默认密码 因为谷歌登录的时候会充值登录密码
      userName: '',
      password: '',
    },
    signInfo: {},
    isBlack: false,
    invit: {},
    invitList: [],
  },
  mutations: {
    [types.SET_STATE](state, obj) {
      state[obj.key] = obj.val;
    },
    toggle(state, key) {
      state[key] = !state[key];
    },
    setObjectState(state, obj) {
      if (!state[obj.key]) return;
      state[obj.key] = Object.assign(state[obj.key], obj.val);
    },
  },
  actions: {
    async [types.toggleTwoFa]({ state, commit }, params) {
      commit(types.SET_STATE, {
        key: 'isShowTwoFa',
        val: params.show,
      });
    },
    async [types.SEND_CODE]({ state, commit }, params) {
      let res = await api.sendCode();
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'imgParameter',
          val: res.data,
        });
        return res.data;
      }
    },
    async [types.CHECK_USER_ACCOUNT]({ state, commit }, params) {
      let res = await api.checkUserAccount(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: true,
        });
      }
      if (res && res.code === 1222) {
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: false,
        });
      }
      return res;
    },
    async [types.USER_LOGIN]({ state, commit }, params) {
      let res = await api.userLogin(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'loginData',
          val: res.data,
        });
      } else if (res && res.code === 201) {
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: false,
        });
      }
      return res;
    },
    async [types.GET_AREA_LIST]({ state, commit }, params) {
      // let areaList = JSON.parse(Storage.getItem('areaList'));
      // if (areaList && areaList.length) {
      //   let dataList = JSON.parse(Storage.getItem('areaList'));
      //   commit(types.SET_STATE, {
      //     key: 'areaList',
      //     val: dataList
      //   });
      //   commit(types.SET_STATE, {
      //     key: 'areaNumberList',
      //     val: Utils.unique(dataList.map(x => x.areaid))
      //   });
      //   return;
      // }
      let res = await api.getArealist();
      if (res && res.code === 200) {
        let resList = Utils.unique(res.data.map(x => x.areaid));
        commit(types.SET_STATE, {
          key: 'areaList',
          val: res.data,
        });
        commit(types.SET_STATE, {
          key: 'areaNumberList',
          val: resList,
        });
        if (resList.length) {
          Storage.setItem('areaList', JSON.stringify(res.data));
        }
      }
    },
    async [types.SEND_VERIFI_CATION_CODE]({ state, commit }, params) {
      let res = await api.sendVerificationCode({
        ...params,
        language: Storage.get('locale') || 'en_us',
      });
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isSendCodeSuccess',
          val: true,
        });
      }
      if (res && res.code === 203) {
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: true,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'isSendCodeSuccess',
          val: false,
        });
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: false,
        });
      }
      return res;
    },
    async [types.COUNT_DOWN]({ state, commit }) {
      timer = setInterval(() => {
        let count = --state.countDown;
        Storage.set('countDown', count); //往cookie里面也放一份 防止用户刷新
        commit(types.SET_STATE, {
          key: 'countDown',
          val: count,
        });
        if (state.countDown <= 0) {
          commit(types.SET_STATE, {
            key: 'isShowCountDown',
            val: false,
          }); //倒计时完修改状态
          commit(types.SET_STATE, {
            key: 'countDown',
            val: 60,
          }); //倒计时默认值60秒
          //删除cookie里面的值
          Storage.remove('countDown');
          Storage.remove('isShowCountDown');
          clearInterval(timer);
        }
      }, 1000);
    },
    async [types.REGISTER]({ state, commit }, params) {
      let res = await api.userRegister({ ...params, language: Storage.get('locale') || 'en_us' });
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'registerSuccess',
          val: true,
        });
      } else if (res && res.code === 206) {
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: true,
        });
        commit(types.SET_STATE, {
          key: 'registerSuccess',
          val: false,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'registerSuccess',
          val: false,
        });
      }
      return res;
    },
    async [types.CHECK_GOOGLE_LOGIN]({ state, commit }, params) {
      let res = await api.checkGoogleCode(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isGoogleCodeCorrect',
          val: true,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'isGoogleCodeCorrect',
          val: false,
        });
      }
      return res;
    },
    async [types.LOGIN_GOOGLE_LOGIN]({ state, commit }, params) {
      let res = await api.loginGoogleCheck(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isGoogleCodeCorrect',
          val: true,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'isGoogleCodeCorrect',
          val: false,
        });
      }
      return res;
    },
    async [types.GET_GOOGLE_URL]({ state, commit }, params) {
      let res = await api.getGbindUrl(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'googleBindUrl',
          val: res.data.url,
        });
        commit(types.SET_STATE, {
          key: 'googleSecretKey',
          val: res.data.secretKey,
        });
      }
    },
    async [types.CHECK_VERIFICATION_CODE]({ state, commit }, params) {
      let res = await api.checkVerificationCode(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isVerificationCode',
          val: true,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'isVerificationCode',
          val: false,
        });
      }
      return res;
    },
    async [types.CHECK_BIND_STATUS]({ state, commit }, params) {
      let res = await api.checkBindingStatus(params);
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'userStatus',
          val: res.data,
        });
      }
    },
    async [types.SNED_CODE_FORGOT]({ state, commit }, params) {
      let res = await api.sendVCodeForForgot({
        ...params,
        language: Storage.get('locale') || 'en_us',
      });
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isSendCodeSuccess',
          val: true,
        });
      } else if (res && res.code === 203) {
        commit(types.SET_STATE, {
          key: 'isSendCodeSuccess',
          val: false,
        });
        commit(types.SET_STATE, {
          key: 'isAccountExist',
          val: true,
        });
      } else {
        commit(types.SET_STATE, {
          key: 'isSendCodeSuccess',
          val: false,
        });
      }
      return res;
    },
    async [types.FORGOT_PASSWORD]({ state, commit }, params) {
      let res = await api.forgetPassword(params);
      return res;
    },
    async [types.GET_USER_INFO]({ state, commit }) {
      const res = await api.getUserInfo();
      if (res && res.code === 200) {
        commit('setObjectState', {
          key: 'userInfo',
          val: res.data,
        });
        Storage.set('userId', res.data.userId);
      }
      return res;
    },
    async [types.SIGN_STATUS]({ commit }) {
      const res = await api.signStatus();
      if (res && res.code === 200) {
        commit('setObjectState', {
          key: 'signInfo',
          val: res.data,
        });
      }
      return res;
    },
    async [types.IS_BLACK]({ commit }) {
      const res = await api.isBlack();
      if (res && res.code === 200) {
        commit(types.SET_STATE, {
          key: 'isBlack',
          val: true,
        });
      }
      return res;
    },
    async [types.RESEND_EMAIL]({ commit }, params) {
      let res = await api.resendEmail({ ...params, language: Storage.get('locale') || 'en_us' });
      return res;
    },
    async [types.GET_INVIT]({ commit }, params) {
      let res = await api.getInvit();
      if (res && res.code === 200) {
        commit(types.SET_STATE, { key: 'invit', val: res.data });
      }
    },
    async [types.QUERYINVITEE]({ commit }, params) {
      let res = await api.queryInvitee(params);
      return !!res && res.code === 200 ? res : [];
    },
    async [types.QUERYINVITEEREWARD]({ commit }, params) {
      let res = await api.queryInviteReward(params);
      return !!res && res.code === 200 ? res : [];
    },
  },
};
