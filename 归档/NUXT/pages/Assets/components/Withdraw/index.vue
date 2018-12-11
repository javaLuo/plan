<template>
  <el-form class="panel-withdraw">
    <div class="serviceFee">
      <div class="h">{{i18n.App.WithDraw.coin}}</div>
      <div class="b">
        <SelectServiceFee :type="'withdraw'" />
      </div>
    </div>
    <div class="assets df jcsb">
      <el-form-item :label="i18n.App.AccountDetail.totals">
        <el-input style="width:260px"
                  disabled="disabled"
                  :value="assets.assets.total"></el-input>
      </el-form-item>
      <el-form-item :label="i18n.App.AccountDetail.balance">
        <el-input style="width:260px"
                  :value="assets.assets.ava"
                  disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item :label="i18n.App.AccountDetail.frozeAmount">
        <el-input style="width:260px"
                  :value="assets.assets.frozen"
                  disabled="disabled"></el-input>
      </el-form-item>
    </div>
    <div class="address">
      <div class="h">
        {{i18n.App.WithDraw.withdraw_address}}
      </div>
      <div class="b">
        <WithdrawAddress :onChange="onChangeAddress" />
      </div>
      <!-- <div class="f tip"
           v-if="form.address.dirty && !form.address.valid">
        address
      </div> -->
    </div>

    <div class="amount">
      <div class="h df jcsb">
        <div class="l">{{i18n.App.AccountDetail.Quantity}}</div>
        <div class="r">{{i18n.App.WithDraw.limit[0]}}{{maxWithdraw}}{{i18n.App.WithDraw.limit[1]}}{{minWithdraw}}</div>
      </div>
      <div class="b">
        <el-form-item>
          <CInput :onInput="onInputAmount"
                  :val="amount.value" />
          <span class="btn"
                @click="onAll()">All</span>

          <div class="tip"
               v-if="form.amount.dirty && !form.amount.empty.valid">{{i18n.App.WithDraw.withdraw_number_req}}</div>
          <div class="tip"
               v-if="form.amount.dirty && !form.amount.zero.valid">{{i18n.App.WithDraw.withdraw_cur}}</div>
          <!-- <div class="tip"
               v-if="form.amount.dirty && !form.amount.number.valid">number</div> -->
          <div class="tip"
               v-if="form.amount.dirty && !form.amount.max.valid">{{i18n.App.WithDraw.withdraw_balance_limit}}</div>
          <div class="tip"
               v-if="form.amount.dirty && !form.amount.min.valid">{{i18n.App.WithDraw.withdraw_balance_limit}}</div>
        </el-form-item>
      </div>
    </div>

    <div class="fee df jcsb">
      <div class="i">
        <div class="h">
          {{i18n.App.WithDraw.serCharge}}
        </div>
        <div class="b">
          <el-input style="width:420px"
                    :value="fee"
                    disabled="disabled"
                    placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="i">
        <div class="h">
          {{i18n.App.WithDraw.arrivalAcc}}
        </div>
        <div class="b">
          <el-input style="width:420px"
                    :value="recieveAmount"
                    disabled="disabled"
                    placeholder="请输入内容"></el-input>
        </div>
      </div>
    </div>

    <div class="pwd">
      <div class="h">
        {{i18n.App.WithDraw.password}}
      </div>
      <div class="b">
        <el-input type="password"
                  v-model="payPwd.value"
                  :placeholder="i18n.App.WithDraw.passwordPlaceholder"
                  @input="onInputPayPwd($event)"></el-input>
      </div>
      <div class="f tip"
           v-if="form.payPwd.dirty && !form.payPwd.require.valid">
        {{i18n.App.WithDraw.passwordPlaceholder}}
      </div>
    </div>

    <div class="btn df jcfe">
      <el-button v-show="$store.state.user.userInfo.secertStatus !== 0"
                 :disabled="!form.valid || recieveAmount <= 0"
                 :loading="assets.loading"
                 type="primary"
                 @click="onSubmit()"> {{i18n.App.WithDraw.confirm}}</el-button>
    </div>
    <div class="btn df jcfe">
      <div v-if="payPwd.forgot.show">
        <nuxt-link to="/u/fundPwd">{{i18n.App.Login.forgot}}</nuxt-link>
      </div>
      <div v-if="$store.state.user.userInfo.secertStatus === 0">
        <nuxt-link to="/u/fundPwd">{{i18n.App.Prompt.setFundsPwd}}</nuxt-link>
      </div>
    </div>

    <two-fa :handle-success="onVerifySuccess"
            :handle-error="onVerifyError"
            :handle-close="onVerifyClose"
            :url="'/newAudit-api/saveUserAudit'"></two-fa>

    <div class="ft">
      <div class="h">
        <i class="iconfont icon-zhuyi"></i>{{i18n.App.WithDraw.Precautions}}</div>
      <div class="b">
        <div class="i df aifs">
          <div class="l"></div>
          <div class="r">{{i18n.App.WithDraw.notice[0]}}&nbsp;{{$store.state.user.userInfo.userLevel}}.</div>
        </div>
        <div class="i df aifs"
             v-if="$store.state.user.userInfo.userLevel === 'LV0'">
          <div class="l"></div>
          <div class="r">{{i18n.App.WithDraw.notice[1]}}
            <nuxt-link to="/u">{{i18n.App.WithDraw.userCenter}}</nuxt-link>
            {{i18n.App.WithDraw.notice[2]}}</div>
        </div>

        <div class="i df aifs"
             v-if="$store.state.user.userInfo.userLevel !== 'LV0'">
          <div class="l"></div>
          <div class="r">{{i18n.App.WithDraw.notice[3]}} {{minWithdraw}} {{assets.onCoin}} {{i18n.App.WithDraw.notice[7]}}
            <nuxt-link to="/u">{{i18n.App.WithDraw.userCenter}}</nuxt-link>
            {{i18n.App.WithDraw.notice[8]}}</div>
        </div>
        <div class="i df aifs">
          <div class="l"></div>
          <div class="r">{{i18n.App.WithDraw.notice[4]}} &nbsp;
            <nuxt-link :to="{path:'assets',query:{type:'history',tab:'withdraw'}}">{{i18n.App.WithDraw.record}}</nuxt-link> {{i18n.App.WithDraw.notice[5]}}</div>
        </div>
        <div class="i df aifs">
          <div class="l"></div>
          <div class="r">{{i18n.App.WithDraw.notice[6]}}</div>
        </div>
      </div>
    </div>
    <el-dialog :title="i18n.App.Address.tips"
               class="kyc-dialog"
               :visible.sync="dialogVisible"
               width="432px">
      <span>{{i18n.App.WithDraw.withdraw_kyc}}</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">{{i18n.App.Address.cancelText}}</el-button>
        <nuxt-link to="/u"
                   class="next">
          {{i18n.App.ForgotPassword.button}}
        </nuxt-link>
      </span>
    </el-dialog>
  </el-form>

