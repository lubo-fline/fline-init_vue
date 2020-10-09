<template>
    <icon-font :type="iconName" :class="'icon '+iconClass" />
</template>

<script>
import { Icon } from 'ant-design-vue';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1570505_5cb7130m97h.js',
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