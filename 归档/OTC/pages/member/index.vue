<template>
  <div class="setting-tab">
    <div class="bread-box">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{langHeader.home}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{langHeader.myCenter}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="setting-item-box">
      <!-- {/* 基本信息 */} -->
      <div class="setting-item">
        <div class="item-title">
          <div class="title">{{Settings.baseTitle}}</div>
          <div class="placeholder"></div>
          <div class="info">{{Settings.safelv}}:
            <i>{{safelv}}</i>
          </div>
        </div>
        <div class="setting-item-content">
          <SetNicknameModal :display="modalDisplaySetNickname"
                            :close="()=>{}"
                            :loading="loading"
                            :ok="setNicknameHandle" />
          <!-- {/* 用户昵称 */} -->
          <div class="setting-item-list">
            <dl class="nickname-on"
                v-if="!!otcUserInfo[userInfo.userId] && !!otcUserInfo[userInfo.userId].nickname" />
            <dl class="nickname-off"
                v-else />
            <dl>
              <dt>{{Settings.account.nickname}}</dt>
              <dd>{{Settings.account.nameDesc[0]}}：{{!!otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].totalTrade ? otcUserInfo[userInfo.userId].totalTrade : 0}}{{Settings.account.nameDesc[1]}} {{Settings.account.nameDesc[2]}}：{{!!otcUserInfo[userInfo.userId] && otcUserInfo[userInfo.userId].avgPassMin ? otcUserInfo[userInfo.userId].avgPassMin : 0}}{{Settings.account.nameDesc[3]}}
              </dd>
              <dt v-if="!!otcUserInfo[userInfo.userId] && !!otcUserInfo[userInfo.userId].nickname">{{otcUserInfo[userInfo.userId].nickname}}</dt>
              <dt v-else
                  v-loading='loadingPage'
                  :style="{minHeight:0}">
                <a href="javascript:;"
                   @click="()=>{modalDisplaySetNickname = true}">{{loadingPage ? '' : Settings.binding}}</a>
              </dt>
            </dl>
          </div>
          <!-- {/* 用户UID */} -->
          <div class="setting-item-list">
            <dl class="account-on" />
            <dl>
              <dt>{{Settings.account.name}}</dt>
              <dd>
                {{Settings.account.idDesc[0]}} {{!!otcUserInfo[userInfo.userId] && formatDateDuBai(otcUserInfo[userInfo.userId].registerTime)}}
              </dd>
              <dt>{{userInfo.userId}}</dt>
            </dl>
          </div>
          <!-- {/* 邮箱绑定 */} -->
          <div class="setting-item-list">
            <dl class="email-on"
                v-if="!!userInfo.emailBinded" />
            <dl class="email-off"
                v-else />
            <dl>
              <dt>{{Settings.email.name}}</dt>
              <dd>{{Settings.email.desc}}</dd>
              <dt v-if="!!userInfo.emailBinded">{{userInfo.emailBinded}}</dt>
              <!-- 现在用邮箱注册，肯定是绑定了邮箱的，也没找到绑邮箱的页面 -->
              <!-- <dt v-else>
                <a :href="`${tulipexUrl}/u/email?returnUrl=/member`">{{Settings.binding}}</a>
              </dt> -->
            </dl>
          </div>
          <!-- Google验证 -->
          <div class="setting-item-list">
            <dl class="google-on"
                v-if="!!userInfo.googleBinded" />
            <dl class="google-off"
                v-else />
            <dl>
              <dt>{{Settings.google.name}}</dt>
              <dd />
              <dt v-if="!!userInfo.googleBinded">
                <span>{{Settings.binded}}</span>
                <a :href="`${tulipexUrl}/u/unbindGoogle?returnUrl=/member`">{{Settings.unbundling}}</a>
              </dt>
              <dt v-else>
                <a :href="`${tulipexUrl}/u/google?returnUrl=/member`">{{Settings.unbounded}}</a>
              </dt>
            </dl>
          </div>
          <!-- {/* 登录密码 */} -->
          <div class="setting-item-list">
            <dl class="password-on" />
            <dl>
              <dt>{{Settings.login.name}}</dt>
              <dd />
              <dt>
                <span>{{Settings.beenSet}}</span>
                <a :href="`${tulipexUrl}/u/loginPwd?returnUrl=/member`">{{Settings.edit}}</a>
              </dt>
            </dl>
          </div>
          <!-- {/* 资金密码 */} -->
          <div class="setting-item-list">
            <dl class="fundspwd-on"
                v-if="!!userInfo.secertStatus" />
            <dl class="fundspwd-off"
                v-else />
            <dl>
              <dt>{{Settings.funds.name}}</dt>
              <dd />
              <dt v-if="!!userInfo.secertStatus">
                <span>{{Settings.beenSet}}</span>
                <a :href="`${tulipexUrl}/u/fundPwd?returnUrl=/member`">{{Settings.edit}}</a>
              </dt>
              <dt v-else>
                <a :href="`${tulipexUrl}/u/fundPwd?returnUrl=/member`">{{Settings.notSet}}</a>
              </dt>
            </dl>
          </div>
        </div>
      </div>

      <!-- {/* KYC */} -->
      <div class="setting-item">
        <div class="item-title">
          <div class="title">{{Settings.identityTitle}}</div>
          <div class="placeholder">{{Settings.kycPlaceholder}}</div>
        </div>
        <div class="setting-item-content">
          <!-- {/* C1 */} -->
          <div class="setting-item-list">
            <dl class="C1-on"
                v-if="!!userInfo.c1Status" />
            <dl class="C1-off"
                v-else />
            <dl>
              <dt>{{Settings.c1.name}}</dt>
              <dd />
              <!-- null未申请，0审核中，1已通过， 2被拒绝 -->
              <dt v-if="[0,1].includes(userInfo.c1Status)">
                <el-popover placement="top-start"
                            width="400"
                            trigger="hover">
                  <div class="content">
                    <div class="title">{{Settings.c1Title}}</div>
                    <div class="conItem">
                      <dl>
                        <dt>{{Settings.userKey.name}}:</dt>
                        <dd>{{userInfo.realName}}</dd>
                      </dl>
                      <dl>
                        <dt>{{Settings.userKey.country}}:</dt>
                        <dd>{{locale === 'zh_cn' ? userInfo.nationalName : userInfo.nationalEnName}}</dd>
                      </dl>
                      <dl>
                        <dt>{{Settings.userKey.docuType}}:</dt>
                        <dd>{{!!userInfo && [ { name: Settings.idCard,value: 1 }, { name: Settings.passport,value: 2 }, { name: Settings.driver,value: 3 } ].find(x => x.value === userInfo.credential) ? [ { name: Settings.idCard,value: 1 }, { name: Settings.passport,value: 2 }, { name: Settings.driver,value: 3 } ].find(x => x.value === userInfo.credential).name : ''}}</dd>
                      </dl>
                      <dl>
                        <dt>{{Settings.userKey.docuNum}}:</dt>
                        <dd>{{userInfo.idNumber|addMosaic(8)}}</dd>
                      </dl>
                    </div>

                  </div>
                  <el-button class="viewBtn"
                             slot="reference">{{Settings.certified}}</el-button>
                </el-popover>
              </dt>
              <!-- c1被拒绝 -->
              <dt v-else-if="userInfo.c1Status === 2">
                <a :href="`${tulipexUrl}/u/c1Auth?returnUrl=/member`">{{Settings.edit}}</a>
              </dt>
              <!-- c1未设置 -->
              <dt v-else-if="userInfo.c1Status === null">
                <a :href="`${tulipexUrl}/u/c1Auth?returnUrl=/member`">{{Settings.notSet}}</a>
              </dt>

            </dl>
          </div>
          <!-- {/* C2 */} -->
          <div class="setting-item-list">
            <dl class="C2-on"
                v-if="!!userInfo.c2Status" />
            <dl class="C2-off"
                v-else />
            <dl>
              <dt>{{Settings.c2.name}}</dt>
              <dd />
              <!-- c1没通过不能申请c2, C2拒绝，C1有一次修改的机会-->
              <dt v-if="userInfo.c1Status!==1">
                <span :style="{ marginRight: '0px' }"
                      style="color:#6aa0ff"
                      @click="onC1NotPass(Settings.c1Certify)">{{userInfo.c2Status === 2 ? Settings.AuthFail[0] : Settings.notSet}}</span>
              </dt>
              <!-- c1通过了，c2没申请 -->
              <dt v-else-if="userInfo.c2Status === null">
                <a :href="`${tulipexUrl}/u/c2Auth?returnUrl=/member`">{{Settings.notSet}}</a>
              </dt>
              <!-- 审核中 -->
              <dt v-else-if="userInfo.c2Status === 0">
                <span :style="{ marginRight: '0px' }">{{Settings.pending}}</span>
              </dt>

              <!-- 拒绝 -->
              <dt v-else-if="userInfo.c2Status === 2">
                <a :href="`${tulipexUrl}/u/c2Auth?returnUrl=/member`">
                  {{Settings.AuthFail[1]}}
                </a>
              </dt>
              <!-- 通过 -->
              <dt v-else-if="userInfo.c2Status === 1">
                <span :style="{ marginRight: '0px' }">{{Settings.beenSet}}</span>
              </dt>
            </dl>
          </div>
        </div>
      </div>
      <!-- 你需要通过kyc认证才能添加支付方式 弹框 -->
      <PayKYCModal :display="modalDisplayPayKyc"
                   :close="toDisabledPayKyc" />
      <!-- 添加支付方式 弹框 -->
      <AddPayTypeModal :realName="userInfo.realName||''"
                       :display="modalDisplayAddType"
                       :close="toDisabledAddType"
                       :ok="addPayTypeHandle" />
      <!-- {/* 支付方式 */} -->
      <div class="setting-item">
        <div class="item-title">
          <div class="title">{{Settings.payType}}</div>
          <div class="placeholder">{{Settings.payPlaceholder}}</div>
          <div class="info addType">
            <i @click="toEnabledAddType"
               :style="{cursor:'pointer'}">+ {{Settings.addPayType}}</i>
          </div>
        </div>
        <div class="setting-item-content">
          <div class="setting-item-list"
               v-for="(item, index) in payList"
               :key="index">
            <dl class="pay-1-on"
                v-if="item.typeCode === 1" />
            <dl class="pay-2-on"
                v-if="item.typeCode === 2" />
            <dl class="pay-3-on"
                v-if="item.typeCode === 3" />
            <dl class="pay-4-on"
                v-if="item.typeCode === 4" />
            <dl class="pay-5-on"
                v-if="item.typeCode === 5" />
            <dl>
              <dt v-if="item.typeCode !== 4">{{item.account}}</dt>
              <dt v-else>{{item.account|addMosaic(10)}}</dt>
              <dd>{{item.accountName}} {{item.openBank}} {{item.openSubbranch}}</dd>
              <dt>
                <label @click="removePayItem(item.account,item.accountName)"
                       :style="{ marginRight: '50px' }">{{Settings.delete}}</label>
                <el-switch v-model="item.payStatus"
                           @change="changePayStatus(item.account,item.accountName,item.payStatus)"
                           :inactive-value="0"
                           :active-value="1"
                           active-color="#6aa0ff"
                           inactive-color="#ecebf2">
                </el-switch>
              </dt>
            </dl>
          </div>
          <div v-if="!payList || !payList.length"
               class="no-data">{{Settings.noDataPays}}</div>
        </div>
      </div>

      <!-- {/* 屏蔽名单 */} -->
      <div class="setting-item">
        <div class="item-title">
          <div class="title">{{Settings.blockedList}}</div>
          <div class="placeholder">{{Settings.nowayPlaceholder}}</div>

        </div>
        <div class="setting-item-content">
          <div class="setting-item-list"
               v-for="(item, index) in defriendList.otcDefriendList"
               :key="index">
            <dl class="avatar-on">
              <Avatar :name="item.defrindName|firstUpperChar" />
            </dl>
            <dl>
              <dt>{{item.defrindName}}</dt>
              <dd>{{Settings.blockedDate.replace(/%s/, formatDateDuBai(item.createDate))}}</dd>
              <dt>
                <label @click="removeBlockedItem(item.defriendId)">
                  {{Settings.removeBloked}}
                </label>
              </dt>
            </dl>
          </div>
          <div v-if="!defriendList || !defriendList.otcDefriendList || !defriendList.otcDefriendList.length"
               class="no-data">{{Settings.noDataNames}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/** 个人中心页 **/
import { mapState, mapMutations, mapActions } from 'vuex';
import * as memberType from '~/store/modules/member/type';
import Configs from '~/common/config';
import SetNicknameModal from '~/components/Modal/SetNicknameModal.vue';
import AddPayTypeModal from '~/components/Modal/AddPayTypeModal.vue';
import PayKYCModal from '~/components/Modal/PayKYCModal.vue';
import Avatar from '~/components/Avatar.vue';
import tools from '~/utils';
export default {
  asyncData() {},
  data() {
    return {
      bankEnable: true, //暂时无用
      modalDisplaySetNickname: false, //设置昵称模态框是否显示
      tulipexUrl: Configs.DEFAULT.TULIPEX_URL, //tulipex网址
      modalDisplayAddType: false, //新增支付方式模态框
      modalDisplayPayKyc: false, //没有通过kyc认证绑定支付的模态框
      currPage: 1,
      loading: false, // 各种loading通用
      loadingPage: true, // 页面加载loading
    };
  },
  components: {
    SetNicknameModal, //设置昵称模态框
    AddPayTypeModal, //新增支付方式模态框
    PayKYCModal, //没有通过kyc认证绑定支付的模态框
    Avatar,
  },
  async created() {
    this.loadingPage = true;
    await this.getUserInfo();
    let userId = !!this.userInfo.userId ? this.userInfo.userId : '';
    await this.getOtcUserInfoByUserId({ userId });
    this.loadingPage = false;
    // 获取c1/c2认证状态 不要这个来，状态直接取userInfo里面的
    // await this.getKycStatus();
    // 支付列表：微信/支付宝/银行卡/Paypal/ePay
    //await this.getPayTypeList();
    // 支付方式列表
    await this.getPayList();
    // 屏蔽列表
    await this.getDefriendList({
      pageNo: this.currPage, //当前页
      pageSize: 10, //每页大小
    });
  },
  async updated() {
    // 判断是否有昵称，没昵称弹出框框
    if (this.isLogin && this.userInfo && !this.userInfo.nickName && !this.otcUserNickName) {
      this.modalDisplaySetNickname = true;
    } else {
      this.modalDisplaySetNickname = false;
    }
    if (!this.userInfo.userId && process.browser) {
      await this.getUserInfo();
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      locale: state => state.locale,
      isLogin: state => state.isLogin,
      Settings: state => state.i18n.App.Settings,
      ErrCode: state => state.i18n.App.ErrCode,
      langHeader: state => state.i18n.App.Header,
      userInfo: state => state.member.userInfo,
      otcUserInfo: state => state.member.otcUserInfo,
      otcUserNickName: state => state.member.otcUserNickName,
      payMethodUpload: state => state.member.payMethodUpload,
      // payTypeList: state => state.member.payTypeList,
      payList: state => state.member.payList,
      updatePayMethodResult: state => state.member.updatePayMethod,
      addPayMethodResult: state => state.member.addPayMethod,
      deletePayMethodResult: state => state.member.deletePayMethod,
      defriendList: state => state.member.defriendList,
      removeDefriendResult: state => state.member.removeDefriend,
    }),
    safelv() {
      // 安全级别，绑了资金密码是中，绑了谷歌验证是高
      let i = 0;
      const u = this.userInfo || {};
      if (u.secertStatus) {
        i++;
      }
      if (u.googleBinded) {
        i++;
      }
      return this.Settings.safelvChose[i];
    },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions({
      getUserInfo: memberType.GET_USER_INFO_ACTIONS,
      getOtcUserInfoByUserId: memberType.GET_OTC_USER_INFO_ACTIONS,
      getKycStatus: memberType.GET_KYC_STATUS_ACTIONS,
      setNickname: memberType.SET_NICKNAME_ACTIONS,
      // verifySecert: memberType.VERIFY_SECERT_ACTIONS,
      setPayUpload: memberType.SET_UPLOAD_ACTIONS,
      // getPayTypeList: memberType.GET_PAY_TYPE_ACTIONS,
      getPayList: memberType.GET_PAY_LIST_ACTIONS,
      updatePayMethod: memberType.UPDATE_PAY_METHOD_ACTIONS,
      // addPayMethod: memberType.ADD_PAY_METHOD_ACTIONS,
      deletePayMethod: memberType.DELETE_PAY_METHOD_ACTIONS,
      getDefriendList: memberType.GET_DEFRIEND_LIST_ACTIONS,
      removeDefriend: memberType.REMOVE_DEFRIEND_ACTIONS,
    }),
    formatDateDuBai(str) {
      let time = Number(str);
      if (String(str).length < 11) {
        time *= 1000;
      }
      return tools.formatDateDuBai(time);
    },
    onC1NotPass(str) {
      this.$alert(str);
    },
    // 用户设置昵称提交
    async setNicknameHandle(name) {
      this.loading = true;
      if (`${name}`.trim() === 'null') {
        this.$message.error(`${this.Settings.nickNameRule}`);
        return;
      }
      await this.setNickname({ nickname: name });
      await this.getUserInfo();
      let userId = !!this.userInfo.userId ? this.userInfo.userId : '';
      await this.getOtcUserInfoByUserId({ userId });

      this.loading = false;
      this.modalDisplaySetNickname = false;
    },
    // 添加支付方式
    async addPayTypeHandle() {
      this.AddPayTypeModal = false;
      const res = await this.getPayList();
      if (res && res.code !== 200) {
        this.$message.error(this.ErrCode[res.code] || `${res.code}`);
      }
    },
    // 更新支付状态
    async changePayStatus(account, accountName, payStatus) {
      await this.updatePayMethod({
        account: account, //账号
        accountName: accountName,
        status: payStatus,
      });
      await this.getPayList();
    },
    toEnabledAddType() {
      // this.modalDisplayAddType = true
      // return;
      if (!this.userInfo.secertStatus) {
        this.$message.error(this.Settings.messageErr[0]);
        return;
      }
      //c2IsCerting will be delete
      if (!!this.userInfo.c1Status && !!this.userInfo.c2Status) {
        this.modalDisplayAddType = true;
        return;
      }
      this.modalDisplayPayKyc = true;
    },
    toDisabledAddType() {
      this.modalDisplayAddType = false;
    },
    toDisabledPayKyc() {
      this.modalDisplayPayKyc = false;
    },
    // 取消屏蔽
    async removeBlockedItem(userId) {
      await this.removeDefriend({
        defrindID: userId,
      });
      await this.getDefriendList({
        pageNo: this.currPage, //当前页
        pageSize: 10, //每页大小
      });
    },
    removePayItem(account, accountName) {
      this.$confirm(this.Settings.messageErr[1])
        .then(async _ => {
          await this.deletePayMethod({
            account: account,
            accountName: accountName,
          });
          await this.getPayList();
        })
        .catch(_ => {});
    },
  },
};
</script>
<style lang="scss">
.setting-tab {
  dt {
    .el-loading-mask {
      z-index: 10;
    }
    .el-loading-spinner {
      text-align: right;
    }
  }
}
</style>

