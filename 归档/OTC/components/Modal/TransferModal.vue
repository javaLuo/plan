<!-- 划转弹框 -->
<template>
  <el-dialog :title="Common.transferTit"
             :visible.sync="display"
             width="540px"
             :before-close="handleClose"
             class="tl-dialog transfer-modal-dialog">
    <div class="title">{{Common.transferNote}}</div>
    <el-form :model="form"
             ref="transferForm"
             class="trans-form"
             label-position="top">
      <!-- 选择币种 -->
      <el-form-item prop="coinType"
                    :label="Common.selIcons"
                    :rules="[{required:true,message:Common.mesRules[0], trigger: 'change'}]">
        <!-- <div class="my-label">
          <span>{{Common.selIcons}}</span>
        </div> -->
        <el-select v-model="form.coinType"
                   :placeholder="Common.placeholder[4]"
                   @change="changeCoinType">
          <el-option v-for="item in coinTypeList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 从 -->
      <el-form-item prop="accountType"
                    :rules="[{required:true,message:Common.mesRules[1], trigger: 'change'}]">
        <div class="my-label">
          <span>{{Common.step[0]}}</span>
          <span>{{Common.assetInfo[0]}}{{accountOne}} {{form.coinType}}</span>
        </div>
        <el-select v-model="form.accountType"
                   :placeholder="Common.placeholder[4]"
                   @change="changeType">
          <el-option v-for="item in accountTypeList"
                     :key="item.value"
                     :label="Common.account[item.label]"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 到 -->
      <el-form-item prop="accountTypeTwo"
                    :rules="[{required:true,message:Common.mesRules[1], trigger: 'change'}]">
        <div class="my-label">
          <span>{{Common.step[1]}}</span>
          <span>{{Common.assetInfo[0]}}{{accountTwo}} {{form.coinType}}</span>
        </div>
        <el-select v-model="form.accountTypeTwo"
                   :placeholder="Common.placeholder[4]"
                   @change="changeTypeTwo">
          <el-option v-for="item in accountTypeListReverse"
                     :key="item.value"
                     :label="Common.account[item.label]"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 数量 -->
      <el-form-item prop="accountLimit"
                    :rules="[{validator:this.validateAccount}]">
        <div class="my-label">
          <span>{{Common.step[2]}}</span>
          <span>{{Common.assetInfo[1]}}{{accountLimit}} {{form.coinType}}</span>
        </div>
        <el-input type='text'
                  v-model="form.accountLimit"
                  controls-position="right"></el-input>
      </el-form-item>
      <!-- 划转全部按钮 -->
      <div class="all-in">
        <span @click="accountLimitToMax">{{Common.transferAll}}</span>
      </div>

    </el-form>

    <div class="last-div-modal"></div>

    <!-- 按钮 -->
    <div slot="footer"
         class="dialog-footer">
      <el-button class="modal-cancel-btn"
                 @click="handleClose">{{Common.cancel}}</el-button>
      <el-button type="primary"
                 :loading="loading"
                 class="submit"
                 @click="onOkSubmit">{{Common.handle}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import * as accountType from '~/store/modules/account/type';
import * as Dict from '~/store/dict';
import * as Validate from '~/utils/validate';
import UtilsR from '~/utils/ramda';

export default {
  components: {},
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
    coinType: {
      required: false,
      type: String,
      default: 'BTC',
    },
    total: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        accountLimit: this.total || '',
        coinType: this.coinType || '',
        accountType: 1,
        accountTypeTwo: 2,
      },
      coinTypeList: [
        {
          value: 'BTC',
          label: 'BTC',
        },
        {
          value: 'ETH',
          label: 'ETH',
        },
        {
          value: 'ETP',
          label: 'ETP',
        },
        {
          value: 'RT',
          label: 'RT',
        },
        {
          value: 'USD',
          label: 'USD',
        },
      ],
      accountTypeList: [
        {
          value: 1,
          label: 0,
        },
        {
          value: 2,
          label: 1,
        },
      ],
      loading: false,
      // ,rules:{
      //   coinType: [{required:true,message:'请选择币种类型', trigger: 'change'}],
      //   accountType: [{required:true,message:'请选择账户类型', trigger: 'change'}],
      //   accountTypeTwo: [{required:true,message:'请选择账户类型', trigger: 'change'}],
      //   accountLimit:[{validator:this.validateAccount , trigger:['keyup', 'change']}]
      // }
    };
  },
  watch: {
    coinType: function() {
      if (!!this.$refs.transferForm) {
        this.$refs.transferForm.clearValidate();
      }
      if (this.coinType !== '') {
        this.form.coinType = this.coinType; //Dict[this.coinType]
        this.form.accountType = 1;
        this.form.accountTypeTwo = 2;
        if (!!this.total) {
          this.form.accountLimit = this.total;
        } else {
          this.form.accountLimit = '';
        }
      }
    },
  },
  created() {
    // console.log('aaa')
    this.getTradeAssetsInfo();
  },
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
      OrderDetail: state => state.i18n.App.OrderDetail,
      tradeAssetInfo: state => state.account.tradeAssetAll,
      transfer: state => state.account.transfer,
    }),
    accountTypeListReverse() {
      return UtilsR.R.reverse(this.accountTypeList);
    },
    accountOne() {
      const coin = this.tradeAssetInfo && this.tradeAssetInfo.accountNewList && this.tradeAssetInfo.accountNewList[this.form.coinType] ? this.tradeAssetInfo.accountNewList[this.form.coinType] : null;
      if (!!coin) {
        if (this.form.accountType === 1) {
          return coin[1]['balance'];
        } else if (this.form.accountType === 2) {
          return coin[0]['balance'];
        }
      }
      return 0.0;
    },
    accountTwo() {
      const coin = this.tradeAssetInfo && this.tradeAssetInfo.accountNewList && this.tradeAssetInfo.accountNewList[this.form.coinType] ? this.tradeAssetInfo.accountNewList[this.form.coinType] : null;
      if (!!coin) {
        if (this.form.accountType === 1) {
          return coin[0]['balance'];
        } else if (this.form.accountType === 2) {
          return coin[1]['balance'];
        }
      }
      return 0.0;
    },
    accountLimit() {
      if (this.form.accountType === '') {
        return 0.0;
      }
      return this.accountOne;
    },
  },
  methods: {
    ...mapActions({
      getTradeAssetsInfo: accountType.GET_TRADE_ASSET_ALL_ACTIONS,
      getTradeAssetsList: accountType.GET_TRADE_ASSET_LIST_ACTIONS,
      tradeAssetTransfer: accountType.TRADE_ASSET_TRANSFER_ACTIONS,
    }),
    handleClose() {
      if (!!this.$refs.transferForm) {
        this.$refs.transferForm.clearValidate();
      }
      this.close();
    },
    accountLimitToMax() {
      this.form.accountLimit = this.accountLimit;
    },
    changeCoinType(e) {
      this.form.accountType = 1;
      this.form.accountTypeTwo = 2;
      this.form.accountLimit = '';
    },
    changeType(e) {
      this.form.accountType === e;
      this.form.accountTypeTwo = e === 2 ? 1 : 2;
      this.form.accountLimit = '';
    },
    changeTypeTwo(e) {
      this.form.accountTypeTwo === e;
      this.form.accountType = e === 2 ? 1 : 2;
      this.form.accountLimit = '';
    },
    validateAccount(rule, value, callback) {
      if (value === '') {
        callback();
        return;
      } else if (isNaN(value)) {
        this.form.accountLimit = '';
        callback(this.Common.callbackTxt[2]);
      } else if (!Validate.testDecimalEightNums.test(value)) {
        callback(this.Common.callbackTxt[0]);
      } else if (Number(value) > this.accountLimit) {
        callback(this.Common.callbackTxt[1]);
      } else {
        callback();
      }
    },
    async onOkSubmit() {
      if (this.loading) {
        return;
      }

      this.loading = true;
      this.$refs['transferForm'].validate(async valid => {
        if (valid) {
          if (!this.form.accountLimit) {
            this.$message.error(this.Common.callbackTxt[2]);
            this.loading = false;
            return;
          }
          if (String(this.form.accountLimit) === '0' || Number(this.form.accountLimit) <= 0) {
            this.form.accountLimit = '';
            this.loading = false;
            return;
          }
          await this.tradeAssetTransfer({
            asset: this.form.coinType,
            otcToEx: this.form.accountType === 1 ? true : false,
            amount: this.form.accountLimit,
          });
          await this.getTradeAssetsInfo();
          await this.getTradeAssetsList({
            pageSize: 10,
            startPage: 1,
          });
          await this.close();
          this.form.accountLimit = '';
          this.loading = false;
        } else {
          this.loading = false;
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.transfer-modal-dialog {
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: rgb(220, 223, 230);
  }
  .el-dialog__body {
    padding-top: 0;
    .my-label {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #7d86ac;
      & > span:nth-child(2) {
        font-size: 12px;
      }
    }
    .title {
      font-size: 14px;
      color: #354989;
      margin-bottom: 28px;
    }
    .el-input__inner {
      color: #354989;
    }
    .all-in {
      text-align: right;
      & > span {
        cursor: pointer;
        color: #ff6600;
      }
    }
  }

  .trans-form {
    margin-bottom: 44px;
  }
}
</style>

