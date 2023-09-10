<template>
  <el-form 
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :model="loginForm" 
    :rules="rules" 
    ref="loginForm"
    class="loginContainer" >
        <h3 class="loginTitle">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" autocomplete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" autocomplete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input type="text" autocomplete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 250px;margin-right: 5px;"></el-input>
          <img :src="captchaUrl" @click="updateCaptcha"/>
        </el-form-item>
        <el-checkbox v-model="checked" class="loginRemeber">记住我</el-checkbox>
        <el-button type="primary" style="width: 100%;" @click="submit">登录</el-button>
  </el-form>

</template>

<script>
export default {
    name:'Login',
    data() {
      return {
        loginForm:{
          username:'admin',
          password:'123',
          code:''
        },
        checked:true,
        captchaUrl:'/captcha?time='+new Date(),
        rules:{
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
          code:[{required:true,message:'请输入验证码',trigger:'blur'}]
        },
        loading:false
      }
    },
    methods:{
      updateCaptcha(){
        this.captchaUrl='/captcha?time='+new Date()
      },
      submit(){
          this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading=true
            // 表单验证通过，执行提交操作
            this.postRequest('/login',this.loginForm).then(
              resp=>{
                if(resp){
                  this.loading=false
                  //存储用户token
                  const tokenStr = resp.obj.tokenHead+resp.obj.token
                  window.sessionStorage.setItem('tokenStr',tokenStr)
                  
                  //跳转用户页面
                  let path = this.$route.query.redirect;
                  this.$router.replace((path=='/'||path==undefined)?'/home':path);
                
                 
                }
                this.loading=false
              }
            )
            // console.log('登录成功')
          } else {
            // 表单验证失败，可以在这里处理错误提示或其他操作
            this.$message.error('请输入所有字段')

            return false
          }
        })
      }
    }

  
}
</script>

<style>
    .loginContainer{
      border-radius: 15px;
      background-clip: padding-box;
      margin: 180px auto;
      width:350px;
      padding: 15px 35px 15px 35px;
      background-color: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cacaca;
    }
    .loginTitle{
      margin:0px auto 40px auto;
      text-align: center;
    }
    .loginRemeber{
      text-align: left;
      margin: 0px 0px 15px 0px;
    }
    .el-form-item__content{
      display: flex;
      align-items: center;
    }
</style>