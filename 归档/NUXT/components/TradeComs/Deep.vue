<!-- 深度数据 -->
<template>
  <div :class="`deep-box ${theme}`">
    <!-- 上半部 -->
    <div class="data-box ask">
      <ul class="title">
        <li>{{i18n.orderCol.price}}({{mu}})</li>
        <li>{{i18n.orderCol.amount}}({{zi}})</li>
        <li>{{i18n.orderCol.total}}({{zi}})</li>
      </ul>
      <div class="data-scroll"
           id="scroll-buy">
        <!-- 骨架 -->
        <ul :class="['data bone',{'show': askFirst && bidFirst}]">
          <li v-for="n in 12"
              :key="n">
            <span>---</span>
            <span>---</span>
            <span>---</span>
          </li>
        </ul>
        <ul :class="['data',{'show': !askFirst}]">
          <li v-for="(item, index) in askDataFilter"
              :key="index"
              @click="onDataClick(item)">
            <span :title="item.ticks">{{item.ticks|formatNumber(muPoint)}}</span>
            <span :title="item.totalLots">{{item.totalLots|formatNumber(ziPoint)}}</span>
            <span :title="item.addTotalLots">{{item.addTotalLots|formatNumber(ziPoint)}}</span>
            <div class="percent"
                 :style="`width:${Math.floor(item.percent * 100)}%`"></div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 中间 -->
    <div class="middle-box">
      <span>{{lastPrice | formatNumber(muPoint)}}</span>
      <span :class="[ 'num',{green: Number(lastChange)>0 || isNaN(Number(lastChange))}, {red: Number(lastChange)<0}]">{{lastChange>0 ? '+' : ''}}{{lastChange | formatNumber(2) | havepercent}}</span>
    </div>
    <!-- 下半部 -->
    <div class="data-box bid">
      <div class="data-scroll"
           data-scrollbar>
        <ul :class="['data bone',{'show': bidFirst && askFirst}]">
          <li v-for="n in 12"
              :key="n">
            <span>---</span>
            <span>---</span>
            <span>---</span>
          </li>
        </ul>
        <ul :class="['data', {'show': !bidFirst}]">
          <li v-for="(item, index) in bidDataFilter"
              :key="index"
              @click="onDataClick(item)">
            <span :title="item.ticks">{{item.ticks|formatNumber(muPoint)}}</span>
            <span :title="item.totalLots">{{item.totalLots|formatNumber(ziPoint)}}</span>
            <span :title="item.addTotalLots">{{item.addTotalLots|formatNumber(ziPoint)}}</span>
            <div class="percent"
                 :style="`width:${Math.floor(item.percent * 100)}%`"></div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 控制区 -->
    <div class="control-box">
      <div>
        <span>{{i18n.orderCol.point}}</span>
        <el-select :value="accuracy"
                   size="mini"
                   :class="['accuracy-select', `length${accuracy}`]"
                   :popper-class="theme"
                   @change="onAccuracyChange">
          <el-option v-for="(item,index) in depthChoseData"
                     :key="index"
                     :label="item.name"
                     :value="item.val">
            <span style="float: right">{{ item.name }}</span>
          </el-option>
        </el-select>
      </div>
      <!-- <div>
        <span>{{i18n.orderCol.shift}}</span>
        <el-select v-model="howmany"
                   size="mini"
                   class="howmany-select"
                   :popper-class="theme">
          <el-option v-for="(item,index) in howmanyData"
                     :key="index"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div> -->
    </div>
  </div>
</template>
  
  <script>
