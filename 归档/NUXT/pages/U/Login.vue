<template>
  <div class="container login">
    <div class="rcontent">
      <div class="login-title">
        <div class="title">{{Login.welcomeLogin}}</div>
        <nuxt-link to="/u/register">{{Login.register}}</nuxt-link>
      </div>
      <el-form ref="form"
               class="login-form"
               :model="params"
               label-position="top">
        <el-form-item prop="userName"
                      class="hasMarginBottom"
                      :label="Login.account"
                      :rules="[{required: true, message: Login.accountError},{ validator: validateUserName, trigger:'change'}]">
          <div class="input">
            <el-input maxlength="50"
                      v-model="params.userName"
                      name="userName"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password"
                      :label="Login.pwd"
                      :rules="[{required: true, message: Login.userPwdLength}]">
          <div class="input">
            <el-input type="password"
                      v-model="params.password"
                      name="password"
                      @keyup.enter.native="handleSubmit"></el-input>
          </div>
        </el-form-item>
        <el-form-item style="margin-top:48px;margin-bottom:0"
                      class="form-item">
          <div class="input">
            <el-button @click="handleSubmit"
                       :loading="loading"
                       type="primary"
                       v-loading.fullscreen.lock="fullscreenLoading">{{Login.button}}</el-button>
          </div>
        </el-form-item>
        <el-form-item class="beneath-submit">
          <nuxt-link to="/u/forgotPassword"
                     class="forgot">{{Login.forgot}}</nuxt-link>
          <!-- <nuxt-link to="/u/register">{{Login.register}}</nuxt-link> -->
        </el-form-item>
      </el-form>
      <auth-modal :dialog-visible="dialogVisible"
                  :handle-close="closeAuthDialog"
                  :handle-callback="handleCallback" />
      <TwoFa :handle-success="googleSuccess"
             :handle-error="googleError"
             :handle-close="googleClose"
             :on-login="true"></TwoFa>
    </div>
    <el-dialog :title="Address.tips"
               class="kyc-dialog"
               :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="kycVisible"
               width="432px">
      <span>{{Google.tipssafe.tipsafe2FA}}</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="googleCheckLoginUrl">{{Address.cancelText}}</el-button>
        <!-- <nuxt-link to="/trade">{{Address.cancelText}}</nuxt-link> -->
        <nuxt-link to="/u/google"
                   class="next">
          {{ForgotPassword.button}}
        </nuxt-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Utils from "~/utils/";
import { NCLOGIN, NCLOGINH5 } from "~/utils/constant";
import * as type from "~/store/modules/user/type";
import Storage from "~/utils/storage";
import Configs from "~/common/config";

