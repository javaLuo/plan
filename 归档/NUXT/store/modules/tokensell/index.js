import * as types from './types';
import * as api from './api';

export default {
  state: {
    lastId: null, // 最新的活动ID
  },
  mutations: {
    setState(state, obj) {
      state[obj.key] = obj.val;
    },
  },
  actions: {
    async [types.GET_TOKENSELLBYID]({ state, commit }, params) {
      let res = await api.getTokenSellById(params);
      return res;
    },
    async [types.GET_TOKENSELLRECORDS]({ state, commit }, params) {
      let res = await api.getRecords(params);
      return res;
    },
    async [types.GET_QUERYUSERSPECIFIEDASSETBALANCE]({ state, commit }, params) {
      let res = await api.queryUserSpecifiedAssetBalance(params);
      return res;
    },
    async [types.GET_PURCHASE]({ state, commit }, params) {
      let res = await api.purchase(params);
      return res;
    },
    async [types.GET_NEWTOKENSELL]({ state, commit }, params) {
      let res = await api.getNewTokenSell(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'lastId',
          val: res.data.id,
        });
      }
      return res;
    },
  },
};
