<template>
  <el-dialog :title="Settings.notice"
             :visible="show"
             width="540px"
             :before-close="onClose"
             class="modal-form">
    <span class="modal-body">{{Settings.needC2}}</span>
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
export default {
  data() {
    return {};
  },
  props: {
    show: {
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
      this.$router.push('/member');
    },
    onClose() {
      this.$emit('onClose');
    },
  },
};
</script>

<style lang='scss' scoped>
.modal-form {
  .modal-body {
    padding: 0 20px;
  }
  .cancel-btn {
    border: none;
    color: #888;
  }
}
.modal-title {
  font-size: 12px;
  color: #797780;
  margin: -12px 0 32px 20px;
}
.modal-confirm-btn-ok {
  width: 150px;
}
</style>
