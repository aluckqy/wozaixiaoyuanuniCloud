<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">登录</block>
		</cu-custom>
		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold" v-if="logClass">验证码修改</text>
						<text class="text-black text-bold" v-else>原密码修改</text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>修改密码:
				</view>
			</view>
			<form>
				<view class="cu-form-group ">
					<view class="title">手机号码</view>
					<input v-model="telephone" placeholder="请输入11位手机号" name="input"></input>
					<view class="cu-capsule radius">
						<view class='cu-tag bg-blue '>
							+86
						</view>
						<view class="cu-tag line-blue">
							中国大陆
						</view>
					</view>
				</view>

				<view v-if="logClass">
					<view class="cu-form-group">
						<view class="title">验证码</view>
						<input v-model="code" placeholder="请输入验证码" name="input"></input>
						<button v-on:tap="getCode" class='cu-btn bg-green shadow'>获取验证码</button>

					</view>


					<view class="cu-form-group">
						<view class="title">新密码</view>
						<input v-model="newpassword" placeholder="6-10位的新密码" name="input"></input>
					</view>
				</view>
				<view v-else>
					<view class="cu-form-group">
						<view class="title">原密码</view>
						<input v-model="password" placeholder="请输入密码" name="input"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">新密码</view>
						<input v-model="newpassword" placeholder="请输入密码" name="input"></input>
					</view>
				</view>
				<view class="cu-form-group margin-top">
					<view class="title">修改方式（ 原密码 | 验证码 ）</view>
					<switch @change="SwitchA" :class="logClass?'checked':''" :checked="logClass?true:false"></switch>
				</view>


			</form>
			<view class="box">
				<view class="cu-bar btn-group margin-top">
					<button v-on:tap="md5InviteCode()" class="cu-btn bg-green shadow-blur round lg">提交</button>
				</view>
			</view>

			<view class="cu-modal" :class="modalName?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">提示</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{codemsg}}
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="cu-load bg-red erro"></view>
			<view class="solids-bottom padding-xs flex align-center margin-top">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-lg padding">
						<text class="text-black">未登录</text>
					</view>
					<view class="padding">当前未登录！无法进行操作！</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		http
	} from '@/api/service.js';
	export default {
		data() {
			return {
				modalName: false,
				logClass: true,
				telephone: '',
				code: '',
				password: '',
				newpassword: '',
				inviteCode: '',
				codemsg: '',
				jwsession: '',

			}
		},
		methods: {

			SwitchA(e) {
				this.logClass = e.detail.value
			},
			hideModal() {
				this.modalName = false
			},
			getCode() {

				http.get('https://gw.wozaixiaoyuan.com/basicinfo/mobile/login/getCode?', {
					params: {
						phone: this.telephone,
					},
				}).then(res => {
					console.log(res.data)
					if (res.data.code == 0) {
						this.modalName = true
						this.codemsg = '验证码获取成功，1分钟内请勿重复获取！'

					} else {
						this.modalName = true
						this.codemsg = res.data.message
					}


				}).catch(err => {
					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'

				})



			},

			UpPassword() {

				http.get(
					'https://gw.wozaixiaoyuan.com/basicinfo/mobile/login/changePassword?', {
						params: {
							phone: this.telephone,
							code: this.code,
							password: this.newpassword
						}
					}).then(res => {
					console.log(res.data)
					if (res.data.code == 0) {
						console.log(res)
						// this.modalName = true
						// this.codemsg = '密码修改成功！'
						uniCloud.callFunction({
							name: 'setPassword',
							data: {
								telephone: this.telephone,
								password: this.newpassword,
							}
						}).then(res => {
							console.log(res)
							this.modalName = true
							this.codemsg = '密码修改成功！'
							try {
								uni.setStorageSync('password', this.newpassword);
							} catch (e) {
								// error
								console.log(e)
							}

						}).catch(res => {
							console.log(res)
							this.modalName = true
							this.codemsg = '网络错误，再试一次吧！'
						})

					} else {
						this.modalName = true
						this.codemsg = res.data.message
					}
				}).catch(err => {
					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'

				})



			},
			pushUniapp() {
				http.get('https://gw.wozaixiaoyuan.com/basicinfo/mobile/my/changePassword', {
					params: {
						newPassword: this.newpassword,
						oldPassword: this.password,
						code: ''
					},
					header: {
						JWSESSION: this.jwsession,
					},
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						this.jwsession = res.header.jwsession
						console.log(this.jwsession)

						uniCloud.callFunction({
							name: 'setPassword',
							data: {
								telephone: this.telephone,
								password: this.newpassword,
							}
						}).then(res => {
							console.log(res)
							this.password = this.newpassword
							this.modalName = true
							this.codemsg = '修改成功！'
							try {
								uni.setStorageSync('password', this.password);
							} catch (e) {
								// error
								console.log(e)
							}

						}).catch(res => {
							console.log(res)
							this.modalName = true
							this.codemsg = '网络错误，再试一次吧！'

						})
					} else {
						this.modalName = true
						this.codemsg = res.data.message
					}

				}).catch(err => {
					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'
				})


			},

			md5InviteCode() {
				let token = "luckqy"
				let d = new Date()
				let date = d.getFullYear() + d.getMonth() + d.getDate()
				// console.log(newinviteCode)
				if (this.logClass) {
					this.UpPassword()
				} else {
					this.pushUniapp()
				}




			},

		},
		created: function() {
			try {
				const jwsession = uni.getStorageSync('jwsession');
				const telephone = uni.getStorageSync('telephone');
				const password = uni.getStorageSync('password');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}

				if (telephone) {
					console.log(telephone);
					this.telephone = telephone
				}

				if (password) {
					console.log(password);
					this.password = password
				}
			} catch (e) {
				// error
				console.log(e)
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
