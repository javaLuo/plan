<!-- 充值弹窗 -->
<template>
  <el-dialog :title="rechargeTit"
             :visible.sync="display"
             width="540px"
             :before-close="close"
             class="tl-dialog">
    <div class="modal-title">{{rechargeNotes}}</div>
    <div class="modal-code"
         v-loading="loading"
         :style="{minHeight:0}">
      <div class="addr-codes">{{deposit.address}}</div>
      <i class="iconfont icon-shendu"></i>
      <span v-clipboard="deposit.address||''"
            @click="copyQrCode">
        {{Asset.copyKey}}</span>
    </div>
    <qrcode-vue :value="deposit.address"
                :size="180"
                level="H"
                class="modal-canvas" />
    <dl>
      <dd v-for="(item, index) of promptMes"
          :key="index">
        <i></i>
        <span>{{item}}</span>
      </dd>
    </dl>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import * as accountType from '~/store/modules/account/type';
import QrcodeVue from 'qrcode.vue';

export default {
  data() {
    return {
      loading: false,
    };
  },
  props: {
    display: {
      required: true,
      type: Boolean,
      default: false,
    },
    close: {
      required: true,
      type: Function,
    },
    coinType: {
      required: true,
      type: String,
      default: 'BTC',
    },
  },
  components: {
    QrcodeVue,
  },
  created() {},
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
      Asset: state => state.i18n.App.Asset,
      deposit: state => state.account.deposit,
      ErrCode: state => state.i18n.App.ErrCode,
    }),
    rechargeTit: function() {
      return this.Asset.rechargeTit.replace(/%s/, this.coinType);
    },
    rechargeNotes: function() {
      return this.Asset.rechargeNotes.replace(/%s/, this.coinType);
    },
    promptMes: function() {
      let curCoin = this.coinType.toLowerCase();
      switch (curCoin) {
        case 'btc':
          const coinBTC = JSON.stringify(this.Asset.promptMes)
            .replace(/%s/g, 'BTC')
            .replace(/%t/, '4')
            .replace(/%f/, '40')
            .replace(/%u/, '60')
            .replace(/%d/, '0.001');
          return JSON.parse(coinBTC);
          break;
        case 'eth':
          const coinETH = JSON.stringify(this.Asset.promptMes)
            .replace(/%s/g, 'ETH')
            .replace(/%t/, '12')
            .replace(/%f/, '5')
            .replace(/%u/, '15')
            .replace(/%d/, '0.01');
          return JSON.parse(coinETH);
          break;
        case 'usd':
          const coinUSD = JSON.stringify(this.Asset.promptMes)
            .replace(/%s/g, 'USD')
            .replace(/%t/, '4')
            .replace(/%f/, '40')
            .replace(/%u/, '60')
            .replace(/%d/, '100');
          return JSON.parse(coinUSD);
          break;
        case 'etp':
          const coinETP = JSON.stringify(this.Asset.promptMes)
            .replace(/%s/g, 'ETP')
            .replace(/%t/, '30')
            .replace(/%f/, '15')
            .replace(/%u/, '30')
            .replace(/%d/, '0.01');
          return JSON.parse(coinETP);
          break;
        case 'rt':
          const coinRT = JSON.stringify(this.Asset.promptMes)
            .replace(/%s/g, 'RT')
            .replace(/%t/, '30')
            .replace(/%f/, '15')
            .replace(/%u/, '30')
            .replace(/%d/, '0.1');
          return JSON.parse(coinRT);
          break;
        default:
          console.log(curCoin);
      }
    },
  },
  watch: {
    coinType: function() {
      if (this.coinType !== '' && this.display) {
        this.loading = true;
        this.tradeAssetDeposit({ asset: this.coinType }).then(res => {
          if (res && res.code === 200) {
            this.loading = false;
          } else {
            this.$message.error(this.ErrCode[res.code] || `${res.code}`);
          }
        });
      }
    },
  },
  methods: {
    ...mapActions({
      tradeAssetDeposit: accountType.TRADE_ASSET_DEPOSIT_ACTIONS,
    }),
    copyQrCode() {
      this.$message({
        message: this.Asset.sucCopy,
        type: 'success',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-title {
  font-size: 14px;
  color: #354989;
}
.modal-code {
  background: rgba(32, 128, 238, 0.1);
  border: 1px dashed rgba(32, 128, 238, 0.575);
  border-radius: 24px;
  width: 396px;
  height: 38px;
  margin: 0 auto;
  margin-top: 48px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .addr-codes {
    font-size: 12px;
    color: #354989;
    vertical-align: middle;
  }
  span {
    font-size: 12px;
    color: rgba(32, 128, 238, 0.575);
    cursor: pointer;
  }
  i {
    color: rgba(32, 128, 238, 0.576);
    margin-left: 10px;
  }
}
.modal-canvas {
  width: 180px;
  height: 180px;
  margin: 44px auto 54px;
}
dl {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  dd {
    font-size: 14px;
    color: #7d86ac;
    letter-spacing: 0;
    line-height: 20px;
    text-align: left;

    i {
      background: #6d6982;
      width: 5px;
      height: 5px;
      border-radius: 100%;
      margin: 6px 12px 0px 0;
      display: inline-block;
      vertical-align: top;
    }
    span {
      width: 380px;
      height: 20px;
      display: inline-block;
    }
  }
}
</style>
<style lang="scss">
.modal-form {
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>