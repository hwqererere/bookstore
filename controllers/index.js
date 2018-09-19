const app = getApp()
var model=require('../utils/model.js')
const initindex=function initindex(_this){
	model.userInfo({},function(redata){
		if(redata.code==200){
			app.globalData.sysuserinfo=redata.data
			app.globalData.coin=redata.data.coin
			app.globalData.rmb=redata.data.rmb
			_this.setData({indexData:{coin:redata.data.coin,rmb:redata.data.rmb,level:redata.data.level}}),
			model.userMessage(_this)			
		}else{
			model.tips(_this,redata.message)
		}
	})
	
	model.loginSign_info({},function(redata){
			if(redata.code==200){
				if(!redata.data.sign_today){
					let info=[]
					for(let i=0;i<redata.data.info.length;i++){
						info[i]={}
						info[i].coin=redata.data.info[i].coin
						info[i].reward=redata.data.info[i].reward
					}
					info[0].d="第一天"
					info[1].d="第二天"
					info[2].d="第三天"
					info[3].d="第四天"
					info[4].d="第五天"
					info[5].d="第六天"
					info[6].d="第七天"
					_this.setData({floatedData:{id:"sign",infolist:info}})
				}				
			}else{
				model.tips(_this,redata.message)
			}	
	})
	let timeing=app.globalData.timeing?(app.globalData.timeing-0):0
	let helptimes=app.globalData.helptimes?(app.globalData.helptimes-0):0
	
	model.userNew_package({},function(redata){
		if(redata.code==200){
			if(!redata.data.reward){
				app.globalData.helptimes=redata.data.times
				let helper=[]
				for(let i=0;i<redata.data.user.length;i++){
					helper[i]={show:1,user_nickname:redata.data.user[i].user_nickname,user_logo:redata.data.user[i].user_logo}
				}
				let nonelength=3-redata.data.user.length
				for(let i=0;i<nonelength;i++){
					helper[helper.length]={show:0}
				}					
				app.globalData.helpusers=helper
				if(timeing==0){
					helpindextime(_this)					
				}
				app.globalData.timeing=1
			}else{
				let idata=_this.data.indexData
				idata.timeing=0
				_this.setData({indexData:idata})
			}
		}
	})

}


function helpindextime(_this){
	if(app.globalData.timeing==1){
		let hour=Math.floor(app.globalData.helptimes/3600)
		let minutes=Math.floor((app.globalData.helptimes-hour*3600)/60)
		let second=Math.floor(app.globalData.helptimes%60)
		let show=""
		if(app.globalData.helptimes>0){
			show="倒计时:"+hour+":"+minutes+":"+second
		}else{
			show="倒计时:0:0:0"
		}		
		let idata=_this.data.indexData
		idata.helptime=show
		idata.timeing=1
		_this.setData({indexData:idata})
		app.globalData.helptimes-=1
		setTimeout(function(){helpindextime(_this)},1000)
	}else{
		let idata=_this.data.indexData
		idata.helptime=""
		idata.timeing=0
		_this.setData({indexData:idata})
	}	
}




const openhelpfloated=function openhelpfloated(_this,e){
	_this.setData({floatedData:{id:"timeredbag",helpers:app.globalData.helpusers}})
	openhelpf(_this)
}

const openhelperredbag=function openhelperredbag(_this,e){
	if(app.globalData.helptimes<=0){
		model.userNew_package_reward({},function(redata){
			if(redata.code==200){
				wx.setNavigationBarColor({ frontColor: '#ffffff',backgroundColor: '#d55a4a'})
				_this.setData({floatedData:{id:"redbag",rmb:redata.data.rmb}})
			}
		})
	}	
}

const closeredbag=function closeredbag(_this,e){
	wx.setNavigationBarColor({ frontColor: '#ffffff',backgroundColor: '#61348b'})
	_this.setData({floatedData:{id:""}})
	app.globalData.timeing=0
	initindex(_this)
}


