<!-- 卖 组件 -->
<template>
  <div :class="`control-sell-box ${theme}`">
    <div class="head">
      <template v-if="!isLogin">
        <router-link :to="{ path: '/u/login'}">
          {{i18n.login}}
        </router-link>
        <span>{{i18n.or}}</span>
        <router-link :to="{ path: '/u/register'}">
          {{i18n.signup}}
        </router-link>
        <span>{{i18n.to}} {{i18n.ctrade}}</span>
      </template>
      <template v-if="isLogin">
        <span class="highlight">{{i18n.exchange.ava}} :</span>
        <span class="highlight">{{canUse | formatNumber(8)}} {{zi}}</span>
        <span class="highlight-space"></span>
        <router-link :to="{ path: '/assets', query: { coin: zi, type:'deposit'}}">
          {{i18n.exchange.deposit}}
        </router-link>

      </template>
    </div>
    <div class="middle">
      <div class="form-box">
        <div class="title">{{i18n.exchange.price}}</div>
        <div :class="['input-box',{'highlight': highlight1}]">
          <input type="text"
                 :value="sellSingle"
                 @input="onSingleInput"
                 @focus="onInputFocus(1)"
                 @blur="onInputBlur(1)" />
          <span>{{mu}}</span>
        </div>
      </div>
      <div class="form-box">
        <div class="title">{{i18n.exchange.amount}}</div>
        <div :class="['input-box',{'highlight': highlight2}]">
          <input type="text"
                 :value="sellCount"
                 @input="onCountInput"
                 @focus="onInputFocus(2)"
                 @blur="onInputBlur(2)" />
          <span>{{zi}}</span>
        </div>
      </div>
      <div class="slider-box">
        <Slider :disabled="!isLogin"
                :value="sellCountPercent"
                :theme="theme"
                @onChange="onBuyCountPercentChange" />
      </div>
      <div class="mount">{{i18n.exchange.totalPrice}}：{{howmuch}} {{mu}}</div>

      <el-button class="sumbit-btn"
                 @click="onSubmit"
                 :disabled="!isLogin"
                 :loading="loading">{{i18n.exchange.sell}} {{zi}}</el-button>

    </div>
  </div>
</template>

<script>
import Slider from '~/components/TradeComs/Slider';
import big from '~/utils/big';

