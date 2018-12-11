<!-- 交易记录 -->
<template>
  <div :class="`deal-history-box ${theme}`">
    <ul class="head">
      <li>{{i18n.trade.date}}</li>
      <li>{{i18n.trade.type}}</li>
      <li>{{i18n.trade.price}}({{mu}})</li>
      <li>{{i18n.trade.amount}}({{zi}})</li>
    </ul>
    <div :class="['data-box',{'hideback': historyData.length}]"
         data-scrollbar>
      <ul class="bone"
          v-show="!historyData.length">
        <li v-for="n in 12"
            :key="n">
          <div class="time">---</div>
          <div>---</div>
          <div>---</div>
          <div>---</div>
        </li>
      </ul>
      <transition-group name="list"
                        tag="ul">

        <li v-for="(item) in historyData"
            class="list-item"
            :key="`${item.date}${item.price}${item.amount}`">
          <div class="time">{{item.date | dubaiDate('HH:mm:ss')}}</div>
          <div :class="['buysell', {buy: item.side === 'BUY'}]">{{item.side ? (item.side === 'BUY' ? i18n.trade.BUY : i18n.trade.SELL) : '---'}}</div>
          <div>{{item.price | formatNumber(muPoint)}}</div>
          <div>{{item.amount | formatNumber(ziPoint)}}</div>
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script>
import Scrollbar from 'smooth-scrollbar';
export default {
  data() {
    return {
      historyData: [],
    };
  },
  props: {
    i18n: { type: Object, required: true },
    mu: { type: String },
    zi: { type: String },
    theme: { type: String },
    sourceData: { type: [Array, Object], required: true },
    minAmountData: { type: Object, default: () => {} },
  },
  filters: {
    formatNumber(num, p = 2) {
      if (isNaN(Number(num))) {
        return '---';
      }
      const str = String(num).split('.');
      if (str.length > 1) {
        return `${str[0]}.${str[1].slice(0, p).padEnd(p, '0')}`;
      }
      return Number(str[0]).toFixed(p);
    },
  },
  computed: {
    // 交易对
    symbol() {
      return `${this.zi}${this.mu}`;
    },
    // 当前交易对支持的最多几个小数点
    ziPoint() {
      const obj = this.minAmountData[this.symbol];
      if (!obj) {
        return 8; // 默认8个
      }
      return Number(obj.point);
    },
    muPoint() {
      const obj = this.minAmountData[this.symbol];
      if (!obj) {
        return 8; // 默认8个
      }
      return Number(obj.price.point);
    },
  },
  watch: {
    // 这么做是为了动画
    sourceData(newV) {
      this.pushData(newV);
    },
    // 交易对变了，清空旧数据
    mu() {
      this.historyData = [];
    },
    zi() {
      this.historyData = [];
    },
  },
  mounted() {
    Scrollbar.initAll();
  },
  methods: {
    pushData(newV) {
      const temp = Array.isArray(newV) ? [...newV] : [newV];
      temp.reverse();

      for (let i = 0; i < temp.length; i++) {
        if (this.historyData.findIndex(item => `${item.date}${item.price}${item.amount}` === `${temp[i].date}${temp[i].price}${temp[i].amount}`) === -1) {
          this.historyData.unshift(temp[i]);
          if (this.historyData.length > 50) {
            this.historyData.pop();
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.deal-history-box {
  --backgroundColor: #fff;
  --textColor: #7d86ac;
  --littleColor: #7d86ac;
  &.dark {
    --backgroundColor: #191d35;
    --textColor: #c7cce6;
    --littleColor: #666a7f;
  }
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--backgroundColor);
  .head {
    display: flex;
    height: 48px;
    color: var(--littleColor);
    font-size: 12px;
    text-align: right;
    padding: 0 20px;
    align-items: center;
    & > li:nth-child(1) {
      width: 20%;
      text-align: left;
    }
    & > li:nth-child(2) {
      width: 10%;
    }
    & > li:nth-child(n + 3) {
      width: 35%;
    }
  }
  .data-box {
    height: calc(100% - 48px);
    overflow: hidden;
    position: relative;
    background-color: var(--backgroundColor);
    .bone {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: -1;
    }
    &.hideback {
      background-image: none;
    }
    .list-item {
      transition: opacity 400ms, transform 400ms;
    }
    .list-enter-active,
    .list-leave-active {
      transition: opacity 400ms, transform 400ms;
    }
    .list-enter,
    .list-leave-to {
      opacity: 0;
      transform: translateX(-8px);
    }
    .scroll-content > ul > li {
      font-size: 12px;
      display: flex;
      text-align: right;
      color: var(--textColor);
      background-color: var(--backgroundColor);
      height: 29px;
      align-items: center;
      padding: 0 20px;

      .time {
        text-align: left;
        width: 20%;
        flex: none;
        color: var(--littleColor);
      }
      .buysell {
        color: #df543a;
        width: 10%;
        flex: none;
      }
      .buy {
        color: #29a76c;
        flex: none;
      }
      & > div:nth-child(n + 3) {
        width: 35%;
        flex: none;
      }
    }
  }
}
</style>