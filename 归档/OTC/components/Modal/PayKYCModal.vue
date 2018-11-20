<template>
  <el-dialog :title="Settings.notice"
             :visible.sync="display"
             width="540px"
             :before-close="close"
             class="modal-form">
    <span class="modal-content">
      <!-- <i class="iconfont icon-yiwen"></i> -->
      {{Settings.payKycModal}}</span>
    <div slot="footer"
         class="dialog-footer">
      <el-button class="modal-cancel-btn"
                 @click="close">{{Settings.cancel}}</el-button>
      <el-button class="modal-confirm-btn"
                 @click="close">{{Settings.nextStep}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      form: {
        type: 'bank',
        name: '',
      },
    };
  },
  props: {
    display: {
      required: true,
      type: Boolean,
      default: true,
    },
    close: {
      required: true,
      type: Function,
    },
  },
  computed: {
    ...mapState({
      Settings: state => state.i18n.App.Settings,
    }),
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
.modal-content {
  font-size: 18px;
  color: #221b2f;
  margin: 20px 0 32px 20px;
  display: inline-block;
}
.modal-confirm-btn {
  margin-right: 26px;
}
.icon-yiwen {
  margin-right: 10px;
  color: #b1b0ce;
}
</style>