export default {
  data() {
    return {
      buyPercent: 0, // 买的百分比
      sellSingle: '', // 单价输入框的值
      sellCount: '', // 数量输入框的值
      sellCountPercent: 0, // 滑动条的值 0～100
      highlight1: false, // input1 高亮
      highlight2: false, // input2 高亮
    };
  },
  props: {
    isLogin: { type: Boolean, default: false }, // 是否已登录
    theme: { type: String },
    canUseData: { type: Object }, // 用户的所有资产
    minAmountData: { type: Object, default: () => ({}) }, // 所有交易对到最小交易量数据
    i18n: { type: Object }, // 语言包
    mu: { type: String }, // 母币
    zi: { type: String }, // 子币
    loading: { type: Boolean, default: false }, // 是否正在提交
    singleValue: {
      type: Object,
      default: () => ({
        v: '',
      }),
    }, // 从父级传来的单价框的值
  },
  components: {
    Slider,
  },
  /** ==== 监听 ==== **/
  watch: {
    sellCount(newV) {
      // 数量框的值被改变，需要重新计算滑动条的值
      const v = Number(newV) || 0;
      const max = !this.canUse ? 0 : v / this.canUse;
      this.sellCountPercent = !this.canUse ? 0 : Math.round((v / this.canUse) * 100);
    },

    // 资产数据变了，数据全部清空
    canUseData() {
      // this.sellSingle = '';
      this.sellCount = '';
    },

    // 交易对变了，数据全部清空
    mu() {
      this.buySingle = '';
      this.buyCount = '';
    },
    zi() {
      this.sellSingle = '';
      this.sellCount = '';
    },

    // 父级传来的单价框的值改变时，设置成和父级一样
    singleValue(newV) {
      this.sellSingle = this.checkSingle(newV.v);
      this.highlight1 = true;
      setTimeout(() => {
        this.highlight1 = false;
      }, 300);
    },
  },
  filters: {
    formatNumber(num, p = 8) {
      if (isNaN(Number(num))) {
        return 0;
      }
      const str = String(num).split('.');
      if (str.length > 1) {
        return `${str[0]}.${str[1].slice(0, p).padEnd(p, '0')}`;
      }
      return Number(str[0]).toFixed(p);
    },
  },
  /** ==== 计算属性 ==== **/
  computed: {
    // 最终需支付的母币数量
    howmuch() {
      let v = big.multi(this.sellCount, this.sellSingle);
      v = v === 'NaN' ? '0.00000000' : big.toFixed8(v);
      return v;
    },
    // 有多少可用的子币
    canUse() {
      const d = this.canUseData[this.zi];
      return d ? Number(big.toFixedPoint(d.ava, 8)) : 0;
    },
    // 当前交易对的最小交易量
    minAmount() {
      const obj = this.minAmountData[`${this.zi}${this.mu}`];
      if (!obj) {
        return 0;
      }
      return Number(obj.min);
    },
    // 当前交易对支持的最多几个小数点
    ziPoint() {
      const obj = this.minAmountData[`${this.zi}${this.mu}`];
      if (!obj) {
        return 0;
      }
      return Number(obj.point);
    },
    muPoint() {
      const obj = this.minAmountData[`${this.zi}${this.mu}`];
      if (!obj || !obj.price) {
        return 0;
      }
      return Number(obj.price.point);
    },
  },

  /** ==== 方法们 ==== **/
  methods: {
    onSubmit() {
      // 未登录
      if (!this.isLogin) {
        return;
      }
      // 单价无效
      if (!Number(this.sellSingle)) {
        this.$message.error(`${this.i18n.exchange.msg.error.price}`);
        return;
      }
      // 数量无效
      if (!Number(this.sellCount)) {
        this.$message.error(`${this.i18n.exchange.msg.error.num}`);
        return;
      }
      // 购买的数量 < 最小交易量
      if (Number(this.sellCount) < Number(this.minAmount)) {
        this.$message.error(this.i18n.exchange.msg.error.min.replace(/\$\$/, this.minAmount));
        return;
      }
      // 总价格 < 0.00000001
      if (big.isLt(this.howmuch, 0.00000001)) {
        this.$message.error(`${this.i18n.exchange.msg.error.minTotalPrice}`);
        return;
      }

      this.$emit('onSubmit', this.sellSingle, this.sellCount, this.howmuch);
    },

    // input获得焦点
    onInputFocus(type) {
      if (type === 1) {
        this.highlight1 = true;
      } else if (type === 2) {
        this.highlight2 = true;
      }
    },
    // input失去焦点
    onInputBlur(type) {
      if (type === 1) {
        this.highlight1 = false;
      } else if (type === 2) {
        this.highlight2 = false;
      }
    },

    // 滑动条的值改变时触发
    onBuyCountPercentChange(res) {
      // 单价框没值时，滑不动
      if (!Number(this.sellSingle)) {
        this.sellCountPercent = 0;
        return;
      }

      // 可用币数量为0时也滑不动
      if (!this.canUse) {
        this.sellCountPercent = 0;
        return;
      }

      // 滑动条的值同时影响数量框的值，这里没有写到watch中去，因为数量要影响滑动，滑动又影响数量，就循环了
      const percent = Number(res) || 0;
      let v = Number(big.div(big.multi(this.canUse, percent), 100)).toFixed(12);
      v = v.replace(/0+$/g, '').replace(/\.$/, ''); // 去掉末尾多余的0

      // 不超过N个小数点
      let str = `${v}`.split('.');
      if (str[1] && str[1].length > this.ziPoint) {
        v = Number(`${str[0]}.${str[1].substr(0, this.ziPoint)}`);
      }
      this.sellCount = v;
      this.sellCountPercent = res;
    },
    /**
     * 用户正在输入单价
     * 1. 大于0
     * 2. 最多8位小数点
     * 3. 最大值99亿
     *  */
    onSingleInput(e) {
      const v = this.checkSingle(e.target.value);
      this.sellSingle = v;
      e.target.value = v;
    },

    // 用于检查单价框的内容
    checkSingle(res) {
      let v = String(res).trim();
      // 输入了非数字
      if (isNaN(Number(v))) {
        v = this.sellSingle;
      }

      // 不超过n个小数点
      let str = `${v}`.split('.');
      if (str[1] && str[1].length > this.muPoint) {
        v = `${str[0]}.${str[1].substr(0, this.muPoint)}`;
      }

      // 最小值
      if (Number(v) < 0) {
        v = 0;
      }

      // 最大值，10个9
      if (Number(v) > 9999999999) {
        v = 9999999999;
      }

      return v;
    },

    /**
     * 用户正在输入数量
     * 1.大于0
     * 2.最多几位小数点根据minAmountData中对应的数据
     * 3.最大数量： 数量*单价 不能超过 用户拥有的该母币总资产
     */
    onCountInput(e) {
      let v = this.checkCountInput(e.target.value, this.sellSingle, this.canUse);

      this.sellCount = v;
      e.target.value = v;
    },

    /**
     * 用于检测数量框的内容
     * @param res 数量框输入的值
     * @param single 单价框目前的值
     * @param max 用户拥有的子币数量
     */
    checkCountInput(res, single, max) {
      // 如果单价框没有值，则不能输入
      if (this.isLogin) {
        if (single === '') {
          return '';
        } else if (Number(single) === 0) {
          return 0;
        }
      }

      let v = String(res).trim();
      // 输入了非数字 那值还原到上一次输入的值
      if (isNaN(Number(v))) {
        v = this.sellCount;
      }

      // 不超过用户拥有的子币
      if (this.isLogin && Number(v) > max) {
        v = max;
        v = Number(v).toFixed(12); // 防止科学计数法出现
        v = v.replace(/0+$/g, '').replace(/\.$/, '');
      }

      // 不超过N个小数点
      let str = `${v}`.split('.');
      if (str[1] && str[1].length > this.ziPoint) {
        v = `${str[0]}.${str[1].substr(0, this.ziPoint)}`;
      }

      return v;
    },
  },
};
</script>

