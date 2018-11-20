<template>
  <div class="container1">
    <div v-if="!loading">
      <sellr-order v-if="isSellr"></sellr-order>
      <buy-order v-if="isBuy"></buy-order>
    </div>
    <loading v-if="loading" />

    <!-- <div class="order-footer">
			<div class="footer-content">
				<ul>
					<li>{{OrderDetail.buyNotice}}</li>
					<li>{{OrderDetail.buyNoticeTxt[0]}}</li>
					<li>{{OrderDetail.buyNoticeTxt[1]}}</li>
					<li>{{OrderDetail.buyNoticeTxt[2]}}</li>
				</ul>
			</div>
		</div> -->
  </div>
</template>

<script>
import SellrOrder from '~/components/Order/SellrOrder.vue';
import BuyOrder from '~/components/Order/BuyOrder.vue';
import * as type from '~/store/modules/order/type';
import { GET_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import { mapActions, mapState } from 'vuex';
import loading from '~/components/loading.vue';
export default {
  components: {
    SellrOrder,
    BuyOrder,
    loading,
  },
  data() {
    return {
      dialogVisible: false,
      tradeNo: this.$route.params.id,
      isSellr: false,
      isBuy: false,
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    let res = await this.getOrder(this.tradeNo);
    if (!res || res.code !== 200) return;

    if (Object.keys(this.orderStatus.otcTrade).length > 0) {
      if (!this.orderStatus.otcTrade.buyerId) {
        this.isBuy = true;
      } else if (!this.orderStatus.otcTrade.sellerId) {
        this.isSellr = true;
      } else {
        this.isBuy = false;
        this.isSellr = false;
      }
    }
    this.loading = false;
  },
  computed: {
    ...mapState({
      OrderDetail: state => state.i18n.App.OrderDetail,
      orderStatus: state => {
        return state.order.orderStatus;
      },
    }),
  },
  methods: {
    ...mapActions({
      getOrder: type.ORDER_STATUS_LIST_ACTIONS,
      getUserInfo: GET_USER_INFO_ACTIONS,
    }),
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.container1 {
  width: 1180px;
  margin: 0 auto;
  margin-top: 88px;
  margin-bottom: 140px;
  font-size: 14px;
  color: #b1b0ce;
  .content {
    padding-bottom: 73px;
    display: flex;
    justify-content: space-between;
    .content-left {
      padding: 35px 24px 32px 24px;
      background: #fff;
      width: 824px;
      .el-icon-error {
        color: #c0c3d0;
        font-size: 14px;
      }
      .icon-weixuanzhong {
        color: #2ac393;
      }
      .pending-waring {
        font-size: 12px;
      }
      .content-title {
        line-height: 18px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e2e1f0;
        padding-bottom: 10px;
        span:nth-child(1) {
          flex-grow: 0.7;
        }
        a {
          color: #6aa0ff;
          cursor: pointer;
        }
      }
      .content-detail {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        padding-bottom: 24px;
        .name {
          font-size: 28px;
          color: #354989;
        }
        .detail {
          margin-top: 14px;
          display: flex;
          font-size: 14px;

          .unit {
            margin-left: 10px;
          }
          .detail-count {
            margin-left: 10px;
            color: #6aa0ff;
          }
          .detail-price {
            color: #354989;
          }
        }
      }
      .count {
        margin-top: 22px;
        text-align: right;
        .count-price {
          font-size: 24px;
          color: #312750;
        }
      }
      .payment {
        display: flex;
        &:not(:first-child) {
          margin-top: 10px;
        }
        .payment-icon {
          width: 140px;
          color: #354989;
          .iconfont {
            font-size: 14px;
            vertical-align: middle;
            line-height: 14px;
          }
          img {
            vertical-align: middle;
          }
        }
        .payment-message {
          margin-left: 100px;
          color: #7d86ac;
          width: 100%;
          span {
            cursor: pointer;
          }

          .iconfont {
            position: relative;
            color: #6aa0ff;
            margin-left: 5px;
            img {
              position: absolute;
              top: -54px;
              right: -125px;
              display: none;
            }
            &:hover > img {
              display: block;
            }
          }
        }
      }
      .trade-message {
        margin-top: 76px;
        font-size: 16px;
        color: #354989;
        line-height: 30px;
        .cancel-message {
          font-size: 12px;
          color: #7d86ac;
          background: #f5f9ff;
          border-radius: 2px;
          padding: 4px 8px;
        }
        .icon-zhuyi {
          color: #ff9a02;
        }
        div {
          margin-top: 14px;
        }
        .payment-remark {
          display: inline-block;
          background: #f5f9ff;
          border: 1px dashed #6aa0ff;
          border-radius: 2px;
          padding: 4px;
          height: 22px;
          color: #6aa0ff;
          text-align: center;
        }
      }
    }
    .content-right {
      width: 336px;
      height: 550px;
      background: #fff;
      margin-left: 20px;
    }
    .font-violet {
      color: #6aa0ff;
    }
    h4,
    h3 {
      display: inline-block;
    }
    .button {
      margin-top: 20px;
      margin-bottom: 14px;
      button {
        width: auto;
        height: 44px;
      }
      a {
        color: #6aa0ff;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .order-footer {
    background: #efeef7;
    width: 1180px;
    // height:221px;
    padding: 43px 0px 43px 49px;
    .footer-content {
      width: 657px;
      // height: 135px;
      font-size: 14px;
      color: #241c40;
      ul > li {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
