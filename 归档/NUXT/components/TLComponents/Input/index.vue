<template>
    <div class="group">   
      <el-input :disabled="disabled"  :maxlength="maxlength" :type="type" ref="input" @focus="isTop= true" @blur="handleBlur" :value="currentValue" @input="handleInput"></el-input>
      <span class="highlight"></span>
      <span class="bar"></span>
      <label :class="{top: this.currentValue !== '' && this.currentValue || isTop}">{{placeholder}}</label>
      <span  class="loading" v-if="isShowCode && !imgParameter">加载中…</span>
      <img   @click="sendCode" v-if="isShowCode && imgParameter" :src="imgParameter" alt="">
      <code-modal :handle-callback="handleCallback" v-if="isShowBtn" class="obtion-btn">obtion</code-modal>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import * as type from '~/store/modules/user/type'
import TlSelect from '../Select/'
import CodeModal from '../CodeModal/'
export default {
  props:{
     value: [String, Number],
     isShowCode: false,
     isShowBtn: false,
     placeholder:{
       type: String,
       default: ''
     },
     type: {
        type: String,
        default: 'text'
    },
    maxlength:[String, Number],
    handleCallback: {
      type: Function,
      default: ()=>{}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components:{
    TlSelect,
    CodeModal
  },
  data(){
    return{
      currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,
      isTop: false
    }
  },
  created(){
   //在获取验证码的情况下调用
   if (this.isShowCode) {
     this.sendCode();
   }
  },
  computed:{
    ...mapState({
      imgParameter: state => state.user.imgParameter
     
    })
  },
  methods:{
    ...mapActions({
      sendCode: type.SEND_CODE
    }),
    handleInput(value) {
      // const value = value;
      this.currentValue = value;
      this.$emit('input', value)
    },
    handleBlur(event){
      this.isTop=false
      this.$emit('blur', event);
    }
  }
}
</script>

<style lang="scss">
* { box-sizing:border-box; }

/* basic stylings ------------------------------------------ */
/* form starting stylings ------------------------------- */
.el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #60cd8a;
}
.group{ 
  position:relative; 
   img{
      width: 94px;
      height: 30px;
      position:absolute;
      right: 0px;
      top: 0px;
    }
    .obtion-btn{
      position:absolute;
      right: 0px;
      top: 0px;
    }
    .loading{
      background:#072054;
      border-radius:2px;
      width:96px;
      height:32px;
      display: inline-block;
      position:absolute;
      right: 0px;
      top: 0px;
      font-size:12px;
      color:#644d9d;
      text-align:center;
      line-height:32px;
    }
    
    input{
      font-size:18px;
      padding:10px 10px 10px 5px;
      width:100%;
      border:none;
      border-bottom:1px solid #072054;
      background: #01143C;
      color:#fff !important;
    }
    input:focus 		{ outline:none; }

    /* LABEL ======================================= */
    label 				 {
      font-size:14px;
      color:#213b76;
      font-weight:normal;
      position:absolute;
      pointer-events:none;
      left:5px;
      top:0px;
      transition:0.2s ease all; 
      -moz-transition:0.2s ease all; 
      -webkit-transition:0.2s ease all;
    }

    /* active state */
    input:focus label, input:valid label 		{
      top:-28px;
      font-size:14px;
      color:#a4a4a4;
    }
    .top{
      top:-28px;
      font-size:14px;
      color:#213b76;
    }
    /* BOTTOM BARS ================================= */
    .bar 	{ position:relative; display:block; width:300px; }

    .bar:before, .bar:after 	{
      content:'';
      height:2px; 
      width:0;
      bottom:1px; 
      position:absolute;
      background:#ff9437; 
      transition:0.2s ease all; 
      -moz-transition:0.2s ease all; 
      -webkit-transition:0.2s ease all;
    }

    .bar:before {
      left:50%;
    }
    .bar:after {
      right:50%; 
    }

    /* active state */
    input:focus{
      // width:50%;
      border-bottom:1px solid #60cd8a;
    }

    /* HIGHLIGHTER ================================== */
    .highlight {
      position:absolute;
      height:60%; 
      width:100px; 
      top:25%; 
      left:0;
      pointer-events:none;
      opacity:0.5;
      color: #635683;
    }

    input.error{
      border-bottom:1px solid red;
    }
}
</style>
