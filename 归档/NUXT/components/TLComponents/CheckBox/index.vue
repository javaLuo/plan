<template>
  <div>
    <el-checkbox class="tl-checkbox"
                 v-if="$slots.default"
                 @change="handleChange">
      <slot></slot>
    </el-checkbox>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'TLCheckBox',
  methods: {
    handleChange(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<style lang="scss">
.tl-checkbox {
  font-weight: 500;
  font-size: 14px;
  color: #213b76;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  a {
    color: #6aa0ff;
  }
  .el-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    &.is-checked .el-checkbox__inner {
      background-color: #60cd8a;
      border-color: #60cd8a;
    }
    &.is-checked .el-checkbox__inner:after {
      transform: rotate(45deg) scaleY(1);
    }
    .el-checkbox__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #c4b7ed;
      border-radius: 2px;
      width: 14px;
      height: 14px;
      z-index: 1;
      transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
      &:after {
        box-sizing: content-box;
        content: '';
        border: 1px solid #302255;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform 0.15s ease-in 0.05s;
        transform-origin: center;
      }
    }
    .el-checkbox__original {
      opacity: 0;
      outline: none;
      position: absolute;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }
  .el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
  }
}
</style>
