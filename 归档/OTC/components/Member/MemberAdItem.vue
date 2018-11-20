<template>
  <div>
    <div class="user-ad-list"
         v-if="!shielding && listData && listData.length">
      <div class="user-ad-item"
           v-if="listData"
           v-for='item of listData'
           :key='item.id'>
        <div class="coin-type">
          <i></i>
        </div>
        <div class="bottom-line">
          <div class="flex-div">
            <dl class="coin-info">
              <dt>{{item.unitPrice|formatCurrency}} {{item.payAsset}}/{{item.tradeAsset}}</dt>
              <dd>
                <span>{{UserInfo.limit}}：{{compLimitMin(item)|formatCurrency(2,true)}} - {{compLimitMax(item)|formatCurrency(2,true)}}</span>
                <span>{{UserInfo.amount}}：{{item.stock}} {{item.tradeAsset}}</span>
              </dd>
            </dl>
            <dl class="coin-pay"
                v-if="item.id !== activeData.id">
              <i class="font-icon font-PayPal"
                 v-if="item.payMethod && item.payMethod.find((item)=>item.payMethodCode === paypal)" />
              <i class="font-icon font-alipay"
                 v-if="item.payMethod && item.payMethod.find((item)=>item.payMethodCode === alipay)" />
              <i class="font-icon font-wechat"
                 v-if="item.payMethod && item.payMethod.find((item)=>item.payMethodCode === wechat)" />
              <i class="font-icon font-bank"
                 v-if="item.payMethod && item.payMethod.find((item)=>item.payMethodCode === bank)" />
              <i class="font-icon font-ePay"
                 v-if="item.payMethod && item.payMethod.find((item)=>item.payMethodCode === epay)" />
            </dl>

            <dl class="coin-buy">
              <div class="buy-div"
                   v-if="item.id === activeData.id">
                <!-- input组件 -->
                <span class="mci">
                  <MoneyConversionInput ref="converInput"
                                        :data="activeData" />
                </span>
                <el-button class="order-confirm-btn normal-btn"
                           type="warning"
                           @click="createOrder(Number(item.adType))"
                           :loading="createOrderLoading">{{UserInfo.booking}}</el-button>
                <el-button @click="cancelOrder"
                           class="cancel-btn normal-btn">{{UserInfo.cancel}}</el-button>
              </div>
              <!-- 购买按钮 -->
              <el-button v-else
                         type="primary"
                         class="confirm-btn normal-btn"
                         :class="{elDisabled: userInfo.c2Status !== 1}"
                         :disabled="userInfo.c2Status !== 1"
                         @click="showBuyModal(item)">{{UserInfo.buy}}</el-button>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="user-ad-list"
         v-else>
      <div class="user-ad-no-item">
        <div class="img-div">
          <img src="~/assets/images/no-result.png"
               alt="">
          <div class="fields-div">{{UserInfo.noAds}}</div>
        </div>

      </div>
    </div>
  </div>

