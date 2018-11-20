<template>
  <div class="title-container line">
    <div class="title">{{Asset.editAd}}</div>
    <ul>
      <li>
        <nuxt-link :to="{ 'path': `/ad/updateAd/${$route.params.id}`}">
          {{Asset.adCon}}
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{ 'path': `/ad/transactionHistory/${$route.params.id}`}">
          {{Asset.tradeHistory}}
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{ 'path': `/ad/operationHistory/${$route.params.id}`}">
          {{Asset.operateHistory}}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      Asset: state => state.i18n.App.Asset,
    }),
  },
};
</script>

<style lang="scss">
.title-container {
  padding-bottom: 12px;
  display: flex;
  justify-content: space-between;
  &.line {
    border-bottom: 1px solid #e9ecf4;
  }
  ul {
    display: flex;
    font-size: 16px;
    color: #7d86ac;
    align-items: center;
    line-height: 30px;
    li {
      margin-left: 60px;
      height: 100%;
      .active {
        border-bottom: 2px solid #6aa0ff;
        padding-bottom: 12px;
        color: #6aa0ff;
      }
      a {
        color: #7d86ac;
      }
    }
  }
}
</style>
