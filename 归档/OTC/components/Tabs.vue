<template>
	<dl class="tabs">
		<dt>
			{{type === 'buy' ? TradeList.buy : TradeList.sell }}
		</dt>
		<dd v-for="(good, i) in goods"
		    :key="i"
		    :class="{active: curGood == good && type === activeType}"
		    @click="handleTab(good, i, type)">{{good}}</dd>
	</dl>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex';
import * as dict from '~/store/dict';
export default {
  data() {
    return {
      curGood: 'BTC',
      goods: dict.COIN_LIST,
    };
  },
  props: {
    curTab: {
      type: Function,
      default: () => {},
    },
    type: {
      type: String,
      default: 'buy',
    },
    activeType: {
      type: String,
      default: 'buy',
    },
  },
  computed: {
    ...mapState({
      TradeList: state => state.i18n.App.TradeList,
    }),
  },
  methods: {
    ...mapMutations(['setSearch']),
    handleTab(item, index, type) {
      this.curGood = item;
      this.curTab(item, index, type);
      this.setSearch(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  dt,
  dd {
    display: inline;
  }
  dt {
    font-size: 12px;
    color: #a8afcd;
    padding-right: 32px;
  }
  dd {
    font-size: 16px;
    color: #6aa0ff;
    font-weight: 600;
    cursor: pointer;
    padding-right: 24px;
    &:last-child {
      padding-right: 0px;
    }
  }
  .active {
    color: #354989;
    text-decoration-line: underline;
  }
}
</style>

