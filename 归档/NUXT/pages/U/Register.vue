<template>
  <div class="container register">
    <div class="rcontent">
      <div class="login-title">
        <div class="title">
          {{Register.welcomeRegister}}
        </div>
        <nuxt-link to="/u/login">
          {{Register.hadAccount[1]}}
        </nuxt-link>
      </div>
      <el-form ref="form"
               class="register-form"
               :model="params"
               label-position="top">
        <el-form-item class="hasMarginBottom"
                      prop="email"
                      :label="Register.register.email.account"
                      :rules="[{required: true, message: Register.register.email.accountTypeError},{validator: checkEmail, trigger: 'change'}]">
          <div class="input">
            <el-input maxlength='50'
                      type="text"
                      v-model="params.email"
                      name="email" />
          </div>
        </el-form-item>
        <el-form-item class="hasMarginBottom"
                      :label="Register.pwd"
                      prop="password"
                      :rules="[{required: true, message: Register.pwdEmpty},{ validator: checkPassword, trigger:'change'}]">
          <div class="input">
            <pwd-input v-model="params.password"
                       name="password" />
          </div>
        </el-form-item>
        <el-form-item :label="Register.confirmPwd"
                      class="hasMarginBottom"
                      prop="confirmPassword"
                      :rules="[{required: true, message: Register.confirmPwdEmpty},{validator: checkConfirmPassword, trigger:'change'}]">
          <div class="input">
            <el-input type="password"
                      v-model="params.confirmPassword"
                      name="confirmPassword" />
          </div>
        </el-form-item>
        <el-form-item :label="Invitation.InvitationCode"
                      prop="inviteeId">
          <div class="input">
            <el-input type="inviteeId"
                      v-model="params.inviteeId"
                      name="inviteeId" />
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
                       type="primary">{{Register.createAccont}}</el-button>
            <!-- <tl-button @click="handleSubmit">{{Register.createAccont}}</tl-button> -->
          </div>
        </el-form-item>
        <!-- <el-form-item class="beneath-submit">
          <span>{{Register.hadAccount[0]}}

          </span>
        </el-form-item> -->
      </el-form>
      <auth-modal :dialog-visible="dialogVisible"
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
  data() {
    return {
      localhost: 'https://rightbtc.zendesk.com/hc',
      terms: {
        ru_ru: '/en-us/articles/360007479512',
        en_us: '/en-us/articles/360007479512',
        ja_jp: '/en-us/articles/360007479512',
        zh_cn: '/zh-cn/articles/360007479512',
      },
      checked: false, //是否选中协议
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
  async mounted() {
    //判断是否为手机 是手机就跳转到手机注册页
    if (Utils.isMobile()) {
      this.$router.push({
        path: '/u/mobile/register',
        query: {
          code: this.$route.query.code,
        },
      });
    }
    if (this.$route.query.code) {
      this.params.inviteeId = this.$route.query.code;
    }
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