</template>
<script>
/* eslint-disable */
import * as type from '~/store/modules/order/type';
import { mapState, mapMutations, mapActions } from 'vuex';
import * as Dict from '~/store/dict';
import MoneyConversionInput from '~/components/MoneyConversionInput.vue';
export default {
  data() {
    return {
      paypal: Dict.PAYPAL_ID,
      alipay: Dict.ALIPAY_ID,
      wechat: Dict.WECHAT_ID,
      bank: Dict.BANK_ID,
      epay: Dict.EPAY_ID,
      activeData: {},
      createOrderLoading: false,
      data: {
        id: 0,
        limitMin: 0,
        limitMax: 0,
        stock: 0,
        tradeAsset: '',
        payAsset: '',
        unitPrice: 0,
      },
    };
  },
  props: {
    listData: {
      required: true,
      type: Array,
      default: null,
    },
    shielding: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      UserInfo: state => state.i18n.App.UserInfo,
      ErrCode: state => state.i18n.App.ErrCode,
      TradeList: state => state.i18n.App.TradeList,
      userInfo: state => state.member.userInfo,
    }),
  },
  components: {
    MoneyConversionInput,
  },
  methods: {
    ...mapActions({
      setState: type.SET_STATE,
      createOrderAction: type.POST_CREATE_ORDER,
    }),
    showBuyModal(item) {
      if (String(this.userInfo.userId) === String(item.userId)) {
        this.$message.error(this.TradeList.dontYourself);
        return;
      }
      this.data = {
        id: item.id,
        limitMin: item.limitMin,
        limitMax: item.limitMax,
        stock: item.stock,
        tradeAsset: item.tradeAsset,
        payAsset: item.payAsset,
        unitPrice: item.unitPrice,
      };
      this.activeData = item;
    },
    // 最大限额 剩余数量 * 单价 和 设置的limitMax看谁小
    compLimitMax(item) {
      const howManyNow = Number(item.unitPrice) * Number(item.stock);
      if (Number.isFinite(howManyNow) && howManyNow < Number(item.limitMax)) {
        return Number(howManyNow.toFixed(2));
      }
      return item.limitMax;
    },
    // 最小限额 最小限额不能超过最大限额
    compLimitMin(item) {
      const max = this.compLimitMax(item);
      if (Number(max) < Number(item.limitMin)) {
        return max;
      }
      return item.limitMin;
    },
    cancelOrder() {
      this.activeData = {};
    },
    async createOrder(adType) {
      const { coin, curency } = this.$refs['converInput'][0].conversionForm;
      if (!curency || !coin) {
        this.$message.error(this.TradeList.errCoin);
      } else {
        //下单
        this.createOrderLoading = true;
        const res = await this.createOrderAction({
          adId: this.data.id,
          total: curency,
          amount: coin,
          unitPrice: this.data.unitPrice,
          adType,
        });
        this.createOrderLoading = false;
        if (res && res.code === 200) {
          this.$message.success(this.TradeList.sucBook);
          this.setState({ key: 'tradeOnId', val: '' });
          this.$router.push({ path: `/order/orderDetail/${res.data.tradeNo}` });
        } else {
          this.$message.error(this.ErrCode[res.code] || `${res.code}`);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user-ad-item {
  width: 1180px;
  height: 100px;
  margin: 0 auto;
  font-family: PingFangSC-Medium;
  .elDisabled {
    background: #d3d8e6 !important;
    border-color: #d3d8e6 !important;
  }
  .coin-type {
    display: inline-block;
    width: 100px;
    height: 48px;
    height: 14px;
    vertical-align: middle;
    i {
      display: block;
      width: 24px;
      height: 24px;
      margin-left: 28px;
      background: url('~/assets/images/bitcoin.png') center / cover;
    }
  }
  .bottom-line {
    display: inline-block;
    width: 1052px;
    height: 100px;
    vertical-align: middle;
    border-bottom: 1px solid #f6f6f9;
    .flex-div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100px;
      dl {
        position: relative;
        align-self: center;
        dt {
          font-size: 16px;
          color: #6aa0ff;
          letter-spacing: 0;
        }
        dd {
          margin-top: 6px;
          font-size: 12px;
          color: #354989;
          span {
            &:first-of-type {
              margin-right: 48px;
            }
          }
        }
      }

      .coin-info {
        flex: none;
        width: 415px;
      }
      .coin-pay {
        flex: auto;
        display: flex;
        align-items: center;
        padding-left: 50px;
        i {
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
      }
      .coin-buy {
        flex: auto;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.normal-btn {
  line-height: 0 !important;
}
.confirm-btn {
  background-color: #6aa0ff;
  border: solid 1px #6aa0ff;
  &:hover {
    background-color: #5d8ce0;
    border: solid 1px #5d8ce0;
  }
}
.buy-div {
  display: flex;
  align-items: center;
  background: #fff;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  top: 0;
  .mci {
    display: inline-block;
    vertical-align: middle;
  }
  .cny-input,
  .btc-input {
    margin: 0px 20px;
  }
  .order-confirm-btn {
    margin: 0 20px;
    padding: 0;
  }

  .cancel-btn {
    margin: 0;
    color: #b7b6ba;
    border: solid 1px transparent !important;
  }
}
.user-ad-no-item {
  width: 1180px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .img-div {
    text-align: center;
    img {
      width: 54px;
      margin-bottom: 5px;
    }
  }
  .fields-div {
    position: relative;
    font-size: 12px;
    color: #d3d8e6;
  }
}
</style>
