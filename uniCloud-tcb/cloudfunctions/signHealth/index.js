'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	let getUserListHealth = await db.collection('uni_wzxy_user').where({
		signHealth: true
	}).get()
	
	//返回数据给客户端
	return getUserListHealth
};
