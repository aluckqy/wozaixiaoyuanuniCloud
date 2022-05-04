<template name="basics">
	<view>
		<scroll-view scroll-y class="page">
			<image src="/static/BasicsBg.png"
			 mode="widthFix" class="response"></image>
			<view class="nav-list">
				<navigator hover-class="none" :url="'/pages/basics/' + item.name" class="nav-li" navigateTo :class="'bg-'+item.color"
				 :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "basics",
		data() {
			return {
				elements: [{
						title: '登录',
						name: 'login',
						color: 'cyan',
						cuIcon: 'newsfill'
					},
					{
						title: '健康打卡',
						name: 'health',
						color: 'blue',
						cuIcon: 'colorlens'
					},
					{
						title: '日检日报',
						name: 'today',
						color: 'purple',
						cuIcon: 'font'
					},
					{
						title: '蓝牙打卡 ',
						name: 'blue',
						color: 'mauve',
						cuIcon: 'cuIcon'
					},
					{
						title: '打卡日志',
						name: 'log',
						color: 'pink',
						cuIcon: 'btn'
					},
					{
						title: '手动打卡',
						name: 'sign',
						color: 'brown',
						cuIcon: 'tagfill'
					},
					{
						title: '密码修改',
						name: 'password',
						color: 'red',
						cuIcon: 'myfill'
					},
					{
						title: '打卡记录',
						name: 'record',
						color: 'orange',
						cuIcon: 'icloading'
					},
					{
						title: '定位设置',
						name: 'location',
						color: 'olive',
						cuIcon: 'copy'
					},
					{
						title: '通知设置',
						name: 'notify',
						color: 'green',
						cuIcon: 'loading2'
					}
				],
			};
		},
		onShow() {
			console.log("success")
		}
	}
</script>

<style>
	.page {
		height: 100vh;
	}
</style>
