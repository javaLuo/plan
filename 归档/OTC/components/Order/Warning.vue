<template>
	<div class="order-warning">
		<ul v-if="type === 'buy'">
			<li class="title">
				<i class="iconfont icon-zhuyi" /> {{OrderDetail.buyNotice}}
			</li>
			<li>{{OrderDetail.buyNoticeTxt[0]}}</li>
			<li>{{OrderDetail.buyNoticeTxt[1]}}</li>
			<li>{{OrderDetail.buyNoticeTxt[2]}}</li>
		</ul>
		<ul v-if="type === 'sellr'">
			<li class="title">
				<i class="iconfont icon-zhuyi" /> {{OrderDetail.sellNotice}}
			</li>
			<li>{{OrderDetail.sellNoticeTxt[0]}}</li>
			<li>{{OrderDetail.sellNoticeTxt[1]}}</li>
			<li>{{OrderDetail.sellNoticeTxt[2]}}</li>
			<li>{{OrderDetail.sellNoticeTxt[3]}}</li>
		</ul>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: ['type'],
  computed: {
    ...mapState({
      OrderDetail: state => state.i18n.App.OrderDetail,
    }),
  },
};
</script>

<style lang="scss">
.order-warning {
  margin-top: 57px;
  font-size: 12px;
  color: #7d86ac;
  ul > li {
    &:first-child {
      margin-bottom: 22px;
    }
    margin-top: 8px;
  }
  .icon-zhuyi {
    color: #df543a;
    vertical-align: middle;
  }
  .title {
    font-size: 14px;
    color: #354989;
  }
}
</style>
