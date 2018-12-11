<!-- 历史委托 -->
<template>
  <div :class="`order-history-com ${theme}`">
    <!-- 头部 -->
    <div class="head">
      <ul class="tabs-box">
        <li @click="tabChange($event,0)"
            :class="{checked: tabsChose === 0}">{{i18n.delegateCol['Open Orders']}}</li>
        <li @click="tabChange($event,1)"
            :class="{checked: tabsChose === 1}">{{i18n.delegateCol['Order History']}}</li>
        <li class="line"
            :style="{left: `${lineLeft}px`, width: `${lineWidth}px`}"></li>
      </ul>

      <ul class="filter-box">
        <li :class="{checked: filterChose === 'all'}"
            @click="onFilterChose('all')">{{i18n.delegateCol.All}}</li>
        <li :class="{checked: filterChose === 'buy'}"
            @click="onFilterChose('buy')">{{i18n.delegateCol.Buy}}</li>
        <li :class="{checked: filterChose === 'sell'}"
            @click="onFilterChose('sell')">{{i18n.delegateCol.Sell}}</li>
        <li :class="`line check-${filterChose}`"></li>
      </ul>
    </div>

    <!-- 数据表格 -->
    <div class="table-box"
         v-loading="loading">
      <ul class="table-th">
        <li>{{i18n.delegateCol.date}}</li>
        <li>{{i18n.delegateCol.tradePair}}</li>
        <li>{{i18n.delegateCol.type}}</li>
        <li>{{i18n.delegateCol.price}}</li>
        <li>{{i18n.delegateCol.amount}}</li>
        <li>{{i18n.delegateCol.executed}}</li>
        <li>{{i18n.delegateCol.operate}}</li>
      </ul>
      <div class="table-list-box"
           data-scrollbar>
        <ul class="table-list">
          <li v-for="(item, index) in showData"
              :key="index">
            <div>{{item.date | dubaiDate('YYYY-MM-DD HH:mm:ss')}}</div>
            <div>{{item.symbol}}</div>
            <div :class="`${item.type === 'buy' ? 'buy' : 'sell'}`">{{i18n.delegateCol[item.type]}}</div>
            <div>{{item.price | formatNumber(muPoint)}}</div>
            <div>{{item.amount | formatNumber(ziPoint)}}</div>
            <div>{{item.executed}}</div>
            <div>
              <button :disabled="item.loading"
                      :class="['btn',{loading: item.loading}]"
                      v-if="tabsChose === 0"
                      @click="onCancel(item.id, item.symbol)">{{i18n.delegateCol.revoke}}</button>
            </div>
          </li>
          <li class="no-data"
              v-show="!showData.length">
            <img v-if="theme==='dark'"
                 src='~/assets/images/nodata-dark.png'
                 alt="nodata" />
            <img v-else
                 src="~/assets/images/nodata-light.png"
                 alt="nodata" />
            <div>
              {{i18n.delegateCol.nodata}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lineLeft: 0, // tabs底线偏移
      lineWidth: 49,
    };
  },
  props: {
    i18n: { type: Object },
    theme: { type: String },
    loading: { type: Boolean },
    sourceData: { type: Object },
    tabsChose: { type: Number, default: 0 }, // 最新/历史
    filterChose: { type: String, default: 'all' }, // 所有all/买buy/卖sell
    minAmountData: { type: Object, default: () => {} },
    zi: { type: String },
    mu: { type: String },
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
  /** ==== 监听 ==== **/
  watch: {
    i18n() {
      this.$nextTick(() => {
        this.resetLine();
      });
    },
    tabsChose() {
      this.$nextTick(() => {
        this.resetLine();
      });
    },
  },
  /** ==== 生命周期 ==== **/
  mounted() {
    this.resetLine();
  },
  /** ==== 计算属性 ==== **/
  computed: {
    showData() {
      if (this.tabsChose === 0) {
        return this.sourceData.activeOrders;
      } else if (this.tabsChose === 1) {
        return this.sourceData.historyOrders;
      } else {
        return [];
      }
    },
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
      if (!obj || !obj.price) {
        return 8; // 默认8个
      }

      return Number(obj.price.point);
    },
  },

  /** ==== 方法们 ==== **/
  methods: {
    /** 头部tab切换 **/
    tabChange(e, type) {
      if (type !== this.tabsChose) {
        this.$emit('onChange', type, this.filterChose);
      }
    },

    /** 所有/买/卖 切换 **/
    onFilterChose(type) {
      if (type !== this.filterChose) {
        this.$emit('onChange', this.tabsChose, type);
      }
    },

    /** 初始化线条 **/
    resetLine() {
      const dom = document.querySelector('.order-history-com .head .tabs-box .checked');
      if (dom) {
        this.lineLeft = dom.offsetLeft;
        this.lineWidth = dom.offsetWidth;
      }
    },

    /** 用户点击了撤单 **/
    onCancel(id, symbol) {
      const params = {
        type: 'withdraw',
        id,
        symbol,
      };
      const one = this.sourceData.activeOrders.find(item => item.id === id);
      if (one) {
        one.loading = true;
      }
      this.$emit('onCancel', params, this.onCancelCallBack);
    },

    /** 用户点击了回调 **/
    onCancelCallBack(res) {
      if (res.code !== 200) {
        const one = this.sourceData.activeOrders.find(item => item.id === id);
        if (one) {
          one.loading = false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.order-history-com {
  --backgroundColor: #fff;
  --borderColor: #eee;
  --textColor: #7d86ac;
  --littleColor: #7d86ac;
  --filterBackColor: #f8f9ff;
  --filterColor: #7d86ac;
  --filterCheckColor: #f0f0f0;
  --filterLineColor: #5693ff;
  --btnColor: #67a4ff;
  --btnBorderColor: #67a4ff;
  --btnBackColor: #fff;
  --noDataColor: #d3d8e6;
  &.dark {
    --backgroundColor: #191d35;
    --borderColor: #090d20;
    --textColor: #c7cce6;
    --littleColor: #666a7f;
    --filterBackColor: #191d35;
    --filterColor: #666a7f;
    --filterCheckColor: #477bf7;
    --filterLineColor: transparent;
    --btnColor: #ced1e3;
    --btnBorderColor: #477bf7;
    --btnBackColor: #477bf7;
    --noDataColor: #30344e;

    .el-loading-mask {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  border-radius: 4px;
  overflow: hidden;
  .head {
    height: 50px;
    background-color: var(--backgroundColor);
    box-shadow: 0 0 12px var(--borderColor);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tabs-box {
      display: flex;
      flex: none;
      position: relative;
      height: 48px;
      padding: 0 10px;
      & > li {
        flex: none;
        padding: 16px 10px;
        display: flex;
        align-items: center;
        color: var(--textColor);
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          color: #5693ff;
        }
        &.checked {
          color: #5693ff;
        }
      }
      & > .line {
        position: absolute;
        height: 2px;
        width: 30px;
        padding: 0;
        left: 0;
        bottom: -2px;
        transition: all 300ms;
        &:after {
          content: '';
          position: absolute;
          width: 80%;
          left: 10%;
          height: 100%;
          background-color: #5693ff;
        }
      }
    }
    .filter-box {
      display: flex;
      color: var(--filterColor);
      margin-right: 20px;
      background-color: var(--filterBackColor);
      border-radius: 3px;
      overflow: hidden;
      font-size: 12px;
      position: relative;
      & > li {
        width: 48px;
        padding: 0 2px;
        text-align: center;
        z-index: 2;
        transition: all 300ms;
        cursor: pointer;
        &.checked {
          color: var(--filterCheckColor);
        }
      }
      .line {
        position: absolute;
        top: 0;
        width: 48px;
        height: 100%;
        background-color: var(--filterLineColor);

        z-index: 1;
        &.check-all {
          left: 0;
        }
        &.check-buy {
          left: 48px;
        }
        &.check-sell {
          left: 96px;
        }
      }
    }
  }
  .table-box {
    padding: 0 20px;
    font-size: 12px;
    background-color: var(--backgroundColor);
    .table-th {
      height: 40px;
      display: flex;
      align-items: center;
      color: var(--littleColor);
      & > li {
        flex: none;
        width: 16%;
        &:nth-child(3) {
          width: 12%;
        }
        &:nth-child(6) {
          width: 12%;
        }
        &:last-child {
          width: 12%;
          text-align: right;
        }
      }
    }
    .table-list-box {
      height: 200px;
      overflow: hidden;
    }
    .table-list {
      & > li {
        display: flex;
        height: 26px;
        align-items: center;
        color: var(--textColor);
        & > div {
          flex: none;
          width: 16%;

          &:nth-child(3) {
            width: 12%;
          }
          &:nth-child(6) {
            width: 12%;
          }
          &:last-child {
            width: 12%;
            text-align: right;
          }
          &.buy {
            color: #29a76c;
          }
          &.sell {
            color: #df543a;
          }
          .btn {
            min-width: 68px;
            text-align: center;
            color: var(--btnColor);
            border: solid 1px var(--btnBorderColor);
            background-color: var(--btnBackColor);
            border-radius: 3px;
            cursor: pointer;
            transition: all 200ms;
            overflow: hidden;
            &:hover {
              background-color: #67a4ff;
              color: #fff;
            }
            &.loading {
              opacity: 0.8;
              color: #ccc;
              background-color: #fff;
              border-color: #ccc;
            }
          }
        }
        &.no-data {
          height: 200px;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          color: var(--noDataColor) !important;
          font-size: 12px;
          img {
            height: 64px;
            width: auto;
            margin-bottom: 5px;
          }
          div {
            text-align: center;
          }
        }
      }
    }
  }
  .el-loading-mask {
    min-height: 50px;
  }
}
</style>