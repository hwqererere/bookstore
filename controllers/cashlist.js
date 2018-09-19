const app = getApp()
var model=require('../utils/model.js')
var utils=require('../utils/util.js')
const initcashlist=function initcashlist(_this){
	wx.setNavigationBarColor({frontColor: '#000000',backgroundColor: '#f1f0f5'})
	app.globalData.subOrderRmb=0
	
	_this.setData({cashlistData:formatorderlist(app.globalData.userGet_orders)})
}

function formatorderlist(orderlist){
	console.log(app.globalData.userGet_orders)
	let re=[]
	for(let i=0;i<orderlist.length;i++){
		re[i]={}
		re[i].order_state=orderlist[i].order_state
		re[i].order_rmb=orderlist[i].order_rmb
		let t = new Date(orderlist[i].order_create_time * 1000);
    re[i].order_create_time = utils.formatTime(t);
	}
	return re
	
}
module.exports = {
  initcashlist: initcashlist

}