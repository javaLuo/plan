<template>
  <div class="trade">
    <section class="top-layer">
      <div class="trade-tabs">
        <tabs class="trade-tabs-item"
              type="buy"
              :curTab="handleTab"
              :activeType="activeType" />
        <tabs class="trade-tabs-item"
              type="sell"
              :curTab="handleTab"
              :activeType="activeType" />
      </div>

      <div class="search">
        <trade-query ref="tradeSearch"
                     :getListParams="getListParams" />
      </div>
    </section>

    <div class="trade-content">
      <div class="trade-head">
        <span class="trade-head-user">{{TradeList.business}}（{{TradeList.completeOrder}} | {{TradeList.completeRate}}）</span>
        <span class="trade-head-count">{{TradeList.amount}}</span>
        <span class="trade-head-limit">{{TradeList.limit}}</span>
        <span class="trade-head-price">{{TradeList.unitPrice}}</span>
        <span class="trade-head-payment">{{TradeList.payment}}</span>
        <span class="trade-head-handle">{{TradeList.operate}}</span>
      </div>

      <trade-list :trade="tradeList"
                  :ad-type="getListParams.adType" />
    </div>

    <div class="page"
         v-if="tradeList.list.length">
      <!-- <el-pagination background
			               @size-change="handleSizeChange"
			               @current-change="handleCurrentChange"
			               :page-sizes="[10, 20, 30, 40]"
			               :page-size="pageSize"
			               layout="prev, pager, next, sizes"
			               :total="tradeList.total">
			</el-pagination> -->
      <el-pagination background
                     @current-change="handleCurrentChange"
                     layout="prev, pager, next"
                     :total="tradeList.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex';
import * as dict from '~/store/dict';
import * as type from '~/store/modules/order/type';
import Tabs from '~/components/Tabs.vue';
import TradeList from '~/components/Trade/TradeList.vue';
import TradeQuery from '~/components/Trade/TradeQuery.vue';

export default {
  components: {
    Tabs,
    TradeList,
    TradeQuery,
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      activeType: 'buy',
      getListParams: {
        tradeType: '0', //交易类型 0 购买 1 出售
        tradeAsset: '0', //交易币种 0 BTC 1ETH 2 USD
        adType: '1', //0普通交易 1大宗交易
        // countryArea: '1', //国家地区
        // payAsset: '', //法币币种
        // payMethod: '', //支付方式
        // limitPrice: '', //,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapState({
      TradeList: state => state.i18n.App.TradeList,
      tradeOnId: state => state.order.tradeOnId,
      tradeList: state => state.order.tradeList,
    }),
  },
  methods: {
    ...mapActions({
      adList: type.AD_GETLIST_ACTIONS_ORDER,
      setState: type.SET_STATE,
    }),
    async getTradeList() {
      const res = await this.adList(this.getListParams);
      if (res && res.code === 200) {
        return;
      } else {
        this.$message.error(this.errorCode[res.code]);
      }
    },
    handleTab(item, i, type) {
      this.activeType = type;
      let params = Object.assign({}, this.getListParams, {
        tradeType: type === 'buy' ? '0' : '1',
        tradeAsset: dict[item],
      });
      this.adList(params);
      this.$refs['tradeSearch'].resetSearch();
      this.setState({ key: 'tradeOnId', val: '' });
    },
    handleSizeChange(size) {
      this.getListParams.pageSize = size;
      this.adList(this.getListParams);
      this.setState({ key: 'tradeOnId', val: '' });
    },
    handleCurrentChange(page) {
      this.getListParams.currentPage = page;
      this.adList(this.getListParams);
      this.setState({ key: 'tradeOnId', val: '' });
    },
  },
  async mounted() {
    await this.getTradeList();
  },
};
</script>

<style lang="scss" scoped>
.trade {
  width: 1180px;
  margin: 88px auto 96px;
  padding-bottom: 32px;
  background-color: #fff;
  .top-layer {
    padding: 0;
    padding-bottom: 17px;
    background-color: #f5f7fe;
    border-bottom: 1px solid #e9ecf4;
  }
  &-tabs {
    &-item {
      display: inline-block;
      width: 335px;
      &:after {
        content: ' ';
        width: 2px;
        height: 13px;
        margin: 0 32px;
        display: inline-block;
        background-color: #e2e1f0;
      }
      &:last-child:after {
        content: '';
        display: none;
      }
    }
  }
  &-content {
    // min-height: 360px;
  }
  &-head {
    display: flex;
    justify-content: space-between;
    color: #a8afcd;
    font-size: 12px;
    padding: 20px 28px 0;
    line-height: 32px;
    background-color: #f5f7fe;
    line-height: 32px;
    span {
      display: inline-block;
    }
    &-user {
      width: 25%;
    }
    &-count {
      width: 16%;
    }
    &-limit {
      width: 17%;
    }
    &-price {
      width: 16%;
    }
    &-payment {
      width: 12%;
    }
    &-handle {
      width: 81px;
      text-align: right;
    }
  }
  .page {
    padding-right: 27px;
  }
}
</style>
