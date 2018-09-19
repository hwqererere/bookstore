const app = getApp()
var model=require('../utils/model.js')
var utils=require('../utils/util.js')
const initgame=function initgame(_this){
	
	app.globalData.clicking=""	
	app.globalData.sound_no= wx.createInnerAudioContext()
	app.globalData.sound_no.src="https://res.doumai.com/actionSound/sound_no.mp3"
	app.globalData.sound_yes= wx.createInnerAudioContext()
	app.globalData.sound_yes.src="https://res.doumai.com/actionSound/sound_yes.mp3"
	app.globalData.sound_success= wx.createInnerAudioContext()
	app.globalData.sound_success.src="https://res.doumai.com/actionSound/success.mp3"
	app.globalData.bgm= wx.createInnerAudioContext()
	app.globalData.bgm.src=wx.getStorageSync('bgm')
	app.globalData.bgm.loop=true
	setquestion(_this)
	bgm(_this);
}

function bgm(_this){
	let bgmkey=wx.getStorageSync('bgmkey')-0
	if(bgmkey==0){				
		_this.setData({nobgm:"0"})
		app.globalData.bgm.play()
	}else{
		_this.setData({nobgm:"1"})
		app.globalData.bgm.stop()
	}
}
const setbgm=function setbgm(_this,e){
	let bgmkey=wx.getStorageSync('bgmkey')-0
	if(bgmkey==0){				
		wx.setStorageSync('bgmkey',"1")		
	}else{
		wx.setStorageSync('bgmkey',"0")		
	}
	bgm(_this);
}

function getOtherAnswer(allkey){
	let random_index=utils.random(0,allkey.length-1)
	if(random_index!=app.globalData.question_index){
		return allkey[random_index].name
	}else{
		getOtherAnswer(allkey)
	}
}

function setquestion(_this){	
	let question=wx.getStorageSync("question")
	if(question.length<=app.globalData.question_index){
		model.tips(_this,'您已通关,敬请期待题库更新')		
	}else{
			let allkey=question
		
			let key_index=utils.random(0,2)
			
			let keylist=[];
			keylist[key_index]={chose:0,word:question[app.globalData.question_index].name}
			
			for(let i=0;i<3;i++){
				if(i!=key_index){
					let w=getOtherAnswer(allkey)
					keylist[i]={chose:0,word:w}
				}
			}
			_this.setData({gameData:{index:app.globalData.question_index,pic:question[app.globalData.question_index].pic,key_list:keylist,coin:app.globalData.coin}})	
			_this.setData({animate:"big"})	,
			_this.showad()
	}
	
	app.globalData.sound_success.stop()
	
	
}
function getquestion(_this){		
	_this.setData({animate:"small"})
	setTimeout(function(){
		setquestion(_this)
	},500)
}

const clickAnswer=function clickAnswer(_this,e){
	let question=wx.getStorageSync("question")
	let clicking=app.globalData.clicking?app.globalData.clicking:""
	let val=e.currentTarget.dataset.val?(e.currentTarget.dataset.val-0):(e.target.dataset.val-0)
	let answer=_this.data.gameData.key_list[val].word
	if(clicking=="" && _this.data.gameData.key_list[val].chose==0 ){		
		if(app.globalData.coin>199){		
			app.globalData.clicking=1			
			if(answer==question[app.globalData.question_index].name){
				app.globalData.sound_yes.play();
				setTimeout(function(){app.globalData.sound_yes.stop()},1000)
				let keylist=_this.data.gameData.key_list
				keylist[val].chose=2
				app.globalData.coin=app.globalData.coin-200	
				_this.setData({gameData:{index:_this.data.gameData.index,pic:_this.data.gameData.pic,coin:app.globalData.coin,key_list:keylist}})			
				model.questionCommit_key({key:answer},function(redata){					
					if(redata.data.red_package_reward>0){						
						app.globalData.sound_success.play();
						_this.setData({floatedData:{id:"getAward",rmb:redata.data.red_package_reward}})
					}
					model.userMessage(_this)
				})		
				app.globalData.question_index+=1
				if((_this.data.gameData.index%10)!=9 || _this.data.gameData.index==0){
					getquestion(_this)
				}
				
			}else{
				app.globalData.sound_no.play();
				setTimeout(function(){app.globalData.sound_no.stop()},1000)				
				model.tips(_this,'啊偶，答错了')
				let keylist=_this.data.gameData.key_list
				keylist[val].chose=1
				app.globalData.coin-=200	
				_this.setData({gameData:{index:_this.data.gameData.index,pic:_this.data.gameData.pic,coin:app.globalData.coin,key_list:keylist}})
				app.globalData.clicking=""
				model.questionCommit_key({key:answer},function(redata){})
			}		
			app.globalData.clicking=""
		}else{
			
			openAddCoinFloated(_this,e)
		}
	
	}
	
}
const nextquestion=function nextquestion(_this,e){
	_this.setData({floatedData:{id:""}})
	getquestion(_this)
}

const openAddCoinFloated=function openAddCoinFloated(_this,e){
	_this.setData({floatedData:{id:"getGold"}})
}
const addcoin=function addcoin(_this,e){
	let rmb=e.currentTarget.dataset.val ? e.currentTarget.dataset.val : e.target.dataset.val
//	model.userAdd_coin({rmb:rmb},function(redata){
//		if(redata.code==200){
//			model.tips(_this,"兑换成功")
//			app.globalData.coin=redata.data.total_coin
//			app.globalData.sysuserinfo.coin=redata.data.total_coin
//			setquestion(_this)
//			
//		}else{
//			model.tips(_this,redata.message)
//		}
//	})
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
						app.globalData.coin=redata.data.total_coin
						app.globalData.sysuserinfo.coin=redata.data.total_coin
						setquestion(_this)
				},1000)
			},
			'fail':function(res){console.log(res)},
			'complete':function(res){console.log(res)}
			})
		}
	})
}

const noneshare=function noneshare(_this,e){
	let re=model.shareConfig(_this,'none',function(){
		initgame(_this);
	})
	return re
}
const coinshare=function coinshare(_this,e){
	let re=model.shareConfig(_this,'addcoin',function(){
		initgame(_this);
	})
	return re
}

const openawardwordFloated=function openawardwordFloated(_this,e){
	_this.setData({floatedData:{id:"awardword"}})
}
module.exports = {
  initgame:initgame,
	setbgm:setbgm,
  clickAnswer:clickAnswer,
  nextquestion:nextquestion,
  openAddCoinFloated:openAddCoinFloated,
  addcoin:addcoin,
  noneshare:noneshare,
  coinshare:coinshare,
  openawardwordFloated:openawardwordFloated
}