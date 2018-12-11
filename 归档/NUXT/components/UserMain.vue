<template>
  <div class="container">
    <div class="user-layout">
      <aside class="sider-bar">
        <ul class="side">
          <li class="side-item"
              :class="{active: section === item.name}"
              v-for="(item, index) in sideList"
              :key="index"
              @click="handleTab(item.name)">
            <a class="side-item-text">
              <i class="icon iconfont"
                 :class="`icon-${item.icon}`"></i>
              <span>{{Settings.sideBar[`nav${index+1}`]}}</span>
            </a>
          </li>
        </ul>
      </aside>
      <div class="user-content">
        <slot :name="section"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      sideList: [
        {
          name: 'basicInfo',
          icon: 'wode',
        },
        {
          name: 'security',
          icon: 'anquan',
        },
        {
          name: 'bake',
          icon: 'dingdan',
        },
        {
          name: 'tradeApi',
          icon: 'API',
        },
        // {
        //   name: 'invitation',
        //   icon: 'yaoqinghaoyou',
        // },
      ],
    };
  },
  props: {},
  computed: {
    ...mapState({
      section: state => state.settings.section,
      Settings: state => state.i18n.App.Settings,
    }),
  },
  methods: {
    ...mapMutations(['tabState']),
    handleTab(item) {
      this.tabState(item);
      this.$router.push({
        path: '/u',
        query: {
          section: item,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~assets/css/_theme-conf';
.user-layout {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto 18px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  @include frontPair(background-color);
  .user-content {
    flex: 1;
    margin-left: 20px;
  }

  .side {
    width: 220px;
    border-radius: 2px;
    padding: 16px 0 92px;
    @include bgPair(background-color);
    &-item {
      padding: 0 20px 0 17px;
      cursor: pointer;
      border-left: 3px solid transparent;
      &-text {
        font-size: 16px;
        height: 48px;
        line-height: 46px;
        display: block;
        border-bottom: 1px solid;
        @include fontPair(color);
        @include cutLinePair(border-bottom-color);
        i {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
          white-space: nowrap;
          padding-left: 15px;
        }
      }
      &:hover {
        @include hoverPair(background-color);
      }
      &.active {
        border-left: 3px solid;
        @include hoverPair(background-color);
        @include interactionPair(border-left-color);
        .side-item-text {
          @include interactionPair(color);
        }
      }
    }
  }
}
</style>


