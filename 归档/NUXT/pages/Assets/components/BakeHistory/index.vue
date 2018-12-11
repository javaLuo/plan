<template>
  <div class="assets-bake-history">
    <el-table :data="sourceData"
              style="width: 100%">
      <el-table-column prop="createTime"
                       width="280"
                       :label="i18n.App.AccountDetail.Time">
      </el-table-column>
      <el-table-column prop="productName"
                       width="150"
                       :label="i18n.App.Bake.projectname">
      </el-table-column>
      <el-table-column prop="type"
                       :label="i18n.App.AccountDetail.Type">
      </el-table-column>
      <el-table-column prop="amount"
                       :label="i18n.App.AccountDetail.Amount">
      </el-table-column>
      <el-table-column prop="status"
                       :label="i18n.App.AccountDetail.Status">
      </el-table-column>
    </el-table>
    <div v-if="sourceData.length"
         class="pagination-box">
      <el-pagination @current-change="onChangePage($event)"
                     background
                     layout="prev, pager, next"
                     :total="assets.bakeLists.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { selectAssetsBake } from '~/store/modules/assets/type';
import tools from '~/utils';
export default {
  data() {
    return {
      pageSize: 10,
      pageNow: 1,
    };
  },
  computed: {
    ...mapState(['assets', 'i18n']),
    sourceData() {
      return this.assets.bakeLists.list.map(item => {
        return {
          createTime: this.formatDate(item.createTime),
          productName: item.productName,
          amount: item.amount,
          id: item.id,
          status: this.formatStatus(item.status),
          type: this.formatType(item.type),
        };
      });
    },
  },
  async mounted() {
    await this.$store.dispatch('assets/selectAssetsBake', { currentPage: 1, pageSize: this.pageSize });
  },
  methods: {
    async onChangePage(e) {
      await this.$store.dispatch('assets/selectAssetsBake', { currentPage: e, pageSize: this.pageSize });
      this.currentPage = e;
    },
    // 格式化日期
    formatDate(str) {
      return tools.ForMatDateDuBai(str);
    },
    // 格式化状态
    formatStatus(str) {
      // 直接就是已完成，不用判断
      return this.i18n.App.AccountDetail.finished;
    },
    // 格式化type
    formatType(str) {
      return this.i18n.App.Bake.t[`s${str}`];
    },
  },
};
</script>

<style lang="scss">
.assets-bake-history {
  .el-table__header-wrapper table {
    margin-left: 0 !important;
  }
  .el-table__body-wrapper table {
    margin-left: 0 !important;
  }
  .pagination-box {
    padding: 20px;
    text-align: right;
  }
}
</style>