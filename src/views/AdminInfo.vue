<template>
  <div>
    <el-card class="box-card" style="width:400px">
        <div slot="header" class="clearfix">
            <span>{{ admin.name }}</span>
        </div>
        <div>
            <div style="display: flex;justify-content: center;">
                <el-upload
                action="/admin/userface"
                :headers="header"
                :data="admin"
                :on-success="onSuccess"
                :show-file-list="false"
                >
                <img :src="admin.userFace" title="点击修改用户头像" style="height: 100px; width: 100px;border-radius: 50px;" alt="">
                </el-upload>
               
            </div>
            <div>
                <div style="margin-top: 3px;">电话号码：<el-tag>{{ admin.telephone }}</el-tag></div>
                <div style="margin-top: 3px;">手机号码：<el-tag>{{ admin.phone }}</el-tag></div>
                <div style="margin-top: 3px;">居住地址：<el-tag>{{ admin.address }}</el-tag></div>
                <div style="margin-top: 3px;">用户标签：<el-tag type="success" v-for="(r,index) in admin.roles" :key="index">{{ r.nameZh }}</el-tag></div>
                <div style="display: flex;justify-content: space-around;margin-top: 10px;">
                    <el-button type="primary" @click="showUpdateAdminInfoView">修改信息</el-button>
                    <el-button type="danger" @click="showUpdatePasswordView">修改密码</el-button>
                </div>
            </div>
            <el-dialog
                title="编辑用户信息"
                :visible.sync="dialogVisible"
                width="30%"
                >
                <div>
                    <table>
                        <tr>
                            <td>用户昵称：</td>
                            <td><el-input v-model="admin2.name"></el-input></td>
                        </tr>
                        <tr>
                            <td>电话号码：</td>
                            <td><el-input v-model="admin2.telephone"></el-input></td>
                        </tr>
                        <tr>
                            <td>手机号码：</td>
                            <td><el-input v-model="admin2.phone"></el-input></td>
                        </tr>
                        <tr>
                            <td>用户地址：</td>
                            <td><el-input v-model="admin2.address"></el-input></td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
            title="编辑用户信息"
            :visible.sync="passwordDialogVisible"
            width="30%">
                <div>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="请输入旧密码" prop="oldPass">
                            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="请输入新密码" prop="pass">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </el-dialog>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    name:'AdminInfo',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm.checkPass !== '') {
                this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            header:{
                Authorization:window.sessionStorage.getItem('tokenStr')
            },
            admin:{
                name:'',
                telephone:'',
                phone:'',
                address:'',
                roles:[]
            },
            admin2:{
                name:'',
                telephone:'',
                phone:'',
                address:'',
                roles:[]
            },
            dialogVisible:false,
            passwordDialogVisible:false,
            ruleForm: {
                pass: '',
                checkPass: '',
                oldPass: ''
             },
            rules: {
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                oldPass: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        onSuccess(){
            this.initAdmin()
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.ruleForm.adminId=this.admin.id
                this.putRequest('/admin/pass',this.ruleForm).then(resp=>{
                    if(resp){
                        //更新密码后处理
                        this.postRequest('/logout')
                        window.sessionStorage.removeItem('user')
                        window.sessionStorage.removeItem('tokenStr')
                        this.$store.commit('initRoutes',[])
                        this.$router.replace('/')
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        showUpdatePasswordView(){
            this.passwordDialogVisible=true
        },
        updateAdminInfo(){
            this.putRequest('/admin/info',this.admin2).then(resp=>{
                if(resp){
                    this.dialogVisible=false
                    this.initAdmin()
                }
            })
        },
        showUpdateAdminInfoView(){
            this.dialogVisible=!this.dialogVisible
        },
        initAdmin(){
            this.getRequest('/admin/info').then(resp=>{
                if(resp){
                    this.admin=resp
                    this.admin2=Object.assign({},this.admin)
                    window.sessionStorage.setItem('user',JSON.stringify(resp))
                    this.$store.commit('INIT_ADMIN',resp)
                }
            })
        }
    },
    mounted(){
        this.initAdmin()
    }
}
</script>

<style>

</style>