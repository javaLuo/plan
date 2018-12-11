<template>
  <el-input v-on="$listeners"
            type="text"
            v-model="value"
            @input="_onInput($event)"></el-input>

</template>

<script>
export default {
  props: ['onInput', 'val'],
  watch: {
    val() {
      if (this.isEvent) {
        return;
      }
      this.$nextTick(() => {
        this.setState('value', this.val);
      });
    },
  },
  data() {
    return {
      value: '',
      isEvent: false,
    };
  },
  methods: {
    setState(k, v) {
      this[k] = v;
      this.$forceUpdate();
    },
    _onInput(e) {
      this.isEvent = true;
      this.onInput(e);
      this.$nextTick(() => {
        this.setState('value', this.val);
      });
      this.isEvent = false;
    },
  },
  mounted() {},
};
</script>