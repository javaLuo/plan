<template>
    <a class="tl-button" v-if="$slots.default" @click="handleClick"><slot></slot></a>
</template>

<script>
export default {
  name: 'TlButton',
  methods:{
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
}
</script>

<style scoped lang="scss">
  .tl-button{
    display: inline-block;
    width: 100%;
    height:48px;
    background: #6AA0FF;
    border-radius: 3px;
    border-radius:2px;
    color: #fff;
    font-size:16px;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
    user-select: none;
    &:hover{
      background: #6AA0FF;
    }
  }
</style>
