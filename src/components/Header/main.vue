<template>
    <a-layout-header>
        <span class="fontSize20">
            <icon-font :type="'iconlogo'"></icon-font>
            <!--需要修改logo图标-->
            <span class="marginL15">{{ staticData.potalEnteryName }}</span>
        </span>
        <div class="pull-right">
            <a-icon type="bell" />
            <span>欢迎您，{{ userData.name || "访问者" }}</span>
            <a-divider type="vertical" />
            <span @click="logout">退出</span>
        </div>
    </a-layout-header>
</template>
<script>
export default {
    name: "Header",
    props: {
        staticData: {
            type: Object,
            default: () => {},
        },
        userData: {
            type: Object,
            default: () => {},
        },
    },
    mounted() {},
    methods: {
        //退出登录
        logout() {
            this.$axios
                .post("/logout")
                .then((res) => {
                    this.$router.push("/login");
                    this.$message.success("注销成功！");
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="less" scoped>
</style>