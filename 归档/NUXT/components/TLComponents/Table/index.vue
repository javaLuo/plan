<template>
  <div class="tl-table">
    <ul class="tl-table-head"
        v-if="column.length">
      <li v-for="(col, index) in column"
          :key="index"
          :class="[col.class, {sort: col.sort}]"
          :style="{width: col.width, textAlign: col.align ? col.align : 'left'}">
        {{columnLocalText ? columnLocalText[index] : col.dataIndex}}
        <span>
          <em :class="['up', {active: activeSort === 'up' && activeDataIndex === col.dataIndex}]"
              @click="onSort('up', col.dataIndex, col)"></em>
          <em :class="['down', {active: activeSort === 'down' && activeDataIndex === col.dataIndex}]"
              @click="onSort('down', col.dataIndex, col)"></em>
        </span>
      </li>
    </ul>
    <div class="tl-table-content-wrapper"
         id="scrollWrapper"
         :style="{'max-height': scroll + 'px'}"
         v-if="dataSource && dataSource.length">
      <ul class="tl-table-content">
        <li v-for="(item, index) in dataSource"
            :key="index"
            @click.stop.prevent="onTrade(item)"
            v-tap="{ methods: onTradePad , index : index, item:item }">
          <div v-for="col in column"
               :key="col.dataIndex"
               :style="{width: col.width, textAlign: col.align ? col.align : 'left'}">
            <slot v-if="col.slot"
                  :name="col.dataIndex"
                  :text="item[col.dataIndex]"
                  :record="item"
                  :index="index">{{item[col.dataIndex]}}</slot>
            <span v-else>{{item[col.dataIndex]}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="no-data"
         v-else>
      {{emptyText}}
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Storage from '~/utils/storage';

export default {
  name: 'TlTable',
  props: {
    column: [Array, []],
    emptyText: [String, 'No Data'],
    scroll: [Number, 200],
    dataSource: [Array, []],
    columnLocalText: [Array, []],
    activeCoin: {
      type: String,
      default: 'BTC',
    },
  },
  data() {
    return {
      activeSort: '',
      activeDataIndex: '',
      myIscroll: null,
    };
  },
  computed: {
    ...mapState({
      homeLanguage: state => state.i18n.App.Home,
    }),
  },
  watch: {
    dataSource(nextData, preData) {
      if (preData !== nextData && nextData.length && process.browser) {
        const IScroll = require('iscroll');
        setTimeout(() => {
          if (!!this.myIscroll) {
            this.myIscroll.destroy();
            this.myIscroll = null;
          }
          if (document.querySelector('#scrollWrapper') == null) return;
          this.myIscroll = new IScroll('#scrollWrapper', {
            mouseWheel: true,
            keyBindings: true,
            scrollbars: true,
          });
        }, 50);
      }
    },
  },
  mounted() {
    // console.log(this.dataSource)
  },
  methods: {
    onSort(type, dataIndex, col) {
      if (this.activeSort === type && this.activeDataIndex === dataIndex) return;
      this.activeSort = type;
      this.activeDataIndex = dataIndex;
      if (!this.dataSource.length) return;
      this.dataSource.sort(this.sortBy(dataIndex, type === 'up'));
    },
    onTrade(item) {
      Storage.set('gmu', this.activeCoin);
      Storage.set('gzi', item.market);
      this.$router.push('/trade');
    },
    onTradePad(params) {
      Storage.set('gmu', this.activeCoin);
      Storage.set('gzi', params.item.market);
      this.$router.push('/trade');
    },
    sortBy(attr, rev) {
      //第二个参数没有传递 默认升序排列
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }

      return function(a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
  },
};
</script>

<style  lang="scss">
@import '../../../assets/css/_theme-conf';

@mixin spaceBetween {
  display: flex;
  justify-content: space-between;
}
.tl-table {
  .tl-table-head {
    @include spaceBetween;
    border-bottom: 1px solid #e9ecf4;
    background: #f6f8fe;

    li {
      height: 50px;
      line-height: 50px;

      &:first-of-type {
        text-align: center !important;
      }
      &:last-of-type {
        padding-right: 20px;
      }
      > span {
        position: relative;
        display: inline-block;
        width: 10px;
        display: none;

        em {
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          cursor: pointer;

          &.up {
            top: -11px;
            border-width: 0px 4px 5px;
            border-color: transparent transparent $light008 transparent;
            &.active {
              border-color: transparent transparent #666 transparent;
            }
          }
          &.down {
            top: -4px;
            border-width: 5px 4px 0px;
            border-color: $light008 transparent transparent transparent;
            &.active {
              border-color: #666 transparent transparent transparent;
            }
          }
        }
      }
      &.sort {
        span {
          display: inline-block;
        }
      }
    }
  }

  .tl-table-content-wrapper {
    overflow: hidden;
    position: relative;

    .tl-table-content {
      background: $light002;
      li {
        @include spaceBetween;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        > div {
          &:first-of-type {
            text-indent: 20px;
          }
          &:last-of-type {
            padding-right: 20px;
          }
        }

        &:hover {
          background: #f8f9ff;
        }

        &:not(:last-of-type) {
          border-bottom: 1px solid $light008;
        }
      }
    }
  }
}
</style>