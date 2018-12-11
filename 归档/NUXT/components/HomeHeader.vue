<template>
  <header>
    <div class="home-header main-menu">
      <div class="menu-left">
        <span class="logo">
          <nuxt-link to="/">
            <img src="~/assets/images/logo@2x.png"
                 alt="logo" />
          </nuxt-link>
        </span>
        <ul class="nav">
          <li>
            <nuxt-link to="/">{{headLanguage.home}}</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/trade">{{headLanguage.trade}}</nuxt-link>
          </li>
          <li>
            <a :href="!isLogin ? '/u/login' : otcUrl">{{headLanguage.otc}}</a>
          </li>
          <li>
            <nuxt-link to="/sliverBoard">{{headLanguage.sliverRank}}</nuxt-link>
          </li>
          <li v-if="lastTokenSellId">
            <nuxt-link :to="`/tokensale/${lastTokenSellId}`">{{headLanguage.tokensell}}</nuxt-link>
          </li>
          <!-- 烘焙入口 -->
          <li>
            <nuxt-link :to="`baking/_`">{{headLanguage.bake}}</nuxt-link>
          </li>
          <!-- <li>
            <a target="_blank"
               :href="`https://support.rightbtc.com/hc${services[appLocal]}`">{{headLanguage.news}}</a>
          </li> -->

          <!-- <li>
            <a :href="'http://wengtianmeng.com:3000'">{{headLanguage.otc}}</a>
          </li> -->
        </ul>
      </div>
      <div class="menu-right">
        <div class="sign-in"
             v-if="!isBlack">
          <img @click="handlerSignDialog"
               src="~/assets/images/gift@2x.png"
               alt="gift">
        </div>
        <div class="assets df aic"
             v-if="isLogin">
          <!-- <i class="iconfont icon-zichantixian"></i> -->
          <div>
            <i class="iconfont icon-APP"></i>
          </div>
          <a href="#download">App</a>
        </div>
        <div class="assets df aic"
             v-if="isLogin">
          <div>
            <i class="iconfont icon-zichan"></i>
          </div>
          <nuxt-link to="/assets">{{i18n.App.WithDraw.assets}}</nuxt-link>
        </div>
        <div class="login"
             v-if="!isLogin">
          <a href="#download"
             class="app-download"><i class="iconfont icon-APP"></i>App</a>
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
    <!--
      签到
      -->
    <el-dialog :title="commonLanguage.signDialog[0]"
               custom-class="dialogSign"
               :visible.sync="signDialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="640px">
      <div class="dialogCon">
        <img src="~/assets/images/sign-in@2x.png"
             alt="sign-in">
        <dl class="signCon">
          <dt>{{commonLanguage.signDialog[1]}} :</dt>
          <dd class="result"
              v-if="isLogin">
            <em>{{!!signInfo && signInfo.reward}}</em>
            <span>{{!!signInfo && signInfo.asset}}</span>
          </dd>
          <dd v-else
              class="noResult">???</dd>
          <dd>
            <span class="isSign"
                  v-if="!!signInfo && signInfo.hasSigned">{{commonLanguage.signDialog[3]}}</span>
            <el-button v-else
                       class="sign-btn"
                       @click="handlerSign">{{commonLanguage.signDialog[2]}}</el-button>
          </dd>
        </dl>
      </div>
    </el-dialog>
  </header>
</template>

