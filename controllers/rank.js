const app = getApp()
var model=require('../utils/model.js')
const initrank=function initrank(_this){
	_this.setData({
		rankData:{all:true,all_rank:app.globalData.rank.all_rank,rmb_rank:app.globalData.rank.rmb_rank}
	})
}

const allchange=function allchange(_this,e){
	if(_this.data.rankData.all){
		_this.setData({
			rankData:{all:false,all_rank:app.globalData.rank.all_rank,rmb_rank:app.globalData.rank.rmb_rank}
		})
	}else{
		_this.setData({
			rankData:{all:true,all_rank:app.globalData.rank.all_rank,rmb_rank:app.globalData.rank.rmb_rank}
		})
	}
}


const noneshare=function noneshare(_this,e){
	let re=model.shareConfig(_this,'none',function(){})
	return re
}
module.exports = {
  initrank:initrank,
  allchange:allchange,
  noneshare:noneshare
}