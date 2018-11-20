<template>
  <div class="home-loading">
    <div class="loading-content">
      <div class="el-loading-mask">
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
</template>

<script>
export default {};
</script>
<style lang="scss">
.home-loading {
  max-height: 600px;
  // position: relative;
  // min-height: 2958px;
  .loading-content {
    position: relative;
    height: 600px;
  }
}
</style>
