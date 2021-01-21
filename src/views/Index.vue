<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model="collapsed" width='280' :trigger="null" collapsible>
            <div class="fx_logo">
                <img src='@a/image/logo.png' width='40'/>
                <div class='fx_titleBox' v-show='!collapsed'>
                    <div class='fx_projectTitle'>{{staticData.potalEnteryName}}</div>
                </div>
            </div>
            <a-menu :selectedKeys="selectedKeys" mode="inline" :defaultSelectedKeys="defaultSelectedKeys" :openKeys="openKeys" @openChange="onOpenChange" theme="dark">
                <template v-for='item in leftMenuData'>
                    <a-menu-item @click='clickMenuTitle(item)' v-if='item.children.length==0' :key='item.path' class='fx_specialItem'> 
                        <div class='fx_specialMenuItem'>
                            <span class='anticon'>
                                <icon-font :type="item.icon"/>
                            </span>
                            <span>{{ item.name }}</span>
                        </div>  
                    </a-menu-item>
                    <a-sub-menu :key="item.path" v-else>
                        <div slot="title">
                            <span class='anticon'>
                                <icon-font :type="item.icon" />
                            </span>
                            <span>{{ item.name }}</span>
                        </div>
                        <a-menu-item @click='clickMenuTitle(item,element)' class='fx_secondMenu' :title="element.name" v-for='element in item.children' :key='element.path'>   
                            {{element.name}}
                        </a-menu-item>
                    </a-sub-menu>
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header>
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="changeCollapsed"
                />
                <div class='pull-right'>
                    <a-icon type="bell" />
                    <span>欢迎您，{{userData.userName||'访问者'}}</span>
                    <a-divider type="vertical"/>
                    <span @click="logout" class='cursorP'>退出</span>
                </div>
            </a-layout-header>
            <a-layout-content>
                <div class='fx_menuTitle'><span></span>{{$route.meta.title}}</div>
                <div class='fx_content'>
                    <router-view v-if="isRouterAlive" :key="$route.fullPath" class='padding24'></router-view>
                </div>
                <footer class='text-center lineHeight30'>{{staticData.footerName}}</footer>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
const staticData = window.staticContentConfig.staticData
export default {
    data(){
        return{
            staticData,
            collapsed:false,
            rootSubmenuKeys: ['systemManage'], 
            openKeys: [],
            openKeysCache:[],
            defaultSelectedKeys:['systemManage'],
            leftMenuData:[
                {name:'系统管理',path:'systemManage',icon:'setting',children:[
                    {name:'用户管理--单角色分配',path:'userManagement'},
                    {name:'用户管理--多角色分配',path:'userManagementRoles'},
                    {name:'角色管理',path:'roleManagement'},
                    {name:'部门管理',path:'developmentManagement'},
                    {name:'菜单管理',path:'menuPowerManagement'},
                ]},
            ],
            userData:{},//用户数据
            isRouterAlive: true,//路由刷新判断
            selectedKeys:[]
        }
    },
    mounted(){
        // this.loadCurrentUser();
        this.initOpenKeys()
    },
    methods:{
        initOpenKeys(){
            let parentKey=''
            this.leftMenuData.forEach(item=>{
                if(item.children&&item.children.length>0){
                    if(item.children.find(element=>element.path==this.$route.name)){
						parentKey=item.path
					}
                }
            })
            this.openKeys=[parentKey]
            if(this.$route.name==='documentEditor'){
                this.openKeys=['main1']
                this.selectedKeys=['outsideManage']
            }else{
                this.selectedKeys=[this.$route.name]
            }
        },
        changeCollapsed(){
            this.collapsed = !this.collapsed
            if(this.collapsed===true){
                this.openKeysCache=JSON.parse(JSON.stringify(this.openKeys))
                this.openKeys=[]
            }else{
                this.openKeys=this.openKeysCache
            }
        },
        loadCurrentUser(){
            this.$axios.get(this.$api.userDataUrl).then((data) => {
                if (data.data.code == 200) {
                    this.userData=data.data.data
                    if(!this.userData||this.userData.userName==''){
                        this.$router.push({name:'login'});
                    };
                }
            });
        },
        //路由跳转，面包屑设置
        clickMenuTitle(item,element){
            if(element&&element.path!==''||item.path!==''){
                this.menuTitle=element?element.name:item.name
                this.isRouterAlive = false
                this.$router.push({name:element?element.path:item.path,params:{
                    pageParams:element?element.path:item.path
                }});
                this.selectedKeys=[]
                this.selectedKeys.push(element?element.path:item.path)
            }else{
                this.$message.error('快马加班赶制中！')
            }
            this.reload()
        },
        //菜单只打开选中的
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
                this.openKeysCache = latestOpenKey ? [latestOpenKey] : [];
            }
        },
        //退出登录
        logout(){
            this.$axios.get(this.$api.logoutUrl).then(res=>{
                this.$router.push('/login');
                this.$message.success('注销成功！');
            }).catch (err=>{
                console.log(err)
            })
        },
        //点击菜单可以刷新当前页面
        reload () {
            this.$nextTick(() => (this.isRouterAlive = true))
        } 
    }
}
</script>

<style lang='less' scoped>
.fx_logo{
    background: linear-gradient(180deg,#1b2b76, #242834);
    color: #ffffff;
    height:70px;
    text-align: center;
    line-height: 70px;
    .fx_titleBox{
        display: inline-block;
        vertical-align: middle;
        margin-left:10px;
    }
    .fx_projectTitle{
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        line-height: 28px!important;
        text-shadow: 0px 1px 3px 0px rgba(0,0,0,0.26); 
    }
    .fx_abbreviation{
        line-height:20px;
        text-align: left;
    }
}
.fx_secondMenu{
    position: relative;
}
.fx_menuTitle{
    height:70px;
    line-height: 70px;
    padding-left:26px;
    background: #ffffff;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #333333;
    span{
        width: 5px;
        height: 28px;
        background: #267cff;
        border-radius: 3px;
        margin-right:16px;
        display: inline-block;
        vertical-align: middle;
    }
}
.fx_content{
    min-height: calc(100vh - 180px);
}
</style>
