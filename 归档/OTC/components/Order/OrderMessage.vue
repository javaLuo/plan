<template>
  <div class="order-message">
    <h4 class="order-msg-title">
      <span class="rfixed"
            @click="setROrder"
            v-if="hasFixed">
        {{ preRightOrderShow ? '' : OrderMsgLanguage.rightFixed}}
        <i :class="['icon', 'iconfont', preRightOrderShow ? 'icon-quxiao' : 'icon-guding']"></i>
      </span>
      {{OrderMsgLanguage.activeOrderText}}
    </h4>
    <div class="order-msg-content">
      <ul v-if="orderNotice && orderNotice.length">
        <li v-for="(item, index) in orderNotice"
            :key="index"
            @click="turnOrderDetail(item.tradeNo)">
          <Avatar :name="item.nickName|firstUpperChar"
                  :id="item.userId" />
          <dl>
            <dd>
              <span :class="['dir', {buy: item.tradeType === 1}, {sell: item.tradeType === 0}]">{{item.tradeType === 1 ? Common.tradeItem[1] : Common.tradeItem[0]}}</span> {{item.asset}}
              <span class="total">{{OrderMsgLanguage.total}}: </span> {{item.total}}{{item.payAsset}} </dd>
            <dd>{{OrderMsgLanguage.status[item.status]}} - {{item.timeStamp | dubaiDate}}</dd>
          </dl>
        </li>
      </ul>
      <div class="no-data"
           v-else>
        <div class="no-data-bg"></div>
        <p class="no-data-tip">{{OrderMsgLanguage.emptyOrderText}}</p>
      </div>
    </div>
    <div class="order-msg-footer">
      <nuxt-link to="/order/orderList">{{OrderMsgLanguage.allOrderText}}&gt;</nuxt-link>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar.vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import OtcSocket from '~/utils/otcsocket';
import Configs from '~/common/config';
import * as orderTypes from '~/store/modules/order/type';
import { GET_USER_INFO_ACTIONS } from '~/store/modules/member/type';

export default {
  data() {
    return {
      hasFixed: true,
    };
  },
  components: {
    Avatar,
  },
  computed: {
    ...mapState({
      rightOrderShow: state => state.rightOrderShow,
      preRightOrderShow: state => state.preRightOrderShow,
      orderNotice: state => state.order.orderNotice,
      userId: state => state.member.userInfo.userId,
      Common: state => state.i18n.App.Common,
      OrderMsgLanguage: state => state.i18n.App.OrderMessage,
    }),
  },
  filters: {
    firstUpperChar: str => {
      if (!!str) {
        return str
          .trim()
          .substr(0, 1)
          .toUpperCase();
      }
      return '';
    },
  },
  methods: {
    ...mapMutations(['setROrder', 'setOrderHide', 'setOrderShow', 'addNotice']),
    ...mapActions({
      queryTradeWebsocket: orderTypes.QUERY_TRADE_WEBSOCKET,
      updateTradeWebsocket: orderTypes.UPDATE_TRADE_WEBSOCKET,
      getUserInfo: GET_USER_INFO_ACTIONS,
    }),
    turnOrderDetail(id) {
      this.$router.push({ path: `/order/orderDetail/${id}` });
    },
    initWS() {
      OtcSocket.init({ url: Configs.DEFAULT.SOCKET_URL + '/tradeWebSocket/websocket' });
      OtcSocket.ws.connect({}, frame => {
        OtcSocket.ws.subscribe(`/user/${this.userId}/OrderMsg`, res => {
          let orderRes = JSON.parse(res.body);
          this.addNotice(orderRes);
          console.log('返回值1', JSON.parse(res.body));
          console.log('返回值2', this.orderNotice);
        });
      });
    },
  },
  async mounted() {
    let deviceWidth = document.documentElement.offsetWidth || document.body.offsetWidth;
    if (deviceWidth <= 1600) {
      this.hasFixed = false;
    }
    window.addEventListener('resize', e => {
      let deviceWidth = document.documentElement.offsetWidth || document.body.offsetWidth;
      if (deviceWidth <= 1600) {
        this.hasFixed = false;
        this.preRightOrderShow && this.setOrderHide();
      } else {
        this.hasFixed = true;
        this.preRightOrderShow ? this.setOrderShow() : this.setOrderHide();
      }
    });

    //如果socket已初始化，不继续往下走
    if (!!OtcSocket.ws) return;
    await this.getUserInfo();
    if (!this.userId) return;
    //初始化ws
    this.initWS();
    //获取当前用户历史订单信息
    this.queryTradeWebsocket({ userid: this.userId });
  },
};
</script>

<style scoped lang="scss">
.order-message {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9999;
  right: 0;
  top: 0;
  width: 344px;
  height: 100%;
  border-radius: 4px;
  background: #fff;
  border-left: 1px solid #d3d8e6;

  &:before {
    content: '';
    position: absolute;
    top: -16px;
    left: 50%;
    width: 0;
    height: 0;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent #fff;
  }

  .order-msg-title {
    overflow: hidden;
    height: 58px;
    line-height: 58px;
    font-size: 18px;
    color: #b3c5f3;
    text-indent: 26px;
    padding-right: 26px;
    background: #01154b;
    border-bottom: 1px solid #f5f6f9;

    .rfixed {
      float: right;
      font-size: 14px;
      color: #a8afcd;
      cursor: pointer;
      font-weight: normal;
      i {
        margin: 0;
      }
    }
  }

  .order-msg-content {
    flex: 1;
    overflow: auto;
  }

  ul {
    padding: 0 26px;
    li {
      padding: 22px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;

      &:not(:last-of-type) {
        border-bottom: 1px solid #f5f6f9;
      }

      dl {
        font-size: 14px;
        line-height: 1.4;
        flex: 1;
        margin-left: 20px;
      }

      dd {
        color: #354989;

        .dir.buy {
          color: #29a76c;
        }
        .dir.sell {
          color: #29a76c;
        }
        .total {
          padding-left: 14px;
          color: #a8afcd;
        }

        &:last-of-type {
          color: #7d86ac;
        }
      }
    }
  }

  .no-data {
    margin-top: 50%;
    &-bg {
      width: 48px;
      height: 50px;
      margin: 0 auto;
      background: url(~/assets/images/no-result.png) no-repeat center / contain;
    }
    &-tip {
      margin-top: 12px;
      color: #d3d8e6;
      text-align: center;
      font-size: 12px;
      line-height: 100%;
    }
  }

  .order-msg-footer {
    height: 48px;
    line-height: 48px;
    border-top: 1px solid #f5f6f9;
    text-align: right;

    a {
      font-size: 14px;
      display: inline-block;
      padding-right: 28px;
      color: #6aa0ff;
    }
  }
}
</style>