<template>

	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">蓝牙打卡</block>
		</cu-custom>
		<view v-if="signBlue">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">蓝牙打卡</text>
					</view>
					<view class="padding">先选择签到设备后方可签到</view>
				</view>
			</view>
			<view class="cu-bar bg-white margin-top" v-for="signData,index in signDataList" :key="signData.id">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> {{signData.title}}
				</view>
				<view class="action" v-if="signData.type==1">
					<button class="cu-btn bg-green shadow" disabled="true" data-target="RadioModal">已签到</button>
				</view>
				<view class="action" v-else>
					<button class="cu-btn bg-green shadow" @tap="getDevice(signData.start,signData.end,signData.id,signData.logId)"
						data-target="RadioModal">签到设备</button>
					<button v-if="isdevice" class="cu-btn bg-blue shadow margin-left" @tap="showModal"
						data-target="DialogModal1">签到</button>
					<button v-else class="cu-btn bg-blue shadow margin-left" @tap="showModal" data-target="DialogModal1"
						:disabled="isdevice" disabled="true">设备未选择</button>
				</view>
			</view>

		</view>
		<view v-else>
			<view class="cu-load bg-red erro"></view>
			<view class="solids-bottom padding-xs flex align-center margin-top">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-lg padding">
						<text class="text-black">未授权！</text>
					</view>
					<view class="padding">此功能为敏感功能,您暂未受到授权！</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">是否完成签到</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					签到信息如下:<br>
					国家: 中国<br>
					省: 陕西省<br>
					市: 汉中市<br>
					县/区: 汉台区<br>
					街道/村: 东关街道<br>
					纬度: 33.06616973876953<br>
					经度: 107.05538940429688<br>
					蓝牙设备编号: {{device}}<br>
					开始签到时间:{{start}}<br>
					结束签到时间:{{end}}<br>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="pushSignBlue">确定</button>

					</view>
				</view>
			</view>
		</view>


		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in signDataDevice" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{signDataDevice[0]}}</view>
								<radio class="round" @tap="setDevice(signDataDevice[0])"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="cu-modal" :class="modalName1?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
					<view class="action" @tap="hideModal1">
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
				modalName1: null,
				isdevice: false,
				modalName: null,
				codemsg: '',
				jwsession: '',
				telephone: '',

				signBlue: false,
				radio: '',
				DialogModal1: '',
				signDataList: {

				},
				signDataDevice: {},
				device: '',
				logId: '',
				id: '',
				start:'',
				end:'',

			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal() {
				this.modalName = null
			},
			hideModal1() {
				this.modalName1 = null
			},
			RadioChange(e) {
				this.radio = e.detail.value
			},
			pushSignBlue() {
				let data = {
					"id": this.logId,
					"signId": this.Id,
					"latitude": "33.06616973876953",
					"longitude": "107.05538940429688",
					"country": "中国",
					"province": "陕西省",
					"city": "汉中市",
					"district": "汉台区",
					"township": "东关街道",
					"device": this.device
				}
				let strencodedtat = JSON.stringify(data)
				console.log(strencodedtat)

				http.post('https://student.wozaixiaoyuan.com/sign/doSign.json', strencodedtat, {
					params: {},
					header: {
						JWSESSION: this.jwsession,
					},

				}).then(res => {
					console.log(res.data)
					this.modalName = 'RadioModal'
					if (res.data.code == 0) {
						this.signDataDevice = res.data.devices
						this.modalName = null
						this.modalName1 = true
						this.codemsg = '签到成功！'

						http.post('https://student.wozaixiaoyuan.com/sign/getSignMessage.json?page=1&size=5', {}, {
							header: {
								JWSESSION: this.jwsession,
							},

						}).then(res => {
							console.log(res.data.data)

							if (res.data.code == 0) {
								this.signDataList = res.data.data

							}
						}).catch(err => {
							console.log(err)
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			setDevice(device) {
				this.device = device
				this.modalName = null
				this.isdevice = true
				console.log(this.device)
			},
			getDevice(start,end,id, logId) {
				this.id = id
				this.logId = logId
				this.start = start
				this.end = end
				http.post('https://student.wozaixiaoyuan.com/sign/getSignData.json', {}, {
					params: {
						id: id,
						logId: logId
					},
					header: {
						JWSESSION: this.jwsession,
					},

				}).then(res => {
					console.log(res.data.data.devices)
					this.modalName = 'RadioModal'
					if (res.data.code == 0) {
						this.signDataDevice = res.data.data.devices
					}
				}).catch(err => {
					console.log(err)

					this.modalName1 = true
					this.codemsg = '出错了，再试一次吧！'
				})
			}

		},


		created: function() {
			try {
				const signBlue = uni.getStorageSync('signBlue');
				const jwsession = uni.getStorageSync('jwsession');
				console.log(signBlue);
				this.signBlue = signBlue
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}

			} catch (e) {
				// error
				console.log(e)
			}

			http.post('https://student.wozaixiaoyuan.com/sign/getSignMessage.json?page=1&size=5', {}, {
				header: {
					JWSESSION: this.jwsession,
				},

			}).then(res => {
				console.log(res.data.data)

				if (res.data.code == 0) {
					this.signDataList = res.data.data

				}
			}).catch(err => {
				console.log(err)
			})

		}

	}
</script>

<style>
</style>
