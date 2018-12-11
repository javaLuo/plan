<template>
  <div class="container">
    <div class="setting google">
      <el-breadcrumb class="breadcrumb"
                     separator="/">
        <el-breadcrumb-item :to="{path: '/'}">{{Prompt.home}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u'}">{{Prompt.myCenter}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/u/FundPwd'}">{{Prompt.BindingGL}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main">
        <div class="nav-bar">{{Prompt.BindingGL}}</div>
        <dl class="descriptor">
          <dt>{{Google.tipssafe.tipsafe2FA}}</dt>
          <dd>
            {{Google.tipssafe.tipsafegl}}
          </dd>
        </dl>
        <div class="content">
          <div class="col-left">
            <qrcode-vue :value="SettingData.googleBindUrl.url"
                        :size="180"
                        level="H"
                        class="QRcode" />
            <dl class="bitKey">
              <dt>{{Google.tipssafe.tipmy16}}</dt>
              <dd>{{SettingData.googleBindUrl.secretKey}}</dd>
            </dl>
            <p class="notice">
              {{Google.tipssafe.tipsgl2FA}}{{Google.tipssafe.tipsmy16save}}{{Google.tipssafe.tipsfinduser}}
            </p>
          </div>
          <div class="col-right">
            <el-form :model="googleForm"
                     ref="googleForm"
                     label-position="right"
                     label-width="176px">
              <el-form-item :label="Google.tipssafe.tipsfw">
                <div>
                  <dl class="protect">
                    <dt>{{Google.tipssafe.tipsltwpwd}}</dt>
                    <dd>{{Google.tipssafe.tipssendpostgl}}</dd>
                  </dl>
                </div>
              </el-form-item>
              <el-form-item :label="Google.GLD.email">
                <el-input v-if="!!UserData.userInfo.emailBinded"
                          :value="UserData.userInfo.emailBinded"
                          disabled></el-input>
                <nuxt-link to="/u/bindMailbox"
                           v-else>{{Google.GLD.gobdemail}}</nuxt-link>
              </el-form-item>
              <el-form-item :label="Google.GLD.loginpwd"
                            prop="loginPwd"
                            :rules="[{required: true, message: Google.GLD.loginpwdnoempty}]">
                <el-input type="password"
                          v-model="googleForm.loginPwd"
                          :placeholder="Google.GLD.enterloginpwd"></el-input>
              </el-form-item>
              <el-form-item :label="Google.GLD.emailyzm"
                            prop="emailCode"
                            :rules="[{required: true, message: Google.GLD.emailyznoempty}]">
                <el-col :span="17">
                  <el-input v-model="googleForm.emailCode"
                            :placeholder="Google.GLD.enteremailyzm"
                            class="send-input"></el-input>
                </el-col>
                <el-col :span="6"
                        :push="1">
                  <SendCodeBtn class="sendCode"></SendCodeBtn>
                </el-col>
              </el-form-item>
              <el-form-item :label="Google.GLD.googleyzm"
                            prop="googleCode"
                            :rules="[{required: true, message: Google.GLD.glyznoempty}]">
                <el-input v-model="googleForm.googleCode"
                          :placeholder="Google.GLD.enterglyzm"></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="googleForm.agreementAgree"
                             :label="Google.GLD.yzbakmiyao"
                             name="agreement"></el-checkbox><br>
                <el-button class="determine"
                           @click="handleSubmit"
                           :loading="loading">{{Google.GLD.confirm}}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import * as userType from '~/store/modules/user/type';
import * as settingType from '~/store/modules/settings/type';
import QrcodeVue from 'qrcode.vue';
import Configs from '~/common/config';

export default {
  data() {
    return {
      loading: false,
      googleForm: {
        email: '',
        loginPwd: '',
        emailCode: '',
        googleCode: '',
        googleSecretKey: '',
        agreementAgree: false,
      },
    };
  },
  components: {
    QrcodeVue,
  },
  watch: {
    locale() {
      this.$refs['googleForm'].clearValidate();
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
    console.log(this, 'we');
    await this.getUserInfo();
    await this.getGoogleBindUrl({ username: this.UserData.userInfo.emailBinded });
    await this.initForm(this.UserData.userInfo.emailBinded, this.SettingData.googleBindUrl.secretKey);
  },
  methods: {
    ...mapMutations(['setObjectState']),
    ...mapActions({
      getUserInfo: userType.GET_USER_INFO,
      getGoogleBindUrl: settingType.GET_GOOGLE_BIND_URL,
      bindGoogle: settingType.BIND_GOOGLE,
      sendCode: userType.SEND_CODE,
    }),
    initForm(email, key) {
      this.googleForm.email = email;
      this.googleForm.googleSecretKey = key;
    },
    goToBackUrl(url) {
      if (this.$route.query && this.$route.query.returnUrl) {
        // 这是从OTC跳过来的
        location.href = `${Configs.DEFAULT.OTC}/${this.$route.query.returnUrl.replace(/^\//, '')}`;
      } else {
        this.$router.push(url);
      }
    },
    handleSubmit() {
      if (this.googleForm.email === '') {
        this.$message.warning(this.Google.GLD.gobdemail);
        return;
      }
      if (!this.googleForm.agreementAgree) {
        this.$message.error(this.Google.GLD.Check_secretkey);
        return;
      }
      this.$refs.googleForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          const params = {
            username: this.googleForm.email,
            secretKey: this.googleForm.googleSecretKey,
            code: this.googleForm.googleCode,
            password: this.googleForm.loginPwd,
            emailCode: this.googleForm.emailCode,
          };
          const res = await this.bindGoogle(params);
          if (res.code === 200) {
            this.$message.success(this.Google.GLD.Binding_success);
            this.loading = false;
            this.goToBackUrl(`/u?section=${this.SettingData.section}`);
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
@import '~assets/css/_theme-conf';
.google {
  .content {
    display: flex;
    justify-content: space-between;
    padding: 62px 0 92px;
    width: 85.25%;
    margin: 0 auto;
    .col-left {
      width: 328px;
      // text-align: center;
    }
    .col-right {
      flex: 1;
      // margin-left: 75px;
      margin-left: 10%;
    }
    .QRcode {
      width: 180px;
      height: 180px;
      border-radius: 2px;
      margin: 0 auto;
    }
    .bitKey {
      border: 1px dashed;
      @include borderPair(background-color);
      @include interactionPair(border-color);
      border-radius: 24px;
      padding: 8px 10px;
      max-width: 330px;
      margin: 24px auto 44px;
      text-align: center;
      white-space: nowrap;
      dt {
        display: inline-block;
        @include subFontPair(color);
      }
      dd {
        display: inline-block;
        // color: $light003;
        font-weight: 500;
        @include fontPair(color);
      }
    }
    .notice {
      font-size: 12px;
      color: $light004;
      line-height: 18px;
      span {
        color: $lightButtonColor;
      }
    }
    .protect {
      padding-top: 10px;
      dt {
        letter-spacing: 0.54px;
        line-height: 21px;
      }
      dd {
        margin-top: 3px;
        font-size: 12px;
        letter-spacing: 0.46px;
        line-height: 18px;
        @include subFontPair(color);
      }
    }
    .determine {
      margin-top: 0;
    }
  }
}
</style>
