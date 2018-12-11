<template>
  <div class="currency"
       ref="currency">
    <div class="currency-value"
         @click="isOpen = !isOpen">
      <span>
        <i v-if="!!active && active.asset"
           :class="['default-icon token-logo', `${!!active && active.asset}`]" /> {{!!active && active.asset || ''}}
      </span>
      <i class="iconfont"
         :class="{'icon-arrow-down': !isOpen, 'icon-arrow-up': isOpen}"></i>
    </div>
    <div class="currency-list"
         v-if="isOpen">
      <div class="input">
        <el-input :placeholder="AccountDetail.searchPlaceHolder"
                  class="currency-search"
                  maxlength="10"
                  v-model="searchText">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <ul>
        <li v-for="item in Array.from(auditConfig)
        .filter(x=> x.asset && x.asset.indexOf(searchText.toLocaleUpperCase()) > -1)"
            :key="item.id"
            @click="handleChange(item)"
            v-if="item.isMemo === 0 && (type === 'deposit' && item.canDeposit) || (type === 'withdraw' && item.canWithDraw) || !type">
          <div>
            <i :class="['default-icon token-logo', `${item.asset}`]"></i>
            {{item.asset}}
            <span>/</span>
            <span>{{item.fullName}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import * as type from '~/store/modules/asset/type';
import storage from '~/utils/storage';
export default {
  name: 'Currency',
  props: {
    asset: [String],
    type: [String],
  },
  data() {
    return {
      isOpen: false,
      active: {},
      searchText: '',
      symbol: this.asset || storage.sessiongetItem('asset'),
    };
  },
  async mounted() {
    await this.queryAuditConfig({});
    if (this.auditConfig && this.auditConfig.length > 0) {
      this.active = this.auditConfig.find(x => x.asset === this.symbol);
      this.$emit('change', this.active);
    }
    this.$nextTick(() => {
      // 查看当前元素是否被template包含
      document.addEventListener('click', e => {
        // console.log(e.target);
        if (this.$refs['currency'] && !this.$refs['currency'].contains(e.target)) {
          this.isOpen = false;
        }
      });
    });
  },
  computed: {
    ...mapState({
      AccountDetail: state => state.i18n.App.AccountDetail,
      auditConfig: state => state.asset.auditConfig,
    }),
  },
  methods: {
    ...mapActions({
      queryAuditConfig: type.QUERY_AUDITCONFIG,
    }),
    handleChange(item) {
      this.active = item;
      this.$emit('change', item);
      this.isOpen = false;
      storage.sessionsetItem('asset', item.asset);
    },
    // handleInput(){
    //   this.searchText = this.searchText.to
    // }
  },
};
</script>

<style  lang="scss">
@import '../../../assets/css/_theme-conf';

.currency {
  width: 480px;
  height: 38px;
  background: #fff;
  border: 1px solid #e9ecf4;
  border-radius: 2px;
  line-height: 38px;
  padding: 0 10px;
  font-size: 14px;
  color: $light003;
  position: relative;
  user-select: none;
  border-radius: 2px;
  .currency-value {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .currency-list {
    position: absolute;
    background: #ffffff;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    width: 100%;
    max-height: 440px;
    overflow: auto;
    z-index: 999;
    top: 40px;
    left: 0px;
    .input {
      padding: 0 20px;
      .el-input__inner {
        border: 0px;
        border-bottom: 1px solid #efeef5;
      }
    }
    ul > li {
      padding: 0 20px;
      &:hover,
      .active {
        background: #f7f5fd;
      }
      div {
        border-bottom: 1px solid #efeef5;
        line-height: 45px;
        span {
          font-size: 14px;
          color: #b7bcd1;
          padding-left: 6px;
        }
      }
      &:last-child div {
        border-bottom: 0px;
      }
    }
  }
}
</style>
