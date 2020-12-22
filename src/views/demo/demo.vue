<template>
    <div>demo</div>
</template>
<script>
export default {
    name: "demo",
    data() {
        return {
            getAxios: this.$api.getAxios,
        };
    },
    created() {
        this.getTestAxios();
    },
    methods: {
        getTestAxios() {
            this.$axios.get(this.getAxios, {}).then((data) => {
                if (data.data.code === 200) {
                    console.log(data);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
</style>