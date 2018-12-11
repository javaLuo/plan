<template>
  <div class="panel-assetslists">
    <div class="hd df jcsb">
      <div class="lt df">
        <div class="l df">{{i18n.App.WithDraw.totalAssets}}：
          <span :title="assets.eqBtc"
                class="total-assets-number">{{assets.eqBtc}}</span> BTC</div>
      </div>
      <div class="rt df aic">
        <div class="l">
          <input-search :onChange="onSearchCoin"
                        :dataSource="assetsLists" />
        </div>
        <div class="r">
          <el-checkbox @change="onHide($event)"
                       v-model="isHideSmall">{{i18n.App.WithDraw.hideSmall}}</el-checkbox>
        </div>
      </div>
    </div>
    <div class="bd"></div>
    <div class="ft"
         v-loading="loading">
      <div class="assets-inner">
        <el-table :empty-text="i18n.App.AccountDetail.emptyData"
                  v-if="!!assetsLists && assetsLists.length"
                  :data="assetsLists"
                  style="width: 100%;">
          <el-table-column :label="i18n.App.WithDraw.coin">
            <template slot-scope="scope">
              <i :class="`token-logo default-icon ${scope.row.coin}`"></i>
              <strong>{{scope.row.coin}}</strong>
            </template>
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Amount"
                           prop="total">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Tradable"
                           prop="ava">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Frozen"
                           prop="frozen">
          </el-table-column>
          <el-table-column :label="i18n.App.AccountDetail.Option"
                           header-align='right'
                           width="230px">
            <template slot-scope="scope">
              <div class="action df jcfe aic">
                <!-- 充币 -->
                <span :class="`deposit ${scope.row.canDeposit ? '':'dis'}`"
                      @click="onD(scope.row)">{{i18n.App.AccountDetail.Deposit}}</span>
                <!-- 提币 -->
                <span style="margin:0 14px"
                      :class="`withdraw ${scope.row.canWithdraw ? '':'dis'}`"
                      @click="onW(scope.row)">{{i18n.App.AccountDetail.Withdraw}}</span>
                <!-- 交易 最后一栏的下拉框 -->
                <span style="color:#c0c4cc;cursor:not-allowed"
                      v-if="menuShoudDisabled(scope.row.coin)">{{i18n.App.AccountDetail.Trading}}</span>
                <el-dropdown style="height: 15px;line-height: 15px;"
                             trigger="click"
                             v-else>
                  <span class="el-dropdown-link exchange">
                    {{i18n.App.AccountDetail.Trading}}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="scope.row.coin !== 'USD' && !(!assets.hashGroupListsS[`${scope.row.coin}USD`] && !assets.hashGroupLists[`${scope.row.coin}USD`])"
                                      class="clearfix">

                      <el-button :disabled="!assets.hashGroupListsS[`${scope.row.coin}USD`] && !assets.hashGroupLists[`${scope.row.coin}USD`]"
                                 type="text"
                                 @click="onExchange({mu:'USD',zi:scope.row.coin})">{{scope.row.coin}}/USD</el-button>

                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.coin !== 'BTC' && !(!assets.hashGroupListsS[`${scope.row.coin}BTC`] && !assets.hashGroupLists[`${scope.row.coin}BTC`])"
                                      class="clearfix">

                      <el-button :disabled="!assets.hashGroupListsS[`${scope.row.coin}BTC`] && !assets.hashGroupLists[`${scope.row.coin}BTC`]"
                                 type="text"
                                 @click="onExchange({mu:'BTC',zi:scope.row.coin})">{{scope.row.coin}}/BTC</el-button>

                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.coin !== 'ETH' && !(!assets.hashGroupListsS[`${scope.row.coin}ETH`] && !assets.hashGroupLists[`${scope.row.coin}ETH`])"
                                      class="clearfix">
                      <el-button :disabled="!assets.hashGroupListsS[`${scope.row.coin}ETH`] && !assets.hashGroupLists[`${scope.row.coin}ETH`]"
                                 type="text"
                                 @click="onExchange({mu:'ETH',zi:scope.row.coin})">{{scope.row.coin}}/ETH</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.coin !== 'ETP' && !(!assets.hashGroupListsS[`${scope.row.coin}ETP`] && !assets.hashGroupLists[`${scope.row.coin}ETP`])"
                                      class="clearfix">
                      <el-button :disabled="!assets.hashGroupListsS[`${scope.row.coin}ETP`] && !assets.hashGroupLists[`${scope.row.coin}ETP`]"
                                 type="text"
                                 @click="onExchange({mu:'ETP',zi:scope.row.coin})">{{scope.row.coin}}/ETP</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
