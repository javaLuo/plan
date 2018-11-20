<template>
  <div class="trade-list">
    <div class="no-data"
         v-if="!trade.list.length && !createOrderLoading">
      <img src="~/assets/images/Bitmap@2x.png"
           alt="no-data">
      <p>{{TradeList.noData}}</p>
    </div>
    <div v-loading="createOrderLoading"
         v-else>
      <TradeCard v-for="(item, index) in trade.list"
                 :key="index"
                 :activeTrade="item"
                 :ad-type="adType" />
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import TradeCard from '~/components/Trade/TradeCard.vue';

export default {
  components: {
    TradeCard,
  },
  props: {
    trade: {
      type: Object,
      default: {},
    },
    adType: {
      type: String,
      default: '',
    },
  },
  mounted() {},
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
      TradeList: state => state.i18n.App.TradeList,
      createOrderLoading: state => state.order.createOrderLoading,
    }),
  },
};
</script>

<style lang='scss' scoped>
.trade-list {
  background-color: #fff;
  .no-data {
    color: #b1b0ce;
    text-align: center;
    padding: 48px 0 44px;
    img {
      width: 54px;
      margin-bottom: 3px;
    }
    p {
      font-size: 12px;
      color: #d3d8e6;
    }
  }
}
</style>


