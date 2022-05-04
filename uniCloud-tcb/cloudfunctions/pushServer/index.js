'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const res = await uniCloud.httpclient.request("https://sctapi.ftqq.com/" + event.SendKey + ".send", {
		method: 'POST',
		data: {
			title: event.title,
			desp: event.desp
		},
		contentType: 'application/x-www-form-urlencoded', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	//返回数据给客户端
	return res
};
