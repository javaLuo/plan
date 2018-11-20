<!-- 您没有设置资金密码，是否前往设置 -->
<template>
  <el-dialog :title="Settings.notice"
             :visible="show"
             width="540px"
             :before-close="onClose"
             class="my-modal">
    <span class="modal-body">{{Settings.messageErr[0]}}</span>
    <div slot="footer"
         class="dialog-footer">
      <el-button class="cancel-btn"
                 @click="onClose">{{Settings.cancel}}</el-button>
      <el-button type="primary"
                 class="modal-confirm-btn-ok"
                 @click="onSubmit">{{Settings.nextStep}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import * as Validate from '~/utils/validate';
import Configs from '~/common/config';
export default {
  data() {
    return {
      tulipexUrl: Configs.DEFAULT.TULIPEX_URL, //tulipex网址
    };
  },
  props: {
    show: {
      // 是否显示
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      Settings: state => state.i18n.App.Settings,
    }),
  },
  methods: {
    onSubmit() {
      location.href = `${this.tulipexUrl}/u/fundPwd?returnUrl=/ad/publishAd`;
    },
    onClose() {
      this.$emit('onClose');
    },
  },
};
</script>

<style lang='scss' scoped>
.my-modal {
  .modal-body {
    padding: 0 20px;
  }
  .cancel-btn {
    border: none;
    color: #888;
  }
  .modal-title {
    font-size: 12px;
    color: #797780;
    margin: -12px 0 32px 20px;
  }
  .modal-confirm-btn-ok {
    width: 150px;
  }
}
</style>
