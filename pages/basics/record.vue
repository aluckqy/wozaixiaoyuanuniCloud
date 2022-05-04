<template>

	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">打卡记录</block>
		</cu-custom>
		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">日检日报记录</text>
					</view>
					<view class="padding">{{todayData.userInfo.college}} {{todayData.userInfo.grade}} {{todayData.userInfo.name}}  {{todayData.userInfo.number}}</view>
				</view>
			</view>
			<view class="padding-xs flex align-center" v-for="list,index in todayData.list ">
				<view class="padding">{{list.date}}</view>
				<view class="flex-sub text-center">
					<view class="padding">晨检打卡:<text v-if="list.types['0']=='0'" class="text-green">正常</text> <text v-else class="text-red">异常</text> 
					午检打卡:<text v-if="list.types['1']=='0'" class="text-green">正常</text> <text v-else class="text-red">未打卡</text> 
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
				todayData:{
					"userInfo": {
						"college": "",
						"grade": "",
						"name": "",
					}
				},
				jwsession: '',
			}
		},
		methods: {

		},
		created: function() {
			try {
				const jwsession = uni.getStorageSync('jwsession');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}
				http.post('https://student.wozaixiaoyuan.com/heat/get15Days.json', {}, {
					header: {
						JWSESSION: this.jwsession,
					},
				
				}).then(res => {
					console.log(res.data)
				
					if (res.data.code == 0) {
						this.todayData = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			} catch (err) {
				console.log(err)
			}
		}
	}
</script>

<style>
</style>
