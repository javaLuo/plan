<template>
  <aside class="panel-nav">
    <ul>
      <li v-for="(item, index) in lists"
          :key="index"
          @click='onActive(index)'
          :class="{active: assets.onNav == index}">
        <div class="nav-con">
          <i :class="['icon', 'iconfont', item.icon]"></i>
          <span>{{i18n.App.WithDraw[item.label]}}</span>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf';

.panel-nav {
  border-radius: 2px;
  height: 348px;
  padding-top: 16px;
  font-size: 16px;
  @include bgPair(background-color);

  ul {
    li {
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      @include fontPair(color);
      border-left: 3px solid transparent;

      &.active {
        @include interactionPair(border-color);
        @include hoverPair(background-color);
        .nav-con {
          @include interactionPair(color);
        }
      }
      &:hover {
        @include hoverPair(background-color);
      }
      .nav-con {
        height: 100%;
        margin: 0 20px 0 17px;
        border-bottom: 1px solid;
        @include cutLinePair(border-color);

        i {
          vertical-align: 0;
          margin-right: 16px;
        }
      }
    }
  }
}
</style>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  watch: {
    'assets.query'() {
      // console.log(3333);
      // this.onQuery();
    },
  },
  computed: {
    ...mapState(['assets', 'i18n']),
  },
  data() {
    return {
      on: 0,
      lists: [
        {
          icon: 'icon-zichan',
          label: 'assets',
        },
        {
          icon: 'icon-dingdan',
          label: 'history',
        },
        {
          icon: 'icon-dizhi',
          label: 'withdraw_address',
        },
      ],
    };
  },
  methods: {
    init() {
      // this.onQuery();
      this.addListen();
    },
    onQuery() {
      const { type } = this.assets.query;
      if (type === 'history') {
        // this.$store.dispatch('assets/setState');
        this.on = 1;
        return;
      }
      if (type === 'address') {
        this.on = 2;
        return;
      }
      this.on = 0;
    },
    onActive(index) {
      this.on = index;
      const assets = 0;
      const history = 1;
      const wAddress = 2; //提币地址
      switch (index) {
        case assets:
          this.$router.push({ path: 'assets' });
          break;
        case history:
          this.$router.push({ path: 'assets', query: { ...this.assets.query, type: 'history' } });
          break;
        case wAddress:
          this.$router.push({ path: 'assets', query: { ...this.assets.query, type: 'address' } });
          break;
      }
    },
    addListen() {},
  },
  mounted() {
    this.init();
  },
};
</script>