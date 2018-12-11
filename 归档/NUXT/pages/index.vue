<template>

  <section class="container">
    <div v-if="!loading">
      <div v-swiper:mySwiper="swiperOption"
           v-if="Array.from(bannerList).length"
           :style="{height: carouselHeight}">
        <div class="swiper-wrapper my-swiper">
          <div class="swiper-slide swiper-loading-bg"
               v-if="!swiperNow"
               v-for="(banner, i) in Array.from(bannerList)"
               :key="i">
            <a :href="banner.gotoUrl"
               v-if="banner.gotoUrl"
               target="_blank">
              <span class="img-bg"
                    :style="{background: `url(${banner.url}) no-repeat center/cover`}"></span>
            </a>
            <span class="img-bg"
                  v-else
                  :style="{background: `url(${banner.url}) no-repeat center/cover`}"></span>
          </div>
        </div>
        <div class="swiper-button-prev"
             slot="button-prev"></div>
        <div class="swiper-button-next"
             slot="button-next"></div>
        <div class="swiper-pagination swiper-pagination-bullets"></div>
        <Notice :list="adList" />
      </div>
      <div class="swiper-loading swiper-loading-bg"
           :style="{height: carouselHeight}"
           v-show="!Array.from(bannerList).length">
        <div class="loading"></div>
        <Notice :list="adList" />
      </div>
      <HomePeity />
      <MarketHome />
      <div class="about-block">
        <!-- <h1 :class="{fadeinB_slow: !loading}">{{homeLanguage.leadingGlobalExchange}}</h1>
        <h3 :class="{fadeinB_slow: !loading}">{{homeLanguage.exchangeDes}}</h3>
        <div class="center-img">
          <img src="~/assets/images/cbg.png"
               alt="">
        </div> -->
        <h2 :class="{fadeinC: !loading}">{{homeLanguage.advantage}}</h2>
        <div class="about-content">
          <ul>
            <li :class="{fadeinD: !loading}">
              <dl class="safe">
                <dt><img src="~/assets/images/icon01.png"
                       :alt="homeLanguage[`advantage1`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage1`].title}}</div>
                  <div class="des">
                    {{homeLanguage[`advantage1`].des}}</div>
                </dt>
              </dl>
              <dl class="professional">
                <dt><img src="~/assets/images/icon02.png"
                       :alt="homeLanguage[`advantage2`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage2`].title}}</div>
                  <div class="des">{{homeLanguage[`advantage2`].des}}</div>
                </dt>
              </dl>
              <dl class="muti">
                <dt><img src="~/assets/images/icon04.png"
                       :alt="homeLanguage[`advantage4`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage4`].title}}</div>
                  <div class="des">{{homeLanguage[`advantage4`].des}}</div>
                </dt>
              </dl>
            </li>
            <li :class="{fadeinE: !loading}">
              <dl class="easy">
                <dt><img src="~/assets/images/icon03.png"
                       :alt="homeLanguage[`advantage3`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage3`].title}}</div>
                  <div class="des">{{homeLanguage[`advantage3`].des}}</div>
                </dt>
              </dl>
              <dl class="muti">
                <dt><img src="~/assets/images/icon05.png"
                       :alt="homeLanguage[`advantage5`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage5`].title}}</div>
                  <div class="des">{{homeLanguage[`advantage5`].des}}</div>
                </dt>
              </dl>
              <dl class="muti">
                <dt><img src="~/assets/images/icon06.png"
                       :alt="homeLanguage[`advantage6`].title"></dt>
                <dt>
                  <div class="title">{{homeLanguage[`advantage6`].title}}</div>
                  <div class="des">{{homeLanguage[`advantage6`].des}}</div>
                </dt>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      <!-- 合作伙伴 -->
      <!-- <div class="partner">
        <div v-swiper:mySwiper2="swiperOption2"
             :style="{height: 200}">
          <div class="swiper-wrapper my-swiper">
            <div class="swiper-slide"
                 v-for="(item, index) in 10"
                 :key="index">
              slide{{item}}
            </div>
          </div>
          <div class="swiper-button-prev"
               slot="button-prev"></div>
          <div class="swiper-button-next"
               slot="button-next"></div>
          <div class="swiper-pagination swiper-pagination-bullets"></div>
        </div>
      </div> -->
      <div class="download"
           id="download">
        <div class="download-content">
          <div class="phone-img"
               :class="{fadeinD: !loading}"></div>
          <div class="download-right"
               :class="{fadeinD: !loading}">
            <h3>{{homeLanguage.downloadappTtl}}</h3>
            <span class="download-test">{{homeLanguage.downloadappTest}}</span>
            <div>
              <el-popover popper-class="download-qrcode"
                          placement="top-start"
                          trigger="hover">
                <img src="~/assets/images/ios.png"
                     width="138"
                     height="138"
                     alt="">
                <a href="https://itunes.apple.com/us/app/rightbtc/id1439042098?l=zh&ls=1&mt=8"
                   target="_blank"
                   slot="reference">
                  <span class="iphone">
                  </span>
                  <em>iOS</em>
                </a>
              </el-popover>
              <el-popover popper-class="download-qrcode"
                          placement="top-end"
                          trigger="hover">
                <img src="~/assets/images/android-code.png"
                     width="138"
                     height="138"
                     alt="">
                <a href=" https://play.google.com/store/apps/details?id=com.weiyou.rightbtc"
                   target="_blank"
                   slot="reference">
                  <span class="android">
                  </span>
                  <em>Android</em>
                </a>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-footer-bar"></div>
    </div>
    <div v-if="loading"
         class="home-loading">
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
    <!-- <peity :type="'line'"
           :options="{fill:'#7160ca02',stroke:'#7160cab8', width: '100%', height:'100%' }"
           :data="pieData"></peity>  import Peity from 'vue-peity';-->
  </section>
