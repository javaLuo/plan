<!-- 图表 -->
<template>
  <div :class="`tradingview-box ${theme}`">
    <div class="tradingview-head">
      <i :class="['token-logo', 'default-icon', `${zi}`]"></i>
      <span class="info0">{{zi}}/{{mu}}　{{last.lastPrice | formatNumber(muPoint)}} </span>
      <span :class="[ 'info0 num',{green: Number(last.change)>0},{red: Number(last.change)<0}]">{{Number(last.change)>0 ? '+' : ''}}{{last.change || 0 | formatNumber(2)}}%</span>
      <span class="info">{{i18n.tv.h}} {{last.high24 || 0 | formatNumber(muPoint)}}</span>
      <span class="info">{{i18n.tv.l}} {{last.low24 || 0 | formatNumber(muPoint)}}</span>
      <span class="info">24H {{i18n.tv.v}} {{last.vol24 | formatNumber(ziPoint)}} {{zi}}</span>
      <div class="space" />
      <span class="info"
            style="cursor:pointer;margin-right: 0;"
            @click="onShowDeep">
        <i :class="['iconfont', {'dark ': theme === 'dark' }, deepChartShow ? 'icon-Kxian' : 'icon-shendu1']" />
      </span>
      <a class="link"
         :href="`https://k.chainfor.com/?k=83-${zi.toLowerCase()}${mu.toLowerCase()}`"
         target="_blank"
         rel="nofollow me noopener noreferrer" />
    </div>
    <div :class="['tradingview-dom',{'hide':deepChartShow}]"
         :id="id" />
    <div :class="['deep-chart-box',{'show':deepChartShow}]">
      <DeepChart :sourceData="{askData,bidData}"
                 :theme="theme"
                 :show="deepChartShow"
                 :zi="zi"
                 :mu="mu"
                 :i18n="i18n" />
    </div>
  </div>

</template>

<script>
let tradingview; // 图表本体文件
let widget; // 图表插件实例
let chart; // 图表chart实例
let $; // 内部jquery
const listeners = []; // 监听者
let buttons = []; // 所有自定义按钮

