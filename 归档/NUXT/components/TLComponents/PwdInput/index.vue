<template>
  <div class="pwd-input">
    <el-popover ref="popover"
                placement="top-start"
                trigger="focus"
                popper-class="pwd-popover"
                v-model="popover">
      <dl class="pwd-score-box">
        <dt :class="pwdLevel">
          <i class="w" />
          <i class="m" />
          <i class="s" />
          <b>{{PwdLevelLanguage[pwdLevel]}}</b>
        </dt>
        <dd :class="pwdLength">
          <span>
            <i :class="pwdLength ? 'el-icon-success' : 'el-icon-warning'" />
          </span>
          {{PwdLevelLanguage.rule1}}
        </dd>
        <dd :class="pureNumber ? 'yes' : 'no'">
          <span>
            <i :class="pureNumber ? 'el-icon-success' : 'el-icon-warning'" />
          </span>
          {{PwdLevelLanguage.rule2}}
        </dd>
        <dd :class="!hasSpace ? 'yes' : 'no'">
          <span>
            <i :class="!hasSpace? 'el-icon-success' : 'el-icon-warning'" />
          </span>
          {{PwdLevelLanguage.rule3}}
        </dd>
      </dl>
    </el-popover>
    <div>
      <el-input v-popover:popover
                maxlength="30"
                @blur="popover = false"
                :placeholder="placeholder"
                type="password"
                ref="input"
                :value="currentValue"
                @input="handleInput"></el-input>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as type from '~/store/modules/user/type';
import { specialChar1, specialChar2 } from '~/utils/constant';
export default {
  name: 'PwdInput',
  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      popover: false,
      currentValue: this.value === undefined || this.value === null ? '' : this.value,
      isTop: false,
    };
  },
  computed: {
    ...mapState({
      PwdLevelLanguage: state => state.i18n.App.PwdLevel,
    }),
    pwdLevel() {
      let val = this.currentValue;
      let level = '';
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      let hasSpChart = !/\s/.test(val);
      let notPureNumber = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]/.test(val);
      let pwdCharTypes = {
        hasNumber: /\d/g.test(val),
        hasChar: /[a-zA-Z]+/g.test(val),
        hasSpecialChar: specialChar1.test(val) || specialChar2.test(val),
      };
      let limit9 = val.length <= 9;
      let l8o10 = val.length > 7 && val.length <= 10;
      let over10 = val.length >= 10;
      let hasCharTypeNum = Object.keys(pwdCharTypes).filter(item => pwdCharTypes[item]).length;

      if ((hasCharTypeNum === 2 && over10) || (l8o10 && hasCharTypeNum === 3)) {
        return 'medium';
      } else if (hasCharTypeNum === 3 && over10) {
        return 'strong';
      } else {
        return 'weak';
      }
    },
    pwdLength() {
      return this.currentValue.length > 7 ? 'yes' : 'no';
    },
    pureNumber() {
      return /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]/.test(this.currentValue); //是否包含字母
    },
    hasSpace() {
      return /\s/.test(this.currentValue); //是否包含空格
    },
  },
  methods: {
    ...mapActions({}),
    handleInput(value) {
      this.currentValue = value;
      this.$emit('input', this.currentValue);
    },
  },
};
</script>

<style lang="scss">
@import '~assets/css/_theme-conf';

.pwd-score-box {
  width: 250px;
  font-size: 12px;
  dt {
    i {
      width: 28px;
      height: 10px;
      display: inline-block;
      margin-right: 10px;
      @include tipsPair(background-color);
    }
    &.weak {
      .w {
        @include decreasePair(background-color);
      }
      b {
        @include decreasePair(color);
      }
    }
    &.medium {
      .w,
      .m {
        @include interactionPair(background-color);
      }
      b {
        @include interactionPair(color);
      }
    }
    &.strong {
      .w,
      .m,
      .s {
        @include interactionPair(background-color);
      }
      b {
        @include interactionPair(color);
      }
    }
  }

  dd {
    padding: 3px 0;
    &.yes {
      @include fontPair(color);

      > span {
        @include interactionPair(color);
      }
    }
    &.no {
      @include subFontPair(color);
      > span {
        color: $common2 !important;
      }
    }

    span {
      padding-right: 4px;
    }
  }
}
</style>
