<template>
  <div class="panel-assets df jcc container">
    <div class="l">
      <Nav />
    </div>
    <div class="r">
      <Deposit v-if="deposit.show" />
      <Withdraw v-if="withdraw.show" />
      <AssetsLists v-if="myassets.show" />
      <Address v-if="address.show" />
      <History v-if="history.show" />
    </div>
  </div>
</template>
<script>
import AssetsLists from './components/AssetsLists';
import InputSearch from './components/InputSearch';
import SelectButton from './components/SelectButton';
import SelectSearch from './components/SelectSearch';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import { mapActions, mapState } from 'vuex';
import Scrollbar from 'smooth-scrollbar';
import Address from './components/Address';
import History from './components/History';
import Nav from './components/Nav';
export default {
  watchQuery: ['coin', 'type', 'tab'],
  asyncData(ctx) {
    const { coin, type } = ctx.query;
    if (!ctx.store.state.isLogin) {
      ctx.redirect('/u/login');
      return;
    }
    ctx.store.dispatch('assets/setState', {
      query: ctx.query,
    });

    const show = {
      deposit: {
        show: type === 'deposit',
      },
      withdraw: {
        show: type === 'withdraw',
      },
      myassets: {
        show: !type,
      },
      address: {
        show: type === 'address',
      },
      history: {
        show: type === 'history',
      },
    };

    if (!!coin) {
      const upperCoin = coin.toUpperCase();
      ctx.store.dispatch('assets/setState', {
        onCoin: upperCoin,
      });
    }
    return { query: ctx.query, ...show };
  },
  data() {
    return {
      deposit: {
        show: false,
      },
      withdraw: {
        show: false,
      },
      myassets: {
        show: false,
      },
      address: {
        show: false,
      },
      history: {
        show: false,
      },
    };
  },
  watch: {
    async query() {
      const { coin, type } = this.query;

      await this.$store.dispatch('assets/setState', {
        query: this.query,
      });

      this.deposit.show = type === 'deposit';
      this.withdraw.show = type === 'withdraw';
      this.address.show = type === 'address';
      this.history.show = type === 'history';
      this.myassets.show = !type;

      if (!!coin) {
        const upperCoin = coin.toUpperCase();
        this.$store.dispatch('assets/setState', {
          onCoin: upperCoin,
        });
      }
    },
  },
  computed: {
    ...mapState(['assets']),
  },
  components: {
    AssetsLists,
    InputSearch,
    SelectButton,
    SelectSearch,
    Deposit,
    Withdraw,
    Address,
    History,
    Nav,
  },
  methods: {
    init() {
      Scrollbar.initAll();
      this.initQuery();
    },
    initQuery() {
      if (!!this.query) {
        this.query = Object.assign({}, this.query);
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>


<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0.7;
}
.panel-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .loading {
    padding: 8px 20px;
    background: white;
    border-radius: 3px;
    margin-top: 11px;
    display: flex;
    border: 1px solid #ebeef5;
    justify-content: space-between;
    span {
      padding-left: 5px;
    }
  }
}
.panel-assets {
  min-height: 600px;
  padding-top: 20px;
  padding-bottom: 70px;
  .l {
    min-width: 220px;
    margin-right: 20px;
  }
  .r {
    width: 960px;
  }

  /deep/ .el-table th > .cell {
    font-size: 12px;
  }
}
</style>