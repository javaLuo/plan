import * as types from './types';
import * as api from './api';
import Storage from '~/utils/storage';

export default {
  state: {
    bannerList: {},
    allTickers: {},
  },
  mutations: {
    setState(state, obj) {
      state[obj.key] = obj.val;
    },
    toggle(state, key) {
      state[key] = !state[key];
    },
  },
  actions: {
    async [types.GET_BANNERLIST]({ state, commit }, params) {
      let res = await api.getMarquee(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'bannerList',
          val: res.data,
        });
      }
      return !!res && res.code;
    },
    async [types.GET_TICKERLIST]({ commit }) {
      const res = await api.getAlltickers();
      if (res && res.code === 200) {
        commit('setState', {
          key: 'allTickers',
          val: res.data,
        });
      }
      return !!res && res.data;
    },
    async [types.GET_ADS]({ commit }, params) {
      let res = await api.getAds(params);
      return !!res && res.articles.slice(0, 5);
    },
    async [types.GET_RECOMMENDED]({ state, commit }, params) {
      let res = await api.getRecommended();
      let list = !!res && res.code === 200 ? res.data : [];

      return list.concat().map(item => {
        let symbol = params[item.market];
        return {
          ...item,
          point: (!!symbol && symbol.price.point) || 0,
        };
      });
    },
  },
};
