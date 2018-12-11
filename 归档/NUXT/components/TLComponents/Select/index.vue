<template>
  <div class="tl-select-container">
      <div class="tl-select" @click="isOpen = !isOpen">
        <span class="value">{{activeCode.nationalCode}}</span>
        <i class="iconfont icon-arrow-down" v-if="!isOpen" name="down" />
        <i class="iconfont icon-arrow-up" v-if="isOpen" name="up" />
      </div>
      <!-- <div class="area-select">
        <span>0086</span>
        <i class="iconfont icon-arrow-down" v-if="!isOpen" name="down" />
        <i class="iconfont icon-arrow-up" v-if="isOpen" name="up" />
      </div> -->
      <div class="tl-select-list" v-if="isOpen">
        <ul>
          <li    v-for="item in Array.from(list)
                .filter(x => x.sort > 0)
                .sort((a, b) => b.sort - a.sort)" 
                :key="item.id" @click="onClick(item)"
                :class="{'active': activeCode.id === item.id}">{{item.nationalCode}}</li>
          <li   v-for="item in Array.from(list).filter(x => x.sort === 0)" :key="item.id" @click="onClick(item)"
                :class="{'active': activeCode.id === item.id}">{{item.nationalCode}}</li>
        </ul>
      </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name:'TlSelect',
  props:{
    list:[Array, null]
  },
  data(){
    return{
      isOpen: false,
      activeCode: {}
    }
  },
  computed:{
    ...mapState({
      nationalityId: state => state.user.nationalityId
    })
  },
  // mounted(){
    
  // },
  methods:{
    init(){
      if (this.list && this.list.length > 0) {
        this.activeCode = this.list.find(x=>x.id === this.nationalityId)
        this.$emit('change', this.activeCode)
      }
    },
    onClick(item){
      this.activeCode = item;
      this.$emit('change', item)
      this.isOpen =  false;
    }
  }
}
</script>

<style  lang="scss">
.tl-select-container{
  width: 100%;
  position: relative;
  user-select: none;
  .tl-select{
    height:48px;
    line-height: 48px;
    font-size:20px;
    color:#1010aa;
    padding:0 20px; 
    display: flex;
    justify-content: space-between;
    background: #F6F8FE;
    border: 1px solid #D3D8E6;
    border-radius: 3px;
  }
  .area-select{
    color:#f5f3ff;
    height:48px;
    line-height: 48px;
    font-size:14px;
    padding:0 20px; 
    display: flex;
    justify-content: space-between;
  }
  .tl-select-list{
    background:#072054;
    margin-top: 10px;
    font-size:14px;
    color:#c4b7ed;
    position: absolute;
    width: 100%;
    max-height: 440px;
    overflow: auto;
    z-index: 100;

    ul >li{
      padding: 0 20px;
      height:44px;
      line-height: 44px;
      border-bottom: 1px solid #061b47;
      cursor: pointer;
      text-align: left;
    }
    ul>li.active,ul>li:hover{
      background: #061b47;
      color:#f5f3ff;
    }
  }
}
</style>
