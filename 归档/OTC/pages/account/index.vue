<!-- 我的资产页 -->
<template>
  <section class="account">
    <!-- 上半部分 -->
    <div class="my-account">
      <article class="full">
        <dl>{{Asset.title}}</dl>
        <dl>
          <span>{{Asset.totalAsset}}：</span>
          <label v-if="locale === 'zh_cn'">{{tradeAssetInfo.totalBTC}} BTC ≈{{tradeAssetInfo.totalCNY}} CNY</label>
          <label v-else>{{tradeAssetInfo.totalBTC}} BTC ≈{{tradeAssetInfo.totalUSD}} USD</label>
          <span>{{Asset.deposit}}：</span>
          <label>{{tradeAssetInfo.bail}} RT</label>
        </dl>
      </article>
      <!-- 资产总览 -->
      <AccountCoinItem :list="tradeAssetInfo.accountNewList"
                       :loading="assetLoading" />
    </div>
    <!-- 下半部分 -->
    <div class="account-info">
      <article>
        <dl>{{Asset.detail}}</dl>
        <dl>
          <div class="search-input"
               ref="accountSearch"
               :style="searchInputStyle">
            <div class="searhText"
                 @click="showSearch = !showSearch">
              <span class="is-show-placeholder"
                    v-if="search.type === '' && search.coin === '' && searchDate === ''">{{Common.searchTxt[0]}}</span>
              <span v-if="search.type !== ''">{{searchType}}</span>
              <span v-if="search.coin !== ''">{{search.coin}}</span>
              <span v-if="searchDate !== '' && searchDate !== false">{{searchDate}}</span>
            </div>
            <i class="iconfont icon-shaixuan"
               @click="showSearch = !showSearch" />
            <div class="searh-container"
                 v-show="showSearch">
              <div class="up">
              </div>
              <div class="row">
                <label>{{Common.trade}}</label>
                <div class="input">
                  <el-select :placeholder="Common.total"
                             v-model="form.type">
                    <el-option :label="Common.total"
                               value=""></el-option>
                    <el-option :label="Common.assetItem[3]"
                               value="1"></el-option>
                    <el-option :label="Common.assetItem[2]"
                               value="2"></el-option>
                    <el-option :label="Common.assetItem[0]"
                               value="3"></el-option>
                    <el-option :label="Common.assetItem[1]"
                               value="4"></el-option>
                    <el-option :label="Common.assetItem[5]"
                               value="5"></el-option>
                    <el-option :label="Common.assetItem[6]"
                               value="6"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="row">
                <label>{{Common.icons}}</label>
                <div class="input">
                  <el-select :placeholder="Common.total"
                             v-model="form.coin">
                    <el-option :label="Common.total"
                               value=""></el-option>
                    <el-option label="BTC"
                               value="BTC"></el-option>
                    <el-option label="ETH"
                               value="ETH"></el-option>
                    <el-option label="ETP"
                               value="ETP"></el-option>
                    <el-option label="RT"
                               value="RT"></el-option>
                    <el-option label="USD"
                               value="USD"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="row">
                <label for="">{{Common.dateRange}}</label>
                <div class="input">
                  <el-date-picker v-model="form.date"
                                  :style="{width: '230px'}"
                                  type="daterange"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :start-placeholder="Common.startDate"
                                  :end-placeholder="Common.endDate">
                  </el-date-picker>
                </div>
              </div>
              <div class="button">
                <a class="reset"
                   @click="resetSearch">{{Common.clearFilter}}</a>
                <a class="cancel-button"
                   @click="showSearch = false">{{Common.cancel}}</a>
                <a class="search-button"
                   @click="searchHandle">{{Common.search}}</a>
              </div>
            </div>
          </div>
        </dl>
      </article>
      <div class="account-list">
        <div class="account-list-th">
          <dl>{{Asset.type}}</dl>
          <dl>{{Asset.amonnt}}</dl>
          <dl>{{Asset.time}}</dl>
          <dl>{{Asset.amount}}</dl>
        </div>
        <!-- 资产明细列表 -->
        <AccountListItem :list="tradeAssetList.list"
                         :loading="assetListLoading" />
        <div class="no-record"
             v-if="tradeAssetList.total <= 10">{{Asset.noData}}</div>
        <div class="page"
             v-else>
          <el-pagination @current-change="changePage"
                         :page-size="10"
                         background
                         layout="prev, pager, next"
                         :total="!!tradeAssetList && !!tradeAssetList.total ? tradeAssetList.total : 0">
          </el-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UtilsR from '~/utils/ramda';
