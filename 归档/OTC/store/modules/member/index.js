import { Message } from 'element-ui';
import * as type from './type';
import * as api from './api';
import Utils from '~/utils/';
import Storage from '~/utils/storage';

export default {
  state: {
    userInfo: {},
    userBindInfo: {
      emailBind: false,
      phoneBind: false,
      kycC1State: false,
      kycC2State: false,
    },
    otcUserInfo: {},
    otcUserNickName: '',
    currentOtcUserInfo: {},
    kycUserInfo: {},
    kycUserStatus: {},
    nickName: '',
    payMethodUpload: {},
    payMethodUploadUrl: {},
    payTypeList: [],
    payList: [],
    updatePayMethod: {},
    addPayMethod: {},
    deletePayMethod: {},
    defriendList: {},
    addDefriend: {},
    removeDefriend: {},
    checkDefriend: {},
  },
  mutations: {
    [type.GET_USER_INFO_MUTIONS](state, data) {
      state.userInfo = data;
    },
    [type.GET_USER_BIND_INFO_MUTIONS](state, data) {
      if (data !== null) {
        state.userBindInfo = data;
      }
    },
    [type.GET_OTC_USER_INFO_MUTIONS](state, data) {
      if (data !== null) {
        state.otcUserInfo = { ...state.otcUserInfo, ...{ [data.userId]: data } };
        state.otcUserNickName = data.nickname;
      }
    },
    [type.GET_CURRENT_USER_INFO_MUTIONS](state, data) {
      if (data !== null) {
        state.currentOtcUserInfo = data;
        Storage.set('currentNickname', !!data && !!data.nickname ? data.nickname : '');
      }
    },
    [type.GET_KYC_USER_INFO_MUTIONS](state, data) {
      state.kycUserInfo = data;
    },
    [type.GET_KYC_STATUS_MUTIONS](state, data) {
      let kycStatus = {
        c1Status: '',
        c2Status: '',
        phoneStatus: 0,
        c1IsUnset: 0,
        c1IsCerting: 0,
        c1IsRefuse: 0,
        c1IsCerted: 0,
        c2IsUnset: 0,
        c2IsCerting: 0,
        c2IsRefuse: 0,
        c2IsCerted: 0,
      };
      for (let item of data) {
        if (item.nodeId === 2) {
          kycStatus.c1Status = parseInt(item.status);
        } else if (item.nodeId === 3) {
          kycStatus.c2Status = parseInt(item.status);
        } else if (item.nodeId === 1) {
          kycStatus.phoneStatus = parseInt(item.status);
        }
      }
      const c1Status = kycStatus.c1Status;
      kycStatus.c1IsUnset = Utils.isEmptyString(c1Status); //待提交审核资料 null
      kycStatus.c1IsCerting = !Utils.isEmptyString(c1Status) && c1Status === 0; //待审核
      kycStatus.c1IsCerted = !Utils.isEmptyString(c1Status) && c1Status === 1; //审核通过
      kycStatus.c1IsRefuse = !Utils.isEmptyString(c1Status) && c1Status === 2; //审核拒绝

      const c2Status = kycStatus.c2Status;
      kycStatus.c2IsUnset = Utils.isEmptyString(c2Status); //待提交审核资料
      kycStatus.c2IsCerting = !Utils.isEmptyString(c2Status) && c2Status === 0; //待审核
      kycStatus.c2IsCerted = !Utils.isEmptyString(c2Status) && c2Status === 1; //审核通过
      kycStatus.c2IsRefuse = !Utils.isEmptyString(c2Status) && c2Status === 2; //审核拒绝
      state.kycUserStatus = kycStatus;
    },
    [type.GET_NICKNAME_MUTIONS](state, data) {
      if (data !== null) {
        state.nickName = data;
      }
    },
    [type.SET_UPLOAD_MUTIONS](state, data) {
      if (data !== null) {
        state.payMethodUpload = data;
      }
    },
    [type.GET_UPLOAD_URL_MUTIONS](state, data) {
      if (data !== null) {
        state.payMethodUploadUrl = data;
      }
    },
    [type.GET_PAY_TYPE_MUTIONS](state, data) {
      if (data !== null) {
        state.payTypeList = data;
      }
    },
    [type.GET_PAY_LIST_MUTIONS](state, data) {
      if (data !== null) {
        state.payList = data;
      }
    },
    [type.UPDATE_PAY_METHOD_MUTIONS](state, data) {
      if (data !== null) {
        state.updatePayMethod = data;
      }
    },
    [type.ADD_PAY_METHOD_MUTIONS](state, data) {
      if (data !== null) {
        state.addPayMethod = data;
      }
    },
    [type.DELETE_PAY_METHOD_MUTIONS](state, data) {
      if (data !== null) {
        state.deletePayMethod = data;
      }
    },
    [type.GET_DEFRIEND_LIST_MUTIONS](state, data) {
      if (data !== null) {
        state.defriendList = data;
      }
    },
    [type.ADD_DEFRIEND_MUTIONS](state, data) {
      if (data !== null) {
        state.addDefriend = data;
      }
    },
    [type.REMOVE_DEFRIEND_MUTIONS](state, data) {
      if (data !== null) {
        state.removeDefriend = data;
      }
    },
    [type.CHECK_DEFRIEND_MUTIONS](state, data) {
      if (data !== null) {
        state.checkDefriend = data;
      }
    },
  },
  actions: {
    async [type.USER_LOGIN_OUT_ACTIONS]({ commit }) {
      let res = await api.userLogout();
      Storage.remove('globals');
      Storage.remove('isLogin');
      Storage.remove('username');
      Storage.remove('currentNickname');
    },
    async [type.GET_USER_INFO_ACTIONS]({ commit }) {
      let res = await api.getUserInfo();
      if (res && res.code === 200) {
        commit(type.GET_USER_INFO_MUTIONS, res.data);
        if (this.state.currentNickname !== res.data.nickName) {
          this.commit('setNickName', res.data.nickName);
          Storage.set('currentNickname', res.data.nickName);
        }
      }
      return res;
    },
    async [type.GET_USER_BIND_INFO_ACTIONS]({ commit }, params) {
      let res = await api.getUserBindStatusByUserId(params);
      if (res && res.code === 200) {
        commit(type.GET_USER_BIND_INFO_MUTIONS, res.data);
      }
      return res;
    },
    async [type.GET_OTC_USER_INFO_ACTIONS]({ commit }, params) {
      let res = await api.getOtcUserInfoByUserId(params);

      if (res && res.code === 200) {
        commit(type.GET_OTC_USER_INFO_MUTIONS, res.data);

        this.commit('setNickName', res.data.nickname);
        Storage.set('currentNickname', res.data.nickname);
      }
    },
    async [type.GET_CURRENT_USER_INFO_ACTIONS]({ commit }) {
      let res = await api.getOtcUserInfo();
      if (res && res.code === 200) {
        commit(type.GET_CURRENT_USER_INFO_MUTIONS, res.data);
      }
      return res;
    },
    async [type.GET_KYC_USER_INFO_ACTIONS]({ commit }) {
      let res = await api.getKycUserInfo();

      if (res && res.code === 200) {
        commit(type.GET_KYC_USER_INFO_MUTIONS, res.data || {});
      }

      return res;
    },
    async [type.GET_KYC_STATUS_ACTIONS]({ commit }) {
      let res = await api.getKycStatus();
      if (res && res.code === 200) {
        commit(type.GET_KYC_STATUS_MUTIONS, res.data);
      }

      return res;
    },
    async [type.SET_NICKNAME_ACTIONS]({ commit }, params) {
      let res = await api.setNickname(params);
      if (res && res.code === 200) {
        Storage.set('currentNickname', params.nickname);
      } else {
        Message.error(`${res && res.msg}`);
      }
      return res;
    },
    async [type.GET_NICKNAME_ACTIONS]({ commit }, params) {
      let res = await api.getNicknameByUserId(params);
      if (res && res.code === 200) {
        commit(type.GET_NICKNAME_MUTIONS, res.data);
      } else {
        Message.error(`${res && res.msg}`);
      }
      return res;
    },

    async [type.SET_UPLOAD_ACTIONS]({ commit }, params) {
      let res = await api.s3upload(params);
      if (res && res.code === 200) {
        commit(type.SET_UPLOAD_MUTIONS, res.data);
      } else {
        Message.error(`${res && res.msg}`);
      }

      return res;
    },
    async [type.GET_UPLOAD_URL_ACTIONS]({ commit }, params) {
      let res = await api.gets3uploadUrl(params);
      if (res && res.code === 200) {
        commit(type.GET_UPLOAD_URL_MUTIONS, res.data);
      } else {
        Message.error(`${res && res.msg}`);
      }
      return res;
    },
    async [type.GET_PAY_TYPE_ACTIONS]({ commit }, params) {
      let res = await api.getPayType(params);

      if (res && res.code === 200) {
        commit(type.GET_PAY_TYPE_MUTIONS, res.data);
      } else {
        Message.error(`${res && res.msg}`);
      }

      return res;
    },
    async [type.GET_PAY_LIST_ACTIONS]({ commit }, params) {
      let res = await api.getPayList(params);
      if (res && res.code === 200) {
        commit(type.GET_PAY_LIST_MUTIONS, res.data);
      }
      return res;
    },
    async [type.UPDATE_PAY_METHOD_ACTIONS]({ commit }, params) {
      let res = await api.updatePayMethod(params);

      if (res && res.code === 200) {
        commit(type.UPDATE_PAY_METHOD_MUTIONS, res.data);
      } else {
        Message.error(`${res && res.msg}`);
      }
      return res;
    },
    // remark
    [type.VERIFY_SECERT_ACTIONS]({ commit }, params) {
      return api
        .verifySecret(params)
        .then(res => {
          return res;
        })
        .catch(err => console.log(err));
    },

    async [type.ADD_PAY_METHOD_ACTIONS]({ commit }, params) {
      const res = await api.addPayMethod(params);
      if (!!res && res.code === 200) {
        commit(type.ADD_PAY_METHOD_MUTIONS, res.data);
      }
      return res;
    },
    [type.DELETE_PAY_METHOD_ACTIONS]({ commit }, params) {
      return api
        .deletePayMethod(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.DELETE_PAY_METHOD_MUTIONS, res.data);
          } else {
            Message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    async [type.GET_DEFRIEND_LIST_ACTIONS]({ commit }, params) {
      let res = await api.getDefriendList(params);

      if (res && res.code === 200) {
        commit(type.GET_DEFRIEND_LIST_MUTIONS, res.data);
      }
      return res;
    },
    [type.ADD_DEFRIEND_ACTIONS]({ commit }, params) {
      return api
        .addDefriend(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.ADD_DEFRIEND_MUTIONS, res.data);
          } else {
            Message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    [type.REMOVE_DEFRIEND_ACTIONS]({ commit }, params) {
      return api
        .removeDefriend(params)
        .then(res => {
          if (res && res.code === 200) {
            Message.success(res.msg);
          } else {
            Message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    [type.CHECK_DEFRIEND_ACTIONS]({ commit }, params) {
      return api
        .checkIsDefriend(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.CHECK_DEFRIEND_MUTIONS, res.data);
          } else {
            Message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
  },
};
