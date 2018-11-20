<template>
  <div class="im"
       v-loading="fullscreenLoading">
    <div class="im-header">
      <div class="left">
        <Avatar :name="orderStatus.nickname|firstUpperChar"
                defaultBkColor="#9FB1DE" />
      </div>
      <div class="right">
        <div class="name">{{orderStatus.nickname}}</div>
        <div class="order">{{OrderDetail.completeOrder}}{{userInfo.dealInThirty}}</div>
      </div>
    </div>
    <div class="im-body"
         ref="message">
      <div class="im-title">
        <div class="remind">
          <div v-for="(item, index) in TradeList.intro.split('@')"
               :key="index">
            <span>{{item}}</span>
          </div>
        </div>
        <div class="time">{{orderStatus.otcTrade.createDate|dubaiDate('YYYY-MM-DD')}}</div>
        <div class="waring">{{isBuy?OrderDetail.IMBuyStatus['PENDING']:OrderDetail.IMSellStatus['PENDING']}}{{orderStatus.otcTrade.createDate|dubaiDate('HH:mm:ss')}}</div>
      </div>
      <div class="message-wrapper">
        <message v-for="(item, index) in messageList"
                 :key="item.id"
                 :item="item"
                 :lastReadAt="lastReadAt"
                 :lastDeliveredAt="lastDeliveredAt"
                 :nickName="userInfo.nickName"
                 :nextMessage="messageList[index + 1]"
                 :is-buy="isBuy"
                 :is-sellr="isSellr"
                 :trade-no="orderStatus.otcTrade.tradeNo" />
      </div>
    </div>
    <div class="im-input">
      <el-input type="textarea"
                v-model="message"
                :autosize="false"
                :maxlength="140"
                :placeholder="OrderDetail.inputHolder"
                @keyup.stop.prevent.native.enter="handleSubmit" />
      <el-upload accept="image/png,image/gif,image/jpeg,image/bmp"
                 :action="uploadUrl"
                 :show-file-list="false"
                 :with-credentials="true"
                 :on-success="handleSuccess">
        <i class="iconfont icon-shangchuanfujian"></i>
      </el-upload>
      <!-- <input type="file"
             class="file"> -->
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar.vue';
import { mapState, mapActions } from 'vuex';
import leancloud from '~/utils/leancloud';
import { Event, Message } from 'leancloud-realtime';
import { GET_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import message from './message.vue';
import { QUERY_IM_CONV_ID, ADD_IM_CONV } from '~/store/modules/order/type';
import Configs from '~/common/config';
export default {
  props: {
    isBuy: {
      type: Boolean,
      default: false,
    },
    isSellr: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Avatar,
    message,
  },
  data() {
    return {
      message: '',
      messageList: [],
      lastreadAt: '',
      fullscreenLoading: false,
      lastReadAt: '',
      lastDeliveredAt: '',
      conversation: null,
      uploadUrl: Configs.DEFAULT.UPLOAD_API,
      isOut: false,
    };
  },
  filters: {
    toBr(str) {
      return str.replace(/@/g);
    },
  },
  methods: {
    ...mapActions({
      getUserInfo: GET_USER_INFO_ACTIONS,
      queryIMConvId: QUERY_IM_CONV_ID,
      addIMConv: ADD_IM_CONV,
    }),
    async handleSubmit(e) {
      e.preventDefault();
      this.message = this.message.replace(/[\r\n]/g, ''); //去掉回车换行
      if (!this.message || this.message === '') return false;
      let res = await leancloud.sendText(this.message);
      this.messageList.push(res);
      this.scrollBottom();
      this.message = '';
    },
    bindIMEvent() {
      leancloud.bindEvent(Event.DISCONNECT, () => {
        this.$message.error(this.OrderDetail.serveMes[0]);
      });
      leancloud.bindEvent(Event.OFFLINE, () => {
        this.$message.error(this.OrderDetail.serveMes[1]);
      });
      leancloud.bindEvent(Event.ONLINE, () => {
        this.$message.error(this.OrderDetail.serveMes[2]);
      });
      leancloud.bindEvent(Event.RECONNECT, () => {
        this.$message.success(this.OrderDetail.serveMes[3]);
      });
      //leancloud.bindCovEvent(Event.MESSAGE, msg => leancloud.readMarket(msg));
      leancloud.bindCovEvent(Event.MESSAGE, msg => {
        //监听收到消息事件
        // 如果收到未知类型的暂态消息，直接丢弃
        if (msg.transient && msg.type === Message.TYPE) {
          return;
        }
        this.messageList.push(msg);
        this.scrollBottom();
        leancloud.readMarket(msg);
      });
      leancloud.bindCovEvent(Event.LAST_READ_AT_UPDATE, this.listenMessage);
      leancloud.bindCovEvent(Event.LAST_DELIVERED_AT_UPDATE, this.listenMessage);

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.conversation.unreadMessagesCount) {
          this.conversation.read();
        }
      });
    },
    listenMessage() {
      this.lastDeliveredAt = this.conversation.lastDeliveredAt; //送达时间
      this.lastReadAt = this.conversation.lastReadAt; //已读时间
    },
    scrollBottom() {
      this.$nextTick(() => {
        if (!this.$refs.message) return;
        this.$refs.message.scrollTop = this.$refs.message.scrollHeight;
      });
    },
    async handleSuccess(res, files, fileList) {
      if (!res | (res.code !== 200)) return;
      let message = await leancloud.sendImgText(res.data.filePath);
      this.messageList.push(message);
      this.scrollBottom();
    },
    async createdConv() {
      try {
        await leancloud.createConversation(this.orderStatus.nickname); //创建会话 orderStatus.nickname
        await this.addIMConv({
          sessionId: leancloud.conversation.id,
          orderId: this.orderStatus.otcTrade.tradeNo,
        });
      } catch (error) {
        this.fullscreenLoading = false;
      }
    },
  },
  computed: {
    ...mapState({
      orderStatus: state => state.order.orderStatus,
      userInfo: state => state.member.userInfo,
      OrderDetail: state => state.i18n.App.OrderDetail,
      TradeList: state => state.i18n.App.TradeList,
    }),
  },
  async mounted() {
    this.fullscreenLoading = true;
    let { orderStatus } = this;
    await this.getUserInfo();
    let convId = await this.queryIMConvId(orderStatus.otcTrade.tradeNo);
    const clientId = this.userInfo.nickName;
    //const name = this.userInfo.nickName === 'Lee' ? 'FLee' : 'Lee';
    //建立连接
    await leancloud.login(clientId).then(userClient => {
      leancloud.setClient(userClient);
      leancloud.connected = true;
    });
    if (!convId && !!orderStatus && orderStatus.nickname) {
      await this.createdConv();
    } else {
      try {
        await leancloud.getConversation(convId);
      } catch (error) {
        await this.createdConv();
        this.fullscreenLoading = false;
      }
    }

    this.messageList = await leancloud.loadMoreMessages(); //获取历史消息
    this.scrollBottom();
    this.fullscreenLoading = false;
    this.conversation = leancloud.conversation;
    this.bindIMEvent();
    // 标记为已读
    this.conversation.read();
    // 这么做是因为，用户进来，IM开始初始化，还没初始化完毕时用户又退了，会报错。所以这样处理一下
    if (this.isOut) {
      leancloud.close();
    }
  },

  beforeDestroy() {
    this.isOut = true;
    leancloud.close();
  },
};
</script>

