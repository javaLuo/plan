<template>
  <div class="notice">
    <div class="content">
      <a v-for="item of list"
         target="_blank"
         :href="item.html_url"
         :key="item.id">{{item.name}}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
};
</script>

<style lang="scss" scoped>
.notice {
  // opacity: 0.18;
  // background: #000000;
  font-size: 14px;
  color: #ffffff;
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: rgba($color: #000000, $alpha: 0.18);
  .content {
    min-width: 1024px;
    max-width: 1180px;
    margin: 0 auto;
    width: 62.5%;
    overflow: hidden;
    height: 100%;
    text-align: center;
    a {
      display: inline-block;
      width: auto;
      color: #fff;
      height: 100%;
      &:nth-child(1) {
        margin-left: 0px;
      }
      margin-left: 44px;
    }
  }
}
</style>
