<!-- 市场 -->
<template>
  <div :class="`trade-market-box ${theme}`">
    <div class="head">
      <div class="title">{{i18n.market.title}}</div>
      <el-input :value="searchValue"
                @input.native="onSearchInput"
                class="search-input"
                suffix-icon="el-icon-search"
                maxlength="7"
                size="mini">
      </el-input>
    </div>
    <div class="tabs-box-shadow">
      <ul class="tabs-box">
        <li v-for="(item, index) in sourceData"
            :key="index"
            @click="tabChange($event,item.symbol)"
            :class="{checked: tabsChose === item.symbol}">{{item.symbol}}</li>
        <li style="flex:1;cursor:auto" />
        <li class="myself"
            @click="tabChange($event,'collection')"
            :class="{checked: tabsChose === 'collection'}"><i class="iconfont icon-yishoucang"></i>{{i18n.market.my}}</li>
        <li class="line"
            :style="{left: `${lineLeft}px`, width: `${lineWidth}px`}"></li>
      </ul>
    </div>
    <ul class="list-head">
      <li @click="onSortMarket(1)">
        <span>{{i18n.market.coin}}</span>
        <div class="sort-box">
          <i :class="['up',{'highlight': sortValue==='11'}]" />
          <i :class="['down',{'highlight': sortValue==='12'}]" />
        </div>
      </li>
      <li @click="onSortMarket(2)">
        <span>{{i18n.market.lastPrice}}</span>
        <div class="sort-box">
          <i :class="['up',{'highlight': sortValue==='21'}]" />
          <i :class="['down',{'highlight': sortValue==='22'}]" />
        </div>
      </li>
      <li @click="onSortMarket(3)">
        <span>{{i18n.market.change}}</span>
        <div class="sort-box">
          <i :class="['up',{'highlight': sortValue==='31'}]" />
          <i :class="['down',{'highlight': sortValue==='32'}]" />
        </div>
      </li>
    </ul>
    <div :class="['list-box',{'hideback': tableData.length}]"
         data-scrollbar>

      <ul v-if="!Object.keys(sourceData).length">
        <li v-for="n in 10"
            :key="n">
          <div class="name">---</div>
          <div class="price">---</div>
          <div class="change">---</div>
        </li>
      </ul>
      <ul>
        <li v-for="(item,index) in tableData"
            :key="index"
            :class="{'active': item.symbol === zi && item.mu === mu}"
            @click="onListChose(item)">
          <div class="name">
            <div class="like"
                 @click.stop="onCollect(item)"
                 v-praise>
              <i v-show="item.isLove"
                 class="iconfont icon-yishoucang"></i>
              <i v-show="!item.isLove"
                 class="iconfont icon-weishoucang"></i>
            </div> {{tabsChose === 'collection' ? `${item.symbol}/${item.mu}` : item.symbol}}
          </div>
          <div class="price">{{item.lastPrice | formatNumber(item.muPoint)}}</div>
          <div :class="['change',{'green': item.change>0},{'red': item.change<0}]">{{item.change>0 ? '+' : ''}}{{item.change|formatNumber}}%</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Storage from '~/utils/storage';

