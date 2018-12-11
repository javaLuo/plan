<template>
  <div :class="[theme, 'theme']">
    <Header ref="header" />
    <nuxt />
    <Footer />
    <!-- <GlobalInfoBox/> -->
  </div>
</template>
<script>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import GlobalInfoBox from '~/components/GlobalInfoBox';
import { mapState } from 'vuex';

export default {
  components: {
    Header,
    Footer,
    GlobalInfoBox,
  },
  mounted() {
    this.$nextTick(() => {
      var element = document.createElement('script');
      element.onload = () => {
        let lang = 'en-US';
        switch (this.appLocal) {
          case 'ja_jp':
            lang = 'ja';
            break;
          case 'zh_cn':
            lang = 'zh-CN';
            break;
          case 'ru_ru':
            lang = 'ru-RU';
            break;
        }
        setTimeout(() => {
          zE &&
            zE(() => {
              zE.setLocale(lang);
            });
        }, 800);
      };
      element.src = 'https://static.zdassets.com/ekr/snippet.js?key=b2d70176-39d4-4e38-9667-236aa0221027';
      element.id = 'ze-snippet';
      document.body.appendChild(element);
    });
  },
  computed: {
    ...mapState({
      theme: state => state.theme,
      appLocal: state => state.locale,
    }),
  },
};
</script>
