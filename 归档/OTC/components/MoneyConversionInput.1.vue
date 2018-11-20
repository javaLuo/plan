<template>
  <div>
    <div class="panel-exchange df">
      <div class="lt">
        <font @mousedown="onAllCny($event)">
          {{curency.btn.all.show ? 'all':'cny'}}
        </font>
        <CInput :val="curency.value"
                @blur="onCurrencyBlur()"
                @focus="onCurrencyFocus()"
                :onInput="onInputCurrency" />
      </div>
      <div class="ct">~</div>
      <div class="rt">
        <font @mousedown="onAllCoin($event)">
          {{coin.btn.all.show ? 'all':'btc'}}
        </font>
        <CInput :val="coin.value"
                @blur="onCoinBlur()"
                @focus="onCoinFocus()"
                :onInput="onInputCoin" />
      </div>
    </div>
    <div class="money-conversion-input">
      <el-form :inline="true"
               ref="myConversionForm">
        <el-form-item :rules="{validator:onValidator, type:'curency',  trigger: 'change'}"
                      label=""
                      prop="curency">
          <el-input class="transparent-input"
                    type="number"
                    v-model="curency.val"
                    auto-complete="off"
                    @blur="onBlur('curency');"
                    @focus="onFocus('curency')"
                    @input="onInput('curency')">
            <span slot="suffix"
                  v-show="curency.isFocus"
                  @click="onAll('curency')"
                  :style="{cursor: 'pointer'}">{{Common.total}}</span>
            <span slot="suffix"
                  v-show="!curency.isFocus">{{data.payAsset}}</span>
          </el-input>
        </el-form-item>
        <el-form-item class="zhehe">
          <i class="iconfont icon-zhehe"
             placeholder="0"></i>
        </el-form-item>
        <el-form-item :rules="{validator:onValidator, type:'coin',  trigger: 'change'}"
                      ref="coin"
                      label=""
                      prop="coin">
          <el-input class="transparent-input"
                    type="number"
                    v-model="coin.val"
                    auto-complete="off"
                    @blur="onBlur('coin')"
                    @focus="onFocus('coin')"
                    @input="onInput('coin')">
            <span slot="suffix"
                  v-show="coin.isFocus"
                  @click="onAll('all')"
                  :style="{cursor: 'pointer'}">{{Common.total}}</span>
            <span slot="suffix"
                  v-show="!coin.isFocus">{{data.tradeAsset}}</span>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import Utils from '~/utils';
