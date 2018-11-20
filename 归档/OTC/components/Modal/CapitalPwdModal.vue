<template>
  <div class="capital-modal">
    <div class="capital-container">
      <div class="capital-modal-title">
        <span>{{PublishAd.puback}}</span>
        <a class="close"
           @click="hadnleCancel">
          x
        </a>
      </div>
      <div class="capital-modal-content">
        {{PublishAd.pubackMes}}
      </div>
      <el-form :model="params"
               ref="form"
               class="capital-modal-form">
        <el-form-item :label="PublishAd.assetPassword"
                      prop="pwd"
                      class="form-item"
                      :rules="[{ required: true, message: PublishAd.placeholder, trigger: 'blur' }]">
          <el-input type="password"
                    v-model="params.pwd"></el-input>
        </el-form-item>
        <el-form-item style="padding-top:26px;text-align:right;"
                      label-width="0px">
          <el-button class="modal-cancel-btn"
                     @click="hadnleCancel">{{PublishAd.cancel}}</el-button>
          <el-button class="modal-confirm-btn"
                     @click="hadnleSubmit">{{PublishAd.confirm}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { AD_VERIFYSECRET } from '~/store/modules/ad/type';
export default {
  props: {
    modalCancel: {
      type: Function,
      default: () => {},
    },
    handleCallback: {
      required: true,
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      params: {
        pwd: '',
      },
      // rules:{
      //   pwd:[{ required: true, message: '请输入资金密码', trigger: 'blur' }]
      // }
    };
  },
  computed: {
    ...mapState({
      PublishAd: state => state.i18n.App.PublishAd,
    }),
  },
  created() {
    this.$nextTick(() => {
      document.body.style.overflow = 'hidden';
    });
  },
  methods: {
    ...mapActions({
      verifySecret: AD_VERIFYSECRET,
    }),
    hadnleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.verifySecret({ secret: this.params.pwd });
          if (res && res.code !== 200) {
            this.$message.error(this.PublishAd.errAsset);
            return false;
          }
          this.handleCallback();
        } else {
          return false;
        }
      });
    },
    hadnleCancel() {
      this.$refs.form.resetFields();
      document.body.style.overflow = 'auto';
      this.modalCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
.capital-modal {
  position: fixed;
  z-index: 20001;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: Center;

  .capital-container {
    background: #ffffff;
    border-radius: 4px;
    width: 420px;
    height: 300px;
    padding: 32px;
    .form-item {
      display: flex;
    }
    .capital-modal-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #221b2f;
      .close {
        display: inline-block;
        text-align: center;
        width: 8px;
        font-size: 14px;
        color: #585360;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        cursor: pointer;
      }
    }
    .capital-modal-content {
      font-size: 12px;
      color: #797780;
      margin-top: 10px;
    }
    .capital-modal-form {
      margin-top: 30px;
    }
  }
}
</style>
