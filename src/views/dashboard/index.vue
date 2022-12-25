<template>
  <div class="dashboard-container">
    <div> 主页 </div>
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <template v-slot:before>
        <span>nihenhao</span>
      </template>
      <el-button slot="after" type="primary">导入</el-button>
    </page-tools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageTools from '@/components/PageTools/index.vue'

export default {
  name: 'Dashboard',
  components: {
    PageTools
  },
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
