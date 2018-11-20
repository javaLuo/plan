<template>
  <div class="default-layout">
    <div class="main-content">
      <Header />
      <div class="container">
        <nuxt/>
      </div>
      <Footer />
    </div>
    <div class="order-right"
         v-if="rightOrderShow">
      <OrderMessage></OrderMessage>
    </div>
  </div>
</template>
<script>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import OrderMessage from '~/components/Order/OrderMessage.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Header,
    Footer,
    OrderMessage,
  },
  computed: {
    ...mapState({
      rightOrderShow: state => state.rightOrderShow,
    }),
  },
};
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  justify-content: flex-start;

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    > div.container {
      flex: 1;
    }

    > footer {
      min-height: 256px;
      flex: 0;
    }
  }

  .order-right {
    position: relative;
    width: 344px;
    height: 100%;
  }
}
</style>
