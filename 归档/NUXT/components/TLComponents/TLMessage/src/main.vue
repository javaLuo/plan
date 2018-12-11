<template>
  <el-dialog :title="title"
             class="kyc-dialog"
             :show-close="false"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :visible.sync="visible"
             width="432px">
    <span>{{text}}</span>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel"
                 class="cancel">{{cancelText}}</el-button>
      <el-button @click="ok"
                 class="next"
                 type="primary">{{okText}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      closed: false,
      onClose: null, //关闭事件
      title: '', //标题
      cancelText: '', //关闭按钮文本
      okButton: null, //成功按钮文本
      onCancel: null, //取消事件
      onOk: null, //成功事件
      visible: false,
      text: '', //文本内容
    };
  },
  mounted() {
    console.log(this.visible);
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    },
  },
  methods: {
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    cancel() {
      if (typeof this.onCancel === 'function') {
        this.onCancel(this);
      }
      this.close();
    },
    ok() {
      if (typeof this.onOk === 'function') {
        this.onOk(this);
      }
      this.close();
    },
  },
};
</script>

<style>
</style>
