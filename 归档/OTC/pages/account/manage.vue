<template>
  <div class="boss">
    <div class="head-box">
      <div class="title">{{Asset.manage}}</div>
      <ul class="tab-box">
        <li :class="{active: tabChose === 1}"
            @click="onTabChose(1)">
          <nuxt-link :to="`/account/manage/adupdate/${id}`">{{Asset.adCon}}</nuxt-link>
        </li>
        <li :class="{active: tabChose === 2}"
            @click="onTabChose(2)">
          <nuxt-link :to="`/account/manage/transactionHistory/${id}`">{{Asset.tradeHistory}}</nuxt-link>
        </li>
        <li :class="{active: tabChose === 3}"
            @click="onTabChose(3)">
          <nuxt-link :to="`/account/manage/operationHistory/${id}`">{{Asset.operateHistory}}</nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child/>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'account-update',
  data() {
    return {
      tabChose: 1, // 选择的哪一个tab
      id: '', // 广告的ID
    };
  },
  computed: {
    ...mapState({
      Asset: state => state.i18n.App.Asset,
    }),
  },
  mounted() {
    const pathname = this.$route.path.split('/').splice(-2)[0];
    const id = this.$route.path.split('/').splice(-1)[0];
    this.id = id;
    if (pathname === 'adupdate') {
      this.tabChose = 1;
    } else if (pathname === 'transactionHistory') {
      this.tabChose = 2;
    } else if (pathname === 'operationHistory') {
      this.tabChose = 3;
    }
  },
  methods: {
    onTabChose(type) {
      this.tabChose = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.boss {
  $blue: #354989;
  $blue2: #6aa0ff;
  width: 1180px;
  margin: 58px auto 120px auto;
  .head-box {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #e9ecf4;
    .title {
      padding: 30px 0 12px 0;
      color: $blue;
      font-size: 22px;
    }
    .tab-box {
      display: flex;
      & > li {
        padding: 30px 5px 0 5px;
        border-bottom: solid 2px transparent;
        & + li {
          margin-left: 25px;
        }
        &.active {
          a {
            color: $blue2;
          }

          border-bottom: solid 2px $blue2;
        }
        a {
          height: 100%;
          font-size: 16px;
          color: #7d86ac;
          display: block;
        }
      }
    }
  }
}
</style>