function openhelpf(_this){
	if(app.globalData.helptimes>0){
		let t={}
		t.hour=Math.floor(app.globalData.helptimes/3600)
		t.minutes=Math.floor((app.globalData.helptimes-t.hour*3600)/60)
		t.second=Math.floor(app.globalData.helptimes%60)
		let fData=_this.data.floatedData
		fData.helptime=t
		_this.setData({floatedData:fData})
		setTimeout(function(){openhelpf(_this)},1000)
	}else{
		let t={}
		t.hour=0
		t.minutes=0
		t.second=0
		let fData=_this.data.floatedData
		fData.helptime=t
		_this.setData({floatedData:fData})
	}	
}


const bindUserInfoFn=function bindUserInfoFn(_this,e){
	let type=e.currentTarget.dataset.type?e.currentTarget.dataset.type:e.target.dataset.type
	if(type=='login'){
		model.checklogin(_this)
	}else{
		if (e.detail.userInfo) {
				model.checklogin(_this)
				startGame(_this,e)
			}else{
				startGame(_this,e)
			}
	}

}
const startGame=function startGame(_this,e){
	model.questionInfo({},function(redata){
		if(redata.code==200){
			app.globalData.question_index=redata.data.index-1
			wx.navigateTo({
			    url: "index?pageid=game"
			})
		}else{
			model.tips(_this,redata.message)
		}
	})

}

const openAddCoinFloated=function openAddCoinFloated(_this,e){
	_this.setData({floatedData:{id:"getGold"}})
}

const goToRank=function goToRank(_this,e){
	model.Rank({},function(redata){
		if(redata.code==200){
			app.globalData.rank=redata.data
			wx.navigateTo({
			    url: "index?pageid=rank"
			})
		}else{
			model.tips(_this,redata.message)
		}		
	})
}

const goToGetCoin=function goToGetCoin(_this,e){
	model.loginSign_info({},function(redata){
		if(redata.code==200){
			model.userRelation_info({},function(reredata){
				if(reredata.code==200){
					app.globalData.loginSign_info=redata.data
					app.globalData.userRelation_info=reredata.data
					wx.navigateTo({
				    	url: "index?pageid=getcoin"
					})
				}else{
					model.tips(_this,reredata.message)
				}
			})
			
				
		}else{
			model.tips(_this,redata.message)
		}	

	})
}

const goToCash=function goToCash(_this,e){

	wx.navigateTo({
			url: "index?pageid=cash"
	})
//	wx.navigateTo({
//		url: "index?pageid=cash"
//	})
}




const noneshare=function noneshare(_this,e){
	let re=model.shareConfig(_this,'none',function(){
	})
	return re
}

const coinshare=function coinshare(_this,e){
	let re=model.shareConfig(_this,'addcoin',function(){
		initindex(_this);
	})
	return re
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
				setTimeout(function(){
					model.tips(_this,'打赏成功')
					initindex(_this)
				},1000)
			},
			'fail':function(res){console.log(res)},
			'complete':function(res){console.log(res)}
			})
		}
	})
//	model.userAdd_coin({rmb:rmb},function(redata){
//		if(redata.code==200){
//			model.tips(_this,"兑换成功")
//			initindex(_this)
//		}else{
//			model.tips(_this,redata.message)
//		}
//	})
}

const goToOtherGame=function goToOtherGame(){
	wx.navigateTo({
			url: "index?pageid=morepage"
	})
}
const signclick=function signclick(_this,e){
	
	let user_id=app.globalData.user_id

	model.loginSign({},function(redata){
		if(redata.code==200){
			app.globalData.coin=redata.data.total_coin
			model.tips(_this,"签到成功，金币+"+redata.data.coin)			
			initindex(_this)
		}
		_this.setData({floatedData:{id:""}})
	})
	
	
}
module.exports = {
  initindex:initindex,
  bindUserInfoFn:bindUserInfoFn,
  startGame:startGame,
  openAddCoinFloated:openAddCoinFloated,
  goToRank:goToRank,
  goToGetCoin:goToGetCoin,
  goToCash:goToCash,
  noneshare:noneshare,
  coinshare:coinshare,
  addcoin:addcoin,
	goToOtherGame:goToOtherGame,
	signclick:signclick,
	openhelpfloated:openhelpfloated,
	closeredbag:closeredbag,
	openhelperredbag:openhelperredbag
  
}