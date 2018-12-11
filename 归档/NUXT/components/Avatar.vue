<template>
  <i class="iconfont" :class="[(number < 6) ? icon1 : icon2, (number < 4) ? `color${number}` : cNormal]">
    <em>{{number}}</em>
  </i>
</template>
<script>
export default {
  props: {
    number: {
      type: Number,
      default: 1
    }
  },
  data(){
    return{
      icon1: 'icon-huangguan',
      icon2: 'icon-normal',
      cNormal: 'color4'
    }
  }
}
</script>
<style lang="scss" scoped>
  i{
    font-size: 36px;
    font-style: normal;
    text-align: center;
    position: relative;
    line-height: 36px;
    vertical-align: -3px;
    em{
      color: #fff;
      font-size: 14px;
      line-height: 14px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  .icon-normal{
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    border-radius: 50%;
    background-color: #BEC2D5;
    em{
      display: inline-block;
      position: static;
      transform: translate(0px, -7px);
    }
  }
  .color1{
    color: #FFE258;
  }
  .color2{
    color: #C4D2E1;
  }
  .color3{
    color: #F8A76C;
  }
  .color4{
    color: #BEC2D5;
  }
</style>
