<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh" @keydown.enter.native="doAddRole">
      </el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permissManaMain" >
      <el-collapse  v-model="activeName" accordion @change="change">
      <el-collapse-item v-for="(item, index) in roles" :key="index" :title="item.nameZh" :name="item.id" @click="updateSelectedMenus(item.id)">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>可访问资源</span>
            <el-button style="float: right; padding: 3px 0; color: red;" type="text" icon="el-icon-delete" @click="doDeleteRole(item)"></el-button>
          </div>
          <div>
            <el-tree  ref="tree" :key="index" show-checkbox :data="getTreeData(index)" :props="defaultProps" :default-checked-keys="selectedMenus" node-key="id"
           ></el-tree>
            <div style="display: flex;justify-content: flex-end; margin-top: 6px;">
              <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
              <el-button size="mini" type="primary" @click="doUpdate(item.id,index)">确认修改</el-button>
            </div>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
    name:'PermissMana',
    data() {
      return {
          role:{
            name:'',
            nameZh:''
          },
          roles:[],
          activeName:-1,
          allMenus:[],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          selectedMenus:[],
          
      }
    },
    methods:{
      updateSelectedMenus(rid){
        this.initSelectMenus(rid, () => {
         this.$nextTick(() => {
             this.$refs.tree[index].setCheckedKeys(this.selectedMenus);
          });
        });
      },
      getTreeData(index) {
          return [...this.allMenus]; // 创建副本，确保每次都是新的数组
       },
      doDeleteRole(role){
        this.$confirm('此操作将永久删除['+role.nameZh+']角色, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/permiss/role/'+role.id).then(resp=>{
                  if(resp){
                    this.initRoles();
                  }
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
      },
      doAddRole(){
        if(this.role.name && this.role.nameZh){
          this.postRequest('/system/basic/permiss/role',this.role).then(resp=>{
            if(resp){
              this.initRoles()
              this.role.name=''
              this.role.nameZh=''
            }
          })
        }else{
          this.$message.error('所有字段不能为空')
        }
      },
      cancelUpdate(){
        this.activeName=-1
      },
      doUpdate(rid,index){
       let tree= this.$refs.tree[index]
       let selectedKeys= tree.getCheckedKeys(true)
       let url='/system/basic/permiss/?rid='+rid
       selectedKeys.forEach(key=>{
        url+='&mids='+key
       })
       this.putRequest(url).then(resp=>{
        if(resp){
          this.activeName=-1
        }
       })
      },
      change(rid){
        if(rid){
          this.initAllMenus()
          this.initSelectMenus(rid)
      
        }
      },
      initSelectMenus(rid){
        this.getRequest('/system/basic/permiss/mid/'+rid).then(resp=>{
          if(resp){
            this.selectedMenus=resp
          }
        })
      },
      initAllMenus(){
        this.getRequest('/system/basic/permiss/menus').then(resp=>{         
          if(resp){
            const allMenus = resp // 创建独立副本
            this.allMenus = allMenus // 更新组件的渲染数据
          }
        })
      },
      initRoles(){
        this.getRequest('/system/basic/permiss/').then(resp=>{
          if(resp){
            this.roles=resp
          }
        })
      }
    },
    mounted(){
      this.initRoles()
    },
}
</script>

<style>
.permissManaTool{
  display: flex;
  justify-content: flex-start;
}
.permissManaTool .el-input{
  width:300px;
  margin-right: 6px;
}
.permissManaMain{
  margin-top: 10px;
  width:700px
}
</style>