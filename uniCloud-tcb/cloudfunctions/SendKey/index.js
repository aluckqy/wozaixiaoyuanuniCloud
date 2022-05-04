'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getuser = await db.collection('uni_wzxy_user').where({
		telephone: event.telephone
	}).count()
	let res = {}
	if (getuser.total>=1) {
		console.log("更新")
		let updatauser = await db.collection('uni_wzxy_user').where({
			telephone: event.telephone,
		}).update({
			SendKey: event.SendKey,
		}).then(ressu=>{
			 res =ressu
		}).catch(err=>{
			res = err
		})
		const response = await uniCloud.httpclient.request("https://sctapi.ftqq.com/" + event.SendKey + ".send", {
			method: 'POST',
			data: {
				title: "MK打卡助手的测试消息",
				desp: "您已成功提交SendKey,小程序消息以后将由此推送！"
			},
			contentType: 'application/x-www-form-urlencoded', // 指定以application/json发送data内的数据
			dataType: 'json' // 指定返回值为json格式，自动进行parse
		})
		console.log(response)
	} 
	return res
};
