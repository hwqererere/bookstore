const app = getApp()
const initmorepage=function initmorepage(_this){
	let t = (new Date()).getTime()
	wx.request({
		url: "https://res.doumai.com/miniProgramConfig/othergame.json?t="+t,
		data: {},
		dataType:'json',
		method:'GET',
		header: {'content-type': 'application/json'},
		success: function (res) {
			_this.setData({morepageData:res.data})
		},
		fail:function(){
			wx.request({
				url: "https://res.doumai.com/miniProgramConfig/othergameBackup.json?t="+t,
				data: {},
				dataType:'json',
				method:'GET',
				header: {'content-type': 'application/json'},
				success: function (res) {
					_this.setData({morepageData:res.data})
				},
				fail:function(){
					wx.showModal({showCancel:false, content: '正在更新，请稍后再来'})
				}
			})
			
		}
	})
}



module.exports = {
  initmorepage:initmorepage  
}