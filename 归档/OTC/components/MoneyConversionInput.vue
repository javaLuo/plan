<template>
  <div>
    <div class="panel-exchange">
      <div class="hd df">
        <div class="lt"
             :class="{all: this.curency.btn.all.show}">
          <font @mousedown="onAllCny($event)">
            {{curency.btn.all.show ? Common.total:data.payAsset}}
          </font>
          <CInput :val="curency.value"
                  @blur="onCurrencyBlur()"
                  @focus="onCurrencyFocus()"
                  :onInput="onInputCurrency" />
        </div>
        <div class="ct">
          <i placeholder="0"
             class="iconfont icon-zhehe"></i>
        </div>
        <div class="rt"
             :class="{all: this.coin.btn.all.show}">
          <font @mousedown="onAllCoin($event)">
            {{coin.btn.all.show ? Common.total:data.tradeAsset}}
          </font>
          <CInput :val="coin.value"
                  @blur="onCoinBlur()"
                  @focus="onCoinFocus()"
                  :onInput="onInputCoin" />
        </div>
      </div>
      <div class="bd df jcsb">
        <div class="tip">{{curency.isMin ? Common.errLimitMin:''}}{{curency.isMax ? Common.errLimitMax:''}}{{curency.tip}}</div>
        <div class="tip">{{coin.isMin ? Common.errLimitMin:''}}{{coin.isMax ? Common.errLimitMax:''}}{{coin.tip}}</div>
      </div>
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
        tip: '',
        value: '',
        isMin: false,
        isMax: false,
        btn: {
          all: {
            show: false,
          },
        },
      },
      coin: {
        tip: '',
        value: '',
        isMin: false,
        isMax: false,
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
    conversionForm() {
      const curency = this.curency.value;
      const coin = this.coin.value;
      return {
        curency,
        coin,
      };
    },
    // 最大限额 剩余数量 * 单价 和 设置的limitMax看谁小
    compLimitMax() {
      if (!this.data) {
        return 0;
      }
      const howManyNow = Number(this.data.stock) * Number(this.data.unitPrice);
      if (Number.isFinite(howManyNow) && howManyNow < Number(this.data.limitMax)) {
        return Number(howManyNow.toFixed(2));
      }
      return Number(this.data.limitMax);
    },
    // 最小限额 最小限额不能超过最大限额
    compLimitMin() {
      if (!this.data) {
        return 0;
      }
      if (Number(this.compLimitMax) < Number(this.data.limitMin)) {
        return this.compLimitMax;
      }
      return Number(this.data.limitMin);
    },
  },
  watch: {},
  methods: {
    onAllCny() {
      if (!this.curency.btn.all.show) {
        return;
      }
      const maxAmount = this.compLimitMax; // this.data.limitMax;
      this.onInputCurrency({ target: { value: maxAmount.toFixed(2) } });
    },
    onAllCoin() {
      if (!this.coin.btn.all.show) {
        return;
      }
      const maxAmount = Number(this.compLimitMax) / Number(this.data.unitPrice);
      this.onInputCoin({ target: { value: maxAmount.toFixed(4) } });
    },
    //限制小数位数
    limitDecimal(v, p = 2) {
      const val = String(v);
      const arr = val.split('.');
      const valMain = arr[0];
      const valPoint = arr[1];
      if (!valPoint) {
        return v;
      }
      if (valPoint.length < p) {
        return v;
      }
      return `${valMain}.${valPoint.slice(0, p)}`;
    },
    onInputCurrency(e) {
      let val = e.target.value;
      const unitPrice = this.data.unitPrice;
      const maxAmount = this.compLimitMax;
      const minAmount = this.compLimitMin;

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

      //input value must be lt and eq 2
      val = this.limitDecimal(val);

      this.validateCurency(val);

      const amount = Number(val) / Number(unitPrice);

      // console.log(Number(val), Number(unitPrice), amount.toFixed(4));
      //被动计算方
      this.coin.value = amount.toFixed(4);

      this.validateCoin(this.coin.value);

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
      const maxAmount = Number(this.compLimitMax) / Number(unitPrice);
      const minAmount = Number(this.compLimitMin) / Number(unitPrice);

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

      //input value must be lt and eq 4
      val = this.limitDecimal(val, 4);

      this.validateCoin(val);

      const amount = Number(val) * Number(unitPrice);

      // console.log(Number(val), Number(unitPrice), amount.toFixed(4));

      //是否为被动计算
      this.curency.value = amount.toFixed(2);

      this.validateCurency(this.curency.value);

      this.coin.value = val;
    },
    validateCurency(val) {
      const maxAmount = this.compLimitMax;
      const minAmount = this.compLimitMin;
      const isMin = Number(val) < Number(minAmount).toFixed(2);
      const isMax = Number(val) > Number(maxAmount).toFixed(2);
      const isZero = Number(val) === 0;
      //不在合理范围内 warning lt min
      if (isMin) {
        this.curency.isMin = true;
        this.curency.isMax = false;
        this.curency.tip = `${Number(minAmount).toFixed(2)}${this.data.payAsset}`;
      } else {
        this.curency.isMin = false;
      }
      //不在合理范围内 warning gt max
      if (isMax) {
        this.curency.isMax = true;
        this.curency.isMin = false;
        this.curency.tip = `${Number(maxAmount).toFixed(2)}${this.data.payAsset}`;
      } else {
        this.curency.isMax = false;
      }

      if (!isMin && !isMax) {
        this.curency.isMax = false;
        this.curency.isMin = false;
        this.curency.tip = '';
      }

      if (isZero) {
        this.curency.isMax = false;
        this.curency.isMin = false;
        this.curency.tip = '';
      }
    },
    validateCoin(val) {
      const unitPrice = this.data.unitPrice;
      const maxAmount = Number(this.compLimitMax) / Number(unitPrice);
      const minAmount = Number(this.compLimitMin) / Number(unitPrice);
      const isMin = Number(val) < Number(minAmount.toFixed(4));
      const isMax = Number(val) > Number(maxAmount.toFixed(4));
      const isZero = Number(val) === 0;
      //不在合理范围内 warning lt min
      if (isMin) {
        this.coin.isMin = true;
        this.coin.isMax = false;
        this.coin.tip = `${Number(minAmount).toFixed(4)}${this.data.tradeAsset}`;
      }
      if (isMax) {
        this.coin.isMax = true;
        this.coin.isMin = false;
        this.coin.tip = `${Number(maxAmount).toFixed(4)}${this.data.tradeAsset}`;
      }
      if (!isMin && !isMax) {
        this.coin.isMin = false;
        this.coin.isMax = false;
        this.coin.tip = '';
      }
      if (isZero) {
        this.coin.isMin = false;
        this.coin.isMax = false;
        this.coin.tip = '';
      }
    },
    onCurrencyBlur() {
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
    isEmptyString(v) {
      return Object.prototype.toString.call(v) == '[object String]' && v.length <= 0;
    },
    isNumber(v) {
      const value = Number(v);
      if (Number.isNaN(value)) {
        return false;
      }
      return Object.prototype.toString.call(value) == '[object Number]';
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-exchange {
  position: relative;
}
.df {
  display: flex;
}
.jcsb {
  position: absolute;
  width: 100%;
  justify-content: space-between;
}
.panel-exchange {
  .hd {
    border: solid 1px #e9ecf4;
    input {
      border: 0;
      height: 30px;
      outline: none;
      padding: 0 5px;
      font-size: 14px;
      color: #606266;
    }
    .lt {
      position: relative;
      width: calc((100% - 30px) / 2);

      font {
        cursor: pointer;
        color: #c0c4cc;
        font-size: 12px;
        position: absolute;
        top: 8px;
        right: 5px;
      }

      &.all {
        font {
          color: #6aa0ff;
        }
      }
    }
    .ct {
      width: 30px;
      line-height: 30px;
      text-align: center;
      i {
        font-size: 12px;
        color: #999;
      }
    }
    .rt {
      position: relative;
      width: calc((100% - 30px) / 2);
      font {
        cursor: pointer;
        color: #c0c4cc;
        font-size: 12px;
        position: absolute;
        top: 8px;
        right: 5px;
      }
      &.all {
        font {
          color: #6aa0ff;
        }
      }
    }
  }
  .bd {
    margin-top: 2px;
    .tip {
      color: #f56c6c;
      font-size: 12px;
    }
  }
}
</style>
