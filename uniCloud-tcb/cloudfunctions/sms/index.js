'use strict';
exports.main = async (event, context) => {
	try {
		const res = await uniCloud.sendSms({
			appid: '__UNI__A3DC89A',
			smsKey: '732279bcb307e7b86a82f1bfab0cecc1',
			smsSecret: '4092ab993837130a231c249aafa5964a',
			phone: event.telephone,
			templateId: '14666', // 请替换为自己申请的模板id
			data: {}
		})
		// 调用成功，请注意这时不代表发送成功
		return res
	} catch (err) {
		// 调用失败
		console.log(err.errCode)
		console.log(err.errMsg)
		return {
			code: err.errCode,
			msg: err.errMsg
		}
	}
};
