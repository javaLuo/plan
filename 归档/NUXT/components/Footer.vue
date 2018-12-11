<template>
  <footer :class="activePage">
    <el-row class="foot-content">
      <el-col :xs="6"
              :md="8"
              :lg="8"
              class="foot-left">
        <nuxt-link class="logo"
                   to="/">
          <img src="~/assets/images/logo@2x.png"
               alt="logo">
        </nuxt-link>
        <nav>
          <a target="_blank"
             href="https://www.facebook.com/rightbtc"><img src="~/assets/images/footer-icon1.png"
                 alt=""></a>
          <a target="_blank"
             href="https://twitter.com/Rightbtc_"><img src="~/assets/images/footer-icon2.png"
                 alt=""></a>
          <a target="_blank"
             href="https://t.me/RightbtcExchange"><img src="~/assets/images/footer-icon3.png"
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
            <!-- <a target="_blank"
               :href="`${localhost}${services[locale][4]}`">API</a> -->
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
      activePage: state => state.activePage,
    }),
  },
};
</script>

