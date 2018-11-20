<template>
  <div class="ad-list">
    <div class="search">
      <div class="title">{{OrderList.title}}</div>
      <!-- 搜索组件 -->
      <div class="search-input"
           ref="orderSearch"
           :class="{open: showSearch}"
           @click.self="showSearch = !showSearch">
        <!-- <el-input v-model="searhText" placeholder="编号/类型/日期/状态" /> -->
        <div class="searhText"
             @click="showSearch = !showSearch">
          <span v-for="(item, index) in searhText"
                :key="index"
                v-if="item && item !=='' && item.length > 0 && !isShowPlaceHolder">
            {{typeof item !== 'object' ? item : item[0]+'-'+item[1] }}
          </span>
          <span class="is-show-placeholder"
                v-if="isShowPlaceHolder">{{Common.searchTxt[1]}}</span>
        </div>
        <i class="iconfont icon-shaixuan"
           @click="showSearch = !showSearch" />
        <div class="searh-container"
             v-if="showSearch">
          <div class="up" />
          <div class="row">
            <label>{{Common.orderId}}</label>
            <div class="input">
              <el-input type="number"
                        maxlengt="20"
                        v-model="params.tradeNo"
                        :placeholder="Common.placeholder[0]"></el-input>
            </div>
          </div>
          <div class="row">
            <label for="">{{Common.dateRange}}</label>
            <div class="input">
              <el-date-picker v-model="params.date"
                              type="daterange"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <label>{{Common.trade}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[5]"
                         v-model="params.tradeType">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in tradeList"
                           :label="AdList.tradeList[item.label]"
                           :value="item.key"
                           :key="index" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <label>{{Common.icons}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[5]"
                         v-model="params.tradeAsset">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in assetList"
                           :label="AdList.assetList[item.label]"
                           :value="item.key"
                           :key="index" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <label>{{Common.orderType}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[5]"
                         v-model="params.adType">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in adtypeList"
                           :label="AdList.adtypeList[item.label]"
                           :value="item.key"
                           :key="index" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <label>{{Common.legal}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[5]"
                         v-model="params.payAsset">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in payAssetList"
                           :label="AdList.payAssetList[item.label]"
                           :value="item.key"
                           :key="index" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <label>{{Common.orderState}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[5]"
                         v-model="params.status">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in orderStatusList"
                           :label="AdList.orderStatus[item.label]"
                           :value="item.key"
                           :key="index" />
              </el-select>
            </div>
          </div>
          <div class="button">
            <a class="reset"
               @click="resetSearch">{{Common.clearFilter}}</a>
            <a class="cancel-button"
               @click="showSearch = false">{{Common.cancel}}</a>
            <a class="search-button"
               @click="search">{{Common.search}}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格数据 -->
    <div class="table table-mysel">
      <div class="table-head">
        <span class="table-a">{{OrderList.orderNo}}</span>
        <span class="table-b">{{OrderList.type}}</span>
        <span class="table-c">{{OrderList.amount}}</span>
        <span class="table-d">{{OrderList.unit}}</span>
        <span class="table-e">{{OrderList.total}}</span>
        <span class="table-f">{{OrderList.createTime}}</span>
        <span class="table-g">{{OrderList.status}}</span>
        <span class="table-h">{{OrderList.object}}</span>
      </div>

      <div class="table-body"
           v-if="myorderList && myorderList.length || loading"
           v-loading="loading">
        <ul class="table-item"
            v-for="item in myorderList"
            :key="item.id">
          <li class="table-a">
            <nuxt-link style="color: #6AA0FF"
                       :to="{path:`/order/orderDetail/${item.tradeNo}`}">
              {{item.tradeNo}}
            </nuxt-link>
          </li>
          <li class="table-b">
            <span :style="{color:Number(item.tradeType) === 1 ?'#29A76C':'#DF543A'}">{{ tradeType(item.tradeType) }}</span>
            <span style="margin-left:4px">{{item.tradeAsset}}</span>
          </li>
          <li class="table-c">
            <span>{{item.amount}}</span>
            <span style="margin-left:4px">{{item.tradeAsset}}</span>
          </li>
          <li class="table-d">
            <span>{{item.unitPrice}}</span>
            <span style="margin-left:4px">{{item.payAsset}}</span>
          </li>
          <li class="table-e">
            <span>{{item.total}}</span>
            <span style="margin-left:4px">{{item.payAsset}}</span>
          </li>
          <li class="table-f">
            {{item.createDate|dubaiDate('YYYY/MM/DD/HH:mm:ss')}}
          </li>
          <li class="table-g">
            {{orderStatusTxt(item.status)}}
          </li>
          <li class="table-h">
            <nuxt-link style="color: #6AA0FF"
                       :to="{'path':`/member/${item.tradePersonId}`}">
              {{item.tradePerson}}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <div class="no-data"
           v-if="(!myorderList || !myorderList.length) && !loading">
        <img src="~/assets/images/Bitmap@2x.png"
             alt="no-data">
        <p>{{TradeList.noData}}</p>
      </div>
    </div>

    <div class="page"
         v-if="!!myorderTotal">
      <el-pagination @current-change="change"
                     background
                     layout="prev, pager, next"
                     :total="myorderTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as type from '~/store/modules/order/type';
export default {
  data() {
    return {
      tradeList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      assetList: [{ key: 0, label: 0 }, { key: 1, label: 1 }, { key: 2, label: 2 }, { key: 3, label: 3 }],
      adtypeList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      payAssetList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      orderStatusList: [{ key: 0, label: 0 }, { key: 1, label: 1 }, { key: 2, label: 2 }, { key: 3, label: 3 }, { key: 4, label: 4 }],
      searhText: {},
      showSearch: false,
      loading: true, // 页面是否在加载中
      params: {
        pageSize: 10,
        currentPage: 1,
        tradeNo: '',
        date: [],
        adType: '',
        tradeAsset: '',
        tradeType: '',
        payAsset: '',
        status: '',
      },
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Common: state => state.i18n.App.Common,
      AdList: state => state.i18n.App.AdList,
      TradeList: state => state.i18n.App.TradeList,
      ErrCode: state => state.i18n.App.ErrCode,
      myorderList: state => {
        // return [
        // 	{
        // 		tradeNo: '234353234235',
        // 		tradeType: 'BUY',
        // 		amount: 2423.34534,
        // 		tradeAsset: 'BTC',
        // 		unitPrice: 234,
        // 		payAsset: 'USD',
        // 		createTime: new Date().getTime() / 1000,
        // 		status: 'PENDING',
        // 		tradePerson: '小明',
        // 		total: 99999,
        // 	},
        // 	{
        // 		tradeNo: '234353234235',
        // 		tradeType: 'SELL',
        // 		amount: 2423.34534,
        // 		tradeAsset: 'BTC',
        // 		unitPrice: 234,
        // 		payAsset: 'USD',
        // 		createTime: new Date().getTime() / 1000,
        // 		status: 'PENDING',
        // 		tradePerson: '小明',
        // 		total: 99999,
        // 	},
        // ];
        return state.order.myorderList;
      },
      myorderTotal: state => {
        return state.order.myorderTotal;
      },
      OrderList: state => {
        return state.i18n.App.OrderList;
      },
    }),
    isShowPlaceHolder() {
      if (Object.keys(this.searhText).length <= 0) {
        return true;
      }
      return (
        this.searhText.tradeNo === '' &&
        this.searhText.date.length <= 0 &&
        this.searhText.adType === '' &&
        this.searhText.tradeAsset === '' &&
        this.searhText.tradeType === '' &&
        this.searhText.payAsset === '' &&
        this.searhText.status === ''
      );
    },
  },
  async mounted() {
    await this.getList(this.params);
    this.loading = false;
    document.addEventListener('click', this.orderSearchEvent);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.orderSearchEvent);
  },
  watch: {
    locale() {
      this.search();
    },
  },
  methods: {
    ...mapActions({
      getList: type.ORDER_LIST_ACTIONS,
    }),
    orderSearchEvent(e) {
      if (!this.$refs['orderSearch'].contains(e.target)) {
        this.showSearch = false;
      }
    },
    tradeType(value) {
      if (!value) {
        return '';
      }
      value = value.toString();
      return value === '1' ? this.Common.tradeItem[1] : this.Common.tradeItem[0];
    },
    orderStatusTxt(val) {
      if (!val) {
        return '';
      }
      switch (val) {
        case 'CANCEL':
          return this.AdList.orderStatus[0];
          break;
        case 'PENDING':
          return this.AdList.orderStatus[1];
          break;
        case 'PAID':
          return this.AdList.orderStatus[2];
          break;
        case 'FINISH':
          return this.AdList.orderStatus[3];
          break;
        case 'APPEALING':
          return this.AdList.orderStatus[4];
          break;
        default:
          break;
      }
    },
    search() {
      this.searhText = {
        tradeNo: this.params.tradeNo,
        date: this.params.date,
        adType: this.AdList.adtypeList[this.params.adType] || '',
        tradeAsset: this.AdList.assetList[this.params.tradeAsset] || '',
        tradeType: this.AdList.tradeList[this.params.tradeType] || '',
        payAsset: this.AdList.payAssetList[this.params.payAsset] || '',
        status: this.AdList.orderStatus[this.params.status] || '',
      };
      this.getList(this.params).then(res => {
        if (res && res.code === 200) {
          this.showSearch = false;
        } else {
          this.$message.error(`${this.ErrCode[res.code]}`);
        }
      });
    },
    async change(page) {
      this.params.currentPage = page;
      await this.getList(this.params);
    },
    resetSearch() {
      this.searhText = {};
      this.params = {
        pageSize: 10,
        currentPage: 1,
        tradeNo: '',
        date: [],
        adType: '',
        tradeAsset: '',
        tradeType: '',
        payAsset: '',
        status: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.ad-list {
  width: 1180px;
  background: #fff;
  margin: 88px auto 96px;
  padding-bottom: 32px;
  .search {
    display: flex;
    justify-content: space-between;
    padding: 0;
    padding-bottom: 17px;
    background-color: #f5f7fe;
    border-bottom: 1px solid #e9ecf4;
    .title {
      font-size: 22px;
      color: #354989;
    }
  }

  .table-mysel {
    .table-head {
      display: flex;
      justify-content: space-between;
      color: #a8afcd;
      font-size: 12px;
      padding: 20px 28px 0;
      line-height: 32px;
      background-color: #f5f7fe;
      span {
        display: inline-block;
      }
      .table-a {
        width: 14%;
      }
      .table-b {
        width: 8%;
      }
      .table-c {
        width: 12%;
        text-align: right;
      }
      .table-d {
        width: 12%;
        text-align: right;
      }
      .table-e {
        width: 12%;
        text-align: right;
      }
      .table-f {
        width: 18%;
        text-align: right;
      }
      .table-g {
        width: 12%;
        padding-left: 48px;
        text-align: right;
      }
      .table-h {
        width: 12%;
        text-align: right;
      }
    }
    .table-body {
      padding: 0 28px;
      // min-height: 200px;
      .table-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        list-style: none;
        padding: 20px 0;
        border-bottom: 1px solid #f5f6f9;
        li {
          color: #354989;
          display: inline-block;
        }
        .table-a {
          width: 14%;
        }
        .table-b {
          width: 8%;
        }
        .table-c {
          width: 12%;
          text-align: right;
        }
        .table-d {
          width: 12%;
          text-align: right;
        }
        .table-e {
          width: 12%;
          text-align: right;
        }
        .table-f {
          width: 18%;
          text-align: right;
        }
        .table-g {
          width: 12%;
          padding-left: 48px;
          text-align: right;
        }
        .table-h {
          width: 12%;
          text-align: right;
        }
      }
    }
    .no-data {
      color: #b1b0ce;
      text-align: center;
      padding: 48px 0 44px;
      img {
        width: 54px;
        margin-bottom: 8px;
      }
      p {
        font-size: 12px;
        color: #d3d8e6;
      }
    }
  }
  .page {
    padding: 0 28px;
  }
}
</style>
