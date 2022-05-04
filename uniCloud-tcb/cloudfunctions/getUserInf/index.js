'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getUserList = await db.collection('uni_wzxy_user').get()
	let response = {}

	for (let user of getUserList.data) {

		if (user.name) {
			console.log(user.name + "已更新,跳过此用户")
		} else {
			if (user.jwsession) {
				const res = await uniCloud.httpclient.request(
					'http://gw.wozaixiaoyuan.com/basicinfo/mobile/my/index', {
						method: 'POST',
						headers: {
							'Origin': 'http',
							'Accept': 'application/json, text/plain, */*',
							'X-Requested-With': 'com.tencent.mm',
							'Connection': 'keep-alive',
							'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat',
							'Referer': 'https',
							'Sec-Fetch-Site': 'same-origin',
							'Host': 'gw.wozaixiaoyuan.com',
							'Accept-Encoding': 'gzip, deflate',
							'Sec-Fetch-Mode': 'cors',
							'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
							'Content-Length': '0',
							'Content-Type': 'application/json;charset=UTF-8',
							"jwsession": user.jwsession,
							"Cookie": 'JWSESSION=' + user.jwsession
						},
						contentType: 'application/x-www-form-urlencoded', // 指定以application/json发送data内的数据
						dataType: 'json' // 指定返回值为json格式，自动进行parse
					})
				if (res.data.code == 0) {
					let updatauser = await db.collection('uni_wzxy_user').where({
						telephone: user.telephone,
					}).update({
						avatar: res.data.data.avatar,
						classes: res.data.data.classes,
						college: res.data.data.college,
						email: res.data.data.email,
						gender: res.data.data.gender,
						name: res.data.data.name,
						nation: res.data.data.nation,
						studentNumber: res.data.data.number,
					}).then(ressu => {
						response[user.telephone] = ressu
					}).catch(err => {
						response[user.telephone] = err
					})
				}

			}

		}


	}
	console.log(response)
	//返回数据给客户端
	return response
};