// 初始化所需参数
const params = {
  autosize: true,
  charts_storage_api_version: '1.1',
  charts_storage_url: 'https://saveload.tradingview.com',
  client_id: 'tradingview.com',
  container_id: 'tv_chart_container',
  datafeed: {},
  debug: false,
  disabled_features: [
    'header_symbol_search', // 头部搜索框，没实现搜索功能
    'symbol_search_hot_key', // 按键盘任意键呼出搜索对话框，没实现搜索功能
    'header_chart_type', // 头部图表类型切换，不允许切换
    'header_compare', // 头部比较按钮，不允许比较
    'header_undo_redo', // 头部前进后退按钮，不允许图表内切换交易对
    'header_screenshot', // 头部相机按钮，不允许拍照没实现该功能
    'header_saveload', // 头部保存上传按钮，没实现该功能
    'header_resolutions', // 头部所有时间间隔按钮，隐藏全部用自定义按钮
    'timeframes_toolbar', // 底部工具栏
    'show_hide_button_in_legend', // 指标的“隐藏”眼睛按钮
    'legend_context_menu', // 左上角交易对右边的向下小箭头菜单
    'caption_buttons_text_if_possible', // 按钮显示图标和文字，禁用则只显示图标
    'symbol_info', // 右键菜单的‘品种信息’，后台没传完整的信息，禁用
    'volume_force_overlay', // 成交量和主区域分开显示
    'border_around_the_chart',
    'remove_library_container_border',
    'scales_context_menu',
  ],
  drawings_access: {
    type: 'black',
    tools: [
      {
        name: 'Regression Trend',
      },
    ],
  },
  enabled_features: ['hide_last_na_study_output', 'left_toolbar', 'hide_left_toolbar_by_default', 'keep_left_toolbar_visible_on_small_screens'],
  fullscreen: false,
  // favorites: {
  //   intervals: ['1', '5', '15', '30', '60', 'D', 'W'],
  // },
  interval: '60', // 默认时间间隔 1小时
  library_path: '/lib/rightbtc/',
  locale: 'en',
  overrides: {
    volumePaneSize: 'medium',
    'scalesProperties.backgroundColor': '#ff0000',
    'mainSeriesProperties.areaStyle.color1': '#999999', // 区域图上边渐变色
    'mainSeriesProperties.areaStyle.color2': '#ffffff', // 区域图下边渐变色
    'mainSeriesProperties.areaStyle.linecolor': '#A3AAC1', // 区域图线条色
    'mainSeriesProperties.areaStyle.linewidth': 1, // 线条粗细
    'mainSeriesProperties.areaStyle.priceSource': 'close', // 区域图线条基于什么价格来画：open开盘价，high最高价，low最低价，close收盘价
  },
  symbol: 'BTCUSD',
  timezone: 'Asia/Dubai',
  user_id: 'public_user_id',
  volume_precision: 2,
};
import axios from 'axios';
import Configs from '~/common/config';
import DeepChart from '~/components/TradeComs/DeepChart'; // 深度图 先注释
export default {
  data() {
    return {
      deepChartShow: false, // 深度图是否显示
      chartType: 1, // 当前图表点类型， 1蜡烛图，3面积图
    };
  },
  components: {
    DeepChart,
  },
  props: {
    id: { type: String, default: 'tv_chart_container' }, // id
    theme: { type: String, default: 'light' }, // dark
    baseURL: { type: String, required: true }, // 基础请求地址
    locale: { type: String, default: 'en' }, // 语言
    interval: { type: String, default: '60' }, // 时间间隔
    kdata: { type: Object }, // 新的数据
    mu: { type: String, required: true }, // 交易对：母币
    zi: { type: String, required: true }, // 交易对：子币
    last: { type: Object }, // 头部所需信息
    i18n: { type: Object, required: true }, // 多语言
    minAmountData: { type: Object, default: () => ({}) }, // 所有交易对的最小交易量数据
    askData: { type: Array }, // sell 上方数据
    bidData: { type: Array }, // buy 下方数据
    socketType: { type: Boolean }, // socket是否已连接，未连接时不分功能不能用
  },

  /** 计算属性 **/
  computed: {
    //交易对
    symbol() {
      return `${this.zi}${this.mu}`;
    },
    // 当前交易对支持的最多几个小数点
    ziPoint() {
      const obj = this.minAmountData[this.symbol];
      if (!obj) {
        return 0;
      }
      return Number(obj.point);
    },
    muPoint() {
      const obj = this.minAmountData[this.symbol];
      if (!obj || !obj.price) {
        return 0;
      }
      return Number(obj.price.point);
    },
  },
  /** =========== 过滤器 ========== **/
  filters: {
    formatNumber(num, p = 8) {
      if (isNaN(Number(num))) {
        return 0;
      }
      const str = String(num).split('.');
      if (str.length > 1) {
        return `${str[0]}.${str[1].slice(0, p).padEnd(p, '0')}`;
      }
      return Number(str[0]).toFixed(p);
    },
  },
  /** 生命周期 **/
  mounted() {
    tradingview = window.TradingView;
    this.init(tradingview);
  },
  beforeDestroy() {
    // 清除自定义按钮的绑定事件
    try {
      buttons.forEach(item => {
        item.off();
      });
      widget && chart && widget.remove();
    } catch (e) {}
  },
  /** 监听变化 **/
  watch: {
    // socket状态变化
    socketType(newV) {
      if (newV) {
        this.onCanUsed();
      } else {
        this.onDisableding();
      }
    },
    // 有新数据了，更新图表数据
    kdata(newV, oldV) {
      if (!listeners[`${this.symbol}_${this.interval}`]) {
        return;
      }
      const barData = this.formatSourceData(newV); // 格式化原始数据
      barData.bars.forEach(item => {
        listeners[`${this.symbol}_${this.interval}`].updateData(item);
      });
    },
    // 语言被改变
    locale(newV) {
      buttons.forEach(item => {
        item.off();
      });
      this.onDisableding();
      widget = null;
      this.init(tradingview);
    },
    // 交易对变了
    symbol(newV) {
      if (chart) {
        chart.setSymbol(newV);
        // 更新自定义指标的小数点精度
        this.$nextTick(() => {
          chart
            .getAllStudies()
            .filter(item => item.name === 'Moving Average')
            .forEach(item => {
              chart.getStudyById(item.id).applyOverrides({
                precision: this.muPoint,
              });
            });
        });
      } else {
        // 如果图表还没加载好就切换交易对，那就直接重新开始加载
        this.init(tradingview);
      }
    },
    // theme 主题变了
    theme(newV) {
      if (widget && chart) {
        try {
          widget.changeTheme(newV === 'dark' ? 'Dark' : 'Light');
          // 简单解决一下tradingview的BUG
          widget.applyOverrides({
            'paneProperties.background': newV === 'dark' ? '#191d35' : '#ffffff',
            'paneProperties.vertGridProperties.color': newV === 'dark' ? '#292d3c' : '#f1f5f8',
            'paneProperties.horzGridProperties.color': newV === 'dark' ? '#292d3c' : '#f1f5f8',
          });
          setTimeout(() => {
            chart.setChartType(this.chartType);
          });
        } catch (e) {
          this.init(tradingview);
        }
      } else {
        this.init(tradingview);
      }
    },
  },
  /** 方法 **/
  methods: {
    /** 测试 - 深度图显示/隐藏 **/
    onShowDeep() {
      this.deepChartShow = !this.deepChartShow;
    },
    /** 初始化图表 **/
    init(tradingview) {
      const that = this;
      params.container_id = this.id;
      params.locale = this.locale;
      params.symbol = this.symbol;
      params.theme = this.theme === 'dark' ? 'Dark' : 'Light';
      (params.overrides['paneProperties.background'] = this.theme === 'dark' ? '#191d35' : '#ffffff'), // 背景色
        (params.datafeed = {
          onReady: this.onReady,
          resolveSymbol: this.resolveSymbol,
          getBars: this.getBars,
          subscribeBars: this.subscribeBars,
          unsubscribeBars: this.unsubscribeBars,
          getServerTime: this.getServerTime,
        });
      widget = new tradingview.widget(params);

      widget.onChartReady(() => {
        // 图表还没加载完，用户就退出页面
        if (!widget) {
          return;
        }
        // 获取内部选择器，就是jquery
        $ = widget._innerWindow().$;
        // widget._innerWindow().chartWidget.activePaneWidget = true;
        // chart 实例
        try {
          chart = widget.chart(0); // 怀疑这是个异步方法，快速切换图表可能引起报错
        } catch (e) {
          return;
        }
        // widget.closePopupsAndDialogs();

        // 时间间隔改变，通知父级
        chart.onIntervalChanged().subscribe(null, (interval, obj) => {
          this.$emit('onIntervalChanged', interval);
        });
        // 创建指标线
        chart.createStudy('Moving Average', false, false, [5], null, { 'plot.color.0': '#8e65be', precision: this.muPoint });
        chart.createStudy('Moving Average', false, false, [10], null, { 'plot.color.0': '#8baad1', precision: this.muPoint });
        chart.createStudy('Moving Average', false, false, [30], null, { 'plot.color.0': '#6daf6b', precision: this.muPoint });
        chart.createStudy('Moving Average', false, false, [60], null, { 'plot.color.0': '#bc62a5', precision: this.muPoint });

        // 创建自定义按钮
        buttons = []; // 清空之前的
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.line[0], '60', this.i18n.timeinfo.line[1], 3);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min[0], '1', this.i18n.timeinfo.min[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min5[0], '5', this.i18n.timeinfo.min5[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min15[0], '15', this.i18n.timeinfo.min15[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min30[0], '30', this.i18n.timeinfo.min30[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min60[0], '60', this.i18n.timeinfo.min60[1], 1, true);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min240[0], '240', this.i18n.timeinfo.min240[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.min480[0], '480', this.i18n.timeinfo.min480[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.day[0], 'D', this.i18n.timeinfo.day[1], 1);
        this.initButton(widget.createButton()[0], this.i18n.timeinfo.week[0], 'W', this.i18n.timeinfo.week[1], 1);

        // 初始化一些样式调整
        const allbtns = $('.group-wWM3zP_M-');
        allbtns.eq(0).css('order', '21'); // 指标按钮
        allbtns.eq(11).css('order', '30'); // 空白区域
        allbtns.eq(12).css('order', '20'); // 设置按钮
        allbtns.eq(13).css('order', '99'); // 最大化按钮

        // 有的浏览器是默认收起的，有的又是打开的，统一收起
        if (!$('.pane-legend-minbtn .closed').length) {
          $('.pane-legend-minbtn').click();
        }
        this.onCanUsed();
      });
    },
    /**
     * 切换时间间隔的操作
     * @param dom 按钮的dom对象
     * @param title hover时显示的文字
     * @param code 时间间隔的值
     * @param text 按钮上显示的文字
     * @param chartType 图表的类型
     * @param defaultActive 是否默认选中
     */
    initButton(dom, title, code, text, chartType, defaultActive) {
      const $dom = $(dom);
      $dom.attr('title', title).text(text);
      if (defaultActive) {
        $dom.addClass('active');
      }
      $dom.on('click', () => {
        chart.setResolution(code);
        chart.setChartType(chartType);
        this.chartType = chartType;
        $('.group-wWM3zP_M- .customButton--jqJTfH5-').removeClass('active');
        $dom.addClass('active');
        if (chartType === 3) {
          // 说明是分时图，隐藏所有的MA线
          chart
            .getAllStudies()
            .filter(item => item.name === 'Moving Average')
            .forEach(item => {
              chart.getStudyById(item.id).setVisible(false);
            });
        } else {
          chart
            .getAllStudies()
            .filter(item => item.name === 'Moving Average')
            .forEach(item => {
              chart.getStudyById(item.id).setVisible(true);
            });
        }
      });
      buttons.push($dom);
    },
    // 图表在加载中时需要禁用都操作
    onDisableding() {
      $ && $('.content-3_f7yH29-').css({ opacity: 0.8, 'pointer-events': 'none' });
    },
    // 图表加载完毕取消禁用
    onCanUsed() {
      $ && $('.content-3_f7yH29-').css({ opacity: 1, 'pointer-events': 'auto' });
    },
    /** JS API **/
    // 初始化时获取配置信息
    onReady(callback) {
      axios
        .get(`${this.baseURL}/quote2/tv/config`)
        .then(res => {
          // console.log('Tradingview:onReady', res);
          if (res && res.code === 200) {
            callback(res.data);
          }
        })
        .catch(e => {
          console.error('onReady error');
        });
    },
    // 根据名称获取交易对详情
    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
      axios
        .get(`${this.baseURL}/quote2/tv/symbolInfo?symbol=${symbolName}`)
        .then(res => {
          // console.log('Tradingview:resolveSymbol解析当前交易对返回', res);
          if (res && res.code === 200) {
            res.data.pricescale = 10 ** this.muPoint || res.data.pricescale;
            onSymbolResolvedCallback(res.data);
          } else {
            onResolveErrorCallback(`解析${symbolName}失败`);
          }
        })
        .catch(e => {
          onResolveErrorCallback(e);
        });
    },
    // 获取交易对历史数据 图表会自动调用请求从当前时间回溯到N年前的数据，分批次请求
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
      axios
        .get(`${this.baseURL}/quote2/tv/getBars?symbol=${symbolInfo.ticker}&resolution=${resolution}&from=${from}&to=${to}&isFirst=${firstDataRequest}`)
        .then(res => {
          if (res && res.code === 200) {
            if (res.data && res.data.t && res.data.t.length) {
              const bardata = this.formatSourceData(res.data);
              onHistoryCallback(bardata.bars, bardata.meta);
            } else {
              onHistoryCallback([], {
                noData: true,
                nextTime: res.nextTime || null,
              });
            }
          } else {
            onErrorCallback('获取历史数据失败');
          }
        })
        .catch(e => {
          onErrorCallback(e);
        });
    },
    // 创建监听者
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
      // console.log('Tradingview：创建监听者：', symbolInfo, resolution, subscriberUID);
      if (listeners[subscriberUID]) {
        return;
      }
      listeners[subscriberUID] = {
        symbolInfo,
        resolution,
        lastBarTime: null,
        updateData: onRealtimeCallback,
      };
    },
    // 消除监听者 切换就会触发
    unsubscribeBars(subscriberUID) {
      // console.log('Tradingview：清除监听者：', listeners, subscriberUID);
      if (listeners[subscriberUID]) {
        listeners[subscriberUID] = null;
      }
    },
    // 获取服务器时间
    getServerTime(callback) {
      axios
        .get(`${this.baseURL}/quote2/tv/getServerTime`)
        .then(res => {
          // console.log('Tradingview:getServerTime获取服务器时间返回', res);
          if (res && res.code === 200) {
            callback(res.data);
          }
        })
        .catch(e => {
          console.error('getServerTime error');
        });
    },
    /** 工具 - 处理数据 **/
    formatSourceData(data) {
      let bars = data.t.map((item, index) => {
        return {
          time: item * 1000,
          close: Number(data.c[index]),
          open: Number(data.o[index]),
          high: Number(data.h[index]),
          low: Number(data.l[index]),
          volume: Number(data.v[index]),
        };
      });

      // 传来的数据时间有重复的...必须剔除
      bars = bars.reduce((res, item) => {
        if (!res.length) {
          res.push(item);
        } else if (res[res.length - 1].time < item.time) {
          res.push(item);
        }
        return res;
      }, []);

      const meta = {
        noData: false,
        nextTime: null,
      };

      return { bars, meta };
    },
  },
};
</script>

