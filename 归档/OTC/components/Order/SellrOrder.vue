<template>
  <div class="content">
    <div class="content-left">
      <div class="content-title">
        <span>{{OrderDetail.order}}# {{orderStatus.otcTrade.tradeNo}}</span>
        <span>{{orderStatus.otcTrade.createTime| dubaiDate}}</span>
        <!-- <a @click="cancelOrder" v-if="orderStatus.otcTrade.status === PENDING">{{orderStatus.otcTrade.status|orderSellerStatusText}}</a> -->
        <!-- <a>{{orderStatus.otcTrade.status|orderSellerStatusText}}</a> -->
        <span>{{orderStatusTxt(orderStatus.otcTrade.status)}}</span>
      </div>
      <div class="content-detail">
        <div class="name">{{OrderDetail.sellMemo[0]}}{{orderStatus.nickname}}{{OrderDetail.sellMemo[1]}} {{orderStatus.otcTrade.amountStr}}{{orderStatus.otcTrade.asset}}
        </div>
        <div class="detail">
          <span class="num">{{OrderDetail.unitPirce}}:</span>
          <div class="detail-count detail-price">
            <span class="num">{{orderStatus.otcTrade.price}}</span>
            <span class="unit">{{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}/{{orderStatus.otcTrade.asset}}</span>
          </div>
        </div>
        <div class="detail">
          <span class="num">{{OrderDetail.total}}:</span>
          <div class="detail-count">
            {{orderStatus.otcTrade.total | formatCurrency}} {{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}
          </div>
        </div>
      </div>
      <div class="payment"
           v-for="item in orderStatus.otcPayMethodList"
           :key="item.id"
           v-if="orderStatus.otcTrade.status !== CANCEL">
        <span class="payment-icon"
              v-if="item.payTypeId === 1">
          <i class="iconfont icon-yibei" /> {{OrderDetail.paypal}}
        </span>
        <span class="payment-icon"
              v-if="item.payTypeId === 2">
          <i class="iconfont icon-zhifubao1" /> {{OrderDetail.alipay}}
        </span>
        <span class="payment-icon"
              v-if="item.payTypeId === 3">
          <i class="iconfont icon-weixin1" /> {{OrderDetail.wechat}}
        </span>
        <span class="payment-icon"
              v-if="item.payTypeId === 4">
          <i class="iconfont icon-yinhangka" /> {{OrderDetail.bank}}
        </span>
        <span class="payment-icon"
              v-if="item.payTypeId === 5">
          <i class="iconfont icon-yibei1" /> {{OrderDetail.epay}}
        </span>
        <span class="payment-message">
          <el-tooltip class="item"
                      effect="dark"
                      :content="OrderDetail.copy"
                      placement="bottom">
            <span @click="copy"
                  v-clipboard="item.accountName">{{item.accountName}}</span>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      :content="OrderDetail.copy"
                      placement="bottom">
            <span style="margin-left:10px"
                  @click="copy"
                  v-clipboard="item.account">{{item.account}}</span>
          </el-tooltip>

          <el-tooltip class="item"
                      effect="dark"
                      :content="OrderDetail.copy"
                      placement="bottom"
                      v-if="item.payTypeId === 4">
            <span style="margin-left:10px"
                  @click="copy"
                  v-clipboard="item.openBank">{{item.openBank}}-</span>
          </el-tooltip>
          <el-tooltip class="item"
                      effect="dark"
                      :content="OrderDetail.copy"
                      placement="bottom"
                      v-if="item.payTypeId === 4">
            <span @click="copy"
                  v-clipboard="item.openSubbranch">{{item.openSubbranch}}</span>
          </el-tooltip>
          <i class="iconfont icon-erweima"
             style="font-size:12px;color:#6AA0FF;margin-left:8px;"
             v-if="item.payTypeId !== 4 && item.payTypeId !== 5 && item.payTypeId !== 1">
            <img :src="item.url"
                 width="142">
          </i>
        </span>
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status === PENDING">
        <template v-if="locale === 'zh_cn'">
          {{OrderDetail.sellNoPay2[0].replace('$1', orderStatus.nickname)}}
          <count-down :minute="orderStatus.countdown"
                      :trade-no="orderStatus.otcTrade.tradeNo" /> {{OrderDetail.sellNoPay2[1]}}
          <h4 class="font-violet">
            {{orderStatus.otcTrade.total | formatCurrency}} {{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}
          </h4>
          {{OrderDetail.sellNoPay2[2]}}
          <number :remarks="orderStatus.otcTrade.remarkNum" />
        </template>
        <!-- en -->
        <template v-else>
          {{OrderDetail.sellNoPay2[0]}}, {{OrderDetail.sellNoPay2[1]}}
          <h4 class="font-violet">
            {{orderStatus.otcTrade.total | formatCurrency}} {{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}
          </h4>
          {{OrderDetail.sellNoPay2[2]}}
          <count-down :minute="orderStatus.countdown"
                      :trade-no="orderStatus.otcTrade.tradeNo" /> {{OrderDetail.sellNoPay2[3]}}
          <number :remarks="orderStatus.otcTrade.remarkNum" />
        </template>
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status === PAID">
        {{OrderDetail.sellWaitTxt[0]}} {{orderStatus.nickname}} {{OrderDetail.sellWaitTxt[1]}}
        <number :remarks="orderStatus.otcTrade.remarkNum" />
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status === FINISH">
        <i class="iconfont icon-weixuanzhong"
           style="margin-right:16px" />{{OrderDetail.sellrFinsh}}
        <number :remarks="orderStatus.otcTrade.remarkNum" />
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == CANCEL">
        <span v-if="orderStatus.otcTrade.status == CANCEL"
              class="cancel-message">{{OrderDetail.canceledTxt.split('$$$')[0]}} </span>
        <div>
          <i class="el-icon-error"
             style="margin-right:4px" /> {{OrderDetail.canceledTxt.split('$$$')[1]}}
          <number :remarks="orderStatus.otcTrade.remarkNum" />
        </div>
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == APPEALING">
        <i class="iconfont icon-zhuyi" /> {{OrderDetail.appealing}}
        <number :remarks="orderStatus.otcTrade.remarkNum" />
      </div>
      <div class="button">
        <el-button type="primary"
                   @click="display=true"
                   v-if="orderStatus.otcTrade.status === PAID">{{OrderDetail.intoAccountBtn}}</el-button>
        <a @click="appealDialogVisible = true"
           v-if="orderStatus.otcTrade.status === PAID">{{OrderDetail.appealBtn}}</a>

        <!-- v-if="orderStatus.otcTrade.status === PAID" -->
      </div>
      <label class="pending-waring"
             v-if="orderStatus.otcTrade.status === PAID">{{OrderDetail.btnSellTips}}</label>
      <Warning type="sellr" />
    </div>
    <div class="content-right">
      <IM :is-sellr="true">
      </IM>
    </div>
    <appeal :dialogVisible="appealDialogVisible"
            :handle-close="handleClose"
            :handle-ok="handleOk"
            :bussinesType="'seller'"
            :trade-no="!!orderStatus && orderStatus.otcTrade.tradeNo" />
    <el-dialog :title="OrderDetail.throughTit"
               :visible.sync="display"
               class="order-dialog"
               width="408px"
               :before-close="close">
      <span class="modal-content">
        <!-- <i class="iconfont icon-yiwen"></i> -->
        {{OrderDetail.throughCon}}</span>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="modal-cancel-btn"
                   @click="close">{{OrderDetail.cancel}}</el-button>
        <el-button class="modal-confirm-btn"
                   @click="handleClick"
                   :loading="loading">{{OrderDetail.throughSubmit}}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import countDown from './CountDown.vue';
import { mapState, mapActions } from 'vuex';
import Appeal from '../Modal/Appeal.vue';
import Warning from './Warning.vue';
import { ORDER_CONFIRM_ACTIONS, ORDER_CANCEL_ACTIONS, ORDER_STATUS_LIST_ACTIONS } from '~/store/modules/order/type';
import { AD_GET_USERPAYLIST_ACTIONS } from '~/store/modules/ad/type';
import Number from './Number.vue';
import IM from './IM/';
// import {PENDING, CANCEL, PAID, FINISH, APPEALING} from '~/utils/constant.js'

export default {
  components: {
    countDown,
    Number,
    Appeal,
    IM,
    Warning,
  },
  data() {
    return {
      display: false,

      dialogVisible: false,
      appealDialogVisible: false,
      PENDING: 'PENDING',
      CANCEL: 'CANCEL',
      PAID: 'PAID',
      FINISH: 'FINISH',
      APPEALING: 'APPEALING',
      loading: false,
    };
  },
  // async mounted() {
  //   await this.getUserPayList();
  // },
  computed: {
    ...mapState({
      locale: state => state.locale,
      OrderDetail: state => state.i18n.App.OrderDetail,
      AdList: state => state.i18n.App.AdList,
      userPayList: state => state.ad.userPayList,
      orderStatus: state => {
        return state.order.orderStatus;
      },
      ErrCode: state => {
        return state.i18n.App.ErrCode;
      },
    }),
  },
  methods: {
    ...mapActions({
      confirm: ORDER_CONFIRM_ACTIONS,
      cancel: ORDER_CANCEL_ACTIONS,
      getOrder: ORDER_STATUS_LIST_ACTIONS,
      getUserPayList: AD_GET_USERPAYLIST_ACTIONS,
    }),
    orderStatusTxt(val) {
      if (!val) {
        return '';
      }
      switch (val) {
        case 'CANCEL':
          return this.AdList.orderStatus[0];
          break;
        case 'PENDING':
          return this.AdList.orderStatus[1];
          break;
        case 'PAID':
          return this.AdList.orderStatus[2];
          break;
        case 'FINISH':
          return this.AdList.orderStatus[3];
          break;
        case 'APPEALING':
          return this.AdList.orderStatus[4];
          break;
        default:
          break;
      }
    },
    close() {
      this.display = false;
    },
    async handleClick() {
      this.loading = true;
      let res = await this.confirm({
        admin: false,
        tradeId: this.orderStatus.otcTrade.tradeNo,
      });
      this.close();
      this.loading = false;
      if (res === 200) {
        await this.getOrder(this.orderStatus.otcTrade.tradeNo);
      } else {
        this.$message.error(`${this.ErrCode[res]}`);
      }
    },
    async cancelOrder() {
      let res = await this.cancel({
        admin: false,
        tradeId: this.orderStatus.otcTrade.tradeNo,
      });
      if (res === 200) {
        await this.getOrder(this.orderStatus.otcTrade.tradeNo);
      } else {
        this.$message.error(`${this.ErrCode[res]}`);
      }
    },
    async handleOk() {
      this.appealDialogVisible = false;
      await this.getOrder(this.orderStatus.otcTrade.tradeNo);
    },
    handleClose() {
      this.appealDialogVisible = false;
    },
    copy() {
      this.$message.success(this.OrderDetail.sucCopy);
    },
  },
};
</script>

<style>
</style>
