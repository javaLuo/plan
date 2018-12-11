<template>
  <el-input style="width:180px;"
            maxlength="10"
            class="search"
            size="mini"
            suffix-icon="el-icon-search"
            v-model="value"
            @input="onInput($event)"
            :placeholder="i18n.App.WithDraw.inputCoin">
  </el-input>
</template>
 
<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: ['dataSource', 'onChange'],
  watch: {},
  data() {
    return {
      value: '',
    };
  },
  computed: {
    ...mapState(['i18n']),
  },
  methods: {
    onInput(e) {
      this.onChange(e.toUpperCase());
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped="true">
.search {
  line-height: 24px;
  /deep/ input {
    padding-left: 12px;
    height: 24px;
    border-radius: 2px;
  }
  /deep/ .el-input__suffix .el-icon-search {
    font-size: 14px;
    line-height: 24px;
  }
}
</style>