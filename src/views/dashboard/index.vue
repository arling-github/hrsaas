<template>
  <div class="dashboard-container">
    <div> 主页 </div>
    <div class="dashboard-text">name: {{ name }}</div>
    <button @click="this.$router.go(-1)">回退</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
