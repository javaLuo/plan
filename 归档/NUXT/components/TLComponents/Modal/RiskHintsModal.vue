<template>
  <el-dialog :title="RiskHints.tips" :visible.sync="visible" :show-close="false" :closeOnClickModal="false" width="540" height="441" class="risk-hints">
    <el-form :model="form" ref="form" class="form">
      <span>{{RiskHints.content}}</span>
      <el-form-item prop="agreementAgree" :rules="[{required:true,message: RiskHints.agreementError, trigger: 'change'},{ validator: validateCheckIn , trigger:'change'}]">
        <el-checkbox v-model="form.agreementAgree" :label="RiskHints.agreement" class="agreement"></el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="modal-cancel-btn" @click="onBack">{{RiskHints.return}}</el-button>
      <el-button class="modal-confirm-btn" @click="onSubmit">{{RiskHints.confirm}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import * as Validate from '~/utils/validate'
import * as Dict from '~/store/dict';
export default {
  namr: 'RiskHintsModal',
  data() {
    return {
        form:{
          agreementAgree: false,// 勾选条约
        },
        visible: true,// 显示隐藏
    };
  },
  props: {
    close: {
      required: false,
      type: Function
    },
  },
  components: {
    
  },
  computed: {
    ...mapState({
      RiskHints: state => state.i18n.App.RiskHints
    })
  },
  methods: {
    validateCheckIn(rule, value, callback){
        if (!!value) {
          callback();
        }
        callback(this.RiskHints.agreementError);
    },
    initForm(){
      this.form = {
        agreementAgree: false
      }
      this.visible = true
      this.$refs.form.clearValidate();
    },
    async onBack(){
      this.$router.back();
    },
    onSubmit(error){
      this.$refs.form.validate(async valid => {
        if (valid) {

          this.visible = false
        } else {
          return false;
        }
			});
    }
  }
}
</script>

<style lang='scss' >
.risk-hints{

  span{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #354989;
    letter-spacing: 0;
    line-height: 27px;
  }

  .agreement{
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #7D86AC;
    line-height: 16px;
    margin-top: 48px;
  }

  .modal-cancel-btn{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    border: 0px;
    color: #5693FF;    
  }

  .modal-confirm-btn{
    margin-right: 26px;
    background-image: linear-gradient(-45deg, #4A83E7 0%, #6CA1FF 100%);
    border-radius: 2px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #FFFFFF;
  }
}

</style>