import * as Dict from '~/store/dict';
import * as accountType from '~/store/modules/account/type';
import AccountCoinItem from '~/components/Account/AccountCoinItem.vue';
import AccountListItem from '~/components/Account/AccountListItem.vue';
export default {
  components: {
    AccountCoinItem,
    AccountListItem,
  },
  data() {
    return {
      currPage: 1,
      form: {
        type: '',
        coin: '',
        date: [],
      },
      search: {
        type: '',
        coin: '',
        date: [],
      },
      showSearch: false,
      assetLoading: true,
      assetListLoading: true,
    };
  },
  mounted() {
    document.addEventListener('click', this.accSearchEvent);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.accSearchEvent);
  },
  async created() {
    this.assetLoading = true;
    const res = await this.getTradeAssetsInfo();

    if (!res || (res.code && res.code !== 200)) {
      this.$message.error(this.ErrCode[res.code] || res.errmsg);
    }
    this.assetLoading = false;
    this.assetListLoading = true;
    await this.getTradeAssetsList({
      pageSize: 10,
      startPage: this.currPage,
    });
    this.assetListLoading = false;
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Asset: state => state.i18n.App.Asset,
      Common: state => state.i18n.App.Common,
      ErrCode: state => state.i18n.App.ErrCode,
      tradeAssetInfo: state => state.account.tradeAssetAll,
      tradeAssetList: state => state.account.tradeAssetList,
    }),
    searchType() {
      if (this.search.type !== '') {
        const type = parseInt(this.search.type) || 0;
        if (type === Dict.TRADE_TRAN_IN) {
          return this.Common.assetItem[3];
        } else if (type === Dict.TRADE_TRAN_OUT) {
          return this.Common.assetItem[2];
        } else if (type === Dict.TRADE_BUY_IN) {
          return this.Common.assetItem[0];
        } else if (type === Dict.TRADE_SODL_OUT) {
          return this.Common.assetItem[1];
        } else if (type === Dict.TRADE_FREEZE) {
          return this.Common.assetItem[5];
        } else if (type === Dict.TRADE_THAW) {
          return this.Common.assetItem[6];
        }
        return '';
      }
    },
    searchDate() {
      if (Array.isArray(this.search.date)) {
        return this.search.date.join('~');
      }
      return '';
    },
    searchInputStyle() {
      if (Array.isArray(this.search.date)) {
        return { width: '310px' };
      }
      return {};
    },
  },
  methods: {
    ...mapActions({
      getTradeAssetsList: accountType.GET_TRADE_ASSET_LIST_ACTIONS,
      getTradeAssetsInfo: accountType.GET_TRADE_ASSET_ALL_ACTIONS,
    }),
    accSearchEvent(e) {
      if (!this.$refs['accountSearch'].contains(e.target)) {
        this.showSearch = false;
      }
    },
    resetSearch() {
      this.search = {
        type: '',
        coin: '',
        date: [],
      };
      this.form = {
        type: '',
        coin: '',
        date: [],
      };
    },
    searchHandle() {
      this.search = { ...this.form };
      this.showSearch = false;
      let searchParams = {
        pageSize: 10,
        startPage: this.currPage,
      };
      this.search.coin !== '' ? (searchParams['asset'] = this.search.coin) : '';
      this.search.type !== '' ? (searchParams['direction'] = this.search.type) : '';
      !!this.search.date && this.search.date.length > 0 ? (searchParams['start'] = this.$moment(this.search.date[0]).format('X')) : '';
      !!this.search.date && this.search.date.length > 0 ? (searchParams['end'] = this.$moment(this.search.date[1] + ' 23:59:59').format('X')) : '';

      this.getTradeAssetsList(searchParams);
    },
    changePage(e) {
      this.currPage = e;
      this.searchHandle();
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  padding-top: 58px;
  article {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 1128px;
    height: 88px;
    margin: 0 auto;
    box-sizing: border-box;
    &.full {
      width: 1180px;
    }
    dl {
      // text-overflow:ellipsis;
      // overflow:hidden;
      // white-space:nowrap;

      &:first-of-type {
        font-size: 22px;
        color: #354989;
        font-weight: 600;
        flex: auto;
      }
      &:last-of-type {
        flex: none;
        text-align: right;
      }
      span {
        font-size: 12px;
        color: #a8afcd;
        &:last-of-type {
          margin-left: 64px;
        }
      }
      label {
        font-size: 14px;
        color: #354989;
        &:last-of-type {
          margin-left: 18px;
        }
      }
      .search-input {
        padding: 0px;
        display: inline-block;
        position: relative;
        right: 0px;
        .searhText {
          span {
            color: #fff;
            &:last-of-type {
              margin-left: 5px;
            }
          }
        }
        span {
          margin: 0px 3px;
        }
        label {
          margin-left: 5px;
        }
        .search-placeholder {
          width: 100%;
          height: 28px;
          line-height: 28px;
          text-align: left;
          margin: -2px 0px;
          padding-left: 10px;
          background: #e6e6e6;
          color: #797780;
        }
      }
    }
  }

  .my-account {
    border-radius: 2px;
    width: 1180px;
    margin: 0 auto;
    // margin-top: 30px;

    .coin-wapper {
      &:last-of-type {
        border-bottom: 0px !important;
      }
    }
  }
  .account-info {
    background: #ffffff;
    border-radius: 2px;
    width: 1180px;
    // height:370px;
    padding: 0 5px;
    margin: 28px auto 120px;
    .account-list-th {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 45px;
      margin: 0 auto;
      dl {
        font-size: 14px;
        color: #a8afcd;
        line-height: 16px;
        flex: 0 0 300px;
        &:first-of-type {
          margin-left: 36px;
        }
        &:last-of-type {
          flex: 0 0 222px;
          text-align: right;
        }
      }
    }
    .search-icon {
      vertical-align: middle;
      line-height: 30px;
    }
    .no-record {
      width: 1180px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      margin: 0 auto;
      font-size: 12px;
      color: #a8afcd;
    }
    .page {
      margin-top: 30px;
      padding-right: 28px;
      padding-bottom: 20px;
    }
  }
}
</style>
