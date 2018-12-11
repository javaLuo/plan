import * as types from './types';
import * as api from './api';
import Config from '~/common/config';
import _ from 'lodash';

export default {
  state: {
    minAmountData: {}, // 所有交易对到最小交易量等信息
    marketData: [], // // 所有交易对数据（主板用）
    marketDataSliver: [], // 所有交易对数据（银榜用）
  },
  mutations: {
    setState(state, payload) {
      for (let key in payload) {
        state[key] = payload[key];
      }
    },
  },
  actions: {
    // 收藏交易对或取消收藏
    async [types.saveLove]({ state, commit }, params) {
      const res = await api.saveLove({
        ...params,
      });
      return res;
    },

    // 获取当前用户的所有资产
    async [types.selectAvaCoin]({ state, commit }, params) {
      if (!this.state.isLogin) {
        return {};
      }
      const res = await api.selectAvaCoin({
        ...params,
        userId: this.state.user.userInfo.userId,
      });
      return res;
    },

    // 获取所有交易对数据
    async [types.selectGroup]({ state, commit }, params = {}) {
      const res = await api.selectGroup({
        ...params,
      });
      let ret = [];
      if (res && res.code === 200) {
        Object.keys(res.data).forEach(key => {
          const item = res.data[key];

          ret.push({
            symbol: key,
            lists: item.map(it => {
              const mindata = state.minAmountData[`${it.market}${key}`];
              return {
                isLove: it.collect,
                symbol: it.market,
                lastPrice: it.last,
                change: it.rate,
                h: it.high24,
                l: it.low24,
                v: it.vol24,
                mu: key,
                ziPoint: mindata && mindata.point, // 子币允许的最小交易额，也代表了子币的小数点位数
                muPoint: mindata && mindata.price ? Number(mindata.price.point) : 8, // 母币允许的小数点位数
              };
            }),
          });
        });

        const tradeS = { mu: ['BTC', 'ETH'], zi: ['CL', 'MVC', 'IIC'] };
        // 这里需要筛选，银榜的进银榜，主板的进主板
        if (params.isS) {
          ret = ret.filter(item => tradeS.mu.includes(item.symbol));
          ret.forEach(item => {
            item.lists = item.lists.filter(itemli => tradeS.zi.includes(itemli.symbol));
          });
        } else {
          ret.forEach(item => {
            if (tradeS.mu.includes(item.symbol)) {
              item.lists = item.lists.filter(itemli => !tradeS.zi.includes(itemli.symbol));
            }
          });
        }
        commit('setState', params.isS ? { marketDataSliver: ret } : { marketData: ret });
      }
      return {
        code: res.code,
        data: ret,
        message: res.message,
      };
    },

    // 获取最小交易量
    async [types.selectMinAmount]({ state, commit }, params) {
      const res = await api.selectMinAmount({
        ...params,
      });
      if (res && res.code === 200) {
        commit('setState', { minAmountData: res.data });
      }
      return res;
    },

    // 下单： 买或卖
    async [types.addOrder]({ state, commit }, params) {
      const res = await api.addOrder(params);
      return res;
    },

    // 获取用户的最新委托列表
    async [types.selectOpenOrder]({ state, commit }, params) {
      const res = await api.selectOpenOrder({
        ...params,
      });
      return res;
    },

    // 获取用户的历史委托列表
    async [types.selectHistoryOrder]({ state, commit }, params) {
      const res = await api.selectHistoryOrder({
        ...params,
      });
      return res;
    },

    // 对订单进行操作，比如撤单
    async [types.saveOrder]({ state, commit }, params) {
      const res = await api.saveOrder({
        ...params,
      });
      return res;
    },
    // socket更新了部分交易对信息
    async [types.saveMarketData]({ state, commit }, params) {
      commit('setState', params.isS ? { marketDataSliver: params.data } : { marketData: params.data });
    },
  },
};
