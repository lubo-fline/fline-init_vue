<template>
    <a-layout>
        <a-layout-sider>
            <a-menu
                mode="inline"
                :defaultSelectedKeys="['child00']"
                :openKeys="openKeys"
                @openChange="onOpenChange"
            >
                <template v-for="(item, index) in leftMenuData">
                    <a-menu-item
                        @click="clickMenuTitle(item)"
                        v-if="item.children.length == 0"
                        :key="'main' + index"
                    >
                        {{ item.name }}
                    </a-menu-item>
                    <a-sub-menu
                        :key="'main' + index"
                        v-if="item.children.length != 0"
                    >
                        <span slot="title">
                            <a-icon :type="item.icon" />
                            <span>{{ item.name }}</span>
                        </span>
                        <a-menu-item
                            @click="clickMenuTitle(item, element)"
                            :title="element.name"
                            v-for="(element, num) in item.children"
                            :key="'child' + index + num"
                        >
                            {{ element.name }}
                        </a-menu-item>
                    </a-sub-menu>
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout class="padding20">
            <a-layout-content>
                <router-view :src="src" v-if="isRouterAlive"></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
export default {
    name: "Layout",
    props: {
        openKeys: {
            type: Array,
            default: () => [],
        },
        leftMenuData: {
            type: Array,
            default: () => [],
        },
        src: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            isRouterAlive: true, //路由刷新判断
        };
    },
    mounted() {},
    methods: {
        onOpenChange(openKeys) {
            //菜单只打开选中的
            const latestOpenKey = openKeys.find(
                (key) => this.openKeys.indexOf(key) === -1
            );
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys;
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        },
        clickMenuTitle(item, element) {
            //路由跳转，面包屑设置
            if ((element && element.path !== "") || item.path !== "") {
                this.$router.push({ name: element ? element.path : item.path });
            } else {
                this.$message.error("快马加班赶制中！");
            }
            this.reload();
        },
        //点击菜单可以刷新当前页面
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => (this.isRouterAlive = true));
        },
    },
};
</script>
<style lang="less" scoped>
</style>