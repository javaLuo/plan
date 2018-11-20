<template>
  <div class="avatar-container"
       :class="[type, {online}, {offline: online === false }]"
       :style="{'background': defaultBkColor || bkColorWithId}">
    <em class="name">{{name}}</em>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    name: {
      type: String,
      default: 'U',
    },
    id: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    defaultBkColor: {
      type: String,
      default: null,
    },
    online: {
      type: [Boolean, String],
      default: '',
    },
  },
  computed: {
    bkColor() {
      let cor1 = this.getRandomNum(50, 150);
      let cor2 = this.getRandomNum(50, 150);
      let cor3 = this.getRandomNum(50, 150);
      return `rgb(${cor1}, ${cor2}, ${cor3})`;
    },
    // 通过id计算背景色，如果没传id，则随机
    bkColorWithId() {
      const str = String(this.id);
      if (!str) {
        let cor1 = this.getRandomNum(50, 150);
        let cor2 = this.getRandomNum(50, 150);
        let cor3 = this.getRandomNum(50, 150);
        return `rgb(${cor1}, ${cor2}, ${cor3})`;
      }

      // 平方拉大差距再除2，取后6位作为16进制值
      let codes = String(Math.floor(Number(isNaN(Number(str)) ? str.charCodeAt(0).toString(10) : str) ** 2 / 2), 16)
        .padStart(9, '5')
        .slice(-6);

      return `#${codes}`;
    },
  },
  methods: {
    getRandomNum(min, max) {
      let range = max - min; //得到随机数区间
      let rand = Math.random(); //得到随机值
      return min + Math.round(rand * range); //最小值+随机数取整
    },
  },
};
</script>

<style lang="scss">
.avatar-container {
  display: inline-block;
  position: relative;
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  // background: #7692ab;
  border-radius: 50%;

  .name {
    font-size: 16px;
    color: #fff;
    font-style: normal;
  }

  &:after {
    display: none;
    content: '';
    position: absolute;
    right: -2px;
    bottom: 1px;
    width: 12px;
    height: 12px;
    border: 3px solid #fff;
    border-radius: 50%;
  }

  &.online:after {
    display: block;
    background: #0fd12a;
  }
  &.offline:after {
    display: block;
    background: #d3d8e6;
  }
}
</style>
