<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示记录 右侧显示按钮 -->
        <!-- 插槽第一个方式 -->
        <!-- <span slot="before">共{{ list.total }}条记录</span> -->
        <!-- 第二个方式 -->
        <template v-slot:before>
          <span>{{ page.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="warning" @click="$router.push('import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" :data="list">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter="formatEmployment" />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <!-- 作用域插槽 将时间格式化 -->
          <template v-slot="obj">
            <!-- 过滤器组件 -->
            {{ obj.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template slot-scope="{ row }">
            <!-- 插槽控制开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination :current-page="page.page" :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
      </el-row>
    </div>
    <!-- 新增弹窗组件 -->
    <!-- sync 子组件可以改变父组件 的语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
export default {
  components: { AddEmployee },
  data() {
    return {
      // 加载
      loading: false,
      // 接收
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false
      // 表头
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      // const obj2 = EmployeeEnum.hireType.find((item) => item.id === 2)
      return obj ? obj.value : '非正式'
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除么？')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出方法
    exportData() {
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async(excel) => {
        // 调用接口将数据转成一页
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // 数据类型转化
        const data = this.formatJson(headers, rows)
        // 复杂表头
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: data, // 具体数据 必填
          filename: '员工信息表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader,
          merges
        })
      })
    },
    // formatJson(headers, rows) {
    //   return rows.map((item) => {
    //     return Object.keys(headers).map((key) => {
    //       if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
    //         return formatDate(item[headers[key]]) // 返回格式化之前的时间
    //       } else if (headers[key] === 'formOfEmployment') {
    //         var en = EmployeeEnum.hireType.find((obj) => obj.id === item[headers[key]])
    //         return en ? en.value : '未知'
    //       }
    //       return item[headers[key]]
    //     })
    //   })
    // },
    formatJson(headers, rows) {
      return rows.map((item) => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map((key) => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find((obj) => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    }
  }
}
</script>

<style></style>
