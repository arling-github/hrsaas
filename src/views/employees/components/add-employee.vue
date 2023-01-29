<template>
  <!-- 共用弹出层 -->
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放一个树形组件 -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="{ label: 'name' }" default-expand-all="" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <!-- <el-input v-model="formData.correctionTime" style="width: 50%" placeholder="请选择转正时间" /> -->
        <el-date-picker v-model="formData.correctionTime" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
    </el-form>
    <!-- 表单确认按钮 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="samll" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="samll" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum: EmployeeEnum,
      // 表单数据
      treeData: [],
      showTree: false,
      loading: false,
      // 表单校验数据结构
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }], // change原因是部门需要校验
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // showDialogoff() {
    //   this.showDialog = false
    // },
    // 部门选择的时候树形结构数据
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是一个数组 需要转换成树形结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 点击时把内容填到输入框
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 确定按钮
    async btnOK() {
      // 校验表单
      try {
        // 校验成功
        await this.$refs.addEmployee.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this 但是父组件不能放到element ui的组件里面
        // this.$emit
        this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (error) {
        // 失败
        console.log(error)
      }
    },
    btnCancel() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
      // update:props 这样写的话可以直接父组件 处理
      // this.$parent.showDialog = false
    }
  }
}
</script>

<style lang="less" scoped></style>
