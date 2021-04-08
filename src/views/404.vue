<!-- 404 -->
<template>
    <div>
        <a-row class='marginT200' type="flex" justify="center" align="middle">
            <a-col :span='10' >
                <img src="@a/image/404.svg" width="100%"/>
            </a-col>
            <a-col :span='8'>
                <div class='fx_errorCode'>404</div>
                <div class='fx_errorInfo'>抱歉，您访问的页面不存在</div>
                <a-button type="primary" @click='backIndex()'>返回首页</a-button>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        };
    },
    methods:{
        backIndex(){
            this.$router.push('index')
        }
    }
}
</script>
<style lang='less' scoped>
.marginT200{
    margin-top:200px;
}
.fx_errorCode {
    font-size: 96px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #17233d;
    line-height: 135px;
}
.fx_errorInfo {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #515a6e;
    line-height: 22px;
    margin-bottom: 30px;
}
</style>