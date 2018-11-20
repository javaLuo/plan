<template>
	<div class="count-down">
		<div class="minute">
			{{m}}{{Common.minute}}
		</div>
		<div class="second">
			{{s}}{{Common.second}}
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ORDER_STATUS_LIST_ACTIONS } from '~/store/modules/order/type';
export default {
  data() {
    return {
      timer: null,
      m: 0,
      s: 0,
    };
  },
  props: {
    minute: {
      type: Number,
      default: 120,
    },
    tradeNo: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
    }),
  },
  created() {
    this.countDown();
  },
  methods: {
    ...mapActions({
      getOrder: ORDER_STATUS_LIST_ACTIONS,
    }),
    countDown() {
      let vm = this;
      if (Number(this.minute) === 0) {
        setTimeout(() => {
          vm.getOrder(vm.tradeNo);
        }, 5000);
        return;
      }
      let timer = null;
      let t = this.minute;
      let m = Math.floor((t / 60) % 60);
      let s = Math.floor(t % 60);
      m < 10 && (m = '0' + m);
      timer = setInterval(() => {
        s--;
        s < 10 && (s = '0' + s);
        if (s.length >= 3) {
          s = 59;
          m = Number(m) - 1;
        }
        if (Number(m) === 0 && Number(s) === 0) {
          m = '00';
          s = '00';
          clearInterval(timer);
          setTimeout(() => {
            vm.getOrder(vm.tradeNo);
          }, 5000);
        }
        this.m = m;
        this.s = s;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.count-down {
  display: inline-block;
  color: #6aa0ff;
  div {
    display: inline-block;
  }
}
</style>
