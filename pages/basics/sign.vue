<template>

	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">手动签到</block>
		</cu-custom>
		<view v-if="jwsession">
			<view class="padding">
				<button @tap="sign()" class="cu-btn block bg-blue margin-tb-sm lg" type="">一键打卡(日检日报)</button>
			<button  class="cu-btn block bg-blue margin-tb-sm lg" disabled="true" type="">一键打卡(健康打卡)</button>
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
	export default {
		data() {
			return {
				jwsession: '',
				modalName: false,
				codemsg:'',
				telephone:''
			}
		},
		methods: {
			hideModal() {
				this.modalName = false
			},
			sign() {

				uniCloud.callFunction({
					name: 'signToday',
					data: {
						telephone: this.telephone
					}
				}).then(res => {
					this.modalName = true
					this.codemsg = res.result
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
				const telephone = uni.getStorageSync('telephone');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}
				if (telephone) {
					console.log(telephone);
					this.telephone = telephone
				}
			} catch (err) {
				console.log(err)
			}
		}
	}
</script>

<style>
</style>
