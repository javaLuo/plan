<template>
  <div :class="[theme, 'theme']">
    <silver-header />
    <nuxt />
    <silver-footer />
    <!-- <GlobalInfoBox/> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SilverHeader from '~/components/SilverHeader.vue';
import SilverFooter from '~/components/SilverFooter.vue';
import GlobalInfoBox from '~/components/GlobalInfoBox';

export default {
  components: {
    SilverHeader,
    SilverFooter,
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

<style>
</style>
