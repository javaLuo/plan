<template>
  <div class="peity">
    <!-- <nuxt-link></nuxt-link> -->
    <div class="line"
         @click="onExchange({mu:item.askAsset,zi:item.bidAsset})"
         v-for="(item, index) in list"
         :key="index">
      <div class="row">
        <span class="font1">{{item.bidAsset}}/{{item.askAsset}}</span>
        <span class="font2"
              :class="{'fall': item.rate >= 0, 'rise': item.rate < 0}">{{item.rate}}%</span>
      </div>
      <div class="row">
        <span class="font3"
              v-formatPrice="{val:item.last,point:item.point}">{{item.last}}</span>
        <!-- <span class="font2">{{item.last}}</span> -->
      </div>
      <div class="row"
           style="line-height: 18px;z-index:11">
        <span class="font2"
              style="font-weight:400">Vol:{{toFixed(item.vol)}}</span>
      </div>
      <peity :type="'line'"
             :options="{fill: item.rate < 0 ? '#DF543A': '#29a76c',stroke:item.rate < 0 ? '#DF543A': '#29a76c', width: '100%', height:'40%' }"
             :data="item.linePort.toString()"></peity>
    </div>
  </div>
</template>

<script>
import Peity from 'vue-peity';
// import tradeCookie from '~/pages/Trade/cookie';
import Utils from '~/utils/';
import { mapState, mapActions } from 'vuex';
import { GET_RECOMMENDED } from '~/store/modules/home/types';
export default {
  components: {
    Peity,
  },
  directives: {
    formatPrice: {
      bind: function() {},
      format(el, m) {
        let point = m.value.point || 0;
        let val = m.value.val || 0;
        if (!point || !val) {
          el.innerText = 0;
          return;
        }
        el.innerText = Utils.toFixedPoint(val, point);
      },
      inserted: function(el, m) {
        m.def.format(el, m);
      },
      update: function() {},
      componentUpdated: function(el, m) {
        m.def.format(el, m);
      },
      unbind: function() {},
    },
  },
  data() {
    return {
      list: null,
    };
  },
  async mounted() {
    await this.$store.dispatch('selectMinAmount');
    this.list = await this.getRecommended(this.minAmountData);
  },
  computed: {
    ...mapState({
      minAmountData: state => state.trade.minAmountData,
    }),
  },
  methods: {
    ...mapActions({
      getRecommended: GET_RECOMMENDED,
    }),
    onExchange(symbol) {
      // tradeCookie.toTrade({
      //   ...symbol,
      //   $router: this.$router,
      // });
      this.$router.push(`/trade/${symbol.zi}_${symbol.mu}`);
    },
    toFixed(val) {
      return Utils.toFixed2(val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

@mixin lineBgTheme() {
  .light & {
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(217, 227, 255, 0.28);
  }
  .dark & {
    background-color: #191d35;
    box-shadow: 0 4px 8px 0 rgba(9, 12, 33, 0.5);
  }
}

@mixin lineBgThemeHover() {
  .light & {
    box-shadow: 0 4px 18px 0 rgba(166, 181, 224, 0.36);
  }
  .dark & {
    background-color: #1e223d;
    box-shadow: 0 4px 8px 0 rgba(4, 6, 22, 0.75);
  }
}

@mixin fontColor1() {
  .light & {
    color: #354989;
  }
  .dark & {
    color: #ced1e3;
  }
}

@mixin fontColor2() {
  .light & {
    color: #b7bcd1;
  }
  .dark & {
    color: #666a81;
  }
}

.peity {
  min-width: 1024px;
  width: 62.5%;
  max-width: 1180px;
  margin: 0 auto;
  margin-top: 28px;
  display: flex;
  .line {
    overflow: hidden;
    cursor: pointer;
    width: 224px;
    height: 100px;
    position: relative;
    margin-left: 20px;
    transition: all 0.2s ease;
    border-radius: 3px;
    @include lineBgTheme();

    &:nth-child(1) {
      margin-left: 0;
    }
    .row {
      margin: 0 12px;
      position: absolute;
      .rise {
        color: #df543a !important;
      }
      .fall {
        color: #29a76c !important;
      }
      .font1 {
        font-size: 14px;
        @include fontColor1();
        font-weight: 500;
      }
      .font2 {
        font-size: 12px;
        @include fontColor2();
        font-weight: 500;
      }
      .font3 {
        font-size: 18px;
        @include fontColor1();
      }
      span {
        &:nth-child(2) {
          margin-left: 14px;
        }
      }
      &:nth-child(1) {
        top: 11px;
      }
      &:nth-child(2) {
        top: 39px;
      }
      &:nth-child(3) {
        bottom: 16px;
      }
    }
    &:hover {
      transform: translate(0, -4px);
      @include lineBgThemeHover();
    }
  }
}
</style>
