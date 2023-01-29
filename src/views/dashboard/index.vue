<template>
  <div class="dashboard-container">
    <div>主页</div>
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <template v-slot:before>
        <span>nihenhao</span>
      </template>
      <el-button slot="after" type="primary">导入</el-button>
    </page-tools>
    <div>
      <upload-excel />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 已经全局注册组件了
// import PageTools from '@/components/PageTools/index.vue'
// import UploadExcel from '@/components/UploadExcel/index.vue'

export default {
  name: 'Dashboard',
  components: {
    // PageTools
  },
  computed: {
    ...mapGetters(['name'])
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
