<template>
  <div v-loading="loading">
    <div class="account-list-item"
         v-for="(item,index) in list"
         :key="index">
      <dl v-if="item.direction === 1">
        {{!!Common ? Common.assetItem[3] : ''}}
      </dl>
      <dl v-else-if="item.direction === 2">
        {{!!Common ? Common.assetItem[2] : ''}}
      </dl>
      <dl v-else-if="item.direction === 3">{{!!Common ? Common.assetItem[0] : ''}}</dl>
      <dl v-else-if="item.direction === 4">{{!!Common ? Common.assetItem[1] : ''}}</dl>
      <dl v-else-if="item.direction === 5">{{!!Common ? Common.assetItem[5] : ''}}</dl>
      <dl v-else-if="item.direction === 6">{{!!Common ? Common.assetItem[6] : ''}}</dl>
      <dl>
        {{item.asset}}
      </dl>
      <dl>{{item.time | dubaiDate}}</dl>
      <dl>{{item.amount}}
        <span class="right-align">{{item.asset}}</span>
      </dl>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: ['list', 'loading'],
  components: {},
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
    }),
  },
  mounted() {},
  data() {
    return {
      modalDisplayRearch: false,
      modalDisplayTransfer: false,
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.account-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 45px;
  margin: 0 auto;
  &:nth-child(odd) {
    background: #f5f9ff;
  }
  &:nth-child(even) {
    background: #fff;
  }
  dl {
    font-size: 14px;
    color: #354989;
    line-height: 16px;
    flex: 0 0 300px;
    &:first-of-type {
      margin-left: 36px;
    }
    &:last-of-type {
      flex: 0 0 222px;
      text-align: right;
    }
    .right-align {
      display: inline-block;
      width: 35px;
      text-align: right;
    }
  }
}
</style>
