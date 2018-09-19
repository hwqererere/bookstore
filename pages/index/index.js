//获取应用实例
const app = getApp()
var route=require("../../utils/route.js")
var model=require("../../utils/model.js")
var utils=require("../../utils/util.js")
Page({
  data: {
		addtomyminiprogram:false,
		notIOS:true,
		pageid:"",
		login:true,
		tips:"",
		nobgm:"0",
		animate:"",
		nickName:"",
		floatedData:{id:""},
		indexData:{},
		rankData:{},
		getcoinData:{},
		cashData:{},
		cashlistData:{},
		morepageData:{},
		ad:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
  	let _this=this

			var res = wx.getSystemInfoSync()
			if(res.platform == "ios"){
				_this.setData({notIOS:false})
			}

		
		
		
		
  	let nickName=wx.getStorageSync("nickName")?wx.getStorageSync("nickName"):''
		_this.setData({nickName:nickName})

  	let pageid=options.pageid?options.pageid:""
		if(pageid==""){
			app.globalData.timeing=0;
			utils.setconfigdata(options,function(){
				route.getUrlData(_this,options,function(){
					_this.showCallback()
				})
			})
		}  
		_this.showad()
  },
  onShow:function(){
  	let _this=this
  	let user_id=app.globalData.user_id?app.globalData.user_id:""
  	if(user_id==""){
  		app.globalData.user_id=wx.getStorageSync("user_id")+""
  		user_id=wx.getStorageSync("user_id")+""
  	}
  	if(user_id!=""){
  		_this.showCallback()
  	}
    
  },
  showCallback:function(){
  	let _this=this
  	let allpages=getCurrentPages()
	    let thispage=allpages[allpages.length-1]
	    let pageid=thispage.options.pageid?thispage.options.pageid:"index"
	    let apppageid=app.globalData.pageid?app.globalData.pageid:""
//	    if(apppageid!=pageid){
	      route.pageCtrl(_this,pageid)
//	    }
	    wx.hideLoading()
  },
  formSubmit:function(e){
	  let user_id=app.globalData.user_id+""
	  let formid=e.detail.formId?(e.detail.formId+""):""
	  if(user_id!="" && formid!="" && formid !='the formId is a mock one'){
		model.formIdSubmit({form_id:formid},function(){})  
	  }
	  
  },  
  bindgetUserInfo: function(e) {
  	let _this=this
  	route.bindUserInfo(_this,e)
  },
  fn:function(e){
  	let _this=this
//	console.log(e)
    route.fn(_this,e)
  },
  closeFloated:function(){
  	this.setData({floatedData:{id:""}})
  },
  onShareAppMessage:function(e){
    let _this = this;
    return route.sharefn(_this,e)
  },
  onHide:function(){
    if(app.globalData.pageid=="game"){      
      	app.globalData.sound_no.destroy()
				app.globalData.sound_yes.destroy()
				app.globalData.sound_success.destroy()
				app.globalData.bgm.destroy()
      
    }
  },
  onUnload:function(){
    if(app.globalData.pageid=="game"){
      app.globalData.sound_no.destroy()
				app.globalData.sound_yes.destroy()
				app.globalData.sound_success.destroy()
				app.globalData.bgm.destroy()
    }
  },
	showad:function(){
		let _this=this	
		_this.setData({ad:utils.random(0,2)})
		console.log(_this.data.ad)
	}
})
