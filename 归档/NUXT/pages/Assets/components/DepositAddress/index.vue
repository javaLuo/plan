<template>
  <div v-loading="assets.loading"
       class="panel-address df jcsb">
    <div class="input"
         :style="{width:'calc(100% - 132px - 20px)'}">
      <el-input class="t-el-input"
                suffix-icon="iconfont icon-erweima"
                :value="assets.DA || i18n.App.AccountDetail.notOpend"
                :readonly="true"></el-input>

      <div class="qrcode-btn">
        <img v-if="assets.DA"
             class="qrcode"
             :src="qrcode"
             alt="">
      </div>
    </div>
    <div class="button">
      <el-button v-copy="{val:assets.DA,success:i18n.App.Recharge.copyMes,error:'error'}"
                 :disabled="!assets.DA"
                 :style="{width:'132px'}"
                 type="primary">{{i18n.App.WithDraw.cpy}}</el-button>
    </div>
  </div>
</template>

<script>
import SelectSearch from '../SelectSearch';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode';
import { mapActions, mapState } from 'vuex';
import directives from '../../directives';
export default {
  directives,
  watch: {
    async onCoin() {
      if (!!this.assets.onCoin) {
        await this.findDA(this.assets.onCoin);
        await this.initQrCode();
      }
    },
  },
  components: {
    SelectSearch,
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    onCoin() {
      return this.assets.onCoin;
    },
  },
  data() {
    return {
      val: '',
      qrcode: '',
      isShowQrcode: false,
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var dataSource = this.dataSource;
      var results = queryString ? dataSource.filter(this.createFilter(queryString)) : dataSource;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return dataSource => {
        return dataSource.coin.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    findDA(coin) {
      return this.$store.dispatch('assets/findDA', {
        coin,
      });
    },
    onCopy() {
      if (!!this.assets.DA) {
        copy(this.assets.DA);
        this.$message.success('success');
      }
    },
    async init() {
      await this.findDA(this.assets.onCoin);
      await this.initQrCode();
      this.addListen();
    },
    on(elm, type, handler) {
      return elm.attachEvent ? elm.attachEvent('on' + type, handler) : elm.addEventListener(type, handler, false);
    },
    async initQrCode() {
      // With async/await
      const generateQR = async text => {
        let url = '';
        try {
          url = await QRCode.toDataURL(text);
        } catch (err) {
          console.error(err);
        }
        return url;
      };
      const res = await generateQR(this.assets.DA);
      this.qrcode = res;
    },

    addListen() {},
  },
  async mounted() {
    await this.init();
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';
.panel-address {
  position: relative;
  /deep/ .el-loading-mask {
    min-height: 38px;
  }
  .input {
    position: relative;
    .t-el-input /deep/ input {
      height: 38px;
      line-height: 36px;
      @include fontPair(color);
      letter-spacing: 0;
      border-radius: 2px;
    }
    .t-el-input /deep/ .el-input__icon.iconfont {
      font-size: 20px;
      @include subFontPair(color);
    }
    .qrcode {
      display: none;
      width: 150px;
      height: 150px;
      position: absolute;
      right: 0;
      top: -150px - 10px;
      border-radius: 5px;
    }
    .qrcode-btn {
      width: 30px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      &:hover {
        .qrcode {
          display: block;
        }
      }
    }
  }
  .button {
    button {
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      line-height: 14px;
    }
  }
}
</style>