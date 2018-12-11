<template>
  <div class="crumbs">
    {{crumb}}
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Utils from '~/utils'
export default {
  computed:{
    ...mapState({
      crumb: state => {
        return Utils.titleCase(state.crumb.substring(1, state.crumb.length))
      }
    })
  }
}
</script>
