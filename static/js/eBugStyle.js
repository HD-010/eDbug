$(document).ready(function() {
	var cicleNumbre = 1;

	$("li[name=t1]").mouseover(function() {
		$("ul[name=t2]").css("visibility", "visible")
	});
	$("li[name=t1]").mouseout(function() {
		$("ul[name=t2]").css("visibility", "hidden")
	});
	
	$("div[name=maskTag]").on("click",function(){
		$("div[name=parentMask]").remove()
	})
});



var styles = {
	//设置取消遮罩事件
	cancleMask : function(obj){
		$("div[name=maskParent]").remove();
	},
}




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
		return "<div name=maskParent><div name=maskParentTag onclick=styles.cancleMask()></div>" + content + "</div>";
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
