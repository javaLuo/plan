<template>
  <div class="container">
    <div class="setting untied">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/FundPwd'}">{{Prompt.UntieGL}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{Prompt.UntieGL}}</div>
        <dl class="descriptor">
          <dt>{{Google.tipssafe.tipsglUntie}}</dt>
          <dd>
            {{Google.tipssafe.tipsglUntiedes}}
          </dd>
        </dl>
        <div class="content">
          <el-form :model="untiedForm"
                   ref="untiedForm"
                   label-position="right"
                   label-width="385px">
            <el-form-item :label="Google.GLD.email">
              <el-input :value="UserData.userInfo.emailBinded"
                        :placeholder="Google.GLD.enterloginpwd"
                        disabled></el-input>
            </el-form-item>
            <el-form-item :label="Google.GLD.loginpwd"
                          prop="loginPwd"
                          :rules="[{required: true, message: Google.GLD.loginpwdnoempty}]">
              <el-input type="password"
                        v-model="untiedForm.loginPwd"
                        :placeholder="Google.GLD.enterloginpwd"></el-input>
            </el-form-item>
            <el-form-item :label="Google.GLD.emailyzm"
                          prop="emailCode"
                          :rules="[{required: true, message: Google.GLD.emailyznoempty}]">
              <el-input v-model="untiedForm.emailCode"
                        :placeholder="Google.GLD.enteremailyzm"
                        class="send-input"></el-input>
              <send-code-btn class="sendCode"
                             :style="{width: '96px'}"></send-code-btn>
            </el-form-item>
            <el-form-item :label="Google.GLD.googleyzm"
                          prop="googleCode"
                          :rules="[{required: true, message: Google.GLD.glyznoempty}]">
              <el-input v-model="untiedForm.googleCode"
                        :placeholder="Google.GLD.enterglyzm"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="determine"
                         @click="handleSubmit"
                         :loading="loading">{{Google.GLD.confirm}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import * as userType from '~/store/modules/user/type';
import * as settingType from '~/store/modules/settings/type';

export default {
  data() {
    return {
      loading: false,
      untiedForm: {
        email: '',
        loginPwd: '',
        emailCode: '',
        googleCode: '',
      },
    };
  },
  watch: {
    locale() {
      this.$refs['untiedForm'].clearValidate();
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Prompt: state => state.i18n.App.Prompt,
      ErrorCode: state => state.i18n.App.ErrorCode,
      Google: state => state.i18n.App.Google,
      SettingData: state => state.settings,
      UserData: state => state.user,
    }),
  },
  async created() {
    await this.getUserInfo();
    await this.getGoogleBindUrl({ username: this.UserData.userInfo.emailBinded });
    await this.initForm(this.UserData.userInfo.emailBinded, this.SettingData.googleBindUrl.secretKey);
  },
  methods: {
    ...mapMutations(['setObjectState']),
    ...mapActions({
      getUserInfo: userType.GET_USER_INFO,
      getGoogleBindUrl: settingType.GET_GOOGLE_BIND_URL,
      unBindGoogle: settingType.UNBIND_GOOGLE,
      sendCode: userType.SEND_CODE,
    }),
    initForm(email, key) {
      this.untiedForm.email = email;
      this.untiedForm.googleSecretKey = key;
    },
    goToBackUrl(url) {
      if (this.$route.query && this.$route.query.returnUrl) {
        console.log(this.$route.query, this.$route.query.returnUrl, '09870');
        // 这是从OTC跳过来的
        location.href = `${Configs.DEFAULT.OTC}/${this.$route.query.returnUrl.replace(/^\//, '')}`;
      } else {
        this.$router.push(url);
      }
    },
    handleSubmit() {
      if (this.untiedForm.email === '') {
        this.$message.warning(this.Google.GLD.gobdemail);
        return;
      }
      this.$refs.untiedForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          const params = {
            username: this.untiedForm.email,
            secretKey: this.untiedForm.googleSecretKey,
            code: this.untiedForm.googleCode,
            password: this.untiedForm.loginPwd,
            emailCode: this.untiedForm.emailCode,
          };
          const res = await this.unBindGoogle(params);
          if (res.code === 200) {
            this.$message.success(this.Google.GLD.Untie_success);
            this.loading = false;
            this.goToBackUrl(`/u?section=${this.SettingData.section}`);
            // this.$router.push('/u?param=anquan');
          } else {
            this.loading = false;
            this.$message.error(this.ErrorCode[res.code]);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.untied {
  .send-code-btn {
    font-size: 12px;
    color: #fff;
    letter-spacing: 0.46px;
    margin-left: 16px;
    border: none;
    border-radius: 2px;
  }
}
</style>
