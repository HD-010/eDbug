$(document).ready(function() {$("body").html(bodyContents);});

// 从测试环境获取日志对象
var logObj = {
	// 调试环境baseUrl
	baseUrl : document.location.origin,
	serverUrl : "http://js.e01.com",
	//格式化的json代码
	code:"",
	//格式化代码展示背景色
	baseColor : [ "#006600", "#CC66CC", "#666666", "#336633", "#996699", "#FF66FF" ],
	//当前使用颜色
	color:"",
	// 日志对象
	logData : "",
	// 日志读取标识
	readTag : 'log',
	
	// 按块显示日志
	viewLog:function(data, status) {
		if (status == 'success') {
			$('[name="contents"]').html(data);
		}
	},
	
	// 获取日志内容
	logContents : function() {
		var url = this.baseUrl + '/?log';
		$.ajax({
			url : url,
			oper : this.readTag,
			type : 'POST',
			crossDomain : true,
			success : this.tranceLog,
			error : function() {
				alert("错误");
			}
		});
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
				$.ajax({
					url : logObj.serverUrl,
					type : 'POST',
					dataType : 'TEXT',
					data : {
						oper : "parseFormate",
						data : dataStr
					},
					success : logObj.viewLog,
					error : function(data) {
						console.log(data);
						alert("错误");
					},
				});
			}
		}
	},
	
	//展示格式化后的代码
	viewCode:function(data,status){
		if(status != 'success') {return;}
		var codeList = $("[name=codeList]").html();
		$("[name='codeList']").html(codeList + data);
		this.setViewSize();
		this.setColor(o, sialize);
	},
	
	//格式化json代码
	eachElement:function(){
		$.ajax({
			url : logObj.serverUrl,
			type : 'POST',
			dataType : 'TEXT',
			data : {
				oper : "codeList",
				data : logObj.code,
			},
			success : logObj.viewCode,
			error : function(data) {
				console.log(data);
				alert("错误");
			},
		});
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
		var width = 90 / views + "%";
		$("div[name=list]").width(width);
		var height = screen.availHeight - 260 + "px";
		$("div[name=list]").height(height);
		$("div[name=codeList]").css({
			"height" : height,
			"overflow" : "scroll"
		});
	},
	
	//格式化代码
	formateCode:function(o){
		var sialize = $(o).attr("sialize");
		if (!sialize) {
			sialize = Date.parse(new Date());
			$(o).attr("sialize", sialize);
			var code = $(o).siblings([ name = code ]).text();
			var str = $(o).siblings("[name='list']").html();
			code = eval("(" + code + ")");
			var str = eachElement(code);
			str = "<div name=list sialize="	+ sialize + ">" + str + "</div>";
			var codeList = $("[name=codeList]").html();
			$("[name='codeList']").html(codeList + str);
			this.setViewSize();
			this.setColor(o, sialize);
		} else {
			$(o).attr("sialize", "");
			$("div[sialize=" + sialize + "]").remove();
			this.setViewSize();
			this.setColor(o, 0);
		}
	}
};

// 获取日志内容并将日志内容显示到布局中
logObj.logContents();
	
function eachElement(o) {
	var str = "";
	if (Object.prototype.toString.call(o) == "[object Object]") {
		str += "{";
		for ( var k in o) {
			str += "<span name=st>";
			if (typeof o[k] != "object") {
				str += "<font source=object>" + k + " : "+ o[k] + "</font>";
			} else {
				str += k + ":" + eachElement(o[k]);
			}
			str += "</span>";
		}
		str += "}";
	} else if (Object.prototype.toString.call(o) == "[object Array]") {
		str += "[";
		for ( var k in o) {
			str += "<span name=st>";
			if (typeof o[k] != "object") {
				str += "<font source=array>" + o[k]	+ "</font>";
			} else {
				str += eachElement(o[k]);
			}
			str += "</span>";
		}
		str += "]";
	}
	return str;
}
