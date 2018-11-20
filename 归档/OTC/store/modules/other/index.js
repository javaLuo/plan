import * as type from './type';
import * as api from './api';

export default {
  state: {
    questList: [],
    questTypeData: {},
    activeNewsData: {
      subject: ''
    }
  },
  mutations: {
    setState(state, obj) {
      state[obj.key] = obj.val;
    }
    // setTotal(state, val) {
    //   state.newsTotal = val;
    // }
  },
  actions: {
    async [type.GET_QUEST_LIST]({ commit }, params) {
      const res = await api.getQuestion(params);
      if (res && res.code === 200) {
        commit('setState', { key: 'questList', val: res.data });
      }
    },
    async [type.GET_TYPE_LIST]({commit}, params){
      const res = await api.getTypeQuestion(params)
      if(res && res.code === 200){
        commit('setState', {key: 'questTypeData', val: res.data})
      }
    },
    async [type.GET_ANSWER_BY_ID]({ commit }, params) {
      const res = await api.getQuestionById(params);
      if (res && res.code === 200) {
        commit('setState', {key: 'activeNewsData', val: res.data})
      }
    }
  }
};
