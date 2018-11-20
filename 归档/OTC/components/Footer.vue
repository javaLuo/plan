<template>
  <footer>
    <div class="footer-content">
      <div :span="8"
           class="left">
        <div class="logo">
          <img src="~/static/header/logo@2x.png"
               alt="RightBTC" />
        </div>
        <nav class="icon-footer">
          <a class="facebook"
             target="_blank"
             href="https://www.facebook.com/rightbtc"
             title="facebook" />
          <a class="twitter"
             target="_blank"
             href="https://twitter.com/Rightbtc_"
             title="twitter" />
          <a class="telegram"
             target="_blank"
             href="https://t.me/RightbtcExchange"
             title="telegram" />
        </nav>
      </div>
      <div :span="16"
           class="right">
        <div class="content">
          <ul>
            <li>{{Footer.support}}</li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${service[locale][0]}`">{{Footer.FQA}}</a>
            </li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${service[locale][1]}`">{{Footer.helper}}</a>
            </li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${service[locale][2]}`">{{Footer.news}}</a>
            </li>
          </ul>
          <ul>
            <li>{{Footer.tremsLegal}}</li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${terms[locale][0]}`">{{Footer.termsUse}}</a>
            </li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${terms[locale][1]}`">{{Footer.rule}}</a>
            </li>
            <li>
              <a target="_blank"
                 :href="`${localhost}${terms[locale][2]}`">{{Footer.fee}}</a>
            </li>
          </ul>
          <ul>
            <li>{{Footer.aboutUs}}</li>
            <!-- <li>
              <a target="_blank"
                 :href="`${localhost}${about[locale][0]}`">{{Footer.aboutUs}}</a>
            </li> -->
            <li>
              <a target="_blank"
                 :href="`${localhost}${about[locale][0]}`">{{Footer.rightbtc}}</a>
            </li>
          </ul>
          <ul>
            <li>{{Footer.contact}}</li>
            <li>
              <a>info@rightbtc.com</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copy-right">
      <span>Copyright © 2013-2018 VIEWFIN-FZCO Inc. All rights reserved.</span>
      <span>V 2.0.1</span>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      localhost: 'https://support.rightbtc.com/hc',
      service: {
        en_us: ['/en-us/articles/360016073711', '/en-us/articles/360016013871', '/en-us/sections/360002042471'],
        zh_cn: ['/zh-cn/articles/360016073711', '/zh-cn/articles/360016013871', '/zh-cn/sections/360002042471'],
      },
      terms: {
        en_us: ['/en-us/articles/360015805612', '/en-us/articles/360015805652', '/en-us/articles/360016021351'],
        zh_cn: ['/zh-cn/articles/360015805612', '/zh-cn/articles/360015805652', '/zh-cn/articles/360016021351'],
      },
      about: {
        en_us: ['/en-us/articles/360015807052'],
        zh_cn: ['/zh-cn/articles/360015807052'],
      },
    };
  },
  computed: {
    ...mapState({
      locale: state => state.locale,
      Footer: state => {
        return state.i18n.App.Footer;
      },
    }),
  },
};
</script>

<style lang="scss">
footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(-180deg, #012167 0%, #000f3c 100%);
  .footer-content {
    width: 1180px;
    margin: 0 auto;
    display: flex;
    padding-top: 38px;
    justify-content: space-between;
    .left {
      .logo {
        text-align: right;
        width: 150px;
        img {
          width: 100%;
        }
      }
      .icon-footer {
        display: flex;
        justify-content: space-between;
        width: 150px;
        margin: 32px 0 41px;

        a {
          width: 26px;
          height: 26px;
          background-size: 22px !important;
          display: inline-block;
          background: #c4c2d0;
          margin-right: 12px;
        }
        .twitter {
          background: url('~/assets/images/footer-icon2.png') no-repeat;
          // &:hover {
          // 	background: url('~/static/footer/twitter_active.png') no-repeat;
          // }
        }
        .facebook {
          background: url('~/assets/images/footer-icon1.png') no-repeat;
          // &:hover {
          // 	background: url('~/static/footer/facebook_active.png') no-repeat;
          // }
        }
        .telegram {
          background: url('~/assets/images/footer-icon3.png') no-repeat;
          // &:hover {
          // 	background: url('~/static/footer/telegram_active.png') no-repeat;
          // }
        }
      }
    }
    .right {
      flex-grow: 0.65;
      .content {
        display: flex;
        justify-content: space-between;
        ul > li:first-child {
          font-size: 16px;
          padding-bottom: 17px;
        }
        ul > li {
          font-size: 16px;
          color: #b3c5f3;
          a {
            font-size: 12px;
            color: rgba(179, 197, 243, 0.6);
          }
          padding-bottom: 8px;
        }
      }
    }
  }
  .copy-right {
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
    font-size: 12px;
    color: rgba(179, 197, 243, 0.6);
    border-top: 1px solid #192f67;
    margin-top: 20px;
    span {
      display: block;
      padding: 0 10px;
      max-width: 1180px;
      margin: 0 auto;
    }
  }
}
</style>
