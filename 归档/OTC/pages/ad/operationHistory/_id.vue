<!-- 交易历史 -->
<template>
  <div class="operation-history">
    <ad-header />
    <div class="new-table">
      <el-table :data="list"
                header-row-class-name="table-myself">
        <el-table-column :label="AdList.time">
          <template slot-scope="scope">
            {{scope.row.creationDate|dubaiDate('DD/MM/YYYY HH:mm:ss')}}
          </template>
        </el-table-column>

        <el-table-column prop="type"
                         :label="AdList.handle">
          <template slot-scope="scope">
            {{AdList[scope.row.action]}}
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
import { GET_AD_OPERATIONHISTORY } from '~/store/modules/ad/type';
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
    }),
  },
  async mounted() {
    this.getData();
  },
  methods: {
    ...mapActions({
      getList: GET_AD_OPERATIONHISTORY,
    }),
    // 分页改变
    async handleCurrentChange(page) {
      this.params.currentPage = page;
      this.getData();
    },
    async getData() {
      let res = await this.getList(this.params);
      this.list = res.list;
      this.total = res.total;
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