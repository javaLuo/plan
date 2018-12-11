<template>
  <el-select style="width:340px"
             v-model="on"
             filterable
             :placeholder="i18n.App.AccountDetail.selectPlaceHolder">
    <i style="margin-top: 4px;"
       slot="prefix"
       :class="`default-icon token-logo ${on}`"></i>
    <el-option v-for="item in serviceFeeLists"
               :key="item.value"
               :label="item.label"
               :value="item.value">
      <div class="df i aic">
        <i :class="`default-icon token-logo ${item.label} withdraw-select-i`"></i>
        <span>{{ item.label }}</span>
        <font>/ {{ item.label }}</font>
      </div>
    </el-option>
  </el-select>
</template>


<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: ['type'],
  watch: {
    async on() {
      await this.$store.dispatch('assets/setState', {
        onCoin: this.on,
      });
      this.$router.push({ path: 'assets', query: { ...this.assets.query, coin: this.on } });
    },
  },
  data() {
    return {
      on: '',
    };
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    onCoin() {
      return this.assets.onCoin;
    },
    serviceFeeLists() {
      return this.assets.serviceFeeLists
        .concat()
        .filter(d => {
          if (this.type === 'deposit') {
            // v-show="type === 'deposit'?item.canDeposit:item.canWithdraw"
            return d.canDeposit;
          }
          if (this.type === 'withdraw') {
            // v-show="type === 'deposit'?item.canDeposit:item.canWithdraw"
            return d.canWithdraw;
          }
          return d;
        })
        .map(item => {
          return {
            value: item.coin,
            label: item.coin,
            item,
          };
        });
    },
  },
  methods: {
    ...mapActions(['assets/selectServiceFee']),
    async init() {
      await this.$store.dispatch('assets/selectServiceFee');
      this.initOn();
    },
    initOn() {
      if (!!this.onCoin) {
        this.on = this.onCoin;
      }
    },
  },
  async mounted() {
    await this.init();
  },
};
</script>
