const app = getApp()

var routes={}
routes.index=require("../controllers/index.js")
routes.game=require("../controllers/game.js")
routes.rank=require("../controllers/rank.js")
routes.getcoin=require("../controllers/getcoin.js")
routes.cash=require("../controllers/cash.js")
routes.cashlist=require("../controllers/cashlist.js")
routes.morepage=require("../controllers/morepage.js")
var model=require("model.js")

const getUrlData=function getUrlData(_this,options,callback){
  app.globalData.friend_id=options.friend_id?decodeURIComponent(options.friend_id):""
  app.globalData.channel_id=options.channel_id?options.channel_id:""
  app.globalData.user_id=wx.getStorageSync("user_id")+""
//	let login=wx.getStorageSync("login")-0
	
	
	if(app.globalData.user_id=="" ){
		if(model.checklogin(_this)){
			_this.setData({login:true}),
			callback.call(this)
		}else{
			_this.setData({login:false})
			model.loginGet_user_id(_this,callback)
		}		
	}else{
		if(model.checklogin(_this)){
			_this.setData({login:true})
		}else{
			_this.setData({login:false})
		}	
		callback.call(this)
	}
		
	
	
	
// 	if( model.checklogin(_this) ){
// 	 _this.setData({login:true})
// 	 callback.call(this)
// 	}else{
// 		_this.setData({login:false})
// 		if(app.globalData.user_id=="" ){
// 			model.loginGet_user_id(_this,callback)
// 		}else{
// 			callback.call(this)
// 		}		
// 	}
//if(app.globalData.user_id=="" && login==0){
//		if(!model.checklogin(_this)){
//			model.loginGet_user_id(_this)
//			_this.setData({login:false})
//			wx.setStorageSync("login",0)
//		}
//}else if(login==1 && app.globalData.user_id==""){
//	model.checklogin(_this)
//}else if(login==0 && app.globalData.user_id!=""){
//	_this.setData({login:false})
//}

}





const pageCtrl=function pageCtrl(_this,pageid){ //获取url信息  
  let action = "init" + pageid;  
  app.globalData.pageid=pageid  
  _this.setData({pageid:pageid})
  routes[pageid][action](_this)
}

const fn = function fn(_this,e){
  let fnName = e.currentTarget.dataset.fn ? e.currentTarget.dataset.fn : e.target.dataset.fn
//console.log(routes[app.globalData.pageid])
  routes[app.globalData.pageid][fnName](_this,e)
}

const sharefn=function sharefn(_this,e){
	let sharefnName=e.target.dataset.sharefn?e.target.dataset.sharefn:e.currentTarget.dataset.sharefn
	return routes[app.globalData.pageid][sharefnName](_this,e)
}


const bindUserInfo=function bindUserInfo(_this,e){
	routes[app.globalData.pageid]["bindUserInfoFn"](_this,e)
}
module.exports = {
  getUrlData:getUrlData,
  pageCtrl: pageCtrl,
  fn:fn,
  sharefn:sharefn,
  bindUserInfo:bindUserInfo
}
