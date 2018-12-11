
<template>
  <div class="container register">
    <div class="register-step rcontent"
         v-if="step === 1">
      <div class="logo">
        <img src="~/assets/images/logo.png"
             width="100%"
             height="100%"
             alt="">
      </div>
      <div class="message">{{Register.emailConfirm}}</div>
      <div class="content">
        {{Register.linkConfirm.split('$$$')[0]}}
        {{userName}}
        {{Register.linkConfirm.split('$$$')[1]}}
        <a @click="dialogVisible = true">{{Register.resendEmail}} >></a>
      </div>
    </div>

    <div class="register-step rcontent"
         v-if="step === 2">
      <div class="logo">
        <img src="~/assets/images/logo.png"
             width="100%"
             height="100%"
             alt="">
      </div>
      <div class="message">{{Register.accountConfirm}}</div>
      <div class="content">
        {{Register.linkSuccess.split('$$$')[0]}}
        ({{time}})
        <nuxt-link to="/u/login">{{Login.okBtn}}</nuxt-link>
        <!-- <a @click="dialogVisible = true">{{Register.resendEmail}} >></a> -->
      </div>
    </div>

    <div class="register-step rcontent"
         v-if="step === 3">
      <div class="logo">
        <img src="~/assets/images/logo.png"
             width="100%"
             height="100%"
             alt="">
      </div>
      <div class="message">{{Register.accountConfirm}}</div>
      <div class="content">
        {{Register.linkError}}
        <a @click="dialogVisible = true">{{Register.resendEmail}} >></a>
      </div>
    </div>
    <auth-modal :dialog-visible="dialogVisible"
                :handle-close="closeAuthDialog"
                :handle-callback="handleCallback" />
  </div>
</template>

<script>
import { RESEND_EMAIL } from '~/store/modules/user/type';
import { mapActions, mapState, mapMutations } from 'vuex';
import storage from '~/utils/storage';
import Utils from '~/utils/';
import Auth from '~/utils/Auth.js';
const auth = new Auth();
export default {
  data() {
    return {
      isSuccess: false,
      dialogVisible: false,
      token: {
        csessionid: '',
        scene: 'nc_login',
        sig: '',
        token: '',
      },
      time: 3,
      id: '',
    };
  },
  computed: {
    ...mapState({
      Register: state => state.i18n.App.Register,
      Login: state => state.i18n.App.Login,
      ErrorCode: state => state.i18n.App.ErrorCode,
      appLocal: state => state.locale,
      isLogin: state => state.isLogin, // 是否已登录
    }),
    step() {
      if (!this.$route.query.param) return 1;
      let param = JSON.parse(this.$route.query.param);
      if (!!param && param.code === 200) {
        this.gotoLoin();
        return 2;
      } else {
        return 3;
      }
      return 1;
    },
    userName() {
      return storage.get('userName');
    },
  },
  mounted() {
    if (this.isLogin) {
      this.$router.push('/');
      return;
    }
    if (!this.$route.query.param) {
      this.id = storage.get('userId');
      return;
    }
    let param = JSON.parse(this.$route.query.param);

    if (!!param && param.code === 200) {
      this.$saveSkinesis({
        user_id: param.data.id, //真实用户ID
        matcher: 'rightbtc_user_register',
        register_time: Utils.ForMatDate(new Date()),
        register_type: 'email',
        user_email: param.data.email,
        user_country: '',
        user_phone: '',
      });
    }
    this.setLang((!!param && param.data.language) || 'zh-cn');
    this.id = (!!param && param.data.id) || ''; //临时用户id
  },
  methods: {
    ...mapMutations(['setI18n', 'setLoginStatus']),
    ...mapActions({
      resendEmail: RESEND_EMAIL,
    }),
    async send() {
      let res = await this.resendEmail({ ...this.token, id: this.id }); //临时用户ID
      if (!!res && res.code === 200) {
        this.$message.success(this.Register.sendSuc);
      } else if (!!res && res.code === 1409) {
        this.$message.success(this.Register.sendRedy);
        this.$router.push('/u/login');
      } else if (!!res && res.code === 1466) {
        this.$message.success(this.ErrorCode[res.code]);
        this.$router.push('/u/login');
      } else {
        this.$message.error(this.ErrorCode[res.code]);
      }
      this.dialogVisible = false;
    },
    closeAuthDialog() {
      this.dialogVisible = false;
    },
    handleCallback(data) {
      this.token = Object.assign({ ...this.token, scene: this.getScene }, data);
      this.send();
    },
    setLang(language) {
      this.setI18n(language);
      this.$nextTick(() => {
        var element = document.createElement('script');
        element.onload = () => {
          let lang = 'en-US';
          switch (this.appLocal) {
            case 'ja_jp':
              lang = 'ja';
              break;
            case 'zh_cn':
              lang = 'zh-CN';
              break;
            case 'ru_ru':
              lang = 'ru-RU';
              break;
          }
          setTimeout(() => {
            zE &&
              zE(() => {
                zE.setLocale(lang);
              });
          }, 800);
        };
        element.src = 'https://static.zdassets.com/ekr/snippet.js?key=b2d70176-39d4-4e38-9667-236aa0221027';
        element.id = 'ze-snippet';
        document.body.appendChild(element);
      });
    },
    beforeDestroy() {
      storage.remove('userId');
      storage.remove('userName');
    },
    gotoLoin() {
      let timer = setInterval(() => {
        this.time = this.time - 1;
        if (this.time === 0) {
          this.$router.push('/u/login');
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf.scss';

.container.register > {
  .register-step {
    width: 580px;
    margin-top: 120px;
    display: flex;
    flex-flow: column;
    min-width: 580px;
    padding-bottom: 72px;
    @include bgPair(background-color);
    .logo {
      width: 160px;
      height: 32px;
      margin: 0 auto;
      margin-top: 34px;
    }
    .message {
      margin: 0 auto;
      margin-top: 22px;
      display: flex;
      align-items: center;
      font-size: 18px;
      @include fontPair(color);
      &::before,
      &::after {
        content: '';
        display: block;
        width: 72px;
        height: 1px;
        border-top: 1px solid #eff0f3;
      }
      &::before {
        margin-right: 16px;
      }
      &::after {
        margin-left: 16px;
      }
    }
    .content {
      width: 492px;
      font-size: 14px;
      @include fontPair(color);
      margin: 42px 44px 0 44px;
      a {
        font-size: 14px;
        @include interactionPair(color);
        cursor: pointer;
      }
    }
  }
}
</style>