<style lang="scss">
.control-sell-box {
  --backgroundColor: #fff;
  --borderColor: #f5f6f9;
  --color1: #222;
  --inputBackColor: #f8f9ff;
  --outColor: #fff;
  --inputColor: #354989;
  &.dark {
    --backgroundColor: #191d35;
    --borderColor: #262a3e;
    --color1: #7d86ac;
    --inputBackColor: #1e223d;
    --outColor: #1e223d;
    --inputColor: #c7cce6;
  }
  width: 50%;
  background-color: var(--backgroundColor);
  padding: 0 20px;
  .head {
    display: flex;
    height: 49px;
    align-items: center;
    border-bottom: solid 1px var(--borderColor);
    font-size: 14px;
    color: var(--color1);
    font-weight: 600;
    a {
      color: #5693ff;
      margin-right: 10px;
      &:hover {
        color: #67a4ff;
      }
    }
    span {
      margin-right: 8px;
    }
    .highlight {
      color: var(--inputColor);
      font-weight: normal;
    }
    .highlight-space {
      flex: 1;
      & + a {
        margin-right: 0;
        font-weight: normal;
      }
    }
  }
  .middle {
    .form-box {
      margin-top: 20px;
      .title {
        color: #7d86ac;
      }
      .input-box {
        height: 40px;
        background-color: var(--inputBackColor);
        transition: border 200ms;
        margin-top: 5px;
        display: flex;
        align-items: center;
        font-size: 16px;
        border: solid 1px var(--outColor);
        border-radius: 2px;
        input {
          border: none;
          height: 40px;
          color: var(--inputColor);
          flex: auto;
          background-color: transparent;
          outline: none;
          padding: 0 10px;
          font-size: 16px;
          caret-color: var(--inputColor);
        }
        span {
          flex: none;
          padding-right: 10px;
          color: #7d86ac;
        }
        &.highlight {
          border: solid 1px #9db8e7;
        }
      }
    }
    .slider-box {
      padding: 30px 0;
    }
    .mount {
      font-size: 16px;
      color: var(--inputColor);
      word-break: break-all;
    }
    .sumbit-btn {
      width: 100%;
      height: 40px;
      border: none;
      margin-top: 20px;
      opacity: 0.84;
      background-color: #df543a;
      color: #fff;
      transition: all 200ms;
      font-size: 16px;
      outline: none;
      border-radius: 0;
      &:disabled {
        opacity: 0.4;
      }
      &:hover {
        background-color: #ef654b;
      }
      &:active {
        background-color: #ff765c;
      }
    }
  }
}
</style>