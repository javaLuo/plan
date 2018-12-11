<template>
  <div class="bake-slot">
    <ul class="bake-head">
      <li>
        <div>{{Bake.allbake}}</div>
        <div>
          <span>{{bakeNow && bakeNow.total | moneyFormat}}</span>
          <!-- bakeNow && bakeNow.productName -->
          <span>XTZ</span>
        </div>
      </li>
      <li>
        <div>{{Bake.lastday}}</div>
        <div>
          <span>{{bakeNow && bakeNow.lastInterest | moneyFormat}}</span>
          <span>XTZ</span>
        </div>
      </li>
      <li>
        <div>{{Bake.accum}}</div>
        <div>
          <span>{{bakeNow && bakeNow.interest | moneyFormat}}</span>
          <span>XTZ</span>
        </div>
      </li>
    </ul>
    <div class="bake-body">
      <div class="title-box">
        <div class="title">{{Bake.bakehistory}}</div>
        <el-input prefix-icon="el-icon-search"
                  size="small"
                  :maxlength="24"
                  clearable
                  style="width:180px"
                  @input="onBakeSearch">
        </el-input>
      </div>
      <div class="table-box">
        <ul class="table-th">
          <li class="big">{{Bake.projectname}}</li>
          <li class="big">{{Bake.projecttype}}</li>
          <li class="big">{{Bake.currentAmount}}</li>
          <li class="big">{{Bake.currentReturn}}</li>
          <li class="big"
              v-if="startMoney>0">{{Bake.returnStart}}</li>
          <li class="big"
              v-else>{{Bake.accum}}</li>

          <li class="big">{{Bake.status}}</li>
          <li>{{Bake.operation}}</li>
          <li class="txtright">{{Bake.detail}}</li>
        </ul>
        <div class="table-body"
             v-loading="bakeLoading">
          <TableShrink v-for="(item) in bakePageFilterData"
                       :key="item.id"
                       :sourceData="item"
                       @onCancel="onBakeCancel" />
          <div v-if="!bakeFilterData || !bakeFilterData.length"
               class="no-data">
            <img src="~/assets/images/tokensell/nothing@2x.png"
                 alt="nothing" />
            <div>{{Bake.noData}}</div>
          </div>
        </div>
      </div>
      <div class="pagination-box"
           v-show="bakeFilterData.length">
        <el-pagination background
                       layout="prev, pager, next"
                       :total="bakeFilterData.length"
                       @current-change="onBakeCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getBakeHistory, getProductList, cancelBakeOrder } from '~/store/modules/bake/types';
