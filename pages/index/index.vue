<template>
	<view>

			<basics v-if="PageCur=='basics'"></basics>

	<!-- <plugin v-if="PageCur=='plugin'"></plugin> -->
		<!-- 		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="basics">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='basics'?'text-green':'text-gray'">签到</view>
			</view> -->

		<!-- 		<view class="action" @click="NavChange" data-cur="component">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/component' + [PageCur == 'component'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='component'?'text-green':'text-gray'">我的</view>
			</view> -->
		<!-- 			
			<view class="action" @click="NavChange" data-cur="plugin">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tabbar/plugin' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='plugin'?'text-green':'text-gray'">扩展</view>
			</view> -->
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PageCur: 'basics',
				telephone: '',
				hiddenNum: 0,
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			hiddenTap: function() {
				this.hiddenNum = this.hiddenNum + 1
			}
		},
		created: function() {
			const telephone = uni.getStorageSync('telephone');
			if (telephone) {
				console.log(telephone);
				this.telephone = telephone
				uniCloud.callFunction({
					name: 'getUserCookie',
					data: {
						telephone: this.telephone,
					}
				}).then(res => {
					console.log(res)
					try {
						const password = res.result.data[0].password
						const jwsession = res.result.data[0].jwsession
						const todayqarr = res.result.data[0].todayqarr
						const healthqarr = res.result.data[0].healthqarr
						const newlocation = res.result.data[0].location
						const SendKey = res.result.data[0].SendKey

						const signBlue = res.result.data[0].signBlue
						const signHealth = res.result.data[0].signHealth
						const signToday = res.result.data[0].signToday
						// console.log(jwsession)
						uni.setStorageSync('password', password);
						uni.setStorageSync('jwsession', jwsession);
						uni.setStorageSync('todayqarr', todayqarr);
						uni.setStorageSync('healthqarr', healthqarr);
						uni.setStorageSync('newlocation', newlocation);
						uni.setStorageSync('SendKey', SendKey);
						uni.setStorageSync('signHealth', signHealth);
						uni.setStorageSync('signBlue', signBlue);
						uni.setStorageSync('signToday', signToday);

					} catch (e) {
						// error
						console.log(e)
					}
				})

				uniCloud.callFunction({
					name: 'getConf',
					data: {
						appid: 'wxf0d2ebc82fb2710d'
					}
				}).then(res => {
					try {
						console.log(res)
						const locationKey = res.result.data[0].locationKey
						uni.setStorageSync('locationKey', locationKey);
					} catch (e) {
						console.log(e)
					}
				})

			}

		}
	}
</script>

<style>

</style>
