<template>
  <div class="auth">
    <div class="title-container">
      <div class="title">{{Business.title}}</div>
      <div class="message">{{Business.notes}}</div>
    </div>
    <div class="container">
      <div class="box">
        <div class="card">
          <div class="icon">
            <i class="iconfont icon-fabu" />
          </div>
          <div class="font">
            {{Business.auth1.title}}
          </div>
          <div class="font-message">
            {{Business.auth1.des}}
          </div>
        </div>
        <div class="card">
          <div class="icon">
            <i class="iconfont icon-xinren" />
          </div>
          <div class="font">
            {{Business.auth2.title}}
          </div>
          <div class="font-message">
            {{Business.auth2.des}}
          </div>
        </div>
      </div>
      <div class="handle">
        <!-- 可申请 c审核失败或e取消审核成功 可发起申请-->
        <div class="checkbox"
             v-if="['c','e'].includes(nowType)">
          <el-checkbox v-model="checked">{{Business.agreement[0]}}
            <a target="_blank"
               rel="noopener noreferrer nofollow"
               style="color:#6AA0FF;"
               :href="`https://support.rightbtc.com/hc${terms[locale][0]}`">{{Business.agreement[1]}}</a>
          </el-checkbox>
        </div>
        <div class="button"
             v-if="['c','e'].includes(nowType)">
          <el-button type="primary"
                     @click="onSubmit(1)">{{Business.apply}}</el-button>
          <el-button type="primary"
                     @click="onSubmit(2)">{{Business.applyVip}}</el-button>
        </div>
        <!-- 审核中 a申请审核中，d取消申请审核中-->
        <div class="notice"
             v-if="['a','d'].includes(nowType)">{{Business.busiStatus[0]}}</div>
        <!-- 已通过 可以取消 b申请成功，f取消申请审核失败-->
        <div class="notice"
             v-if="['b','f'].includes(nowType)">
          {{Business.busiStatus[1]}}
          <div>
            <el-button class="this-btn this-btn-cancel"
                       :loading="loading"
                       @click="onCancel">{{Business.cancel}}</el-button>
            <!-- 普通商家可以升级 -->
            <el-button type="primary"
                       class="this-btn"
                       @click="onSubmit(3)"
                       v-if="businessInfo.type===1">{{Business.updateLevel}}</el-button>
            <!-- 大宗商家可以降级 -->
            <!-- <el-button type="primary"
                       class="this-btn"
                       @click="onSubmit(4)"
                       v-if="businessInfo.type===2">{{Business.downLevel}}</el-button> -->
          </div>
        </div>
      </div>

    </div>

    <!-- 下面是协议弹出框 -->
    <el-dialog :title="Business.protocol"
               :visible="dialogVisible"
               width="540px"
               class="auth-dialog-modal"
               :before-close="handleClose">
      <div class="dialog-container">
        <div class="step">
          {{Business.step1}}
        </div>
        <div class="dialog-content">
          <ul>
            <li>{{Business.step1Con[0]}}
              <a style="color:#6f52c1;"
                 :href="Business.templateUrl">{{Business.step1Con[1]}}</a>{{Business.step1Con[2]}}
            </li>
            <li>{{Business.step1Con[3]}}</li>
            <li style="display: flex;">
              <i></i>
              {{Business.step1Con[4]}}
            </li>
            <li style="display: flex;">
              <i></i>
              {{Business.step1Con[5]}}
            </li>
          </ul>
        </div>
        <div class="step">
          {{Business.step2}}
        </div>
        <div class="dialog-content">
          <ul>
            <li>
              <div>{{Business.step2Con[0]}}
                <span style="color:#6AA0FF;">{{Business.step2Con[1]}}</span>{{Business.step2Con[2]}}</div>

            </li>
          </ul>
        </div>
        <div class="step">
          {{Business.step3}}
        </div>
        <div class="dialog-content">
          <ul>
            <li>{{Business.step3Con.replace('@1', this.iceHowmuch)}}</li>
          </ul>
        </div>
        <div class="step">
          {{Business.step4}}
        </div>
        <div class="dialog-content">
          <ul>
            <li>{{Business.step4Con}}</li>
            <li style="margin-top:10px">{{Business.comment}}</li>
          </ul>
        </div>
        <div class="dialog-footer">
          <div class="dialog-checkbox">
            <el-checkbox class="forzen"
                         v-model="forzenChecked">{{Business.checkMes.replace('@1', iceHowmuch)}}</el-checkbox>
          </div>
          <div class="dialog-button">
            <el-button type="primary"
                       :loading="loading"
                       @click="apply">{{Business.confirm}}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 跳转到个人中心页的modal -->
    <C2Modal :show="needC2Show"
             @onClose="onC2ModalClose" />

    <!-- 降级商家的提示框 -->
    <downModal :show="downLevelisShow"
               :loading="downLevelLoading"
               @onClose="onDownLevelClose"
               @onOk="onDownLevelOk" />
  </div>
