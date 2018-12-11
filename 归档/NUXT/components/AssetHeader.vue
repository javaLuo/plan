<template>
  <div class="asset-header">
    <div class="header-title">{{Header.assetsManage}}</div>
    <div class="header-right">
      <ul>
        <li>
          <nuxt-link to="/asset">{{Header.myAssets}}</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/asset/withdraw">{{Header.withdraw}}</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/asset/deposit">{{Header.deposit}}</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/asset/assetList">{{Header.assetList}}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      Header: state => state.i18n.App.Header,
    }),
  },
};
</script>

<style scoped lang="scss">
@import '../assets/css/_theme-conf';
.asset-header {
  max-width: 1200px;
  min-width: 1024px;
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  margin-bottom: 22px;
  font-weight: 400;
  border-bottom: 1px solid #e9ecf4;
  line-height: 40px;
  .header-title {
    font-size: 20px;
    color: $light003;
  }
  .header-right {
    line-height: 40px;
    ul {
      display: flex;
      justify-content: flex-start;
      font-size: 16px;
      color: #7d86ac;
      align-items: center;
      & li:last-child {
        padding-right: 0;
      }
      li {
        padding-right: 60px;

        a {
          color: #7d86ac;
          display: inline-block;
          font-weight: 400;
          &.nuxt-link-exact-active {
            color: #6aa0ff;
            border-bottom: 2px solid #6aa0ff;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