import Storage from '~/utils/storage';
// import sliverCookie from '~/pages/SliverExchange/cookie';
export default {
  components: {
    AssetsLists,
    InputSearch,
    SelectButton,
    SelectSearch,
  },
  data() {
    return {
      isHideSmall: false,
      search: {
        val: '',
      },
      loading: false,
    };
  },
  methods: {
    onHide(e) {
      Storage.set('isHideSmall', this.isHideSmall);
    },
    // 是否应该被隐藏，如果一个都没有就需要
    menuShoudDisabled(coin) {
      if (this.assets.hashGroupListsS[`${coin}BTC`] || this.assets.hashGroupLists[`${coin}BTC`]) {
        return false;
      }
      if (this.assets.hashGroupListsS[`${coin}USD`] || this.assets.hashGroupLists[`${coin}USD`]) {
        return false;
      }
      if (this.assets.hashGroupListsS[`${coin}ETH`] || this.assets.hashGroupLists[`${coin}ETH`]) {
        return false;
      }
      if (this.assets.hashGroupListsS[`${coin}ETP`] || this.assets.hashGroupLists[`${coin}ETP`]) {
        return false;
      }
      return true;
    },
    onSearchCoin(val) {
      this.search.val = val;
    },
    async init() {
      this.isHideSmall = !!(Storage.get('isHideSmall') === 'true');
      this.loading = true;
      // put it in store
      await this.$store.dispatch('assets/selectAvaCoin');
      this.loading = false;
    },
    onFilter() {
      return false;
    },
    onD(item) {
      if (!item.canDeposit) {
        return;
      }
      this.$router.push({ path: 'assets', query: { coin: item.coin, type: 'deposit' } });
    },
    onW(item) {
      if (!item.canWithdraw) {
        return;
      }
      this.$router.push({ path: 'assets', query: { coin: item.coin, type: 'withdraw' } });
    },
    onExchange(symbol) {
      this.$router.push(`/trade/${symbol.zi}_${symbol.mu}`);
    },
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    assetsLists() {
      return (
        this.assets.assetsLists
          // 筛选没有上的币
          // .filter(item => {
          //   return this.menuShoudDisabled(item.coin);
          // })
          .filter(item => {
            // 筛选搜索框的值
            if (!this.search.val) {
              return true;
            }
            return item.coin.indexOf(this.search.val) !== -1;
          })
          .filter(item => {
            // 筛选值为0的资产
            if (!this.isHideSmall) {
              return true;
            }
            return Number(item.total) !== 0;
          })
          .sort((pre, next) => {
            const a = pre.coin[0];
            const b = next.coin[0];
            if (/^\d/.test(a) ^ /^\D/.test(b)) return a > b ? 1 : a == b ? 0 : -1;
            return a > b ? -1 : a == b ? 0 : 1;
          })
      );
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

.panel-assetslists {
  width: 960px;
  border-radius: 2px;
  .hd {
    height: 70px;
    line-height: 70px;
    padding: 0 26px;
    @include bgPair(background-color);
    .lt {
      .l {
        font-size: 18px;
        @include fontPair(color);

        .total-assets-number {
          max-width: 323px;
          overflow: hidden;
          margin-right: 10px;
          text-overflow: ellipsis;
        }
      }
      .r {
        color: #7d86ac;
        margin-left: 8px;
        margin-top: 2px;
      }
    }
    .rt {
      @include fontPair(color);
      line-height: 14px;
      .l {
        margin-right: 34px;
      }
    }
  }
  .bd {
  }
  .ft {
    @include bgPair(background-color);
    .assets-inner {
      margin: 0 8px;
    }
    .action {
      cursor: pointer;
      .deposit {
        &.dis {
          color: #c0c4cc;
          cursor: not-allowed;
        }
        font-family: inherit;
        font-size: 14px;
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
        font-family: inherit;
        font-size: 14px;
        color: #df543a;
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
      }
      .exchange {
        font-family: inherit;
        font-size: 14px;
        @include interactionPair(color);
        letter-spacing: 0;
        text-align: right;
        line-height: 14px;
      }
    }
  }
}
</style>
