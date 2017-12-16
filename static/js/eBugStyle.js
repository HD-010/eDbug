$(document).ready(function() {
	var cicleNumbre = 1;
	var baseColor = [ "#006600", "#CC66CC", "#666666",
			"#336633", "#996699", "#FF66FF" ];
	var color = "";
	$("span[name=ft]").on('click',function() {
		var sialize = $(this).attr("sialize");
		if (!sialize) {
			sialize = Date.parse(new Date());
			$(this).attr("sialize", sialize);

			var code = $(this).siblings([ name = code ]).text();
			var str = $(this).siblings("[name='list']").html();
			code = eval("(" + code + ")");
			var str = eachElement(code);
			str = "<div name=list sialize="	+ sialize + ">" + str + "</div>";
			var codeList = $("[name=codeList]").html();
			$("[name='codeList']").html(codeList + str);
			setViewSize();
			setColor(this, sialize);
		} else {
			$(this).attr("sialize", "");
			$("div[sialize=" + sialize + "]").remove();
			setViewSize();
			setColor(this, 0);
		}
	});

	function setColor(o, sialize) {
		if (sialize) {
			color = baseColor.shift();
			$(o).css({
				"background-color" : color,
				"color" : "#FFFFFF"
			});
			$(o).text("取消格式化");
			$("div[sialize=" + sialize + "]").css("background-color", color);
		} else {
			color = $(o).css("background-color");
			$(o).text("格式化代码");
			baseColor.push(color);
			$(o).css("background-color", "#9F9F9F");
		}
	}

	function setViewSize() {
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
	}

	$("li[name=t1]").mouseover(function() {
		$("ul[name=t2]").css("visibility", "visible")
	});
	$("li[name=t1]").mouseout(function() {
		$("ul[name=t2]").css("visibility", "hidden")
	});
});




var wget = {
	//小部件数据容器
	data : "",
	
	//小部件数据控制器，检测data是否为空，如果不为空则执行下的语句，如果为空则向服务端请求数据
	dataControl : function(funcName){
		if(!wget.data){
			funcName = common.ucFirst(funcName);
			eval("(this.get"+funcName+"())");
			return;
		}else{
			var myData = wget.data;
			wget.data = "";
			return myData
		}
	},
	
	//用户偏好设置视图部件
	message : function (){
		var str = this.closeBt();
		str += "提示：？？？？？";					//将提示内容与关闭按钮合并
		str = this.addFunc("noticeBack",str);	//添加内容到提示框
		str = this.addFunc("mask",str);			//添加内容到蒙版
		str = this.addFunc("fullMask",str);		//添加内容到全屏蒙版
		this.setWget(str);
	},
	
	//属性设置视图部件
	setSys : function (){
		var data = this.dataControl("sysAttr");	//如果 wget.data为空，则从getSysAttr()获取数据
		if(!data){return;}
		str = this.addFunc("setUpBack",data);	//添加内容到容器
		str = this.addFunc("mask",str);			//添加内容到蒙版
		str = this.addFunc("fullMask",str);		//添加内容到全屏蒙版
		this.setWget(str);
	},
	
	/*-------------------------------------以下为视图部件区--------------------------------------*/
	// 全屏遮罩
	fullMask : function(content) {
		content = content || "这里添加内容";
		return "<div name=maskParent>" + content + "</div>";
	},
	
	//部份遮罩
	mask : function(content){
		content = content || "这里添加内容";
		return "<div name=mask>"+content+"</div>";
	},
	
	//提示框背景
	noticeBack : function (content){
		return "<div name=noticeBack>"+content+"</div>";
	},
	
	//属性设置背景
	setUpBack : function (content){
		return "<div name=setUpBack>"+content+"</div>";
	},
	
	
	//将contents添加到视图部件func
	addFunc : function(func,contents){
		return eval("(this." + func + "(contents))");
	},
	
	//将视图部件添加到obj对象
	setWget : function(contents,obj){
		obj = obj || document.body;
		$(obj).append(contents);
	},
	
	//关闭提示信息
	closeBox : function (){
		$("div[name=maskParent]").remove();
	},
	
	closeBt : function (){
		return "<div name=colseBt><a href=javascript:wget.closeBox()>&#215;</a></div>";
	},
	/*-------------------------------------end--------------------------------------*/
	
	/*-------------------------------------以下为视图部件内容区--------------------------*/
	getSysAttr : function(){
		//从服务端获取属性设置具体内容
		var data = "sysAttr";
		var oper = "wget";
		logObj.tranceData(data,oper,function(data,status){
			if(status == 'success'){
				wget.data = data;
				wget.setSys();
			}
		});
	},
	
	
	/*-------------------------------------end--------------------------------------*/
}