let scrollBuy;
import Scrollbar from 'smooth-scrollbar';
export default {
  data() {
    return {
      // 档位所需数据
      howmanyData: [{ label: '10', value: 10 }, { label: '15', value: 15 }, { label: '20', value: 20 }, { label: '30', value: 30 }, { label: '50', value: 50 }],
      howmany: 50,
      askFirst: true, // 是否是第1次加载买家数据，第1次需把滚动条滚动到底部
      bidFirst: true,
    };
  },
  props: {
    theme: { type: String, default: '' },
    i18n: { type: Object, required: true },
    askData: { type: Array }, // sell 上方数据
    bidData: { type: Array }, // buy 下方数据
    lastPrice: { type: [String, Number], default: 0 }, // 中间 最终价格
    lastChange: { type: [String, Number], default: 0 }, // 中间 最终涨幅比率
    depthChoseData: { type: Array, default: () => [{ name: '0.00000000', val: '8' }] }, // 底部 深度精度选择的选项们
    accuracy: { type: String, default: '8' }, // 深度精度选择的哪一个
    minAmountData: { type: Object, default: () => {} },
    zi: { type: String },
    mu: { type: String },
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
    havepercent(num) {
      return isNaN(Number(num)) ? '---' : `${num}%`;
    },
  },
  computed: {
    // 上半边的数据
    askDataFilter() {
      const temp = [...this.askData];
      return temp
        .reverse()
        .slice(0, this.howmany)
        .reverse();
    },
    // 下半边的数据
    bidDataFilter() {
      return this.bidData.slice(0, this.howmany);
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
  watch: {
    askData(newV) {
      if (newV && newV.length && this.askFirst) {
        this.askFirst = false;
        setTimeout(() => {
          scrollBuy.scrollTo(0, scrollBuy.limit.y);
        }, 500);
      }
    },
    bidData(newV) {
      if (newV && newV.length && this.bidFirst) {
        this.bidFirst = false;
      }
    },
    // 所选择的档位变化时，需要将滚动条滚动到底部
    howmany() {
      setTimeout(() => {
        scrollBuy.scrollTo(0, scrollBuy.limit.y);
      }, 500);
    },
    // 交易对变化
    symbol() {
      this.askFirst = true; // 为了让滚动条继续在最下面
      this.bidFirst = true;
    },
  },
  mounted() {
    scrollBuy = Scrollbar.init(document.getElementById('scroll-buy'));
    Scrollbar.initAll();
  },
  methods: {
    onAccuracyChange(v) {
      // this.askFirst = true; // 为了让滚动条继续在最下面
      // this.bidFirst = true;
      this.$emit('onAccuracyChange', v);
    },
    // 用户点击某一条数据
    onDataClick(item) {
      this.$emit('onDataClick', item.ticks);
    },
  },
};
</script>

<style lang="scss" scoped>
.deep-box {
  --backgroundColor: #fff;
  --backgroundColorHover: #f8f9ff;
  --textColor: #354989;
  --textColor2: #354989;
  --littleColor: #354989;
  --colorGreen: #29a76c;
  --backgroundColorMiddle: #f7f5fd;
  --boneColor: #ccc;
  &.dark {
    --backgroundColor: #191d35;
    --backgroundColorHover: #1e223d;
    --textColor: #f0f0f0;
    --textColor2: #c7cce6;
    --littleColor: #666a7f;
    --backgroundColorMiddle: #1e223d;
    --boneColor: #666;
  }

  background-color: var(--backgroundColor);
  color: var(--textColor);
  border-radius: 4px;
  overflow: hidden;
  .data-box {
    overflow: hidden;
    &.ask {
      .title {
        height: 50px;
        line-height: 50px;
        padding: 0 3%;
        background-color: var(--backgroundColor);
        display: flex;
        & > li {
          flex: 1;
          color: var(--littleColor);
          &:first-child {
            text-align: left;
          }
          &:nth-child(2) {
            text-align: center;
          }
          &:nth-child(3) {
            text-align: right;
          }
        }
      }
      .data-scroll {
        width: 100%;
        height: 365px;
        overflow: hidden;
        background-color: var(--backgroundColor);
        background-size: 50% auto;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .data {
        width: 100%;
        min-height: 365px;
        height: 365px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        transition: opacity 300ms, transform 300ms;
        opacity: 0;
        transform: translateX(-8px);
        pointer-events: none;
        background-color: var(--backgroundColor);
        &.bone {
          position: absolute;
          bottom: 0;
          left: 0;
        }
        &.show {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          height: auto;
        }
        & > li {
          display: flex;
          height: 30px;
          align-items: center;
          position: relative;
          margin: 0 3%;
          cursor: pointer;
          transition: background-color 200ms;
          &:hover {
            background-color: var(--backgroundColorHover);
          }
          .percent {
            position: absolute;
            top: 5%;
            right: 0;
            height: 90%;
            border-radius: 2px;
            background-color: rgba(223, 84, 58, 0.25);
            transition: width 200ms;
          }
          & > span {
            flex: 1;
            font-size: 12px;
            color: var(--textColor2);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:first-child {
              text-align: left;
              color: #df543a;
              padding-left: 4px;
            }
            &:nth-child(2) {
              text-align: center;
            }
            &:nth-child(3) {
              text-align: right;
              padding-right: 4px;
            }
          }
        }
      }
    }
    &.bid {
      .data-scroll {
        width: 100%;
        height: 365px;
        overflow: hidden;
        background-color: var(--backgroundColor);
        background-size: 50% auto;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .data {
        width: 100%;
        min-height: 365px;
        height: 365px;
        transition: opacity 300ms, transform 300ms;
        opacity: 0;
        transform: translateX(-8px);
        pointer-events: none;
        background-color: var(--backgroundColor);
        &.bone {
          position: absolute;
          top: 0;
          left: 0;
        }
        &.show {
          opacity: 1;
          transform: translateX(0);
          height: auto;
          pointer-events: auto;
        }
        & > li {
          display: flex;
          height: 30px;
          align-items: center;
          position: relative;
          cursor: pointer;
          margin: 0 3%;
          transition: background-color 200ms;
          &:hover {
            background-color: var(--backgroundColorHover);
          }
          .percent {
            position: absolute;
            top: 5%;
            right: 0;
            height: 90%;
            border-radius: 2px;
            background-color: rgba(41, 167, 108, 0.25);
            transition: width 200ms;
          }
          & > span {
            flex: 1;
            font-size: 12px;
            color: var(--textColor2);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:first-child {
              text-align: left;
              color: var(--colorGreen);
              padding-left: 4px;
            }
            &:nth-child(2) {
              text-align: center;
            }
            &:nth-child(3) {
              text-align: right;
              padding-right: 4px;
            }
          }
        }
      }
    }
  }
  .middle-box {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--backgroundColorMiddle);
    padding: 10px;
    margin: 9px 10px;
    font-size: 16px;
    font-weight: 600;
    .num {
      color: rgb(220, 220, 220);
    }
    .green {
      color: var(--colorGreen);
    }
    .red {
      color: #df543a;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }
}
</style>

<style lang="scss">
.deep-box {
  .control-box {
    color: #6aa0ff;
    padding: 6px 10px;
    display: flex;
    justify-content: space-between;
    .howmany-select {
      input {
        width: 50px;
        color: #6aa0ff;
        border: none;
        padding: 0 5px 0 5px;
        background-color: var(--backgroundColor);
      }
      i {
        color: #6aa0ff;
      }
    }
    .accuracy-select {
      &.length1 {
        width: 50px;
      }
      &.length2 {
        width: 58px;
      }
      &.length3 {
        width: 66px;
      }
      &.length4 {
        width: 74px;
      }
      &.length5 {
        width: 82px;
      }
      &.length6 {
        width: 90px;
      }
      &.length7 {
        width: 98px;
      }
      &.length8 {
        width: 106px;
      }
      input {
        // width: 105px;
        color: #6aa0ff;
        border: none;
        padding: 0 5px 0 5px;
        background-color: var(--backgroundColor);
      }
      i {
        color: #6aa0ff;
      }
    }
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: auto !important;
    &.selected {
      color: #409eff;
    }
  }
  .dark {
    background-color: #1b1e2c;
    border: solid 1px #354989;
    .el-select-dropdown__item {
      color: #ccc;
      background-color: #1b1e2c;
      height: auto !important;
      line-height: auto !important;
      &.hover {
        background-color: #354989 !important;
      }
    }
    .popper__arrow {
      border-bottom-color: #354989;
      &::after {
        border-bottom-color: #1b1e2c;
      }
    }

    .popper__arrow {
      border-top-color: #354989;
      &::after {
        border-top-color: #1b1e2c;
      }
    }
  }
}
</style>