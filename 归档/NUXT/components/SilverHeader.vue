<template>
  <header :class="slHeader">
    <div class="main-menu">
      <div class="menu-left">
        <span class="logo">
          <nuxt-link v-if="locale === 'zh_cn'"
                     to="/sliverBoard"><img src="~/assets/images/sl-logo@2x.png"
                 alt="logo" /></nuxt-link>
          <nuxt-link v-if="locale !== 'zh_cn'"
                     to="/sliverBoard"><img src="~/assets/images/sl-logo-en@2x.png"
                 alt="logo" /></nuxt-link>
        </span>
        <ul class="nav">
          <!-- <li><nuxt-link to="/">{{headLanguage.home}}</nuxt-link></li> -->
          <li>
            <nuxt-link to="/sliverexchange">{{headLanguage.trade}}</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/trade">{{headLanguage.motherboard}}</nuxt-link>
          </li>
        </ul>
      </div>
      <!-- <div class="menu-right">
        <div class="login" v-show="!isLogin">
          <nuxt-link to="/u/login">{{commonLanguage.logIn}}</nuxt-link>
          <nuxt-link to="/u/register">{{commonLanguage.register}}</nuxt-link>
        </div>
        <div class="user-msg" v-show="isLogin">
          <i class="iconfont icon-touxiang"></i>
          <nuxt-link to="/u">{{userName}}</nuxt-link>
          <span>|</span>
          <a href="javascript:;" @click="userLogout">{{commonLanguage.logOut}}</a>
        </div>
        
        <div class="language">
          <span @click="onSetLang('zh_cn')">CN</span>
          <em>/</em>
          <span @click="onSetLang('en_us')">EN</span>
        </div>
      </div> -->
      <div class="menu-right">
        <div class="assets"
             v-if="isLogin">
          <i class="iconfont icon-zichan"></i>
          <nuxt-link to="/assets">{{headLanguage.myAssets}}</nuxt-link>
          <!-- <ul class="dropdown">
            <li>
              <nuxt-link to="/asset/assetList">{{headLanguage.assetList}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/asset/withdraw">{{headLanguage.withdraw}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/asset/deposit">{{headLanguage.deposit}}</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/asset/address">{{headLanguage.address}}</nuxt-link>
            </li>
          </ul> -->
        </div>
        <div class="login"
             v-if="!isLogin">
          <nuxt-link to="/u/login">{{commonLanguage.logIn}}</nuxt-link>
          <nuxt-link to="/u/register">{{commonLanguage.register}}</nuxt-link>
        </div>
        <div class="user-msg"
             v-if="isLogin">
          <i class="iconfont icon-wode"></i>
          <nuxt-link to="/u">{{userName}}</nuxt-link>
          <span>|</span>
          <a href="javascript:;"
             class="logout"
             @click="userLogout">{{commonLanguage.logOut}}</a>
        </div>
        <!-- 皮肤按钮 -->
        <div class="theme-btn"
             @click="onThemeChange">
          <i :class="`iconfont ${ theme ==='light' ? 'icon-yueliang' : 'icon-taiyang1'}`"></i>
        </div>
        <div class="language">
          <p class="active-language">
            {{langs[activeLangIndex].title}}
          </p>
          <ul class="dropdown">
            <li @click="onSetLang(lang.dataIndex, index)"
                v-for="(lang, index) in langs"
                :key="index">{{lang.title}}</li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { userLogout } from '~/store/modules/user/api';
import { TOGGLE_ISLOGIN } from '~/store/modules/user/type';
import Storage from '~/utils/storage.js';
import langen from 'element-ui/lib/locale/lang/en';
import langzh from 'element-ui/lib/locale/lang/zh-CN';
import langja from 'element-ui/lib/locale/lang/ja';
import langru from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';
import Utils from '~/utils/';

export default {
  data() {
    return {
      isActive: false,
      day: 'icon-taiyang',
      night: 'icon-wanshang1',
      langs: [{ title: 'English', dataIndex: 'en_us' }, { title: '日本語', dataIndex: 'ja_jp' }, { title: '简体中文', dataIndex: 'zh_cn' }, { title: 'Pусский', dataIndex: 'ru_ru' }],
    };
  },
  mounted() {
    this.setTheme(this.theme);
  },
  methods: {
    ...mapMutations(['setI18n', 'setLoginStatus', 'setTheme']),
    handlerTheme() {
      this.isActive = !this.isActive;
    },
    clearCookies(cookiesArr) {
      cookiesArr.forEach((item, index) => {
        Storage.remove(item);
      });
    },
    // 改变主题
    onThemeChange() {
      this.setTheme();
    },
    async userLogout() {
      await userLogout();
      this.setLoginStatus({ key: 'isLogin', val: false });
      this.$router.push('/u/login');
      let online_time = new Date(Utils.ForMatDate(new Date())).getTime() - new Date(Storage.getItem('loginTime')).getTime();
      //退出埋点数据
      this.$saveSkinesis({
        user_id: this.userInfo.userId,
        matcher: 'rightbtc_user_logout',
        logout_time: Utils.ForMatDate(new Date()),
        login_time: Storage.getItem('loginTime'),
        online_time: online_time / 1000,
      });
      this.clearCookies(['globals', 'isLogin', 'username', 'userId', 'currentNickname']);
    },
    onSetLang(item, index) {
      Storage.set('locale', item);
      this.setI18n(item);
      switch (item) {
        case 'zh_cn':
          locale.use(langzh);
          zE && zE.setLocale && zE.setLocale('zh-CN');
          break;
        case 'ja_jp':
          locale.use(langja);
          zE && zE.setLocale && zE.setLocale('ja');
          break;
        case 'en_us':
          locale.use(langen);
          zE && zE.setLocale && zE.setLocale('en-US');
          break;
        case 'ru_ru':
          locale.use(langru); // ru-RU
          zE && zE.setLocale && zE.setLocale('ru-RU');
          break;
      }
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      headLanguage: state => state.i18n.App.Header,
      commonLanguage: state => state.i18n.App.Common,
      isLogin: state => state.isLogin,
      userName: state => state.userName,
      appLocal: state => state.locale,
      theme: state => state.theme,
      userInfo: state => state.user.userInfo,
    }),
    slHeader() {
      return {
        sliver: this.$nuxt.$route.name == 'SliverBoard',
      };
    },
    activeLangIndex() {
      switch (this.appLocal) {
        case 'ru_ru':
          return 3;
        case 'zh_cn':
          return 2;
        case 'ja_jp':
          return 1;
        case 'en_us':
          return 0;
        default:
          return 0;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

$light003: #fff;

header {
  width: 100%;
  min-width: 1024px;
  &.sliver {
    position: absolute;
    z-index: 9999;
    background: transparent;
  }
  .menu-left {
    .logo {
      img {
        width: 187px !important;
      }
    }
    .nav {
      > li {
        > a {
          &:hover {
            color: #4fc183 !important;
          }
        }
      }
    }
  }
  .menu-right {
    .login {
      a {
        color: $lightSLButtonColor !important;
        border: 1px solid $lightSLBorderColor !important;
        &:hover {
          color: #33355b !important;
          background-image: linear-gradient(90deg, #65d38a 0%, #3ab490 100%) !important;
        }
      }
    }
  }
  .theme-btn {
    align-self: center;
    padding: 5px 0;
    cursor: pointer;
    i {
      width: 16px;
      height: 16px;
      font-size: 28px;
    }
  }
}
</style>

