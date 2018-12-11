<template>
  <el-dialog :title="Login.scurityTtl"
             :visible.sync="isShowTwoFa"
             width="408px"
             :before-close="close">
    <div class="two-fa">
      <div class="panel-input">
        <input type="text"
               maxlength="6"
               ref="tofaInput"
               class="ant-input"
               v-model="googleInput"
               @focus="handleFocus"
               @blur="handleBulr">

        <div class="i"
             v-for="(item, index) in googleInputArr"
             :key="index"
             :class="{on: item !== -1 || (index === 0 && focus) }">{{item !== -1 ? item : ''}}</div>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary"
                 class="twofa-btn"
                 style="min-width: 120px;"
                 @click="handleClcik"
                 :loading="loading">{{url ? WithDraw.confirm : Login.okBtn}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Button from '../Button/index';
import { mapState, mapActions } from 'vuex';
import * as type from '~/store/modules/user/type';
export default {
  name: 'TwoFa',
  props: {
    //关闭窗体回调函数
    handleClose: {
      type: Function,
      default: () => {},
    },
    onLogin: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
    //成功回调函数
    handleSuccess: {
      type: Function,
      default: () => {},
    },
    //失败回调函数
    handleError: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      googleInput: '',
      focus: false, //是否得到焦点
    };
  },
  watch: {
    isShowTwoFa(newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          console.log(this.$refs['tofaInput']);
          this.$refs['tofaInput'].focus();
          this.handleFocus();
        }, 50);
      }
    },
    googleInput(newVal, oldVal) {
      if (newVal.length === 6) {
        this.handleClcik();
      }
    },
  },
  components: {
    Button,
  },
  computed: {
    ...mapState({
      Login: state => state.i18n.App.Login,
      googleSecretKey: state => state.user.googleSecretKey,
      isGoogleCodeCorrect: state => state.user.isGoogleCodeCorrect,
      isShowTwoFa: state => state.user.isShowTwoFa,
      ErrorCode: state => state.i18n.App.ErrorCode,
      WithDraw: state => state.i18n.App.WithDraw,
    }),
    googleInputArr() {
      let ret = [-1, -1, -1, -1, -1, -1];
      if (this.googleInput) {
        let arr = this.googleInput.split('');
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]) {
            ret[i] = arr[i];
          }
        }
      }
      return ret;
    },
  },
  methods: {
    ...mapActions({
      loginGoogleCheck: type.LOGIN_GOOGLE_LOGIN,
      checkGoogleCode: type.CHECK_GOOGLE_LOGIN,
    }),
    handleBulr() {
      this.focus = false;
    },
    handleFocus() {
      this.focus = true;
    },
    async handleClcik() {
      this.loading = true;
      let res;
      if (!this.googleInput) {
        this.loading = false;
        this.$message.error(this.Login.googleVcodeEmpty);
        return;
      }
      this.onLogin
        ? (res = await this.loginGoogleCheck({ code: this.googleInput }))
        : (res = await this.checkGoogleCode({
            secretKey: this.googleSecretKey,
            code: this.googleInput,
            url: this.url,
          }));

      if (this.isGoogleCodeCorrect) {
        this.loading = false;
        this.handleSuccess();
        this.close();
      } else {
        this.loading = false;
        this.$message.error(this.ErrorCode[res.code]);
        this.handleError();
        this.close();
      }
    },
    close() {
      this.$store.commit(type.SET_STATE, { key: 'isShowTwoFa', val: false });
      this.handleClose();
      this.googleInput = '';
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/_theme-conf';

/deep/ .twofa-btn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding: 0;
}

.two-fa {
  .panel-input {
    position: relative;
    display: flex;
    justify-content: space-between;
    .ant-input {
      z-index: 1;
      margin: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      font-size: 14px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.65);
      background-color: #fff;
      opacity: 0;
      border: 0;

      &:focus {
        outline: none;
      }
    }
    .i {
      position: relative;
      bottom: -2px;
      width: 45px;
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      @include fontPair(color);
      letter-spacing: 0.62px;
      text-align: center;
      border-bottom: 1px solid rgb(233, 231, 238);
      &.on {
        border-bottom: 1px solid;
        @include interactionPair(border-color);
      }
    }
  }
}
</style>
