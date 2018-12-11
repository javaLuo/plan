import * as type from './type';
import * as api from './api';

import Storage from '~/utils/storage';

export default {
  state: {
    newsData: {},
    newsDetail: {},
    userInfo: {
      emailBinded: '',
      gooleBinded: false,
    },
    googleBindUrl: {
      secretKey: '',
      url: '',
    },
    c1Info: {},
    c2Info: {
      pic1Url: '',
      pic2Url: '',
      pic3Url: '',
    },
    apiKey: {},
    section: 'basicInfo',
  },
  mutations: {
    setState(state, obj) {
      state[obj.key] = obj.val;
    },
    tabState(state, val) {
      state.section = val;
    },
  },
  actions: {
    async nuxtServerInit({
      state,
      commit
    }, {
      route,
      redirect
    }) {
      if (route.query.section && route.path === '/u') {
        if (route.query.section === 'basicInfo') {
          redirect('/u');
          commit('tabState', 'basicInfo');
          return;
        }

        if (!['basicInfo', 'security', 'bake', 'tradeApi', 'invitation'].includes(route.query.section)) {
          redirect('/u');
          commit('tabState', 'basicInfo');
          return;
        }
        commit('tabState', route.query.section);
      }
    },
    async [type.GET_NEWS_LIST]({
      commit
    }, params) {
      const res = await api.getNewsList(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'newsData',
          val: res.data,
        });
      }
      return res;
    },
    async [type.GET_NEWS_DETAIL]({
      commit
    }, params) {
      const res = await api.getNoticeByNoticeID(params);
      if (res && res.code === 200) {
        let data = {};
        if (Storage.get('locale') === 'en_us') {
          data = res.data.filter(item => item.language === 'en')[0];
        } else {
          data = res.data.filter(item => item.language === 'zh')[0];
        }
        commit('setState', {
          key: 'newsDetail',
          val: data,
        });
      }
      return res;
    },
    // async [type.POST_BIND_MAILBOX]({ commit }, params){
    //   const res = await api.bindMailbox(params);
    //   if(res && res.code === 200){
    //     commit('setState', {key: 'userInfo.emailBinded', val: res.data});
    //   }
    //   return res;
    // },
    // async [type.POST_BIND_MOBILE]({commit}, params){
    //   const res = await api.bindMobile(params);
    //   if(res && res.code === 200){
    //     commit('setState', {key: 'userInfo.phoneBinded', val: res.data});
    //   }
    //   return res;
    // },
    async [type.POST_LOGIN_PWD]({
      commit
    }, params) {
      const res = await api.loginPwd(params);
      return res;
    },
    async [type.POST_EDIT_CAPITALPASS]({
      commit
    }, params) {
      const res = await api.modifiyCapitalPass(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'userInfo.emailBinded',
          val: res.data,
        });
      }
      return res;
    },
    async [type.GET_GOOGLE_BIND_URL]({
      commit
    }, params) {
      const res = await api.getGoogleBindUrl(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'googleBindUrl',
          val: res.data,
        });
      }
      return res;
    },
    async [type.BIND_GOOGLE]({
      commit
    }, params) {
      const res = await api.bindGoogle(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'userInfo.gooleBinded',
          val: true,
        });
      }
      return res;
    },
    async [type.UNBIND_GOOGLE]({
      commit
    }, params) {
      const res = await api.unBindGoogle(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'userInfo.gooleBinded',
          val: false,
        });
      }
      return res;
    },
    async [type.POST_C1_AUTH]({
      commit
    }, params) {
      const res = await api.C1Auth(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'c1Info',
          val: res.data,
        });
      }
      return res;
    },
    async [type.POST_C2_AUTH]({
      commit
    }, params) {
      const res = await api.C2Auth(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'c2Info',
          val: res.data,
        });
      }
      return res;
    },
    async [type.POST_C2_UPDATE]({
      commit
    }, params) {
      const res = await api.updateUserInfoC2(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'c2Info',
          val: res.data,
        });
      }
      return res;
    },
    async [type.GET_APIKEY]({
      commit
    }, params) {
      const res = await api.getApiKey(params);
      if (res && res.code === 200) {
        commit('setState', {
          key: 'apiKey',
          val: res.data,
        });
      }
      return res;
    },
  },
};
