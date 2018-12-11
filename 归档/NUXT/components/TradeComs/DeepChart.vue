<!-- 深度图 -->
<template>
  <div id="chart-container"
       class='deep-chart-com'></div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import _ from 'lodash';
let dataX = [];
export default {
  data() {
    return {
      chart: null, // chart实例
    };
  },
  props: {
    theme: { type: String, default: 'light' },
    i18n: { type: Object },
    sourceData: { type: Object, default: () => ({ askData: [], bidData: [] }) },
    zi: { type: String },
    mu: { type: String },
    show: { type: Boolean, default: false }, // 是否处于显示状态
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.chart && this.chart.destroy();
  },
  computed: {
    symbol() {
      return `${this.zi}${this.mu}`;
    },
  },
  watch: {
    sourceData(newV) {
      if (!this.chart || !this.show) {
        return;
      }
      this.updateChart(newV);
    },
    // 显示状态改变为true时 立即更新一次数据
    show(newV) {
      if (newV) {
        this.updateChart(this.sourceData);
      }
    },
    symbol(newV, oldV) {
      this.updateChart({ askData: [], bidData: [] });
    },
    // 主题改变时
    theme(newV) {
      if (!this.chart) {
        return;
      }
      this.chart.update({
        chart: {
          backgroundColor: newV === 'dark' ? '#191D35' : '#ffffff',
        },
        xAxis: {
          lineColor: newV === 'dark' ? '#666666' : '#cdd6e9',
          tickColor: newV === 'dark' ? '#666666' : '#cdd6e9',
        },
        yAxis: {
          title: {
            enabled: false, // 不显示坐标轴的小标题
          },
          gridLineColor: newV === 'dark' ? '#1b1e2c' : '#fcfcfc', // 网格线颜色
          lineColor: newV === 'dark' ? '#666666' : '#cdd6e9',
        },
        tooltip: {
          backgroundColor: newV === 'dark' ? 'rgba(44,47,46,.7)' : 'rgba(252,252,252,.7)',
          style: {
            color: newV === 'dark' ? '#fcfcfc' : '#222222',
          },
        },
      });
    },
  },
  methods: {
    initChart() {
      const that = this;
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = Highcharts.chart('chart-container', {
        colors: ['#29a76c', '#db4450'],
        title: {
          // 图表的大标题
          text: '',
          floating: true,
        },
        chart: {
          type: 'areaspline',
          backgroundColor: this.theme === 'dark' ? '#191D35' : '#ffffff',
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false, // 隐藏图例按钮
        },
        xAxis: {
          labels: {
            formatter: function() {
              const temp = that.formartNum(that.dataX[this.value]);
              if (temp === '---') {
                return '';
              }
              return temp;
            },
          },
          tickPixelInterval: 150,
          lineWidth: 1,
          lineColor: this.theme === 'dark' ? '#666666' : '#cdd6e9',
          tickColor: this.theme === 'dark' ? '#49657f' : '#cdd6e9',
          tickmarkPlacement: 'on',
        },
        yAxis: {
          title: {
            enabled: false, // 不显示坐标轴的小标题
          },
          allowDecimals: true,
          minPadding: 0.00000001,
          gridLineColor: this.theme === 'dark' ? '#1b1e2c' : '#fcfcfc', // 网格线颜色
          opposite: true, // 是否两边都显示y轴
          lineWidth: 1,
          lineColor: this.theme === 'dark' ? '#666666' : '#cdd6e9',
        },
        tooltip: {
          formatter: function() {
            return `${that.i18n.delegateCol.price}：${that.formartNum(that.dataX[this.x])} (${that.mu})<br/>${that.i18n.delegateCol.total}：${this.y} (${that.zi})`;
          },
          backgroundColor: this.theme === 'dark' ? 'rgba(44,47,46,.7)' : 'rgba(252,252,252,.7)',
          borderColor: '#aaaaaa',
          borderRadius: 5,
          padding: 16,
          shadow: false,
          style: {
            color: this.theme === 'dark' ? '#fcfcfc' : '#222222',
          },
        },
        series: [
          {
            marker: {
              enabled: false,
            },
            data: [],
            fillOpacity: 0.4,
          },
          {
            marker: {
              enabled: false,
            },
            data: [],
            fillOpacity: 0.4,
          },
        ],
      });
    },

    // 更新数据
    updateChart(newV) {
      const that = this;
      const temp = _.cloneDeep(newV);

      // 对数据排序，后端有时候的数据排序没对
      temp.askData.sort((a, b) => a.ticks - b.ticks);
      temp.bidData.sort((a, b) => a.ticks - b.ticks);

      let buy = temp.bidData;
      let sell = temp.askData;

      // 最多截取50条，因为数据通常都不齐渲染出的图形中间缝隙很大
      if (buy.length > 50) {
        buy = buy.slice(-50);
      }
      if (sell.length > 50) {
        sell.length = 50;
      }

      // 匹配数据，将两边数据弄成一样多
      const difference = buy.length - sell.length;
      for (let i = 0; i < Math.abs(difference); i++) {
        if (difference > 0) {
          sell.push({ ticks: sell[0] ? sell[sell.length - 1].ticks : undefined, addTotalLots: sell[0] ? sell[sell.length - 1].addTotalLots : undefined });
        } else {
          buy.unshift({ ticks: buy[0] ? buy[0].ticks : undefined, addTotalLots: buy[0] ? buy[0].addTotalLots : undefined });
        }
      }

      // 构造X轴和Y轴数据
      const dataX = [];
      const dataY1 = [];
      let dataY2 = [];

      buy.forEach(item => {
        dataX.push(item.ticks === undefined ? null : Number(item.ticks));
        dataY1.push(item.addTotalLots === undefined ? null : Number(item.addTotalLots));
      });
      sell.forEach(item => {
        dataX.push(item.ticks === undefined ? null : Number(item.ticks));
        dataY2.push(item.addTotalLots === undefined ? null : Number(item.addTotalLots));
      });
      dataY2 = [...new Array(dataY1.length).fill(null), ...dataY2];

      this.dataX = dataX; // dataX的值存全局
      this.chart.update({
        series: [
          {
            data: dataY1,
          },
          {
            data: dataY2,
          },
        ],
      });
    },

    // 格式化数字，防止出现科学技术法
    formartNum(num) {
      let v = Number(num);
      if (isNaN(v)) {
        return '---';
      }
      v = v.toFixed(12); // 防止科学计数法出现
      v = v.replace(/0+$/, '').replace(/\.$/, '');

      const str = v.split('.');
      if (str.length > 1) {
        return `${str[0]}.${str[1].slice(0, 8)}`;
      }
      return str[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.deep-chart-com {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>