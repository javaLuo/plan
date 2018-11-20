import * as type from './type';
import * as api from './api';
import * as Dict from '~/store/dict';

export default {
  state: {
    list: [],
    memberSellAdList: [], // 用户广告出售列表
    memberBuyAdList: [], // 用户广告购买列表
    assetUserList: [],
    averagePrice: {},
    userAmount: 0,
    userPayList: [],
    rank: 0,
    adTotal: 0,
    rankUnitPrice: 0,
    rateAmount: {},
  },
  mutations: {
    [type.AD_LIST_MUTIONS](state, data) {
      const type = data.listType || 'list';
      switch (type) {
        case 'memberAdList':
          // data.list &&
          // 		data.list.map(item => {
          // 		  let payMethodList = [];
          // 		  item.payMethod.map(i => payMethodList.push(i.payMethodCode));
          // 		  item.payMethodList = payMethodList;
          // 		});
          // state.memberBuyAdList = { ...data.list };
          // state.memberSellAdList = { ...data.list };
          if (!!data.list && data.list.length > 0) {
            const buyList = data.list.filter(item => item.tradeType === Dict.TRADE_TYPE_BUY);
            buyList.map(item => {
              let payMethodList = [];
              item.payMethod.map(i => payMethodList.push(i.payMethodCode));
              item.payMethodList = payMethodList;
            });
            const sellList = data.list.filter(item => item.tradeType === Dict.TRADE_TYPE_SELL);
            sellList.map(item => {
              let payMethodList = [];
              item.payMethod.map(i => payMethodList.push(i.payMethodCode));
              item.payMethodList = payMethodList;
            });
            state.memberBuyAdList = [...buyList];
            state.memberSellAdList = [...sellList];
          }
          break;
        case 'list':
        default:
          state.list = data.list;
          break;
      }
      state[type] = data.list;
    },
    setTotal(state, val) {
      state.adTotal = val;
    },
    [type.AD_GET_ASSETLIST_MUTIONS](state, list) {
      state.assetList = list;
    },
    [type.AD_AVERAGEPRICE_MUTIONS](state, val) {
      state.averagePrice = val;
    },
    [type.AD_USERAMMOUNT_MUTIONS](state, val) {
      state.userAmount = val;
    },
    [type.AD_SET_USERPAYLIST_MUTIONS](state, list) {
      state.userPayList = list;
    },
    [type.AD_SET_RANK_MUTIONS](state, val) {
      state.rank = val;
    },
    [type.AD_RANKUNITPRICE_MUTIONS](state, val) {
      state.rankUnitPrice = val;
    },
    [type.AD_RATEAMOUNT_MUTIONS](state, val) {
      state.rateAmount = val;
    },
  },
  actions: {
    async [type.AD_CREATE_ACTIONS]({ commit }, params) {
      let res = await api.create(params);
      return res;
    },
    async [type.AD_UPDATE_STATUS_ACTIONS]({ commit }, params) {
      let res = await api.operateAdStatus(params);
      return res;
    },
    async [type.AD_GETLIST_ACTIONS]({ commit }, params) {
      const res = await api.list(params);
      if (res && res.code === 200) {
        commit(type.AD_LIST_MUTIONS, {
          listType: 'list',
          list: res.data.list,
        });
        commit('setTotal', res.data.total);
      }
      return res;
    },
    async [type.AD_GET_AdLIST_ACTIONS]({ commit }, params) {
      const res = await api.userAdList(params, {
        userId: params.userId,
      });
      if (res && res.code === 200) {
        commit(type.AD_LIST_MUTIONS, {
          listType: 'memberAdList',
          list: res.data.list,
        });
      }
      return res;
    },
    async [type.AD_GET_ASSETLIST_ACTIONS]({ commit }, params) {
      const res = await api.getUserAccount(params);
      if (res && res.code === 200) {
        commit(type.AD_USERAMMOUNT_MUTIONS, res.data);
      }
      return res;
    },
    async [type.AD_GET_AVERAGEPRICE_ACTIONS]({ commit }, params) {
      const res = await api.getAveragePrice(params);
      if (res && res.code === 200) {
        commit(type.AD_AVERAGEPRICE_MUTIONS, res.data);
      }
      return res;
    },
    async [type.AD_GET_USERPAYLIST_ACTIONS]({ commit }, params) {
      const res = await api.getUserPayList(params);
      if (res && res.code === 200) {
        commit(type.AD_SET_USERPAYLIST_MUTIONS, res.data);
      }
      return res;
    },
    async [type.AD_GET_RANKQUERY_ACTIONS]({ commit }, params) {
      const res = await api.adRankQuery(params);
      if (res && res.code === 200) {
        commit(type.AD_SET_RANK_MUTIONS, res.data);
      }
      return res;
    },
    async [type.AD_RANKUNITPRICE_ACTIONS]({ commit }, params) {
      let res = await api.rankUnitPrice(params);
      return res && res.code === 200 ? res.data : {};
    },
    async [type.AD_ONEQUERY_EDIT_ACTIONS]({ commit }, params) {
      let res = await api.queryOneAdEdit(params);
      return res && res.code === 200 ? res.data : {};
    },
    async [type.AD_EDIT]({}, params) {
      let res = await api.edit(params);
      return res;
    },
    async [type.AD_VERIFYSECRET]({}, params) {
      let res = api.verifySecret(params);
      return res;
    },
    async [type.AD_CREATEDAPPEAL]({}, params) {
      let res = api.createAppeal(params);
      return res;
    },
    async [type.AD_REPUBLISH]({}, params) {
      let res = api.rePublish(params);
      return res;
    },
    async [type.AD_RATEAMOUNT_ACTIONS]({ commit }, params) {
      const res = await api.rateAmount(params);
      if (res && res.code === 200) {
        commit(type.AD_RATEAMOUNT_MUTIONS, res.data);
      }
      return res;
    },
    // 重置rateamount数据
    async [type.AD_RESET_RATEMOUNT]({ commit }, params) {
      commit(type.AD_RATEAMOUNT_MUTIONS, {});
    },
    async [type.GET_AD_TRADEHISTORY]({ commit }, params) {
      let res = await api.getAdTradeHistory(params);
      return res && res.code === 200 ? res.data : [];
    },
    async [type.GET_AD_OPERATIONHISTORY]({ commit }, params) {
      let res = await api.getAdOperationHistory(params);
      return res && res.code === 200 ? res.data : [];
    },
  },
};
