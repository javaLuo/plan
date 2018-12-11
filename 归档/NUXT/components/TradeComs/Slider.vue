<!-- 定制滑动条 -->
<template>
  <div :class="`slider-com ${theme}`">
    <input type="range"
           ref="sliderDom"
           min="0"
           max="100"
           class="range-input"
           :disabled="disabled"
           @input="onChange"
           :value="value" />
    <div class="slider-track">
      <div class="line"
           :style="{width: `${100 - value}%`}">
        <div class="ball">
          <div :class="['tip',{show:isTipShow}]">{{value}}%<div class="triangle"></div>
          </div>
        </div>
      </div>
    </div>
    <ul class="dots-box">
      <li :class="{highlight: value>=0}"></li>
      <li :class="{highlight: value>=25}"></li>
      <li :class="{highlight: value>=50}"></li>
      <li :class="{highlight: value>=75}"></li>
      <li :class="{highlight: value>=100}"></li>
    </ul>
  </div>
</template>
<script>
let tipShowTimer;
export default {
  data() {
    return {
      isTipShow: false,
    };
  },
  props: {
    disabled: { type: Boolean, default: false }, // 是否禁用
    value: { type: Number, default: 0 }, // 父级传来的值
    theme: { type: String },
  },
  watch: {
    // 父级传来的值改变时，内部以此值为准
    value(newV) {
      clearTimeout(tipShowTimer);
      this.isTipShow = true;
      tipShowTimer = setTimeout(() => {
        this.isTipShow = false;
      }, 2000);
    },
  },
  methods: {
    onChange(e) {
      this.$emit('onChange', Number(e.target.value));
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-com {
  --lineBackColor: #f9f8fe;
  --borderColor: #f0f0f0;
  &.dark {
    --lineBackColor: #1e223d;
    --borderColor: #1e223d;
  }
  position: relative;
  height: 20px;
  .range-input {
    width: 100%;
    height: 20px;
    opacity: 0;
    position: relative;
    z-index: 4;
  }
  .slider-track {
    position: absolute;

    top: 50%;
    left: 6px;
    width: calc(100% - 12px);
    height: 4px;
    border-radius: 4px;
    margin-top: -2px;
    background-color: rgba(71, 123, 247, 0.4);
    .line {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: var(--lineBackColor);
      z-index: 2;
      .ball {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 14px;
        top: 50%;
        left: 0;
        margin-top: -7px;
        margin-left: -7px;
        background-color: #477bf7;
        border: solid 2px var(--borderColor);
        .tip {
          position: absolute;
          padding: 2px 8px;
          font-size: 12px;
          border-radius: 3px;
          background-color: #477bf7;
          color: #fff;
          left: 50%;
          top: -30px;
          transform: translateX(-50%) translateY(10px) scale(0, 0);
          transition: all 200ms;
          &.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1, 1);
          }
          .triangle {
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-top: solid 5px #477bf7;
            position: absolute;
            bottom: -9px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
  .dots-box {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 4px;
    margin-top: -2px;
    & > li {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: var(--lineBackColor);
      margin-top: -3px;
      &.highlight {
        background-color: #477bf7;
      }
    }
  }
}
</style>