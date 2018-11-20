<template>
  <div class="coin-list"
       v-loading="loading">
    <section class="coin-wapper"
             v-for="(item,index) in list"
             :key="index">
      <!-- 一个 -->
      <div class="coin-type">
        <i class="coin-icon btc-icon"
           v-if="index === 'BTC'"></i>
        <i class="coin-icon eth-icon"
           v-else-if="index === 'ETH'"></i>
        <i class="coin-icon usd-icon"
           v-else-if="index === 'USD'"></i>
        <i class="coin-icon etp-icon"
           v-else-if="index === 'ETP'"></i>
        <i class="coin-icon rt-icon"
           v-else-if="index === 'RT'"></i>
        <p>{{index}}</p>
      </div>
      <!-- 两个 -->
      <div class="legal-tender">
        <p class="legal-ttl">{{Asset.account[0]}}</p>
        <dl>
          <dt>
            <p>{{Asset.usable}}:</p>
            <p>{{Asset.frozen}}:</p>
          </dt>
          <dd>
            <p>{{item[1]['balance']}} {{index}}</p>
            <p>{{item[1]['frozen']}} {{index}}</p>
          </dd>
        </dl>
      </div>
      <!-- 三个 -->
      <div class="legal-tender coins-coins">
        <p class="legal-ttl">{{Asset.account[1]}}</p>
        <dl>
          <dt>
            <p>{{Asset.usable}}:</p>
            <p>{{Asset.frozen}}:</p>
          </dt>
          <dd>
            <p>{{item[0]['balance']}} {{index}}</p>
            <p>{{item[0]['frozen']}} {{index}}</p>
          </dd>
        </dl>
      </div>
      <!-- 四个 -->
      <div class="coin-operate">
        <!-- 充值 -->
        <el-button class="confirm-btn"
                   type="primary"
                   @click="rechargeHandle(index)">{{Asset.recharge}}</el-button>
        <!-- 划转 -->
        <el-button class="cancel-btn"
                   @click="transferHandle(index,item[1]['balance'],item[0]['balance'])">{{Asset.transfer}}</el-button>
      </div>
    </section>
    <!-- 充值弹框 -->
    <RechargeModal :coinType="coinType"
                   :display="modalDisplayRearch"
                   :close="toDisabledRearch" />
    <!-- 划转弹框 -->
    <TransferModal :coinType="coinType"
                   :display="modalDisplayTransfer"
                   :close="toDisabledTransfer" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import * as accountType from '~/store/modules/account/type';
import RechargeModal from '~/components/Modal/RechargeModal.vue';
import TransferModal from '~/components/Modal/TransferModal.vue';

export default {
  props: ['list', 'loading'],
  data() {
    return {
      modalDisplayRearch: false, // 充值弹框是否显示
      modalDisplayTransfer: false, // 划转弹框是否显示
      coinType: '',
    };
  },
  components: {
    RechargeModal,
    TransferModal,
  },
  computed: {
    ...mapState({
      Asset: state => state.i18n.App.Asset,
      Settings: state => state.i18n.App.Settings,
    }),
  },
  methods: {
    ...mapActions({}),
    toDisabledRearch() {
      this.modalDisplayRearch = false;
    },
    toDisabledTransfer() {
      this.modalDisplayTransfer = false;
    },
    rechargeHandle(type) {
      this.coinType = type;
      this.modalDisplayRearch = true;
    },
    transferHandle(type) {
      this.coinType = type;
      this.modalDisplayTransfer = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.coin-list {
  min-height: 676px;
  padding: 0 28px;
  background-color: #ffffff;
}
.coin-wapper {
  border-bottom: 1px solid #f6f6f9;
  background: #fff;
  margin: 0 auto;
  height: 162px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #354989;

  .coin-type {
    width: 136px;
    padding-left: 24px;
    text-align: left;
    .coin-icon {
      display: block;
      width: 24px;
      height: 24px;
    }
    .btc-icon {
      background: url('~/assets/images/coin/btc.png') center / cover;
    }
    .eth-icon {
      background: url('~/assets/images/coin/eth.png') center / cover;
    }
    .etp-icon {
      background: url('~/assets/images/coin/etp.png') center / cover;
    }
    .usd-icon {
      background: url('~/assets/images/coin/usd.png') center / cover;
    }
    .rt-icon {
      background: url('~/assets/images/coin/rt.svg') center / cover;
    }
    p {
      font-weight: 600;
      font-size: 16px !important;
      margin-top: 12px !important;
    }
  }
  .legal-tender {
    width: 340px;
    // margin-left: 95px;

    .legal-ttl {
      margin-bottom: 20px;
    }

    dl {
      display: flex;
      justify-content: flex-start;
      font-size: 12px;
      line-height: 1;
      dt {
        color: #a8afcd;
        margin-right: 10px;
        > p {
          margin-bottom: 8px;
        }
      }
      dd {
        > p {
          margin-bottom: 8px;
        }
      }
    }
  }
  .coins-coins {
    flex: 1;
  }
  .coin-operate {
    flex: none;

    .confirm-btn {
      display: block;
    }
    .cancel-btn {
      margin-top: 27px;
      margin-left: 0;
      border: solid 1px transparent !important;
      color: #6aa0ff;
    }
  }
}
.el-button {
  padding: 0;
}
</style>
