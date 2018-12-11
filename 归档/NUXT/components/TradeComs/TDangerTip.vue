<template>
  <div :class="['panel-danger',{'show': !isAgreed}]">
    <div class="bg"></div>
    <div class="panel-content">
      <div class="hd">
        {{RiskHints.tips}}
      </div>
      <div class="bd">
        <div class="h">
          {{RiskHints.content}}
        </div>
        <div class="b"
             @click='toggleIsAgree()'>
          <input type="checkbox"
                 v-model="isAgree">
          <span>{{RiskHints.agreement}}</span>
        </div>
        <div class="f">
          <span v-show="isAgree !== undefined && !isAgree">{{RiskHints.agreementError}}</span>
        </div>
      </div>
      <div class="ft">
        <button @click="submit"
                :disabled="!isAgree">{{RiskHints.okBtn}}</button>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Storage from '~/utils/storage';
export default {
  data() {
    return {
      show: false,
      isAgree: undefined, // 错误信息是否显示
      isAgreed: true, // 是否已同意
    };
  },
  computed: {
    ...mapState({
      RiskHints: state => state.i18n.App.RiskHints,
    }),
  },
  mounted() {
    this.isAgreed = Storage.get('isAgreedDanger') === 'true';
  },
  methods: {
    submit() {
      if (!this.isAgree) {
        return;
      }
      Storage.set('isAgreedDanger', 'true');
      this.isAgreed = true;
    },

    toggleIsAgree() {
      this.isAgree = !this.isAgree;
    },
  },
};
</script>


<style lang='scss' scoped>
.panel-danger {
  display: none;
  position: fixed !important;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
  &.show {
    display: block;
  }
  .panel-content {
    position: absolute;
    background: white;
    left: 25%;
    z-index: 99;
    top: 20%;
    width: 50%;
    border-radius: 3px;
    .hd {
      font-size: 18px;
      color: #354989;
      letter-spacing: 0;
      height: 58px;
      line-height: 57px;
      border-bottom: 1px solid #f5f6f9;
      padding-left: 20px;
    }
    .bd {
      font-size: 18px;
      color: #354989;
      letter-spacing: 0;
      line-height: 27px;
      .h {
        padding: 30px 20px;
      }
      .b {
        padding: 0 20px;
        cursor: pointer;
        input {
          width: 14px;
          height: 14px;
          vertical-align: 2px;
          border: 1px solid #dcdfe6;
          margin-right: 5px;
          &:hover {
            border: 1px solid #409eff;
          }
        }
        &.checked {
          input {
            background-color: #409eff;
            border-color: #409eff;
          }
        }
      }
      .f {
        height: 57px;
        padding-bottom: 30px;
        padding-left: 20px;
        font-size: 12px;
        color: #f44336;
      }
    }
    .ft {
      padding: 0 20px;
      padding-bottom: 20px;
      text-align: right;
      button {
        outline: none;
        cursor: pointer;
        padding: 0 12px;
        min-width: 94px;
        height: 41px;
        border: 0;
        background: #409eff;
        font-size: 18px;
        border-radius: 2px;
        color: white;
        &[disabled] {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>




