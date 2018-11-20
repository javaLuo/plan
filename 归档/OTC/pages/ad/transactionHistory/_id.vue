<!-- 交易历史 -->
<template>
  <div class="operation-history">
    <ad-header />
    <div class="new-table">
      <el-table :data="list"
                header-row-class-name="table-myself">
        <el-table-column prop="adId"
                         :label="AdList.adNo">
        </el-table-column>

        <el-table-column prop="amounts"
                         :label="OrderList.amount">
        </el-table-column>
        <el-table-column prop="price"
                         :label="OrderList.unit">
        </el-table-column>
        <el-table-column prop="total"
                         :label="OrderList.total">
        </el-table-column>
        <el-table-column :label="AdList.pubTime">
          <template slot-scope="scope">
            {{scope.row.createDate|dubaiDate}}
          </template>
        </el-table-column>
        <el-table-column :label="OrderList.status">
          <template slot-scope="scope">
            {{orderStatusTxt(scope.row.status)}}
          </template>
        </el-table-column>

        <el-table-column prop="createDate"
                         :label="OrderList.object">
          <template slot-scope="scope">
            <nuxt-link :to="{'path':`/member/${scope.row.userId || ''}`}">
              {{scope.row.nickname}}
            </nuxt-link>
          </template>
        </el-table-column>

      </el-table>
      <div class="page"
           v-if="list && list.length">
        <el-pagination @current-change="handleCurrentChange"
                       background
                       layout="prev, pager, next"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import AdHeader from '~/components/AdHeader.vue';
import { mapState, mapActions } from 'vuex';
import { GET_AD_TRADEHISTORY } from '~/store/modules/ad/type';
export default {
  name: 'transactionHistory',
  components: {
    AdHeader,
  },
  data() {
    return {
      // 原始数据
      list: [],
      params: {
        id: this.$route.params.id,
        pageSize: 10,
        currentPage: 1,
      },
      total: 0,
    };
  },
  computed: {
    ...mapState({
      AdList: state => state.i18n.App.AdList,
      OrderList: state => state.i18n.App.OrderList,
    }),
  },
  async mounted() {
    this.getData();
  },
  methods: {
    ...mapActions({
      getList: GET_AD_TRADEHISTORY,
    }),
    // 分页改变
    handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getData();
    },
    async getData() {
      let data = await this.getList(this.params);
      this.list = data.list;
      this.total = data.total;
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
  },
};
</script>

<style lang="scss">
.operation-history {
  margin: 58px auto 96px auto;
  width: 1180px;
  .table-myself {
    background-color: #f5f7fe;
    th {
      background-color: #f5f7fe;
    }
  }
}
</style>