<template>
  <div class="copy-address">

    <div class="input"
         v-loading="loading">
      <span v-if="address">{{address}}</span>
      <span v-if="(!address || address === '') && !!active && active.asset">{{Recharge.message}}</span>
      <i class="iconfont icon-erweima"></i>
      <div class="qr-code"
           v-if="address">
        <qrcode-vue :value="address"
                    :size="120"
                    level="H"
                    class="QRcode" />
        <!-- <canvas id="canvas" /> -->
      </div>
    </div>
    <el-button type="primary"
               class="button"
               :disabled="!address"
               @click="handleCopy">{{Recharge.copyAddress}}</el-button>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard';
import { mapState } from 'vuex';
import QrcodeVue from 'qrcode.vue';
import { SET_STATE } from '~/store/modules/asset/type.js';
export default {
  name: 'CopyAddress',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    active: [Object],
  },
  components: {
    QrcodeVue,
  },
  computed: {
    ...mapState({
      Recharge: state => state.i18n.App.Recharge,
      address: state => state.asset.address,
    }),
  },
  methods: {
    reset() {
      this.$store.commit(SET_STATE, { key: 'address', val: '' });
    },
    handleCopy() {
      if (!this.address) return;
      copy(this.address);
      this.$message.success(this.Recharge.copyMes);
    },
  },
};
</script>

<style  lang="scss">
.copy-address {
  display: flex;
  .input {
    position: relative;
    background: #ffffff;
    border: 1px solid #e9ecf4;
    border-radius: 2px;
    width: 672px;
    height: 38px;
    display: flex;
    justify-content: space-between;
    line-height: 38px;
    padding: 0 10px 0 17px;
    .el-loading-mask {
      min-height: 1px;
    }
    .icon-erweima {
      color: #7d86ac;
      font-size: 20px;
      &:hover ~ .qr-code {
        display: block;
      }
    }
    span {
      font-size: 14px;
      color: #354989;
    }
    .qr-code {
      background: #ffffff;
      width: 142px;
      height: 146px;
      position: absolute;
      right: 0px;
      top: -155px;
      background: #ffffff;
      border: 1px solid #354989;
      border-radius: 4px;
      padding: 10px;
      display: none;
      &:before {
        content: '';
        position: absolute;
        top: 100%;
        right: 15px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-top: 7px solid #354989;
        border-right: 8px solid transparent;
      }
      &:after {
        content: '';
        position: absolute;
        top: 100%;
        right: 16px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-top: 6px solid #fff;
        border-right: 7px solid transparent;
      }

      .QRcode {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    }
  }
  .button {
    margin-left: 20px;
    width: 132px;
    height: 38px;
    background: #6aa0ff;
    border-radius: 2px;
    line-height: 38px;
    padding: 0;
    &.is-disabled {
      background: #a0cfff;
    }
  }
}
</style>
