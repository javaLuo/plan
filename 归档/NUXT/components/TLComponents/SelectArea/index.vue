<template>
<div>
    <div class="tl-select-container select-area">
      <div class="area-select" @click="isOpen = !isOpen">
        <span>+{{activeCode.areaid}}</span>
        <i class="iconfont " :class="{'icon-arrow-down': !isOpen, 'icon-arrow-up': isOpen}" v-if="!isOpen" name="icon" />
      </div>
      <div class="tl-select-list" v-if="isOpen">
        <ul>
          <li    v-for="item in Array.from(list)
                .filter(x => x.sort > 0)
                .sort((a, b) => b.sort - a.sort)" 
                :key="item.id" @click="onClick(item)"
                :class="{'active': activeCode.id === item.id}">+{{item.areaid}}</li>
          <li   v-for="item in Array.from(list).filter(x => x.sort === 0)" :key="item.id" @click="onClick(item)"
                :class="{'active': activeCode.id === item.id}">+{{item.areaid}}</li>
        </ul>
      </div>
        <div class="group">   
      <el-input maxlength="11" :value="currentValue" ref="input" @input="handleInput" type="text"></el-input>
      <span class="highlight"></span>
      <span class="bar"></span>
      <label :class="{top: this.currentValue !== '' && this.currentValue || isTop}">{{placeholder}}</label>
    </div>
    </div>
</div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import * as type from '~/store/modules/user/type'
import TlSelect from '../Select/'
export default {
  props:{
     value: [String, Number],
     placeholder:{
       type: String,
       default: ''
     },
    maxlength:[String, Number],
    handleSendCode: {
      type: Function,
      default: ()=>{}
    },
    list:[Array, null]
  },
  components:{
    TlSelect
  },
  watch:{
    nationalityId(newVal, oldVal){
      if (newVal !== oldVal) {
        this.getArea();
      }
    }
  },
  data(){
    return{
      currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,
      isTop: false,
      activeCode: {},
      isOpen: false
    }
  },
  computed:{
    ...mapState({
      nationalityId: state => state.user.nationalityId
    })
  },
  mounted(){
    if (this.list && this.list.length > 0) {
      this.getArea();
    }
  },
  methods:{
    ...mapActions({
    }),
    getArea(){
      this.activeCode = this.list.find(x=>x.id === this.nationalityId)
    },
    handleInput(value) {
      // const value = value;
      this.currentValue = value;
      this.$emit('input', value)
    },
    onClick(item){
      this.activeCode = item;
      this.$emit('change', item)
      this.isOpen =  false;
    }
  }
}
</script>
<style lang="scss" >
.select-area{
  display: flex;
  .area-select{
    width: 20%;
    border-bottom: 1px solid #061b47;
    /* padding-bottom: 10px; */
    height: 40px;
    padding: 0 10px;
    line-height: 40px;
  }
  .tl-select-list{
    top: 40px;
  }
}
</style>
