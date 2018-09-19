const app = getApp()
var utils=require('util.js')
var postmode="get"
var md5=require('md5.js')
const tips=function tips(_this,msg){
	_this.setData({tips:msg})
	setTimeout(function(){
		_this.setData({tips:""})
	},wx.getStorageSync("tipsTime"))
}


const login=function login(data,callback){
	utils.requestFn("Login",data,postmode,callback)
}
const loginGet_user_id=function loginGet_user_id(_this,callback){
	let t = (new Date()).getTime()
	let data={}
	data.friend_id=app.globalData.friend_id?app.globalData.friend_id:""
	data.channel_id=app.globalData.channel_id?app.globalData.channel_id:""
	data.times=t;
	let md5key=t+wx.getStorageSync("md5key")+"+ ="
	data.sign = md5.Md5(md5key)
	utils.requestFn("loginGet_user_id",data,postmode,function(redata){
		if(redata.code==200){
			app.globalData.user_id=redata.data.user_id
			wx.setStorageSync("user_id",redata.data.user_id)
			callback.call(this)
		}else{
			tips(_this,redata.message)
		}
	})
}

const checklogin=function checklogin(_this){
	  	wx.login({
        success: loginRes => {
          wx.getUserInfo({
            success: getUserInfoRes => {
            	login({user_id:app.globalData.user_id, channel_id: app.globalData.channel_id,  friend_id:  app.globalData.friend_id, code: loginRes['code'], rawData: getUserInfoRes['rawData'], signature: getUserInfoRes['signature'], encryptedData: getUserInfoRes['encryptedData'], iv: getUserInfoRes['iv'] },function(redata){
								if(redata.code==200){
												app.globalData.user_id=redata.data.user_id
									wx.setStorageSync("user_id",redata.data.user_id)
									wx.setStorageSync("nickName",getUserInfoRes.userInfo.nickName)
									_this.setData({nickName:getUserInfoRes.userInfo.nickName})
									_this.setData({login:true})
									wx.setStorageSync("login",1)
									return true
								}else{
									tips(_this,redata.message)
									return false;
								}
           
            		
            	})              
            },
            fail:getuserinfoFailRes=>{
            	console.log(getuserinfoFailRes)
              _this.setData({login:false})
              return false
            }
          });
        },
        fail:loginFailRes=>{
        	console.log(loginFailRes)
        	_this.setData({login:false})
        	return false
        }
    })
}

const loginSign=function loginSign(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("loginSign",data,postmode,callback)
}
const userInfo=function userInfo(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userInfo",data,postmode,callback)
}
const questionInfo=function questionInfo(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("questionInfo",data,postmode,callback)
}
const questionCommit_key=function questionCommit_key(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("questionCommit_key",data,postmode,callback)
}
//const red_packageReward=function red_packageReward(data,callback){
//	data.user_id=app.globalData.user_id
//	utils.requestFn("red_packageReward",data,postmode,callback)
//}
const Rank=function Rank(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("Rank",data,postmode,callback)
}
const loginSign_info=function loginSign_info(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("loginSign_info",data,postmode,callback)
}
const userRelation_info=function userRelation_info(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userRelation_info",data,postmode,callback)
}

const userMake_order=function userMake_order(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userMake_order",data,postmode,callback)
}
const userGet_orders=function userGet_orders(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userGet_orders",data,postmode,callback)
}
const userAdd_coin=function userAdd_coin(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userAdd_coin",data,postmode,callback)
}

const shareReward_share=function shareReward_share(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("shareReward_share",data,postmode,callback)
}

const wxPay=function wxPay(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("wxPay",data,postmode,callback)
}

const shareConfig=function shareConfig(_this,type,callback){
  let t = (new Date()).getTime() + "";
  let s = t.split("");
  let l = (s[s.length - 1]-0)
  let re={}
  re.title = "【" + wx.getStorageSync('nickName') + "@你】猜电影 赢红包"; 
  re.path = 'pages/index/index?friend_id=' +encodeURIComponent(app.globalData.user_id);
  re.imageUrl = "https://res.doumai.com/cdy/shareimg/" + l+".jpg";
  re.success = function (e) {
	  if(type=="addcoin"){
	  	shareReward_share({},function(redata){
	  		if(redata.code==200){
	  			wx.showModal({showCancel:false,content: '分享成功，金币+'+redata.data.coin})
//	  			tips(_this,'分享成功，金币+'+redata.data.coin)
	  			app.globalData.sysuserinfo.coin=redata.data.total_coin
	  			app.globalData.coin=redata.data.total_coin
	  			callback.call({})
	  		}else{
	  			tips(_this,redata.messagechecklogin)
	  		}
	  		

	  	})
	  }
//    if(e.shareTickets){
//        wx.getShareInfo({
//          shareTicket: e.shareTickets[0],
//          success: function (res) {
//            getRequestFn("userShare",{encryptedData:res.encryptedData,iv:res.iv,user_id:app.globalData.user_id},function(redata){
//              callback.call(this,redata)
//            })
//          }
//        })
//      }else{
//        callback.call(this, {code:-999})
//      }
    }
  re.fail=function(e){
    console.log(e)
  }
  return re;
}

const formIdSubmit=function formIdSubmit(data,callback){//formid收集
	data.user_id=app.globalData.user_id
	utils.requestFn("userForm_id",data,postmode,callback)
}

const userMessage=function userMessage(_this){
	utils.requestFn("userMessage",{user_id:app.globalData.user_id},postmode,function(redata){
		if(redata.code==200){
			if(redata.data.coin>0){
				tips(_this,'有新用户通过您的分享进入游戏，获得'+redata.data.coin+'金币')
			}
		}
	})
}

const userNew_package=function userNew_package(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userNew_package",data,postmode,callback)
}

const userNew_package_reward=function userNew_package_reward(data,callback){
	data.user_id=app.globalData.user_id
	utils.requestFn("userNew_package_reward",data,postmode,callback)
}

module.exports = {
	tips:tips,
	login:login,
	checklogin:checklogin,
	loginGet_user_id:loginGet_user_id,
	loginSign:loginSign,
	userInfo:userInfo,
	questionInfo:questionInfo,
	questionCommit_key:questionCommit_key,
//	red_packageReward:red_packageReward,
	Rank:Rank,
	loginSign_info:loginSign_info,

	userRelation_info:userRelation_info,
	shareConfig:shareConfig,
	userMake_order:userMake_order,
	userGet_orders:userGet_orders,
	userAdd_coin:userAdd_coin,
	wxPay:wxPay,
	formIdSubmit:formIdSubmit,
	userMessage:userMessage,
	userNew_package:userNew_package,
	userNew_package_reward:userNew_package_reward
}