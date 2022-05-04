<template>

	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">通知设置</block>
		</cu-custom>
		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">填写【Server酱】推送密钥</text>
					</view>
					<view class="padding">关注【方糖】公众号,进入Server酱新官网，获取SendKey,填写后即可获得打卡推送！</view>
				</view>
			</view>
			<view class="padding">
				<view class="cu-form-group">
					<view class="title">SendKey</view>
					<input v-model="SendKey" placeholder="推送密钥" name="input"></input>
				</view>
				<button @tap="pushSendKey" class="cu-btn block bg-blue margin-tb-sm lg" type="">提交</button>
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
</template>

<script>
	import {
		http
	} from '@/api/service.js';
	export default {
		data() {
			return {
				jwsession: '',
				SendKey: '',
				modalName: false,
				codemsg:'',
				telephone: ''
			}
		},
		methods: {
			hideModal() {
				this.modalName = false
			},
			pushSendKey() {

				uniCloud.callFunction({
					name: 'SendKey',
					data: {
						telephone: this.telephone,
						SendKey: this.SendKey
					}
				}).then(res => {
					this.modalName = true
					this.codemsg = '提交成功'
					uni.setStorageSync('SendKey', this.SendKey);
					console.log(res)

				}).catch(res => {
					console.log(res)
					this.modalName = true
					this.codemsg = '网络错误，再试一次吧！'

				})
			},
		},
		created: function() {
			try {
				const jwsession = uni.getStorageSync('jwsession');
				const SendKey = uni.getStorageSync('SendKey');
				const telephone = uni.getStorageSync('telephone');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}
				if (telephone) {
					console.log(telephone);
					this.telephone = telephone
				}
				if (SendKey) {
					console.log(SendKey);
					this.SendKey = SendKey
				}
			} catch (err) {
				console.log(err)
			}
		}
	}
</script>

<style>
</style>
