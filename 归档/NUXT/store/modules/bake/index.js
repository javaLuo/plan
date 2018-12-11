import * as types from './types';
import * as api from './api';

export default {
  state: {
    allmoneyData: [], // 用户的所有资产
  },
  mutations: {
    setState(state, obj) {
      state[obj.key] = obj.val;
    },
  },
  actions: {
    // 获取所有资产
    async [types.getUserAllMoney]({ state, commit }, params) {
      let res = await api.getUserAllMoney(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'allmoneyData',
          val: res.data.finlist,
        });
      }
      return res;
    },

    async [types.getProductList]({ state, commit }, params) {
      let res = await api.getProductList(params);
      return res;
    },

    async [types.getBakeHistory]({ state, commit }, params) {
      let res = await api.getBakeHistory(params);
      return res;
    },

    /**
     * 立即参与
     * @param {Number} productId 活动ID
     * @param {Number} amount 投资数量
     */
    async [types.createBakeOrder]({ state, commit }, params) {
      let res = await api.createBakeOrder(params);
      return res;
    },

    /**
     * 取消烘焙
     * @param {Number} orderId
     */
    async [types.cancelBakeOrder]({ state, commit }, params) {
      let res = await api.cancelBakeOrder(params);
      return res;
    },
  },
};
