<template>
  <div class="content">
    <div class="content-left">
      <div class="content-title">
        <span>{{OrderDetail.order}}# {{orderStatus.otcTrade.tradeNo}}</span>
        <span>{{orderStatus.otcTrade.createTime| dubaiDate}}</span>
        <a @click="cancelOrder"
           v-if="orderStatus.otcTrade.status == PENDING">{{OrderDetail.cancelTit}}</a>
        <!-- <a v-if="orderStatus.otcTrade.status != PENDING">{{orderStatus.otcTrade.status|orderSellerStatusText}}</a> -->
        <span v-if="orderStatus.otcTrade.status != PENDING">{{orderStatusTxt(orderStatus.otcTrade.status)}}</span>
      </div>
      <div class="content-detail">
        <div class="name">
          {{OrderDetail.buyMemo[0]}}&nbsp;{{orderStatus.nickname}}&nbsp;{{OrderDetail.buyMemo[1]}} {{orderStatus.otcTrade.amountStr}}{{orderStatus.otcTrade.asset}}
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
             style="font-size:12px;"
             v-if="item.payTypeId !== 4 && item.payTypeId !== 5 && item.payTypeId !== 1">
            <img :src="item.url"
                 width="142">
          </i>
        </span>
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == PENDING">
        <template v-if="locale === 'zh_cn'">
          {{OrderDetail.buyNoPay.split('$$$')[0]}}
          <count-down :minute="orderStatus.countdown"
                      :trade-no="orderStatus.otcTrade.tradeNo" /> {{OrderDetail.buyNoPay.split('$$$')[1].replace(/%s/, orderStatus.nickname)}}
          <h4 class="font-violet">
            {{orderStatus.otcTrade.total | formatCurrency}} {{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}
          </h4>
          {{OrderDetail.buyNoPay.split('$$$')[2]}}
          <number :remarks="orderStatus.otcTrade.remarkNum" />
        </template>
        <template v-else>
          {{OrderDetail.buyNoPay.split('$$$')[0]}}
          <h4 class="font-violet">
            {{orderStatus.otcTrade.total | formatCurrency}} {{orderStatus.otcTrade.payAsset === 0 ?'CNY':'USD'}}
          </h4>
          {{OrderDetail.buyNoPay.split('$$$')[1]}} {{orderStatus.nickname}} {{OrderDetail.buyNoPay.split('$$$')[2]}}
          <count-down :minute="orderStatus.countdown"
                      :trade-no="orderStatus.otcTrade.tradeNo" /> {{OrderDetail.buyNoPay.split('$$$')[3]}}
          <number :remarks="orderStatus.otcTrade.remarkNum" />
        </template>
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == APPEALING">
        <i class="iconfont icon-zhuyi" /> {{OrderDetail.appealing}}
        <number :remarks="orderStatus.otcTrade.remarkNum" />
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == PAID">
        {{OrderDetail.buyWaitTxt[0]}}{{orderStatus.nickname}} {{OrderDetail.buyWaitTxt[1]}}
        <number :remarks="orderStatus.otcTrade.remarkNum" />
      </div>
      <div class="trade-message"
           v-if="orderStatus.otcTrade.status == FINISH">
        <i class="iconfont icon-weixuanzhong"
           style="margin-right:4px" />{{OrderDetail.complete}}
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

      <div class="button">
        <el-button type="primary"
                   @click="display=true"
                   v-if="orderStatus.otcTrade.status == PENDING">{{OrderDetail.sign}}</el-button>
        <a @click="dialogVisible= true"
           v-if="orderStatus.otcTrade.status == PAID">{{OrderDetail.appealBtn}}</a>
        <!-- v-if="orderStatus.otcTrade.status == PAID" -->
        <el-button type="primary"
                   @click="showTransFormModal = true"
                   v-if="orderStatus.otcTrade.status == FINISH">{{OrderDetail.handle}}</el-button>
      </div>
      <label class="pending-waring"
             v-if="orderStatus.otcTrade.status == PENDING">{{OrderDetail.btnBuyTips}}</label>
      <Warning type="buy" />
    </div>
    <div class="content-right">
      <IM :is-buy="true">
      </IM>
    </div>
    <appeal :dialogVisible="dialogVisible"
            :handle-close="handleClose"
            :handle-ok="handleOk"
            :bussinesType="'buy'"
            :trade-no="!!orderStatus && orderStatus.otcTrade.tradeNo" />
    <!-- 资金划转操作框 不需要给total(QA要求) :total="orderStatus.otcTrade.amountStr"-->
    <transfer-modal :display="showTransFormModal"
                    :close="handleTransFormClose"
                    :coinType="orderStatus.otcTrade.asset"></transfer-modal>
    <!-- 确认付款成功弹框 -->
    <el-dialog :title="OrderDetail.dialogPay.title"
               :visible.sync="display"
               width="408px"
               class="order-dialog"
               :before-close="close">
      <span class="modal-content">
        <!-- <i class="iconfont icon-yiwen"></i> -->
        {{OrderDetail.dialogPay.content}}</span>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="modal-cancel-btn"
                   @click="close">{{OrderDetail.cancel}}</el-button>
        <el-button class="modal-confirm-btn"
                   @click="handleClick"
                   :loading="loading">{{OrderDetail.paySubmit}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import countDown from './CountDown.vue';
import Appeal from '../Modal/Appeal.vue';
import TransferModal from '../Modal/TransferModal';
import { mapState, mapActions } from 'vuex';
import Number from './Number.vue';
import Warning from './Warning.vue';
import { ORDER_PAY_ACTIONS, ORDER_CANCEL_ACTIONS, ORDER_STATUS_LIST_ACTIONS } from '~/store/modules/order/type';
import { PENDING, CANCEL, PAID, FINISH, APPEALING } from '~/utils/constant';
import OrderListVue from './OrderList.vue';
import IM from './IM/';
export default {
  components: {
    countDown,
    Appeal,
    TransferModal,
    Number,
    IM,
    Warning,
  },
  data() {
    return {
      dialogVisible: false,
      display: false,
      showTransFormModal: false,
      PENDING: 'PENDING',
      CANCEL: 'CANCEL',
      PAID: 'PAID',
      FINISH: 'FINISH',
      APPEALING: 'APPEALING',
      fullscreenLoading: false,
      loading: false, // 是否正在请求中
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      OrderDetail: state => state.i18n.App.OrderDetail,
      AdList: state => state.i18n.App.AdList,
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
      pay: ORDER_PAY_ACTIONS,
      cancel: ORDER_CANCEL_ACTIONS,
      getOrder: ORDER_STATUS_LIST_ACTIONS,
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
    handleClose() {
      this.dialogVisible = false;
    },
    async handleOk() {
      this.dialogVisible = false;
      await this.getOrder(this.orderStatus.otcTrade.tradeNo);
    },
    close() {
      this.display = false;
    },
    async handleClick() {
      this.loading = true;
      let res = await this.pay({
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
    handleTransFormClose() {
      this.showTransFormModal = false;
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
    copy() {
      this.$message.success(this.OrderDetail.sucCopy);
    },
    send() {
      let id = this.$imConn.getUniqueId(); // 生成本地消息id
      let msg = this.$WebIM.message('txt', id); // 创建文本消息
      msg.set({
        msg: 'message content', // 消息内容
        to: 'fredlee', // 接收消息对象（用户id）
        roomType: false,
        success: function(id, serverMsgId) {
          console.log('send private text Success');
        },
        fail: function(e) {
          console.log('Send private text error');
        },
      });
      msg.body.chatType = 'singleChat';
      this.$imConn.send(msg.body);
    },
  },
};
</script>

<style>
</style>
