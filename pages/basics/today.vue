<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">日检日报数据</block>
		</cu-custom>

		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">日检日报</text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>健康打卡问题填写:
				</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title"><text></text>1.你当前的体温是?</view>
			</view>

			<view class="cu-form-group">
				<view class="title">最高体温</view>
				<picker @change="PickerChangeMax" :value="temprature_max_index" :range="picker">
					<view class="picker">
						{{temprature_max_index>-1?picker[temprature_max_index]:temprature_max}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">最低体温</view>
				<picker @change="PickerChangeMin" :value="temprature_min_index" :range="picker">
					<view class="picker">
						{{temprature_min_index>-1?picker[temprature_min_index]:temprature_min}}
					</view>
				</picker>
			</view>
			<radio-group v-for=" seqTitle,index in todayData.titles" :key="index" class="block">

				<view class="cu-form-group">
					<view class="title">{{index+2}}.{{seqTitle.title}}</view>
				</view>

				<view v-if="seqTitle.type==1">
					<view v-for="heatOptions,idx in seqTitle.heatOptions" :key="idx" class="cu-form-group">
						<view class="title"><text class="cuIcon-title"></text>{{heatOptions.option}}</view>
						<radio class='radio' :checked="qarr[index]==idx?true:false" @tap="RadioTap(index,idx)"></radio>
					</view>
				</view>

				<view v-if="seqTitle.type==2">
					<view v-for="heatOptions,idx in seqTitle.heatOptions" :key="idx" class="cu-form-group">
						<view class="title"><text class="cuIcon-title"></text>{{heatOptions.option}}</view>
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
				<switch @change="SwitchA" :class="signToday?'checked':''" :checked="signToday?true:false"></switch>
			</view>
			<view class="padding">
				<button v-if="upbutton" v-on:tap="pushToday" class="cu-btn block bg-blue margin-tb-sm lg"
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
				signToday: true,
				picker: [35.0, 35.1, 35.2, 35.3, 35.4, 35.5, 35.6, 35.7, 35.8, 35.9, 36.0, 36.1, 36.2,
					36.3, 36.4, 36.5, 36.6, 36.7, 36.8, 36.9, 37.0
				],
				temprature_min_index: -1,
				temprature_max_index: -1,

				temprature_min: 36.0,
				temprature_max: 36.5,

			}
		},
		methods: {
			hideModal() {
				this.modalName = false
			},
			SwitchA(e) {
				this.signToday = e.detail.value
				this.upbutton = true
				console.log(this.temprature_min)
				console.log(this.temprature_max)
			},
			PickerChangeMax(e) {
				this.temprature_max_index = e.detail.value
				this.temprature_max = this.picker[this.temprature_max_index]
				this.upbutton = true
			},
			PickerChangeMin(e) {
				this.temprature_min_index = e.detail.value
				this.temprature_min = this.picker[this.temprature_min_index]
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

			pushToday() {
				if (this.temprature_max < this.temprature_min) {
					this.modalName = true
					this.codemsg = '最高体温不得小于最高体温！'

				} else {
					uniCloud.callFunction({
						name: "pushToday",
						data: {
							telephone: this.telephone,
							qarr: this.qarr,
							signToday: this.signToday,
							temprature_min: this.temprature_min,
							temprature_max: this.temprature_max,
						}
					}).then(res => {
						console.log(res)
						this.modalName = true
						this.codemsg = '提交成功！'
						try {
							uni.setStorageSync('todayqarr', this.qarr);
							uni.setStorageSync('temprature_max', this.temprature_max);
							uni.setStorageSync('temprature_min', this.temprature_min);
							uni.setStorageSync('signToday', this.signToday);
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

			}
		},


		created: function() {
			try {
				const jwsession = uni.getStorageSync('jwsession');
				const telephone = uni.getStorageSync('telephone');
				const qarr = uni.getStorageSync('todayqarr');
				const signToday = uni.getStorageSync('signToday');
				const temprature_max = uni.getStorageSync('temprature_max');
				const temprature_min = uni.getStorageSync('temprature_min');
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}
				if (temprature_min) {
					console.log(temprature_min);
					this.temprature_min = temprature_min
				}
				if (temprature_max) {
					console.log(temprature_max);
					this.temprature_max = temprature_max
				}

				console.log(signToday);
				this.signToday = signToday

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

			http.post('https://student.wozaixiaoyuan.com/heat/getHeat.json?seq=1&userId=', {}, {
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
