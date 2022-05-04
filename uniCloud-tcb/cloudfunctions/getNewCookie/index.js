'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getUserList = await db.collection('uni_wzxy_user').where({
		isActivate: true,
		isCookie: false
	}).get()
	console.log(getUserList)
	for (let user of getUserList.data) {
		let params = "username=" + user.telephone + "&password=" + user.password + "&openId=&unionId=&phoneInfo"
		const res = await uniCloud.httpclient.request(
			'https://gw.wozaixiaoyuan.com/basicinfo/mobile/login/username?' + params, {
				method: 'POST',
				headers: {
					'Origin': 'https',
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
				},
				contentType: 'application/x-www-form-urlencoded', // 指定以application/json发送data内的数据
				dataType: 'json' // 指定返回值为json格式，自动进行parse
			})
		console.log(res)
		if (res.data.code == 0) {
			let jwsession = ''

			try {
				if(res.headers.jwsession){
					jwsession = res.headers.jwsession
				}else{
					jwsession = res.headers.JWSESSION
				}
			} catch (err) {
				console.log(err)
			}
			console.log(jwsession)


			let callFunctionResult = await uniCloud.callFunction({
				name: "uni-login",
				data: {
					telephone: user.telephone,
					jwsession: jwsession,
					password: user.password
				}
			}).then(ressu => {
				console.log(ressu)

			})

			let updatauser = await db.collection('uni_wzxy_user').where({
				telephone: user.telephone,
			}).update({
				isCookie: true,
			})


		}

	}

	//返回数据给客户端
	return event
};
