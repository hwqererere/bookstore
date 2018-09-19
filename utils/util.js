const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const intTime=()=>{
	let t = (new Date()).getTime() + "";
	return t
}


const setconfigdata=function setconfigdata(options,callback){
  	wx.showLoading({title:'加载中'	})
		let qmode=options.mode?options.mode:""
		if(qmode=="test"){
				configurationFn(wx.getStorageSync("testversionUrl"),function(){
					let title=wx.getStorageSync("title")+""
					if(title!=""){
						wx.setNavigationBarTitle({title: title})
					}
					callback.call()
				})
		}else{
			configurationFn(wx.getStorageSync("versionUrl"),function(){
				let title=wx.getStorageSync("title")+""
				if(title!=""){
					wx.setNavigationBarTitle({title: title})
				}
				callback.call()
			})			
		}
		
  }



const configurationFn=function configurationFn(configurl,callback){
	let t = (new Date()).getTime()
	wx.request({
    url: configurl+"?t="+t,
    data: {},
    dataType:'json',
    method:'GET',
    header: {'content-type': 'application/json'},
    success: function (res) {
    	 	
    	let localPassVersion=wx.getStorageSync('passversion')-0   
    	if(res.data.passversion!=localPassVersion){
    		wx.setStorageSync('passversion',res.data.passversion)
    		getpassFile(res.data.passurl,"question")
    	}
    	let localVersion=wx.getStorageSync('version')-0   
    	if(res.data.version!=localVersion){
				getconfigFile(res.data.configFile+"?t="+t,function(){
					wx.setStorageSync('version',res.data.version)
					wx.setStorageSync('md5key',res.data.md5key)
		    	callback.call(this)
				})
    	}else{callback.call(this)}
    	
    	
    	
    },
    fail:function (){
    	backUrl=wx.getStorageSync('BackversionUrl')+"?t="+t
      wx.request({
		    url: backUrl,
		    data: {},
		    dataType:'json',
		    method:'GET',
		    header: {'content-type': 'application/json'},
		    success: function (res) {
		    	let localVersion=wx.getStorageSync('version')-0		    	
		    	if(res.data.version!=localVersion){
		    		getconfigFile(res.data.configFile+"?t="+t,function(){
		    			wx.setStorageSync('version',res.data.version)
		    			wx.setStorageSync('md5key',res.data.md5key)
		    			callback.call(this)
		    		})
		    	}else{callback.call(this)}
		    },
		    fail:function (){
		    	wx.showModal({showCancel:false, content: '错误代码:version,请联系客服'})
		    }
		  })
    }
  })
}
function getconfigFile(configFile,callback){
	wx.request({
	  url: configFile,
	  data: {},
	  dataType:'json',
	  method:'GET',
	  header: {'content-type': 'application/json'},
		success: function (configres) {
	   	wx.setStorageSync('rule',configres.data.rule)
			wx.setStorageSync('port',configres.data.port)
			wx.setStorageSync('title',configres.data.title)
			wx.setNavigationBarTitle({title: configres.data.title})
			wx.setStorageSync('domain',configres.data.domain)
			wx.setStorageSync('tipsTime',configres.data.tipsTime)
			wx.setStorageSync('bgm',configres.data.bgm)
			callback.call(this)
		},
		fail:function (){
			wx.showModal({showCancel:false, content: '错误代码:configfile,请联系客服'})
		}
	})
}

function getpassFile(fileurl,key){
	wx.request({
	  url: fileurl,
	  data: {},
	  dataType:'json',
	  method:'GET',
	  header: {'content-type': 'application/json'},
		success: function (res) {
	   	wx.setStorageSync(key,res.data)},
		fail:function (){
			wx.setStorageSync("passversion","0")
			wx.showModal({showCancel:false, content: '错误代码:passfile,请联系客服'})
		}
	})
}


const requestFn=function requestFn(port,getdata,method,callback){
	
	let portobj=wx.getStorageSync('port')
	let domain=wx.getStorageSync('domain')+""
	let requestUrl=domain+portobj[port]
	if(requestUrl!=""){
		if(method=="get"){
			getRequestFn(requestUrl,getdata,callback)
		}else{
			postRequestFn(requestUrl,getdata,callback)
		}
	}else{
		wx.removeStorage({
		  key: 'version',
		  success: function(res) {
		  	configurationFn(wx.getStorageSync("testversionUrl"))
		  	setTimeout(function(){
		  		wx.showModal({
              title: '小程序有更新',
              showCancel: false,
              confirmText:"重启",
              content: '点击重启完成更新',
              success:function(){
              	wx.reLaunch({
								  url: ''
								})
              }
        	})
		  	},5000)
		  	
		    
		  } 
		})
	}
	
}







const postRequestFn=function postRequestFn(port,getdata,callback){
//	wx.showLoading({title: '加载中'})
	wx.request({
    url: port,
    data: getdata,
    method:'POST',
    header: {'content-type': 'application/json'},
    success: function (res) {
//  	wx.hideLoading()
      callback.call(this, res.data)
    },
    fail:function (e){
      console.log(e)
    }
 })  
}
const getRequestFn=function getFn(port,getdata,callback){

  wx.request({
    url: port,
    data: getdata,
    method:'GET',
    header: {'content-type': 'application/json'},
    success: function (res) {
    		  
//  	wx.hideLoading()
      callback.call(this, res.data)
    },
    fail:function (e){
      console.log(e)
    }
  })
}

const tips=function tips(_this,word){
	_this.setData({tips:word})
	setTimeout(function(){
		_this.setData({tips:""})
	},1500)
}



const test=function test(){
		var timestamp2 =Date.parse(new Date());
            console.log("a"+timestamp2);
		wx.request({
    url: "https://res.doumai.com/mxdzz/config/question.json",
    data: {},
    method:'GET',
    header: {'content-type': 'application/json'},
    success: function (res) {
    	console.log(res)
			wx.setStorage({key:"test",data:res.data,success:function(){
				var timestamp1 =Date.parse(new Date());
            console.log("b"+timestamp1);
				wx.getStorage({key:'test',success:function(e){
					let sss=e.data
					var timestamp3 =Date.parse(new Date());
            console.log("c"+timestamp3);
          	console.log(sss.length)
				var timestamp4 =Date.parse(new Date());
            console.log("d"+timestamp4);
				}})

			
			}})


    },
    fail:function (e){
      console.log(e)
    }
 }) 
}

function random(lower, upper) {//产生随机整数
	return Math.floor(Math.random() * (upper - lower+1)) + lower;
}  
module.exports = {
	random:random,
  formatTime: formatTime,
  setconfigdata:setconfigdata,
  configurationFn:configurationFn,
  intTime:intTime,
  requestFn:requestFn,
  postRequestFn:postRequestFn,
  getRequestFn:getRequestFn,
  test:test
}
