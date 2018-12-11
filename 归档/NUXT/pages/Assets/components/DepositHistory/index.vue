<template>
  <div class="charge-history">
    <div class="ft">
      <div class="h"
           v-loading="loading">
        <el-table ref="table"
                  :empty-text="i18n.App.AccountDetail.emptyData"
                  v-if="!loading"
                  :data="depositLists"
                  style="width: 100%">
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
              <!-- <el-form label-position="left"
                       inline
                       class="assets-table-expand">
                <el-form-item :label="`${i18n.App.AccountDetail.Time}:`">
                  <span>{{props.row.time | dubaiDate('YYYY-MM-DD HH:mm:ss')}}</span>
                </el-form-item>
                <el-form-item :label="`${i18n.App.WithDraw.address}:`">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item :label="`${i18n.App.AccountDetail.Amount}:`">
                  <span>{{ props.row.fee }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.txid"
                              label="TxID:">
                  <span>{{ props.row.txid }}</span>
                  <el-button style="margin-left:5px;"
                             type="text"
                             v-copy="{val:props.row.txid,success:i18n.App.Recharge.copyMes,error:'error'}">{{i18n.App.WithDraw.cpy}} </el-button>
                </el-form-item>
              </el-form> -->
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
              <div :class="`order-status${scope.row.status} break-word`">
                {{i18n.App.Recharge.status[scope.row.status]}}
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
import { mapActions, mapState } from 'vuex';
import directives from '../../directives';
import filters from '../../filters';

export default {
  props: ['search'],
  filters,
  directives,
  components: {
    AssetsLists,
    InputSearch,
    SelectButton,
    SelectSearch,
  },
  watch: {
    'search.val'() {
      this.debounce(() => {
        this.initDepositLists({ p: 1, coin: this.search.val });
      });
    },
  },
  data() {
    return {
      total: 0,
      loading: true,
      color: ['#354989', '#29A76C', '#354989', '#DF543A'],
      status: ['Initializing', 'Deposit in progress', 'Completed', 'Deposit failed'],
    };
  },
  methods: {
    async init() {
      const res = await this.initDepositLists({ p: 1 });
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
      this.initDepositLists({ p: e });
    },
    async initDepositLists({ p, coin = '' }) {
      this.loading = true;
      const res = await this.$store.dispatch('assets/selectD', {
        asset: coin,
        pageSize: 6,
        pageNum: p,
      });
      this.loading = false;
      return res;
    },
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    depositLists() {
      return this.assets.depositLists.map(d => {
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

