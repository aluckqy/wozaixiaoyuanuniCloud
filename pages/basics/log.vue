<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">打卡日志</block>
		</cu-custom>
		<view v-if="jwsession">
			<view v-for="log,index in signLog" class="cu-timeline" :key="index">
				<view class="cu-time">{{log.date}}</view>
				<view class="cu-item text-blue">
					<view class="content" :class="log.color" >
						  <text>{{log.time}} </text> {{log.title}}
					</view>
				</view>
			</view>


			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="padding">这已经我的底线了！</view>
				</view>
			</view>
		</view>


		<view v-else>
			<view class="cu-load bg-red erro"></view>
			<view class="solids-bottom padding-xs flex align-center margin-top">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-lg padding">
						<text class="text-black">暂未开发</text>
					</view>
					<view class="padding">当前页面暂未开发！等待小程序更新！</view>
				</view>
			</view>
		</view>

	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				signLog: [],
				jwsession:''

			};
		},
		methods: {

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

				uniCloud.callFunction({
					name: 'getLog',
					data: {
						telephone: telephone
					}
				}).then(res => {
					console.log(res.result)
					this.signLog = res.result.data

				}).catch(err => {

					this.modalName = true
					this.codemsg = '网络错误，再试一次吧！'

				})
			} catch (e) {
				// error
				console.log(e)
			}
		}
	}
</script>

<style>

</style>
