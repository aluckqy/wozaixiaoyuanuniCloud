'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getuser = await db.collection('uni_wzxy_user').where({
		telephone: event.telephone,
	}).count()
	let res = {}
	if (getuser.total>=1) {
		console.log("更新")
		let updatauser = await db.collection('uni_wzxy_user').where({
			telephone: event.telephone,
		}).update({
			healthqarr: event.qarr,
			signHealth:event.signHealth
		}).then(ressu=>{
			 res = ressu
		}).catch(err=>{
			res =  err
		})
	}
	return res
	//返回数据给客户端

};
