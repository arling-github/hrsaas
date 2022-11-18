<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 卡片布局 -->
      <el-card class="tree-card">
        <!-- 一行 头部 -->
        <!-- 封装成组件了 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置树型图 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 插槽复制 -->
          <!-- 封装成组件了 调用组件-->
          <tree-tools slot-scope="{ data }" :tree-node="data" style="height: 40px;width: 100%" @delDepts="getDepartments" @addDepts="addDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 弹出层 输入框 -->
    <AddDept :show-dialog="showDialog" :tree-node="node" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  // 引入组件
  components: {
    TreeTools: TreeTools,
    AddDept: AddDept
  },
  data() {
    return {
      company: {},
      // data: [
      //   {
      //     label: '一级 1',
      //     children: [
      //       {
      //         label: '二级 1-1',
      //         children: [
      //           {
      //             label: '三级 1-1-1'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     label: '一级 2',
      //     children: [
      //       {
      //         label: '二级 2-1',
      //         children: [
      //           {
      //             label: '三级 2-1-1'
      //           }
      //         ]
      //       },
      //       {
      //         label: '二级 2-2',
      //         children: [
      //           {
      //             label: '三级 2-2-1'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     label: '一级 3',
      //     children: [
      //       {
      //         label: '二级 3-1',
      //         children: [
      //           {
      //             label: '三级 3-1-1'
      //           }
      //         ]
      //       },
      //       {
      //         label: '二级 3-2',
      //         children: [
      //           {
      //             label: '三级 3-2-1'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      departs: [],
      // 弹窗的显示控制变量
      showDialog: false,
      // 记录当前点击的node节点
      node: null
    }
  },
  // 钩子函数调用方法
  created() {
    this.getDepartments() // 结构数据初始调用
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 树形图封装成一个函数了
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      console.log(result)
    },
    // 监听tree-tools触发添加的事件
    addDepts(node) {
      this.showDialog = true
      this.node = node
    }
  }
}
</script>

<style scoped="less">
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
