<template>
  <div class="panel-history">
    <!-- 最近提币 没有这个功能 -->
    <!-- <div class="p-recent"
         v-show="false">
      <div class="hd">Recent</div>
      <div class="bd">
        <ActiveHistory />
      </div>
    </div> -->
    <div class="p-history">
      <div class="hd df jcsb">
        <div class="l"><strong>{{i18n.App.WithDraw.assetsHistory}}</strong></div>
        <div class="r df aic">
          <input-search ref="inputSearch"
                        :onChange="onSearchCoin"
                        :dataSource="historyLists" />
        </div>
      </div>
      <div class="bd">
        <el-tabs v-model="activeName"
                 @tab-click="onClick">
          <el-tab-pane :label="i18n.App.WithDraw.depositHistory"
                       name="deposit">
            <DepositHistory v-if="activeName=='deposit'"
                            :search="search" />
          </el-tab-pane>
          <el-tab-pane :label="i18n.App.WithDraw.withdrawHistory"
                       name="withdraw">
            <WithdrawHistory v-if="activeName=='withdraw'"
                             :search="search" />
          </el-tab-pane>
          <el-tab-pane :label="i18n.App.WithDraw.activeHistory"
                       name="activity">
            <ActiveHistory v-if="activeName=='activity'"
                           :search="search" />
          </el-tab-pane>
          <el-tab-pane :label="i18n.App.WithDraw.bakeHistory"
                       name="bake">
            <BakeHistory v-if="activeName=='bake'"
                         :search="search" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>

</template>

<script>
import SelectServiceFee from '../SelectServiceFee';
import WithdrawAddress from '../WithdrawAddress';
import DepositHistory from '../DepositHistory';
import WithdrawHistory from '../WithdrawHistory';
import ActiveHistory from '../ActiveHistory';
import BakeHistory from '../BakeHistory';
import { mapActions, mapState } from 'vuex';
import InputSearch from '../InputSearch';
export default {
  watch: {
    'assets.query'() {
      // console.log(this.assets.query);
      this.onChangeQuery();
    },
    activeName() {
      this.$refs.inputSearch.value = '';
      const { tab } = this.assets.query;
      if (this.activeName !== 'withdraw') {
        this.$router.push({ path: 'assets', query: { ...this.assets.query, tab: '' } });
      }
    },
  },
  components: {
    SelectServiceFee,
    WithdrawAddress,
    DepositHistory,
    WithdrawHistory,
    ActiveHistory,
    InputSearch,
    BakeHistory,
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    historyLists() {
      if (this.activeName === 'deposit') {
        return this.assets.depositLists;
      }
      if (this.activeName === 'withdraw') {
        return this.assets.withdrawLists;
      }
      if (this.activeName === 'activity') {
        return this.assets.activeLists;
      }
      if (this.activeName === 'bake') {
        return this.assets.bakeLists;
      }
    },
  },
  data() {
    return {
      activeName: 'deposit',
      search: {
        val: '',
      },
    };
  },
  methods: {
    onSearchCoin(val) {
      this.search.val = val;
    },
    onClick(tab, event) {
      // console.log(tab, event);
    },
    init() {
      this.onChangeQuery();
      this.addListen();
    },
    onChangeQuery() {
      const { tab } = this.assets.query;
      if (!!tab) {
        this.activeName = tab;
      }
    },
    addListen() {},
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

.panel-history {
  @include bgPair(background-color);
  /deep/ .el-tabs__header {
    padding: 0 26px;
    margin-bottom: 22px;
    font-size: 16px;
  }
  /deep/ .el-tabs__nav-wrap::after {
    display: none;
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
  }

  /deep/ .el-table__body td {
    padding: 14px 0;
  }

  .p-recent {
    .hd {
      font-size: 18px;
      @include fontPair(color);
    }
  }
  .p-history {
    .hd {
      font-size: 18px;
      @include fontPair(color);
      height: 70px;
      line-height: 70px;
      padding: 0 26px;
    }
  }
}
</style>