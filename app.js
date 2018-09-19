//app.js
App({
  onLaunch: function (options) {
  	let _this=this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
		var utils=require('utils/util.js')
		
		wx.setStorageSync('versionUrl','https://res.doumai.com/cdy/config/version.txt')
		wx.setStorageSync('BackversionUrl','https://res.doumai.com/cdy/config/versionBackup.txt')
		wx.setStorageSync('testversionUrl','https://res.doumai.com/cdy/config/testversion.txt')
			

		// utils.test()
		
  },

  globalData: {
    userInfo: null
  }
})