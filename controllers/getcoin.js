const app = getApp()
var model=require('../utils/model.js')
const initgetcoin=function initgetcoin(_this){
	formatrelation(_this,app.globalData.loginSign_info.info)
}

const signclick=function signclick(_this,e){
	if(!app.globalData.loginSign_info.sign_today){	
		model.loginSign({},function(redata){
			if(redata.code==200){
				app.globalData.coin=redata.data.total_coin
				model.tips(_this,"签到成功，金币+"+redata.data.coin)
				model.loginSign_info({},function(reredata){
					if(redata.code==200){
						app.globalData.loginSign_info=reredata.data
						initgetcoin(_this)
					}else{
						model.tips(_this,reredata.message)
					}
				})
			}
		})
	}
}
const reflashRelation=function reflashRelation(_this,e){
	_this.setData({getcoinData:{loginSign_info:_this.data.getcoinData.loginSign_info,sign_today:app.globalData.loginSign_info.sign_today,coin:app.globalData.coin,userRelation_info:[],nullimg:[0,1,2,3,4,5,6]}})

	model.userRelation_info({},function(redata){
				if(redata.code==200){
					app.globalData.userRelation_info=redata.data
					formatrelation(_this,app.globalData.loginSign_info.info)
				}else{
					model.tips(_this,reredata.message)
				}
			})
}

function formatrelation(_this,infolist){
	let info=[]
	for(let i=0;i<infolist.length;i++){
		info[i]={}
		info[i].coin=infolist[i].coin
		info[i].reward=infolist[i].reward
	}
	info[0].d="第一天"
	info[1].d="第二天"
	info[2].d="第三天"
	info[3].d="第四天"
	info[4].d="第五天"
	info[5].d="第六天"
	info[6].d="第七天"
	let nullimglength=0
	if(app.globalData.userRelation_info.length>=7 ){
		nullimglength=0;
	}else{
		nullimglength=7-app.globalData.userRelation_info.length
	}
	let nullimg=[];
	for(let i=0;i<nullimglength;i++){
		nullimg[i]=i
	}	
	_this.setData({getcoinData:{loginSign_info:info,sign_today:app.globalData.loginSign_info.sign_today,coin:app.globalData.coin,userRelation_info:app.globalData.userRelation_info,nullimg:nullimg}})
}




const coinshare=function coinshare(_this,e){
	let re=model.shareConfig(_this,'addcoin',function(){
		initgetcoin(_this)
	})
	return re
}
const openAddCoinFloated=function openAddCoinFloated(_this,e){
	_this.setData({floatedData:{id:"getGold"}})
}

const addcoin=function addcoin(_this,e){
	let rmb=e.currentTarget.dataset.val ? e.currentTarget.dataset.val : e.target.dataset.val
	model.wxPay({rmb:rmb},function(redata){
		if(redata.code==200){
			wx.requestPayment(
			{
			'timeStamp': redata.data.timeStamp,
			'nonceStr': redata.data.nonceStr,
			'package': redata.data.package,
			'signType': 'MD5',
			'paySign': redata.data.paySign,
			'success':function(res){
				model.userInfo({},function(redata){
					if(redata.code==200){
						app.globalData.coin=redata.data.coin
						initgetcoin(_this)
						model.tips(_this,'打赏成功')
					}else{
						model.tips(_this,redata.message)
					}
				})
			},
			'fail':function(res){console.log(res)},
			'complete':function(res){console.log(res)}
			})
		}
	})
}
module.exports = {
  initgetcoin: initgetcoin,
  signclick:signclick,
	reflashRelation:reflashRelation,
	coinshare:coinshare,
	openAddCoinFloated:openAddCoinFloated,
	addcoin:addcoin
}