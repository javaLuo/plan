<template>
  <div class="appeal">
    <el-dialog :title="bussinesType === 'seller'? OrderDetail.buyerAppeal : OrderDetail.sellAppeal"
               :visible.sync="dialogVisible"
               width="540px"
               class="tl-dialog appeal-dialog"
               :before-close="handleClose">
      <div class="appeal-modal-container">
        <div class="form">
          <el-form ref="form"
                   label-position="top"
                   :model="params">
            <el-form-item :label="OrderDetail.appealLabel[0]"
                          prop="appealType"
                          :rules="[{required:true,message:OrderDetail.placeholder[0]}]">
              <el-select :placeholder="OrderDetail.placeholder[0]"
                         v-model="params.appealType">
                <el-option :key="item.id"
                           :value="item.id"
                           :label="locale === 'zh_cn'?item.content:item.contentEN"
                           v-for="item in AppealTypeList.filter(x=>(bussinesType === 'seller' && x.type === 2)||(bussinesType !== 'seller' && x.type === 1))"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="OrderDetail.appealLabel[1]"
                          prop="appealRequest"
                          :rules="[{required:true,message:OrderDetail.placeholder[1]}]">
              <el-select :placeholder="OrderDetail.placeholder[1]"
                         v-model="params.appealRequest">
                <el-option key="1"
                           :label="OrderDetail.aimSel[0]"
                           value="1" />
                <el-option key="2"
                           :label="OrderDetail.aimSel[1]"
                           value="2" />
              </el-select>
            </el-form-item>
            <el-form-item :label="OrderDetail.appealLabel[2]"
                          :style="'margin-bottom: 26px'"
                          prop="appealContent"
                          :rules="[{required:true,message:OrderDetail.placeholder[2]}]">
              <el-input type="textarea"
                        v-model="params.appealContent"
                        maxlength="200"
                        size="medium"
                        :placeholder="OrderDetail.placeholder[2]"></el-input>
            </el-form-item>
            <el-form-item class="appealUpLoad"
                          :label="OrderDetail.appealLabel[3]"
                          prop="filename"
                          :rules="[{required:true,message:OrderDetail.placeholder[3]}]">
              <el-upload class="upload-demo"
                         accept="image/png,image/gif,image/jpeg,image/bmp"
                         :action="uploadUrl"
                         :on-success="handleSuccess"
                         :before-upload="beforeUpload"
                         :file-list="fileList"
                         :on-exceed="handleExceed"
                         :on-error="handleError"
                         :before-remove="handleRemove"
                         :with-credentials="true"
                         :limit="5">
                <el-button class="modal-upload-btn"
                           type="primary">
                  <i class="iconfont icon-shangchuanfujian"
                     :style="'font-size: 12px;'"></i> {{OrderDetail.upLoad[0]}}
                </el-button>
                <div slot="tip"
                     class="el-upload__tip">{{OrderDetail.upLoad[1]}}</div>
              </el-upload>
            </el-form-item>
            <div class="appeal-modal-footer">
              <ul>
                <li>{{OrderDetail.notice[0]}}</li>
                <li>{{OrderDetail.notice[1]}}</li>
              </ul>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="modal-cancel-btn"
                   @click="handleClose">{{OrderDetail.cancel}}</el-button>
        <el-button class="modal-confirm-btn"
                   @click="hadnleSubmit">{{OrderDetail.appealSubmit}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Configs from '~/common/config';
import { mapState, mapActions } from 'vuex';
import { ORDER_APPEAL_TYPELIST_ACTIONS } from '~/store/modules/order/type';
import { AD_CREATEDAPPEAL } from '~/store/modules/ad/type';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    bussinesType: {
      type: String,
      default: 'seller',
    },
    handleClose: {
      type: Function,
      default: () => {},
    },
    handleOk: {
      type: Function,
      default: () => {},
    },
    tradeNo: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      params: {
        appealRequest: '',
        appealType: '',
        appealContent: '',
        filename: [],
        tradeNo: this.tradeNo,
        language: this.$store.state.locale,
      },
      fileList: [],
      uploadUrl: Configs.DEFAULT.UPLOAD_API,
    };
  },
  async created() {
    await this.getAppealType();
  },
  computed: {
    ...mapState({
      OrderDetail: state => state.i18n.App.OrderDetail,
      Settings: state => state.i18n.App.Settings,
      AppealTypeList: state => {
        return state.order.AppealTypeList;
      },
      locale: state => {
        return state.locale;
      },
    }),
  },
  methods: {
    ...mapActions({
      getAppealType: ORDER_APPEAL_TYPELIST_ACTIONS,
      createAppeal: AD_CREATEDAPPEAL,
    }),
    beforeUpload(file) {
      let isLt5M = file.size / 1024 / 1024 < 5;
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/bmp';
      if (!isLt5M) {
        this.$message.error(this.Settings.imgSize);
        return false;
      }
      if (!isIMG) {
        this.$message.error(this.Settings.imgFormat);
        return false;
      }

      return isLt5M && isIMG;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.Settings.fileWarn[0] + `${files.length}` + this.Settings.fileWarn[1] + `${files.length + fileList.length}` + this.Settings.fileWarn[2]);
    },
    handleSuccess(res, files, fileList) {
      this.fileList = fileList;
    },
    handleError(error) {
      this.$message.error(this.Settings.failUpload);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    hadnleSubmit() {
      this.params.filename = [];
      this.fileList.forEach(x => {
        this.params.filename.push(x.response.data.filePath);
      });
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(this.params);
          let res = await this.createAppeal(this.params);
          if (res && res.code !== 200) {
            this.$message.error(this.Settings.messageErr[2]);
          } else {
            this.handleOk();
            //this.handleClose();
          }
        }
        return false;
      });
    },
  },
};
</script>

<style lang="scss">
.upload-demo {
  position: relative;
  top: -6px;
}
.appeal {
  .appeal-modal-container {
    padding-top: 18px;
    .appealUpLoad {
      display: flex;
      justify-content: space-between;
      .el-form-item__label {
        padding: 0;
        padding-right: 28px;
        white-space: nowrap;
      }
      .modal-upload-btn {
        width: auto;
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    font-size: 12px;
    color: #a8afcd;
    margin-top: 0;
  }
  .el-upload-list__item-name {
    font-size: 14px;
    color: #354989;
  }
  .appeal-modal-footer {
    // background: #f8f8fc;
    width: 100%;
    margin-bottom: 44px;
    // height: 156px;
    align-items: center;
    display: flex;
    ul {
      font-size: 14px;
      color: #7d86ac;
      width: 455px;
      margin: 0 auto;
      text-align: left;
      li {
        list-style-type: disc;
        line-height: 24px;
        &:nth-child(1) {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
