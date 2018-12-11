<!-- 银榜首页 -->
<template>
  <div class="container">
    <section class="contain">
      <div class="banner">
        <div class="banner-text">
          <h1>{{SilverList.bannerTxt}}</h1>
        </div>
      </div>
      <MarketHome :isSliver="true" />
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import MarketHome from '~/components/TradeComs/MarketHome';

export default {
  layout: 'silverLayout',
  components: {
    MarketHome,
  },
  computed: {
    ...mapState({
      SilverList: state => state.i18n.App.SilverList,
    }),
  },
  async mounted() {},

  methods: {},
};
</script>
<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

@mixin content {
  width: 62.5%;
  min-width: 1024px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

.contain {
  margin-bottom: 96px;
  min-width: 1024px;
  .banner {
    height: 454px;
    background: url('~assets/images/sl-banner.png') no-repeat center/cover;
    &-text {
      transform: translateY(224px);
      h1 {
        font-size: 51px;
        color: #fff;
        text-align: center;
        line-height: 71px;
      }
      p {
        width: 1049px;
        margin: 0 auto;
        font-size: 22px;
        color: #e8ebfa;
        text-align: center;
        line-height: 48px;
      }
    }
  }
}
</style>
