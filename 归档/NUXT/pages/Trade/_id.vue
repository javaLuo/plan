<template>
  <section :class="`trade-page ${theme}`">
    <div class="l">
      <!-- 左侧深度图 -->
      <Deep :i18n="i18n"
            :zi="zi"
            :mu="mu"
            :theme="theme"
            :askData="depthData.ask"
            :bidData="depthData.bid"
            :lastPrice="last.lastPrice"
            :lastChange="last.change"
            :minAmountData="minAmountData"
            :accuracy="depthChose"
            :depthChoseData="depthChoseData"
            @onAccuracyChange="onDepthChose"
            @onDataClick="onDeepDataClick" />
    </div>
    <div class="r">
      <div class="row">
        <!-- 图表 -->
        <div class="tv">
          <TradingView id="tv_chart_container"
                       :i18n="i18n"
                       :mu="mu"
                       :zi="zi"
                       :theme="theme"
                       :askData="depthData.ask"
                       :bidData="depthData.bid"
                       :minAmountData="minAmountData"
                       :baseURL="baseURL"
                       :locale="locale"
                       :kdata="newKData"
                       :last="last"
                       :interval="interval"
                       :socketType="socketType"
                       @onIntervalChanged="onIntervalChanged" />
        </div>
        <!-- 市场 -->
        <div class="market">
          <Market :i18n="i18n"
                  :mu="mu"
                  :zi="zi"
                  :theme="theme"
                  :sourceData="marketData"
                  :isLogin="isLogin"
                  @onCollect="onCollect"
                  @onSymbolChange="onSymbolChange" />
        </div>
      </div>
      <div class="row">
        <!-- 用户操作区 -->
        <div class="user-control">
          <ControlBuy :i18n="i18n"
                      :mu="mu"
                      :zi="zi"
                      :theme="theme"
                      :isLogin="isLogin"
                      :minAmountData="minAmountData"
                      :canUseData="canUseData"
                      :loading="buyLoading"
                      :singleValue="singleValue"
                      @onSubmit="onBuy" />

          <ControlSell :i18n="i18n"
                       :mu="mu"
                       :zi="zi"
                       :theme="theme"
                       :isLogin="isLogin"
                       :minAmountData="minAmountData"
                       :canUseData="canUseData"
                       :loading="sellLoading"
                       :singleValue="singleValue"
                       @onSubmit="onSell" />
        </div>
        <!-- 最新成交记录 -->
        <div class="history">
          <DealHistory :i18n="i18n"
                       :mu="mu"
                       :zi="zi"
                       :theme="theme"
                       :sourceData="sellbuyData"
                       :minAmountData="minAmountData" />
        </div>
      </div>
      <!-- 委托历史 -->
      <div class="order">
        <OrderHistory :i18n="i18n"
                      :mu="mu"
                      :zi="zi"
                      :theme="theme"
                      :sourceData="orderData"
                      :minAmountData="minAmountData"
                      :tabsChose="orderWhich"
                      :filterChose="orderFilter"
                      :loading="orderLoading"
                      @onChange="onOrderChoseChange"
                      @onCancel="onOrderCancel" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { selectGroup, selectAvaCoin, saveLove, setSymbol, selectMinAmount, addOrder, selectOpenOrder, selectHistoryOrder, saveOrder, saveMarketData } from '~/store/modules/trade/types';

import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import Storage from '~/utils/storage';
import Configs from '~/common/config';

import TradingView from '~/components/TradeComs/TradingView';
import Deep from '~/components/TradeComs/Deep';
import DealHistory from '~/components/TradeComs/DealHistory';
import Market from '~/components/TradeComs/Market';
import ControlBuy from '~/components/TradeComs/ControlBuy';
import ControlSell from '~/components/TradeComs/ControlSell';
import OrderHistory from '~/components/TradeComs/OrderHistory';