<style scoped lang="scss">
@import "~assets/css/_theme-conf";
.assets {
  &::after {
    display: none !important;
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

header {
  background-color: rgba(1, 21, 75, 0.1) !important;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 2060;
  width: 100%;
  min-width: 1024px;
  .home-header {
    height: 54px;
  }
  .main-menu {
    .menu-left {
      .nav {
        & > li > a {
          color: #e0e8fd;
          line-height: 54px;

          &:hover {
            // color: #7dacff;
            @include interactionPair(color);
          }
        }
      }
      .logo {
        img {
          width: 120px;
        }
      }
    }
    .menu-right {
      .assets {
        & > a {
          color: #e0e8fd;
          line-height: 54px;
        }
      }
      .user-msg {
        & > a {
          color: #e0e8fd;
        }
      }
    }
  }
}
</style>


<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { userLogout, userSign } from "~/store/modules/user/api";
import {
  TOGGLE_ISLOGIN,
  SIGN_STATUS,
  IS_BLACK
} from "~/store/modules/user/type";
import { GET_NEWTOKENSELL } from "~/store/modules/tokensell/types";
import Storage from "~/utils/storage.js";
import langen from "element-ui/lib/locale/lang/en";
import langzh from "element-ui/lib/locale/lang/zh-CN";
import langja from "element-ui/lib/locale/lang/ja";
import langru from "element-ui/lib/locale/lang/ru-RU";
import locale from "element-ui/lib/locale";
import Configs from "~/common/config";
import Utils from "~/utils/";
import btoa from "btoa";

export default {
  head() {
    return {
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.globalDes[this.appLocal]
        },
        {
          hid: "keyword",
          name: "keyword",
          content: this.globalKeyword[this.appLocal]
        }
      ]
    };
  },
  data() {
    return {
      isActive: false,
      day: "icon-taiyang",
      night: "icon-wanshang1",
      services: {
        ru_ru: ["/en-us/sections/360001693052"],
        en_us: ["/en-us/sections/360001693052"],
        ja_jp: ["/en-us/sections/360001693052"],
        zh_cn: ["/zh-cn/sections/360001693052"]
      },
      globalDes: {
        ru_ru:
          "RightBTC Dedicated to providing quality cryptocurrency trading services Professional digital asset wallet services",
        en_us:
          "RightBTC Dedicated to providing quality cryptocurrency trading services Professional digital asset wallet services",
        ja_jp:
          "RightBTC Dedicated to providing quality cryptocurrency trading services Professional digital asset wallet services",
        zh_cn: "RightBTC致力于提供优质的币币交易、专业的数字资产钱包服务"
      },
      globalKeyword: {
        ru_ru:
          "RightBTC.com,Right,BTC,blockchain,eth,bitcoin,BTC, Ethereum,ETP,Digital Currency,Digital Asset，Digital Currency data analysis,Digital Currency industry big data, Virtual Currency data analysis,Virtual Currency,Ctrptocurrency,Cryptocurrency trading, Virtual Currency Transaction ,Token,Dubai Exchange,dubai,exchange,coin,Decentralized",
        en_us:
          "RightBTC.com,Right,BTC,blockchain,eth,bitcoin,BTC, Ethereum,ETP,Digital Currency,Digital Asset，Digital Currency data analysis,Digital Currency industry big data, Virtual Currency data analysis,Virtual Currency,Ctrptocurrency,Cryptocurrency trading, Virtual Currency Transaction ,Token,Dubai Exchange,dubai,exchange,coin,Decentralized",
        ja_jp:
          "RightBTC.com,Right,BTC,区块链,eth,bitcoin,比特币,以太坊,ETP,熵,数字货币,数字资产，数字货币数据分析,数字货币行业大数据,虚拟币数据分析,虚拟货币,虚拟货币交易,虚拟交易,代币,迪拜交易所,dubai,交易所,exchange,coin,去中心化,仮想通貨,取引所,取引,ビットコイン,イーサリアム,仮想通貨出金,仮想通貨入金,日本円取引",
        zh_cn:
          "RightBTC.com,Right,BTC,区块链,eth,bitcoin,比特币,以太坊,ETP,熵,数字货币,数字资产，数字货币数据分析,数字货币行业大数据,虚拟币数据分析,虚拟货币,虚拟货币交易,虚拟交易,加密货币，代币,迪拜交易所,dubai,交易所,exchange,coin,去中心化"
      },
      langs: [
        { title: "English", dataIndex: "en_us" },
        { title: "日本語", dataIndex: "ja_jp" },
        { title: "简体中文", dataIndex: "zh_cn" },
        { title: "Pусский", dataIndex: "ru_ru" }
      ],
      signDialogVisible: false
    };
  },
  async mounted() {
    this.setTheme(this.theme);
    await this.getSignInfo();
    await this.getNewTokenSell();
  },
  methods: {
    ...mapMutations(["setI18n", "setLoginStatus", "setTheme"]),
    ...mapActions({
      signStatus: SIGN_STATUS,
      blackInfo: IS_BLACK
    }),
    // 改变主题
    onThemeChange() {
      this.setTheme();
    },
    // 获取最新的打新活动
    getNewTokenSell() {
      this.$store.dispatch(GET_NEWTOKENSELL);
    },
    handlerTheme() {
      this.isActive = !this.isActive;
    },
    clearCookies(cookiesArr) {
      cookiesArr.forEach((item, index) => {
        Storage.remove(item);
      });
    },
    async userLogout() {
      await userLogout();
      this.setLoginStatus({ key: "isLogin", val: false });
      this.$router.push("/u/login");
      let online_time =
        new Date(Utils.ForMatDate(new Date())).getTime() -
        new Date(Storage.getItem("loginTime")).getTime();
      //退出埋点数据
      this.$saveSkinesis({
        user_id: this.userInfo.userId,
        matcher: "rightbtc_user_logout",
        logout_time: Utils.ForMatDate(new Date()),
        login_time: Storage.getItem("loginTime"),
        online_time: online_time / 1000
      });
      this.clearCookies([
        "globals",
        "isLogin",
        "username",
        "userId",
        "currentNickname"
      ]);
    },
    // 用户选择语言
    onSetLang(item, index) {
      Storage.set("locale", item);
      this.setI18n(item);
      switch (item) {
        case "zh_cn":
          locale.use(langzh); // zh-CN
          zE && zE.setLocale && zE.setLocale("zh-CN");
          break;
        case "ja_jp":
          locale.use(langja); // ja
          zE && zE.setLocale && zE.setLocale("ja");
          break;
        case "en_us":
          locale.use(langen); // en-US
          zE && zE.setLocale && zE.setLocale("en-US");
          break;
        case "ru_ru":
          locale.use(langru); // ru-RU
          zE && zE.setLocale && zE.setLocale("ru-RU");
          break;
      }
    },
    async getSignInfo() {
      const isBlack = await this.getBlackInfo();
      if (this.isLogin && !isBlack) {
        const res = await this.signStatus();
        if (res && res.code === 200) {
          return;
        } else {
          this.$message.error(this.ErrorCode[res.code] || "");
        }
      } else {
        return false;
      }
    },
    async handlerSignDialog() {
      // return;
      if (this.isLogin && !this.signInfo.isActive) {
        this.signDialogVisible = false;
        this.$message(this.commonLanguage.isActive);
        return;
      }
      this.signDialogVisible = true;
    },
    async handlerSign() {
      if (this.isLogin) {
        this.handlerSignDialog();
        const res = await userSign();
        if (res && res.code === 200) {
          this.getSignInfo();
          let timer = setTimeout(() => {
            this.signDialogVisible = false;
          }, 400);
          clearTimeout(this.timer);
        } else {
          this.$message.error(this.ErrorCode[res.code]);
        }
      } else {
        this.signDialogVisible = false;
        this.$router.push("/u/login");
      }
    },
    async getBlackInfo() {
      const res = await this.blackInfo();
      if (res && res.code === 200) {
        return;
      }
    }
  },
  watch: {
    isLogin() {
      this.getSignInfo();
    }
  },
  computed: {
    ...mapState({
      i18n: state => state.i18n,
      headLanguage: state => state.i18n.App.Header,
      commonLanguage: state => state.i18n.App.Common,
      ErrorCode: state => state.i18n.App.ErrorCode,
      signInfo: state => state.user.signInfo,
      isBlack: state => state.user.isBlack,
      isLogin: state => state.isLogin,
      userName: state => state.userName,
      appLocal: state => state.locale,
      theme: state => state.theme,
      lastTokenSellId: state => {
        return !!state.tokensell && state.tokensell.lastId;
      },
      userInfo: state => state.user.userInfo
    }),
    activeLangIndex() {
      switch (this.appLocal) {
        case "ru_ru":
          return 3;
        case "zh_cn":
          return 2;
        case "ja_jp":
          return 1;
        case "en_us":
          return 0;
        default:
          return 0;
      }
    },
    otcUrl() {
      const at = btoa(
        JSON.stringify({ isLogin: this.isLogin, locale: this.appLocal })
      );
      return `${Configs.DEFAULT.OTC}?at=${at}`;
    }
  }
};
</script>

