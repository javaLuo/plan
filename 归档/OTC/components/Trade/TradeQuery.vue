<template>

  <div class="search-input"
       ref="tradeSearch"
       :class="{open: showSearch}"
       @click.self="showSearch = !showSearch">
    <div class="searhText">
      <template v-if='!isSelect'>
        <span @click="showSearch = !showSearch">{{Common.searchTag[0]}}</span>
        <span @click="showSearch = !showSearch">{{Common.searchTag[1]}}</span>
        <span @click="showSearch = !showSearch">{{Common.searchTag[2]}}</span>
      </template>
      <template v-if='isSelect'>
        <span v-if="selText.selNation !== ''"
              @click="showSearch = !showSearch">{{selText.selNation}}</span>
        <span v-if="selText.selCurrency !== ''"
              @click="showSearch = !showSearch">{{selText.selCurrency}}</span>
        <span v-if="selText.selPayment !== ''"
              @click="showSearch = !showSearch">{{selText.selPayment}}</span>
        <span v-if="selText.limit !== ''"
              @click="showSearch = !showSearch">{{selText.limit}}</span>
      </template>
    </div>

    <i class="iconfont icon-shaixuan"
       @click="showSearch = !showSearch" />
    <div class="searh-container"
         v-if="showSearch">

      <div class="up"></div>

      <div class="row">
        <label>{{Common.areaLabel}}</label>
        <div class="input">
          <el-select :placeholder="Common.allNation"
                     v-model="selForm.selNation">
            <el-option value="">{{Common.allNation}}</el-option>
            <el-option v-for="item in areaList"
                       :key="item.value"
                       :label="locale === 'zh_cn' ? item.national : item.nationalCode"
                       :value="item.id">
              <!-- <span>{{ item.value }}</span> -->
              <span style="padding-left:5px;">{{ locale === 'zh_cn' ? item.national : item.nationalCode }}</span>
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="row">
        <label>{{Common.legal}}</label>
        <div class="input">
          <el-select :placeholder="Common.placeholder[5]"
                     v-model="selForm.selCurrency">
            <el-option value="">{{Common.placeholder[5]}}</el-option>
            <el-option v-for="item in currency"
                       :key="item.value"
                       :label="Common.legalType[item.label]"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <label>{{Common.payment}}</label>
        <div class="input">
          <el-select :placeholder="Common.placeholder[3]"
                     v-model="selForm.selPayment">
            <el-option value="">{{Common.placeholder[3]}}</el-option>
            <el-option v-for="item in payment"
                       :key="item.value"
                       :label="Common.payItem[item.label]"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="row">
        <label>{{Common.limit}}</label>
        <div class="input">
          <el-input :placeholder="Common.placeholder[2]"
                    v-model="selForm.limit"></el-input>
        </div>
      </div>

      <div class="button">
        <a class="reset"
           @click="resetSearch">{{Common.clearFilter}}</a>
        <a class="cancel-button"
           @click="showSearch = !showSearch">{{Common.cancel}}</a>
        <a class="search-button"
           @click="searchHandle">{{Common.search}}</a>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import { mapActions, mapMutations, mapState } from 'vuex';
import * as type from '~/store/modules/order/type';
// import * as dict from '~/store/dict';

export default {
  data() {
    return {
      searhText: '',
      // isSelect: false,
      showSearch: false,
      selText: {
        selNation: '',
        selCurrency: '',
        selPayment: '',
        limit: '',
      },
      selForm: {
        selNation: '',
        selCurrency: '',
        selPayment: '',
        limit: '',
      },
      selObj: {
        selNation: {},
        selCurrency: {},
        selPayment: {},
      },
      currency: [
        {
          value: 0,
          label: 0,
        },
        {
          value: 1,
          label: 1,
        },
      ],
      payment: [
        {
          value: 4,
          label: 0,
        },
        {
          value: 2,
          label: 1,
        },
        {
          value: 3,
          label: 2,
        },
        {
          value: 1,
          label: 3,
        },
        {
          value: 5,
          label: 4,
        },
      ],
    };
  },
  props: ['getListParams'],
  computed: {
    ...mapState({
      Common: state => state.i18n.App.Common,
      TradeList: state => state.i18n.App.TradeList,
      locale: state => state.locale,
      areaList: state => state.order.areaList,
      isSelect: state => state.order.isSelect,
    }),
  },
  async created() {
    await this.getAreaList();
  },
  mounted() {
    document.addEventListener('click', this.tradeSearchEvent);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.tradeSearchEvent);
  },
  watch: {
    locale() {
      // 语言改变后要重新设置一下搜索框已经填入的值
      this.selText = {
        selNation: this.areaList.filter(v => v.id === this.selForm.selNation).length
          ? this.areaList.filter(v => v.id === this.selForm.selNation)[0][this.locale === 'zh_cn' ? 'national' : 'nationalCode']
          : '',
        selCurrency: this.currency.filter(v => v.value === this.selForm.selCurrency).length ? this.Common.legalType[this.currency.filter(v => v.value === this.selForm.selCurrency)[0].label] : '',
        selPayment: this.payment.filter(v => v.value === this.selForm.selPayment).length ? this.Common.payItem[this.payment.filter(v => v.value === this.selForm.selPayment)[0].label] : '',
        limit: this.selForm.limit,
      };
    },
  },
  methods: {
    ...mapMutations(['setSearch']),
    tradeSearchEvent(e) {
      if (!this.$refs['tradeSearch'].contains(e.target)) {
        this.showSearch = false;
      }
    },
    searchHandle: function() {
      this.selText = {
        selNation: this.areaList.filter(v => v.id === this.selForm.selNation).length
          ? this.areaList.filter(v => v.id === this.selForm.selNation)[0][this.locale === 'zh_cn' ? 'national' : 'nationalCode']
          : '',
        selCurrency: this.currency.filter(v => v.value === this.selForm.selCurrency).length ? this.Common.legalType[this.currency.filter(v => v.value === this.selForm.selCurrency)[0].label] : '',
        selPayment: this.payment.filter(v => v.value === this.selForm.selPayment).length ? this.Common.payItem[this.payment.filter(v => v.value === this.selForm.selPayment)[0].label] : '',
        limit: this.selForm.limit,
      };

      if (Object.values(this.selText).every(x => x === '')) {
        this.setSearch(false);
      } else {
        this.setSearch(true);
      }

      this.showSearch = false;
      const params = Object.assign({}, this.getListParams, {
        countryArea: this.selForm.selNation,
        payAsset: this.selForm.selCurrency,
        payMethod: this.selForm.selPayment,
        limitPrice: this.selForm.limit,
      });
      try {
        this.adList(params);
      } catch (e) {}
    },
    resetSearch() {
      this.selForm = {
        selNation: '',
        selCurrency: '',
        selPayment: '',
        limit: '',
      };
      this.setSearch(false);
    },
    ...mapActions({
      setState: type.SET_STATE,
      getAreaList: type.GET_AREALIST_ACTIONS,
      adList: type.AD_GETLIST_ACTIONS_ORDER,
    }),
  },
};
</script>

<style lang="scss" scoped>
.search {
  .icon-shaixuan {
    cursor: pointer;
  }
}
</style>