<style lang='scss' scoped>
.tradingview-box {
  --backgroundColor: #fff;
  --borderColor: #f6f8fd;
  --textColor: #354989;
  &.dark {
    --backgroundColor: #191d35;
    --borderColor: #15182d;
    --textColor: #c7cce6;
    .tradingview-head {
      .link:hover {
        background-image: url('~assets/images/finance-night@2x.png');
      }
    }
  }
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--backgroundColor);
  .tradingview-head {
    position: relative;
    height: 50px;
    border-bottom: solid 2px var(--borderColor);
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-weight: 500;
    .token-logo {
      top: 0;
    }
    color: var(--textColor);
    .info0 {
      font-size: 16px;
      margin-right: 20px;
      &.num {
        color: rgb(220, 220, 220);
      }
      &.green {
        color: #29a76c;
      }
      &.red {
        color: #df543a;
      }
    }
    .info {
      font-size: 12px;
      margin-right: 1%;
      i {
        opacity: 0.65;
        &:hover {
          opacity: 1;
        }
      }
    }
    .space {
      flex: auto;
    }
    .link {
      width: 81px;
      height: 25px;
      background-size: 100% auto;
      background-repeat: no-repeat;
      background-position: center;
      position: absolute;
      z-index: 10;
      right: 46px;
      bottom: -34px;
      background-color: var(--backgroundColor);
      cursor: pointer;
      background-image: url('~assets/images/finance-normal@2x.png');
      &:hover {
        background-image: url('~assets/images/finance-light@2x.png');
      }
    }
  }
  .tradingview-dom {
    height: calc(100% - 50px);
    transform: translateX(0);
    transition: transform 300ms;
    &.hide {
      transform: translateX(10px);
    }
  }
  .deep-chart-box {
    position: absolute;
    top: 50px;
    left: 0;
    height: calc(100% - 50px);
    width: 100%;
    opacity: 0;
    transform: translateX(-10px);
    transition: transform 300ms, opacity 300ms;
    pointer-events: none;
    z-index: 2;
    &.show {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
  }
}
</style>