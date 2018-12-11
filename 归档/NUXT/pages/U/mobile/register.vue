<template>
  <div class="mobile-register">
    <!-- <img src="~/assets/images/mobile/bg.png"
         class="bg"> -->
    <div class="content">
      <img src="~/assets/images/logo.png"
           alt=""
           class="logo">
      <el-form ref="form"
               class="mobile-register-form"
               :model="params"
               label-position="top">
        <el-form-item class="hasMarginBottom"
                      prop="email"
                      :label="Register.register.email.account"
                      :rules="[{required: true, message: Register.register.email.accountTypeError},{validator: checkEmail, trigger: 'change'}]">
          <div class="input">
            <input type="text"
                   v-model="params.email"
                   maxlength="50">
          </div>
        </el-form-item>

        <el-form-item class="hasMarginBottom"
                      :label="Register.pwd"
                      prop="password"
                      :rules="[{required: true, message: Register.pwdEmpty},{ validator: checkPassword, trigger:'change'}]">
          <div class="input">

            <input type="password"
                   v-model="params.password"
                   name="password">
          </div>
        </el-form-item>
        <el-form-item :label="Register.confirmPwd"
                      class="hasMarginBottom"
                      prop="confirmPassword"
                      :rules="[{required: true, message: Register.confirmPwdEmpty},{validator: checkConfirmPassword, trigger:'change'}]">
          <div class="input">
            <input type="password"
                   v-model="params.confirmPassword"
                   name="confirmPassword">
          </div>
        </el-form-item>
        <el-form-item :label="Invitation.InvitationCode"
                      prop="inviteeId">
          <div class="input">
            <input type="text"
                   v-model="params.inviteeId"
                   name="inviteeId">
          </div>
        </el-form-item>
        <el-form-item class="hasMarginBottom check-form-item">
          <el-checkbox v-model="checked">
            {{Register.agreementAgree[3]}}
            <a :href="`${localhost}${terms[locale]}`"
               target="_blank">{{Register.agreementAgree[1]}}</a>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <div class="input">
            <el-button @click="handleSubmit"
                       class="mobile-btn"
                       type="primary">{{Register.createAccont}}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <auth-modal :dialog-visible="dialogVisible"
                  width="100%"
                  :handle-close="closeAuthDialog"
                  :handle-callback="handleCallback" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Utils from '~/utils/';
