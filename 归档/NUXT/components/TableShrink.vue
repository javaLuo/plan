<!-- 用于个人中心页 - 烘焙记录的数据组件 -->
<template>
  <div :class="`table-shrink-com ${open ? 'open' : ''}`">
    <ul class="tr-ul"
        @click="onClick">
      <li class="big">{{sourceData.productName}}</li>
      <li class="big">{{productType}}</li>
      <li class="big"
          :title="sourceData.total">{{sourceData.total}}</li>
      <li class="big">{{sourceData.productYearRate}}%</li>
      <li class="big"
          v-if="startMoney > 0">{{startDate}}</li>
      <li class="big"
          v-else>{{sourceData.interest}}</li>

      <li class="big">{{i18n.s[`s${sourceData.productStatus}`]}}</li>
      <li class="blue"
          @click.stop="onCancel">{{statusType}}</li>
      <li class="txtright blue"
          @click.stop="onOpen">{{i18n.detail}}<i :class="`iconfont icon-arrow-down ${open ? 'turn' : ''}`" /></li>
    </ul>
    <ul :class="['tr-body',{open}]">
      <li>
        <span>{{i18n.projectname}}:</span>
        <span>{{sourceData.productName}}</span>
      </li>
      <li>
        <span>{{i18n.projecttype}}:</span>
        <span>{{productType}}</span>
      </li>
      <li>
        <span>{{i18n.status}}:</span>
        <span>{{i18n.s[`s${sourceData.productStatus}`]}}</span>
      </li>
      <li>
        <span>{{i18n.timepart}}:</span>
        <span>{{sourceData.createTimestamp | timestampFormat}}</span>
      </li>
      <li>
        <span>{{i18n.amount}}:</span>
        <span>{{sourceData.originAmount}}</span>
      </li>
      <li>
        <span>{{i18n.currentAmount}}:</span>
        <span>{{sourceData.total}}</span>
      </li>
      <!-- 如果还没到收益开始时间，就显示倒计时 -->
      <li v-if="startMoney > 0">
        <span>{{i18n.returnStart}}:</span>
        <span>{{startDate}}</span>
      </li>
      <!-- 如果到了，就显示累计收益 -->
      <li v-if="startMoney <= 0">
        <span>{{i18n.accum}}:</span>
        <span>{{sourceData.interest}}</span>
      </li>
      <!-- 如果到了，才显示昨日收益 -->
      <li v-if="startMoney <= 0">
        <span>{{i18n.lastday}}:</span>
        <span>{{sourceData.lastInterest || '--'}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      open: false
    };
  },
  props: {
    sourceData: { type: Object }
  },
  computed: {
    ...mapState({
      i18n: state => state.i18n.App.Bake
    }),
    // 项目类型
    productType() {
      if (this.sourceData.productType === "烘焙项目") {
        return this.i18n.projectType[0];
      }
      return this.sourceData.productType;
    },
    // 当前的状态
    statusType() {
      switch (Number(this.sourceData.status)) {
        case 1:
          return this.i18n.cancel; // 进行中，显示可取消
        case 2:
          return this.i18n.closed; // 已结束，就显示已结束
        default:
          return this.i18n.cancelied; // 未知，就显示已取消
      }
      if (this.sourceData.status === 1) {
        // 进行中，可取消
        return i8n.cancel;
      }
      e;
    },
    // 收益开始倒计时还有多少天
    startMoney() {
      const t = this.sourceData.interestStartTimeStamp * 1000;
      const n = new Date().getTime();
      const m = Math.ceil((t - n) / (1000 * 60 * 60 * 24)) || 0;
      return m < 0 ? 0 : m;
    },
    // 收益开始日期
    startDate() {
      const d = new Date(this.sourceData.interestStartTimeStamp * 1000);
      const r = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      return r;
    }
  },
  filters: {
    // 时间戳格式化
    timestampFormat(num) {
      if (isNaN(Number(num))) {
        return "";
      }
      const d = new Date(num * 1000);
      // const h = String(d.getHours()).padStart(2, '0');
      // const m = String(d.getMinutes()).padStart(2, '0');
      // const s = String(d.getSeconds()).padStart(2, '0');
      // const month = String(d.getMonth() + 1).padStart(2, '0');
      // const day = String(d.getDate()).padStart(2, '0');
      // return `${h}:${m}:${s} ${month}/${day}`;
      return `${moment(d)
        .utc()
        .add(4, "h")
        .format("HH:mm:ss MM/DD")} (GMT+4)`;
    }
  },
  methods: {
    onOpen() {
      this.open = !this.open;
    },
    // 普通的被点选
    onClick() {
      this.$router.push(`/baking/${this.sourceData.productId || 0}`);
    },
    // 用户点击来取消
    onCancel() {
      // 进行中的订单才能取消
      if (this.sourceData.status === 1) {
        this.$emit("onCancel", this.sourceData);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/css/_theme.scss";

.table-shrink-com {
  transition: all 250ms;
  margin: 0 8px;
  &.open {
    box-shadow: 0 0 8px 0 rgba(31, 58, 105, 0.08);
    // margin: 8px;
  }
  .tr-ul {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    cursor: pointer;
    border-bottom: solid 1px;
    @include fontPair(color);
    @include cutLinePair(border-bottom-color);
    &:hover {
      @include hoverPair(background-color);
    }
    & > li {
      flex: 0.6;
      padding: 0 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.big {
        flex: 1;
      }
      &.blue {
        cursor: pointer;
        @include interactionPair(color);
        &:hover {
          @include interactionPair(color);
        }
      }
      &.txtright {
        text-align: right;

        i {
          margin-left: 3px;
          transition: all 250ms;
          display: inline-block;
          &.turn {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .tr-body {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    height: 0;
    transition: all 250ms;
    &.open {
      padding: 20px;
      height: auto;
      @include hoverPair(background-color);
    }
    & > li {
      width: 33.333333%;
      flex: none;
      font-size: 12px;
      line-height: normal;
      display: flex;
      align-items: center;
      &:nth-child(n + 3) {
        margin-top: 10px;
      }
      & > span:first-child {
        width: 45%;
        display: inline-block;
        @include subFontPair(color);
      }
      & > span:nth-child(2) {
        @include fontPair(color);
      }
    }
  }
}
</style>