import CInput from './Controlled/CInput';
export default {
  components: {
    CInput,
  },
  data() {
    return {
      init: true,
      curency: {
        isFocus: false,
        val: '',

        value: '',
        btn: {
          all: {
            show: false,
          },
        },
      },
      coin: {
        isFocus: false,
        val: '',

        value: '',
        btn: {
          all: {
            show: false,
          },
        },
      },
    };
  },
  props: ['data'],
  mounted() {
    //	console.log('父级信息：', { o: Object.keys(this.data), b: Object.keys(this.$props.data) });
  },
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
    }),
    isMaxCurency() {
      const val = Number(this.curency.val);
      return val > this.getMaxCurency();
    },
    isMinCurency() {
      const val = Number(this.curency.val);
      return val < this.getMinCurency() && !this.isEmptyString(val);
    },
    isMaxCoin() {
      const max = this.getMaxCoin().toFixed(4);
      const val = Number(this.coin.val);
      return this.coin.val > max;
    },
    isMinCoin() {
      const min = this.getMinCoin().toFixed(4);
      const val = Number(this.coin.val);
      return val < min && !this.isEmptyString(val);
    },
    conversionForm() {
      const curency = this.curency.val;
      const coin = this.coin.val;
      return {
        curency,
        coin,
      };
    },
  },
  watch: {},
  methods: {
    onAllCny() {
      const maxAmount = this.data.limitMax;
      this.onInputCurrency({ target: { value: Number(maxAmount).toFixed(2) } });
    },
    onAllCoin() {
      const unitPrice = this.data.unitPrice;
      const maxAmount = Number(this.data.limitMax) / Number(unitPrice);
      this.onInputCoin({ target: { value: Number(maxAmount).toFixed(4) } });
    },
    onInputCurrency(e) {
      let val = e.target.value;
      const unitPrice = this.data.unitPrice;
      const maxAmount = this.data.limitMax;
      const minAmount = this.data.limitMin;

      if (!this.isNumber(maxAmount)) {
        throw '最大下单额必须为 type number';
        return;
      }

      if (!this.isNumber(minAmount)) {
        throw '最小下单额必须为 type number';
        return;
      }

      if (!this.isNumber(unitPrice)) {
        throw '单价必须为 type number';
        return;
      }

      //input value must be number
      if (!this.isNumber(val)) {
        this.curency.value = val.replace(/\D/g, '');
        return;
      }

      //不在合理范围内 warning
      if (!(Number(val) >= minAmount && Number(val) <= maxAmount)) {
        this.$message.error('over');
      }

      const amount = Number(val) / Number(unitPrice);

      // console.log(Number(val), Number(unitPrice), amount.toFixed(4));

      this.coin.value = amount.toFixed(4);

      this.curency.value = val;
    },
    isNumber(o) {
      return /^[0-9]+.?[0-9]*$/.test(o);
    },
    isEmptyString(o) {
      return Object.prototype.toString.call(o) == '[object String]' && o.length == 0;
    },
    onInputCoin(e) {
      let val = e.target.value;
      const unitPrice = this.data.unitPrice;
      const maxAmount = Number(this.data.limitMax) / Number(unitPrice);
      const minAmount = Number(this.data.limitMin) / Number(unitPrice);

      if (!this.isNumber(maxAmount)) {
        throw '最大下单额必须为 type number';
        return;
      }

      if (!this.isNumber(minAmount)) {
        throw '最小下单额必须为 type number';
        return;
      }

      if (!this.isNumber(unitPrice)) {
        throw '单价必须为 type number';
        return;
      }

      //must be number
      if (!this.isNumber(val)) {
        this.coin.value = val.replace(/\D/g, '');
        return;
      }

      //不在合理范围内 warning
      if (!(Number(val) >= minAmount && Number(val) <= maxAmount)) {
        this.$message.error('over');
      }

      const amount = Number(val) * Number(unitPrice);

      // console.log(Number(val), Number(unitPrice), amount.toFixed(4));

      this.curency.value = amount.toFixed(2);

      this.coin.value = val;
    },
    onCurrencyBlur() {
      console.log(2222222);
      this.curency.btn.all.show = false;
    },
    onCoinBlur() {
      this.coin.btn.all.show = false;
    },
    onCurrencyFocus() {
      this.curency.btn.all.show = true;
    },
    onCoinFocus() {
      this.coin.btn.all.show = true;
    },

    getMaxCurency() {
      return Number(this.data.limitMax);
    },
    getMinCurency() {
      return Number(this.data.limitMin);
    },
    getMinCoin() {
      return Number(Utils.div(this.data.limitMin, this.data.unitPrice));
    },
    getMaxCoin() {
      return Number(Utils.div(this.data.limitMax, this.data.unitPrice));
    },
    isEmptyString(v) {
      return Object.prototype.toString.call(v) == '[object String]' && v.length <= 0;
    },
    isInit() {
      return this.init;
    },
    isFocus(type) {
      return this[type].isFocus;
    },
    isBlur(type) {
      return !this.isFocus(type);
    },
    isZero(type) {
      const val = this[type].val;
      return !Boolean(Number(val));
    },
    isNumber(v) {
      const value = Number(v);
      if (Number.isNaN(value)) {
        return false;
      }
      return Object.prototype.toString.call(value) == '[object Number]';
    },
    onBlur(type) {
      setTimeout(() => {
        if (type == 'curency') {
          this.curency.isFocus = false;
        }
        if (type == 'coin') {
          this.coin.isFocus = false;
        }
      }, 200);
    },
    //验证
    onValidator(rule, value, callback) {
      const type = rule.type;
      value = this[type].val;
      if (type == 'curency') {
        if (this.isMinCurency) {
          callback(new Error(this.Common.errLimitMin + `${this.getMinCurency()}${this.data.payAsset}`));
          return;
        }
        if (this.isMaxCurency) {
          callback(new Error(this.Common.errLimitMax + `${this.getMaxCurency()}${this.data.payAsset}`));
          return;
        }
        callback();
      }
      if (type == 'coin') {
        const max = Utils.div(this.data.limitMax, this.data.unitPrice);
        const min = Utils.div(this.data.limitMin, this.data.unitPrice);
        if (this.isMinCoin) {
          callback(new Error(this.Common.errLimitMin + `${this.getMinCoin().toFixed(4)}${this.data.tradeAsset}`));
          return;
        }
        if (this.isMaxCoin) {
          callback(new Error(this.Common.errLimitMax + `${this.getMaxCoin().toFixed(4)}${this.data.tradeAsset}`));
          return;
        }
      }
    },
    onAll(type) {
      this.coin.val = Number(this.data.stock).toFixed(4);
      this.curency.val = Utils.toFixed2(this.getCurencyByCoin());
    },
    onFocus(type) {
      if (type == 'curency') {
        this.curency.isFocus = true;
      }
      if (type == 'coin') {
        this.coin.isFocus = true;
      }
    },
    getCurencyByCoin() {
      const curency = Number(Utils.multi(Number(this.coin.val), Number(this.data.unitPrice)));
      return curency;
    },
    getCoinByCurency() {
      const coin = Number(Utils.div(Number(this.curency.val), Number(this.data.unitPrice)));
      return coin;
    },
    //设置为0的情况
    setZero(type) {
      const isFocus = this.isFocus(type);
      const isBlur = this.isBlur(type);

      if (type == 'curency') {
        this.coin.val = '0.0000';
      }
      if (type == 'coin') {
        this.curency.val = '0.00';
      }
    },
    rmZero(type) {
      if (type == 'curency') {
        this.curency.val = '';
      }
      if (type == 'coin') {
        this.coin.val = '';
      }
    },
    onInput(type) {
      const value = this[type].val;
      //非数字情况
      if (!this.isNumber(value)) {
        this[type].val.replace(/[\d]+/, '');
        return;
      }
      if (this.isZero(type)) {
        this.setZero(type);
        return;
      }
      if (type == 'curency') {
        const coin = this.getCoinByCurency();
        this.coin.val = coin.toFixed(4);
      }
      if (type == 'coin') {
        const curency = this.getCurencyByCoin();
        this.curency.val = curency.toFixed(2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.df {
  display: flex;
}
.money-conversion-input {
  display: flex;
  justify-content: space-between;
  border: solid 1px #e9ecf4;
  height: 34px;
  font-size: 12px;
  border-radius: 2px;
  .select-all {
    width: 35px;
    color: #6f52c1;
    cursor: pointer;
    position: relative;
    z-index: 11;
  }
  input {
    width: 80px;
    text-indent: 20px;
    line-height: 16px;
    color: #6858e8;
    outline: none;
    border: none;
    &[value='0'] {
      color: #b1b0ce;
    }
  }
  em {
    font-style: normal;
    font-size: 12px;
    color: #080518;
    &:last-of-type {
      margin-right: 10px;
    }
  }
  i {
    cursor: pointer;
    color: #999;
  }

  .zhehe {
    padding: 0 4px;
  }
  .icon-zhehe {
    font-size: 12px;
  }
}
.money-conversion-input {
  .el-form-item {
    margin-bottom: 0;
    margin-left: 0 !important;
  }
  .transparent-input {
    input {
      // top: -1px;
      // top: 0;
      position: relative;
      width: 150px;
      text-indent: 10px;
      // border: solid 1px transparent !important;
      padding-right: 10px !important;
      font-size: 12px;
      color: #354989;
      box-shadow: none;
    }
    .el-input__suffix-inner {
      > span {
        font-size: 12px;
        &:first-of-type {
          color: #6aa0ff;
        }
      }
    }
  }
}
</style>
