import * as type from './type';
import * as api from './api';

export default {
  namespaced: true,
  state: {
    assetsLists: [],
    serviceFeeLists: [],
    assets: {},
    //当前选币
    onCoin: '',
    hashServiceFee: {},
    // deposit address
    DA: '',
    query: {},
    loading: true,
    //提比地址列表
    addressLists: [],
    depositLists: [],
    activeLists: [],
    withdrawLists: [],
    bakeLists: {
      list: []
    }, // 烘培历史所有数据
    onNav: null,
    eqBtc: 0,
    eqUsd: 0,
    saveWALoading: false,
    selectAvaCoinLoading: false,
    findAvaCoinLoading: false,
    //主榜
    hashGroupLists: {},
    //银榜
    hashGroupListsS: {},
  },
  mutations: {
    setState(state, payload) {
      for (let key in payload) {
        state[key] = payload[key];
      }
    },
  },
  actions: {
    async [type.setState]({
      state,
      commit
    }, params) {
      commit('setState', params);
      if (!!params.query) {
        const {
          type
        } = params.query;
        commit('setState', {
          onNav: type === 'history' ? 1 : type === 'address' ? 2 : 0,
        });
      }
    },
    //获取所有币的可用资金
    async [type.selectAvaCoin]({
      state,
      commit
    }, params) {
      if (!this.state.isLogin) {
        return;
      }
      try {
        commit('setState', {
          loading: true,
        });
        const {
          data
        } = await api.selectGroup({});
        const {
          data: dataS
        } = await api.selectGroup({
          isS: true
        });
        //主榜
        const hashGroupLists = {};
        data &&
          data.map(item => {
            const mu = item.symbol;
            item.lists.map(it => {
              const zi = it.symbol;
              hashGroupLists[`${zi}${mu}`] = it;
            });
          });
        //银榜
        const hashGroupListsS = {};
        dataS &&
          dataS.map(item => {
            const mu = item.symbol;
            item.lists.map(it => {
              const zi = it.symbol;
              hashGroupListsS[`${zi}${mu}`] = it;
            });
          });

        await this.dispatch('assets/selectServiceFee');

        let res = await api.selectAvaCoin().then(res => {
          res.data.finlist = res.data.finlist.concat().map(d => {
            const item = state.hashServiceFee[d.coin];
            if (!!item) {
              return {
                ...d,
                canDeposit: item.canDeposit,
                canWithdraw: item.canWithdraw,
              };
            }
            return {
              ...d,
              canDeposit: false,
              canWithdraw: false,
            };
          });
          return res;
        });
        commit('setState', {
          loading: false,
        });

        if (200 === res.code) {
          commit('setState', {
            assetsLists: res.data.finlist,
            eqBtc: res.data.eqBtc,
            eqUsd: res.data.eqUsd,
            hashGroupLists,
            hashGroupListsS,
          });
        }
        return res;
      } catch (e) {
        // //debugger;
      }
    },
    //获取指定币的可用资金
    async [type.findAvaCoin]({
      state,
      commit
    }, params) {
      if (!this.state.isLogin) {
        return;
      }
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.findAvaCoin(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {
            assets: res.data,
          });
        }

        return res;
      } catch (e) {
        // //debugger;
      }
    },
    //获取 冲币 地址
    async [type.findDA]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.findDA(params.coin);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {
            DA: res.data,
          });
        } else {
          commit('setState', {
            DA: '',
          });
        }
        return res;
      } catch (e) {
        // //debugger;
      }
    },
    //获取 提币地址
    async [type.selectWA]({
      state,
      commit
    }, params) {
      try {
        if (!!state.onCoin) {
          commit('setState', {
            loading: true,
          });
          let res = await api.selectWA({
            ...params,
            asset: state.onCoin,
          });
          commit('setState', {
            loading: false,
          });
          if (200 === res.code) {
            commit('setState', {
              addressLists: res.data.content,
            });
          }
          return res;
        }
        return {};
      } catch (e) {
        //debugger;
      }
    },
    //添加 提币 地址
    async [type.saveWA]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
          saveWALoading: true,
        });
        let res = await api.saveWA(params);
        commit('setState', {
          loading: false,
          saveWALoading: false,
        });
        if (200 === res.code) {}
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //删除 提币 地址
    async [type.delWA]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.delWA(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {}
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //获取 冲币 lists
    async [type.selectD]({
      state,
      commit
    }, params) {
      try {
        // params.asset = '';
        commit('setState', {
          loading: true,
        });
        let res = await api.selectD(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {
            depositLists: res.data.content,
          });
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //获取 提币 lists
    async [type.selectW]({
      state,
      commit
    }, params) {
      try {
        // params.asset = '';
        commit('setState', {
          loading: true,
        });
        let res = await api.selectW(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {
            withdrawLists: res.data.content,
          });
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //获取 服务费 lists
    async [type.selectServiceFee]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.selectServiceFee();
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          const hash = {};
          res.data.concat().map(item => {
            hash[item.coin] = item;
          });
          commit('setState', {
            serviceFeeLists: res.data,
            hashServiceFee: hash,
          });
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //获取 资金 密码
    async [type.findPayPwd]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.findPayPwd({
          secret: params.pwd,
        });
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          // commit('setState', {});
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //添加  提币  订单
    async [type.saveWOrder]({
      state,
      commit
    }, params) {
      try {
        commit('setState', {
          loading: true,
        });
        let res = await api.saveWOrder(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {});
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
    //获取 最新 订单 lists
    async [type.selectA]({
      state,
      commit
    }, params) {
      try {
        // params.asset = '';
        commit('setState', {
          loading: true,
        });
        let res = await api.selectA(params);
        commit('setState', {
          loading: false,
        });
        if (200 === res.code) {
          commit('setState', {
            activeLists: res.data.list,
          });
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },

    //获取 烘培资金历史
    async [type.selectAssetsBake]({
      state,
      commit
    }, params) {
      try {
        let res = await api.selectAssetsBake(params);
        if (200 === res.code) {
          commit('setState', {
            bakeLists: res.data,
          });
        }
        return res;
      } catch (e) {
        //debugger;
      }
    },
  },
};
