<template>
	<div class='f_loginBg'>
		<div class='f_loinContent'>
			<a-row>
				<a-col :span='14'>
					<img src='@/assets/image/loginBg.png' width='100%' height='500'/>
				</a-col>
				<a-col :span='10'>
					<a-form :form='form' class='f_loginForm'>
						<div class='f_loginTitle'>欢迎登陆</div>
						<a-form-item>
							<a-input placeholder="用户名" v-decorator="['username',{ rules: [{ required: true, message: '请输入用户名！' }] }]"/>
						</a-form-item>
						<a-form-item>
							<a-input placeholder="密码" type="password" v-decorator="['password',{ rules: [{ required: true, message: '请输入密码！' }] }]"/>
						</a-form-item>
						<a-form-item>
							<a-input placeholder="验证码" v-decorator="['code',{ rules: [{ required: true, message: '请输入验证码！' }] }]" class="f_codeInput"/>
							<img title="点击更换验证码" id="codeImg" alt="验证码" :src="'data:image/png;base64,'+codeImg" @click="changeCode"/>
						</a-form-item>
						<a-button type="primary" class='marginB10' block size='large' :loading="isBtnLoading" @click="login">登录</a-button>
						<a-button type="primary" class='marginB10' ghost block size='large' :loading="isBtnLoading" @click="login">注册</a-button>
						<a href="javascript:;" class='pull-right'>密码重置</a>
					</a-form>
				</a-col>
			</a-row>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			isBtnLoading:false,
			codeImg:'',//验证码切换图片
			form:this.$form.createForm(this),
			securityCode:'',//验证码code
		};
	},
	mounted:function(){
		this.changeCode();
	},
	methods: {
		changeCode() {
			this.$get('/securityCode').then((data) => {
                if (data.code == 200) {
                    this.codeImg=data.data.imgBase64
					this.codeToken=data.data.codeToken
                }
            });
		},
		login(){
			this.form.validateFields((err, values) => {
                if (!err) {
					this.$axios.post('/login',this.$qs.stringify({
						"username":this.form.getFieldValue('username'),
						"password":this.$md5(this.form.getFieldValue('password')),
					}), {
						headers: {
							codeToken: this.codeToken,
							securityCode:this.form.getFieldValue('code')
						}
					}).then(res=>{
						if (res.data.code == 200) {
							this.$router.push({name:'dishesList'});
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
<style scoped>
</style>