import TableShrink from '~/components/TableShrink.vue';
import tools from '~/utils';
import big from '~/utils/big';
export default {
  data() {
    return {
      bakeHistoryData: [], // 烘焙记录所需数据
      bakeSearchValue: '', // 搜索输入框的值
      bakeSearchTimer: null, // 搜索防抖timer
      bakeLoading: false, // Bake区域Loading
      bakePageNow: 1,
      bakePageSize: 10,
      period: 0,
    };
  },
  components: {
    TableShrink,
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      Bake: state => state.i18n.App.Bake,
      userInfo: state => state.user.userInfo,
      ErrorCode: state => state.i18n.App.ErrorCode,
    }),

    // 搜索框筛选后的全部原始数据
    bakeFilterData() {
      let source = this.bakeHistoryData;
      if (this.bakeSearchValue) {
        source = source.filter(item => {
          if (!item.productName) {
            return false;
          }
          return item.productName.toUpperCase().includes(this.bakeSearchValue.toUpperCase());
        });
      }

      return source;
    },
    // 收益开始倒计时还有多少天
    startMoney() {
      if (!this.bakeHistoryData[0]) {
        return 0;
      }
      const t = this.bakeHistoryData[0].interestStartTimeStamp * 1000;
      const n = new Date().getTime();
      const m = Math.ceil((t - n) / (1000 * 60 * 60 * 24)) || 0;
      return m < 0 ? 0 : m;
    },
    // 前端分页处理
    bakePageFilterData() {
      return this.bakeFilterData.slice((this.bakePageNow - 1) * this.bakePageSize, this.bakePageNow * this.bakePageSize);
    },
    // 烘焙相关 - 当前烘焙数据汇总
    bakeNow() {
      const res = {
        productName: null, // 项目名称（交易对名称）
        total: 0, // 总烘焙数量
        lastInterest: 0, // 昨日烘焙总收益
        interest: 0, // 累计烘焙收益
      };
      let names = new Set();
      this.bakeHistoryData.forEach(item => {
        names.add(item.productName);
        res.total = big.plus(res.total, Number(item.total) || 0);
        res.lastInterest = big.plus(res.lastInterest, Number(item.lastInterest) || 0);
        res.interest = big.plus(res.interest, Number(item.interest) || 0);
      });
      res.productName = Array.from(names).join('/');
      return res;
    },
  },
  mounted() {
    // 获取烘焙历史记录
    this.getBakesData();
  },

  filters: {
    // 千分位分割
    moneyFormat(num) {
      const n = Number(num);
      if (isNaN(n)) {
        return '0';
      }
      const str = String(n).split('.');
      const str0 = Number(str[0]).toLocaleString('en-US');
      const res = str[1] ? `${str0}.${str[1]}` : str0;
      return res;
    },
  },

  methods: {
    ...mapActions({
      getBakeHistory,
      cancelBakeOrder,
      getProductList,
    }),

    // 烘焙相关 - 获取烘焙交易历史记录
    getBakesData() {
      if (!this.isLogin) {
        return;
      }
      const params = {
        pageNo: 1,
        pageSize: 99999,
      };
      this.bakeLoading = true;
      this.getBakeHistory(params).then(res => {
        if (res && res.code === 200) {
          this.bakeHistoryData = res.data.list;
        } else {
          this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
        }
        this.bakeLoading = false;
      });
    },

    // 烘焙相关 - 用户取消某一条
    async onBakeCancel(item) {
      const res = await this.getProductList();
      this.period = res.data.data[0].dayLimit;
      const periodTime = Number(this.period) * 24 * 60 * 60 * 1000;
      // 参与时间大于期限时间以上才能取消
      const missTime = new Date().getTime() - item.createTimestamp * 1000 || 0;
      if (missTime < periodTime) {
        this.$message({
          type: 'info',
          message: `${this.Bake.canCancelDate.replace('@1', tools.ForMatDateDuBai(item.createTimestamp * 1000 + periodTime))}`,
        });
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: this.Bake.modalTitle,
        message: h('div', null, [
          h('p', null, [
            h('span', null, this.Bake.info[0]),
            h('i', { style: 'font-style:normal;color: #007cff' }, Math.floor(missTime / 1000 / 60 / 60 / 24)),
            h('span', null, this.Bake.info[1]),
            h('i', { style: 'font-style:normal;color: #007cff' }, `${item.interest} ${item.productName}`),
            h('span', null, this.Bake.info[2]),
          ]),
          h('p', null, [h('span', null, this.Bake.info2)]),
        ]),
        showCancelButton: true,
        confirmButtonText: this.Bake.ok,
        cancelButtonText: this.Bake.cancel,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // 用户点了确定，调用取消接口，成功后重新获取全部列表数据
            this.cancelBakeOrder({ orderId: item.id }).then(res => {
              if (res && res.code === 200) {
                this.$message.success(this.Bake.cancelSuccess);
                this.getBakesData();
              } else {
                this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
                this.bakeLoading = false;
              }
            });
          }
          done();
        },
      });
    },
    // 烘焙相关 - 用户改变了页码
    onBakeCurrentChange(e) {
      this.bakePageNow = e;
    },

    // 烘焙相关 - 用户进行搜索
    onBakeSearch(v) {
      this.bakeSearchValue = v;
      this.bakePageNow = 1;
    },
  },
};
</script>

<style lang='scss' scoped>
@import '~assets/css/_theme.scss';
.bake-slot {
  // background-color: #f4f6fb;
  .bake-head {
    padding: 28px 0;
    display: flex;
    @include bgPair(background-color);
    & > li {
      position: relative;
      & + li:before {
        content: '';
        position: absolute;
        left: 0;
        height: 80%;
        top: 10%;
        width: 1px;
        @include cutLinePair(background-color);
      }
      flex: 1;
      text-align: center;
      @include subFontPair(color);
      & > div:nth-child(2) {
        margin-top: 10px;
        & > span {
          &:first-child {
            font-size: 24px;
            @include increasePair(color);
          }
          &:nth-child(2) {
            margin-left: 8px;
            @include fontPair(color);
          }
        }
      }
    }
  }
  .bake-body {
    @include bgPair(background-color);
    margin-top: 20px;
    .no-data {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ccc;
      font-size: 12px;
      text-align: center;
      img {
        width: 40px;
        height: auto;
        margin-bottom: 10px;
      }
    }
    .title-box {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 26px;
      .title {
        font-size: 18px;
        @include fontPair(color);
      }
    }
    .table-box {
      .table-th {
        height: 48px;
        display: flex;
        align-items: center;
        font-size: 12px;
        @include subFontPair(color);
        @include hoverPair(background-color);
        padding: 0 18px;
        margin: 0 8px;
        & > li {
          flex: 0.6;
          padding: 0 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.big {
            flex: 1;
          }
          &.txtright {
            text-align: right;
          }
        }
      }
    }
    .pagination-box {
      padding: 50px 15px 32px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>