</template>

<script>
import SelectServiceFee from '../SelectServiceFee';
import WithdrawAddress from '../WithdrawAddress';
import { mapActions, mapState } from 'vuex';
import CInput from '../CInput';
import utils from '~/utils/';
import _ from 'lodash';
import big from '../../big';
export default {
  props: ['dataSource', 'onChange'],
  watch: {
    'assets.onCoin'() {
      this.onCoinChange();
    },
    on() {
      this.onChange(this.on.toUpperCase());
    },
  },
  components: {
    SelectServiceFee,
    WithdrawAddress,
    CInput,
  },
  computed: {
    // WithDraw: state => state.i18n.App.WithDraw,
    ...mapState(['assets', 'i18n']),
    ...mapState({
      AccountDetail: state => state.i18n.App.AccountDetail,
    }),
    onAssets() {
      const isEmpty = JSON.stringify(this.assets.hashServiceFee) === '{}';
      if (!isEmpty && !!this.assets.hashServiceFee && !!this.assets.onCoin && !!this.assets.hashServiceFee[this.assets.onCoin]) {
        return this.assets.hashServiceFee[this.assets.onCoin];
      }
      return false;
    },
    maxWithdraw() {
      if (this.onAssets) {
        return this.onAssets.maxWithdraw;
      }
      return 0;
    },
    minWithdraw() {
      if (this.onAssets) {
        return this.onAssets.minWithdraw;
      }
      return 0;
    },
    point() {
      if (this.onAssets) {
        return Number(this.onAssets.point);
      }
      return 0;
    },
    fee() {
      const point = this.point;
      if (!this.onAssets) {
        return Number(0).toFixed(point);
      }
      // const amount = Number(this.amount.value);
      const nAmount = Number(this.amount.value);
      const sAmountF8 = big.toFixed8(nAmount);
      const sAmountFp = big.toFixed(sAmountF8, this.point);

      const feeRatio = Number(this.onAssets.feeRatio);
      const baseFee = Number(this.onAssets.baseFee);

      if (nAmount === 0) {
        return Number(0).toFixed(point);
      }

      const ret = big.plus(big.multi(sAmountFp, feeRatio), baseFee);
      const sRetFp = big.toFixed(ret, point);
      return sRetFp;
    },
    recieveAmount() {
      const nAmount = Number(this.amount.value);
      const sAmountF8 = big.toFixed8(nAmount);
      const sAmountFp = big.toFixed(sAmountF8, this.point);

      const nFee = Number(this.fee);
      const sFeeF8 = big.toFixed8(nFee);
      const sFeeFp = big.toFixed(sFeeF8, this.point);

      const point = this.point;

      const ret = big.minus(sAmountFp, sFeeFp);

      const nRet = Number(ret);
      const sRetFp = big.toFixed(nRet, this.point);

      // if (ret < 0) {
      //   return 0;
      // }

      return sRetFp;
    },
  },
  data() {
    return {
      dialogVisible: false,
      on: '',
      forgotPwd: {
        show: false,
      },
      amount: {
        value: '',
        tip: '',
        validateVal: '',
      },
      address: {
        value: '',
        tip: '',
      },
      payPwd: {
        forgot: {
          show: false,
        },
        value: '',
        tip: '',
      },
      form: {
        amount: {
          valid: true,
          empty: {
            valid: true,
            dirty: false,
            markAsDirty() {
              this.dirty = true;
            },
          },
          number: {
            valid: true,
          },
          min: {
            valid: true,
            dirty: false,
            markAsDirty() {
              this.dirty = true;
            },
          },
          max: {
            valid: true,
          },
          zero: {
            valid: true,
            dirty: false,
            markAsDirty() {
              this.dirty = true;
            },
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        address: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        payPwd: {
          valid: true,
          require: {
            valid: true,
          },
          dirty: false,
          markAsDirty() {
            this.dirty = true;
          },
        },
        valid: false,
      },
    };
  },
  methods: {
    resetForm() {
      this.amount.value = '';
      this.amount.tip = '';
      this.payPwd.tip = '';
    },
    onVerifySuccess() {
      this.onWithdraw();
    },
    onVerifyError() {},
    onVerifyClose() {},
    onInputAmount(val) {
      const nAmount = Number(val);
      const sAmountF8 = big.toFixed8(nAmount);
      const sAmountFp = big.toFixed(sAmountF8, this.point);
      if (this.isGtPoint(val, this.point)) {
        this.amount.value = sAmountFp;
        return;
      }

      this.amount.validateVal = val;

      let valid = true;

      this.validateForm(e => {
        valid = e.amount.number.valid && e.amount.empty.valid && e.amount.zero.valid && e.amount.max.valid && e.amount.min.valid;
        this.form.amount.markAsDirty();
        if (!e.amount.number.valid) {
          this.amount.value = val.replace(/\D/g, '');
          return;
        } else {
        }
        if (!e.amount.empty.valid) {
          this.amount.value = val;
          return;
        } else {
        }
        if (!e.amount.zero.valid) {
          this.amount.value = val;
          return;
        } else {
        }
        if (!e.amount.max.valid) {
          this.amount.value = val;
          return;
        } else {
        }
        if (!e.amount.min.valid) {
          this.amount.value = val;
          return;
        } else {
        }
      });

      if (!valid) {
        return;
      }

      this.amount.value = val;
    },
    //大于 某个 精度
    isGtPoint(v, p) {
      const arr = v.split('.');
      if (p === 0) {
        return true;
      }
      if (arr.length == 1) {
        return false;
      }
      if (arr[1].length > p) {
        return true;
      }
      return false;
    },
    onSelect(item) {
      // console.log(item);
    },
    onClick(ev) {
      // console.log(ev);
    },
    onAll() {
      const nAmount = Number(this.assets.assets.ava);
      const sAmountF8 = big.toFixed8(nAmount);
      const sAmountFp = big.toFixed(sAmountF8, this.point);

      const nMaxWithdraw = Number(this.maxWithdraw);
      const sMaxWithdrawF8 = big.toFixed8(nMaxWithdraw);
      const sMaxWithdrawFp = big.toFixed(sMaxWithdrawF8, this.point);

      this.onInputAmount(Number(sAmountFp) > sMaxWithdrawFp ? sMaxWithdrawFp : sAmountFp);
    },
    async init() {
      await this.$store.dispatch('user/getUserInfo');
      this.dialogVisible = Boolean((!!this.$store.state.user.userInfo && !this.$store.state.user.userInfo.c1Status) || !this.$store.state.user.userInfo.c2Status);
      this.onCoinChange();
    },
    onCoinChange() {
      this.resetForm();
      this.$store.dispatch('assets/findAvaCoin', {
        coin: this.assets.onCoin,
      });
    },
    async onSubmit() {
      if (!this.form.valid) {
        return;
      }

      const payPwd = await this.$store.dispatch('assets/findPayPwd', {
        pwd: this.payPwd.value,
      });

      if (200 !== payPwd.code) {
        this.payPwd.forgot.show = true;
        this.$message.error(this.i18n.App.ErrorCode[payPwd.code]);
        return;
      } else {
        this.payPwd.forgot.show = false;
      }
      if (this.$store.state.user.userInfo.googleBinded) {
        this.$store.dispatch('user/toggleTwoFa', {
          show: true,
        });
      } else {
        this.onWithdraw();
      }
    },
    async onWithdraw() {
      const store = this.$store;
      const state = store && store.state;
      const user = state && user;
      const userInfo = user && userInfo;
      const secertStatus = userInfo && userInfo.secertStatus;
      if (0 === secertStatus) {
        this.$message.error(this.i18n.App.Prompt.setFundsPwd);
        return;
      }
      let res = await this.$store.dispatch('assets/saveWOrder', {
        amount: this.amount.value,
        asset: this.assets.onCoin,
        // fee: '0.00000001',
        withdrawDestAddress: this.address.value,
      });
      if (200 !== res.code) {
        this.$message.error(this.i18n.App.ErrorCode[res.code]);
        return;
      }
      this.$message.success(this.i18n.App.WithDraw.submitted);
      this.$router.push({ path: 'assets', query: { ...this.assets.query, type: 'history', tab: 'withdraw' } });
    },
    onChangeAddress(e) {
      // console.log(e);
      this.address.value = e;
      this.validateForm(e => {
        if (e.address.require.valid) {
          e.address.markAsDirty();
        } else {
          // this.address.tip = 'address require';
        }
      });
    },
    onInputPayPwd(e) {
      this.validateForm(e => {
        if (!e.payPwd.require.valid) {
          this.form.payPwd.markAsDirty();
        } else {
        }
      });
    },
    validateForm(cb) {
      cb = cb || function() {};

      let val = this.amount.validateVal;

      const isEmpty = val.length === 0;
      const isZero = val === '0';

      const isGtMaxWithdraw = Number(val) > Number(this.maxWithdraw);
      const isLtMinWithdraw = Number(val) < Number(this.minWithdraw) && !isEmpty;
      if (!_.isNumber(Number(val)) || _.isNaN(Number(val))) {
        this.form.amount.number.valid = false;
      } else {
        this.form.amount.number.valid = true;
      }
      if (isEmpty) {
        this.form.amount.empty.valid = false;
      } else {
        this.form.amount.empty.valid = true;
      }
      if (isZero) {
        this.form.amount.zero.valid = false;
      } else {
        this.form.amount.zero.valid = true;
      }
      if (isGtMaxWithdraw) {
        this.form.amount.max.valid = false;
      } else {
        this.form.amount.max.valid = true;
      }
      if (isLtMinWithdraw) {
        this.form.amount.min.valid = false;
      } else {
        this.form.amount.min.valid = true;
      }

      if (!!this.address.value) {
        this.form.address.require.valid = true;
      } else {
        this.form.address.require.valid = false;
      }

      if (!!this.payPwd.value) {
        this.form.payPwd.require.valid = true;
      } else {
        this.form.payPwd.require.valid = false;
      }

      let valid = true;

      for (let key in this.form) {
        if (this.form[key] && this.form[key].hasOwnProperty('valid')) {
          const item = this.form[key];
          let itemValid = true;
          for (let k in item) {
            if (item[k] && item[k].hasOwnProperty('valid')) {
              valid = valid && item[k].valid;
              itemValid = itemValid && item[k].valid;
            }
          }
          this.form[key].valid = itemValid;
        }
      }

      this.form.valid = valid;

      cb(this.form);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped="true">
@import '~assets/css/_theme-conf';

.panel-withdraw {
  width: 960px;
  @include bgPair(background-color);
  border-radius: 2px;
  padding: 30px;

  .tip {
    color: red;
  }
  .serviceFee {
    margin-bottom: 13px;
    .h {
      margin-bottom: 7px;
      @include subFontPair(color);
    }
  }
  .amount {
    .h {
      margin-bottom: 7px;
      @include subFontPair(color);
    }
    .b {
      .el-form-item {
        position: relative;
        span.btn {
          position: absolute;
          right: 10px;
          top: 0;
          cursor: pointer;
          @include interactionPair(color);
        }
      }
    }
  }
  .address {
    margin-bottom: 22px;
    .h {
      margin-bottom: 7px;
      @include subFontPair(color);
    }
  }
  .fee {
    margin-bottom: 22px;
    .h {
      margin-bottom: 7px;
      @include subFontPair(color);
    }
  }
  .pwd {
    margin-bottom: 44px;
    .h {
      margin-bottom: 7px;
      @include subFontPair(color);
    }
  }
  .ft {
    a {
      @include interactionPair(color);
    }
    .h {
      margin-top: 46px;
      margin-bottom: 16px;
      @include subFontPair(color);
      i {
        margin-right: 6px;
        color: #df543a;
      }
    }
    .b {
      .i {
        margin-bottom: 5px;
        .l {
          border-radius: 10px;
          padding: 3px;
          background: #a2aaca;
          margin-right: 10px;
          margin-top: 7px;
        }
        .r {
          @include fontPair(color);
          letter-spacing: 0;
          line-height: 22px;
        }
      }
    }
  }
}
</style>