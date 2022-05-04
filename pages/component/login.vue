<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">登录</block>
		</cu-custom>

		<view class="solids-bottom padding-xs flex align-center">
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xl padding">
					<text class="text-black text-bold" v-if="logClass">验证码登录</text>
					<text class="text-black text-bold" v-else="logClass">密码登录</text>
				</view>
			</view>
		</view>
		<form>
			<view class="cu-form-group">
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


				<view class="cu-form-group">
					<view class="title">设置新密码</view>
					<input v-model="password" placeholder="6-10位的新密码" name="input"></input>
				</view>
			</view>

			<view class="cu-form-group" v-else="logClass">
				<view class="title">密码</view>
				<input v-model="password" placeholder="请输入密码" name="input"></input>
			</view>

			<view class="cu-form-group margin-top">
				<view class="title">邀请码</view>
				<input v-model="inviteCode" placeholder="请输入邀请码" name="input"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">登录方式（ 密码 | 验证码 ）</view>
				<switch @change="SwitchA" :class="logClass?'checked':''" :checked="logClass?true:false"></switch>
			</view>


		</form>
		<view class="box">
			<view class="cu-bar btn-group margin-top">
				<button v-on:tap="md5InviteCode()" class="cu-btn bg-green shadow-blur round lg">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '@/api/service.js';
	import md5 from '@/utils/md5.min.js'
	export default {
		data() {
			return {
				modalName: false,
				logClass: true,
				telephone: '',
				code: '',
				password: '',
				inviteCode: '',
				codemsg: ''

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
					header: {
						Referer: "https://gw.wozaixiaoyuan.com/h5/mobile/basicinfo/index/login/changePassword"
					}
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
							password: this.password
						},
						header: {
							Referer: "https://gw.wozaixiaoyuan.com/h5/mobile/basicinfo/index/login/changePassword"
						}
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
			
			md5InviteCode(){
				let token = "luckqy"
				let d = new Date()
				let date = d.getFullYear()+d.getMonth() +d.getDate()
				let newinviteCode = md5( token+this.telephone + date)
				console.log(newinviteCode)
				if (this.inviteCode== newinviteCode) {
				http.get('https://gw.wozaixiaoyuan.com/basicinfo/mobile/login/getCode?', {
					params: {
						phone: this.telephone,
					},
					header: {
						Referer: "https://gw.wozaixiaoyuan.com/h5/mobile/basicinfo/index/login/changePassword"
					}
				}).then(res => {
					console.log(res.data)
					if (res.data.code == 0) {
						this.modalName = true
						this.codemsg = '验证码获取成功，1分钟内请勿重复获取！'
						// 提交到云函数,telephone , password,inviteCode

					} else {
						this.modalName = true
						this.codemsg = res.data.message
					}


				}).catch(err => {
					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'

				})

					
				}else{
					this.modalName = true
					this.codemsg = '邀请码有误！'
				}

			}



		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
