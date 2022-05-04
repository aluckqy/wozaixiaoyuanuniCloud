'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let getuser = await db.collection('uni_wzxy_user').where({
		telephone: event.telephone
	}).count()
	if (getuser.total>=1) {
		console.log("更新")
		let updatauser = await db.collection('uni_wzxy_user').where({
			telephone: event.telephone,
		}).update({
			password: event.password,
			jwsession: event.jwsession,
		})
	} else {
		console.log("添加")
		let adduser = await db.collection('uni_wzxy_user').add({
			telephone: event.telephone,
			password: event.password,
			jwsession: event.jwsession,
			isCookie:true,
			isActivate: true,
			signToday: true,
			signHealth: true,
			signBlue: false,
			temprature_max:36.5,
			temprature_min:36.0,
			location:{
					latitude: '33.0726212841',
					longitude: '107.0616988312',
					country: '中国',
					city: '汉中市',
					district: '汉台区',
					province: '陕西省',
					township: '汉中路街道',
					street: '民主街',
					myArea: '汉中市',
					areacode: '610702',
					towncode: '610702005',
					citycode: '0916',
				},
			healthqarr:[0,"36.0",0,0,0,"已接种",0,1,1],
			todayqarr:[0,0,0,0,0,"已接种",1]
		})
	}
	let resuser = await db.collection('uni_wzxy_user').where({
		telephone: event.telephone
	}).get()
	//返回数据给客户端
	return resuser
};
