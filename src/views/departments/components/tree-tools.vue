<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px"
  >
    <!-- 两列 第一列 -->
    <el-col>
      <!-- 标题 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 两列 第二列 -->
    <el-col :span="4">
      <!-- 右边里面再放一行 -->
      <el-row type="flex" justify="end">
        <!-- 这一行里面再放两列 -->
        <!-- 第一列是负责人 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <!-- 第二列是下拉菜单 -->
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 下拉内容 -->
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    // 定义传入属性
    treeNode: {
      required: true, // 必填
      type: Object // 对象类型
    },
    // 增加一个新的属性 **`isRoot（是否根节点）`**进行控制
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加
        // 添加子部门的操作
        // 告诉父组件 显示弹层
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        // 编辑
      } else {
        // 删除
        // 判断是否删除
        this.$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 成功进入这个 获取到要删除的id 然后传值 返回一个对象
          // console.log(delDepartments(this.treeNode.id))
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 删除成功
          // 页面数据要调给父组件 自定义触发事件
          this.$emit('delDepts')
          this.$$message.success('删除部门成功！')
        })
      }
    }
  }
}
</script>
