<template>
  <div class="send-code-btn">
    <el-button v-if="!sendCodeLoading"
               @click="onSend">{{registerLanguage .getVcode}}
    </el-button>
    <el-button v-else
               disabled>{{countSecond}}s</el-button>
    <el-dialog :title="registerLanguage.enterVCode"
               :visible.sync="dialogVisible"
               width="408px"
               :before-close="handleClose">
      <div class="code">
        <el-row type="flex"
                justify="space-between">
          <el-col :xl="18"
                  :lg="18"
                  :md="18">
            <input type="text"
                   v-model="imgVcode">
          </el-col>
          <el-col :xl="6"
                  :lg="6"
                  :md="6">
            <div class="veridatecode">
              <div v-if="codeloading"
                   class="el-loading-spinner">
                <svg viewBox="25 25 50 50"
                     class="circular">
                  <circle cx="50"
                          cy="50"
                          r="20"
                          fill="none"
                          class="path"></circle>
                </svg>
              </div>
              <img v-else
                   :src="imgParameter"
                   @click="getCodeImg">
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="end"
                style="margin-top:50px">
          <el-col :xl="10"
                  :lg="10"
                  :md="10">
            <el-button type="primary"
                       :loading="popLoading"
                       @click="handleClcik">{{registerLanguage.okBtn}}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Button from '../Button/index';
import { mapState, mapMutations, mapActions } from 'vuex';
import * as type from '~/store/modules/user/type';
import Storage from '~/utils/storage';
const CONF_CONT_SECOUNT = 60;

export default {
  name: 'SendCodeBtn',
  props: {
    imgUrl: [String],
    isForGot: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'email',
    },
    userName: [String, ''],
  },
  components: {
    Button,
  },
  data() {
    return {
      dialogVisible: false,
      imgVcode: '',
      countSecond: CONF_CONT_SECOUNT,
      popLoading: false,
      codeloading: false,
      sendCodeLoading: false,
      imgParameter: '',
      timer: null,
    };
  },
  watch: {
    imgUrl(newVal, oldVal) {
      this.imgParameter = newVal;
    },
  },
  computed: {
    ...mapState({
      registerLanguage: state => state.i18n.App.Register,
      userInfo: state => state.user.userInfo,
      errorLanguage: state => state.i18n.App.ErrorCode,
    }),
  },
  methods: {
    ...mapMutations(['setObjectState', 'setState']),
    ...mapActions({
      sendCode: type.SEND_CODE,
      sendVerificationCode: type.SEND_VERIFI_CATION_CODE,
      sendVCodeForForgot: type.SNED_CODE_FORGOT,
    }),
    //按钮点击发送
    async onSend() {
      this.dialogVisible = true;
      this.codeloading = true;
      this.imgParameter = await this.sendCode();
      this.codeloading = false;
    },
    //弹窗点击关闭
    handleClose() {
      this.imgVcode = '';
      this.dialogVisible = false;
    },
    //验证图片验证码 -> 发送邮箱/手机验证码
    async handleClcik() {
      //验证图片验证码
      if (!this.imgVcode) {
        this.$message.error(this.registerLanguage.enterVcode);
        return;
      }
      let userName = (this.type === 'email' ? this.userInfo.email : this.userInfo.phone) || this.userName;
      if (!userName) {
        return;
      }
      this.popLoading = true;
      let res = this.isForGot
        ? await this.sendVCodeForForgot({
            captcha: this.imgVcode,
            phoneArea: this.userInfo.phoneArea || '0086',
            userName,
          })
        : await this.sendVerificationCode({
            userName,
            captcha: this.imgVcode,
            phoneArea: this.userInfo.phoneArea || '0086',
          });
      this.popLoading = false;
      if (res.code === 200) {
        this.sendCodeLoading = true;
        this.$message.success(this.registerLanguage.sendSuc);
        this.dialogVisible = false;
        this.imgVcode = '';
        this.countDown();
        //60s内发送验证码
      } else {
        this.sendCodeLoading = false;
        this.$message.error(this.errorLanguage[res.code]);
      }
    },
    async getCodeImg() {
      this.imgParameter = await this.sendCode();
    },
    reset() {
      this.code = '';
    },
    clearCountDown() {
      this.countSecond = 0;
      Storage.remove('countSecound');
      clearInterval(this.timer);
      this.sendCodeLoading = false;
    },
    countDown(cb = () => {}) {
      this.countSecond = Number(Storage.get('countSecound')) || CONF_CONT_SECOUNT;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        --this.countSecond;
        if (this.countSecond === 0) {
          this.clearCountDown();
          cb();
        }
      }, 1000);
    },
  },
  mounted() {
    let cookieCount = Storage.get('countSecound');
    if (!!cookieCount) {
      this.sendCodeLoading = true;
      this.countDown();
    }
    //刷新时记录最后时间
    window.onbeforeunload = () => {
      if (this.sendCodeLoading) {
        Storage.set('countSecound', this.countSecond);
      }
    };
  },
  beforeDestroy() {
    this.clearCountDown();
  },
};
</script>

<style lang="scss">
@import '~assets/css/_theme-conf.scss';

.send-code-btn {
  width: 100%;
}
.code {
  input {
    border: 0px;
    border-bottom: 1px solid #ededef;
    padding: 10px;
    outline: none;
    width: 100%;
    font-size: 14px;
    background-color: transparent;
    @include borderPair(border-color);
    @include fontPair(color);
  }
  img {
    border: 1px solid #e9e7ee;
    border-radius: 2px;
    width: 95px;
    height: 32px;
  }
  .veridatecode {
    position: relative;
    width: 95px;
    height: 32px;
    background: #fff;
  }
}
.el-loading-spinner {
  margin-top: -16px !important;
  .circular {
    width: 32px;
    height: 32px;
  }
}
</style>
