<template>
  <div>
    <el-dialog :title="Login.authTit"
               :width="width"
               :visible="dialogVisible"
               class="auth-dialog"
               :before-close="close">
      <div id="charSlider"
           class="nc-slider nc-container"></div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Auth from '~/utils/Auth.js';
import MobileAuth from '~/utils/MobileAuth.js';
import utils from '~/utils/';
const auth = new Auth();
const auth_mobile = new MobileAuth();

export default {
  // head:{
  //   script:
  //   [{src: `//g.alicdn.com/sd/ncpc/nc.js?t=${new Date().getTime()}`},
  //     {src: `//g.alicdn.com/sd/nch5/index.js?t=${new Date().getTime()}`}]
  // },
  name: 'AuthModal',
  props: {
    dialogVisible: [Boolean],
    handleClose: [Function],
    handleCallback: [Function],
    width: {
      type: String,
      default: '540px',
    },
  },
  mounted() {
    this.$nextTick(() => {
      var element = document.createElement('script');
      element.src = `//aeis.alicdn.com/sd/ncpc/nc.js?t=${new Date().getTime()}`;
      element.id = 'nc';
      var h5elment = document.createElement('script');
      h5elment.src = `//aeis.alicdn.com/sd/nch5/index.js?t=${new Date().getTime()}`;
      h5elment.id = 'h5nc';
      document.body.appendChild(element);
      document.body.appendChild(h5elment);
    });
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          if (utils.isMobile()) {
            auth_mobile.init(this.handleCallback);
          } else {
            auth.init(this.handleCallback);
          }
        }, 100); //延时加载
      }
    },
  },
  methods: {
    close() {
      // if (utils.isMobile()) {
      //   auth_mobile.deStroy();
      // } else {
      //   auth.deStroy();
      // }
      setTimeout(this.handleClose, 100);
    },
  },
  computed: {
    ...mapState({
      Login: state => state.i18n.App.Login,
    }),
  },
};
</script>
<style lang="scss">
//滑杆验证方式
.nc-slider {
  margin: 20px 0;
  #nc_1_wrapper,
  &.tb-login #nc_1_wrapper {
    margin: 0 auto;
  }
  #nc_2_wrapper,
  &.tb-login #nc_2_wrapper {
    margin: 0 auto;
  }
  .nc_scale {
    height: 48px !important;
    .btn_slide {
      height: 48px !important;
      line-height: 48px !important;
      width: 48px;
      border: 0;
      box-shadow: none;
    }
    .scale_text {
      color: #d3d8e6 !important;
    }
    .scale_text2 {
      color: #fff !important; /* 滑过时的字体颜色 */
    }
    .btn_ok {
      color: #6aa0ff;
      font-size: 28px;
    }
    .scale_text2 b {
      color: #fff;
      font-size: 16px;
    }
  }

  /* 滑动条高度、边框、背景色等 */
  ._nc .stage1 .slider {
    height: 48px;
    box-shadow: none;
    background-color: #eef1f9;
  }
  /* 滑动条 */
  ._nc .stage1 .track div {
    color: #fff;
  }

  /* 滑动条背景色-失败 */
  ._nc .stage1 .bg-red {
    background-color: #df543a;
  }
  ._nc .stage1 .label {
    font-size: 16px;
    color: #b7bcd1;
    background: none;
    height: 48px;
    line-height: 48px;
    -webkit-text-fill-color: currentColor;
  }
  /* 各个状态的icon */
  // 等待滑动："icon iconfont icon-slide-arrow"
  // 验证出错："icon no iconfont icon-close"
  // 验证通过："icon yes iconfont icon-ok"
}
.nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang='_startTEXT'] {
  width: 100% !important;
  font-size: 16px;
  background: none !important;
  -webkit-text-fill-color: currentColor !important;
  height: 48px;
  line-height: 48px;
}
.nc-container .nc_scale .btn_ok {
  height: 48px;
  line-height: 48px !important;
  width: 48px;
  border: 0;
  box-shadow: none;
}
.nc-container .nc_scale span.nc-lang-cnt {
  line-height: 48px;
}

[data-theme='light'] {
  .nc-slider {
    .nc_scale {
      background: #eef1f9 !important;

      span {
        background: #fff;
      }

      div.nc_bg {
        background: #6aa0ff !important; /* 滑过时的背景色 */
      }

      .btn_slide {
        box-shadow: 0 0 4px 0 rgba(21, 37, 64, 0.08);
      }
    }
  }

  /* 滑动条背景色-正常 */
  ._nc .stage1 .bg-green {
    background-color: #6aa0ff;
  }

  .nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang='_startTEXT'] {
    color: #b7bcd1;
  }
}

[data-theme='dark'] {
  .nc-slider {
    .nc_scale {
      background: #090c21 !important;

      span {
        background: #1e223d;
      }

      div.nc_bg {
        background: #477bf7 !important; /* 滑过时的背景色 */
      }

      .btn_slide {
        box-shadow: 0 0 4px 0 rgba(21, 37, 64, 0.08);
      }
    }
  }

  /* 滑动条背景色-正常 */
  ._nc .stage1 .bg-green {
    background-color: #477bf7;
  }

  .nc-container .scale_text.scale_text.slidetounlock span[data-nc-lang='_startTEXT'] {
    color: #373b58;
  }
}
</style>
