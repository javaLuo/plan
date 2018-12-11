<template>
  <div class="container">
    <div class="setting fundPwd">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/FundPwd'}">{{!!userinfo.secertStatus ? Prompt.editFundsPwd: Prompt.setFundsPwd}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{!!userinfo.secertStatus ? Prompt.editFundsPwd: Prompt.setFundsPwd}}</div>
        <div class="content">
          <el-form :model="fundForm"
                   :rules="rules"
                   ref="capitalPWD"
                   label-width="414px"
                   class="demo-ruleForm">
            <el-form-item :label="FundsPwd.label.fundsPwd"
                          prop="fundPwd">
              <el-input type="password"
                        v-model="fundForm.fundPwd"
                        :placeholder="FundsPwd.placeholder.setFundsPwd"
                        auto-complete="off"
                        maxlength="14">
              </el-input>
            </el-form-item>
            <el-form-item :label="FundsPwd.label.confirmPwd"
                          prop="confirmPwd">
              <el-input type="password"
                        v-model="fundForm.confirmPwd"
                        auto-complete="off"
                        :placeholder="FundsPwd.placeholder.confirmPwd"
                        maxlength="14">
              </el-input>
            </el-form-item>
            <el-form-item :label="FundsPwd.label.email">
              <el-input v-if="!!userinfo.emailBinded"
                        :value="userinfo.emailBinded"
                        disabled>
              </el-input>
              <!-- -link to="/u/bindMailbox" v-else>{{FundsPwd.label.toBindEmail}}</nuxt-link> -->
            </el-form-item>
            <el-form-item :label="FundsPwd.label.emailCode"
                          prop="captcha">
              <el-input v-model="fundForm.captcha"
                        :placeholder="FundsPwd.placeholder.emailCode"
                        maxlength="6"
                        class="send-input">
              </el-input>
              <SendCodeBtn class="sendCode"
                           :style="{width: '96px', 'margin-left': '16px'}"></SendCodeBtn>
            </el-form-item>
            <el-form-item>
              <el-button class="determine"
                         @click="submitForm('capitalPWD')"
                         :loading="loading">
                {{FundsPwd.okBtn}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import * as userTypes from '~/store/modules/user/type';
import * as settingsTypes from '~/store/modules/settings/type';
import Configs from '~/common/config';
let funPwsReg = /^[0-9a-zA-Z]*$/g;

export default {
  data() {
    return {
      loading: false,
      fundForm: {
        fundPwd: '',
        confirmPwd: '',
        captcha: '',
      },
      rules: {
        fundPwd: [{ validator: this.validatePass, trigger: 'change' }],
        confirmPwd: [{ validator: this.validatePass2, trigger: 'change' }],
        captcha: [{ validator: this.checkCode, trigger: 'change' }],
      },
      imgParameter: '',
      dialogVisible: false,
    };
  },
  watch: {
    locale() {
      this.$refs['capitalPWD'].clearValidate();
    },
  },
  computed: {
    ...mapState({
      userinfo: state => state.user.userInfo,
      Prompt: state => state.i18n.App.Prompt,
      Settings: state => state.i18n.App.Settings,
      FundsPwd: state => state.i18n.App.FundsPwd,
      ErrorCode: state => state.i18n.App.ErrorCode,
      locale: state => state.locale,
      SettingData: state => state.settings,
    }),
  },
  methods: {
    ...mapActions({
      editCapitalPass: settingsTypes.POST_EDIT_CAPITALPASS,
      getUserInfo: userTypes.GET_USER_INFO,
      sendCode: userTypes.SEND_CODE,
    }),
    goToBackUrl(url) {
      if (this.$route.query && this.$route.query.returnUrl) {
        // 这是从OTC跳过来的
        location.href = `${Configs.DEFAULT.OTC}/${this.$route.query.returnUrl.replace(/^\//, '')}`;
      } else {
        this.$router.push(url);
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.FundsPwd.placeholder.fundsPwd));
      } else {
        if (/^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){8,14}$/i.test(value) && value.indexOf(' ') === -1) {
          callback();
        } else {
          callback(new Error(this.FundsPwd.fundsPwdUnvalid));
        }
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.FundsPwd.placeholder.confirmPwd));
      } else if (value !== this.fundForm.fundPwd) {
        callback(new Error(this.FundsPwd.notSame));
      } else {
        callback();
      }
    },
    checkCode(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.FundsPwd.placeholder.emailCode));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid, values) => {
        if (valid) {
          this.loading = true;
          let res = await this.editCapitalPass({
            capPassword: this.fundForm.confirmPwd,
            code: this.fundForm.captcha,
            method: this.userinfo.secertStatus,
          });
          if (res && res.code === 200) {
            this.$message.success(this.FundsPwd.setSuccess);
            this.loading = false;
            this.resetForm('capitalPWD');
            this.goToBackUrl('/u');
          } else {
            this.loading = false;
            this.$message.error(this.ErrorCode[res.code]);
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async handleSendCode() {
      this.imgParameter = await this.sendCode();
      this.setObjectState({
        key: 'sendCodeParams',
        val: {
          userName: this.userinfo.emailBinded,
        },
      });
      this.dialogVisible = true;
    },
    handleCloseModal() {},
  },
  async mounted() {
    await this.getUserInfo();
    console.log('location:', this.$router, this.$route);
  },
};
</script>

<style scoped lang="scss">
.email-binded {
  font-weight: 600;
}
</style>
