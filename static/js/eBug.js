$(document).ready(function() {$("body").html(bodyContents);});

/*
 * 自启动项对象
 * 设置启动项,将需要自启动的项名称加入setOption
 * 启动项的值 以'true'或'false'两种状态存在于cookie中，值为'true'的项将跟随进程自动启动
 */
var auto = {
	//设置启动项,将需要自启动的项名称加入setOption
	setOption : [
	    'showOnChang',
	],
	//启动进程
	process : '',	
	//启动项（该值对应相应的函数）
	option : [],
	//检查启动项
	check : function(){
		auto.option = [];
		for(var o in auto.setOption){
			if(common.getCookies(auto.setOption[o]) == 'true'){
				auto.option.push(auto.setOption[o]);
			}
		}
	},
	
	//运行启动项
	run : function (){
		auto.check();
		//如果启动项为空，则关掉进程
		if(auto.option.length === 0){
			//clearInterval(autoRun);
			clearInterval(auto.process);
		}
		//执行启动项动作
		for(var a in auto.option){
			eval("(auto."+auto.option[a]+"())");
		}
	},
	
	/*---------------以下是启动项对应的动作-----------------------*/
	showOnChang : function (){
		console.log(1);
		// 获取日志内容并将日志内容显示到布局中
		logObj.tranceData('debug','read',logObj.tranceLog,logObj.baseUrl+"/?debug");
	},
	/*------------------------------------------------------*/
}

//开户自启动
auto.process = setInterval(auto.run,1000);




//公共对象
var common = {
	//将字符串的首字母大写
	ucFirst : function (str){
		return str.substring(0,1).toUpperCase()+str.substring(1);
	},
	
	//设置cookie
	setCookie : function (name,value,days){
	    var exp = new Date();
	    exp.setTime(exp.getTime() + days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	
	//获取cookie常用方法
	getCookies : function (name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
		else
		return null;
	},
	
	//将表单属性写入cookie,时长7天
	setCookieOption : function (obj){
		clearInterval(auto.process);
		var name,val,type;
		
		name = $(obj).attr('name');
		val = $(obj).val();
		type = $(obj).attr('type');
		
		if(type == 'checkbox'){
			val =  $(obj).is(":checked");
		}
		common.setCookie(name,val,7);
		auto.process = setInterval(auto.run,1000);
	},
}





// 从测试环境获取日志对象
var logObj = {
	// 调试环境baseUrl
	baseUrl : document.location.origin,
	serverUrl : "http://js.e01.com",
	//格式化的json代码
	code:"",
	//格式化代码展示背景色
	baseColor : [ "#006600", "#CC66CC", "#666666", "#336633", "#996699", "#FF66FF","#B8860B","#000080","#48D1CC"],
	//当前使用颜色
	color:"",
	// 日志对象 ,一条记录
	logData : "",
	//日志 序列号
	sialize : "",
	// 日志读取标识
	readTag : 'log',
	
	// 按块显示日志
	viewLog:function(data, status) {
		if (status == 'success') {
			$('[name="contents"]').html(data);
		}
	},
	
	

	
	// 获取要显示的日志内容
	tranceLog:function(data, status) {
		if (status == 'success') {
			// 获取数据的开始位置
			var strStart = data.indexOf('`DS`');
			status = data.substr(strStart + 7, 1);
			var strEnd = data.indexOf('`DE`');
			// 有用数据字串
			var dataStr = data.substring(strStart + 11, strEnd - 3);
			if (status == 'F') {
				viewLog('还没有日志', 'success');
			} else {
				logObj.tranceData(dataStr,'parseFormate',logObj.viewLog);
			}
		}
	},
	
	//设置代码格式化背景
	setColor:function(o, sialize) {
		if (sialize) {
			this.color = this.baseColor.shift();
			$(o).css({
				"background-color" : this.color,
				"color" : "#FFFFFF"
			});
			$(o).text("取消格式化");
			$("div[sialize=" + sialize + "]").css("background-color", this.color);
		} else {
			this.color = $(o).css("background-color");
			$(o).text("格式化代码");
			this.baseColor.push(this.color);
			$(o).css("background-color", "#9F9F9F");
		}
	},
    //设置格式化代码显示尺寸
	setViewSize:function() {
		var views = $("div[name=codeList]").children().length;
		views = views > 4 ? 4 : views;
		var width = 95 / views + "%";
		$("div[name=list]").width(width);
		var height = screen.availHeight - 180 + "px";
		$("div[name=list]").height(height);
	},
	//根据sialize删除格式化后的代码
	removeCode:function(){
		$(this.logData).attr("sialize", "");
		$("div[sialize=" + this.logData.sialize + "]").remove();
		this.setViewSize();
		this.setColor(this.logData, 0);
	},
	
	//展示格式化后的代码
	viewCode:function(data,status){
		str = "<div name=list sialize="	+ logObj.logData.sialize + ">" + data + "</div>";
		var codeList = $("[name=codeList]").html();
		$("[name='codeList']").html(codeList + str);
		logObj.setViewSize();
		logObj.setColor(logObj.logData, logObj.logData.sialize);
	},
	
	/**
	 * 传输待处理数据 格式化json代码
	 * oper  操作方式
	 * data  需要处理的数据
	 * callBack 回调函数
	 * uri 测试服端接口 该参数默认是服务端接口
	 */
	tranceData:function(data,oper,callBack,uri){
		$.ajax({
			url : uri || logObj.serverUrl,
			type : 'POST',
			dataType : 'TEXT',
			data : {
				oper : oper,
				data : data,
			},
			success : callBack,
			error : function(data) {
				console.log(data);
			},
		});
	},
	
	//根据sialize添加格式化后的代码
	addCode:function(o, sialize){
		//添加格式化后的代码
		this.logData.sialize = Date.parse(new Date());
		$(this.logData).attr("sialize", this.logData.sialize);
		var code = $(this.logData).siblings("[name='code']").text();
		this.tranceData(code,'codeFormate',logObj.viewCode);
	},
	
	//格式化代码
	formateCode:function(o){
		this.logData = o;
		this.logData.sialize = $(this.logData).attr("sialize");
		//sialize不知存在则添加格式代码，存在则删除
		this.logData.sialize ? this.removeCode() : this.addCode();
	},
	
	//清空测试服务端日志
	clear : function (){
		var url = this.baseUrl+"/?debug";
		this.tranceData('clear','func',function(data){
			logObj.tranceData(data,'func',function(data){
				location.href=this.baseUrl+"/?debug";
			},url);
		});
	},

};

// 获取日志内容并将日志内容显示到布局中
logObj.tranceData('debug','read',logObj.tranceLog,logObj.baseUrl+"/?debug");