export default {
  data() {
    return {
      params: {
        userName: "",
        password: ""
      },
      dialogVisible: false,
      kycVisible: false,
      ehtimer: null,
      nc: null,
      token: {
        csessionid: "",
        scene: "",
        sig: "",
        token: ""
      },
      fullscreenLoading: false,
      loading: false
    };
  },
  computed: {
    ...mapState({
      Login: state => state.i18n.App.Login,
      isAccountExist: state => state.user.isAccountExist,
      loginData: state => state.user.loginData,
      ErrorCode: state => state.i18n.App.ErrorCode,
      LoginParams: state => state.user.LoginParams,
      isLogin: state => state.isLogin,
      Address: state => state.i18n.App.Address,
      WithDraw: state => state.i18n.App.WithDraw,
      ForgotPassword: state => state.i18n.App.ForgotPassword,
      Google: state => state.i18n.App.Google
    }),
    isEmail() {
      return Utils.isEmail(this.params.userName);
    },
    getScene() {
      return Utils.isMobile() === true ? NCLOGINH5 : NCLOGIN;
    }
  },
  mounted() {
    /**
     * 这里现在这样判断会有误，因为从OTC页面退出后，RightBTC页面的isLogin还是true
     * BUG 2154
     * **/
    let isLogin = Storage.get("isLogin");
    if (isLogin === "true" || isLogin) {
      this.$router.push("/");
    }
  },
  methods: {
    ...mapMutations(["setLoginStatus", "setObjectState"]),
    ...mapActions({
      checkUserAccount: type.CHECK_USER_ACCOUNT,
      login: type.USER_LOGIN,
      getUserInfo: type.GET_USER_INFO
    }),
    async validateUserName(rule, value, cb) {
      if (value === "") {
        return;
      }
      if (!this.isEmail) {
        cb(this.Login.accountError);
        return false;
      }
      cb();
    },
    closeAuthDialog() {
      this.dialogVisible = false;
    },
    handleSubmit() {
      this.loading = true;
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.checkUserAccount({
            userName: this.params.userName
          });
          if (res && res.code === 200) {
            if (!this.isAccountExist) {
              this.$message.error(this.Login.hasnotAccount);
              this.loading = false;
              return false;
            }
            this.setObjectState({ key: "LoginParams", val: this.params });
            this.dialogVisible = true;
            this.loading = false;
          } else {
            this.$message.error(`${this.ErrorCode[res.code]}`);
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    },
    async onLogin() {
      let res = await this.login({ ...this.LoginParams, token: this.token });
      //登录成功
      if (res.code === 200) {
        let username = !!this.loginData.email
          ? this.loginData.email
          : this.loginData.phone;

        //如果第一次登录，跳转到个人中心账号安全页面
        if (this.loginData.firstLogin) {
          this.saveSkinns(res.data.userid, res.data.logintime);
          this.$message.success(this.Login.loginSuccess);
          Storage.set("isLogin", true);
          Storage.set("username", Utils.decodeUserName(username));
          this.setLoginStatus({ key: "isLogin", val: true });
          this.setLoginStatus({
            key: "userName",
            val: Utils.decodeUserName(username)
          });
          if (!this.loginData.googleCheckLogin) {
            this.kycVisible = true;
          }
          //this.$router.push(`/u`);
          return;
        }
        // 谷歌验证
        if (this.loginData.googleCheckLogin) {
          this.$store.commit(type.SET_STATE, { key: "isShowTwoFa", val: true });
          return false;
        }

        this.saveSkinns(res.data.userid, res.data.logintime);
        Storage.set("isLogin", true);
        Storage.set("username", Utils.decodeUserName(username));
        this.setLoginStatus({ key: "isLogin", val: true });
        this.setLoginStatus({
          key: "userName",
          val: Utils.decodeUserName(username)
        });

        // 从打新过来的，带参数返回打新页面
        if (this.$route.query.tokensell) {
          this.$router.push(`/tokensale/${this.$route.query.tokensell}`);
          return;
        }

        // 从烘焙过来的，带参数返回烘焙页面
        if (this.$route.query.bake) {
          this.$router.push(`/baking/${this.$route.query.bake}`);
          return;
        }

        if (!this.loginData.googleCheckLogin) {
          this.kycVisible = true;
        }

        // 从OTC过来登陆的，跳回OTC
        if (this.$route.query.returnUrl) {
          location.href = `${
            Configs.DEFAULT.OTC
          }/${this.$route.query.returnUrl.replace(/^\//, "")}`;
          return;
        }

        //this.$router.push(`/trade`);
        this.closeAuthDialog();
      } else {
        this.loading = false;
        this.fullscreenLoading = false;
        this.dialogVisible = false;
        this.$message.error(this.ErrorCode[res.code]);
        this.closeAuthDialog();
      }
    },
    //登录成功埋点数据
    saveSkinns(id, loginTime) {
      Storage.setItem("loginTime", Utils.ForMatDate(loginTime)); //登录成功之后记录登录埋点时间
      this.$saveSkinesis({
        user_id: id,
        matcher: "rightbtc_user_login",
        login_time: Utils.ForMatDate(loginTime)
      }); //添加埋点数据
    },
    // 通过了谷歌验证
    googleSuccess() {
      this.$message.success(this.Login.loginSuccess);
      let username = !!this.loginData.email
        ? this.loginData.email
        : this.loginData.phone;
      this.saveSkinns(this.loginData.userid, this.loginData.logintime);
      Storage.set("isLogin", true);
      Storage.set("username", Utils.decodeUserName(username));
      this.setLoginStatus({ key: "isLogin", val: true });
      this.setLoginStatus({
        key: "userName",
        val: Utils.decodeUserName(username)
      });

      // 从打新过来的，带参数返回打新页面
      if (this.$route.query.tokensell) {
        this.$router.push(`/tokensale/${this.$route.query.tokensell}`);
        return;
      }

      // 从烘焙过来的，带参数返回烘焙页面
      if (this.$route.query.bake) {
        this.$router.push(`/baking/${this.$route.query.bake}`);
        return;
      }

      // 从OTC过来登陆的，跳回OTC
      if (this.$route.query.returnUrl) {
        location.href = `${
          Configs.DEFAULT.OTC
        }/${this.$route.query.returnUrl.replace(/^\//, "")}`;
        return;
      }
      this.$router.push(`/trade`);
    },
    googleError() {
      this.fullscreenLoading = false;
      this.dialogVisible = true;
    },
    googleClose() {
      this.fullscreenLoading = false;
      this.dialogVisible = false;
    },
    handleCallback(data) {
      this.fullscreenLoading = true;
      this.token = Object.assign({ ...this.token, scene: this.getScene }, data);
      this.onLogin();
    },
    googleCheckLoginUrl() {
      if (this.loginData.firstLogin) {
        this.$router.push(`/u`);
      } else {
        // 从打新过来的，带参数返回打新页面
        if (this.$route.query.tokensell) {
          this.$router.push(`/tokensale/${this.$route.query.tokensell}`);
          return;
        }

        // 从烘焙过来的，带参数返回烘焙页面
        if (this.$route.query.bake) {
          this.$router.push(`/baking/${this.$route.query.bake}`);
          return;
        }

        this.$router.push(`/trade`);
      }
    }
  }
};
</script>
