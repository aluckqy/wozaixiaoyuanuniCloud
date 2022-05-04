'use strict';
const {
	Stats
} = require("fs");
let sha256 = require("./sha.js")
let md5 = require("./md5.js")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getUserListToday = {}
	if (event.telephone) {
		getUserListToday = await db.collection('uni_wzxy_user').where({
			telephone: event.telephone
		}).get()
	} else {
		getUserListToday = await db.collection('uni_wzxy_user').where({
			signToday: true,
			isActivate: true,
		}).get()

	}


	let reslist = {}

	function get_seq() {
		let date = new Date();
		let hour = date.getHours() + 8;
		// console.log(hour)

		if (hour <= 9) {
			return '1'
		} else if (hour >= 12) {
			if (hour <= 15) {
				return '2'
			}
			return '1'
		} else {
			return '1'
		}

	}

	function get_random_temprature(temprature_max, temprature_min) {
		let max = temprature_max * 10
		let min = temprature_min * 10

		let temprature_random = ((Math.floor(Math.random() * (max - min)) + min) / 10).toFixed(1).toString()
		return temprature_random
	}

	for (let user of getUserListToday.data) {
		let date = new Date()
		let timestampHeader = date.getTime()
		let signatureHeader = sha256.SHA256(user.location.province + "_" + timestampHeader + "_" + user.location
			.city).toString()

		const res = await uniCloud.httpclient.request('https://student.wozaixiaoyuan.com/heat/save.json', {
			method: 'POST',
			data: {
				"answers": JSON.stringify(user.todayqarr),
				"seq": get_seq(),
				"temperature": get_random_temprature(user.temprature_max, user.temprature_min),
				"latitude": user.location.latitude.toString(),
				"longitude": user.location.longitude.toString(),
				"country": user.location.country,
				"city": user.location.city,
				"district": user.location.district,
				"province": user.location.province,
				"township": user.location.township,
				"street": user.location.street,
				"myArea": user.location.myArea,
				"areacode": user.location.areacode,
				"towncode": user.location.towncode,
				"citycode": user.location.citycode,

				"timestampHeader": timestampHeader.toString(),
				"signatureHeader": signatureHeader

			},

			headers: {
				"Host": "student.wozaixiaoyuan.com",
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept-Encoding": "gzip, deflate, br",
				"Connection": "keep-alive",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat",
				"Referer": "https://servicewechat.com/wxce6d08f781975d91/172/page-frame.html",
				"jwsession": user.jwsession,
				"Content-Length": "360",
			},
			contentType: 'application/x-www-form-urlencoded', // 指定以application/json发送data内的数据
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
		// console.log(res)
		try {
			let seq = get_seq()
			let seqtext = ""
			if (seq == "1") {
				seqtext = "晨检"
			} else {
				seqtext = "午检"
			}
			let results = ""
			let color = ""
			if (res.data.code == 0) {

				reslist[user.telephone] = seqtext + "打卡成功"
				results = "成功"
				if (user.SendKey){
					let callFunctionResult = await uniCloud.callFunction({
						name: "pushServer",
						data: {
							SendKey: user.SendKey,
							title: seqtext + "通知"  ,
							desp: "自动打卡成功!"
						}
					})
				}


			} else {
				reslist[user.telephone] = seqtext + "打卡失败:" + res.data.message
				results = "失败:" + res.data.message
				color = "bg-red"
				if (user.SendKey){
					let token = "luckqy"
					let d = new Date()
					let date = d.getFullYear() + d.getMonth() + d.getDate()
					let newinviteCode = md5(token + user.telephone + date)
					
					let callFunctionResult = await uniCloud.callFunction({
						name: "pushServer",
						data: {
							SendKey: user.SendKey,
							title: seqtext + "通知" ,
							desp: "自动打卡失败!请自行打卡,并检查登录状态是否正常,然后重新登录。今日邀请码："+newinviteCode
						}
					})
				}
				
			}
			let callFunctionResult = await uniCloud.callFunction({
				name: "pushLog",
				data: {
					telephone: user.telephone,
					title: seqtext + "打卡" + results,
					color: color
				}
			})
		} catch (err) {
			console.log(err)
		}

	}


	console.log(reslist)
	//返回数据给客户端
	return reslist
};
