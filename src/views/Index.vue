<template>
    <a-layout id="components-layout-demo-fixed">
        <a-layout-header>
            <span class='fontSize20'>
                <icon-font :type='"iconlogo"'></icon-font>//需要修改logo图标
                <span class='marginL15'>{{$t('lang.projectName')}}</span>
            </span>
            <div class='pull-right'>
                <a-icon type="bell" />
                <span>欢迎您，{{userData.name||'访问者'}}</span>
                <a-divider type="vertical"/>
                <span @click="logout">退出</span>
            </div>
        </a-layout-header>
        <a-layout>
            <a-layout-sider>
                <a-menu mode="inline" :defaultSelectedKeys="['child00']" :openKeys="openKeys" @openChange="onOpenChange">
                    <template v-for='(item,index) in leftMenuData'>
                        <a-menu-item @click='clickMenuTitle(item)' v-if='item.children.length==0' :key='"main"+index'>   
                            {{item.name}}
                        </a-menu-item>
                        <a-sub-menu :key="'main'+index" v-if='item.children.length!=0'>
                            <span slot="title"><a-icon :type="item.icon"/><span>{{item.name}}</span></span>
                            <a-menu-item @click='clickMenuTitle(item,element)' :title="element.name" v-for='(element,num) in item.children' :key='"child"+index+num'>   
                                {{element.name}}
                            </a-menu-item>
                        </a-sub-menu>
                    </template>
                </a-menu>
            </a-layout-sider>
            <a-layout class='padding20'>
                <a-layout-content>
                    <router-view :src='src' v-if="isRouterAlive"></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
export default {
    data(){
        return{
            rootSubmenuKeys: ['1', '2'],
            openKeys: ['main0'],
            defaultSelectedKeys:['0'],
            leftMenuData:[
                {name:'系统管理',path:'',icon:'setting',children:[
                    {name:'用户管理--单角色分配',path:'userManagement'},
                    {name:'用户管理--多角色分配',path:'userManagementRoles'},
                    {name:'角色管理',path:'roleManagement'},
                    {name:'部门管理',path:'developmentManagement'},
                    {name:'菜单管理',path:'menuPowerManagement'},
                ]}
            ],
            userData:{},//用户数据
            src:'',//集成html页面地址
            isRouterAlive: true,//路由刷新判断
        }
    },
    created(){
        // this.loadCurrentUser();
    },
    methods:{
        loadCurrentUser(){
            this.$axios.get('/currentUser').then((data) => {
                if (data.data.code == 200) {
                    this.userData=data.data.data
                    if(!this.userData||this.userData.name==''){
                        this.$router.push({name:'login'});
                    };
                }
            });
        },
        clickMenuTitle(item,element){//路由跳转，面包屑设置
            if(element&&element.path!==''||item.path!==''){
                this.$router.push({name:element?element.path:item.path});
            }else{
                this.$message.error('快马加班赶制中！')
            }
            this.reload()
        },
        onOpenChange(openKeys) {//菜单只打开选中的
            const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },
        //退出登录
        logout(){
            this.$axios.post('/logout').then(res=>{
                this.$router.push('/login');
                this.$message.success('注销成功！');
            }).catch (err=>{
                console.log(err)
            })
        },
        //点击菜单可以刷新当前页面
        reload () {
            this.isRouterAlive = false
            this.$nextTick(() => (this.isRouterAlive = true))
        } 
    }
}
</script>

<style>

</style>
