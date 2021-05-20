<template>
	<div class='fx_page' :style="{transform:transform}">
		<a-config-provider :locale="zhCN">
			<router-view/>
		</a-config-provider>
	</div>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import moment from 'moment';
	import 'moment/locale/zh-cn';
	moment.locale('zh-cn');
	export default {
		name: 'App',
		data() {
			return {
				zhCN,
				transform:'scale(1,1)'
			};
		},
		mounted(){
			// this.initScale()
			// window.onresize = () =>{
			// 	this.initScale()
			// }
		},
		methods:{
			initScale(){
				let height=window.innerHeight;
				let width=window.innerWidth;
				this.transform = 'scale('+width/1920+','+height/1080+')'
			},
		}	
	}
</script>
<style>
	/* .fx_page{
		width:1920px;
		height:1080px;
		overflow: hidden;
		-moz-transform-origin: 0 0;
		-webkit-transform-origin:0 0;
		-o-transform-origin:0 0;
	} */
</style>
