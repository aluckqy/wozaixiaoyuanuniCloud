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
			todayqarr: event.qarr,
			signToday:event.signToday,
			temprature_max:event.temprature_max,
			temprature_min:event.temprature_min,
		}).then(ressu=>{
			 res =ressu
		}).catch(err=>{
			res = err
		})
	} 
	return res
};
