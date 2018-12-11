<template>
  <div class="select-address"
       ref="select_Address">
    <div class="address-value"
         @click="isOpen = !isOpen">
      <span>
        {{this.showText}}
      </span>

      <i class="iconfont "
         :class="{'icon-arrow-down': !isOpen, 'icon-arrow-up': isOpen}"
         name="icon" />
    </div>
    <div class="address-list"
         v-if="isOpen">
      <ul>
        <li v-for="item in addressList"
            :key="item.id"
            @click="handleClick(item)">
          <div>{{item.alias}}{{item.alias ? ':':''}}{{item.address}}</div>
        </li>
        <li class="not-hover">
          <nuxt-link to="/asset/address">
            <i class="iconfont icon-add"></i>
            {{Address.add_address}}
          </nuxt-link>
        </li>
        <!-- <li><div>钱包001：1Nys9KBKdorx8n1aGKq8ygtBQ4567HJZda20rx8n1…</div></li>
        <li><div>钱包001：1Nys9KBKdorx8n1aGKq8ygtBQ4567HJZda20rx8n1…</div></li>
        <li><div>钱包001：1Nys9KBKdorx8n1aGKq8ygtBQ4567HJZda20rx8n1…</div></li>
        <li><div>钱包001：1Nys9KBKdorx8n1aGKq8ygtBQ4567HJZda20rx8n1…</div></li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as type from '~/store/modules/asset/type';
export default {
  name: 'SelectAddress',
  props: {
    placeholder: [String],
    addressList: {
      default: [],
    },
  },
  data() {
    return {
      active: {},
      isOpen: false,
    };
  },
  mounted() {
    // 查看当前元素是否被template包含
    this.$nextTick(() => {
      document.addEventListener('click', e => {
        // console.log(e.target);
        if (this.$refs['select_Address'] && !this.$refs['select_Address'].contains(e.target)) {
          this.isOpen = false;
        }
      });
    });
  },
  computed: {
    ...mapState({
      Address: state => state.i18n.App.Address,
    }),
    showText() {
      if (this.active && Object.keys(this.active).length > 0) {
        return `${this.active.alias}:${this.active.address}`;
      }
      return this.placeholder;
    },
  },
  methods: {
    handleClick(val) {
      if (!val) return;
      this.active = val;
      this.isOpen = false;
      this.$emit('change', val);
    },
    reset() {
      this.active = null;
    },
  },
};
</script>

<style  lang="scss">
.select-address {
  background: #ffffff;
  border: 1px solid #e9ecf4;
  border-radius: 2px;
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #bbb9c2;
  position: relative;
  user-select: none;
  .address-value {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .address-list {
    position: absolute;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    width: 100%;
    max-height: 440px;
    overflow: auto;
    z-index: 999;
    top: 40px;
    left: 0px;
    font-size: 14px;
    color: #101010;
    ul > li {
      padding: 0 22px;
      &:hover,
      .active {
        background: #f7f5fd;
      }
      &.not-hover {
        text-align: center;
        a {
          font-size: 14px;
          color: #6aa0ff;
        }
        &:hover {
          background-color: #fff;
          > div {
            border: 0;
          }
        }
      }
      div {
        border-bottom: 1px solid #efeef5;
        line-height: 45px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:last-child div {
        border-bottom: 0px;
      }
    }
  }
}
</style>
