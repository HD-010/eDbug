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
	//用户偏好设置视图部件
	setUp : function (){
		var str = this.closeBt();
		str = this.addFunc("noticeBack",str);	//添关闭按钮到提示框
		str = this.addFunc("mask",str);			//添加提示框到蒙版
		this.setWget(str);
	},
	
	closeBox : function (){
		$("div[name=mask]").remove();
	},
	
	//蒙板
	mask : function(content){
		content = content || "这里添加内容";
		return "<div name=mask>"+content+"</div>";
	},
	
	//提示框背景
	noticeBack : function (content){
		return "<div name=noticeBack>"+content+"</div>";
	},
	
	//将contents添加到视图部件func
	addFunc : function(func,contents){
		return eval("(this." + func + "(contents))");
	},
	
	//将视图部件添加到obj对象
	setWget : function(contents,obj){
		obj = obj || $("body");
		$(obj).append(contents);
	},
	
	/*-------------------------------------以下为视图部件内容区--------------------------------------*/
	closeBt : function (){
		return "<div name=colseBt><a href=javascript:wget.closeBox()>&#215;</a></div>";
	}
	/*-------------------------------------end--------------------------------------*/
}
