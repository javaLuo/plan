<template>
<div class="__nuxt-error-page">
  <div class="error">
    <div class="title">{{ message }}</div>
    <p class="description" v-if="statusCode === 404">
      <img src="~/assets/images/404@2x.png" />
      <nuxt-link class="error-link" to="/"></nuxt-link>
    </p>
  </div>
</div>
</template>

<script>
export default {
  name: 'error',
  props: ['error'],
  head () {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
        }
      ]
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || '1231'
    }
  }
}
</script>

<style>
.__nuxt-error-page {
  z-index: 100;
  padding: 1rem;
  background: #F7F8FB;
  color: #47494E;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased; 
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.__nuxt-error-page .error {
  position: relative;
  top: -100px;  
}
.__nuxt-error-page .title {
  font-size: 1.5rem;
  margin: 16px 0;
  color: #47494E;
}
.__nuxt-error-page .description {
  position: relative;
  width: 500px;
  color: #7F828B;
  line-height: 21px;
}
.__nuxt-error-page .description img {
  width: 100%;
}
.__nuxt-error-page .description a {
  position: absolute;
  bottom: 0;
  right: 62px;
  width: 110px;
  height: 24px;
  /* background: rgba(0, 0, 0, .25); */
}
.__nuxt-error-page a {
  color: #7F828B !important;
  text-decoration: none;
}
.__nuxt-error-page .logo {
  position: fixed;
  left: 12px;
  bottom: 12px;
}
</style>