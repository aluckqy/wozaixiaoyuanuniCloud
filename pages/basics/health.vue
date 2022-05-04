<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">健康打卡数据</block>
		</cu-custom>

		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">健康打卡</text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>健康打卡问题填写:
				</view>
			</view>
			<radio-group v-for=" seqTitle,index in todayData.titles" :key="index" class="block">

				<view class="cu-form-group">
					<view class="title">{{index+1}}.{{seqTitle.title}}</view>
				</view>

				<view v-if="seqTitle.type==1">
					<view v-for="healthOptions,idx in seqTitle.healthOptions" :key="idx" class="cu-form-group">
						<view class="title"><text class="cuIcon-title"></text> {{healthOptions.option}}</view>
						<radio class='radio' :checked="qarr[index]==idx?true:false" @tap="RadioTap(index,idx)"></radio>
					</view>
				</view>

				<view v-if="seqTitle.type==2">
					<view v-for="healthOptions,idx in seqTitle.healthOptions" :key="idx" class="cu-form-group">
						<view class="title"><text class="cuIcon-title"></text>{{healthOptions.option}}</view>
						<radio class='radio' :checked="qarr[index]==idx?true:false" @tap="RadioTap(index,idx)"></radio>
					</view>
				</view>
				<view v-if="seqTitle.type==3">
					<view class="cu-form-group">
						<textarea maxlength="10" v-model="qarr[index]" placeholder="请输入内容"></textarea>
					</view>
				</view>
			</radio-group>


			<view class="cu-form-group margin-top">
				<view class="title">是否开启自动打卡</view>
				<switch @change="SwitchA" :class="signHealth?'checked':''" :checked="signHealth?true:false"></switch>
			</view>
			<view class="padding">
				<button v-if="upbutton" v-on:tap="pushHealth" class="cu-btn block bg-blue margin-tb-sm lg"
					type="">提交</button>
				<button v-else disabled class="cu-btn block bg-blue margin-tb-sm lg" type="">请填写或修改</button>
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
				codemsg: '',
				todayData: '',
				qarr: [],
				upbutton: false,
				jwsession: '',
				telephone: '',
				signHealth: true


			}
		},
		methods: {
			hideModal() {
				this.modalName = false
			},
			SwitchA(e) {
				this.signHealth = e.detail.value
				this.upbutton = true
			},
			RadioTap(q, v) {
				this.qarr[q] = v
				let len = this.todayData.titles.length

				for (let i = 0; i <= len; i++) {
					if (this.qarr[i] == undefined) {
						break
					}
					if (i == len - 1) {
						this.upbutton = true
					}

				}

			},

			pushHealth() {
				uniCloud.callFunction({
					name: "pushHealth",
					data: {
						telephone: this.telephone,
						signHealth: this.signHealth,
						qarr: this.qarr
					}
				}).then(res => {
					console.log(res)

					this.modalName = true
					this.codemsg = '提交成功！'
					try {
						uni.setStorageSync('healthqarr', this.qarr);
					} catch (e) {
						// error
						console.log(e)
					}

				}).catch(err => {
					console.log(res)
					this.modalName = true
					this.codemsg = '网络错误，再试一次吧！'
				})
			}
		},


		created: function() {
			try {
				const jwsession = uni.getStorageSync('jwsession');
				const telephone = uni.getStorageSync('telephone');
				const qarr = uni.getStorageSync('healthqarr');
				const signHealth = uni.getStorageSync('signHealth');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}
				console.log(signHealth);
				this.signHealth = signHealth

				if (telephone) {
					console.log(telephone);
					this.telephone = telephone
				}
				if (qarr) {
					console.log(qarr);
					this.qarr = qarr
				}

			} catch (e) {
				// error
				console.log(e)
			}

			http.post('https://student.wozaixiaoyuan.com/health/getToday.json', {}, {
				header: {
					JWSESSION: this.jwsession,
				},

			}).then(res => {

				if (res.data.code == 0) {
					this.todayData = res.data.data
				}
			}).catch(err => {
				console.log(err)
			})

		}

	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
