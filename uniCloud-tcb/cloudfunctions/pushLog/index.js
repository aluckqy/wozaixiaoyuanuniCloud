'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const db = uniCloud.database();
	let res = {}
	//定义一个GetTime函数
	function GetTime(){
		var time= new Date();//获取服务器当前时间给time变量 例：Fri Aug 20 2021 12:37:42 GMT+0
		var Mday=new Date(time.getFullYear(),time.getMonth()+1,0).getDate();
		let y = time.getFullYear() //年
		let m = time.getMonth() + 1 //月-整数值0（1月）到11（12月）故需要加1。
		let d = time.getDate() //日
		let h = time.getHours()+8 //时
		let mm = time.getMinutes() //分
		let s = time.getSeconds() //秒
		if(h>23){h=h-24;d=d+1;if(d>Mday){d=1;m=m+1;if(m==13){m=1;y+1}}}
		m = m < 10 ? ('0' + m) : m;d = d < 10 ? ('0' + d) : d;h=h < 10 ? ('0' + h) : h;mm = mm < 10 ? ('0' + mm) : mm;
		return {
			YMD: y+'-'+m+'-'+d,
			hms: h+':'+mm+':'+s
		}
	}
	

	let newdateTime = GetTime()
	console.log("添加日志")
	let updatauser = await db.collection('uni_wzxy_log').add({
			telephone:event.telephone,
			time: newdateTime.hms,
			date:newdateTime.YMD,
			title: event.title,
			color: event.color,

	}).then(ressu => {
		res = ressu
	}).catch(err => {
		res = err
	})

	return res
};
