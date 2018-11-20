import Vue from 'vue';
import * as type from './type';
import * as api from './api';
import UtilsR from '~/utils/ramda';
import { Message } from 'element-ui';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';

export default {
  state: {
    tradeAssetList: {},
    tradeAssetAll: {},
    transfer: {},
    deposit: {},
    businessInfo: {},
  },
  mutations: {
    [type.GET_TRADE_ASSET_LIST_MUTIONS](state, data) {
      state.tradeAssetList = data;
    },
    [type.GET_TRADE_ASSET_ALL_MUTIONS](state, data) {
      const accountList = data.accountList;
      const typesList = UtilsR.R.union(UtilsR.R.pluck('asset', accountList.exchange), UtilsR.R.pluck('asset', accountList.otc));
      let accountNewList = {};
      typesList.map(item => {
        const exchangeList = accountList.exchange.filter(e => item === e.asset);
        const otcList = accountList.otc.filter(e => item === e.asset);
        accountNewList[item] = [exchangeList.length > 0 ? exchangeList[0] : null, otcList.length > 0 ? otcList[0] : null];
      });
      state.tradeAssetAll = Object.assign({}, data, {
        accountNewList,
      });
    },
    [type.GET_TRADE_ASSET_TRANSFER_MUTIONS](state, data) {
      state.transfer = data;
    },
    [type.GET_TRADE_ASSET_DEPOSIT_MUTIONS](state, data) {
      state.deposit = data;
    },
    [type.USER_BUSINESS_INFO_MUTIONS](state, data) {
      state.businessInfo = data;
    },
  },
  actions: {
    [type.GET_TRADE_ASSET_LIST_ACTIONS]({ commit }, params) {
      return api
        .getTradeAssetList(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.GET_TRADE_ASSET_LIST_MUTIONS, res.data);
          }
          return res;
        })
        .catch(err => console.log(err));
    },
    async [type.GET_TRADE_ASSET_ALL_ACTIONS]({ commit }) {
      let res = await api.getTradeAssetAll();
      if (res && res.code === 200) {
        commit(type.GET_TRADE_ASSET_ALL_MUTIONS, res.data);
      }
      return res;
    },
    [type.TRADE_ASSET_TRANSFER_ACTIONS]({ commit }, params) {
      return api
        .transferAsset(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.GET_TRADE_ASSET_TRANSFER_MUTIONS, res.data);
          } else {
            Message.error(res.msg);
          }
        })
        .catch(err => console.log(err));
    },
    async [type.USER_BUSSINESS_CANCEL_ACTIONS]({ commit }, params) {
      let res = await api.cancelBusiness(params);
      return res;
    },
    // remark
    [type.TRADE_ASSET_DEPOSIT_ACTIONS]({ commit }, params) {
      return api
        .getDepositUrl(params)
        .then(res => {
          if (res && res.code === 200) {
            commit(type.GET_TRADE_ASSET_DEPOSIT_MUTIONS, { address: res.data } || { address: '' });
          } else {
            commit(type.GET_TRADE_ASSET_DEPOSIT_MUTIONS, { address: '' });
          }
          return res;
        })
        .catch(err => console.log(err));
    },
    async [type.USER_BUSINESS_ASK_ACTIONS]({ commit }, params) {
      let res = await api.businessAsk(params);
      return res;
    },
    [type.USER_BUSINESS_INFO_ACTIONS]({ commit }) {
      return api.getBusiInfo().then(res => {
        if (res && res.code === 200) {
          commit(type.USER_BUSINESS_INFO_MUTIONS, res.data);
        }
      });
    },
    // 从普通商家升级大宗商家
    async [type.USER_BUSINESS_BUSIPROMOTION_ACTIONS]({ commit }, params) {
      let res = await api.upLevel(params);
      return res;
    },
  },
};
