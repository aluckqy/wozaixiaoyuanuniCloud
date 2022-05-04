'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getconf = await db.collection('uni_appid_conf').where({
		appid: event.appid,
	}).get()
	//返回数据给客户端
	return getconf
};
