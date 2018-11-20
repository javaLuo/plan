<template>
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
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import Utils from '~/utils';
export default {
  data() {
    return {
      init: true,
      curency: {
        isFocus: false,
        val: '',
      },
      coin: {
        isFocus: false,
        val: '',
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
      const max = Number(Utils.toFixed8(this.getMaxCoin()));
      const val = Number(this.coin.val);
      return this.coin.val > max;
    },
    isMinCoin() {
      const min = Number(Utils.toFixed8(this.getMinCoin()));
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
          callback(new Error(this.Common.errLimitMin + `${Utils.toFixed8(this.getMinCoin())}${this.data.tradeAsset}`));
          return;
        }
        if (this.isMaxCoin) {
          callback(new Error(this.Common.errLimitMax + `${Utils.toFixed8(this.getMaxCoin())}${this.data.tradeAsset}`));
          return;
        }
      }
    },
    onAll(type) {
      this.coin.val = Utils.toFixed8(Number(this.data.stock));
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
      //	console.log('传进来了吗：', this.data, this.data.unitPrice);
      const coin = Number(Utils.div(Number(this.curency.val), Number(this.data.unitPrice)));
      return coin;
    },
    //设置为0的情况
    setZero(type) {
      const isFocus = this.isFocus(type);
      const isBlur = this.isBlur(type);

      if (type == 'curency') {
        this.coin.val = '0.00000000';
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
      // console.log('type:', type);
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
      // console.log('什么数字：', value);
      if (type == 'curency') {
        const coin = this.getCoinByCurency();
        this.coin.val = Utils.toFixed8(coin);
        // console.log(coin.toFixed(8),888888);
        // console.log(Utils.toFixed8(coin),999999);
      }
      if (type == 'coin') {
        const curency = this.getCurencyByCoin();
        this.curency.val = Utils.toFixed8(curency);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
<style lang="scss">
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
