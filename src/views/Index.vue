<template>
    <a-layout id="components-layout-demo-fixed">
        <Header :staticData="staticData" :userData="userData" />
        <LayoutComp
            :openKeys="openKeys"
            :leftMenuData="leftMenuData"
            :src="src"
        />
    </a-layout>
</template>

<script>
import Header from "@/components/Header";
import LayoutComp from "@/components/Layout";

const staticData = window.staticContentConfig.staticData;
export default {
    name: "Index",
    components: {
        Header,
        LayoutComp,
    },
    data() {
        return {
            staticData,
            rootSubmenuKeys: ["1", "2"],
            openKeys: ["main0"],
            defaultSelectedKeys: ["0"],
            leftMenuData: [
                {
                    name: "系统管理",
                    path: "",
                    icon: "setting",
                    children: [
                        { name: "测试页面", path: "demo" },
                        {
                            name: "用户管理--单角色分配",
                            path: "userManagement",
                        },
                        {
                            name: "用户管理--多角色分配",
                            path: "userManagementRoles",
                        },
                        { name: "角色管理", path: "roleManagement" },
                        { name: "部门管理", path: "developmentManagement" },
                        { name: "菜单管理", path: "menuPowerManagement" },
                    ],
                },
            ],
            userData: {}, //用户数据
            src: "", //集成html页面地址
        };
    },
    created() {
        // this.loadCurrentUser();
    },
    methods: {
        loadCurrentUser() {
            this.$axios.get("/currentUser").then((data) => {
                if (data.data.code == 200) {
                    this.userData = data.data.data;
                    if (!this.userData || this.userData.name == "") {
                        this.$router.push({ name: "login" });
                    }
                }
            });
        },
    },
};
</script>

<style>
</style>