<style lang="scss">
.im {
  background: #ffffff;
  box-shadow: 0 0 8px 0 rgba(53, 73, 137, 0.12);
  border-radius: 4px;
  width: 100%;
  height: 100%;
  .im-header {
    height: 83px;
    padding: 20px;
    border-bottom: 1px solid #f5f6f9;
    display: flex;
    .right {
      margin-left: 20px;
      .name {
        font-size: 16px;
        color: #354989;
      }
      .order {
        font-size: 14px;
        color: #7d86ac;
      }
    }
  }
  .im-body {
    padding: 20px;
    height: 405px;
    overflow: auto;
    .im-title {
      text-align: center;
      font-size: 12px;
      color: #7d86ac;
      .remind {
        margin-bottom: 20px;
        & > div {
          display: flex;
          justify-content: center;
          line-height: 16px;
          & > span {
            text-align: left;
          }
        }
      }
    }
    .message-wrapper {
      .row {
        margin-top: 22px;
        .message-container {
          display: flex;
        }
        .last-read {
          font-size: 12px;
          color: #a8afcd;
        }
        .message {
          width: 180px;
          font-size: 12px;
          color: #354989;
          background: #f5f9ff;
          border-radius: 6px;
          padding: 10px 14px;
          margin-left: 12px;
          margin-right: 14px;
          word-break: break-all;
          word-wrap: break-word;
        }
        .img-message {
          width: 175px;
          height: auto;
          margin-left: 12px;
          margin-right: 14px;
        }
        .message-time {
          font-size: 12px;
          color: #a8afcd;
          text-align: center;
          margin-top: 8px;
        }
      }
    }
  }
  .im-input {
    height: 62px;
    position: relative;
    border-top: 1px solid #f5f6f9;
    .el-textarea {
      textarea {
        resize: none;
        outline: none;
        border: 0;
        width: 100%;
        height: 100%;
        padding: 20px;
        &::-webkit-input-placeholder {
          font-size: 14px;
          color: #a8afcd;
        }
      }
    }
    i {
      position: absolute;
      top: 24px;
      right: 9px;
      font-size: 12px;
    }
    .file {
      position: absolute;
      top: 14px;
      right: 0px;
      width: 0px;
      height: 0px;
      opacity: 0;
    }
  }
}
</style>
