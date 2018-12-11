import * as type from './type';
import * as api from './api';
import Storage from '~/utils/storage';
import Utils from '~/utils/';

export default {
  state: {
    balanceList: [],
    address: '',
    withdrawList: [], // 提币列表
    auditConfig: null,
    isVerifySecret: false, //是否正确资金密码
    balanceCount: 0.0, //当前市价USD
    isWithdraw: false, //是否提币成功
    withdrawTotal: 0,
  },
  mutations: {
    [type.SET_STATE](state, obj) {
      state[obj.key] = obj.val;
    },
  },
  actions: {
    async [type.QUERY_USER_ALL_ASSESTBALANCE]({ state, commit }, params) {
      let res = await api.queryUserAllAssestBalance();
      if (res && res.code === 200) {
        commit(type.SET_STATE, { key: 'balanceList', val: res.data.finlist });
        commit(type.SET_STATE, { key: 'balanceCount', val: res.data.totalUsdt });
      }
      return res && res.code === 200 ? res.data.finlist : null;
    },
    async [type.QUERY_USER_ADDRESS]({ state, commit }, params) {
      let res = await api.getUserDepositAddress(params);
      if (res && res.code === 200) {
        commit(type.SET_STATE, { key: 'address', val: res.data });
      } else {
        commit(type.SET_STATE, { key: 'address', val: '' });
      }
      return res && res.code === 200 ? res.data : null;
    },
    async [type.QUERY_USER_WITHDRAW_ADDRESS]({ state, commit }, params) {
      let res = await api.queryWithDrawApi(params);
      if (res && res.code === 200) {
        commit(type.SET_STATE, { key: 'withdrawList', val: res.data.content });
        commit(type.SET_STATE, { key: 'withdrawTotal', val: res.data.totalElements });
      }
      return res && res.code === 200 ? res.data.content : null;
    },
    async [type.SAVE_USER_WITHDRAW_ADDRESS]({ state, commit }, params) {
      let res = await api.saveWithDrawApi(params);
      if (res && res.code === 200) {
      }
      return res;
    },
    async [type.DELETE_USER_WITHDRAW_ADDRESS]({ state, commit }, params) {
      let res = await api.deleteWithDrawApi(params);
      if (res && res.code === 200) {
      }
      return res && res.code === 200 ? res.data : null;
    },
    async [type.QUERY_DEPOSIT_RECORD]({ state, commit }, params) {
      let res = await api.queryDepositRecord(params);
      return res;
    },
    async [type.QUERY_AUDITCONFIG]({ state, commit }, params) {
      let res = await api.queryAuditConfig(params);
      if (res && res.code === 200) {
        commit(type.SET_STATE, { key: 'auditConfig', val: !!res.data && res.data });
      }
    },
    async [type.VERIFYSECRET]({ state, commit }, params) {
      let res = await api.verifySecret(params);
      if (res && res.code === 200) {
        commit(type.SET_STATE, { key: 'isVerifySecret', val: true });
      } else {
        commit(type.SET_STATE, { key: 'isVerifySecret', val: false });
      }
      return res;
    },
    async [type.WITHDRAW]({ state, commit }, params) {
      let res = await api.Withdraw(params);
      // if (res && res.code === 200) {
      //   commit(type.SET_STATE, {key: 'isWithdraw', val: true})
      // } else {
      //   commit(type.SET_STATE, {key: 'isWithdraw', val: false})
      // }
      return res;
    },
    async [type.QUERY_WITHDRAW_RECORD]({ state, commit }, params) {
      let res = await api.queryWithdrawRecord(params);
      return res;
    },
    async [type.QUERY_USER_ONE_ASSETBALANCE]({ state, commit }, params) {
      let res = await api.queryUserOenAssetBalance(params);
      return res && res.code === 200 ? res.data : null;
    },
    async [type.QUERY_ACTIVITY]({ state, commit }, params) {
      let res = await api.getTurnover(params);
      return res;
    },
  },
};
