<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">定位设置</block>
		</cu-custom>

		<view v-if="jwsession">
			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">自定义定位设置</text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-title text-blue"></text>定位信息填写:
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">地址选择</view>
				<picker mode="region" @change="RegionChange" :value="region">
					<view class="picker">
						{{region[0]}}，{{region[1]}}，{{region[2]}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">地点</view>
				<input v-model="keyword" placeholder="请输入地点关键词" name="input"></input>
				<button @tap="suggestion" class='cu-btn bg-green shadow'>搜索</button>
			</view>
			<radio-group class="block">
				<view class="cu-form-group" v-for="(item,index) in sub_pois" :key="item.id">
					<view class="title">{{item.title}}</view>
					<radio class='radio' :class="radio==index?'checked':''" @tap="RadioTap(index)"></radio>
				</view>
			</radio-group>

			<view class="box">
				<view class="cu-bar btn-group margin-top">
					<button @tap="geocoderLocation" class="cu-btn bg-green shadow-blur round lg">提交</button>
				</view>
			</view>

			<view class="solids-bottom padding-xs flex align-center">
				<view class="flex-sub text-center">
					<view class="solid-bottom text-xl padding">
						<text class="text-black text-bold">当前已使用定位信息</text>
					</view>
					<view class="padding">
						坐标：{{newlocation.longitude}},{{newlocation.latitude}}<br>
						地址:{{newlocation.country}}{{newlocation.province}}{{newlocation.city}}{{newlocation.district}}{{newlocation.township}}{{newlocation.street}}<br>
						以下为非必填信息:<br>
						区域代码:{{newlocation.areacode}} <br>
						城市代码:{{newlocation.citycode}} <br>
						街道代码:{{newlocation.towncode}} <br>
						区域:{{newlocation.myArea}}<br>
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

			<view class="cu-modal" :class="itemcode?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{set_poi.title}}</view>
						<view class="action" @tap="itemModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						区域代码：{{set_poi.adcode}}<br>
						地址：{{set_poi.province}}{{set_poi.city}}{{set_poi.district}}<br>
						坐标：{{set_poi.location.lng}},{{set_poi.location.lat}}<br>
						类型：{{set_poi.category}}<br>
						详细地址：{{set_poi.address}}<br>
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
				region: ['陕西省', '汉中市', '汉台区'],
				keyword: '',
				sub_pois: [],
				jwsession: '',
				telephone: '',
				codemsg: '',
				set_poi: {
					"id": "1425572302013137833",
					"title": "陕西理工大学(南校区)",
					"address": "陕西省汉中市汉台区东一环路1号",
					"category": "教育学校:大学",
					"type": 0,
					"location": {
						"lat": 33.068869,
						"lng": 107.052969
					},
					"adcode": 610702,
					"province": "陕西省",
					"city": "汉中市",
					"district": "汉台区"
				},
				radio: -1,
				modalName: false,
				itemcode: false,
				newlocation: {
					latitude: '',
					longitude: '',
					country: '',
					city: '',
					district: '',
					province: '',
					township: '',
					street: '',
					myArea: '',
					areacode: '',
					towncode: '',
					citycode: '',
				},
				locationKey: ''

			}
		},
		methods: {
			RegionChange(e) {
				this.region = e.detail.value
			},
			hideModal() {
				this.modalName = false
			},
			itemModal() {
				this.itemcode = false
			},
			RadioTap(index) {
				this.set_poi = this.sub_pois[index]
				this.radio = index
				this.itemcode = true
				console.log(this.set_poi)


			},
			geocoderLocation() {
				http.get('https://apis.map.qq.com/ws/geocoder/v1', {
					params: {
						key: this.locationKey,
						smart_address: this.set_poi.address,
						added_fields: 'town,town_code'
					}
				}).then(res => {
					console.log(res)
					if (res.data.status == 0) {
						let newlocation = {
							latitude: this.set_poi.location.lat,
							longitude: this.set_poi.location.lng,
							country: '中国',
							city: this.set_poi.city,
							district: this.set_poi.district,
							province: this.set_poi.province,
							township: res.data.result.town,
							street: res.data.result.address_components.street,
							myArea: '汉中市',
							areacode: res.data.result.ad_info.adcode,
							towncode: res.data.result.town_code,
							citycode: '',
						}
						this.newlocation = newlocation
						this.pushLocation()

					} else {
						this.modalName = true
						this.codemsg = res.data.message
					}
				}).catch(err => {
					console.log(err)

					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'
				})
			},
			pushLocation() {
				uniCloud.callFunction({
					name: "pushLocation",
					data: {
						telephone: this.telephone,
						set_poi: this.set_poi,
						location: this.newlocation
					}
				}).then(res => {
					console.log(res)
					this.modalName = true
					this.codemsg = '提交成功！'

					try {
						uni.setStorageSync('newlocation', this.newlocation);
					} catch (e) {
						// error
						console.log(e)
					}

				}).catch(err => {
					console.log(res)
					this.modalName = true
					this.codemsg = '网络错误，再试一次吧！'
				})

			},
			suggestion() {
				http.get('https://apis.map.qq.com/ws/place/v1/suggestion', {
					params: {
						keyword: this.keyword,
						region: this.region[2],
						key: this.locationKey
					}
				}).then(res => {
					if (res.data.status == 0) {
						this.sub_pois = res.data.data
						this.radio = -1
					} else {
						this.modalName = true
						this.codemsg = '网络错误，再试一次吧！'
					}
				}).catch(err => {
					this.modalName = true
					this.codemsg = '出错了，再试一次吧！'


				})
			}
		},

		created: function() {
			try {
				const telephone = uni.getStorageSync('telephone');
				const newlocation = uni.getStorageSync('newlocation');
				const locationKey = uni.getStorageSync('locationKey');
				const jwsession = uni.getStorageSync('jwsession');
				if (newlocation) {
					console.log(newlocation);
					this.newlocation = newlocation
				}

				if (telephone) {
					console.log(telephone);
					this.telephone = telephone
				}
				if (locationKey) {
					console.log(locationKey);
					this.locationKey = locationKey
				}
				if (jwsession) {
					console.log(jwsession);
					this.jwsession = jwsession
				}

			} catch (e) {
				// error
				console.log(e)
			}
		}

	}
</script>

<style>
</style>
