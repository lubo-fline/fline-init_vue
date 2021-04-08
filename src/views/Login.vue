<template>
	<div class='fx_loginBg'>
		<a-row class='heightP100'>
			<a-col :span='16' class='heightP100'>
				<img src='@/assets/image/loginBg.png' width="100%" height="100%"/>
				<div class='fx_footer'>{{staticData.footerName}}</div>
				<div class='fx_loginTitleImg'>
					<img src='@/assets/image/logo.png'/>
					<span class='marginL8'>{{staticData.potalEnteryName}}</span>
					<span class='fontSize22 marginL8'>{{staticData.abbreviation}}</span>
				</div>
			</a-col>
			<a-col :span='8' class='heightP100'>
				<a-form :form='form' class='fx_loginForm'>
					<div class='fx_loginTitle'>欢迎登录</div>
					<a-form-item>
						<a-input placeholder="用户名" v-decorator="['loginName',{ rules: [{ required: true, message: '请输入用户名！' }] }]">
							<icon-font slot="prefix" type="iconwode" />
						</a-input>
					</a-form-item>
					<a-form-item>
						<a-input placeholder="密码" type="password" v-decorator="['password',{ rules: [{ required: true, message: '请输入密码！' }] }]">
							<icon-font slot="prefix" type="iconpassword" />
						</a-input>
					</a-form-item>
					<a-form-item>
						<a-input placeholder="验证码" v-decorator="['verifyCode',{ rules: [{ required: true, message: '请输入验证码！' }] }]">
							<icon-font slot="prefix" type="iconyanzhengma" />
							<img id="codeImg" :src="codeImg" @click="changeCode" slot="suffix" class="colorFFF"/>
						</a-input>
					</a-form-item>
					<a-button type="primary" class='fx_loginBtn' block size='large' :loading="isBtnLoading" @click="login">立即登录</a-button>
				</a-form>
			</a-col>
		</a-row>
	</div>
</template>
<script>
const staticData = window.staticContentConfig.staticData
export default {
	data() {
		return {
			staticData,
			isBtnLoading:false,//登陆状态动画加载
			codeImg:'',//验证码切换图片
			form:this.$form.createForm(this),
			securityCode:'',//验证码code
			loginUrl:this.$api.loginUrl,
			loginVerifyCode:this.$api.loginVerifyCode,
		};
	},
	mounted:function(){
		this.changeCode();
	},
	methods: {
		//切换验证码
		changeCode() {
			this.$post(this.loginVerifyCode).then((data) => {
                if (data.code == 200) {
                    this.codeImg=data.data||''
                }
            });
		},
		login(){
			this.form.validateFields((err, values) => {
                if (!err) {
					var params=this.form.getFieldsValue()
					this.$post(this.loginUrl,params).then(res=>{
						if (res.code == 200) {
							this.$router.push({name:'statics'});
							localStorage.setItem("token", res.data.token);
						}else {
							this.changeCode();
							this.$router.replace('/login');
						};
					}).catch (err=>{
						console.log(err)
					})
				}
			})
		},
	}
};
</script>
<style scoped lang='less'>
.fx_footer{
	position: absolute;
	bottom: 50px;
	left:50%;
	margin-left: -152px;
	color:#fff;
}
.fx_loginTitleImg{
	position: absolute;
	top:60px;
	left:80px;
	color:#fff;
	font-family: '平方粗体';
	font-size:32px;
	letter-spacing:2px;
}
/deep/ .ant-input-affix-wrapper .ant-input-suffix {
	top:39% ;
	color: #d6d6d6;
	font-size: 20px;
    .fx_suffix {
        height: 27px !important;
    }
}
</style>
