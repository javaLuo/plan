<template>
     <el-tooltip class="payment-remark" effect="dark" :content="OrderDetail.copy" placement="bottom">
            <el-button @click="copy" v-clipboard="remarks" >{{remarks}}</el-button>
    </el-tooltip>
</template>

<script>
import {mapState} from 'vuex';
export default {
  props:['remarks'],
  computed:{
    ...mapState({
      OrderDetail: state => state.i18n.App.OrderDetail
    })
  },
  methods:{
    copy(){
      this.$message.success(this.OrderDetail.sucCopy)
    }
  }
}
</script>

<style>

</style>
