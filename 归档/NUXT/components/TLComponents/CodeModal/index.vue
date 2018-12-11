<template>
  <div class="code">
    <span class="obtian">
      <el-button type="primary"
                 class="send-button"
                 :disabled="isShowCountDown"
                 @click="callback"
                 v-if="$slots.default">
        <div v-if="!isShowCountDown">
          <slot></slot>
        </div>
        <div v-if="isShowCountDown">
          <slot></slot> {{`(${countDownText})`}}
        </div>
      </el-button>
      <el-button type="primary"
                 class="send-button"
                 :disabled="isShowCountDown"
                 @click="callback"
                 v-if="!$slots.default">
        {{!isShowCountDown ? registerLanguage.getVcode : `${registerLanguage.getVcode}(${countDownText})`}}
      </el-button>
    </span>
    <!-- <span class="obtian send"  v-if="!isShowCountDown"> <slot></slot></span> -->
    <el-dialog :title="registerLanguage.enterVCode"
               :visible.sync="isShowCodeModal"
               width="408px"
               :before-close="handleClose">
      <div class="code">
        <el-row type="flex"
                justify="space-between">
          <el-col :xl="18"
                  :lg="18"
                  :md="18">
            <input type="text"
                   v-model="code"
                   maxlength="5">
          </el-col>
          <el-col :xl="6"
                  :lg="6"
                  :md="6">
            <img :src="imgParameter"
                 @click="getCodeImg">
          </el-col>
        </el-row>
        <el-row type="flex"
                justify="end"
                style="margin-top:50px">
          <el-col :xl="10"
                  :lg="10"
                  :md="10">
            <el-button @click="handleClick"
                       type="primary"
                       :loading="loading">{{registerLanguage.okBtn}}</el-button>
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
export default {
  name: 'CodeModal',
  props: {
    handleCallback: {
      type: Function,
    },
  },
  components: {
    Button,
  },
  data() {
    return {
      code: '',
      imgParameter: '',
      loading: false,
    };
  },
  watch: {
    isShowCodeModal(newVal, oldVal) {
      if (newVal) {
        //如果窗体显示就获取图形验证码
        this.getCodeImg();
      }
    },
  },
  computed: {
    ...mapState({
      registerLanguage: state => state.i18n.App.Register,
      sendCodeParams: state => state.user.sendCodeParams,
      errorLanguage: state => state.i18n.App.ErrorCode,
      isShowCountDown: state => {
        return state.user.isShowCountDown;
      },
      countDownText: state => state.user.countDown,
      isShowCodeModal: state => state.user.isShowCodeModal,
      isForGot: state => state.user.isForGot,
    }),
  },
  mounted() {
    //如果cookie里面获取的值为真那么刷新之后继续从cookie里面获取
    if ((Storage.get('isShowCountDown') === 'true' || Storage.get('isShowCountDown')) && Storage.get('countDown')) {
      this.$store.commit(type.SET_STATE, { key: 'countDown', val: Storage.get('countDown') }); //倒计时默认值60秒
      this.$store.commit(type.SET_STATE, { key: 'isShowCountDown', val: true }); //倒计时默认值60秒
      this.countDown(); //倒计时
    }
  },
  methods: {
    ...mapMutations(['setObjectState']),
    ...mapActions({
      sendCode: type.SEND_CODE,
      sendVerificationCode: type.SEND_VERIFI_CATION_CODE,
      countDown: type.COUNT_DOWN,
      sendVCodeForForgot: type.SNED_CODE_FORGOT,
    }),
    async handleClick() {
      this.loading = true;
      if (this.code.length !== 5 && !/^[1-9]\d*$/.test(this.code)) {
        this.$message.warning(this.registerLanguage.vCodeError);
        this.loading = false;
        return false;
      }
      this.setObjectState({ key: 'sendCodeParams', val: { captcha: this.code } });
      let res = !this.isForGot ? await this.sendVerificationCode(this.sendCodeParams) : await this.sendVCodeForForgot(this.sendCodeParams);
      if (!!res && res.code !== 200) {
        this.$message.error(this.errorLanguage[res.code]);
        this.loading = false;
        return;
      }
      this.$message.success(this.registerLanguage.sendSuc);
      this.$store.commit(type.SET_STATE, { key: 'isShowCountDown', val: true });
      Storage.set('isShowCountDown', true); //往cookie里面也放一份 防止用户刷新
      this.countDown(); //倒计时
      this.$store.commit(type.SET_STATE, { key: 'isShowCodeModal', val: false });
      this.reset();
    },
    async getCodeImg() {
      this.imgParameter = await this.sendCode();
    },
    reset() {
      this.code = '';
      this.loading = false;
    },
    handleClose() {
      this.$store.commit(type.SET_STATE, { key: 'isShowCountDown', val: false }); //倒计时完修改状态
      Storage.set('isShowCountDown', false); //改变cookie里面的 countDown 防止用户刷新
      this.$store.commit(type.SET_STATE, { key: 'countDown', val: 60 }); //倒计时默认值60秒
      this.$store.commit(type.SET_STATE, { key: 'isShowCodeModal', val: false }); //倒计时默认值60秒
      this.$store.commit(type.SET_STATE, { key: 'isForGot', val: false }); //默认为登录false
      this.reset();
    },
    callback() {
      if (typeof this.handleCallback === 'function') {
        this.handleCallback();
      } else {
        this.$store.commit(type.SET_STATE, { key: 'isShowCodeModal', val: true }); //倒计时默认值60秒
      }
      //this.handleCallback()
    },
  },
};
</script>

<style lang="scss">
.code {
  .obtian {
    // color:#493b6c;
    font-size: 14px;
    color: #60cd8a;
    cursor: pointer;
    &.send {
      color: #635683;
    }
  }
  input {
    border: 0px;
    border-bottom: 1px solid #ededef;
    padding: 10px;
    outline: none;
    width: 100%;
    padding: 0px;
  }
  img {
    border: 1px solid #e9e7ee;
    border-radius: 2px;
    width: 95px;
    height: 32px;
  }
}
</style>
