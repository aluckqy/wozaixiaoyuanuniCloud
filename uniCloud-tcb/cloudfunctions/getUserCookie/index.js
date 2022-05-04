'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getuser = await db.collection('uni_wzxy_user').where({
		telephone: event.telephone,
	}).get()
	//返回数据给客户端
	return getuser
};
