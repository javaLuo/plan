<template>
  <div class="charge-history">
    <div class="ft">
      <div class="h"
           v-loading="loading">
        <el-table ref="table"
                  :empty-text="i18n.App.AccountDetail.emptyData"
                  v-if="!loading"
                  :data="withdrawLists"
                  style="width: 100%;">
          <el-table-column type="expand"
                           width="0px">
            <template slot-scope="props">
              <ul class="expend-content">
                <li>
                  <dl>
                    <dt>{{i18n.App.AccountDetail.Time}}:</dt>
                    <dd>{{props.row.time | dubaiDate('YYYY-MM-DD HH:mm:ss')}}</dd>
                  </dl>
                  <dl>
                    <dt>{{i18n.App.WithDraw.address}}:</dt>
                    <dd>{{props.row.address}}</dd>
                  </dl>
                  <dl>
                    <dt>{{i18n.App.AccountDetail.Amount}}:</dt>
                    <dd>{{ props.row.fee }}</dd>
                  </dl>
                  <dl v-if="props.row.txid">
                    <dt>TxID:</dt>
                    <dd>
                      {{ props.row.txid }}
                      <span v-copy="{val:props.row.txid,success:i18n.App.Recharge.copyMes,error:'error'}">{{i18n.App.WithDraw.cpy}}</span>
                    </dd>
                  </dl>
                </li>
              </ul>
            </template>
          </el-table-column>

          <el-table-column :label="i18n.App.WithDraw.coin">
            <template slot-scope="scope">
              <i :class="`token-logo default-icon ${scope.row.coin}`"></i>
              <span>{{scope.row.coin}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Time">
            <template slot-scope="scope">
              <span v-dateAgo="{ago:scope.row.time,now:scope.row.now,locale:$store.state.locale}"></span>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Amount"
                           prop="fee">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Status">
            <template slot-scope="scope">
              <!-- 总共3种状态 -->
              <div :class="`order-status${[1,2,3,4].includes(scope.row.status) ? 1 : [-1,-2,-4,-8].includes(scope.row.status) ? 3 : ''} break-word`">
                <!-- 审核完成 =》 显示提币状态
                否则    =》 显示审核状态 -->
                <!-- 98自动审核
                99人工审核 -->
                <!-- <pre>
                  {{scope.row}}
                </pre> -->
                {{(scope.row.auditStatus === 98 || scope.row.auditStatus === 99) ?
                i18n.App.WithDraw.status[scope.row.status]
                :
                i18n.App.WithDraw.auditStats[scope.row.auditStatus]}}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Option"
                           width="230"
                           header-align='right'>
            <template slot-scope="scope">
              <div class="action">
                <span class="detail-text"
                      @click="onDetail(scope.row, scope)">{{i18n.App.WithDraw.detail}} <i class="el-icon-arrow-up"></i></span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="b"
           v-if="total">
        <el-pagination @current-change="onChangePage($event)"
                       background
                       layout="prev, pager, next"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import AssetsLists from '../AssetsLists';
import InputSearch from '../InputSearch';
import SelectButton from '../SelectButton';
import SelectSearch from '../SelectSearch';
import utils from '~/utils/';
import { mapActions, mapState } from 'vuex';
import directives from '../../directives';
import filters from '../../filters';

export default {
  props: ['search'],
  filters,
  directives,
  watch: {
    'search.val'() {
      this.debounce(() => {
        this.initWithdrawLists({ p: 1, coin: this.search.val });
      });
    },
  },
  components: {
    AssetsLists,
    InputSearch,
    SelectButton,
    SelectSearch,
  },
  data() {
    return {
      total: 0,
      loading: true,
      color: {
        '-2': '#DF543A',
        '-1': '#DF543A',
        '-4': '#DF543A',
        '0': '#354989',
        '1': '#29A76C',
        '2': '#29A76C',
        '3': '#29A76C',
        '4': '#354989',
        '-8': '#DF543A',
      },
      audiColor: {
        '-2': '#DF543A',
        '-1': '#DF543A',
        '0': '#354989',
        '10': '#354989',
      },
      status: {
        '-2': 'Withdrawal failed',
        '-1': 'Withdrawal failed',
        '-4': 'Withdrawal failed',
        '0': 'Pending withdrawal',
        '1': 'Withdrawal is being processed',
        '2': 'Withdrawal is being processed',
        '3': 'Withdrawal is being processed',
        '4': 'Completed',
        '-8': 'Withdrawal is exception',
      },
    };
  },
  methods: {
    async init() {
      const res = await this.initWithdrawLists({ p: 1 });
      this.total = res.data.totalElements;
    },
    debounce(fn) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
      }, 700);
    },
    onDetail(row) {
      this.$refs.table.toggleRowExpansion(row);
    },
    onChangePage(e) {
      this.initWithdrawLists({ p: e });
    },
    async initWithdrawLists({ p, coin = '' }) {
      this.loading = true;
      const res = await this.$store.dispatch('assets/selectW', {
        pageSize: 6,
        pageNum: p,
        asset: coin,
      });
      this.loading = false;
      return res;
    },
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    withdrawLists() {
      return this.assets.withdrawLists.map(d => {
        return {
          ...d,
          // status: this.status[d.status],
        };
      });
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

//充提历史
.charge-history {
  // 下面table样式
  .ft {
    .h {
      margin: 0 8px;
      min-height: 300px;
      @include bgPair(background-color);
    }
    .action {
      text-align: right;
      cursor: pointer;

      .detail-text {
        @include interactionPair(color);
      }
    }
    .b {
      padding: 26px;
    }
  }
}
</style>
