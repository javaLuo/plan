<template>
  <footer>
    <div class="bg-footer-bar"></div>
    <el-row class="foot-content">
      <el-col :xs="6"
              :md="8"
              :lg="8"
              class="foot-left">
        <span class="logo">
          <nuxt-link v-if="locale === 'zh_cn'"
                     to="/sliverboard"><img src="~/assets/images/sl-logo@2x.png"
                 alt="logo" /></nuxt-link>
          <nuxt-link v-if="locale !== 'zh_cn'"
                     to="/sliverboard"><img src="~/assets/images/sl-logo-en@2x.png"
                 alt="logo" /></nuxt-link>
        </span>
        <nav>
          <a target="_blank"
             href="https://www.facebook.com/rightbtc"><img src="~/assets/images/footer-sl-icon1.png"
                 alt=""></a>
          <a target="_blank"
             href="https://twitter.com/Rightbtc_"><img src="~/assets/images/footer-sl-icon2.png"
                 alt=""></a>
          <a target="_blank"
             href="https://t.me/RightbtcExchange"><img src="~/assets/images/footer-sl-icon3.png"
                 alt=""></a>
        </nav>
      </el-col>
      <el-col :xs="18"
              :md="16"
              :lg="16"
              :offset="2"
              class="foot-right">
        <dl>
          <dt>{{Footer.support}}</dt>
          <dd>
            <a target="_blank"
               :href="`${localhost}${services[locale][0]}`">{{Footer.FAQ}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${services[locale][1]}`">{{Footer.Tutorial}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${services[locale][2]}`">{{Footer.news}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${services[locale][3]}`">{{Footer.Submit}}</a>
          </dd>
          <dd>
            <nuxt-link to="/ApiWeb/Public-API"
                       target="_blank">API</nuxt-link>
          </dd>
        </dl>
        <dl>
          <dt>{{Footer.privacyTop}}</dt>
          <dd>
            <a target="_blank"
               :href="`${localhost}${terms[locale][0]}`">{{Footer.ServiceAgreement}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${terms[locale][1]}`">{{Footer.LegalDisclaimer}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${terms[locale][2]}`">{{Footer.PrivacyPolicy}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${terms[locale][3]}`">{{Footer.FeeDescription}}</a>
          </dd>
        </dl>
        <dl>
          <dt>{{Footer.aboutUs}}</dt>
          <dd>
            <a target="_blank"
               :href="`${localhost}${about[locale][0]}`">{{Footer.About}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${about[locale][1]}`">{{Footer.Digital}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${about[locale][2]}`">{{Footer.application}}</a>
          </dd>
          <dd>
            <a target="_blank"
               :href="`${localhost}${about[locale][3]}`">{{Footer.UpdateLog}}</a>
          </dd>
        </dl>
        <dl>
          <dt>{{Footer.contact}}</dt>
          <dd>
            <a href="mailto:info@rightbtc.com">Info@rightbtc.com</a>
          </dd>
        </dl>
      </el-col>
    </el-row>
    <p class="copyright">
      <span>Copyright © 2013-2018 VIEWFIN-FZCO Inc. All rights reserved.</span>
      <span>V 2.2.3</span>
    </p>
  </footer>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      localhost: 'https://support.rightbtc.com/hc',
      services: {
        ru_ru: ['/en-us/articles/360008551812', '/en-us/articles/360008133332', '/en-us/sections/360001693052', '/en-us/requests/new', '/en-us/articles/360012809412'],
        en_us: ['/en-us/articles/360008551812', '/en-us/articles/360008133332', '/en-us/sections/360001693052', '/en-us/requests/new', '/en-us/articles/360012809412'],
        ja_jp: ['/en-us/articles/360008551812', '/en-us/articles/360008133332', '/en-us/sections/360001693052', '/en-us/requests/new', '/en-us/articles/360012809412'],
        zh_cn: ['/zh-cn/articles/360008551812', '/zh-cn/articles/360008133332', '/zh-cn/sections/360001693052', '/zh-cn/requests/new', '/en-us/articles/360012809412'],
      },
      terms: {
        ru_ru: ['/en-us/articles/360007479512', '/en-us/articles/360007906091', '/en-us/articles/360007715212', '/en-us/articles/360007906191'],
        en_us: ['/en-us/articles/360007479512', '/en-us/articles/360007906091', '/en-us/articles/360007715212', '/en-us/articles/360007906191'],
        ja_jp: ['/en-us/articles/360007479512', '/en-us/articles/360007906091', '/en-us/articles/360007715212', '/en-us/articles/360007906191'],
        zh_cn: ['/zh-cn/articles/360007479512', '/zh-cn/articles/360007906091', '/zh-cn/articles/360007715212', '/zh-cn/articles/360007906191'],
      },
      about: {
        ru_ru: ['/en-us/articles/360007715672', '/en-us/sections/360001723432', '/en-us/articles/360012792472', '/en-us/articles/360013996352'],
        en_us: ['/en-us/articles/360007715672', '/en-us/sections/360001723432', '/en-us/articles/360012792472', '/en-us/articles/360013996352'],
        ja_jp: ['/en-us/articles/360007715672', '/en-us/sections/360001723432', '/en-us/articles/360012792472', '/en-us/articles/360013996352'],
        zh_cn: ['/zh-cn/articles/360007715672', '/zh-cn/sections/360001723432', '/zh-cn/articles/360012792472', '/zh-cn/articles/360013996352'],
      },
    };
  },
  computed: {
    ...mapState({
      Footer: state => state.i18n.App.Footer,
      locale: state => state.locale,
    }),
  },
};
</script>
<style lang="scss" scoped>
footer {
  min-width: 1024px;
  background-image: linear-gradient(-180deg, #33375c 0%, #262845 100%);
  .bg-footer-bar {
    width: 100%;
    height: 36px;
    background-image: linear-gradient(-90deg, #3ab490 0%, #65d38a 100%);
  }
  .foot-content {
    padding: 55px 10px 0;
    .logo {
      img {
        width: auto !important;
        height: 23px;
      }
    }
    .foot-left {
      nav {
        width: 106px;
        margin: 28px 0 34px;
        a {
          width: 22px;
        }
      }
    }
    a {
      color: rgba(255, 255, 255, 0.6);
    }
    .foot-right {
      dl {
        dt {
          color: #fff;
        }
        dd {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .copyright {
    border-top: none;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>


