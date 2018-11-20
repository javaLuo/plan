<template>
  <div class="trade-card"
       :style="{padding: !tradeOn ? '0 28px' : '0'}">
    <ul class="trade-item"
        v-if="!tradeOn">
      <li class="trade-item-user">
        <Avatar :name="activeTrade.userName|firstUpperChar"
                :id="activeTrade.userId"
                :online="activeTrade.onLineStatus === 1" />
        <nuxt-link :to="'/member/' + activeTrade.userId">
          <span class="trade-item-user-nickname">{{activeTrade.userName}}</span>
          <span>({{activeTrade.orderSuccessCount}}</span>&nbsp;|&nbsp;
          <span>{{activeTrade.percent}}%)</span>
        </nuxt-link>
      </li>
      <!-- 剩余币的数量 -->
      <li class="trade-item-count">{{activeTrade.stock}}
        <span>{{activeTrade.tradeAsset}}</span>
      </li>
      <!-- 额度范围 -->
      <li class="trade-item-limit">{{compLimitMin}} - {{compLimitMax}}
        <span>{{activeTrade.payAsset}}</span>
      </li>
      <!-- 单价 -->
      <li class="trade-item-price">{{activeTrade.unitPrice}}
        <span>{{activeTrade.payAsset}}</span>
      </li>
      <li class="trade-item-payment">
        <i class="iconfont"
           v-for='(val, i) in payMethod'
           :class="myPayMethods[val.payMethodCode]"
           :key='i'>
        </i>
        <!-- <svg class="icon"
				     aria-hidden="true"
				     v-for='(val, i) in activeTrade.payMethod'
				     :key='i'>
					<use :xlink:href="myPayMethods[val.payMethodCode]"></use>
				</svg> -->
      </li>
      <li class="trade-item-handle">
        <button @click='purchase'
                :title="disable ? TradeList.disableTit: ''"
                :disabled="disable">{{activeTrade.tradeType === '0' ? TradeList.buy : TradeList.sell}}&nbsp;{{activeTrade.tradeAsset}}</button>
      </li>
    </ul>
    <!-- 点击了下单按钮后显示的样子 -->
    <trade-form v-else
                :onCancel="handelCancel"
                :data="activeTrade"
                :ad-type="adType" />
  </div>
</template>

<script>
/* eslint-disable */
import * as type from '~/store/modules/order/type';
import { mapState, mapMutations, mapActions } from 'vuex';
import { GET_KYC_USER_INFO_ACTIONS, GET_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import TradeForm from '~/components/Trade/TradeForm.vue';
import Avatar from '~/components/Avatar.vue';
import Utils from '~/utils/index';

export default {
  data() {
    return {
      name: 'V',
      myPayMethods: {
        '1': 'icon-yibei',
        '2': 'icon-zhifubao1',
        '3': 'icon-weixin1',
        '4': 'icon-yinhangka',
        '5': 'icon-yibei1',
      },
    };
  },
  props: ['activeTrade', 'adType'],
  components: {
    Avatar,
    TradeForm,
  },
  computed: {
    tradeOn() {
      return this.activeTrade.id === this.tradeOnId;
    },
    disable() {
      if (this.userInfo.c2Status === 1) {
        return false;
      }
      return true;
    },
    ...mapState({
      userInfo: state => state.member.userInfo,
      tradeOnId: state => state.order.tradeOnId,
      TradeList: state => state.i18n.App.TradeList,
    }),
    payMethod() {
      return this.UniquePay(this.activeTrade.payMethod);
    },
    // 最大限额 剩余数量 * 单价 和 设置的limitMax看谁小
    compLimitMax() {
      if (!this.activeTrade) {
        return '';
      }
      const howManyNow = Number(this.activeTrade.stock) * Number(this.activeTrade.unitPrice);
      if (Number.isFinite(howManyNow) && howManyNow < Number(this.activeTrade.limitMax)) {
        return Number(howManyNow.toFixed(2));
      }
      return this.activeTrade.limitMax;
    },
    // 最小限额 最小限额不能超过最大限额
    compLimitMin() {
      if (!this.activeTrade) {
        return '';
      }
      console.log('what:', this.comLimitMax, Number(this.activeTrade.limitMin));
      if (Number(this.compLimitMax) < Number(this.activeTrade.limitMin)) {
        return this.compLimitMax;
      }
      return this.activeTrade.limitMin;
    },
    // activePay() {
    //   const payArr = this.activeTrade.payMethod;
    //   const codeArr = new Set();
    //   payArr.forEach(item => {
    //     codeArr.add(item.payMethodCode);
    //   });
    //   return [...codeArr];
    // },
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
  mounted() {
    // console.log('能拿到ID吗：', this.userInfo.userId, this.activeTrade.userId);
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
    purchase() {
      // 不能买卖自己对广告
      if (String(this.userInfo.userId) === String(this.activeTrade.userId)) {
        this.$message.error(this.TradeList.dontYourself);
        return;
      }

      this.setState({ key: 'tradeOnId', val: this.activeTrade.id });
    },
    handelCancel() {
      this.setState({ key: 'tradeOnId', val: '' });
    },
    ...mapActions({
      getKycUserInfo: GET_KYC_USER_INFO_ACTIONS,
      setState: type.SET_STATE,
    }),
  },
  beforeDestroy() {
    this.setState({ key: 'tradeOnId', val: '' });
  },
};
</script>

<style scoped lang="scss">
.trade-card {
  position: relative;
}
.trade-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  padding: 20px 0;
  border-bottom: 1px solid #f5f6f9;
  li {
    color: #354989;
    display: inline-block;
    span {
      // padding: 0 5px;
    }

    &.trade-item-user {
      > a {
        color: #354989;
      }
    }
  }
  &-user {
    width: 25%;
    .icon {
      font-size: 32px;
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 100%;
      vertical-align: middle;
      background-color: #9fb1de;
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
  }
  &-count {
    width: 16%;
  }
  &-limit {
    width: 17%;
  }
  &-price {
    width: 16%;
    color: #6aa0ff !important;
  }
  &-payment {
    width: 12%;
    i {
      display: inline-block;
      border-radius: 100%;
      margin-right: 10px;
      font-size: 14px;
      line-height: 14px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  &-handle {
    button {
      width: 81px;
      height: 32px;
      color: #fff;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      background-color: #6aa0ff;
      &:hover {
        background-color: #5d8ce0;
      }
      &:disabled {
        background: #d3d8e6;
        cursor: default;
      }
    }
  }
}
</style>