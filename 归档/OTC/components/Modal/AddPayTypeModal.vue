<template>
  <el-dialog :title="Settings.payModal.title"
             :visible.sync="display"
             width="540px"
             :before-close="onClose"
             class="tl-dialog addpaymethod-dialog">
    <el-form :model="form"
             label-position="top"
             class="add-form"
             ref="form">
      <el-form-item :label="Settings.payModal.selType[0]"
                    :label-width="formLabelWidth"
                    prop="payType"
                    :rules="[{required:true,message:Settings.messageRules[0], trigger: 'change'}]">
        <el-select v-model="form.payType"
                   :placeholder="Settings.payModal.selType[1]"
                   @change="initForm">
          <el-option v-for="item in payTypeList"
                     :key="item.id"
                     :label="Common.payments[`item${item.payCode}`]"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="Settings.payModal.name"
                    :label-width="formLabelWidth">
        <el-input v-model="form.accountName"
                  auto-complete="off"
                  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.openBank"
                    :label-width="formLabelWidth"
                    v-if="form.payType === bank"
                    prop="openBank"
                    :rules="[{required:true,message:Settings.messageRules[2], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.openBank"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.openSubbranch"
                    :label-width="formLabelWidth"
                    v-if="form.payType === bank"
                    prop="openSubbranch"
                    :rules="[{required:true,message:Settings.messageRules[3], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.openSubbranch"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.account"
                    :label-width="formLabelWidth"
                    v-if="form.payType === bank"
                    prop="account"
                    :rules="[{required:true,message:Settings.messageRules[1], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.account"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.paypal"
                    :label-width="formLabelWidth"
                    v-else-if="form.payType === paypal"
                    prop="account"
                    :rules="[{required:true,message:Settings.messageRules[1], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.account"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.alipay"
                    :label-width="formLabelWidth"
                    v-else-if="form.payType === alipay"
                    prop="account"
                    :rules="[{required:true,message:Settings.messageRules[1], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.account"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.wechat"
                    :label-width="formLabelWidth"
                    v-else-if="form.payType === wechat"
                    prop="account"
                    :rules="[{required:true,message:Settings.messageRules[1], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.account"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.epay"
                    :label-width="formLabelWidth"
                    v-else-if="form.payType === epay"
                    prop="account"
                    :rules="[{required:true,message:Settings.messageRules[1], trigger: 'change'},{ validator:this.validateLength , trigger:'change'}]">
        <el-input v-model="form.account"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item :label="Settings.payModal.upCodeImg"
                    :label-width="formLabelWidth"
                    v-if="form.payType === wechat || form.payType === alipay"
                    v-loading="upLoading">
        <el-upload class="upload-demo"
                   drag
                   accept="image/png,image/jpeg"
                   :action="uploadUrl"
                   :show-file-list="false"
                   :on-success="handleSuccess"
                   :on-change="beforeUpload"
                   :before-upload="beforeUpload"
                   :on-error="handleError"
                   :with-credentials="true"
                   :on-remove="handleRemove"
                   :file-list="fileList"
                   list-type="picture">
          <img v-if="!!form.url"
               :src="form.url"
               class="upload-avatar">
          <i v-else
             class="el-icon-upload"></i>
          <div v-if="!form.url"
               class="el-upload__text">{{Settings.payModal.uploadTxt}}</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="Settings.funds.name"
                    :label-width="formLabelWidth"
                    prop="fundPasd"
                    :rules="[{required:true,message:Settings.messageRules[4], trigger: 'change'}]">
        <el-input v-model="form.fundPasd"
                  type="password"
                  auto-complete="off"
                  maxlength="20"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button class="modal-cancel-btn"
                 @click="onClose">{{Settings.cancel}}</el-button>
      <el-button class="modal-confirm-btn1"
                 type="primary"
                 :loading="loading"
                 @click="doAddPayTypeHandle">{{Settings.finished}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex';
import Configs from '~/common/config';
import * as Validate from '~/utils/validate';
import * as Dict from '~/store/dict';
import * as memberType from '~/store/modules/member/type';
export default {
  data() {
    return {
      isFirst: true,
      paypal: Dict.PAYPAL_ID,
      alipay: Dict.ALIPAY_ID,
      wechat: Dict.WECHAT_ID,
      bank: Dict.BANK_ID,
      epay: Dict.EPAY_ID,
      uploadUrl: Configs.DEFAULT.UPLOAD_API,
      upLoading: false, // 是否正在上传中
      loading: false, // 是否正在提交中
      form: {
        payType: 4,
        account: '',
        accountName: this.realName,
        openBank: '',
        openSubbranch: '',
        url: '',
        fundPasd: '',
      },
      fileList: [],
      formLabelWidth: '140px',
      // ,rules:{
      //   payType: [{required:true,message:'请选择币种类型', trigger: 'change'}],
      //   account: [{required:true,message:'请输入账号', trigger: 'change'},{ validator:this.validateLength , trigger:'change'}],
      //   openBank: [{required:true,message:'请输入开户银行', trigger: 'change'},{ validator:this.validateLength , trigger:'change'}],
      //   openSubbranch: [{required:true,message:'请输入开户支行', trigger: 'change'},{ validator:this.validateLength , trigger:'change'}],
      //   fundPasd:[{required:true,message:'请输入资金密码', trigger: 'change'},{ validator:this.validatePwd , trigger:'change'}]
      // }
    };
  },
  updated() {
    if (this.display) {
      this.onShow();
    }
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
    ok: {
      required: true,
      type: Function,
    },
    // payTypeList: {
    //   required: true,
    //   type: Array,
    // },
    realName: {
      required: true,
      type: String,
    },
  },
  components: {},
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
      Settings: state => state.i18n.App.Settings,
      payTypeList: state => state.member.payTypeList,
      ErrCode: state => state.i18n.App.ErrCode,
    }),
  },
  async mounted() {
    // 支付列表：微信/支付宝/银行卡/Paypal/ePay
    await this.getPayTypeList();
  },
  methods: {
    ...mapActions({
      getPayTypeList: memberType.GET_PAY_TYPE_ACTIONS,
      verifySecert: memberType.VERIFY_SECERT_ACTIONS,
      addPayMethod: memberType.ADD_PAY_METHOD_ACTIONS,
    }),
    validateLength(rule, value, callback) {
      const v = String.trim(value);
      if (value === '') {
        return;
      }
      if (v === '') {
        callback(this.Settings.messageRules[1]);
        return;
      }
      const len = Validate.enZhStrLength(v);
      if (len > 0 && len < 21) {
        callback();
      }
      callback(this.Settings.overLength);
    },
    validatePwd(rule, value, callback) {
      if (value.toString().length !== 6) {
        callback(this.Settings.mustLength);
      } else if (isNaN(value)) {
        callback(this.Settings.mustNumber);
      } else {
        callback();
      }
    },
    handleRemove(file) {
      console.log(file);
    },
    async doAddPayTypeHandle() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if ((this.form.payType === this.wechat || this.form.payType === this.alipay) && this.form.url === '') {
            this.$message.error(this.Settings.payModal.upCodeImg);
            return;
          }
          this.loading = true;

          let params = {
            account: String.trim(this.form.account),
            accountName: this.form.accountName,
            fundPasd: String.trim(this.form.fundPasd),
            openBank: String.trim(this.form.openBank),
            openSubbranch: String.trim(this.form.openSubbranch),
            url: String.trim(this.form.url),
            payType: this.form.payType,
          };

          if (params.openBank === '' || params.openSubbranch === '') {
            delete params.openBank;
            delete params.openSubbranch;
          }
          if (params.url === '') {
            delete params.url;
          }
          let res = await this.verifySecert({ secret: params.fundPasd }); // 先验证资金密码
          if (res && res.code === 200) {
            const result = await this.addPayMethod(params);
            if (result && result.code === 200) {
              this.$message.success(`${this.Settings.addPayTypeSuccess}`);
              this.ok();
            } else {
              this.$message.error(this.ErrCode[result.code] || `${res.code}`);
              this.close();
            }
          } else {
            this.$message.error(this.ErrCode[res.code] || `${res.code}`);
          }
          this.loading = false;
          await this.initForm();
          await this.close();
        } else {
          return false;
        }
      });
    },
    initForm(e = 4) {
      this.form = {
        payType: e,
        account: '',
        accountName: this.realName,
        openBank: '',
        openSubbranch: '',
        url: '',
        fundPasd: '',
      };
      this.fileList = [];
      this.$refs.form.clearValidate();
    },
    onShow() {
      if (this.isFirst) {
        this.initForm();
        this.isFirst = false;
      }
      this.$refs.form.clearValidate();
    },
    async onClose() {
      await this.initForm();
      await this.close();
    },
    beforeUpload(file) {
      let isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error(this.Settings.payModal.imgSize);
        return false;
      }
      let reg = /\.(png|jpg|jpeg)$/;
      if (!reg.test(file.name)) {
        this.$message.error(this.Settings.payModal.uploadTxt);
        return false;
      }

      this.upLoading = true;
    },
    handleSuccess(response, files, fileList) {
      if (response.code === 200) {
        this.fileList = [{ name: response.data.fileName, url: response.data.filePath }];
        this.form.url = response.data.filePath;
      }
      this.$nextTick(() => {
        this.upLoading = false;
      });
    },
    handleError(error) {
      this.$nextTick(() => {
        this.upLoading = false;
      });
      this.$message.error(this.Settings.payModal.failUpload);
    },
  },
};
</script>

<style lang='scss' scoped>
.add-form {
  padding-top: 18px;
  padding-bottom: 20px;
}
.modal-title {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #797780;
  margin: -12px 0 0 20px;
}
.modal-confirm-btn1 {
  min-width: 96px;
}

.upload-demo {
  height: 180px;
}

.el-select-dropdown {
  min-width: 290px !important;
}

.upload-avatar {
  display: block;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
</style>
