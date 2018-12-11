<!-- 用于首页的市场组件 -->
<template>
  <div class="market-home-com">
    <!-- 头 -->
    <div class="head-box">
      <ul class="tabs-box">
        <li class="myself"
            @click="tabChange('collection')"
            :class="{checked: tabsChose === 'collection'}"><i class="iconfont icon-yishoucang"></i>{{i18n.market.my}}</li>
        <li v-for="(item, index) in sourceData"
            :key="index"
            @click="tabChange(item.symbol)"
            :class="{checked: tabsChose === item.symbol}"><i :class="['token-logo', 'default-icon', `${item.symbol}`]"></i>{{item.symbol}}</li>
      </ul>

      <el-input :value="searchValue"
                @input.native="onSearchInput"
                class="search-input"
                suffix-icon="el-icon-search"
                maxlength="7"
                size="small">
      </el-input>
    </div>
    <!-- 内容 -->
    <div :class="['body-box',{'minHeight': loading}]"
         v-loading="loading">
      <ul class="list-head">
        <li @click="onSortMarket(1)">
          <span>{{i18n.market.pairs}}</span>
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
          <span>{{i18n.market.change24}}</span>
          <div class="sort-box">
            <i :class="['up',{'highlight': sortValue==='31'}]" />
            <i :class="['down',{'highlight': sortValue==='32'}]" />
          </div>
        </li>
        <li @click="onSortMarket(4)">
          <span>{{i18n.market.high24}}</span>
          <div class="sort-box">
            <i :class="['up',{'highlight': sortValue==='41'}]" />
            <i :class="['down',{'highlight': sortValue==='42'}]" />
          </div>
        </li>
        <li @click="onSortMarket(5)">
          <span>{{i18n.market.low24}}</span>
          <div class="sort-box">
            <i :class="['up',{'highlight': sortValue==='51'}]" />
            <i :class="['down',{'highlight': sortValue==='52'}]" />
          </div>
        </li>
        <li @click="onSortMarket(6)">
          <span>{{i18n.market.v24}}</span>
          <div class="sort-box">
            <i :class="['up',{'highlight': sortValue==='61'}]" />
            <i :class="['down',{'highlight': sortValue==='62'}]" />
          </div>
        </li>
      </ul>
      <div class="list-box"
           data-scrollbar>
        <ul>
          <li v-for="(item,index) in tableData"
              :key="index"
              @click="onListChose(item)">
            <div class="name">
              <div class="like"
                   @click.stop="onCollect(item)"
                   v-praise>
                <i v-show="item.isLove"
                   class="iconfont icon-yishoucang"></i>
                <i v-show="!item.isLove"
                   class="iconfont icon-weishoucang"></i>
              </div>
              <i :class="['token-logo', 'default-icon', `${item.symbol}`]"></i>
              {{item.symbol}}<span>/{{item.mu}}</span>
            </div>
            <div>{{item.lastPrice|formatNumber(item.muPoint)}}</div>
            <div :class="['change',{'green': item.change>0},{'red': item.change<0}]">{{item.change>0 ? '+' : ''}}{{item.change|formatNumber}}%</div>
            <div>{{item.h|formatNumber(item.muPoint)}}</div>
            <div>{{item.l|formatNumber(item.muPoint)}}</div>
            <div>{{item.v|formatNumber(item.ziPoint)}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { selectGroup, selectMinAmount, saveLove } from '~/store/modules/trade/types';
import Scrollbar from 'smooth-scrollbar';
import Storage from '~/utils/storage';
import Configs from '~/common/config';
export default {
  data() {
    return {
      mu: this.isSliver ? Configs.DEFAULT.smu : Configs.DEFAULT.mu, // 母币
      tabsChose: this.isSliver ? Configs.DEFAULT.smu : Configs.DEFAULT.mu, // 当前tab的选择
      loves: {}, // 用于未登录时收藏的交易对
      searchValue: '', // 搜索框值
      groupTimer: null, // 市场轮询timer
      groupTime: 0, // 市场数据轮询间隔时间
      loading: true, // 是否正在加载数据
      sortValue: '00', // 排序
    };
  },
  props: {
    isSliver: { type: Boolean, default: false }, // 是否是银榜，交易对不一样
  },
  filters: {
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
  computed: {
    ...mapState({
      i18n: state => state.i18n.App.Trade,
      isLogin: state => state.isLogin,
      ErrorCode: state => state.i18n.App.ErrorCode,
      marketData: state => state.trade.marketData,
      marketDataSliver: state => state.trade.marketDataSliver,
    }),
    sourceData() {
      return this.isSliver ? this.marketDataSliver : this.marketData;
    },

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

      // 再排个序
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
        case '41':
          temp.sort((a, b) => a.h - b.h);
          break;
        case '42':
          temp.sort((a, b) => b.h - a.h);
          break;
        case '51':
          temp.sort((a, b) => a.l - b.l);
          break;
        case '52':
          temp.sort((a, b) => b.l - a.l);
          break;
        case '61':
          temp.sort((a, b) => a.v - b.v);
          break;
        case '62':
          temp.sort((a, b) => b.v - a.v);
          break;
      }

      return temp;
    },
  },

  mounted() {
    Scrollbar.initAll();
    this.selectMinAmount();
    this.getGroups();
    if (this.sourceData && this.sourceData.length) {
      this.loading = false;
    }
    const love = Storage.get('love');
    if (love) {
      this.loves = JSON.parse(love);
    }
  },

  beforeDestroy() {
    clearTimeout(this.groupTimer);
  },
  /** ==== 方法 ==== **/
  methods: {
    ...mapActions({
      selectGroup,
      saveLove,
      selectMinAmount,
    }),

    /** 获取市场所有的母币子币，和它们的最新信息 **/
    getGroups() {
      clearTimeout(this.groupTimer);

      this.groupTimer = setTimeout(() => {
        this.selectGroup({ isS: this.isSliver })
          .then(res => {
            this.groupTime = 8000;
            this.loading = false;
            this.getGroups();
          })
          .catch(err => console.error('error:', err));
      }, this.groupTime);
    },

    // 用户点击收藏或取消收藏某子币
    onCollect(item) {
      // 如果没有登录，就保存到Cookie里
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

      // 如果登录了就触发真正的收藏接口
      this.saveLove({
        isLove: item.isLove,
        symbol: `${item.symbol}${item.mu}`,
      }).then(res => {
        if (res.code === 200) {
          // 操作成功后立即刷新市场数据
          this.groupTime = 0;
          this.getGroups();
        }
        if (res.code !== 200) {
          this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
        }
      });
    },
    // 用户点击一条数据，跳转到对应到交易页
    onListChose(item) {
      let base = '/trade';

      if (this.isSliver) {
        base = '/sliverexchange';
      }
      this.$router.push(`${base}/${item.symbol}_${item.mu}`);
    },
    // 用户点选tabs
    tabChange(str) {
      this.tabsChose = str;
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

    // 用户点击排序
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
          break;
        case 4:
          if (this.sortValue === '41') {
            this.sortValue = '42';
          } else if (this.sortValue === '42') {
            this.sortValue = '00';
          } else {
            this.sortValue = '41';
          }
          break;
        case 5:
          if (this.sortValue === '51') {
            this.sortValue = '52';
          } else if (this.sortValue === '52') {
            this.sortValue = '00';
          } else {
            this.sortValue = '51';
          }
          break;
        case 6:
          if (this.sortValue === '61') {
            this.sortValue = '62';
          } else if (this.sortValue === '62') {
            this.sortValue = '00';
          } else {
            this.sortValue = '61';
          }
          break;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/_theme-conf';

.market-home-com {
  min-width: 1024px;
  width: 62.5%;
  max-width: 1180px;
  margin: 0 auto;
  @include fontPair(color);
  margin-top: 50px;
  .head-box {
    height: 40px;
    display: flex;
    justify-content: space-between;
    .tabs-box {
      display: flex;
      flex: none;
      & > li {
        position: relative;
        margin-left: -1px;
        width: 133px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border: 1px solid;
        @include borderPair(border-color);
        @include bgPair(background-color);

        &:hover {
          @include hoverPair(background-color);
        }
        &.checked {
          @include frontPair(border-bottom-color);
          @include frontPair(background-color);
        }
        i {
          top: 0;
          font-size: 20px;
        }

        &:first-of-type {
          i {
            position: relative;
            left: -4px;
          }
        }
      }
    }
    .search-input {
      align-self: flex-start;
      width: 250px;
      input {
        border-radius: 0;
        @include fontPair(color);
        @include bgPair(background-color);
        @include borderPair(border-color);
        height: 36px;
      }
    }
  }
  .body-box {
    &.minHeight {
      min-height: 350px;
    }
    border: solid 1px;
    @include borderPair(border-color);
    margin-top: -1px;
    .list-head {
      display: flex;
      padding: 0 50px;
      height: 50px;
      align-items: center;
      border-bottom: solid 1px;
      @include cutLinePair(border-bottom-color);
      @include borderPair(border-color);
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
          &.down {
            margin-top: 4px;
          }
        }
      }
      & > li {
        width: 17%;
        flex: none;
        display: flex;
        cursor: pointer;
        justify-content: flex-end;
        @include subFontPair(color);
        &:first-child {
          width: 15%;
          justify-content: flex-start;
        }
      }
    }
    .list-box {
      position: relative;
      height: calc(100% - 126px);
      max-height: 770px;
      overflow: hidden;
      @include bgPair(background-color);
      @include cutLinePair(border-bottom-color);
      ul {
        & > li {
          display: flex;
          align-items: center;
          height: 48px;
          font-size: 14px;
          padding: 0 50px;
          cursor: pointer;

          &:not(:last-of-type) {
            border-bottom: 1px solid;
            @include borderPair(border-color);
          }
          &:hover {
            @include hoverPair(background-color);
          }
          & > div {
            text-align: right;
            flex: none;
            width: 17%;

            &.name {
              flex: none;
              width: 15%;
              display: flex;
              align-items: center;
              text-align: left;
              .like {
                position: relative;
                height: 20px;
                width: 20px;
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                font-weight: normal;
                margin-right: 8px;
                .icon-yishoucang {
                  color: #5693ff;
                }
              }
              .token-logo {
                top: 0;
              }
              span {
                @include subFontPair(color);
              }
            }
            &.change {
              color: rgb(220, 220, 220);
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
  }
}

// 这个实在难搞，不好抽，直接写了
.light {
  .market-home-com {
    .list-head {
      i {
        &.up {
          border-bottom-color: #e0e0e0;
          &.highlight {
            border-bottom-color: #354989;
          }
        }
        &.down {
          border-top-color: #e0e0e0;
          &.highlight {
            border-top-color: #354989;
          }
        }
      }
    }
  }
}
.dark {
  .market-home-com {
    .list-head {
      i {
        &.up {
          border-bottom-color: #666a81;
          &.highlight {
            border-bottom-color: #354989;
          }
        }
        &.down {
          border-top-color: #666a81;
          &.highlight {
            border-top-color: #354989;
          }
        }
      }
    }
  }
}
</style>