import * as type from '~/store/modules/user/type';
import Storage from '~/utils/storage';
import { NCLOGIN, NCLOGINH5 } from '~/utils/constant';
import Auth from '~/utils/Auth.js';
export default {
  layout: 'mobileLayout',
  data() {
    return {
      checked: false,
      localhost: 'https://rightbtc.zendesk.com/hc',
      terms: {
        ru_ru: '/en-us/articles/360007479512',
        en_us: '/en-us/articles/360007479512',
        ja_jp: '/en-us/articles/360007479512',
        zh_cn: '/zh-cn/articles/360007479512',
      },
      params: {
        email: '',
        password: '',
        confirmPassword: '',
        inviteeId: '',
      },
      ehtimer: null,
      token: {
        csessionid: '',
        scene: 'nc_login',
        sig: '',
        token: '',
      },
      dialogVisible: false,
    };
  },
  components: {
    Auth,
  },
  mounted() {
    //判断是否为pc 是pc就跳转到pc注册页
    if (!Utils.isMobile()) {
      this.$router.push({
        path: '/u/register',
        query: {
          code: this.$route.query.code,
        },
      });
    }
    this.$nextTick(() => {
      document.body.style = 'min-width: 100%;';
    });
    if (this.$route.query.code) {
      this.params.inviteeId = this.$route.query.code;
    }
  },
  watch: {
    locale() {
      this.$refs.form.clearValidate();
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Login: state => state.i18n.App.Login,
      areaList: state => state.user.areaList,
      Register: state => state.i18n.App.Register,
      isAccountExist: state => state.user.isAccountExist,
      registerSuccess: state => state.user.registerSuccess,
      ErrorCode: state => state.i18n.App.ErrorCode,
      Invitation: state => state.i18n.App.Invitation,
    }),
    isEmail() {
      return Utils.isEmail(this.params.email);
    },
    getScene() {
      return Utils.isMobile() === true ? NCLOGINH5 : NCLOGIN;
    },
  },
  methods: {
    ...mapMutations(['setObjectState', type.SET_STATE]),
    ...mapActions({
      getAreaList: type.GET_AREA_LIST,
      checkUserAccount: type.CHECK_USER_ACCOUNT,
      sendCode: type.SEND_CODE,
      userRegister: type.REGISTER,
    }),
    checkPassword(rule, value, cb) {
      if (value === '') {
        return;
      }
      if (value.length > 7 && /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]/.test(value) && !/\s/.test(value, 'g')) {
        cb();
      } else {
        cb(this.Register.pwdTypeError);
      }
    },
    checkConfirmPassword(rule, value, cb) {
      if (value === '') {
        return;
      }
      if (this.params.confirmPassword !== this.params.password) {
        cb(this.Register.pwdNotSame);
        return;
      }
      cb();
    },
    checkEmail(rule, value, cb) {
      if (!!value) {
        if (!Utils.isEmail(value)) {
          cb(this.Register.register.email.accountTypeError);
        }
        cb();
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (!this.checked) {
            this.$message.error(this.Register.agreementAgree.join(''));
            return;
          }
          this.dialogVisible = true;
        } else {
          return false;
        }
      });
    },
    async onUserRegister() {
      let res = await this.userRegister({ ...this.params, token: this.token });
      if (this.registerSuccess) {
        //注册成功埋点数据
        Storage.set('userId', res.data.id); //记录userId
        Storage.set('userName', res.data.email); //记录userId
        this.$message.success(`${this.Register.linkConfirm.split('$$$')[0]}${this.params.email}${this.Register.linkConfirm.split('$$$')[1]}`);
        this.$router.push('/u/registerstep');
      } else if (this.isAccountExist) {
        this.$message.error(this.Register.isAccountExsist);
      } else {
        this.$message.error(this.ErrorCode[res.code]);
      }
    },
    async handleCallback(data) {
      this.dialogVisible = false;
      this.token = Object.assign({ ...this.token, scene: this.getScene }, data);
      if (!this.params.email || !this.isEmail) {
        this.$message.warning(this.Register.register.email.accountTypeError);
        return false;
      }
      await this.checkUserAccount({ userName: this.params.email }); //判断用户名是否注册
      if (this.isAccountExist) {
        this.$message.warning(this.Register.userExist);
        return false;
      }
      this.onUserRegister();
    },
    closeAuthDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss">
.mobile-register {
  height: 100vh;
  background: url(~assets/images/mobile/bg.png) no-repeat center;
  background-size: 100%;
  width: 100%;
  background-position-y: 0px;
  position: relative;
  .content {
    background: #ffffff;
    box-shadow: 0 4px 18px 0 rgba(30, 43, 79, 0.18);
    border-radius: 6px;
    margin: 0 22px;
    width: 88.9%;
    position: absolute;
    top: 24%;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    .logo {
      width: 140px;
      height: 28px;
      margin: 0 auto;
    }
  }
}
.mobile-register-form {
  margin-top: 30px;
  input {
    width: 100%;
    height: 100%;
    border: none;
    border-bottom: 1px solid #ebedf4;
    outline: none;
    font-size: 16px;
    color: #1c2a57;
    padding-bottom: 4px;
    &:focus {
      border-color: #477bf7;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    color: #787ea3;
    line-height: 21px;
    padding: 0;
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-checkbox__label {
    font-size: 12px;
    color: #787ea3;
    a {
      color: #477bf7;
    }
  }
  .mobile-btn {
    width: 100%;
  }
}
</style>
