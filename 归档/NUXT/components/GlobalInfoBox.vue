<template>
  <div class=""
       :class="['global-info-box', {'show' : show}]">
    <div class="box">
      <div class="title">{{lang.tips}}</div>
      <div :class="['info',{'indent': locale !== 'en_us'}]">{{lang.unloginInfo}}</div>
      <div class="control">
        <el-button class="ok-btn"
                   type="primary"
                   @click="onClose">{{lang.okBtn}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'global-info-box',
  data() {
    return {
      show: false, // 是否显示
      excludeUrl: ['/u/login', '/u/register', '/404', '/u/forgotPassword'], // 这些路由地址不显示
    };
  },
  computed: {
    ...mapState({
      lang: state => state.i18n.App.Header, // i18n语言
      isLogin: state => state.isLogin, // 是否已登录
      locale: state => state.locale, // 本地是什么语言
      userInfo: state => state.user.userInfo,
    }),
  },
  watch: {
    $route(newV, oldV) {
      this.onCheck(newV.path);
    },
  },
  mounted() {
    this.onCheck(this.$route.path);
  },
  methods: {
    onClose() {
      this.show = false;
      // document.body.style.overflow = '';
    },
    onCheck(path) {
      if (this.isLogin) {
        // 已登录，不显示
        return;
      }
      let isHave = this.excludeUrl.findIndex(item => path.includes(item));
      if (isHave > -1) {
        // 当前是不需要显示到地址
        return;
      }
      this.show = true;
      // document.body.style.overflow = 'hidden';
    },
  },
};
</script>
<style lang="scss" scoped>
.global-info-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0;
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 300ms;
  &.show {
    opacity: 1;
    z-index: 9999;
    pointer-events: auto;
    visibility: visible;
    & > .box {
      transform: translateY(0);
    }
  }
  & > .box {
    max-width: 640px;
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    background-color: #fff;
    border-radius: 4px;
    transform: translateY(-20px);
    transition: all 300ms;
    .title {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      color: #354989;
      letter-spacing: 0;
      flex: none;
    }
    .info {
      padding: 0 28px;
      font-size: 14px;
      color: #354989;
      letter-spacing: 0;
      line-height: 24px;
      flex: 1;
      &.indent {
        text-indent: 2em;
        text-align: justify;
      }
    }
    .control {
      margin-top: 44px;
      margin-bottom: 28px;
      text-align: center;
      flex: none;
      .ok-btn {
        width: 128px;
        height: 34px;
      }
    }
  }
}
</style>
