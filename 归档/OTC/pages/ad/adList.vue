<template>
  <div class="ad-list">
    <div class="search">
      <div class="title">{{AdList.title}}</div>
      <div class="search-input"
           ref="adSearch"
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
            <label>{{Common.adsId}}</label>
            <div class="input">
              <el-input type="number"
                        maxlengt="20"
                        v-model="params.adNo"
                        :placeholder="Common.placeholder[0]"></el-input>
            </div>
          </div>
          <div class="row">
            <label for="">{{Common.dateRange}}</label>
            <div class="input">
              <el-date-picker v-model="params.date"
                              type="daterange"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <label>{{Common.trade}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[4]"
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
              <el-select :placeholder="Common.placeholder[4]"
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
            <label>{{Common.adType}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[4]"
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
              <el-select :placeholder="Common.placeholder[4]"
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
            <label>{{Common.adStatus}}</label>
            <div class="input">
              <el-select :placeholder="Common.placeholder[4]"
                         v-model="params.status">
                <el-option :label="Common.total"
                           value="" />
                <el-option v-for="(item, index) in statusList"
                           :label="AdList.statusList[item.label]"
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
      <div class="ad-head">
        <span class="ad-head-adNo">{{AdList.adNo}}</span>
        <span class="ad-head-type">{{AdList.tradeType}}</span>
        <span class="ad-head-progress">{{AdList.progress}}</span>
        <span class="ad-head-unit">{{AdList.unit}}</span>
        <span class="ad-head-time">{{AdList.creatTime}}</span>
        <span class="ad-head-status">{{AdList.status}}</span>
        <span class="ad-head-handle">{{AdList.handle}}</span>
      </div>
      <div class="no-data"
           v-if="!list.length && !loading">
        <img src="~/assets/images/Bitmap@2x.png"
             alt="no-data">
        <p>{{TradeList.noData}}</p>
      </div>
      <div class="ad-body"
           v-else
           v-loading="loading">
        <ul class="ad-item"
            v-for="item in list"
            :key="item.id">
          <li class="ad-item-adNo">{{item.adNo}}</li>
          <li class="ad-item-type">
            <span :style="{color: parseInt(item.tradeType) === 1 ?'#29A76C':'#DF543A'}">{{ AdList.tradeList[item.tradeType] }}</span>
            <span style="margin-left:4px">{{item.tradeAsset}}</span>
          </li>
          <li class="ad-item-progress">
            <span :style="{color: parseInt(item.tradeType) === 1 ?'#29A76C':'#DF543A'}">
              {{`${parseInt(item.progress)}%`}}</span>
          </li>
          <li class="ad-item-unit">
            <span>{{item.unitPrice}}</span>
            <span style="margin-left:4px">{{item.payAsset}}</span>
          </li>
          <li class="ad-item-time">
            {{item.createDate | dubaiDate('DD/MM/YYYY HH:mm:ss')}}
          </li>
          <li class="ad-item-status">
            <span :style="{color: Number(item.status) === 0 ? '#FF9A02':'#354989'}">{{statusListTxt(item.status)}}</span>
          </li>
          <li class="ad-item-handle">
            <a class="contorl-btn"
               v-if="item.status === '0'"
               @click="operateAdStatus(item.id, 1)">{{AdList.soldOut}}</a>
            <a class="contorl-btn"
               v-if="item.status === '1' && businessInfo.isBlack !== 1 && (businessInfo.isBlack !== 2 || item.adType==='普通交易广告')"
               @click="operateAdStatus(item.id, 0)">{{AdList.soldUp}}</a>
            <nuxt-link class="contorl-btn"
                       style="margin-left:28px;"
                       :to="{ 'path': `/ad/updateAd/${item.id}`}"
                       v-if="(item.status == 0 || item.status == 1) && businessInfo.isBlack !== 1 && (businessInfo.isBlack !== 2 || item.adType==='普通交易广告')">{{AdList.edit}}</nuxt-link>
            <el-tooltip class="item"
                        :content="AdList.isblack"
                        placement="top-end">
              <span style="color: #ccc;margin-left: 20px;"
                    v-if="businessInfo.isBlack === 1 || (businessInfo.isBlack === 2 && item.adType !== '普通交易广告')">{{AdList.edit}}</span>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <div class="page"
         v-if="!!adTotal">
      <el-pagination @current-change="change"
                     background
                     layout="prev, pager, next"
                     :total="adTotal">
      </el-pagination>

    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as type from '~/store/modules/ad/type';
import i18n from '~/common/i18n';
export default {
  data() {
    return {
      tradeList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      assetList: [{ key: 0, label: 0 }, { key: 1, label: 1 }, { key: 2, label: 2 }, { key: 3, label: 3 }],
      adtypeList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      payAssetList: [{ key: 0, label: 0 }, { key: 1, label: 1 }],
      statusList: [{ key: 0, label: 0 }, { key: 1, label: 1 }, { key: 2, label: 2 }, { key: 3, label: 3 }],
      searhText: {},
      showSearch: false,
      params: {
        pageSize: 10,
        currentPage: 1,
        adNo: '',
        date: [],
        adType: '',
        tradeAsset: '',
        tradeType: '',
        payAsset: '',
        status: '',
      },
      loading: true,
      adStatusLoading: false, // 上下架是否正在操作中
    };
  },
  watch: {
    locale() {
      this.setSearchText();
    },
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Common: state => state.i18n.App.Common,
      AdList: state => state.i18n.App.AdList,
      TradeList: state => state.i18n.App.TradeList,
      list: state => {
        return state.ad.list;
      },
      adTotal: state => {
        return state.ad.adTotal;
      },
      ErrCode: state => {
        return state.i18n.App.ErrCode;
      },
      businessInfo: state => state.account.businessInfo,
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
    }),
  },
  async mounted() {
    await this.getAdList();

    document.addEventListener('click', this.adSearchEvent);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.adSearchEvent);
  },
  methods: {
    ...mapActions({
      getList: type.AD_GETLIST_ACTIONS,
      updateStatus: type.AD_UPDATE_STATUS_ACTIONS,
      rePublish: type.AD_REPUBLISH,
    }),
    async getAdList() {
      const res = await this.getList(this.params);
      if (res && res.code === 200) {
        this.loading = false;
      } else {
        this.loading = true;
        this.$message.error(this.errorCode[res.code]);
      }
    },
    adSearchEvent(e) {
      if (!this.$refs['adSearch'].contains(e.target)) {
        this.showSearch = false;
      }
    },
    tradeType(value) {
      if (!value) {
        return '';
      }
      value = value.toString();
      return value === this.AdList.tradeList[0] ? this.AdList.tradeList[0] : this.AdList.tradeList[1];
    },
    statusListTxt(val) {
      if (!val && val !== 0) {
        return '';
      }
      switch (String(val)) {
        case '0':
          return this.AdList.statusList[0];
          break;
        case '1':
          return this.AdList.statusList[1];
          break;
        case '2':
          return this.AdList.statusList[2];
          break;
        case '3':
          return this.AdList.statusList[3];
          break;
        case '4':
          return this.AdList.statusList[4];
          break;
        default:
          break;
      }
    },
    search() {
      this.setSearchText();
      this.getAdList();
      this.showSearch = false;
    },
    async operateAdStatus(id, status) {
      if (this.adStatusLoading) {
        // 正在请求中
        return;
      }
      this.adStatusLoading = true;
      let res = await this.updateStatus({ id: id, status: status });
      if (res && res.code === 200) {
        await this.getAdList();
      } else {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
      this.adStatusLoading = false;
    },
    async change(page) {
      this.params.currentPage = page;
      await this.getAdList();
    },
    async republish(id) {
      let res = await this.rePublish(id);
      if (res && res.code === 200) {
        await this.getAdList();
      } else {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
    },
    setSearchText() {
      this.searhText = {
        adNo: this.params.adNo,
        date: this.params.date,
        adType: this.AdList.adtypeList[this.params.adType] || '',
        tradeAsset: this.AdList.assetList[this.params.tradeAsset] || '',
        tradeType: this.AdList.tradeList[this.params.tradeType] || '',
        payAsset: this.AdList.payAssetList[this.params.payAsset] || '',
        status: this.AdList.statusList[this.params.status] || '',
      };
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
  margin: 88px auto 96px auto;
  padding-bottom: 32px;
  .search {
    display: flex;
    justify-content: space-between;
    padding: 0;
    padding-bottom: 17px;
    background-color: #f5f7fe;
    border-bottom: 1px solid #e9ecf4;
    .is-show-placeholder {
      background-color: transparent;
      color: #d3d8e6;
    }
    .title {
      font-size: 22px;
      color: #354989;
    }
  }
  .table {
    .ad-head {
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
      &-adNo {
        width: 19%;
      }
      &-type {
        width: 13%;
      }
      &-progress {
        width: 6%;
        text-align: center;
      }
      &-unit {
        width: 16%;
        text-align: right;
      }
      &-time {
        width: 19%;
        text-align: right;
      }
      &-status {
        width: 13%;
        margin-left: 90px;
      }
      &-handle {
        width: 8%;
        text-align: right;
      }
    }
    .ad-body {
      padding: 0 28px;
      min-height: 200px;
      .ad-item {
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
        &-adNo {
          width: 19%;
        }
        &-type {
          width: 13%;
        }
        &-progress {
          width: 6%;
          text-align: center;
        }
        &-unit {
          width: 16%;
          text-align: right;
        }
        &-time {
          width: 19%;
          text-align: right;
        }
        &-status {
          width: 13%;
          margin-left: 90px;
        }
        &-handle {
          width: 8%;
          text-align: right;
          a {
            color: #6aa0ff;
            cursor: pointer;
          }
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