<style lang="scss" scoped>
.setting-tab {
  width: 1180px;
  // height:2100px;
  margin: 58px auto 0 auto;
  padding-bottom: 120px;

  .bread-box {
    padding: 30px 0 20px 0;
  }
  .setting-item-box {
    background-color: #fff;
    padding-bottom: 40px;
  }
  .setting-item {
    padding-top: 44px;
    & > .item-title {
      display: flex;
      align-items: center;
      position: relative;
      padding: 0 20px;
      margin: 0;
      line-height: 24px;
      .title {
        color: #354989;
        font-size: 16px;
        font-weight: bold;
        flex: none;
        min-width: 118px;
        padding-right: 10px;
      }
      .placeholder {
        flex: auto;
        font-size: 14px;
        color: #a8afcd;
      }
      .info {
        font-size: 14px;
        color: #7d86ac;
        text-align: right;
        margin-right: 40px;
        flex: none;
        i {
          font-style: normal;
          color: #6aa0ff;
          font-size: 14px;
        }
        &.addType {
          i {
            font-size: 12px;
          }
        }
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 22px;
        background: #5693ff;
      }
    }
    span {
      margin-right: 100px;
      font-size: 12px;
      color: #6aa0ff;
      cursor: pointer;
    }
    .float-right {
      display: inline-block;
      float: right;
      clear: both;
    }
    .setting-item-content {
      padding: 22px 60px 0;

      > div {
        border-bottom: 1px solid #f5f6f9;
      }
      .no-data {
        text-align: center;
        font-size: 14px;
        color: #d3d8e6;
        background-color: #f9fafd;
        padding: 30px 0;
      }
    }
    label {
      cursor: pointer;
      font-size: 12px;
      color: #6aa0ff;
    }
  }
  .setting-item-list {
    display: flex;
    // justify-content: space-between;
    justify-content: flex-start;
    align-items: center;
    padding: 32px 0;
    dl {
      position: relative;
      line-height: 24px;
      display: flex;
      flex: auto;
      &:first-of-type {
        flex: none;
        width: 40px;
        margin-right: 40px;
        padding-top: 42px;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 44px;
          height: 44px;
        }
      }
      dt {
        display: inline-block;
        min-width: 80px;
        width: 230px;
        font-weight: 600;
        text-align: left;
        font-size: 14px;
        color: #354989;
        flex: none;
        margin-right: 20px;
        &:last-child {
          width: 260px;
          margin-right: 0;
          text-align: right;
          font-weight: normal;
        }
        span {
          color: #c2c0c6;
          margin-right: 30px;
        }
        a {
          font-size: 12px;
          color: #5693ff;
        }
      }
      dd {
        display: inline-block;
        font-size: 12px;
        flex: auto;

        color: #a8afcd;
        &.funds-edit {
          a {
            display: block;
            text-align: right;

            label {
              display: block;
            }
          }
        }
        span {
          color: #c2c0c6;
        }
      }

      &.nickname-on::before {
        background: url('~/assets/images/settings/nickname-on.png') center / cover;
      }
      &.nickname-off::before {
        background: url('~/assets/images/settings/nickname-off.png') center / cover;
      }

      &.level-on::before {
        background: url('~/assets/images/settings/level-on.png') center / cover;
      }

      &.account-on::before,
      &.account-off::before {
        background: url('~/assets/images/settings/account-on.png') center / cover;
      }

      &.email-on::before,
      &.email-off::before {
        background: url('~/assets/images/settings/email-on.png') center / cover;
      }

      &.api-on::before,
      &.api-off::before {
        background: url('~/assets/images/settings/api-on.png') center / cover;
      }

      &.tel-on::before {
        background: url('~/assets/images/settings/tel-on.png') center / cover;
      }
      &.tel-off::before {
        background: url('~/assets/images/settings/tel-off.png') center / cover;
      }

      &.C1-on::before {
        background: url('~/assets/images/settings/C1-on.png') center / cover;
      }
      &.C1-off::before {
        background: url('~/assets/images/settings/C1-off.png') center / cover;
      }

      &.C2-on::before {
        background: url('~/assets/images/settings/C2-on.png') center / cover;
      }
      &.C2-off::before {
        background: url('~/assets/images/settings/C2-off.png') center / cover;
      }

      &.password-on::before {
        background: url('~/assets/images/settings/password-on.png') center / cover;
      }
      &.password-off::before {
        background: url('~/assets/images/settings/password-off.png') center / cover;
      }

      &.fundspwd-on::before {
        background: url('~/assets/images/settings/fundspwd-on.png') center / cover;
      }
      &.fundspwd-off::before {
        background: url('~/assets/images/settings/fundspwd-off.png') center / cover;
      }

      &.google-on::before {
        background: url('~/assets/images/settings/Google-verifier-on.png') center / cover;
      }
      &.google-off::before {
        background: url('~/assets/images/settings/Google-verifier-off.png') center / cover;
      }

      &.order-on::before {
        background: url('~/assets/images/settings/User-work-order-on.png') center / cover;
      }
      &.order-off::before {
        background: url('~/assets/images/settings/User-work-order-off.png') center / cover;
      }

      &.pay-1-on::before {
        background: url('~/assets/images/icon/icon-PayPal.png') center / cover;
      }
      &.pay-2-on::before {
        background: url('~/assets/images/icon/icon-alipay.png') center / cover;
      }
      &.pay-3-on::before {
        background: url('~/assets/images/icon/icon-wechat.png') center / cover;
      }
      &.pay-4-on::before {
        background: url('~/assets/images/icon/icon-bank.png') center / cover;
      }
      &.pay-5-on::before {
        background: url('~/assets/images/icon/icon-ePay.png') center / cover;
      }
    }
    .avatar-on {
      padding-left: 0px !important;
      padding-top: 0px !important;
      .avatar-container {
        height: 40px;
        width: 40px;
        line-height: 40px;
      }
    }
    .LV1 {
      width: 20px;
      height: 20px;
      margin-top: 3px;
      display: inline-block;
      margin-right: 0px;
      background: url('~/assets/images/icon/icon-LV1.png') center / cover;
    }
    .LV2 {
      width: 20px;
      height: 20px;
      margin-top: 3px;
      display: inline-block;
      margin-right: 0px;
      background: url('~/assets/images/icon/icon-LV2.png') center / cover;
    }
    .LV3 {
      width: 20px;
      height: 20px;
      margin-top: 3px;
      display: inline-block;
      margin-right: 0px;
      background: url('~/assets/images/icon/icon-LV3.png') center / cover;
    }
  }
}
.viewBtn {
  color: #6aa0ff;
  border: none;
  padding: 0;
  font-size: 12px;
  margin-right: -30px;
  &:focus,
  &:hover,
  &:active {
    background: none;
    border: none;
  }
}
.content {
  margin: -12px;
  margin-bottom: 0;
  .title {
    padding: 16px 0;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
  }
  .conItem {
    padding-top: 16px;
    padding-left: 24px;
    margin-left: 12px;
  }
  dl {
    display: flex;
    justify-content: flex-start;
    padding: 8px 0;
    dt {
      width: 60px;
    }
    dd {
      margin-left: 30px !important;
      word-break: break-all;
      max-width: 200px;
    }
  }
}
</style>
