<template>
  <div class="container login">
    <div class="rcontent">
      <div class="login-title"
           v-if="steps === 1 || steps === 3">
        {{ForgotPassword.step1}}
      </div>
      <div class="login-title"
           v-else>
        {{ForgotPassword.step2}}
      </div>
      <el-form ref="form"
               class="login-form"
               :model="params"
               label-position="top">
        <el-form-item prop="userName"
                      :label="ForgotPassword.userName"
                      v-if="steps === 1"
                      :rules="[
              {required: true, message: EhFindUser.warnMes1},
              { validator: validateUserName, trigger:'blur'}]">
          <div class="input">
            <el-input maxlength="50"
                      v-model="params.userName"
                      name="userName"></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="steps === 2"
                      class="hasMarginBottom"
                      :label="ForgotPassword.email">
          <div class="forgot-input">
            {{decodeUserName}}
          </div>
        </el-form-item>
        <el-form-item prop="code"
                      v-show="steps === 2"
                      :label="Register.register.email.vCode"
                      :rules="[{required: true, message: Register.register.email.vCodeEmpty}]">
          <div class="input send-code">
            <div style="width:330px">
              <el-input v-model="params.code"></el-input>
            </div>

            <div style="width:128px">
              <SendCodeBtn :userName="params.userName"
                           class="sendCode"></SendCodeBtn>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-show="steps === 3"
                      prop="password"
                      :label="ForgotPassword.password"
                      class="hasMarginBottom"
                      :rules="[ 
              {required: true, message: ForgotPassword.passwordPlaceholder},
              { validator: checkPassword, trigger:'change'}
              ]">
          <div class="input">
            <pwd-input v-model="params.password"
                       name="password" />
          </div>
        </el-form-item>
        <el-form-item v-show="steps === 3"
                      prop="confirmpassword"
                      :label="ForgotPassword.confirmpassword"
                      :rules="[ 
                {required: true, message: ForgotPassword.confirmpasswordPlaceholder},
                { validator: checkConfirmPassword, trigger:'change'}]">
          <div class="input">
            <el-input type="password"
                      v-model="params.confirmpassword"
                      name="confirmpassword"></el-input>
          </div>
        </el-form-item>
        <el-form-item style="padding-top:48px">
          <div class="input">
            <el-button @click="onSubmit"
                       type="primary"
                       :loading="loading">{{ForgotPassword.button}}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Utils from '~/utils';
import { CHECK_USER_ACCOUNT, SEND_CODE, CHECK_BIND_STATUS, CHECK_VERIFICATION_CODE, FORGOT_PASSWORD, SET_STATE } from '~/store/modules/user/type';
export default {
  data() {
    return {
      steps: 1,
      params: {
        userName: '',
        code: '',
        password: '',
        confirmpassword: '',
      },
      dialogVisible: false,
      imgParameter: '',
      ehtimer: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      EhFindUser: state => state.i18n.App.EhFindUser,
      ForgotPassword: state => state.i18n.App.ForgotPassword,
      Login: state => state.i18n.App.Login,
      Register: state => state.i18n.App.Register,
      isAccountExist: state => state.user.isAccountExist,
      userStatus: state => state.user.userStatus,
      ErrorCode: state => state.i18n.App.ErrorCode,
      sendCodeParams: state => state.user.sendCodeParams, //修改密码时需要
      isShowCountDown: state => state.user.isShowCountDown,
      countDownText: state => state.user.countDown,
      locale: state => state.locale,
    }),
    isEmail() {
      return Utils.isEmail(this.params.userName);
    },
    decodeUserName() {
      return Utils.decodeUserName(this.params.userName);
    },
  },
  watch: {
    locale() {
      this.$refs.form.clearValidate();
    },
  },
  methods: {
    ...mapMutations(['setObjectState']),
    ...mapActions({
      checkUserAccount: CHECK_USER_ACCOUNT,
      sendCode: SEND_CODE,
      checkUserStatus: CHECK_BIND_STATUS,
      checkVerificationCode: CHECK_VERIFICATION_CODE,
      forgotPassWord: FORGOT_PASSWORD,
    }),
    async validateUserName(rule, value, cb) {
      if (value === '') {
        return;
      }
      if (!this.isEmail && value.length < 4) {
        cb(this.Login.accountError);
        return;
      }

      await new Promise(async resolve => {
        this.debounce(async () => {
          await this.checkUserAccount({ userName: value });
          resolve();
        }, 500);
      });
      if (!this.isAccountExist) {
        cb(this.Login.hasnotAccount);
        return;
      }
      cb();
    },
    checkPassword(rule, value, cb) {
      if (value === '') {
        return;
      }
      if (value.length > 7 && /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]/.test(value) && !/\s/.test(value)) {
        cb();
      } else {
        cb(this.Register.pwdTypeError);
      }
    },
    checkConfirmPassword(rule, value, cb) {
      if (value === '') {
        return;
      }
      if (this.params.confirmpassword !== this.params.password) {
        cb(this.ForgotPassword.confirmPasswordError);
        return;
      }
      cb();
    },
    onSubmit() {
      this.loading = true;
      if (this.steps === 1) {
        this.onStepFirst();
      } else if (this.steps === 2) {
        this.onStepSecond();
      } else if (this.steps === 3) {
        this.onStepThird();
      }
    },
    onStepFirst() {
      this.$refs.form.validateField('userName', async error => {
        if (!error) {
          await this.checkUserStatus({
            userName: this.params.userName,
          });
          this.steps = 2;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    async onStepSecond() {
      this.$refs.form.validateField('code', async error => {
        if (!error) {
          let res = await this.checkVerificationCode({ ...this.params });
          if (res && res.code !== 200) {
            this.$message.error(this.ErrorCode[res.code]);
            this.loading = false;
            return;
          }
          this.steps = 3;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    async onStepThird() {
      this.$refs.form.validate(async (valid, obj) => {
        if (obj.password || obj.confirmpassword) {
          this.loading = false;
          return;
        }
        let res = await this.forgotPassWord({
          phone: this.isPhone ? this.params.userName : '',
          email: this.isEmail ? this.params.userName : '',
          phonecode: this.isPhone ? this.params.code : '',
          emailcode: this.isEmail ? this.params.code : '',
          password: this.params.password,
        });

        if (res.code === 200) {
          //修改密码成功
          this.$message.success(this.EhFindUser.resetSuc);
          this.$router.push('/u/login');
        } else {
          this.loading = false;
          this.$message.error(this.ErrorCode[res.code]);
        }
      });
    },
    async handleSendCode() {
      this.setObjectState({
        key: 'sendCodeParams',
        val: {
          userName: this.params.userName,
          phoneArea: this.userStatus.phoneArea,
        },
      });
      this.$store.commit(SET_STATE, { key: 'isShowCodeModal', val: true });
      this.$store.commit(SET_STATE, { key: 'isForGot', val: true });
    },
    handleCloseModal() {
      this.dialogVisible = false;
    },
    debounce(fn, time) {
      this.ehtimer && clearTimeout(this.ehtimer);
      this.ehtimer = setTimeout(() => {
        fn();
      }, time);
    },
  },
};
</script>

<style>
</style>
