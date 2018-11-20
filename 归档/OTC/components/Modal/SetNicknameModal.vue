<template>
  <el-dialog :title="Settings.setNick"
             :visible.sync="display"
             width="540px"
             :show-close="false"
             :before-close="close"
             class="modal-form">
    <p class="modal-title">{{Settings.nickCon}}</p>
    <el-form :model="form"
             label-position="top"
             @submit.native.prevent
             ref="nickform">
      <el-form-item :label="Settings.nick"
                    prop="name"
                    :rules="[{ required:true, message:Settings.inputNick, trigger: 'change'},{ validator: this.validateNickname, trigger:'change'}]">
        <el-input v-model="form.name"
                  auto-complete="off"
                  maxlength="20"
                  @keydown.native.enter="doAddPayTypeHandle"></el-input>
      </el-form-item>
      <el-form-item label=""
                    prop="readed">
        <el-checkbox v-model="form.readed"
                     :label="Settings.cantModifyNickName"
                     :rules="[{ required: true, trigger: 'change'}]"
                     name="readed"></el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button class="modal-cancel-btn"
                 @click="onClose">{{Settings.cancel}}</el-button>
      <el-button type="primary"
                 class="modal-confirm-btn-ok"
                 :disabled="!(!!form.name && !!form.readed)"
                 :loading="loading"
                 @click="doAddPayTypeHandle">{{Settings.nextStep}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import * as Validate from '~/utils/validate';
export default {
  data() {
    return {
      form: {
        name: '',
        readed: false,
      },
      formLabelWidth: '140px',
      // ,rules:{
      //   name: [{ required:true,message:'请输入昵称', trigger: 'change'},{ validator: this.validateNickname, trigger:'change'}]
      // }
    };
  },
  props: {
    display: {
      required: true,
      type: Boolean,
      default: false,
    },
    close: {
      required: true,
      type: Function,
    },
    ok: {
      required: true,
      type: Function,
    },
    loading: {
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
    doAddPayTypeHandle() {
      this.$refs['nickform'].validate(async valid => {
        if (valid && this.form.readed) {
          this.ok(String.trim(this.form.name));
        } else {
          return false;
        }
      });
    },
    validateNickname(rule, value, callback) {
      const v = String.trim(value);
      if (value === '') {
        return;
      }
      if (v === '') {
        callback(this.Settings.inputNick);
        return;
      }
      // 只允许常规字符
      // if (!Validate.testNormal.test(v)) {
      //   callback(this.Settings.nickNameRule);
      // }
      const len = Validate.enZhStrLength(v);
      if (len > 0 && len < 21) {
        callback();
      }
      callback(this.Settings.overLength);
    },
    onClose() {
      history.back(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.modal-title {
  font-size: 14px;
  color: #354989;
  letter-spacing: 0;
  line-height: 24px;
  margin-bottom: 28px;
}
.modal-confirm-btn-ok {
  width: 150px;
}
</style>