</template>

<script>
import { USER_BUSINESS_ASK_ACTIONS, USER_BUSINESS_INFO_ACTIONS, USER_BUSSINESS_CANCEL_ACTIONS, USER_BUSINESS_BUSIPROMOTION_ACTIONS } from '~/store/modules/account/type';
import { GET_USER_INFO_ACTIONS, GET_OTC_USER_INFO_ACTIONS } from '~/store/modules/member/type';
import { mapActions, mapState } from 'vuex';
import Storage from '~/utils/storage';
import C2Modal from '~/components/Modal/goToC2Modal';
import downModal from '~/components/Modal/downLevel';
export default {
  data() {
    return {
      checked: false,
      forzenChecked: false,
      dialogVisible: false, // 协议框是否显示
      loading: false, // 用于按钮的loading
      needC2Show: false, // 需要c2认证弹框是否显示
      downLevelisShow: false, // 降级确认框是否显示
      downLevelLoading: false, // 是否正在降级钟
      terms: {
        en_us: ['/en-us/articles/360015890152'],
        zh_cn: ['/zh-cn/articles/360015890152'],
      },
      authType: 1, // 1普通商家冻结300000RT, 2大宗冻结500000RT
    };
  },
  components: {
    C2Modal,
    downModal,
  },
  async created() {
    await this.getBusinessInfo();
    await this.getUserInfo();
    await this.getOtcUserInfo({
      userId: this.userInfo.userId,
    });
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Business: state => state.i18n.App.Business,
      businessInfo: state => {
        return state.account.businessInfo;
      },
      userInfo: state => {
        return state.member.userInfo;
      },
      otcUserInfo: state => {
        return state.member.otcUserInfo;
      },
      ErrCode: state => {
        return state.i18n.App.ErrCode;
      },
    }),
    // 需要冻结多少RT
    iceHowmuch() {
      switch (Number(this.authType)) {
        case 1: // 普通商家
          return '300000 RT';
        case 2: // 大宗商家
          return '500000 RT';
        case 3: // 普通升级大宗商家
          return '200000 RT';
        default:
          // 未知状态
          return '-';
      }
    },
    // 当前认证状态 a申请审核中，b申请审核成功，c申请审核失败， d取消申请审核中，e取消申请审核成功，f取消申请审核失败
    nowType() {
      const b = this.businessInfo;
      // console.log('businessInfo:', b);
      if (!b || typeof b.type === 'undefined') {
        return -1; // 未知状态
      }
      if (b.type === 0 || !b.type) {
        // 普通用户
        if (b.busiStatus === 0 || !b.busiStatus) {
          // 未申请过，也用C状态好了
          return 'c';
        } else if (b.busiStatus === 1) {
          // 商家申请审核中
          return 'a';
        } else if (b.busiStatus === 2) {
          // 取消商家审核成功
          return 'e';
        } else if (b.busiStatus === 3) {
          // 商家申请审核失败
          return 'c';
        }
      } else if (b.type === 1) {
        // 普通商家
        if (b.busiStatus === 1) {
          // 取消商家审核中
          return 'd';
        } else if (b.busiStatus === 2) {
          // 商家申请审核通过
          return 'b';
        } else if (b.busiStatus === 3) {
          // 商家取消申请审核失败
          return 'f';
        } else if (b.busiStatus === 4) {
          // 普通商家升级超级商家，审核中
          return 'a';
        }
      } else if (b.type === 2) {
        // 超级商家
        if (b.busiStatus === 1) {
          // 取消商家审核中
          return 'd';
        } else if (b.busiStatus === 2) {
          // 商家申请审核通过
          return 'b';
        } else if (b.busiStatus === 3) {
          // 商家取消申请审核失败
          return 'f';
        } else if (b.busiStatus === 5) {
          // 超级商家降级，审核中
          return 'a';
        }
      }
      return -1;
    },
  },
  methods: {
    ...mapActions({
      bussinessAsk: USER_BUSINESS_ASK_ACTIONS,
      upLevel: USER_BUSINESS_BUSIPROMOTION_ACTIONS,
      getBusinessInfo: USER_BUSINESS_INFO_ACTIONS,
      getUserInfo: GET_USER_INFO_ACTIONS,
      getOtcUserInfo: GET_OTC_USER_INFO_ACTIONS,
    }),
    handleClose() {
      this.dialogVisible = false;
    },
    onDownLevelClose() {
      this.downLevelisShow = false;
    },
    // 用户确认降级，发起降级请求
    onDownLevelOk() {
      this.downLevelLoading = true;
      this.upLevel({
        language: Storage.get('locale') || 'en_us',
        userName: this.otcUserInfo[this.userInfo.userId].nickname,
      })
        .then(res => {
          if (res.code === 200) {
            // 重新获取信息
            this.downLevelisShow = false;
            this.getBusinessInfo();
          } else {
            this.$message.error(this.ErrCode[res.code] || `${res.code}`);
          }
        })
        .finally(() => {
          this.downLevelLoading = false;
        });
    },
    onC2ModalClose() {
      this.needC2Show = false;
    },
    // 真正的发起商家认证请求
    async apply() {
      // 是否勾选同意冻结RT
      if (!this.forzenChecked) {
        this.$message.warning(this.Business.message[0].replace('@1', this.iceHowmuch));
        return false;
      }
      // 是否设置了昵称
      if ((!!this.otcUserInfo && !this.otcUserInfo[this.userInfo.userId]) || !this.otcUserInfo[this.userInfo.userId].nickname) {
        this.$message.error(this.Business.message[1]);
        return false;
      }
      // 开始认证
      this.loading = true;
      let res;
      if (this.authType === 3) {
        // 从普通商家升级到大宗商家
        res = await this.upLevel({
          language: Storage.get('locale') || 'en_us',
          userName: this.otcUserInfo[this.userInfo.userId].nickname,
        });
      } else {
        // 正常的申请普通商家或大宗商家
        res = await this.bussinessAsk({
          language: Storage.get('locale') || 'en_us',
          userName: this.otcUserInfo[this.userInfo.userId].nickname,
          type: this.authType, // 1普通商家，2超级商家
        });
      }
      if (!res || res.code !== 200) {
        this.$message.error(this.ErrCode[`${res.code}`] || `${res.code}`);
      }
      this.loading = false;
      this.dialogVisible = false;
      // 重新获取商家信息
      await this.getBusinessInfo();
    },
    /**
     * 点击申请按钮
     * @param type 申请类型 1普通商家 2大宗商家 3普通商家升级大宗商家 4大宗商家降级普通商家
     */
    onSubmit(type) {
      if (this.businessInfo && this.businessInfo.isBlack === 2 && type === 3) {
        this.$message.error(this.Business.isblack2);
        return;
      }
      // 先判断C2认证通过没
      if (this.userInfo.c2Status !== 1) {
        this.needC2Show = true;
        return;
      }

      // 用户点击了降级，直接降级
      if (type === 4) {
        this.downLevelisShow = true;
        return;
      }

      // 正常的申请需要勾选协议 是否勾选协议
      if ([1, 2].includes(type) && !this.checked) {
        this.$message.warning(this.Business.agreeWarn);
        return;
      }

      this.authType = type; // 1普通商家 2大宗商家 3从普通商家升级到大宗商家, 4从大宗降级到普通
      this.forzenChecked = false; // 重置勾选状态
      this.dialogVisible = true; // 协议框出现
    },
    // 申请取消按钮被点击
    onCancel() {
      if (this.businessInfo && this.businessInfo.isBlack === 2) {
        this.$message.error(this.Business.isblack);
        return;
      }
      this.$confirm(this.Business.applyCancelInfo, this.Business.cancel, {
        confirmButtonText: this.Business.confirm,
        cancelButtonText: this.Business.close,
      })
        .then(() => {
          this.onCancelStart();
        })
        .catch(() => {});
    },
    // 执行申请取消接口
    async onCancelStart() {
      this.loading = true;
      const params = {
        language: Storage.get('locale') || 'zh_cn',
      };
      let res = await this.$store.dispatch(USER_BUSSINESS_CANCEL_ACTIONS, params);
      if (res && res.code === 200) {
        this.getBusinessInfo();
      } else {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  margin-top: 58px;
  .dialog-container {
    .dialog-footer {
      margin-top: 40px;
      .forzen {
        color: #354989;
        font-weight: normal;
      }
      .dialog-button {
        margin-top: 22px;
        text-align: right;
        button {
          // width: 114px;
          // height: 44px;
          //	background-image: linear-gradient(64deg, #fad961 0%, #f37c38 73%);
          border-radius: 4px;
          border: 0;
        }
      }
    }
    .step {
      font-size: 14px;
      color: #354989;
      letter-spacing: 0;
      line-height: 24px;

      margin-top: 20px;
      &:nth-child(1) {
        margin-top: 0px;
      }
    }
    .dialog-content {
      margin-top: 12px;
      font-size: 14px;
      color: #7d86ac;
      a {
        color: #6aa0ff !important;
      }
      ul > li {
        font-size: 14px;
        color: #7d86ac;
        letter-spacing: 0;
        line-height: 24px;
        align-items: flex-start;
        i {
          display: block;
          flex: none;
          width: 3px;
          height: 3px;
          border-radius: 3px;
          background-color: #7d86ac;
          margin: 9px 7px 0 2px;
        }
      }
    }
  }
  .container {
    background: #fff;
    width: 1180px;
    margin: 0 auto;
    margin-top: 30px;
    min-height: 400px;
    margin-bottom: 120px;
    padding: 120px 215px 70px 215px;
    .box {
      display: flex;
      justify-content: space-between;
      .card {
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(25, 16, 54, 0.1);
        border-radius: 2px;
        width: 280px;
        height: 340px;
        text-align: center;
        padding: 0 15px;
        &:nth-child(2) {
          .icon {
            background-image: linear-gradient(-180deg, #f8cb4c 0%, #ee9b25 100%);
            box-shadow: 0 2px 4px 0 rgba(238, 155, 37, 0.3);
          }
        }
        .icon {
          background-image: linear-gradient(-180deg, #86f7cc 0%, #52e19d 100%);
          box-shadow: 0 2px 4px 0 rgba(30, 233, 158, 0.3);
          width: 64px;
          height: 64px;
          border-radius: 100%;
          margin: 0 auto;
          margin-top: 72px;
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            font-size: 24px;
            color: #fff;
          }
        }
        .font {
          font-size: 18px;
          color: #354989;
          margin-top: 40px;
        }
        .font-message {
          margin-top: 20px;
          font-size: 14px;
          color: #7d86ac;
        }
      }
    }
    .handle {
      margin-top: 100px;
      text-align: center;
    }
    .notice {
      font-size: 14px;
      color: #b7b6ba;
      & > div {
        margin-top: 18px;
        .this-btn {
          width: 220px;
        }
        .this-btn-cancel {
          border-color: transparent;
          color: #6aa0ff;
        }
      }
    }
    .button {
      text-align: center;
      margin-top: 20px;
      button {
        width: 220px;
      }
    }
  }
  .tag-a {
    color: #6aa0ff;
  }
}
</style>

<style lang="scss">
.auth-dialog-modal {
  .el-dialog__body {
    padding: 10px 26px 20px 26px;
  }
}
</style>