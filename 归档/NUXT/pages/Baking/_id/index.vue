<template>
  <div class="container">
    <div class="bake-page">
      <!-- 头 -->
      <div :class="['head',{show: !pageLoading}]">
        <div class="boon">
          <span>
            <svg viewBox="25 25 50 50"
                 style="width:34px;height:34px;"
                 class="circular">
              <circle cx="50"
                      cy="50"
                      r="20"
                      fill="none"
                      class="path"></circle>
            </svg>
          </span>
          <span>--</span>
          <span>{{i18n.highest}} --</span>
          <span>{{i18n.lowest}} --</span>

        </div>
        <div class="title">
          <div class="logo">
            <img :src="logoSrc"
                 :alt="sourceData.name">
            <!-- <i :class="['token-logo', 'default-icon', sourceData.name]">
          </i> -->
          </div>
          <div class="name">
            {{sourceData.name}}
            <span>{{sourceData.asset}}</span>
          </div>
        </div>
        <div class="price">
          $ {{ziData.lastPrice}}
          <span :class="{red: ziData.change < 0}">{{ziData.change > 0 ? `+${ziData.change || '0'}%`: `${ziData.change || '0'}%`}}</span>
        </div>
        <div class="info">
          <span>{{i18n.highest}}</span>
          {{ziData.h}}
        </div>
        <div class="info">
          <span>{{i18n.lowest}}</span>
          {{ziData.l}}
        </div>
        <div style="flex: 1;min-width: 40px;"></div>
        <div class="clock">
          <span style="margin-right: 10px;">{{i18n.endDate}}:</span>
          <span v-if="sourceData.status !== 1">{{i18n.s[`s${sourceData.status}`] || '-'}}</span>
          <CountdownClock v-if="sourceData.status === 1"
                          :endDate="new Date(sourceData.endDate * 1000)" />
        </div>
      </div>
      <!-- 主要 -->
      <div :class="['boss',{'show': !pageLoading}]">
        <div class="l">
          <div class="info-box">
            <ul class="infos">
              <li>
                <div>{{i18n.year}}</div>
                <div class="green tobeShow"><span>{{sourceData.yearRate}}</span>%</div>
                <span class="tobeHide">--</span>
              </li>
              <li>
                <div>{{i18n.amount}}</div>
                <div class="transtop tobeShow"><i>{{i18n.qi[0]}}</i><span>{{sourceData.amountLimit}}</span><i>{{sourceData.asset || '-'}} {{i18n.qi[1]}}</i></div>
                <span class="tobeHide">--</span>
              </li>
              <li>
                <div>{{i18n.period}}</div>
                <div class="transtop tobeShow"><i>{{i18n.startDay[0]}}</i><span>{{sourceData.dayLimit || '-'}}</span><i>{{i18n.startDay[1]}}</i></div>
                <span class="tobeHide">--</span>
              </li>
            </ul>
            <div class="infos-add">{{i18n.mini}}</div>
            <div class="infos-last tobeShow">{{i18n.inmethod || '-'}}: <span>{{compoundI18n}}</span></div>
          </div>
          <div class="info-footer">
            <div>{{i18n.amount}}: <span>{{sourceData.orderInfo.total | moneyFormat}} {{sourceData.asset}}</span></div>
            <div>{{i18n.platform}}: <span>{{sourceData.orderInfo.interest | moneyFormat}} {{sourceData.asset}}</span></div>
          </div>
        </div>
        <div class="line"></div>
        <div class="r">
          <!-- 未登录 -->
          <template v-if="!isLogin">
            <img class="no-login"
                 src="~/assets/images/bake/no-login@2x.png"
                 alt="no-login" />
            <!-- <div class="infos">Available Balance：<span>99999.34452345 XTZ</span></div> -->
            <div class="infos"></div>
            <el-button type="primary"
                       @click="gotoLogin">{{i18n.logIn}}</el-button>
          </template>
          <!-- 登录 -->
          <template v-if="isLogin">
            <div class="t">
              <span>{{i18n.ava}}:</span>
              <span>{{money|toFixed8}} {{sourceData.asset}}</span>
              <span class="space"></span>
              <router-link :to="{ path: '/assets', query: { coin: sourceData.asset, type:'deposit'}}">
                {{i18n.deposit}}
              </router-link>
            </div>
            <div class="input-box">
              <div class="btn"
                   @click="onInputCut">
                <div class="line-row"></div>
              </div>
              <div :class="['input',{'error': errorInfo}]">
                <input type="text"
                       :value="inputValue"
                       @input="onInputChange" />
                <div class="allin"
                     @click="onAllIn">{{i18n.all}}</div>
              </div>
              <div class="btn"
                   @click="onInputAdd">
                <div class="line-row"></div>
                <div class="line-col"></div>
              </div>
            </div>
            <div class="error-box">{{errorInfo}}</div>
            <div class="price"
                 style="margin-top: 10px;">
              <span>{{i18n.actpay}}:</span>
              <span>{{inputValue | toFixed8}} {{sourceData.asset}}</span>
            </div>
            <div class="price"
                 style="margin-top:18px;">
              <span>{{i18n.actbak}}:</span>
              <span>{{inputValue | toFixed8}} {{sourceData.asset}}</span>
            </div>
            <div class="space"></div>
            <el-button type="primary"
                       :loading="submitLoading"
                       :disabled="isSubmitDisabled"
                       @click="onSubmit">{{i18n.join}}{{lockTime ? ` ${lockTime}s` : ''}}</el-button>
          </template>
        </div>
      </div>
      <!-- 详情介绍 -->
      <div class="synopsis">
        <div class="title">{{i18n.project}}</div>
        <div class="body"
             v-html="sourceProject"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { getUserAllMoney, getProductList, createBakeOrder } from '~/store/modules/bake/types';
