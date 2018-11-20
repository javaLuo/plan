<template>

    <div class="search-input">
      <el-input
          class="input-auto"
          v-if='!isSelect'
          v-model="searhText"
          placeholder="类型/币种/时间" />
      <div class="searhText" v-if='isSelect'>
        <span v-if="selText.orderId !== ''">{{selText.orderId}}</span>
        <span v-if="selText.dateRange !== ''">{{selText.dateRange}}</span>
        <span v-if="selText.selTrade !== ''">{{selText.selTrade}}</span>
        <span v-if="selText.selAsset !== ''">{{selText.selAsset}}</span>
        <span v-if="selText.selOrderType !== ''">{{selText.selOrderType}}</span>
        <span v-if="selText.selCurrency !== ''">{{selText.selCurrency}}</span>
        <span v-if="selText.selOrderStatus !== ''">{{selText.selOrderStatus}}</span>
      </div>

      <i class="iconfont icon-shaixuan"  @click="showSearch = !showSearch"/>

      <div class="searh-container" v-if="showSearch">

        <div class="up"></div>

        <div class="row">
          <label>订单编号</label>
          <div class="input">
            <el-input placeholder="请输入订单编号" v-model="selForm.orderId"></el-input>
          </div>
        </div>

        <div class="row">
          <label for="">日期区间</label>
          <div class="input">
            <el-date-picker
              v-model="selForm.dateRange"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>

        <div class="row">
          <label>交易类型</label>
          <div class="input">
            <el-select placeholder="全部" v-model="selForm.selTrade">
              <el-option
                v-for="item in tradeType"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="row">
          <label>资产币种</label>
          <div class="input">
            <el-select placeholder="全部" v-model="selForm.selAsset">
              <el-option
                v-for="item in asset"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="row">
          <label>订单类型</label>
          <div class="input">
            <el-select placeholder="全部" v-model="selForm.selOrderType">
              <el-option
                v-for="item in orderType"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        
        <div class="row">
          <label>法币币种</label>
          <div class="input">
            <el-select placeholder="CN 人民币" v-model="selForm.selCurrency">
              <el-option
                v-for="item in currency"
                :key="item.value"
                :value="item.value">
                  <span>{{ item.value }}</span>
                  <span style="padding-left:5px;">{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="row">
          <label>订单状态</label>
          <div class="input">
            <el-select placeholder="全部" v-model="selForm.selOrderStatus">
              <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="button">
          <a class="cancel-button" @click="showSearch = !showSearch">取消</a>
          <a class="search-button" @click="searchHandle">搜索</a>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  data(){
    return {
      searhText: '',
      isSelect: false,
      showSearch: false,
      selText: {
        orderId: '',
        dateRange: '',
        selTrade: '',
        selAsset: '',
        selOrderType: '',
        selCurrency: '',
        selOrderStatus: ''
      },
      selForm: {
        orderId: '',
        dateRange: '',
        selTrade: '',
        selAsset: '',
        selOrderType: '',
        selCurrency: '',
        selOrderStatus: ''
      },
      tradeType: [{ value: '购买' }, { value: '出售' }],
      asset: [{ value: 'BTC' }, { value: 'ETH' }],
      orderType: [{ value: '普通订单' }, { value: '大宗订单' }],
      currency: [
        {
          value: 'CNY',
          label: '人民币'
        },
        {
          value: 'USD',
          label: '美元'
        }
      ],
      orderStatus: [{ value: '已取消' }, { value: '已完成' }]
    }
  },
  methods: {
    searchHandle: function(){
      this.selText = {...this.selForm};
      this.isSelect = true;
      this.showSearch = false;
    }
  }
}
</script>

<style lang="scss" scoped>
  .search{
    .icon-shaixuan{
      cursor: pointer;
    }
  }
</style>


