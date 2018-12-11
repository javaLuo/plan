<template>
  <div class="container">
    <div class="page-playnew">
      <!-- 上部分 详情信息 -->

      <div :class="['detail-box', {'show': !loading}]">
        <div class="title-box">
          <div class="logo">
            <!-- <i class="token-logo default-icon"
             v-if="!datas.smallImg"></i> -->
            <img src="~/assets/images/assets-icon/TVC.png"
                 alt="logo"
                 draggable="false" />
          </div>
          <div class="name-box">
            <div>{{datas.currencyName || '-'}}</div>
            <div>{{lang.currency}}：{{datas.currency}}</div>
          </div>
          <div class="tag"
               :class="['tag', starting ? 'tag-blue' : 'tag-grid']">{{statusInfo}}</div>
        </div>
        <div class="info-box">
          <div class="png-box swiper-loading-bg">
            <img :src="typeImg1"
                 v-if="typeImg1"
                 @load="pngLoad(1)"
                 :class="['png', {'show': png1Show}]"
                 draggable="false"
                 alt="image" />
          </div>
          <div class="info">
            <div class="progress">
              <div class="my-progress">
                <div :style="{width: computedPercent}"></div>
              </div>
              <div class="progress-info">
                <span>{{datas.percent || 0}}%</span>
                <div>
                  <i>{{lang.lave}}</i>
                  <span>{{datas.leftVolume || 0}}</span>
                </div>
              </div>
            </div>
            <div class="bit">
              <ul>
                <li v-for="(item, index) in datas.assetList"
                    :key="index">
                  <span class="bit1">{{datas.unit}} {{datas.currency}}</span>
                  <span class="bit2">{{item.rate}} {{item.asset}}</span>
                  <i :class="['token-logo', 'default-icon', `${item.asset}`]"></i>
                </li>
              </ul>
            </div>
            <ul class="info-ul">
              <li>
                <span>{{lang.stage}}</span>
                <span class="show1">{{datas.phase}}</span>
              </li>
              <li>
                <span>{{lang.volume}}</span>
                <span class="show2">{{numberFormat(datas.volume)}}</span>
              </li>
              <li>
                <span>{{lang.fee}}</span>
                <span class="show3">{{!datas.fee && Number(datas.fee) !== 0 ? '' : `${datas.fee}%` }}</span>
              </li>
              <li>
                <span>{{lang.startDate}}</span>
                <span class="show4">{{startDateStr}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 下半部分 -->
      <div :class="['down-box', {'show': !loading}]">
        <!-- 左边项目简介 -->
        <div class="introduction">
          <div class="title">{{lang.projectInt}}</div>
          <div class="png-box swiper-loading-bg">
            <img :src="typeImg2"
                 v-if="typeImg2"
                 draggable="false"
                 @load="pngLoad(2)"
                 :class="['png', {'show': png2Show}]"
                 alt="image" />
          </div>
        </div>
        <!-- 右边用户操作区 -->
        <div class="user-control">
          <div class="user-sticky-box"
               ref="userControl">
            <!-- 没登录时显示这个框 -->
            <div class="not-login"
                 v-if="!isLogin">
              <img class="photo"
                   src="~/assets/images/tokensell/photo@2x.png"
                   alt="photo" />
              <div class="remind">{{lang.loginInfo}}</div>
              <el-button class="submit-button"
                         type="primary"
                         @click="gotoLogin">{{lang.login}}</el-button>
            </div>
            <!-- 登录后显示 -->
            <div class="order"
                 v-if="isLogin">
              <ul class="tabs"
                  @click='onTabClick($event)'>
                <li v-for="(item, index) in datas.assetList"
                    :key="index"
                    :data-v="item.asset"
                    :class="{active : tab === item.asset}">
                  {{item.asset}}
                </li>
              </ul>
              <div class="box">
                <div class="mini-info">{{lang.canuse}}：{{assetHave}} {{tab}}</div>
                <div class="money-input">
                  <div class="input-box">
                    <input type="text"
                           :placeholder="`${lang.inputPlaceholder.replace('$1', datas.unit || 1)}`"
                           ref="numInput"
                           maxlength="10"
                           :value="num"
                           @input="onNumInput" />
                  </div>
                  <div class="btn-box">
                    <div @click="onMoneyAdd">
                      <i class="el-icon-caret-top" />
                    </div>
                    <div @click="onMoneyReduce">
                      <i class="el-icon-caret-bottom" />
                    </div>
                  </div>
                </div>
                <div class="error-msg">
                  <span v-html="errorInfoStr"></span>
                </div>
                <div class="mini-info">
                  <i class="iconfont icon-zhuyi" />{{lang.feeInfo}}
                </div>
                <div class="last">
                  <span>{{lang.payTrue}}({{this.tab}})</span>
                  <span>{{payMentStr}}</span>
                </div>
                <el-button type="primary"
                           :disabled="!starting"
                           class="submit-button"
                           :loading="submitLoading"
                           @click="submitForm('ruleForm')">{{submitBtnInfo}}</el-button>
              </div>
            </div>
            <!-- 申购记录 -->
            <div class="history-box"
                 v-loading="historyLoading"
                 v-if="isLogin">
              <div class="title">{{lang.history}}</div>
              <ul class="ul-list">
                <li v-for="(item, index) in historyData"
                    :key="index">
                  <div class="money">
                    <span>{{item.totalAmount}} {{item.asset}}</span>
                    <span>{{item.volume}} {{item.currency}}</span>
                  </div>
                  <div class="date">{{forMatDate(item.createTime)}}</div>
                </li>
                <li class="nothing"
                    v-if="!historyData.length">
                  <img v-if="theme==='dark'"
                       src='~/assets/images/nodata-dark.png'
                       alt="nodata" />
                  <img v-else
                       src="~/assets/images/nodata-light.png"
                       alt="nodata" />
                  <div>{{nodata.delegateCol.nodata}}</div>
                </li>
              </ul>
              <div class="history-pagination"
                   v-if="historyData.length">
                <el-pagination small
                               layout="prev, pager, next"
                               :total="historyTotal"
                               :page-size="historyPageSize"
                               :current-page="historyPageNow"
                               @current-change="onHistoryPageChange">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="loading"
           class="component-loading">
        <div class="loading-content">
          <div class="el-loading-mask"
               v-if="loading">
            <div class="el-loading-spinner">
              <svg viewBox="25 25 50 50"
                   class="circular">
                <circle cx="50"
                        cy="50"
                        r="20"
                        fill="none"
                        class="path"></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { BigNumber } from 'bignumber.js';
import { GET_USER_INFO } from '~/store/modules/user/type';
import { GET_TOKENSELLBYID, GET_TOKENSELLRECORDS, GET_PURCHASE, GET_QUERYUSERSPECIFIEDASSETBALANCE, GET_NEWTOKENSELL } from '~/store/modules/tokensell/types';
import big from '~/utils/big';
import Utils from '~/utils';

export default {
  name: 'tokensell',
  data() {
    return {
      id: null, // 活动ID
      datas: {}, // 获得活动的原始数据
      historyData: [], // 换购记录数据
      historyPageNow: 1, // 分页
      historyPageSize: 5, // 每页多少条
      historyTotal: 0, // 总数
      historyLoading: false, // 是否正在获取换购记录
      loading: true, // 是否正在获取活动原始数据
      submitLoading: false, // 是否正在下单中
      errorInfo: '', // 表单错误信息 0请输入>0的正数，1大于了总数，2大于了自身拥有,3不是10000的整数倍，100OK
      num: '', // 用户输入的数量
      tab: null, // 选择的什么币
      assetHave: 0, // 拥有多少个母币
      offset: 0, // sticky要用
      y: 0,
      isIE: false, // 是否是IE
      png1Show: false, // 上面的图是否显示
      png2Show: false, // 下面的图是否显示
      dom: {
        header: null,
        footer: null,
      },
    };
  },
  /**
   * 计算属性
   * **/
  computed: {
    ...mapState({
      theme: state => state.theme,
      locale: state => state.locale, // 本地是什么语言
      lang: state => state.i18n.App.TokenSell, // i18n语言
      nodata: state => state.i18n.App.Trade,
      isLogin: state => state.isLogin, // 是否已登录
      userInfo: state => state.user.userInfo,
      ErrorCode: state => state.i18n.App.ErrorCode, // 错误信息
    }),

    // 上面的图片
    typeImg1() {
      let type = 1;
      switch (this.locale) {
        case 'zh_cn':
          type = 1;
          break;
        case 'en_us':
          type = 3;
          break;
        case 'ja_jp':
          type = 5;
          break;
      }
      const arr = this.datas.picList || [];
      const res = arr.find(item => item.type === type);
      return res ? res.url : '';
    },
    // 下面的图片
    typeImg2() {
      let type = 2;
      switch (this.locale) {
        case 'zh_cn':
          type = 2;
          break;
        case 'en_us':
          type = 4;
          break;
        case 'ja_jp':
          type = 6;
          break;
      }
      const arr = this.datas.picList || [];
      const res = arr.find(item => item.type === type);
      return res ? res.url : '';
    },
    // 活动是否是进行中
    starting() {
      if (!Number(this.datas.leftVolume)) {
        // 没有剩余数量，也是已结束
        return false;
      }
      if (Number(this.datas.tokenSellStatus) !== 0) {
        // 0是进行中，不是0均为异常状态
        return false;
      }
      return true;
    },
    // 活动开始时间 计算属性
    startDateStr() {
      return this.datas.startDateStr ? Utils.ForMatDateDuBai(new Date(Number(this.datas.startDateStr))) : '';
    },
    // 进度，为了动画
    computedPercent() {
      const p = this.datas.percent || 0;
      return `${Number(p)}%`;
    },
    // 实际支付的最终值
    payMent() {
      const d = this.datas;
      // 未得到活动详情数据/用户输入数字无效
      if (!d || !d.assetList || !this.num) {
        return '';
      }
      // 活动详情数据中未找到对应的币
      const n = d.assetList.find(item => item.asset === this.tab);
      if (!n) {
        return '';
      }

      const num = new BigNumber(this.num); // 用户输入的数量
      const mag = new BigNumber(n.rate).div(new BigNumber(d.unit)); // 单价：子币 / 新币， 即 1新币能换多少子币
      const money = num.multipliedBy(mag); // 换购num个新币需要这么多子币
      const fee = money.multipliedBy(new BigNumber(d.fee).div(100)); // 收取手续费
      return money.plus(fee);
    },
    payMentStr() {
      return String(this.payMent) ? this.payMent.toFormat(8).replace(/[.]?[0]+$/g, '') : '';
    },
    // 表单错误信息
    errorInfoStr() {
      switch (this.errorInfo) {
        case 0:
          return this.lang.error[0];
        case 1:
          return this.lang.error[1];
        case 2:
          return this.lang.error[2];
        case 3:
          return this.lang.error[3].replace('$1', this.datas.unit || 1);
        case 4:
          return this.lang.error[4];
        default:
          return '&#12288';
      }
    },
    // 下单按钮状态信息 1 未开始 2已结束 0 正在进行中
    submitBtnInfo() {
      if (!Number(this.datas.leftVolume)) {
        // 没有剩余数量，也是已结束
        return this.lang.submitBtnInfo[1];
      }
      switch (Number(this.datas.tokenSellStatus)) {
        case 0:
          return this.lang.submitBtnInfo[0];
        case 1:
          return this.lang.submitBtnInfo[2];
        case 2:
          return this.lang.submitBtnInfo[1];
        default:
          return '';
      }
    },
    // 状态对应的i18n信息 1 未开始 2已结束 0 正在进行中
    statusInfo() {
      if (!Number(this.datas.leftVolume)) {
        // 没有剩余数量，也是已结束
        return this.lang.status[1];
      }
      switch (Number(this.datas.tokenSellStatus)) {
        case 0:
          return this.lang.status[0];
        case 1:
          return this.lang.status[2];
        case 2:
          return this.lang.status[1];
        default:
          return '';
      }
    },
  },
  // 初始化完毕时触发
  mounted() {
    this.$nextTick(() => {
      // 判断浏览器 因为IE的sticky有问题
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('msie') || userAgent.includes('edge') || /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.isIE = true; // 是IE或edge或移动端
      }
      // 获取通过URL传来的活动ID
      const id = this.$route.params.id || this.$route.query.id;
      if (!id) {
        this.$router.replace('/');
      } else {
        this.id = id;
        this.getData(id);
      }
      // 如果已登录，
      if (this.isLogin) {
        this.getRecords(1);
      }
      this.initDom();
    });
  },
  created() {
    if (this.isLogin) {
      this.getUserInfo().then(res => {
        if (res && res.code === 200 && res.data && !res.data.c1Status) {
          this.$message(this.lang.error[4]);
        }
      });
    }
  },
  beforeDestroy() {
    this.resetDom();
    this.unbindSticky();
    this.getLastId();
  },
  /**
   * 方法们
   * **/
  methods: {
    ...mapActions({
      getUserInfo: GET_USER_INFO,
      getLastId: GET_NEWTOKENSELL,
    }),
    initDom() {
      this.dom.header = document.querySelector('header');
      this.dom.footer = document.querySelector('footer');
      if (!this.dom.header || !this.dom.footer) {
        return;
      }
      this.dom.header.style.minWidth = '1200px';
      this.dom.footer.style.minWidth = '1200px';
      this.dom.footer.style.zIndex = 10;
    },
    resetDom() {
      if (!this.dom || !this.dom.header || !this.dom.style) {
        return;
      }
      this.dom.header.style.minWidth = '';
      this.dom.footer.style.minWidth = '';
      this.dom.footer.style.zIndex = 1;
    },
    pngLoad(num) {
      switch (num) {
        case 1:
          this.png1Show = true;
          break;
        case 2:
          this.png2Show = true;
          break;
      }
    },
    numberFormat(str) {
      if (isNaN(Number(str))) {
        return '';
      }
      return new BigNumber(str).toFormat();
    },
    // 根据ID获取详情数据
    getData(id, noLoading = false) {
      if (!noLoading) {
        this.loading = true;
      }
      this.$store.dispatch(GET_TOKENSELLBYID, id).then(res => {
        if (res && res.code === 200 && res.data) {
          this.datas = res.data;
          this.tab = this.tab ? this.tab : res.data.assetList.length && res.data.assetList[0].asset;
          if (this.isLogin) {
            this.queryUserAllAssestBalance(this.tab);
          }
          this.$nextTick(() => {
            this.loading = false;
            this.bindSticky();
          });
        } else if (res.code === 2703) {
          this.$router.replace('/404');
        } else {
          this.$message.error(this.ErrorCode[res.code]);
        }
      });
    },
    // 查询用户拥有的资产
    queryUserAllAssestBalance(asset) {
      this.assetHave = 0;
      this.$store.dispatch(GET_QUERYUSERSPECIFIEDASSETBALANCE, asset).then(res => {
        if (res && res.code === 200) {
          this.assetHave = res.data && res.data.available_balance ? res.data.available_balance : 0;
          this.$nextTick(() => {
            this.onIsError();
          });
        } else {
          this.$message.error(this.ErrorCode[res.code]);
        }
      });
    },
    // 分页获取换购记录
    getRecords(nextPage) {
      const params = {
        tokenSellId: Number(this.id),
        currentPage: nextPage,
        pageSize: this.historyPageSize,
      };
      this.historyLoading = true;
      this.$store
        .dispatch(GET_TOKENSELLRECORDS, params)
        .then(res => {
          if (res && res.code === 200) {
            this.historyData = res.data.list;
            this.historyTotal = res.data.total;
            this.historyPageNow = nextPage;
            if (!this.isIE) {
              this.onResize();
            }
          }
        })
        .finally(() => {
          this.historyLoading = false;
        });
    },
    // 分页 页码改变
    onHistoryPageChange(e) {
      this.getRecords(e);
    },
    // tab切换
    onTabClick(e) {
      if (e.target.nodeName === 'LI' && e.target.dataset.v !== this.tab) {
        this.tab = e.target.dataset.v;
        this.queryUserAllAssestBalance(this.tab);
      }
    },
    // 换购记录中的日期格式化
    forMatDate(str) {
      return str && Utils.ForMatDateDuBai(new Date(str));
    },
    // 用户输入值
    onNumInput(e) {
      if (e.target.value === '') {
        this.$refs.numInput.value = '';
        this.num = '';
      } else if (!Number(e.target.value)) {
        this.$refs.numInput.value = this.num;
      } else {
        const v = Math.floor(Number(Utils.trim(e.target.value)));
        this.num = v;
        this.$refs.numInput.value = this.num;
      }

      this.onIsError();
    },
    // 数量+
    onMoneyAdd() {
      const unit = Number(this.datas.unit) || 1; // 基数
      if (!this.num) {
        this.num = unit;
      } else {
        this.num += unit - (this.num % unit);
      }
      this.onIsError();
    },
    // 数量-
    onMoneyReduce() {
      const unit = Number(this.datas.unit) || 1; // 基数

      if (!this.num) {
        this.num = 0;
      } else {
        const rf = this.num % unit;
        let ref = this.num;
        if (rf > 0) {
          ref = ref - rf;
        } else {
          ref = ref - unit;
        }
        this.num = Math.max(0, ref);
      }

      this.onIsError();
    },
    // 判断表单数字是否有误
    onIsError() {
      const unit = Number(this.datas.unit) || 1; // 基数
      if (!this.num && this.num !== '') {
        // 输入了无效字符 比如 0
        this.errorInfo = 0;
      } else if (this.num % unit) {
        // 不是10000的倍数
        this.errorInfo = 3;
      } else if (big.isGt(this.num, this.datas.leftVolume)) {
        // 新币数量 超过了 剩余的新币数量
        this.errorInfo = 1;
      } else if (big.isGt(this.payMent, this.assetHave)) {
        // 自己需支付的数量 超过了拥有的母币数量
        this.errorInfo = 2;
      } else {
        this.errorInfo = 100;
      }
    },
    // 立即下单
    submitForm() {
      if (this.userInfo.c1Status !== 1) {
        this.errorInfo = 4;
        return;
      }
      this.onIsError();
      if (this.errorInfo !== 100 || !this.num) {
        if (this.num === '') {
          this.errorInfo = 0;
        }
        return;
      }
      const params = {
        asset: this.tab,
        volume: this.num,
        tokenSellId: Number(this.id),
      };
      this.submitLoading = true;
      this.$store
        .dispatch(GET_PURCHASE, params)
        .then(res => {
          if (res && res.code === 200) {
            this.$alert(this.lang.successInfo.replace('$1', `${new BigNumber(params.volume).toFormat()}${this.datas.currency}`).replace('$2', `${this.payMentStr}${this.tab}`), null, {
              confirmButtonText: '确定',
              callback: action => {},
            });
            // 重新获取详情数据，重新获取历史记录，重置input值，重置历史记录分页,重置当前拥有的币
            this.getData(this.id, true);
            this.getRecords(1);
            this.queryUserAllAssestBalance(this.tab);
            this.num = '';
          } else if (res.code === 2714) {
            // 用户没刷新页面，结果活动时间过了，就重新获取一下数据
            this.getData(this.id);
            this.$message.error(this.ErrorCode[res.code]);
          } else {
            this.$message.error(this.ErrorCode[res.code]);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    // 去登录
    gotoLogin() {
      this.$router.push(`/u/login?tokensell=${this.id}`);
    },
    stickyEvent() {
      const dom = this.$refs.userControl;
      const rect = dom.getBoundingClientRect();
      const doc = document.documentElement;
      const shadow = doc.scrollHeight - doc.scrollTop - doc.clientHeight; // 页面隐藏的距离（滚动条剩余的距离）
      if (rect.top <= 20 && dom.style.position !== 'fixed') {
        dom.style.position = 'fixed';
        dom.style.top = '20px';
      } else if (doc.scrollTop < this.offset && dom.style.position === 'fixed') {
        dom.style.position = '';
        dom.style.top = '';
        dom.style.transform = '';
      }

      if (dom.style.position === 'fixed') {
        let offsetY = 0;
        if (shadow <= this.bottomHeight) {
          offsetY = shadow - this.bottomHeight;
        }
        dom.style.transform = `translateY(${offsetY}px) translateX(${-doc.scrollLeft}px)`;
      }
    },
    onResize() {
      const dom = this.$refs.userControl;
      dom.style.position = '';
      dom.style.top = '';
      dom.style.transform = '';
      this.$nextTick(() => {
        const rect = dom.getBoundingClientRect();

        const doc = document.documentElement;
        this.offset = doc.scrollTop + dom.getBoundingClientRect().top - 20;
        this.bottomHeight = Math.max(rect.height - doc.clientHeight + 277, 0);
        this.stickyEvent();
      });
    },
    // 绑定sticky事件
    bindSticky() {
      if (!this.isIE) {
        this.onResize();
        document.addEventListener('scroll', this.stickyEvent, false);
        window.addEventListener('resize', this.onResize, false);
      }
    },
    unbindSticky() {
      document.removeEventListener('scroll', this.stickyEvent, false);
      window.removeEventListener('resize', this.onResize, false);
    },
  },
};
</script>

<style scoped lang="scss">
@import '~/assets/css/_theme-conf.scss';
.page-playnew {
  .token-logo {
    top: 0;
    flex: none;
  }
  position: relative;
  width: 1200px;
  margin: 20px auto 112px auto;
  flex: 1;
  // 上方区域
  .detail-box {
    padding: 30px 20px 20px 20px;
    visibility: hidden;
    opacity: 0;
    transition: all 250ms;
    @include bgPair(background-color);
    &.show {
      visibility: visible;
      opacity: 1;
      .info-box .info-ul > li > span:nth-child(2) {
        opacity: 1;
        transform: translateX(0);
      }
    }
    // 头部标题通栏
    .title-box {
      display: flex;
      align-items: center;
      margin-bottom: 28px;
      .token-logo {
        height: 50px;
        width: 50px;
        top: 0;
        margin: 0;
      }
      .logo {
        width: 50px;
        height: 50px;
        margin-right: 16px;
        border-radius: 50px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .logo img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      .name-box {
        flex: 1;
        & > div:first-child {
          font-size: 18px;
          letter-spacing: -0.38px;
          @include fontPair(color);
        }
        & > div:nth-child(2) {
          font-size: 14px;
          letter-spacing: -0.29px;
          @include subFontPair(color);
        }
      }
      .tag {
        padding: 0 6px 0 20px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: -0.29px;
        background-size: cover;
        background-position: left center;
        background-repeat: no-repeat;
        border-radius: 3px;
        &.tag-blue {
          background-image: url(~assets/images/tokensell/tag-blue@2x.png);
        }
        &.tag-grid {
          background-image: url(~assets/images/tokensell/tag-grid@2x.png);
        }
      }
    }
    // 详情信息
    .info-box {
      display: flex;
      .png-box {
        position: relative;
        width: 770px;
        height: 390px;
        margin-right: 20px;
        flex: none;
        .png {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: all 250ms;
          transform: translateY(5px);
          &.show {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
      .info {
        flex: 1;
        padding-left: 20px;
        .progress {
          .progress-info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            @include fontPair(color);
            letter-spacing: -0.29px;
            line-height: 14px;
            margin-top: 10px;
            i {
              font-style: normal;
              margin-right: 5px;
              @include subFontPair(color);
            }
          }
        }
        .bit {
          margin-top: 32px;
          padding: 16px 0;
          display: flex;
          align-items: center;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            width: 90%;
            height: 1px;
            bottom: 0;
            left: 0;
            @include cutLinePair(background-color);
          }
          &::before {
            content: '';
            position: absolute;
            width: 90%;
            height: 1px;
            top: 0;
            left: 0;
            @include cutLinePair(background-color);
          }
          & > ul {
            display: block;
            width: 100%;
            & > li {
              display: flex;
              width: 100%;
              margin-top: 10px;
              align-items: center;
              @include fontPair(color);
              .bit2 {
                flex: 1;
                text-align: right;
              }
              i {
                margin: 0 0 0 8px;
                top: 0;
              }
            }
          }
          .amount {
            flex: 1;
            text-align: right;
          }
        }
      }
      .info-ul {
        @include subFontPair(color);
        letter-spacing: -0.29px;
        font-size: 14px;
        line-height: 14px;
        margin-top: 20px;
        & > li {
          padding: 12px 0;
          display: flex;
          & > span:nth-child(2) {
            flex: 1;
            text-align: right;
            @include fontPair(color);
            transition: 300ms;
            opacity: 0;
            transform: translateX(8px);
          }
        }
        .show2 {
          transition-delay: 100ms !important;
        }
        .show3 {
          transition-delay: 200ms !important;
        }
        .show4 {
          transition-delay: 300ms !important;
        }
      }
    }
  }
  // 下面区域
  .down-box {
    display: flex;
    margin-top: 20px;
    align-items: flex-start;
    visibility: hidden;
    opacity: 0;
    transition: all 250ms;
    &.show {
      visibility: visible;
      opacity: 1;
    }
    .title {
      font-size: 22px;
      @include fontPair(color);
      letter-spacing: -0.46px;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .introduction {
      width: 810px;
      flex: none;
      padding: 24px 20px 20px 20px;
      @include bgPair(background-color);
      .png-box {
        width: 100%;
        min-height: 542px;
        .png {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0;
          transition: all 250ms;
          transform: translateY(5px);
          &.show {
            opacity: 1;
            transform: translateY(0);
          }
        }
      }
    }
    .user-control {
      margin-left: 20px;
      position: relative;
      width: 370px;
      flex: none;
      .user-sticky-box {
        width: 370px;
        position: relative;
      }
      .not-login {
        position: relative;
        padding: 20px;
        @include bgPair(background-color);
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 75%;
          left: 0;
          bottom: 0;
          z-index: 0;
          @include bgPair(background-color);
        }
        .photo {
          position: relative;
          width: 210px;
          display: block;
          margin: 0 auto 0 auto;
          z-index: 2;
        }
        .remind {
          @include subFontPair(color);
          position: relative;
          font-size: 14px;
          letter-spacing: -0.29px;
          text-align: center;
          margin-top: 10px;
          z-index: 2;
        }
      }
      .order {
        @include bgPair(background-color);
        .tabs {
          width: 100%;
          padding: 10px 0;
          display: flex;
          justify-content: center;
          & > li {
            padding: 10px;
            margin: 0 10px;
            font-size: 16px;
            letter-spacing: -0.33px;
            text-align: center;
            line-height: 14px;
            @include fontPair(color);
            border-bottom: solid 2px transparent;
            cursor: pointer;
            &.active {
              @include interactionPair(color);
              @include interactionPair(border-bottom-color);
            }
          }
        }
        .order-dropdown {
          width: 100%;
        }
        .el-dropdown-link {
          text-align: center;
          width: 100%;
          line-height: 40px;
          background: #dae4fb;
          border-radius: 2px 2px 0 0;
          cursor: pointer;
          span {
            @include fontPair(color);
          }
          i {
            color: #9ba3c2;
          }
        }
        .box {
          padding: 24px 20px 20px 20px;
          .money-input {
            display: flex;
            width: 100%;
            .input-box {
              flex: 1;
              input {
                width: 100%;
                height: 38px;
                background: transparent;
                border: 1px solid;
                border-radius: 3px 0 0 3px;
                padding: 0 10px;
                outline: none;
                @include fontPair(color);
                @include borderPair(border-color);
              }
            }
            .btn-box {
              width: 28px;
              height: 38px;
              border: solid 1px;
              border-left: none;
              border-radius: 0 3px 3px 0;
              @include borderPair(border-color);
              & > div {
                height: 19px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                @include borderPair(background-color);
                & + div {
                  border-top: solid 1px;
                  @include borderPair(border-top-color);
                }
                i {
                  @include subFontPair(color);
                }
              }
            }
          }
          .error-msg {
            font-size: 12px;
            color: #df543a;
            letter-spacing: -0.25px;
            line-height: 14px;
            margin-top: 5px;
            margin-bottom: 24px;
          }
          .last {
            display: flex;
            align-items: flex-end;
            height: 20px;
            & > span:first-child {
              flex: none;
              font-size: 14px;
              @include fontPair(color);
              letter-spacing: -0.29px;
              line-height: 14px;
            }
            & > span:nth-child(2) {
              font-size: 26px;
              @include fontPair(color);
              letter-spacing: -0.54px;
              text-align: right;
              line-height: 22px;
              flex: 1;
              text-align: right;
            }
          }
          .box-num {
            font-size: 16px;
            @include fontPair(color);
            letter-spacing: -0.33px;
            text-align: center;
            line-height: 14px;
            text-align: center;
            margin-bottom: 26px;
          }
          .mini-info {
            font-size: 12px;
            @include subFontPair(color);
            letter-spacing: -0.25px;
            line-height: 14px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            i {
              color: #df543a;
              margin-right: 7.5px;
            }
          }
        }
      }
      .history-box {
        @include bgPair(background-color);
        margin-top: 20px;
        .title {
          padding: 20px;
        }
        .ul-list {
          & > li {
            padding: 22px 20px 16px 20px;
            .money {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              @include fontPair(color);
              letter-spacing: -0.33px;
            }
            .date {
              font-size: 14px;
              @include subFontPair(color);
              letter-spacing: -0.29px;
              text-align: right;
              margin-top: 3px;
            }
            border-bottom: solid 1px;
            @include cutLinePair(border-bottom-color);
          }
          .nothing {
            text-align: center;
            font-size: 12px;
            letter-spacing: 0;
            text-align: center;
            border: none;
            padding-bottom: 82px;
            @include tipsPair(color);
            img {
              height: 64px;
              width: auto;
              margin-bottom: 10px;
            }
          }
        }
        .history-pagination {
          padding: 20px;
          display: flex;
          justify-content: flex-end;
          .btn-prev {
            border: solid 1px #f000;
          }
        }
      }
    }
  }
  .submit-button {
    position: relative;
    z-index: 2;
    width: 100%;
    margin-top: 27px;
  }
  .sticky-shadow {
    // position: absolute;
    height: 800px;
  }
  .my-progress {
    position: relative;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    @include tipsPair(background-color);
    overflow: hidden;
    & > div {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 3px;
      transition: all 500ms;
      @include interactionPair(background-color);
    }
  }
  .component-loading {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
  }
}
</style>