</template>

<script>
import axios from 'axios';
import { mapActions, mapMutations, mapState } from 'vuex';
import { GET_BANNERLIST, GET_TICKERLIST, GET_ADS } from '~/store/modules/home/types';
import Configs from '~/common/config';
import Storage from '~/utils/storage';
import MarketHome from '~/components/TradeComs/MarketHome';
import HomePeity from '~/components/HomePeity';
import Notice from '~/components/Notice';
export default {
  layout: 'homeLayout',
  components: {
    HomePeity,
    MarketHome,
    Notice,
  },
  data() {
    return {
      adList: [],
      adType: { zh_cn: 'zh-cn', ja_jp: 'en-us', en_us: 'en-us', ru_ru: 'en-us' },
      swiperOption: {
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      swiperOption2: {
        grabCursor: true,
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      loading: true,
      swiperNow: false,
      allTickers: {},
      allTickersBk: {},
      searchValue: '',
      carouselHeight: '539px',
      activeCoin: 'BTC',
      mainCoins: ['USD', 'BTC', 'ETH', 'ETP'],
      column: [
        { dataIndex: 'market', width: '14.66%', align: 'left', slot: true },
        { dataIndex: 'last', width: '16.66%', align: 'right' },
        { dataIndex: 'rate', width: '12.66%', align: 'right', slot: true },
        { dataIndex: 'high24', width: '16.66%', align: 'right' },
        { dataIndex: 'low24', width: '16.66%', align: 'right' },
        { dataIndex: 'vol24', width: '16.66%', align: 'right' },
      ],
      initialData: [],
      dataSource: [
        {
          high24: 0, //24小时最高
          low24: 0, //24小时最低
          last: 0, //最新价
          rate: 0, //涨跌幅
          market: 'BCH', //交易对
          vol24: 0, //24成交量
          type: 1, //类型
          collect: false, //是否收藏
        },
      ],
    };
  },
  computed: {
    ...mapState({
      homeLanguage: state => state.i18n.App.Home,
      appLocal: state => state.locale,
      theme: state => state.theme,
      bannerList: state => {
        //let res = state.home.bannerList ? state.home.bannerList[state.locale] || state.home.bannerList['en_us'] || state.home.bannerList['zh_cn'] || state.home.bannerList['ja_jp'] || [] : [];
        return state.home.bannerList;
      },
      locale: state => state.locale,
    }),
  },
  watch: {
    // 用户点选了不同的母币，要重新初始化socket，让socket推送当前母币下的子币更新情况
    // activeCoin() {
    //   this.initWs();
    // },
    bannerList(newv) {
      console.log(newv);
      if (this.mySwiper && newv && newv.length) {
        this.swiperNow = true;
        this.mySwiper.removeAllSlides();
        this.mySwiper.appendSlide(
          newv.map(item => {
            return `<div class="swiper-slide swiper-loading-bg">
            <a href="${item.gotoUrl}" target="_blank">
              <span class="img-bg"
                    style="background: url(${item.url}) no-repeat center/cover"></span>
            </a>
          </div>`;
          }),
        );
      }
    },
    async locale(newVal) {
      this.adList = await this.getAds(this.adType[this.locale]);
      await this.getBanners({
        client: 1,
        plat: 1,
        remark: this.locale,
      });
    },
  },
  async mounted() {
    if (this.$store.state.isLogin) {
      await this.$store.dispatch('user/getUserInfo');
    }
    //mounted后直接定位滚动条位置
    this.loading = false;
    let arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/);
    let st = !!arr && arr[1] ? arr[1] : 0;
    document.documentElement.scrollTop = parseInt(st);
    document.body.scrollTop = parseInt(st);
    this.adList = await this.getAds(this.adType[this.locale]);

    //重置banner位置
    this.resetCarousel();
    window.addEventListener('resize', () => {
      this.resetCarousel();
    });

    //获取
    let data = await this.getAllTickers();
    if (!!data) {
      this.allTickers = data;
      this.allTickersBk = JSON.parse(JSON.stringify(data));
      this.initialData = JSON.parse(JSON.stringify((!!this.allTickers && this.allTickers[this.activeCoin]) || {}));
    }

    await this.getBanners({
      client: 1,
      plat: 1,
      remark: this.locale,
    });
    //console.log(this.bannerList);
    //初始化socket
    // this.initWs();

    //滚动条位置
    window.onbeforeunload = () => {
      this.setScrollTop();
    };
    //滚动条位置

    if (!this.mySwiper) return;
    if (Array.from(this.bannerList).length <= 1) {
      this.mySwiper.autoplay.stop();
    } else {
      this.mySwiper.autoplay.start();
    }
  },
  methods: {
    setScrollTop() {
      let scrollPos;
      if (typeof window.pageYOffset != 'undefined') {
        scrollPos = window.pageYOffset;
      } else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
      } else if (typeof document.body != 'undefined') {
        scrollPos = document.body.scrollTop;
      }
      document.cookie = 'scrollTop=' + scrollPos; //存储滚动条位置到cookies中
    },
    resetCarousel() {
      let docWidth = document.documentElement.clientWidth > 1024 ? document.documentElement.clientWidth : 1024;
      this.carouselHeight = (docWidth * 539) / 1920 + 'px';
    },
    onFocusSearch() {
      this.$refs['searInput'].focus();
    },
    ...mapActions({
      getBanners: GET_BANNERLIST,
      getAllTickers: GET_TICKERLIST,
      getAds: GET_ADS,
    }),
  },
  beforeDestroy() {
    this.setScrollTop();
  },
};
</script>

