import * as type from './type';
import * as api from './api';
import Storage from '~/utils/storage';

export default {
  state: {
    orderList: {
      total: 0,
      list: [],
    },
    tradeList: {
      total: 0,
      list: [],
    },
    areaList: [],
    orderNotice: [],
    hasNotice: false,
    tradeOn: false,
    tradeOnId: '',
    myorderList: [],
    myorderTotal: 0,
    orderStatus: {},
    createOrderLoading: true,
    AppealTypeList: [],
    isSelect: false,
  },
  mutations: {
    orderList(state, data) {
      state.orderList.list = data.list;
      state.orderList.total = data.total;
    },
    setTradeList(state, data) {
      state.tradeList.list = data.list;
      state.tradeList.total = data.total;
    },
    setState(state, obj) {
      state[obj.key] = obj.val;
    },
    setTotal(state, val) {
      state.myorderTotal = val;
    },
    setSearch(state, val) {
      state.isSelect = val;
    },
    addNotice(state, val) {
      let index = state.orderNotice.findIndex(item => item.tradeNo === val.tradeNo);
      if (index !== -1) {
        state.orderNotice.splice(index, 1);
      }
      state.orderNotice.unshift(val);
      state.hasNotice = true;
    },
    [type.ORDER_LIST_MUSTION](state, list) {
      state.myorderList = list;
    },
    [type.ORDER_STATUS_LIST_MUTIONS](state, obj) {
      state.orderStatus = obj;
    },
    [type.ORDER_APPEAL_TYPELIST_MUTIONS](state, list) {
      state.AppealTypeList = list;
    },
  },
  actions: {
    // 订单列表
    // async [type.TRADE_GETLIST_ACTIONS]({
    //   commit
    // }, params) {
    //   const res = await api.tradeList(params)
    //   if (res && res.code) {
    //     commit('setState', {
    //       key: 'orderList',
    //       val: res.data
    //     });
    //   }
    // },
    // 普通交易列表
    async [type.AD_GETLIST_ACTIONS_ORDER]({ commit }, params) {
      commit('setState', {
        key: 'createOrderLoading',
        val: true,
      });
      try {
        const res = await api.tradingList(params);
        if (res && res.code === 200) {
          commit('setState', {
            key: 'tradeList',
            val: res.data,
          });
        }
        commit('setState', {
          key: 'createOrderLoading',
          val: false,
        });
        return res;
      } catch (e) {
        commit('setState', {
          key: 'createOrderLoading',
          val: false,
        });
      }
    },
    async [type.GET_AREALIST_ACTIONS]({ commit }) {
      const areaList = Storage.getItem('areaList');
      if (!!areaList) {
        commit('setState', {
          key: 'areaList',
          val: JSON.parse(areaList),
        });
      } else {
        const res = await api.getAreaList();
        if (res && res.code === 200) {
          commit('setState', {
            key: 'areaList',
            val: res.data,
          });
          Storage.setItem('areaList', JSON.stringify(res.data));
        }
      }
    },
    //下单
    async [type.POST_CREATE_ORDER]({ commit }, params) {
      commit('setState', {
        key: 'createOrderLoading',
        val: true,
      });
      const res = await api.createOrder(params);
      commit('setState', {
        key: 'createOrderLoading',
        val: false,
      });
      return res;
    },
    //修改state
    [type.SET_STATE]({ commit }, params) {
      commit('setState', params);
    },
    // 订单列表
    async [type.ORDER_LIST_ACTIONS]({ commit }, params) {
      const res = await api.queryUserTradePage(params);
      if (res && res.code === 200) {
        commit(type.ORDER_LIST_MUSTION, res.data.list);
        commit('setTotal', res.data.total);
      }
      return res;
    },
    // 查看订单状态
    async [type.ORDER_STATUS_LIST_ACTIONS]({ commit }, params) {
      const res = await api.getTradeDetail(params);
      if (res && res.code === 200) {
        commit(type.ORDER_STATUS_LIST_MUTIONS, res.data);
      } else {
        commit(type.ORDER_STATUS_LIST_MUTIONS, {});
      }
      return res;
    },
    //查询申诉信息的类型
    async [type.ORDER_APPEAL_TYPELIST_ACTIONS]({ commit }) {
      const res = await api.getAppealType();
      if (res && res.code === 200) {
        commit(type.ORDER_APPEAL_TYPELIST_MUTIONS, res.data);
      }
      return res;
    },

    async [type.ORDER_CONFIRM_ACTIONS]({}, params) {
      let res = await api.confirm(params);
      return !!res && res.code;
    },

    async [type.ORDER_PAY_ACTIONS]({}, params) {
      let res = await api.pay(params);
      return !!res && res.code;
    },

    async [type.ORDER_CANCEL_ACTIONS]({}, params) {
      let res = await api.cancel(params);
      return !!res && res.code;
    },

    //获取历史通知订单
    async [type.QUERY_TRADE_WEBSOCKET]({ commit, state }, params) {
      let res = await api.queryTradeWebsocket(params);
      if (!!res && res.code === 200) {
        let hasNotReadNotice = res.data.some(item => item.readStatus === 0);
        commit('setState', {
          key: 'hasNotice',
          val: hasNotReadNotice,
        });
        commit('setState', {
          key: 'orderNotice',
          val: res.data,
        });
      }

      return !!res && res.code;
    },
    //更改通知订单已阅状态
    async [type.UPDATE_TRADE_WEBSOCKET]({ commit }, params) {
      commit('setState', {
        key: 'hasNotice',
        val: false,
      });
      let res = await api.updateTradeWebsocket(params);

      return !!res && res.code;
    },
    async [type.QUERY_IM_CONV_ID]({ commit }, params) {
      let res = await api.queryIMConvId(params);
      return res && res.code === 200 ? res.data : '';
    },
    async [type.ADD_IM_CONV]({ commit }, params) {
      let res = await api.addIMConv(params);
      return res && res.code === 200 ? true : false;
    },
  },
};
