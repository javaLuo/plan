<template>
  <span>
    <i :class="['token-logo', 'default-icon', `${coin.toUpperCase()}`]"></i> {{coin.toUpperCase()}}
  </span>
</template>

<script>
export default {
  props: ['coin'],
};
</script>