import { selectGroup } from '~/store/modules/trade/types';
import { GET_USER_INFO } from '~/store/modules/user/type';
import CountdownClock from '~/components/Bake/CountdownClock';
import Storage from '~/utils/storage';
import tools from '~/utils/index';
export default {
  data() {
    return {
      sourceData: { orderInfo: {} }, // 原始数据
      minMoney: 0, // 最小金额
      maxMoney: 999999999999, //最大金额
      inputValue: '', // 输入框的值
      errorInfo: '', // 错误提示信息
      lockTime: 0, // 按钮被锁住的时间
      lockTimeTimer: null, // 按钮锁住的timer
      groupTimer: null, // 轮询市场数据的timer
      groupTime: 0, // 轮询间隔时间
      pageLoading: true, // 全局加载中状态
      submitLoading: false, // 是否正在提交
    };
  },
  components: {
    CountdownClock,
  },
  /** ==== 计算属性 ==== **/
  computed: {
    ...mapState({
      locale: state => state.locale, // 本地是什么语言
      i18n: state => state.i18n.App.Bake, // 语言包
      isLogin: state => state.isLogin, // 是否已登录
      userInfo: state => state.user.userInfo, // 用户基本信息
      ErrorCode: state => state.i18n.App.ErrorCode, // 错误信息
      allmoneyData: state => state.bake.allmoneyData, // 用户的所有资产
      groupData: state => state.trade.marketData, // 市场数据
    }),
    // 币种LOGO
    logoSrc() {
      if (!!this.sourceData.productImg) {
        return this.sourceData.productImg;
      }
      return '';
    },
    // 计息方式
    compoundI18n() {
      if (this.sourceData.rateType === '复利计息') {
        return this.i18n.compounds[0];
      }
      return this.sourceData.rateType;
    },
    // 用户拥有的当前烘焙币的余额
    money() {
      const obj = this.allmoneyData.find(item => item.asset === this.sourceData.asset);
      return obj ? obj.available_balance : 0;
    },
    // 提交按钮是否应该被禁用
    isSubmitDisabled() {
      if (this.lockTime > 0) {
        return true;
      }
      if (this.pageLoading) {
        return true;
      }
      return false;
    },

    // 当前子币市场数据
    ziData() {
      const mu = this.groupData.find(item => item.symbol === 'USD');
      if (mu) {
        const zi = mu.lists.find(item => item.symbol === this.sourceData.asset);
        if (zi) {
          return zi;
        }
      }
      return {};
    },
    // 项目介绍
    sourceProject() {
      if (!this.sourceData.propList) {
        return '';
      }
      let locale = 'en_US';
      switch (this.locale) {
        case 'zh_cn':
          locale = 'zh_CN';
          break;
        case 'en_us':
          locale = 'en_US';
          break;
        case 'ja_jp':
          locale = 'ja_JP';
          break;
        case 'ru_ru':
          locale = 'ru_RU';
          break;
      }
      const res = this.sourceData.propList.find(item => item.propertyName === locale);
      return res ? res.value : '';
    },
  },
  /** ==== 格式化 ==== **/
  filters: {
    toFixed8(num) {
      if (isNaN(Number(num))) {
        return '0.00000000';
      }
      const str = String(num).split('.');
      if (!!str[1] && str[1].length > 8) {
        return `${str[0]}.${str[1].slice(0, 8)}`;
      }
      return num;
    },
    // 千分位分割
    moneyFormat(num) {
      const n = Number(num);
      if (isNaN(n)) {
        return '0';
      }
      const str = String(n).split('.');
      const str0 = Number(str[0]).toLocaleString('en-US');
      const res = str[1] ? `${str0}.${str[1]}` : str0;
      return res;
    },
  },

  /** ==== 生命周期 ==== **/
  async mounted() {
    // this.createBakeOrder({ productId: 1, amount: 50 });
    const time = Number(Storage.get('bakelockTime'));
    if (time) {
      const nowDate = new Date().getTime();
      if (time - nowDate > 1000) {
        this.lockTime = Math.floor((time - nowDate) / 1000);
        this.lockTimeCut();
      }
    }

    if (this.isLogin) {
      await this.GET_USER_INFO();
      await this.getUserAllMoney({ userId: this.userInfo.userId });
    }
    await this.getGroup();
    await this.getData();
  },
  beforeDestroy() {
    clearTimeout(this.lockTimeTimer);
    clearTimeout(this.groupTimer);
  },

  /** ==== 监听 ==== **/
  watch: {
    inputValue(newV) {
      const v = newV;
      // 比较数字必须要用bignumber
      if (v === '') {
        this.errorInfo = '';
      } else if (tools.isLt(v, this.minMoney)) {
        this.errorInfo = `${this.i18n.errorInfo[0].replace('@1', this.minMoney)}`;
      } else if (tools.isGt(v, this.money)) {
        // console.log(v);
        // console.log(this.money);
        // console.log(v > this.money);
        // console.log(tools.isGt(v, this.money));
        this.errorInfo = this.i18n.errorInfo[1];
      } else {
        this.errorInfo = '';
      }
    },
    i18n(newV) {
      const v = this.inputValue;
      if (v === '') {
        this.errorInfo = '';
      } else if (tools.isLt(v, this.minMoney)) {
        this.errorInfo = `${newV.errorInfo[0].replace('@1', this.minMoney)}`;
      } else if (tools.isGt(v, this.money)) {
        this.errorInfo = newV.errorInfo[1];
      } else {
        this.errorInfo = '';
      }
    },
  },
  /** ==== 方法 ==== **/
  methods: {
    ...mapMutations(['tabState']),
    ...mapActions({ getUserAllMoney, getProductList, selectGroup, createBakeOrder, GET_USER_INFO }),

    // getData
    getData() {
      this.pageLoading = true;
      this.getProductList().then(res => {
        if (res && res.code === 200) {
          // 根据URL中带的ID加载对应的活动数据，如果没找到，就默认加载第1个活动数据
          const path = this.$route.path.split('/').slice(-1);
          const data = res.data.data.find(item => item.id === Number(path)) || res.data.data[0] || { orderInfo: {} };
          this.sourceData = data || { orderInfo: {} };
          this.minMoney = data.amountLimit;
          // 确实有数据才显示，也有可能1个烘焙活动都没有，后台返回空数组
          if (this.sourceData.id) {
            this.pageLoading = false;
          }
        } else {
          this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
        }
      });
    },
    // 轮询市场最新数据
    getGroup() {
      clearTimeout(this.groupTimer);
      this.selectGroup();
      this.groupTimer = setTimeout(() => {
        this.groupTime = 8000;
        this.getGroup();
      }, this.groupTime);
    },
    // 去登录页
    gotoLogin() {
      this.$router.push(`/u/login?bake=${this.sourceData.id}`);
    },
    // 用户在输入框输入值
    onInputChange(e) {
      const v = this.checkValue(e.target.value);
      this.inputValue = v;
      e.target.value = v;
    },

    // 用于检查单价框的内容
    checkValue(res) {
      let v = String(res).trim();
      // 输入了非数字 还原到上一次输入的值
      // console.log('sr:', v, isNaN(Number(v)));
      if (isNaN(Number(v))) {
        v = this.inputValue;
      }

      // 不超过8个小数点
      let str = `${v}`.split('.');
      if (str[1] && str[1].length > 8) {
        v = Number(`${str[0]}.${str[1].substr(0, 8)}`);
      }

      // 最小值
      if (v < 0) {
        v = 0;
      }

      // 最大值，虽然没要求，但还是需要一个最大值,9999亿，huobi也是这么大
      if (v > 999999999999) {
        v = 999999999999;
      }
      // console.log('最终的v:', v);
      return v;
    },

    // 用户点击all按钮
    onAllIn() {
      this.onInputChange({ target: { value: this.money } });
    },
    // 用户点击+
    onInputAdd() {
      let v = Number(this.inputValue);
      if (isNaN(v) || v < this.minMoney) {
        v = this.minMoney;
      } else if (v + 1 > this.maxMoney) {
        v = this.maxMoney;
      } else {
        let str = String(v).split('.');
        v = Number(Number(str[0]) + 1 + '.' + (str[1] || ''));
      }
      this.inputValue = v;
    },
    // 用户点击-
    onInputCut() {
      let v = Number(this.inputValue);
      if (isNaN(v) || v - 1 < this.minMoney) {
        v = this.minMoney;
      } else {
        let str = String(v).split('.');
        v = Number(Number(str[0]) - 1 + '.' + (str[1] || ''));
      }
      this.inputValue = v;
    },
    // 参与成功后弹出提示框
    openModal() {
      const h = this.$createElement;
      const d = new Date().getTime();
      const d1 = new Date(d + 86400000 * 29); // +29天
      const d2 = new Date(d + 86400000 * 31); // +31天
      this.$msgbox({
        title: this.i18n.success,
        message: h('p', null, [
          h('span', null, this.i18n.modalinfo[0]),
          h('i', { style: 'font-style:normal;color: #007cff' }, `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}`),
          h('span', null, this.i18n.modalinfo[1]),
          h('i', { style: 'font-style:normal;color: #007cff' }, `${d2.getFullYear()}-${d2.getMonth() + 1}-${d2.getDate()}`),
          h('span', null, this.i18n.modalinfo[2]),
        ]),
        showCancelButton: true,
        confirmButtonText: this.i18n.ok,
        cancelButtonText: this.i18n.cancel,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.tabState('bake');
            this.$router.push('/u?param=bake');
          } else {
            this.getData();
            this.getUserAllMoney({ userId: this.userInfo.userId });
          }
          done();
        },
      });
    },

    // lockTime的倒计时
    lockTimeCut() {
      clearTimeout(this.lockTimeTimer);
      this.lockTimeTimer = setTimeout(() => {
        let time = this.lockTime - 1;
        time = time < 0 ? 0 : time;
        this.lockTime = time;
        if (time > 0) {
          this.lockTimeCut();
        }
      }, 1000);
    },

    // 用户点击参与按钮
    onSubmit() {
      const v = Number(this.inputValue);
      if (!v || v < this.minMoney) {
        this.$message.error(`${this.i18n.errorInfo[0].replace('@1', this.minMoney)}`);
        return;
      } else if (v > this.money) {
        this.$message.error(this.i18n.errorInfo[1]);
        return;
      }
      this.submitLoading = true;
      const params = {
        productId: this.sourceData.id,
        amount: v,
      };
      this.createBakeOrder(params)
        .then(res => {
          if (res && res.code === 200) {
            // 按钮每30秒只能点一次
            let endTime = new Date().getTime() + 30000;
            Storage.setWithTime('bakelockTime', endTime, new Date(endTime));
            this.lockTime = 30;
            this.lockTimeCut();
            this.openModal();
          } else {
            this.$message.error(this.ErrorCode[res.code] || `${res.code}`);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/css/_theme-conf.scss';
.bake-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0 96px 0;
  flex: 1;

  .space {
    flex: 1;
  }
  .head {
    height: 78px;
    display: flex;
    padding: 0 28px;
    align-items: center;
    position: relative;
    @include fontPair(color);
    @include bgPair(background-color);
    & > div {
      opacity: 0;
      transition: all 250ms;
    }
    &.show > div {
      opacity: 1;
    }
    &.show .boon {
      display: none;
    }
    .boon {
      position: absolute;
      opacity: 1 !important;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 28px;
      color: #ccc;
      span {
        margin-right: 200px;
      }
      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #007cff;
        stroke-linecap: round;
      }
    }
    .title {
      display: flex;
      align-items: center;
      .logo {
        width: 34px;
        height: 34px;
        display: flex;
        overflow: hidden;
        align-items: center;
        border-radius: 34px;
        justify-content: center;
        border: solid 1px;
        @include interactionPair(border-color);
        i {
          margin: 0;
          top: 0;
        }
      }
      .name {
        font-size: 22px;
        line-height: 22px;
        margin-left: 12px;
        span {
          font-size: 14px;
          margin-left: 2px;
          @include subFontPair(color);
        }
      }
    }
    .clock {
      display: flex;
      align-items: center;
    }
    .price {
      margin-left: 40px;
      min-width: 150px;
      font-size: 22px;
      text-align: right;
      span {
        color: #29a76c;
        font-size: 14px;
        margin-left: 2px;
        vertical-align: middle;
        &.red {
          color: #df543a;
        }
      }
    }
    .info {
      font-size: 14px;
      margin-left: 40px;
      span {
        margin-right: 10px;
        @include subFontPair(color);
      }
    }
  }
  .boss {
    padding: 28px;
    display: flex;
    margin-top: 10px;
    @include bgPair(background-color);
    .tobeShow {
      opacity: 0;
      transition: all 250ms;
    }
    .tobeHide {
      opacity: 1;
      transition: all 200ms;
      position: absolute;
      bottom: 20px;
      left: 5px;
      color: #ccc;
    }
    &.show .tobeShow {
      opacity: 1;
    }
    &.show .tobeHide {
      opacity: 0;
    }
    .l {
      width: 770px;
      padding-right: 28px;
      .info-box {
        padding: 40px 28px 28px 28px;
        @include hoverPair(background-color);
        .infos {
          display: flex;
          & > li {
            width: 28%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            &:first-child {
              width: 44%;
            }
            & > div {
              &:first-child {
                font-size: 14px;
                @include subFontPair(color);
              }
              &:nth-child(2) {
                &.green {
                  color: #28b372;
                }
                &.red {
                  color: #df543a;
                }
                &.transtop {
                  @include fontPair(color);
                  span {
                    font-size: 34px;
                  }
                  transform: translateY(-3px);
                }
                font-size: 16px;
                i {
                  font-style: normal;
                }
                span {
                  font-size: 44px;
                  margin-right: 5px;
                }
              }
            }
          }
        }
        .infos-add {
          font-size: 12px;
          opacity: 0.55;
          @include subFontPair(color);
        }
        .infos-last {
          margin-top: 48px;
          font-size: 14px;
          @include subFontPair(color);
          span {
            color: #29a76c;
          }
        }
      }
      .info-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 45px;
        font-size: 14px;
        @include subFontPair(color);
        span {
          color: #007cff;
          opacity: 0.8;
        }
      }
    }
    .line {
      width: 1px;
      @include cutLinePair(background-color);
    }
    .r {
      flex: 1;
      display: flex;
      padding-left: 28px;
      flex-direction: column;
      .no-login {
        width: 232px;
        height: auto;
        margin: 0 auto;
      }
      .infos {
        flex: 1;
        margin-top: 20px;
        @include subFontPair(color);
        span {
          @include fontPair(color);
        }
      }
      .t {
        display: flex;
        @include fontPair(color);
        & > span:first-child {
          margin-right: 5px;
          flex: none;
          @include subFontPair(color);
        }
        a {
          flex: none;
          @include interactionPair(color);
        }
      }
      .error-box {
        font-size: 12px;
        color: rgb(250, 100, 100);
        min-height: 20px;
        margin-top: 5px;
      }
      .input-box {
        display: flex;
        width: 100%;
        margin-top: 40px;
        .btn {
          width: 42px;
          height: 42px;
          position: relative;
          @include borderPair(background-color);
          cursor: pointer;
          &:hover {
            @include hoverPair(background-color);
          }
          .line-row {
            height: 2px;
            width: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            @include subFontPair(background-color);
          }
          .line-col {
            width: 2px;
            height: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            @include subFontPair(background-color);
          }
        }
        .input {
          flex: 1;
          border: 1px solid;
          margin: 0 10px;
          display: flex;
          transition: all 250ms;
          @include borderPair(border-color);
          &.error {
            border: 1px solid rgb(250, 100, 100);
          }
          input {
            flex: 1;
            height: 42px;
            border: none;
            padding-left: 15px;
            display: block;
            outline: none;
            font-size: 16px;
            background: transparent;
            @include fontPair(color);
            @include fontPair(caret-color);
          }
          .allin {
            font-size: 14px;
            min-width: 50px;
            text-align: center;
            line-height: 42px;
            flex: none;
            cursor: pointer;
            @include interactionPair(color);
            &:hover {
              color: #6ea8fe;
            }
          }
        }
      }
      .price {
        display: flex;
        justify-content: space-between;
        @include fontPair(color);
        span:first-child {
          @include subFontPair(color);
        }
      }
    }
  }
  .synopsis {
    margin-top: 20px;
    @include bgPair(background-color);
    .title {
      height: 62px;
      display: flex;
      align-items: center;
      font-size: 22px;
      padding: 0 28px;
      border-bottom: solid 1px;
      font-weight: 500;
      @include fontPair(color);
      @include cutLinePair(border-bottom-color);
    }
    .body {
      padding: 28px 28px 34px 28px;
      font-size: 14px;
      letter-spacing: 1px;
      text-align: justify;
      word-break: break-all;
      word-wrap: break-word;
      @include subFontPair(color);
      img,
      video {
        max-width: 100%;
      }
    }
  }
}
</style>