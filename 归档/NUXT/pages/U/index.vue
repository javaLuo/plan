<template>
  <user-main>
    <!-- 基本信息 -->
    <template slot="basicInfo">
      <div class="content">
        <h1 title="title">{{Settings.baseTitle}}</h1>
        <!-- User UID -->
        <ul class="set-item uid">
          <li class="col-left">
            <dl>
              <dt>{{Settings.account.name}}</dt>
              <dd>{{Settings.account.nDesc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span v-loading="uloading"
                  class="handler">{{uloading ? '' : userInfo.userId}}</span>
          </li>
        </ul>
        <!-- User level -->
        <ul class="set-item level">
          <li class="col-left">
            <dl>
              <dt>{{Settings.account.level}}</dt>
              <dd>{{Settings.account.lDesc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span v-loading="uloading"
                  class="handler">
              <i :class="[levIcon, level[userInfo.userLevel]]"></i>
            </span>
          </li>
        </ul>
        <!-- Login password -->
        <ul class="set-item pwd">
          <li class="col-left">
            <dl>
              <dt>{{Settings.login.name}}</dt>
              <dd>{{Settings.login.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span class="handler">
              <nuxt-link class="edit"
                         to="/u/loginPwd">{{Settings.edit}}</nuxt-link>
            </span>
          </li>
        </ul>
        <!-- Fund password -->
        <ul class="set-item fundpwd">
          <li class="col-left">
            <dl>
              <dt>{{Settings.funds.name}}</dt>
              <dd>{{Settings.funds.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span class="handler">
              <nuxt-link :class="{edit: !!userInfo.secertStatus}"
                         to="/u/fundPwd">{{!!userInfo.secertStatus ? Settings.edit : Settings.notSet}}</nuxt-link>
            </span>
          </li>
        </ul>
      </div>
    </template>
    <!-- 安全设置 -->
    <template slot="security">
      <div class="content">
        <h1 title="title">{{Settings.secuTitle}}</h1>
        <!-- mailbox binding -->
        <ul class="set-item mailbox">
          <li class="col-left">
            <dl>
              <dt>{{Settings.email.name}}</dt>
              <dd>{{Settings.email.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span v-loading="uloading"
                  class="handler">
              {{emailed}}
            </span>
          </li>
        </ul>
        <!-- Google Validator -->
        <ul class="set-item goole">
          <li class="col-left">
            <dl>
              <dt>{{Settings.google.name}}</dt>
              <dd>{{Settings.google.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span class="handler"
                  v-if="userInfo.googleBinded">
              <nuxt-link class="edit"
                         to="/u/unbindGoogle">{{Settings.unbundling}}</nuxt-link>
            </span>
            <span class="handler"
                  v-else>
              <nuxt-link to="/u/google">{{Settings.unbounded}}</nuxt-link>
            </span>
          </li>
        </ul>
        <h1 class="title">{{Settings.identityTitle}}</h1>
        <!-- C1 certification -->
        <ul class="set-item c1">
          <li class="col-left">
            <dl>
              <dt>{{Settings.c1.name}}</dt>
              <dd>{{Settings.c1.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <span v-if="userInfo.c1Status === 1">
              <el-popover placement="top"
                          trigger="hover"
                          ref="c1-popover"
                          popper-class="c1Info-popover">
                <div class="c1Info">
                  <h3>{{Settings.c1Title[0]}}</h3>
                  <div class="con">
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
                      <dd>{{docuType(userInfo.credential)}}</dd>
                    </dl>
                    <dl>
                      <dt>{{Settings.userKey.docuNum}}:</dt>
                      <dd>{{idNumber}}</dd>
                    </dl>
                  </div>
                </div>
              </el-popover>
              <span class="view edit"
                    v-popover:c1-popover>{{Settings.certified}}</span>
            </span>
            <span class="handler"
                  v-else-if="userInfo.c1Status === 2">
              <el-popover placement="top"
                          trigger="hover"
                          popper-class="c1Info-popover">
                <div class="c1Info">
                  <h3>{{Settings.c1Title[1]}}</h3>
                  <div class="con">
                    {{userInfo.reason}}
                  </div>
                </div>
                <nuxt-link class="view edit"
                           slot="reference"
                           to="/u/C1Auth">{{Settings.edit}}</nuxt-link>
              </el-popover>
            </span>
            <span class="handler"
                  v-else>
              <nuxt-link to="/u/C1Auth">{{Settings.certify}}</nuxt-link>
            </span>
          </li>
        </ul>
        <!-- C2 certification -->
        <ul class="set-item c2">
          <li class="col-left">
            <dl>
              <dt>{{Settings.c2.name}}</dt>
              <dd>{{Settings.c2.desc}}</dd>
            </dl>
          </li>
          <li class="col-right">
            <!-- C1未认证，C2提示 -->
            <span class="handler"
                  v-if="!userInfo.c1Status && userInfo.c2Status === null">
              <a @click="noSetWarn">{{Settings.certify}}</a>
            </span>
            <!-- C1认证通过，C2未认证 -->
            <span class="handler"
                  v-else-if="userInfo.c1Status === 1 && userInfo.c2Status === null">
              <nuxt-link to="/u/C2Auth">{{Settings.certify}}</nuxt-link>
            </span>
            <!-- C2待审核 -->
            <span class="handler"
                  v-else-if="userInfo.c1Status === 1 && userInfo.c2Status === 0">
              <a class="disabled">{{Settings.pending}}</a>
            </span>
            <!-- C2拒绝，C1可修改一次 -->
            <span class="handler"
                  v-else-if="userInfo.c1Status === 2 && userInfo.c2Status === 2">
              <a class="disabled">{{Settings.AuthFail[2]}}</a>
              <em class="err">{{Settings.AuthFail[0]}}</em>
            </span>
            <!-- C2拒绝，重新提交审核资料 -->
            <span class="handler"
                  v-else-if="userInfo.c1Status === 1 && userInfo.c2Status === 2">
              <nuxt-link class="edit"
                         to="/u/C2Auth">{{Settings.AuthFail[2]}}</nuxt-link>
              <em class="err">{{Settings.AuthFail[1]}}</em>
            </span>
            <!-- 已认证 -->
            <span class="handler"
                  v-else>
              <a class="disabled">{{Settings.finish}}</a>
            </span>
          </li>
        </ul>
      </div>
    </template>
    <!-- API -->
    <template slot="tradeApi">
      <div class="content">
        <h1 class="title">
          {{Settings.apiTit}}
          <nuxt-link to="/ApiWeb/Trade-API"
                     target="_blank">API Guide</nuxt-link>
        </h1>
        <el-form class="tradeApi"
                 :model="apiForm"
                 ref="apiForm">
          <el-form-item :label="Settings.funds.name"
                        prop="key"
                        :rules="[
                          { validator: validFundPass, trigger: 'change'}
                        ]">
            <el-input v-model="apiForm.key"
                      type="password"
                      key="apiForm.key"
                      :placeholder="FundsPwd.placeholder.setFundsPwd"
                      auto-complete="off"
                      maxlength="14">
            </el-input>
            <el-button class="btn-api-key"
                       :loading="loading"
                       @click="handlerApiKey">{{Settings.privateKey}}</el-button>
          </el-form-item>
        </el-form>
        <div class="apiInfo"
             v-if="hasApi">
          <dl>
            <dt>{{Settings.apiKey}}</dt>
            <dd>{{apiInfo.key}}</dd>
          </dl>
          <dl>
            <dt>{{Settings.apiSign}}</dt>
            <dd>{{apiInfo.sign}}</dd>
          </dl>
        </div>
      </div>
    </template>
    <!-- 烘焙记录页 -->
    <template slot="bake">
      <BakeHistorySlot />
    </template>
    <template slot="invitation">
      <invitation />
    </template>
  </user-main>
</template>

<script>
import Storage from '~/utils/storage';
import { mapState, mapMutations, mapActions } from 'vuex';
import { GET_USER_INFO } from '~/store/modules/user/type';
import { GET_APIKEY } from '~/store/modules/settings/type';

import UserMain from '~/components/UserMain.vue';
import BakeHistorySlot from './BakeHistorySlot.vue';
import Invitation from './Invitation';
export default {
  components: {
    UserMain,
    BakeHistorySlot,
    Invitation,
  },
  data() {
    return {
      levIcon: 'iconfont',
      level: {
        LV0: 'icon-V3',
        LV1: 'icon-V',
        LV2: 'icon-V1',
        LV3: 'icon-V2',
      },
      loading: false,
      dialogApiVisible: false,
      apiForm: {
        key: null,
      },
      apiInfo: {
        key: '',
        sign: '',
      },
      hasApi: false,
      uloading: true,
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      isLogin: state => state.isLogin,
      Prompt: state => state.i18n.App.Prompt,
      FundsPwd: state => state.i18n.App.FundsPwd,
      Settings: state => state.i18n.App.Settings,
      userInfo: state => state.user.userInfo,
      apiKey: state => state.settings.apiKey,
      ErrorCode: state => state.i18n.App.ErrorCode,
      section: state => state.settings.section,
    }),

    idNumber() {
      if (this.userInfo.idNumber) {
        let idNumber = this.userInfo.idNumber;
        return idNumber.substring(0, 2) + '******' + idNumber.substring(idNumber.length - 3);
      }
    },
    emailed() {
      if (this.userInfo.emailBinded) {
        const _index = this.userInfo.emailBinded.indexOf('@');
        const str = this.userInfo.emailBinded;
        return str.substring(0, 4) + '*****' + str.substring(_index);
      }
    },
  },
  watch: {
    section() {
      if (this.section !== 'tradeApi') {
        this.hasApi = false;
        this.apiForm.key = '';
      }
    },
  },
  async created() {
    // if (!this.isLogin) {
    //   this.$router.push('/u/login');
    // }
    await this.getUserData();
  },

  methods: {
    ...mapActions({
      getUserInfo: GET_USER_INFO,
      getApiKey: GET_APIKEY,
    }),
    async getUserData() {
      const res = await this.getUserInfo();
      if (res && res.code === 200) {
        this.uloading = false;
      } else {
        this.uloading = true;
        this.$message.error(this.ErrorCode[res.code]);
      }
    },

    noSetWarn() {
      this.$message.warning(this.Settings.c1Certify);
    },
    notSetFund() {
      if (!this.userInfo.secertStatus) {
        this.$message.error(this.FundsPwd.title);
        return;
      }
      this.dialogApiVisible = true;
    },
    docuType(val) {
      if (!val) {
        return '';
      }
      switch (val) {
        case 1:
          return this.Settings.certifyList[0];
          break;
        case 2:
          return this.Settings.certifyList[1];
          break;
        case 3:
          return this.Settings.certifyList[2];
          break;
        default:
          break;
      }
    },
    validFundPass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.FundsPwd.placeholder.fundsPwd));
      } else {
        if (/^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){8,14}$/i.test(value) && value.indexOf(' ') === -1) {
          callback();
        } else {
          callback(new Error(this.FundsPwd.fundsPwdUnvalid));
        }
      }
      callback();
    },
    async handlerApiKey() {
      this.$refs.apiForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          const res = await this.getApiKey({
            secretkey: this.apiForm.key,
          });
          if (res && res.code === 200) {
            this.apiInfo.key = res.data.apikey;
            this.apiInfo.sign = res.data.signature;
            this.$refs.apiForm.resetFields();
            this.hasApi = true;
            this.loading = false;
          } else {
            this.loading = false;
            this.hasApi = false;
            this.$message.error(this.ErrorCode[res.code]);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~assets/css/_theme-conf';
.el-loading-mask {
  min-height: none;
}
.content {
  min-height: 480px;
  padding: 22px 30px 56px;
  @include bgPair(background-color);
}
h1 {
  font-size: 18px;
  font-weight: 500;
  @include fontPair(color);
  a {
    float: right;
    color: #6aa0ff;
  }
}
.set-item {
  font-size: 14px;
  padding: 28px 0 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid;
  @include cutLinePair(border-bottom-color);
  &:first-of-type {
    padding-top: 44px;
  }
  & + h1 {
    margin-top: 56px;
  }
  .col-left {
    display: inline-block;
    font-weight: 400;
    @include fontPair(color);

    &:before {
      content: '';
      width: 36px;
      height: 36px;
      margin-right: 20px;
      display: inline-block;
      vertical-align: middle;
    }
    dl {
      display: inline-block;
      vertical-align: middle;
      dd {
        font-size: 12px;
        @include tipsPair(color);
      }
    }
  }
  .col-right {
    display: flex;
    justify-content: space-between;
    .intro {
      font-style: normal;
      font-size: 12px;
      color: $light004;
    }
    .view {
      color: #fff;
      cursor: pointer;
      border: 1px solid;
      @include interactionPair(border-color);
      @include interactionPair(background-color);
      display: inline-block;
      border-radius: 14px;
      line-height: 28px;
      text-align: center;
      min-width: 96px;
      padding: 0 14px;
      font-size: 12px;
      &.edit {
        border: 1px solid;
        @include interactionPair(color);
        @include bgPair(background-color);
        @include interactionPair(border-color);
      }
    }
    .handler {
      min-width: 60px;
      text-align: right;
      @include fontPair(color);
      a {
        color: #fff;
        border: 1px solid;
        @include interactionPair(border-color);
        @include interactionPair(background-color);
        display: inline-block;
        border-radius: 14px;
        line-height: 28px;
        text-align: center;
        min-width: 96px;
        padding: 0 14px;
        font-size: 12px;
        &.edit {
          border: 1px solid;
          @include interactionPair(color);
          @include bgPair(background-color);
          @include interactionPair(border-color);
        }
        &.disabled {
          @include fontPair(color);
          @include borderPair(border-color);
          @include borderPair(background-color);
        }
      }
      .err {
        display: block;
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        margin-top: 4px;
      }
    }
    .handlerInfo {
      font-size: 12px;
      color: $light005;
    }
  }
}
.uid {
  .col-left {
    &:before {
      background: url('~static/images/uid.png') center center/cover;
    }
  }
}
.level {
  .col-left {
    &:before {
      background: url('~static/images/level.png') center center/cover;
    }
  }
  .col-right {
    .handler {
      vertical-align: middle;
      i {
        color: $lightButtonColor;
      }
    }
  }
}
.mailbox {
  .col-left {
    &:before {
      background: url('~static/images/email.png') center center/cover;
    }
  }
}
.pwd {
  .col-left {
    &:before {
      background: url('~static/images/password.png') center center/cover;
    }
  }
}
.fundpwd {
  .col-left {
    &:before {
      background: url('~static/images/fundpwd.png') center center/cover;
    }
  }
}
.c1 {
  .col-left {
    &:before {
      background: url('~static/images/c1.png') center center/cover;
    }
  }
}
.c2 {
  .col-left {
    &:before {
      background: url('~static/images/c2.png') center center/cover;
    }
  }
}
.goole {
  .col-left {
    &:before {
      background: url('~static/images/google.png') center center/cover;
    }
  }
}
.c1Info {
  margin: -12px;
  margin-bottom: 0;
  @include fontPair(color);
  h3 {
    padding: 16px 0;
    text-align: center;
    font-weight: normal;
    border-bottom: 1px solid;
    @include fontPair(color);
    @include borderPair(border-bottom-color);
  }
  .con {
    padding: 0 24px;
    margin-top: 16px;
    line-height: 160%;
  }
  dl {
    display: flex;
    justify-content: flex-start;
    padding: 8px 0;
    dt {
      width: 130px;
      text-align: right;
    }
    dd {
      margin-left: 30px !important;
      word-wrap: break-word;
      width: 92px;
      flex: 1;
    }
  }
}

.apiInfo {
  width: 672px;
  dl {
    margin-top: 28px;
    dt {
      @include subFontPair(color);
      margin-bottom: 12px;
    }
    dd {
      font-size: 14px;
      font-weight: 500;
      line-height: 38px;
      text-indent: 17px;
      border-radius: 2px;
      @include fontPair(color);
      @include borderPair(background-color);
    }
  }
}
</style>


