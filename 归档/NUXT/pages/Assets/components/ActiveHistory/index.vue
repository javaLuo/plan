<template>
  <div class="panel-active">
    <div class="bd"></div>
    <div class="ft">
      <div class="h"
           v-loading="loading">
        <el-table :empty-text="i18n.App.AccountDetail.emptyData"
                  ref="table"
                  v-if="!loading"
                  :data="activeLists"
                  style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="assets-table-expand">
                <el-form-item :label="i18n.App.AccountDetail.Time">
                  <span>{{ props.row.time * 1000 | dubaiDateStp('YYYY-MM-DD HH:mm:ss')}}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.WithDraw.coin">
                  <span>{{ props.row.coin }}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.AccountDetail.remark">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
                <el-form-item :label="i18n.App.AccountDetail.Amount">
                  <span>{{ props.row.fee }}</span>
                </el-form-item>
              </el-form>
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
              <span>{{ scope.row.time * 1000 | dubaiDateStp('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="i18n.App.AccountDetail.remark">
            <template slot-scope="scope">
              <div>
                {{$store.state.locale === 'zh_cn' ? scope.row.description:''}} {{$store.state.locale === 'en_us' ? scope.row.name:''}} {{$store.state.locale === 'ja_jp' ? scope.row.name:''}} {{$store.state.locale === 'ru_ru' ? scope.row.name:''}}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Amount"
                           prop="fee">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Status">
            <template slot-scope="scope">
              <div class="break-word">
                {{i18n.App.AccountDetail.finished}}{{scope.row.status}}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="i18n.App.AccountDetail.Option"
                           width="230"
                           header-align='right'>
            <template slot-scope="scope">
              <div class="action df jcfe aic">
                <el-button @click="onDetail(scope.row,scope)">{{i18n.App.WithDraw.detail}}</el-button>
                <i class="el-icon-arrow-down"></i>
              </div>
            </template>
          </el-table-column> -->
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
import filters from '../../filters';

export default {
  props: ['search'],
  filters,
  components: {
    AssetsLists,
    InputSearch,
    SelectButton,
    SelectSearch,
  },
  watch: {
    'search.val'() {
      this.debounce(() => {
        this.initActiveLists({ p: 1, coin: this.search.val });
      });
    },
  },
  data() {
    return {
      total: 0,
      loading: true,
      status: ['Initializing', 'Deposit in progress', 'Completed', 'Deposit failed'],
    };
  },
  methods: {
    async init() {
      const res = await this.initActiveLists({ p: 1 });
      console.log(res, 'dafed');
      this.total = res.data.total;
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
      this.initActiveLists({ p: e });
    },
    async initActiveLists({ p, coin = '' }) {
      this.loading = true;
      const res = await this.$store.dispatch('assets/selectA', {
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
    activeLists() {
      return this.assets.activeLists.map(d => {
        return {
          ...d,
          // status: 'Completed',
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
.panel-active {
  width: 960px;
  .hd {
    .lt {
      .l {
        font-size: 18px;
        @include fontPair(color);
      }
      .r {
        @include subFontPair(color);
      }
    }
    .rt {
      @include fontPair(color);
      line-height: 14px;
    }
  }
  .bd {
  }
  .ft {
    .h {
      min-height: 300px;
      @include bgPair(background-color);
    }
    .action {
      cursor: pointer;
      .deposit {
        &.dis {
          color: #c0c4cc;
          cursor: not-allowed;
        }
        color: #29a76c;
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
      }
      .withdraw {
        &.dis {
          color: #c0c4cc;
          cursor: not-allowed;
        }
        color: #df543a;
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
      }
      .exchange {
        @include interactionPair(color);
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
      }
    }
    .b {
      padding: 26px;
    }
  }
}
</style>