let isInPage = false; // 是否在当前页面，因为workerTimer/socket各方法都是异步的，有可能停不掉，所以这个来判定
export default {
  /** ========= 数据 ========= **/
  async asyncData(context) {
    const path = context.route.path
      .split('/')
      .pop()
      .split('_');

    //如果是交易页面，设置activepage为交易页面，专门给交易页面的footer和header加样式
    // if (context.route.name === 'Trade-id') {
    //   context.store.dispatch('setTradePage', 'trade');
    // }

    if (path.length === 2) {
      return {
        zi: path[0],
        mu: path[1],
      };
    }
  },

  data() {
    return {
      // zi: Configs.DEFAULT.zi, // 子币
      // mu: Configs.DEFAULT.mu, // 母币

      tradeSocket: null, // socket实例
      interval: '60', // 当前选择的时间间隔
      sellbuyData: [], // 历史成交记录数据
      orderData: { activeOrders: [], historyOrders: [] }, // 用户的订单数据
      depthData: { ask: [], bid: [] }, // 左侧深度数据
      depthChoseData: [{ name: '0.00000000', val: '8' }], // 所有的深度可选择的单位
      depthChose: '8', // 所选择的深度精度
      buyPercent: 0, // 买的百分比
      buySingle: 0, // 买的单价
      SellPercent: 0, // 卖的百分比
      SellSingle: 0, // 卖的单价
      canUseData: {}, // 当前用户所有资产
      socketSubscribe: {}, // 所有打开的socket监听，退出时需要关掉
      newKData: null, // 最新的K线数据，用于更新图表
      buyLoading: false, // buy组件 - 是否正在购买
      sellLoading: false, // sell组件 - 是否正在出售
      orderWhich: 0, // order组件 - 记录选的最新委托/历史委托
      orderFilter: 'all', // order组件 - 记录选的所有/买/卖
      orderLoading: false, // order组件 - 是否正在请求数据
      singleValue: { v: '' }, // 买和卖组件 - 设置单价输入框的值
      workerTimers: null, // 用workerTimer代替setTimeout,因为setTimeout在切换窗口时会休眠
      workerTimerId: null, // 记录这个setTimeout的ID，离开此页面时需要清理
      groupTime: 0, // 市场数据 轮询的时间间隔，第1次直接执行
      socketErrorTimer: null, // 记录断线重连时的timer,离开页面时需清理
      socketConnectedTimer: null, // 等待socket连上的Timer,离开页面时需清理
      orderTimer: null, // 获取订单数据轮询的timer
      socketType: false, // socket当前状态是否已连接
    };
  },

  /** ========= 组件 ========= **/
  components: {
    TradingView,
    Deep,
    DealHistory,
    Market,
    ControlBuy,
    ControlSell,
    OrderHistory,
  },

  /** =========== 监听 ============ **/
  watch: {
    // 用户改变了深度精度，重新socket监听新的精度数据
    depthChose(newV) {
      // this.depthData = { ask: [], bid: [] };
      this.startDepthData(newV);
    },
    // 深度信息改变
    depthChoseData(newV) {
      if (!newV.find(item => item.val === this.depthChose)) {
        this.depthChose = newV[newV.length - 1].val;
      }
    },
  },

  /** ========= 生命周期 ========= **/
  async mounted() {
    document.querySelector('header').style.minWidth = '1440px';
    document.querySelector('footer').style.minWidth = '1440px';
    window.scrollTo(0, 0);
    const symbol = await this.checkSymbol(); // 从URL中解析交易对 | 必须同步等待，因为接着要初始化socket
    this.mu = symbol.mu;
    this.zi = symbol.zi;

    if (this.isLogin) {
      if (!this.userInfo || !this.userInfo.userId) {
        await this.$store.dispatch('user/getUserInfo'); // 获取用户信息 | 必须同步等待，因为接着要获取用户资产
      }
      this.onOrderChoseChange(0, 'all'); // 获取历史订单
      this.getOrderInfoByTimer(); // 轮询订单数据
    }
    this.getCanUse(); // 获取用户所有资产
    this.workerTimers = require('worker-timers'); // 轮询市场数据所需

    history.replaceState({}, 'RightBTC', `/trade/${symbol.zi}_${symbol.mu}`);

    isInPage = true;

    this.initSocket(); // 初始化socket
    this.getGroups(); // 获取一次全部市场数据

    await this.selectMinAmount(); // 获取最小精度等信息
    // this.singleValue = { v: this.last.lastPrice === '---' ? '' : this.last.lastPrice };
  },
  beforeDestroy() {
    //离开交易页面的时候清楚当前page
    this.$store.dispatch('setTradePage', '');
    isInPage = false;
    // 这个地方，如果socket正在连接中，就会报错
    if (this.tradeSocket) {
      this.tradeSocket.id = NaN;
      this.tradeSocket.connected && this.tradeSocket.disconnect(); // 断开socket
    }
    try {
      this.workerTimerId && this.workerTimers.clearTimeout(this.workerTimerId); // 关闭市场数据的轮询
    } catch (e) {}
    this.socketErrorTimer && clearTimeout(this.socketErrorTimer); // 关闭断线重连的timer
    clearTimeout(this.orderTimer);
    clearTimeout(this.socketConnectedTimer);
    document.title = 'RightBTC';
    document.querySelector('header').style.minWidth = '';
    document.querySelector('footer').style.minWidth = '';
  },

  /** ========= 计算属性 ========= **/
  computed: {
    ...mapState({
      // 返回图表所需的语言代码
      locale: state => {
        switch (state.locale.toLowerCase()) {
          case 'en_us':
            return 'en';
          case 'ja_jp':
            return 'ja';
          case 'zh_cn':
            return 'zh';
        }
        return 'en';
      },
      theme: state => state.theme,
      userInfo: state => state.user.userInfo,
      isLogin: state => state.isLogin,
      i18n: state => state.i18n.App.Trade,
      ErrorCode: state => state.i18n.App.ErrorCode,
      minAmountData: state => state.trade.minAmountData, // 所有最小交易量数据
      marketData: state => state.trade.marketData, // 所有交易对市场数据
    }),
    // 动态设置网页的标题
    title() {
      let price = this.last.lastPrice;
      if (isNaN(Number(this.last.lastPrice))) {
        price = 0;
      }
      return `${Number(price).toFixed(this.muPoint) || 0} ${this.zi}/${this.mu} | RightBTC`;
    },
    // 完整交易对
    symbol() {
      return `${this.zi}${this.mu}`;
    },
    // socket请求基础地址（图表所需）
    baseURL() {
      return Configs.DEFAULT.RB_API;
    },
    // 当前母币支持的最多几个小数点
    muPoint() {
      const obj = this.minAmountData[this.symbol];
      if (!obj || !obj.price) {
        return 0;
      }
      return Number(obj.price.point);
    },
    // 当前交易对的各种最终数据
    last() {
      const res = { lastPrice: '---', change: '---' };
      const muData = this.marketData.find(item => item.symbol === this.mu);
      if (!muData) {
        return res;
      }
      const ziData = muData.lists.find(item => item.symbol === this.zi);
      if (!ziData) {
        return res;
      }
      res.lastPrice = ziData.lastPrice;
      res.change = ziData.change;
      res.high24 = this.nowMarketData.h;
      res.low24 = this.nowMarketData.l;
      res.vol24 = this.nowMarketData.v;
      return res;
    },
    /** 当前用户选择的交易对的市场数据 **/
    nowMarketData() {
      const mu = this.marketData.find(item => item.symbol === this.mu);
      if (!mu) {
        return {};
      }
      const zi = mu.lists.find(item => item.symbol === this.zi);
      return zi || {};
    },
  },

  /** ========= 方法 ========= **/
  methods: {
    ...mapActions({
      saveLove,
      setSymbol,
      selectGroup,
      selectMinAmount,
      selectAvaCoin,
      addOrder,
      selectOpenOrder,
      selectHistoryOrder,
      saveOrder,
      saveMarketData,
    }),

    /** 测试 - 切换主题 **/
    onThemeChange() {
      if (this.theme === 'dark') {
        this.theme = 'light';
      } else {
        this.theme = 'dark';
      }
    },
    /** 获取当前用户的所有资产 **/
    getCanUse() {
      this.selectAvaCoin().then(res => {
        if (res && res.code === 200) {
          this.canUseData = res.data;
        }
      });
    },

    /** 用户选择了不同的深度精度 **/
    onDepthChose(v) {
      this.depthChose = v;
    },

    /** 初始化socket **/
    /**
     * 1. 进入页面 正常连接
     * 2. 进入页面 连接不上 （5秒后重来）
     * 3. 连接上了，中途断连 （5秒后重来）
     * 4. 离开页面 （断开，关闭setTimeout）
     * 5. 切换交易对（关闭所有监听，重新打开新的监听）
     * 6. 切换深度 （关闭深度相关的监听，重新打开新的监听）
     * **/
    initSocket() {
      this.socketType = false;
      // const ws = new WebSocket(`${Configs.DEFAULT.WS_API}/quote-websocket/${this.zi}${this.mu}/websocket`);
      const ws = new SockJS(`${Configs.DEFAULT.RB_API}/ws`);
      const sws = Stomp.over(ws);
      sws.id = new Date().getTime();
      this.tradeSocket = sws;

      sws.debug = false;
      sws.connect(
        {},
        e => this.onOpen(sws),
        this.onError,
      );
    },

    /**
     * socket连上后需要发送和监听的东西
     * @param e stomp传递的参数
     * **/
    onOpen(sws) {
      // 判断socket确实连接上了才开始监听，否则挂起2秒后重试
      if (!sws || !sws.connected) {
        clearTimeout(this.socketConnectedTimer);
        this.socketConnectedTimer = setTimeout(() => {
          this.onOpen(sws);
        }, 2000);
        return;
      }
      // 各种异步原因，有可能用户退出了页面，socket没关掉运行到此，判断如果已经不是本页面最新的socket，就断开那个旧的socket
      if (sws.id !== this.tradeSocket.id) {
        this.socketSubscribe = [];
        sws.id = NaN;
        sws.disconnect();
        return;
      }
      this.socketType = true;
      this.closeSocketSubscribe(); // 关闭之前的所有监听

      this.socketSubscribe.market = this.tradeSocket.subscribe('/quote/quote.market', this.onMarketMessage, { id: '/quote/quote.market', destination: '/quote/quote.market' }); // 监听市场交易对最新价格等信息
      this.socketSubscribe.trade = this.tradeSocket.subscribe('/user/quote/trade', this.onTradeMessage, { id: `/user/quote/trade` }); // 监听首次获取历史交易对的成交信息
      this.socketSubscribe.tradeNew = this.tradeSocket.subscribe(`/quote/quote.${this.symbol}.trade`, this.onTradeMessage2, { id: `/quote/quote.${this.symbol}.trade` }); // 监听最新成交的信息
      this.socketSubscribe.depth = this.tradeSocket.subscribe('/user/quote/depth', this.onDepthMessage, { id: '/user/quote/depth', destination: '/user/quote/depth' }); // 深度图及左侧的信息
      this.socketSubscribe.order = this.tradeSocket.subscribe(`/quote/quote.orderCancel.${this.userInfo.userId}`, this.onOrderMessage, { id: `/quote/quote.orderCancel.${this.userInfo.userId}` }); // 监听用户订单信息

      this.tradeSocket.send('/quote/trade', {}, `{"symbol": "${this.symbol}","number": "50"}`); // 发送首次先获取50条历史成交信息

      // 监听图表所需数据
      this.socketSubscribe.tradingview = this.tradeSocket.subscribe(`/quote/quote.${this.symbol}.tradingview.${this.interval}`, this.onTradingViewMessage, {
        id: `/quote/quote.${this.symbol}.tradingview.${this.interval}`,
      });
      // 获得了深度信息后再监听具体数据
      this.startDepthData('default');
    },
    /** socket链接错误触发 **/
    onError(msg) {
      console.error('socket连接断开，10秒后自动重连');
      this.socketType = false;
      // 10秒后重新创建socket
      clearTimeout(this.socketErrorTimer);
      this.socketErrorTimer = setTimeout(() => {
        this.initSocket();
      }, 10000);
    },

    /** 关闭所有socket监听（用于切换交易对时） **/
    closeSocketSubscribe() {
      Object.keys(this.socketSubscribe).forEach(item => {
        this.socketSubscribe[item] && this.socketSubscribe[item].unsubscribe();
      });
    },

    /** socket获取到了市场的最新数据 **/
    onMarketMessage(msg) {
      const data = JSON.parse(msg.body);
      if (data && data.code === 200) {
        const d = data.data;
        const keys = Object.keys(d);
        const newD = JSON.parse(JSON.stringify(this.marketData));

        for (let i = 0; i < keys.length; i++) {
          const tempMu = this.marketData.findIndex(item => item.symbol === keys[i]);
          if (tempMu >= 0) {
            for (let j = 0; j < d[keys[i]].length; j++) {
              const tempZi = newD[tempMu].lists.findIndex(item2 => item2.symbol === d[keys[i]][j].market);
              if (tempZi >= 0) {
                const t = {
                  change: String(d[keys[i]][j].rate),
                  h: String(d[keys[i]][j].high24),
                  l: String(d[keys[i]][j].low24),
                  lastPrice: String(d[keys[i]][j].last),
                  v: String(d[keys[i]][j].vol24),
                };
                newD[tempMu].lists[tempZi] = Object.assign({}, newD[tempMu].lists[tempZi], t);
              }
            }
          }
        }
        this.saveMarketData({ isS: false, data: newD });
        this.$nextTick(() => {
          document.title = this.title;
        });
      }
    },

    /** socket首次获取到历史交易信息的50条数据 **/
    onTradeMessage(msg) {
      const res = JSON.parse(msg.body);
      if (res && res.code === 200) {
        this.sellbuyData = [...res.data];
        this.socketSubscribe.trade.unsubscribe(); // 关闭这个监听，因为只监听一次就可以了
      }
    },

    /** socket后续获取到最新的交易信息 **/
    onTradeMessage2(msg) {
      const res = JSON.parse(msg.body);
      if (res && res.code === 200) {
        this.sellbuyData = res.data;
      }
    },

    /** 监听主动获取一次深度数据 **/
    onDepthMessage(msg) {
      const res = JSON.parse(msg.body);
      if (res && res.code === 200 && res.data && res.data.data) {
        this.depthData = res.data.data || { ask: [], bid: [] };
        this.depthChoseData = res.data.scale;
        // this.socketSubscribe.depth.unsubscribe();
        // this.socketSubscribe.depth = null;
      }
    },

    /** 开始socket监听深度数据 **/
    startDepthData(type) {
      this.tradeSocket.send('/quote/depth', {}, `{"symbol": "${this.symbol}","type":"${type}"}`); // 主动发送一次获取首次深度数据

      this.socketSubscribe.depthData && this.socketSubscribe.depthData.unsubscribe(); // 先关闭旧的监听
      // 这个是只要深度有变化就会自动推
      this.socketSubscribe.depthData = this.tradeSocket.subscribe(`/quote/quote.${this.symbol}.depth.${type}`, this.onDepthMessage2, {
        id: `/quote/quote.${this.symbol}.depth.${type}`,
      });
    },

    /** 获取深度详细信息 **/
    onDepthMessage2(msg) {
      const res = JSON.parse(msg.body);

      if (res && res.code === 200) {
        this.depthData = res.data || { ask: [], bid: [] };
      }
    },

    /** socket获取到了最新的K线数据 **/
    onTradingViewMessage(msg) {
      const res = JSON.parse(msg.body);
      if (res && res.code === 200) {
        this.newKData = res.data;
      }
    },

    /** 监听用户订单信息变化,如果后台有推任何信息，立即更新订单 */
    onOrderMessage(msg) {
      this.onOrderChoseChange(this.orderWhich, this.orderFilter, true);
    },
    /** 获取市场所有的母币子币，和它们的最新信息 **/
    getGroups() {
      this.selectGroup()
        .then(res => {
          document.title = this.title; // 这么做是因为，切换到其他窗口后，nuxt的附加生命周期都是休眠的，只能手动设置标题
        })
        .catch(err => console.error('error:', err));
    },
    /** 市场 - 用户点击收藏/取消收藏某子币 **/
    onCollect(zi, mu, type) {
      this.saveLove({
        isLove: type,
        symbol: `${zi}${mu}`,
      }).then(res => {
        if (res.code === 200) {
          // 操作成功后立即刷新市场数据
          this.getGroups();
        }
        if (res.code !== 200) {
          this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
        }
      });
    },
    /** 市场 - 改变了交易对 **/
    onSymbolChange(zi, mu, item) {
      this.sellbuyData = []; // 重置交易历史数据
      // this.depthData = { ask: [], bid: [] }; // 重置深度数据（先不用重置,不然切换时没动画效果）
      this.zi = zi;
      this.mu = mu;
      this.$nextTick(() => {
        this.onOpen(this.tradeSocket); // 重新设置socket各监听
        this.onOrderChoseChange(0, 'all'); // 重新获取历史订单
        document.title = this.title;
      });
      this.$nextTick(() => {
        this.singleValue = { v: item.lastPrice };
      });
      history.replaceState({}, 'RightBTC', `/trade/${zi}_${mu}`);
    },

    /** 用户点击买按钮 **/
    onBuy(single, count) {
      this.buyLoading = true;
      this.addOrder({
        price: single, // 单价
        amount: count, // 数量
        type: 'BUY',
        userId: this.userInfo.userId,
        symbol: `${this.zi}${this.mu}`,
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success(this.i18n.exchange.success);
            this.getCanUse(); // 重新获取所有资产
            this.onOrderChoseChange(0, 'all'); // 重新获取历史订单
          } else {
            let errorInfo = this.i18n.exchange.msg.error.other;
            if (Number(res.code) === 400) {
              errorInfo = this.i18n.exchange.msg.error.minPrice;
            }
            this.$message.error(errorInfo);
          }
        })
        .finally(() => {
          this.buyLoading = false;
        });
    },

    /** 用户点击卖按钮 **/
    onSell(single, count) {
      this.sellLoading = true;
      this.addOrder({
        price: single,
        amount: count,
        type: 'SELL',
        userId: this.userInfo.userId,
        symbol: `${this.zi}${this.mu}`,
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success(this.i18n.exchange.success);
            this.getCanUse(); // 重新获取所有资产
            this.onOrderChoseChange(0, 'all'); // 重新获取历史订单
          } else {
            let errorInfo = this.i18n.exchange.msg.error.other;
            if (Number(res.code) === 400) {
              errorInfo = this.i18n.exchange.msg.error.minPrice;
            }
            this.$message.error(errorInfo);
          }
        })
        .finally(() => {
          this.sellLoading = false;
        });
    },

    /** 用户在图表中选择了另外的时间分割 **/
    onIntervalChanged(str) {
      this.socketSubscribe.tradingview && this.socketSubscribe.tradingview.unsubscribe();
      this.socketSubscribe.tradingview = this.tradeSocket.subscribe(`/quote/quote.${this.symbol}.tradingview.${str}`, this.onTradingViewMessage, {
        id: `/quote/quote.${this.symbol}.tradingview.${str}`,
      });
      this.interval = str;
    },

    /**
     * 委托参数改变时触发
     * @param which 历史订单还是最新订单
     * @param filter 所有/买/卖
     * @param noloading 是否不显示loading
     * */
    async onOrderChoseChange(which, filter, noloading) {
      this.orderWhich = which;
      this.orderFilter = filter;

      if (!this.isLogin) {
        return;
      }

      let res;
      const params = {
        filter,
        symbol: `${this.zi}${this.mu}`,
      };
      if (!noloading) {
        this.orderLoading = true;
      }
      if (which === 0) {
        // 最新委托
        res = await this.selectOpenOrder(params);
      } else if (which === 1) {
        // 历史委托
        res = await this.selectHistoryOrder(params);
      }

      if (res && res.code === 200) {
        if (which === 0) {
          this.orderData.activeOrders = res.data;
        } else if (which === 1) {
          this.orderData.historyOrders = res.data;
        }
      } else {
        this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
      }
      this.orderLoading = false;
    },

    /** 用户订单信息目前也采用的轮询，撮合成功之类前端得不到任何反馈，所以需要轮询 **/
    getOrderInfoByTimer() {
      clearTimeout(this.orderTimer);
      this.orderTimer = setTimeout(() => {
        this.onOrderChoseChange(this.orderWhich, this.orderFilter, true);
        this.getOrderInfoByTimer();
      }, 6000);
    },

    /** 用户撤单 **/
    onOrderCancel(params, callback) {
      this.saveOrder(params).then(res => {
        if (res.code === 200) {
          this.$message.success(this.i18n.delegateCol.success);
          // 撤单成功立即重新获取order数据
          this.onOrderChoseChange(this.orderWhich, this.orderFilter);
          // 撤单成功立即重新获取用户资产
          this.getCanUse();
        } else {
          let errorInfo;
          if (Number(res.code) === 542) {
            errorInfo = this.i18n.waiting;
          } else {
            errorInfo = this.ErrorCode[res.code];
          }
          this.$message.error(errorInfo || `${res.code}`);
        }
        callback && callback(res);
      });
    },

    /** 用户点击深度数据 **/
    onDeepDataClick(ticks) {
      this.singleValue = { v: ticks };
    },

    // 进入页面时检测URL中的交易对是否存在
    async checkSymbol() {
      let symbol = { mu: Configs.DEFAULT.mu, zi: Configs.DEFAULT.zi };
      const path = this.$route.path
        .split('/')
        .pop()
        .split('_');

      if (this.marketData && this.marketData.length) {
        const mu = this.marketData.find(item => item.symbol === path[1]);
        if (mu) {
          const zi = mu.lists.find(item => item.symbol === path[0]);
          if (zi) {
            symbol = { mu: mu.symbol, zi: zi.symbol };
          }
        }
      } else {
        await this.selectGroup().then(res => {
          if (res && res.code === 200) {
            const mu = res.data.find(item => item.symbol === path[1]);
            if (mu) {
              const zi = mu.lists.find(item => item.symbol === path[0]);
              if (zi) {
                symbol = { mu: mu.symbol, zi: zi.symbol };
              }
            }
          }
        });
      }
      return symbol;
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-page {
  --backgroundColor: #ecf0fa;
  &.dark {
    --backgroundColor: #090d20;
  }
  display: flex;
  width: 100%;
  flex: 1;
  padding: 10px;
  min-width: 1440px;
  background-color: var(--backgroundColor);
  div {
    position: relative;
  }
  & > .l {
    min-width: 295px;
    max-width: 395px;
    width: 20%;
    min-height: 835px;
    flex: none;
  }
  & > .r {
    flex: 1;
    margin-left: 10px;
    & > .row {
      display: flex;
      & > .user-control {
        flex: 1;
        min-height: 380px;
        margin-bottom: 10px;
        display: flex;
        overflow: hidden;
        border-radius: 4px;
        .control-box {
          flex: 1;
          .title {
            padding: 10px;
          }
        }
      }
      & > .tv {
        flex: 1;
        height: 460px;
        margin-bottom: 10px;
        overflow: hidden;
        border-radius: 4px;
      }
      & > .market {
        position: relative;
        flex: none;
        width: 24%;
        max-width: 495px;
        min-width: 300px;
        height: 460px;
        margin: 0 0 10px 10px;
      }
      & > .history {
        flex: none;
        width: 24%;
        max-width: 495px;
        min-width: 300px;
        height: 405px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      & > .order {
        flex: none;
        width: 100%;
        .tabs {
          display: flex;
          & > li {
            padding: 10px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.trade-page {
  .scrollbar-track {
    background: #fff;
  }

  .scrollbar-thumb.scrollbar-thumb-y {
    background: #ddd;
  }
  &.dark {
    .scrollbar-track {
      background: #191d33;
    }

    .scrollbar-thumb.scrollbar-thumb-y {
      background: #202541;
    }
  }
}
</style>