export default {
  data() {
    return {
      lineLeft: 0, // tabs底线偏移
      lineWidth: 41,
      tabsChose: this.mu || null, // 当前tab的选择
      loves: {}, // 用于未登录时收藏的交易对
      searchValue: '', // 搜索框值
      sortValue: '', // 排序 '11'名称升序，'12'名称降序，'21'价格升,'22'价格降,'31'涨幅升,'32'涨幅降
    };
  },
  props: {
    i18n: { type: Object, required: true }, // 语言包
    theme: { type: String },
    sourceData: { type: Array }, // 所需原始数据
    mu: { type: String, default: 'USD' }, // 当前选择的母币
    zi: { type: String, default: 'BTC' }, // 当前选择的子币
    isLogin: { type: Boolean, default: false }, // 是否已登录
  },
  /** ==== 计算属性 ==== **/
  computed: {
    // 筛选要显示的数据
    tableData() {
      let temp = [];
      const loves = Object.keys(this.loves).filter(key => this.loves[key]); // 所有已收藏的key

      // 选择的是收藏类目
      if (this.tabsChose === 'collection') {
        if (!this.isLogin) {
          Object.keys(this.loves).forEach(key => {
            if (this.loves[key]) {
              const zimu = key.split('/');
              this.sourceData.forEach(item => {
                if (item.symbol === zimu[1]) {
                  let obj = item.lists.find(zi => zi.symbol === zimu[0]);
                  if (obj) {
                    obj = { ...obj };
                    obj.isLove = true;
                    temp.push(obj);
                  }
                }
              });
            }
          });
        } else {
          this.sourceData.forEach(mu => {
            mu.lists.forEach(item => {
              if (item.isLove) {
                temp.push(item);
              }
            });
          });
        }
      } else {
        let data = this.sourceData.find(item => item.symbol === this.tabsChose) || { lists: [] };

        // 未登录时手动设置已收藏的信息
        if (!this.isLogin) {
          temp = data.lists.map(item => {
            const obj = {
              ...item,
            };
            if (loves.includes(`${item.symbol}/${item.mu}`)) {
              obj.isLove = true;
            } else {
              obj.isLove = false;
            }
            return obj;
          });
        } else {
          temp = data.lists;
        }
      }

      // 最后进行search筛选
      if (this.searchValue) {
        const searchValue = this.searchValue.toUpperCase();
        temp = temp.filter(item => {
          if (this.tabsChose === 'collection') {
            return item.symbol.includes(searchValue) || item.mu.includes(searchValue);
          }
          return item.symbol.includes(searchValue);
        });
      }

      // 还要排个序
      switch (this.sortValue) {
        case '11':
          temp.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
          break;
        case '12':
          temp.sort((a, b) => (a.symbol > b.symbol ? -1 : 1));
          break;
        case '21':
          temp.sort((a, b) => a.lastPrice - b.lastPrice);
          break;
        case '22':
          temp.sort((a, b) => b.lastPrice - a.lastPrice);
          break;
        case '31':
          temp.sort((a, b) => a.change - b.change);
          break;
        case '32':
          temp.sort((a, b) => b.change - a.change);
          break;
      }
      return temp;
    },
  },
  /** ==== 监听 ==== **/
  watch: {
    sourceData(newV, oldV) {
      if (!oldV || !Object.keys(oldV).length) {
        let tabIndex = 5;
        if (this.tabsChose !== 'collection') {
          tabIndex = newV.findIndex(item => item.symbol === this.tabsChose);
        } else {
          this.lineWidth = 86;
        }
        this.lineLeft = tabIndex * 41;
      }
    },
  },
  /** 过滤器 **/
  filters: {
    // 根据允许的小数位截断数字
    formatNumber(num, p = 2) {
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
  /** 自定义指令 **/
  directives: {
    // 点击的动画效果
    praise: {
      onClick() {
        const el = this;
        const ds = [];
        for (let i = 1; i <= 8; i++) {
          const d = document.createElement('div');
          d.style.position = 'absolute';
          d.style.height = '4px';
          d.style.width = '4px';
          d.style.borderRadius = '4px';
          d.style.opacity = '1';
          d.style.left = '50%';
          d.style.top = '50%';
          d.style.marginLeft = '-2px';
          d.style.marginTop = '-2px';
          d.style.backgroundColor = '#6194f7';
          d.style.transition = 'all 500ms';
          d.style.transform = 'translate(0,0) scale(1.2,1.2)';
          el.appendChild(d);
          setTimeout(() => {
            let x, y;
            switch (i) {
              case 1:
                x = 0;
                y = -12;
                break;
              case 2:
                x = 9;
                y = -9;
                break;
              case 3:
                x = 12;
                y = 0;
                break;
              case 4:
                x = 9;
                y = 9;
                break;
              case 5:
                x = 0;
                y = 12;
                break;
              case 6:
                x = -9;
                y = 9;
                break;
              case 7:
                x = -12;
                y = 0;
                break;
              case 8:
                x = -9;
                y = -9;
                break;
            }
            d.style.transform = `translate(${x}px,${y}px) scale(0,0)`;
            d.style.opacity = '1';
          });
          setTimeout(() => {
            el.removeChild(d);
          }, 600);
        }
      },
      inserted(el, binding, vnode) {
        el.addEventListener('click', binding.def.onClick, false);
      },
    },
  },
  mounted() {
    const love = Storage.get('love');
    if (love) {
      this.loves = JSON.parse(love);
    }
    if (this.sourceData && Object.keys(this.sourceData).length) {
      let tabIndex = 5;
      if (this.tabsChose !== 'collection') {
        tabIndex = this.sourceData.findIndex(item => item.symbol === this.tabsChose);
      } else {
        this.lineWidth = 86;
      }
      this.lineLeft = tabIndex * 41;
    }
  },
  /** ==== 方法们 ==== **/
  methods: {
    /** 市场Tab页切换 **/
    tabChange(e, str) {
      this.tabsChose = str;

      this.lineLeft = e.target.offsetLeft;
      this.lineWidth = e.target.offsetWidth;
    },
    // 用户点击收藏或取消收藏某子币
    onCollect(item) {
      // 如果没有登录，就保存到Cookie里，不触发父级了
      if (!this.isLogin) {
        let love = Storage.get('love');
        if (love) {
          love = JSON.parse(love);
        } else {
          love = {};
        }
        if (item.isLove) {
          love[`${item.symbol}/${item.mu}`] = false;
        } else {
          love[`${item.symbol}/${item.mu}`] = true;
        }
        Storage.set('love', love);
        this.loves = love;
        return;
      }

      this.$emit('onCollect', item.symbol, item.mu, item.isLove); // 不需要取反，api处处理了
    },
    // 用户进行搜索
    onSearchInput(e) {
      if (!/^[a-zA-Z]*$/.test(e.target.value)) {
        this.$nextTick(() => {
          e.target.value = this.searchValue;
        });
        return;
      }
      this.searchValue = e.target.value = e.target.value.toUpperCase();
    },
    // 用户点选了某个子币
    onListChose(item) {
      this.$emit('onSymbolChange', item.symbol, item.mu, item);
    },
    // 排序 type1,2,3.
    onSortMarket(type) {
      switch (type) {
        case 1:
          if (this.sortValue === '11') {
            this.sortValue = '12';
          } else if (this.sortValue === '12') {
            this.sortValue = '00';
          } else {
            this.sortValue = '11';
          }
          break;
        case 2:
          if (this.sortValue === '21') {
            this.sortValue = '22';
          } else if (this.sortValue === '22') {
            this.sortValue = '00';
          } else {
            this.sortValue = '21';
          }
          break;
        case 3:
          if (this.sortValue === '31') {
            this.sortValue = '32';
          } else if (this.sortValue === '32') {
            this.sortValue = '00';
          } else {
            this.sortValue = '31';
          }
      }
    },
  },
};
</script>

<style lang="scss">
.trade-market-box {
  --backgroundColor: #fff;
  --color: #354989;
  --borderColor: #ecf0f9;
  --shadowColor: #ecf0f9;
  --hoverColor: #f8f9ff;
  --inputBackColor: #fff;
  --littleColor: #354989;
  --textColor2: #354989;
  --textZeroColor: #c7cce6;
  --sortColor1: #e0e0e0;
  --sortColor2: #354989;
  --searchColor: #c0c4cc;
  &.dark {
    --backgroundColor: #191d35;
    --color: #c7cce6;
    --borderColor: #242a49;
    --shadowColor: rgba(9, 13, 32, 0.4);
    --hoverColor: #1e223d;
    --inputBackColor: #191d35;
    --littleColor: #666a7f;
    --textColor2: #c7cce6;
    --textZeroColor: #666a7f;
    --sortColor1: #666a7f;
    --sortColor2: #5693ff;
    --searchColor: #666a81;
  }
  position: relative;
  height: 100%;
  background-color: var(--backgroundColor);
  border-radius: 4px;
  overflow: hidden;
  color: var(--color);
  .head {
    padding: 10px 16px 0 16px;
    width: 100%;
    display: flex;
    align-items: center;
    .title {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      color: var(--color);
    }
    .search-input {
      width: 112px;
      input {
        background-color: var(--inputBackColor);
        border-color: var(--borderColor);
        color: var(--color);
      }
      .el-input__suffix-inner {
        color: var(--searchColor);
      }
    }
  }
  .tabs-box-shadow {
    box-shadow: 0 4px 4px var(--shadowColor);
  }
  .tabs-box {
    display: flex;
    position: relative;
    width: calc(100% - 20px);
    margin-left: 10px;
    & > li {
      flex: none;
      padding: 16px 6px;
      display: flex;
      align-items: center;
      color: #7d86ac;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #5693ff;
      }
      &.checked {
        color: #5693ff;
      }
    }
    & > .myself {
      flex: none;
      padding: 0 10px;
    }
    & > .line {
      position: absolute;
      height: 2px;
      width: 30px;
      padding: 0;
      left: 0;
      bottom: -2px;
      transition: all 300ms;
      &:after {
        content: '';
        height: 100%;
        width: 80%;
        position: absolute;
        left: 10%;
        border-radius: 2px;
        background-color: #5693ff;
      }
    }
  }
  .list-head {
    display: flex;
    padding: 0 20px;
    height: 40px;
    color: var(--littleColor);
    align-items: center;

    & > li {
      cursor: pointer;
      display: flex;
      align-items: center;
      user-select: none;
      .sort-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 3.5px;
        i {
          display: block;
          width: 0;
          height: 0;
          border: solid 4px transparent;
          &.up {
            border-bottom-color: var(--sortColor1);
            &.highlight {
              border-bottom-color: var(--sortColor2);
            }
          }
          &.down {
            margin-top: 4px;
            border-top-color: var(--sortColor1);
            &.highlight {
              border-top-color: var(--sortColor2);
            }
          }
        }
      }
    }
    & > li:first-child {
      flex: none;
      width: 25%;
    }
    & > li:nth-child(2) {
      flex: none;
      width: 38%;
      justify-content: flex-end;
    }
    & > li:nth-child(3) {
      flex: none;
      width: 37%;
      justify-content: flex-end;
    }
  }
  .list-box {
    position: relative;
    height: calc(100% - 131px);
    overflow: hidden;
    background-size: 50% auto;
    background-position: center center;
    background-repeat: no-repeat;
    &.hideback {
      background-image: none;
    }
    ul {
      background-color: var(--backgroundColor);
      & > li {
        display: flex;
        padding: 0 20px;
        align-items: center;
        height: 30px;
        font-size: 12px;
        cursor: pointer;
        &.active {
          background-color: var(--hoverColor);
        }
        &:hover {
          background-color: var(--hoverColor);
        }
        .name {
          flex: none;
          width: 25%;
          font-weight: 600;
          display: flex;
          align-items: center;
          margin-left: -3px;
          .like {
            position: relative;
            height: 20px;
            width: 20px;
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            font-weight: normal;
            .icon-yishoucang {
              color: #5693ff;
            }
          }
        }
        .price {
          flex: none;
          width: 38%;
          text-align: right;
        }
        .change {
          flex: none;
          width: 37%;
          text-align: right;
          color: var(--textZeroColor);
          &.green {
            color: rgb(41, 167, 108);
          }
          &.red {
            color: #df543a;
          }
        }
      }
    }
  }
}
</style>