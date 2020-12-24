<template>
    <icon-font :type="iconName" :class="'icon '+iconClass" />
</template>

<script>
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2003100_w1f26d8iw8.js',
});
export default {
    props:{
        iconName:{
            type:String
        },
        iconClass:{
            type:String
        },
    },
    components: {
        IconFont,
    },
}
</script>

<style>

</style>