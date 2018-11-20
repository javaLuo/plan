<template>
  <header :class="{rightOrderShow}">
    <div class="header-content">
      <div class="header-left">
        <div class="logo">
          <a>
            <img src="~/static/header/logo@2x.png"
                 alt="RightBTC" />
          </a>
        </div>
        <nav>
          <nuxt-link to="/trade">
            {{Header.trastion}}
          </nuxt-link>
          <nuxt-link to="/bigtrade">
            {{Header.bigTrastion}}
          </nuxt-link>
          <a @click="goToAd"
             href="javascript:;"
             :to="!!otcUserInfo && otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].busiType === 0 ? '/business/auth':'/ad/publishAd' ">
            {{Header.publoshAd}}
          </a>
          <a :href="tulipexUrl">{{Header.cionTrastion}}</a>
        </nav>
      </div>
      <div class="header-right">
        <div :class="['order', {rightOrderShow: !rightOrderShow}]"
             @mouseenter.stop.prevent="changeReadStatus">
          <em class="hasnotices"
              v-show="hasNotice"></em>
          <i class="iconfont icon-dingdan" />
          <nuxt-link to="/order/orderList">{{Header.order}}</nuxt-link>
          <OrderMessage></OrderMessage>
        </div>
        <div class="assets">
          <i class="iconfont icon-zichan" />
          <nuxt-link to="/account">{{Header.asset}}</nuxt-link>
        </div>
        <div class="user">
          <!-- <Avatar style="margin-right:12px;margin-top:16px;"
                  v-if="!!otcUserInfo && !!userInfo && otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].nickname"
                  :name="otcUserInfo[userInfo.userId].nickname|firstUpperChar" /> -->
          <Avatar style="margin-right:12px;margin-top:16px;"
                  :name="thisNickName|firstUpperChar"
                  :id="userInfo && userInfo.userId"
                  :online="true" />
          <span class="username-text">{{thisNickName}}</span>
          <ul class="dropdown">
            <li>
              <nuxt-link to="/member">{{Header.myCenter}}</nuxt-link>
            </li>
            <li v-if="!!otcUserInfo && otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].busiType !== 0">
              <nuxt-link to="/ad/adList">
                {{Header.myAds}}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/business/auth">
                {{Header.businessAuth}}
              </nuxt-link>
            </li>
            <li>
              <a href="#"
                 @click="userLoginOut">{{Header.logOut}}</a>
            </li>
          </ul>
        </div>
        <div class="language"
             :class="{'lang-show':langSelectorShow}">
          <div class="language-wrap"
               @click="handleLanguage()">
            <span class="current-language">
              {{language[locale] ? language[locale].text : ""}}
            </span>
          </div>
          <ul class="dropdown">
            <li :class="{active:item.type === locale}"
                v-for="item in language"
                :key="item.type"
                @click="handleSetLocale(item.type)">{{item.text}}</li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
/* eslint-disable */
import Avatar from '~/components/Avatar.vue';
import Tabs from '~/components/Tabs.vue';
import OrderMessage from '~/components/Order/OrderMessage.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { GET_KYC_USER_INFO_ACTIONS, GET_USER_INFO_ACTIONS, USER_LOGIN_OUT_ACTIONS, GET_OTC_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import { UPDATE_TRADE_WEBSOCKET } from '~/store/modules/order/type';
import { USER_BUSINESS_INFO_ACTIONS } from '~/store/modules/account/type';

import Configs from '~/common/config';
import locale from 'element-ui/lib/locale';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import Storage from '~/utils/storage';

export default {
  data() {
    return {
      langSelectorShow: false,
      tulipexUrl: Configs.DEFAULT.TRADE_URL,
      name: '',
      language: {
        en_us: {
          text: 'English',
          type: 'en_us',
        },
        zh_cn: {
          text: '简体中文',
          type: 'zh_cn',
        },
      },
    };
  },
  components: {
    Avatar,
    OrderMessage,
  },
  filters: {
    firstUpperChar: str => {
      if (!!str) {
        return str
          .trim()
          .substr(0, 1)
          .toUpperCase();
      }
      return '';
    },
  },
  async created() {
    await this.getUserInfo();
    await this.getBusinessInfo();
    let userId = !!this.userInfo.userId ? this.userInfo.userId : '';
    await this.getOtcUserInfoByUserId({ userId });
    //	await this.getKycUserInfo();
    if (process.browser) {
      if (!sessionStorage.getItem('realName')) {
        sessionStorage.setItem('realName', !!this.kycUserInfo && this.kycUserInfo.realName);
      }
    }
  },
  computed: {
    ...mapState({
      Header: state => state.i18n.App.Header,
      AdList: state => state.i18n.App.AdList,
      locale: state => state.locale,
      currentNickname: state => state.currentNickname,
      rightOrderShow: state => state.rightOrderShow,
      userInfo: state => state.member.userInfo,
      otcUserInfo: state => state.member.otcUserInfo,
      orderNotice: state => state.order.orderNotice,
      hasNotice: state => state.order.hasNotice,
      order: state => state.order,
      businessInfo: state => state.account.businessInfo,
    }),
    thisNickName() {
      //用当前登录用户信息中的nickname
      return this.userInfo && this.userInfo.nickName ? this.userInfo.nickName : '';
    },
  },
  methods: {
    ...mapMutations(['setI18n']),
    ...mapActions({
      getUserInfo: GET_USER_INFO_ACTIONS,
      //getKycUserInfo: GET_KYC_USER_INFO_ACTIONS,
      getOtcUserInfoByUserId: GET_OTC_USER_INFO_ACTIONS,
      loginOut: USER_LOGIN_OUT_ACTIONS,
      readedOrderNotice: UPDATE_TRADE_WEBSOCKET,
      getBusinessInfo: USER_BUSINESS_INFO_ACTIONS,
    }),
    goToAd() {
      // 正在被处罚1，不能发广告
      if (this.businessInfo && this.businessInfo.isBlack === 1) {
        this.$message.error(this.AdList.isblack);
        return;
      }
      this.$router.push(!!this.otcUserInfo && this.otcUserInfo[this.userInfo.userId] && this.otcUserInfo[this.userInfo.userId].busiType === 0 ? '/business/auth' : '/ad/publishAd');
    },
    handleLanguage() {
      this.langSelectorShow = !this.langSelectorShow;
    },
    changeReadStatus(e) {
      if (!this.orderNotice.length) return;
      this.readedOrderNotice({ userid: this.userInfo.userId });
    },
    handleSetLocale(text) {
      if (text === 'zh_cn') {
        locale.use(zhLocale);
      } else if (text === 'en_us') {
        locale.use(enLocale);
      }
      Storage.set('locale', text);
      this.setI18n(text);
      this.langSelectorShow = false;
    },
    userLoginOut() {
      this.loginOut();
      Storage.remove('globals');
      Storage.remove('isLogin');
      Storage.remove('username');
      Storage.remove('currentNickname');
      location.href = Configs.DEFAULT.LOGIN_URL;
    },
  },
};
</script>



