const app = getApp()
var model=require('../utils/model.js')
var utils=require('../utils/util.js')
const initcash=function initcash(_this){
	wx.setNavigationBarColor({frontColor: '#000000',backgroundColor: '#f1f0f5'})
	app.globalData.subOrderRmb=0
	
	_this.setData({cashData:{rmb:app.globalData.rmb}})
}

// const bindKeyInput=function bindKeyInput(_this,e){
// 	let val=e.detail.value
// 	app.globalData.subOrderRmb=val*100
// 	_this.setData({cashData:{rmb:app.globalData.rmb}})
// }

const setcash=function setcash(_this,e){
	let val=e.currentTarget.dataset.val?e.currentTarget.dataset.val:e.target.dataset.val
	let value=Math.round(val*100)

	if(app.globalData.rmb<value){
		model.tips(_this,'余额不足')
		_this.setData({cashData:{rmb:app.globalData.rmb,inputValue:""}})
	}else{
		app.globalData.subOrderRmb=value
		_this.setData({cashData:{rmb:app.globalData.rmb,inputValue:value}})
		
	}
}
const makeOrder=function makeOrder(_this,e){
	if((_this.data.cashData.inputValue-0)>0){
		if(app.globalData.subOrderRmb>app.globalData.rmb){
				model.tips(_this,'提现金额不能大于余额')
			}else if(app.globalData.subOrderRmb<100){
				model.tips(_this,'提现金额不能小于1元')
			}else{
				model.userMake_order({rmb:app.globalData.subOrderRmb},function(redata){
					if(redata.code==200){
						model.tips(_this,'提现成功')
		// 				model.userGet_orders({},function(reredata){
		// 					if(reredata.code==200){
		// 						app.globalData.userGet_orders=reredata.data
		// 						model.userInfo({},function(rereredata){
		// 							if(rereredata.code==200){
		// 								app.globalData.rmb=rereredata.data.rmb
		// 								_this.setData({cashData:{rmb:app.globalData.rmb,orderlist:formatorderlist(app.globalData.userGet_orders)}})
		// 							}
		// 						})
		// 					}else{
		// 						model.tips(_this,redata.message)
		// 					}
						// })
					}else{
						model.tips(_this,redata.message)
					}
				})
			}
	}
	

}

const linktoindex=function linktoindex(_this,e){
	wx.navigateBack({
  delta: 1
	})
}
const linktocashlist=function linktocashlist(_this,e){
	model.userGet_orders({},function(redata){
		if(redata.code==200){
			app.globalData.userGet_orders=redata.data
			wx.navigateTo({
					url: "index?pageid=cashlist"
			})
		}else{
			model.tips(_this,redata.message)
		}
	})
}

module.exports = {
  initcash: initcash,
  // bindKeyInput:bindKeyInput,
  makeOrder:makeOrder,
	setcash:setcash,
	linktoindex:linktoindex,
	linktocashlist:linktocashlist

}