<style lang="scss">
@import '../assets/css/_theme-conf';

@mixin content {
  width: 62.5%;
  min-width: 1024px;
  max-width: 1180px;
  margin: 0 auto;
}
@keyframes fadeinB {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@mixin btnColor {
  .light & {
    background-color: #6aa0ff;
  }
  .dark & {
    background-color: #477bf7;
  }
}

@mixin phoneImg {
  .light & {
    background: url(~assets/images/phone-light.png) no-repeat center top / cover;
  }
  .dark & {
    background: url(~assets/images/phone-dark.png) no-repeat center top / cover;
  }
}

.fadeinB_slow {
  animation: fadeinB 1.8s ease forwards;
}

.fadeinC {
  animation: fadeinB 1.8s ease forwards;
}
.fadeinD {
  animation: fadeinB 1.8s ease forwards;
}
.fadeinE {
  animation: fadeinB 1.8s ease forwards;
}
.home-loading {
  // position: relative;
  min-height: 2958px;
  .loading-content {
    position: relative;
    height: 100vh;
  }
}
.container {
  position: relative;
  .carouse-item-box {
    position: relative;
    width: 100%;
    height: 100%;

    .bg-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(~static/images/banner1.png) no-repeat center / cover;

      img {
        max-width: 100%;
      }
    }
  }

  .home-market {
    color: #666;
    cursor: pointer;
    em {
      color: rgba(0, 0, 0, 0.3);
    }
  }

  .all-trade {
    position: relative;
    @include content;
    min-height: 628px;
    padding: 0 10px;
    margin: 50px auto 0;

    .search-form {
      position: absolute;
      top: 0;
      right: 10px;

      input {
        width: 249px;
        height: 34px;
        padding: 0 24px;
        border: 1px solid $light008;

        &:focus {
          outline: none;
        }
      }

      span {
        position: absolute;
        top: 5px;
        right: 24px;
        width: 20px;
        height: 20px;
        cursor: pointer;

        i {
          color: $light005;
        }
      }
    }

    .trade-tabs {
      position: relative;
      bottom: -1px;
      display: flex;
      justify-content: flex-start;

      li {
        cursor: pointer;
        position: relative;
        width: 130px;
        height: 40px;
        margin-left: -1px;
        line-height: 40px;
        color: #666;
        letter-spacing: -0.16px;
        font-weight: 500;
        text-transform: uppercase;
        text-align: center;
        background: $light002;
        border: 1px solid $light008;

        &.active {
          background: $light001;
          border-bottom: none;
        }
        i {
          display: inline-block;
          width: 18px;
          height: 18px;
        }
      }
    }
    .trade-tables {
      max-height: 588px;
      margin-bottom: 128px;
      color: #666;
      background: $light002;
      border: 1px solid $light008;

      .m-coin {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
  .about-block {
    margin: 0 auto;
    margin-top: 108px;
    min-width: 1024px;
    width: 62.5%;
    max-width: 1180px;
    h1 {
      opacity: 0;
      font-size: 34px;
      @include fontPair(color);
      line-height: 48px;
      margin-bottom: 38px;
      text-align: center;
    }
    h3 {
      opacity: 0;
      font-size: 26px;
      line-height: 64px;
      color: $light004;
      text-align: center;
      margin-bottom: 65px;
    }

    .center-img {
      margin: 0 auto 120px;
      text-align: center;
      img {
        width: 940px;
      }
    }

    h2 {
      position: relative;
      margin-bottom: 91px;
      font-size: 34px;
      text-align: center;
      @include fontPair(color);

      &:after {
        content: '';
        position: absolute;
        bottom: -24px;
        left: 50%;
        width: 48px;
        height: 3px;
        margin-left: -24px;
        opacity: 0.75;
        background: #6aa0ff;
      }
    }
    .about-content {
      @include content;
      margin: 0;
      width: 100%;

      ul {
        > li {
          display: flex;
          justify-content: space-between;
          &:not(:last-of-type) {
            margin-bottom: 44px;
          }
          dl {
            position: relative;
            text-align: left;
            display: flex;
            dt {
              &:nth-child(1) {
                margin-right: 34px;
                margin-left: 0px;
              }
              font-weight: 600;

              line-height: 30px;
              .title {
                font-size: 18px;
                @include fontPair(color);
              }
              .des {
                width: 198px;
                font-size: 14px;
                @include subFontPair(color);
                margin-top: 18px;
              }
              img {
                width: 72px;
                height: 72px;
              }
            }

            dd {
              font-size: 16px;
              line-height: 36px;
              color: #838baf;
            }
          }
        }
      }
    }
  }
  .download {
    z-index: 0;
    position: relative;
    width: 100%;
    margin-top: 55px;
    background: url(~assets/images/download.png) no-repeat center bottom / cover;
    .download-content {
      position: relative;
      margin: 0 auto;
      min-width: 1024px;
      width: 62.5%;
      max-width: 1180px;
      height: 520px;
      display: flex;
      .phone-img {
        overflow: hidden;
        position: absolute;
        left: -31px;
        bottom: 0;
        width: 462px;
        height: 520px;
        @include phoneImg();
      }
      .download-right {
        margin-left: 560px;
        margin-top: 152px;
        width: 450px;
        h3 {
          position: relative;
          margin-bottom: 69px;
          font-size: 34px;
          line-height: 1;
          @include fontPair(color);
          &::before {
            content: '';
            position: absolute;
            bottom: -24px;
            left: 0;
            width: 48px;
            height: 3px;
            opacity: 0.75;
            background: #6aa0ff;
          }
        }
        .download-test {
          font-size: 16px;
          @include subFontPair(color);
          margin-top: 20px;
        }
        div {
          margin-top: 72px;
          display: flex;
          a {
            position: relative;
            overflow: hidden;
            display: block;
            width: 196px;
            height: 52px;
            margin-right: 56px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            line-height: 52px;
            text-align: center;
            border-radius: 4px;
            @include btnColor();
            transition: 0.5s ease;

            span {
              z-index: 10;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              transition: 0.5s ease;

              &.android {
                background: url(~assets/images/android.png) no-repeat center;
                background-size: 100%;
              }
              &.iphone {
                background: url(~assets/images/iphone.png) no-repeat center;
                background-size: 100%;
              }
            }
            em {
              z-index: 11;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
            &:hover {
              background: #6193eb;
              > span {
                transform: scale(1.1) translate(8px, 0);
              }
            }
          }
        }
      }
    }
  }

  .bg-footer-bar {
    z-index: 1;
    position: relative;
    height: 35px;
    background-image: linear-gradient(-269deg, #1c4aff 0%, #2f8fff 100%);
  }
}
.swiper-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.my-swiper {
  .swiper-slide {
    position: relative;
    text-align: center;
    font-size: 38px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    .img-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    a {
      display: block;
    }
  }
  .swiper-pagination {
    > .swiper-pagination-bullet {
      background-color: red;
    }
  }
}
</style>
