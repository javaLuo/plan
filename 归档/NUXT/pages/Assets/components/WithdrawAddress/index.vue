<template>
  <el-select style="width:100%"
             v-model="on"
             filterable
             :placeholder="i18n.App.WithDraw.selectPlaceHolder"
             @change="onSelectChange($event)">
    <el-option v-for="(item,index) in addressLists"
               :key="index"
               :label="item.remark + `${!!item.remark ?':' :''}` + item.address"
               :value="item.address">
      <div class="df i aic"
           v-if="!item.type">
        <span>
          <i :class="`default-icon token-logo ${item.coin}`"></i>
        </span>
        <span>{{ item.remark }}{{ `${!!item.remark ?':' :''}`}} {{item.address}}</span>
      </div>
      <div @click="onAddress()"
           v-if="item.type == 'address'"
           style="color:#6aa0ff;font-size:14px;display: flex;
    align-items: center;justify-content:center;">
        <i style="margin-right:5px;"
           class="iconfont icon-add"></i>
        <span>{{i18n.App.WithDraw.addAddress}}</span>
      </div>
    </el-option>
  </el-select>
</template>

<style lang="scss" scoped="true">
</style>

<script>
import SelectSearch from '../SelectSearch';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode';
import { mapActions, mapState } from 'vuex';
export default {
  props: ['onChange'],
  watch: {
    async 'assets.onCoin'() {
      await this.onChangeCoin();
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
    addressLists() {
      return this.assets.addressLists.concat([{ type: 'address' }]);
    },
  },
  data() {
    return {
      on: '',
    };
  },
  methods: {
    async init() {
      await this.onChangeCoin();
      this.addListen();
    },
    onSelectChange(e) {
      if (!!e) {
        this.onChange && this.onChange(e);
      } else {
        this.on = '';
      }
    },
    onAddress(e) {
      this.$router.push({ path: 'assets', query: { ...this.assets.query, type: 'address' } });
    },
    async onChangeCoin() {
      this.on = '';
      await this.selectWA(this.assets.onCoin);
    },
    async selectWA(coin) {
      let res = null;
      if (!!coin) {
        res = await this.$store.dispatch('assets/selectWA', {
          asset: coin,
        });
      }
      return res;
    },
    addListen() {
      this.$on('onCoin/change', e => {
        // console.log(e, 888888);
      });
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>