<template>
  <div class="trade-form">
    <div class="trade-form-head">
      <div class="trade-form-head-l">
        <div class="trade-form-item">
          <div class="trade-form-user">
            <Avatar :name="data.userName|firstUpperChar"
                    :id="data.userId" />
            <nuxt-link :to="'/member/' + data.userId">
              <span class="trade-form-user-nickname">{{data.userName}}</span>
              <span>({{data.orderSuccessCount}}</span>&nbsp;|&nbsp;
              <span>{{data.percent}}%)</span>
            </nuxt-link>
          </div>
          <dl class="trade-form-content-item">
            <dt>{{TradeList.amount}}</dt>
            <dd>
              <span>{{data.stock}}</span>{{data.tradeAsset}}</dd>
          </dl>
        </div>
        <div class="trade-form-item">
          <dl class="align-user">
            <!-- <dt>{{TradeList.unitPrice}}</dt> -->
            <dd>
              <span class="active-price">{{data.unitPrice}}</span>&nbsp;{{data.payAsset}}</dd>
          </dl>
          <dl class="trade-form-content-item">
            <!-- <dt>{{TradeList.limit}}</dt> -->
            <dd>
              <!-- 额度范围 -->
              <span>{{compLimitMin}} - {{compLimitMax}}</span>{{data.payAsset}}</dd>
          </dl>
        </div>
      </div>
      <div class="trade-form-head-r">
        <div class="handle-control">
          <MoneyConversionInput ref="converInput"
                                :data="data" />
          <div class="handle">
            <el-button type="primary"
                       :loading="createOrderLoading"
                       @click="createOrder">{{TradeList.booking}}</el-button>
            <el-button @click="onCancel">{{TradeList.cancel}}</el-button>
          </div>
        </div>
        <p class="notice">{{TradeList.bookNotice}}</p>
      </div>
    </div>
    <div class="trade-form-content">
      <div class="content">
        <ul class="icon-control">
          <li v-for="(item, i) in payMethod"
              :key="i">
            <i class="iconfont"
               :class="myPayMethods[item.payMethodCode]"></i>
            <!-- <svg class="icon"
						     aria-hidden="true">
							<use :xlink:href="myPayMethods[item.payMethodCode]"></use>
						</svg> -->
            <span>{{Common.payments[`item${item.payMethodCode}`]}}</span>
            <span v-if="item.bankName">{{item.bankName}}</span>
          </li>
        </ul>
        <p class="trade-intro">
          {{data.content}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import MoneyConversionInput from '~/components/MoneyConversionInput.vue';
import * as type from '~/store/modules/order/type';
import { mapState, mapMutations, mapActions } from 'vuex';
import Avatar from '~/components/Avatar.vue';
import Utils from '~/utils/index';
export default {
  data() {
    return {
      myPayMethods: {
        '1': 'icon-yibei',
        '2': 'icon-zhifubao1',
        '3': 'icon-weixin1',
        '4': 'icon-yinhangka',
        '5': 'icon-yibei1',
      },
    };
  },
  props: {
    onCancel: {
      type: Function,
      default: () => {},
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Object,
      default: {},
    },
    adType: {
      type: String,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      ErrCode: state => state.i18n.App.ErrCode,
      TradeList: state => state.i18n.App.TradeList,
      Common: state => state.i18n.App.Common,
      createOrderLoading: state => state.order.createOrderLoading,
    }),
    payMethod() {
      return this.UniquePay(this.data.payMethod);
    },
    // 最大限额 剩余数量 * 单价 和 设置的limitMax看谁小
    compLimitMax() {
      if (!this.data) {
        return '';
      }
      const howManyNow = Number(this.data.stock) * Number(this.data.unitPrice);
      if (Number.isFinite(howManyNow) && howManyNow < Number(this.data.limitMax)) {
        return Number(howManyNow.toFixed(2));
      }
      return this.data.limitMax;
    },
    // 最小限额 最小限额不能超过最大限额
    compLimitMin() {
      if (!this.data) {
        return '';
      }
      if (Number(this.compLimitMax) < Number(this.data.limitMin)) {
        return this.compLimitMax;
      }
      return this.data.limitMin;
    },
  },
  filters: {
    firstUpperChar(str) {
      if (!!str) {
        str = Utils.trim(str);
        return str.substr(0, 1).toUpperCase();
      }
      return '';
    },
  },
  methods: {
    UniquePay(paylist) {
      var payArr = [paylist[0]];
      for (var i = 1; i < paylist.length; i++) {
        var payItem = paylist[i];
        var repeat = false;
        for (var j = 0; j < payArr.length; j++) {
          if (payItem.payMethodCode == payArr[j].payMethodCode) {
            repeat = true;
            break;
          }
        }
        if (!repeat) {
          payArr.push(payItem);
        }
      }
      return payArr;
    },
    handleCancelTrade() {
      this.setState({ key: 'tradeOn', val: false });
    },
    async createOrder() {
      const exchange = this.$refs['converInput'].conversionForm;

      if (!exchange.coin || !exchange.curency) {
        this.$message.error(this.TradeList.errCoin);
        return;
      }

      const unitPrice = this.data.unitPrice;

      const curency = {
        minAmount: this.data.limitMin,
        maxAmount: this.data.limitMax,
        get isMin() {
          Number(exchange.curency) < Number(this.minAmount).toFixed(2);
          return;
        },
        get isMax() {
          Number(exchange.curency) > Number(this.maxAmount).toFixed(2);
          return;
        },
      };

      const coin = {
        maxAmount: Number(this.data.limitMax) / Number(unitPrice),
        minAmount: Number(this.data.limitMin) / Number(unitPrice),
        get isMin() {
          Number(exchange.coin) < Number(this.minAmount).toFixed(2);
          return;
        },
        get isMax() {
          Number(exchange.coin) > Number(this.maxAmount).toFixed(2);
          return;
        },
      };

      if (curency.isMin || coin.isMin) {
        this.$message.error(this.TradeList.ltErr);
        return;
      }
      if (curency.isMax || coin.isMax) {
        this.$message.error(this.TradeList.gtErr);
        return;
      }
      const res = await this.createOrderAction({
        adId: this.data.id,
        amount: exchange.coin,
        unitPrice,
        total: exchange.curency,
        adType: this.adType,
      });
      if (res && res.code === 200) {
        this.$message.success(this.TradeList.sucBook);
        this.setState({ key: 'tradeOnId', val: '' });
        this.$router.push({ path: `/order/orderDetail/${res.data.tradeNo}` });
      } else {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
    },
    //deprecred
    async createOrder1() {
      const { coin, curency } = this.$refs['converInput'].conversionForm;
      const maxAmount = Number(this.data.limitMax) / Number(this.data.unitPrice);
      const minAmount = Number(this.data.limitMin) / Number(this.data.unitPrice);
      // if empty
      if (!curency || !coin) {
        return this.$message.error(this.TradeList.errCoin);
      }
      // if cureny lt minAmount or coin lt minAmount
      if (curency < this.data.limitMin || coin < minAmount) {
        return this.$message.error(this.TradeList.ltErr);
      }
      // if cureny gt minAmount or coin gt minAmount
      if (curency > this.data.limitMax || coin > maxAmount) {
        return this.$message.error(this.TradeList.gtErr);
      }
      //下单
      const res = await this.createOrderAction({
        adId: this.data.id,
        amount: coin,
        unitPrice: this.data.unitPrice,
        total: curency,
        adType: this.adType,
      });
      if (res && res.code === 200) {
        this.$message.success(this.TradeList.sucBook);
        this.setState({ key: 'tradeOnId', val: '' });
        this.$router.push({ path: `/order/orderDetail/${res.data.tradeNo}` });
      } else {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
    },
    ...mapActions({
      setState: type.SET_STATE,
      createOrderAction: type.POST_CREATE_ORDER,
    }),
  },
  components: {
    MoneyConversionInput,
    Avatar,
  },
};
</script>

<style lang='scss' scoped>
.trade-form {
  padding: 36px;
  background: #ffffff;
  box-shadow: 0 0 8px 0 rgba(53, 73, 137, 0.12);
  &-head {
    display: flex;
    justify-content: space-between;

    &-l {
      display: flex;
      justify-content: flex-start;
      margin-left: 42px;

      .trade-form-user {
        margin-left: -42px;
        .icon {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 100%;
          vertical-align: middle;
          background-color: #b9a7e8;
        }

        &-nickname {
          display: inline-block;
          max-width: 108px;
          padding: 0 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
        }

        > a {
          // padding-left: 10px;
          color: #354989;
          span {
            padding-right: 5px;
          }
        }
      }

      .trade-form-item {
        &:not(:first-of-type) {
          margin-left: 48px;
        }
        .align-user {
          line-height: 32px;
          > dd {
            color: #6aa0ff;
          }
        }
      }
    }

    &-r {
      .notice {
        font-size: 12px;
        line-height: 18px;
        color: #a8afcd;
        text-align: right;
        margin-top: 4px;
      }
      .handle-control {
        height: 52px;
        display: flex;
        justify-content: space-between;
        .handle {
          display: flex;
          padding-left: 48px;
          justify-content: space-between;

          button {
            font-size: 14px;
            height: 32px;
            padding: 5px 27px;
            border: none;
            outline: none;
            color: #fff;
            border-radius: 2px;
            background: #ee9b25;

            &:last-of-type {
              padding: 9px 0;
              margin-left: 44px;
              color: #7d86ac;
              background: #fff;
              border: none;
              outline: none;
            }
          }
        }
      }
    }
  }
  &-content {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding-left: 42px;
    .content {
      width: 580px;
      .icon-control {
        margin-bottom: 10px;
        li {
          display: inline-block;
          padding-right: 28px;
          .iconfont {
            vertical-align: middle;
            font-size: 14px;
          }
          span {
            padding-left: 5px;
            color: #354989;
          }
        }
        .icon {
          vertical-align: middle;
          span {
            padding-left: 5px;
          }
        }
      }
      .trade-intro {
        width: 100%;
        color: #b1b0ce;
        line-height: 18px;
        word-break: break-all;
      }
    }
  }

  &-content-item {
    font-size: 12px;
    color: #354989;
    margin-top: 5px;
    > * {
      display: inline;
    }
    dt {
      color: #a8afcd;
      &::after {
        content: '：';
      }
    }
    dd {
      > span {
        padding: 0 5px;

        &.active-price {
          color: #6aa0ff;
        }
      }
    }
  }
}
</style>


