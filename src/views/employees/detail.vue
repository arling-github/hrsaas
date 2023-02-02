<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top: 30px">
              <el-form-item label="姓名:">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <component :is="userComponent" />
            <!-- <user-info /> -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置岗位信息 -->
            <component :is="jobComponent" />
            <!-- <job-info /> -->
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user' // 读取数据接口
import { saveUserDetailById } from '@/api/employees' // 更新接口
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id, // 通过路由取id 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: '',
        // 获取的密码是密文， 最后保存的时候把这个给接口就行
        password2: ''
      },
      //   校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      },
      userComponent: 'user-info',
      jobComponent: 'job-info'
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 这里有个缺陷，接口中读取的是后端的密文，我们并不能解密，所以当我们没有任何修改就保存时，会校验失败，因为密文超过了规定的12位长度，为了真的修改密码，我们设定了一个临时的字段 **password2**，用它来存储我们的修改值，最后保存的时候，把**password2**传给**password**
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
