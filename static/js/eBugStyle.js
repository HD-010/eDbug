/**
 * 
 */

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
		$("ul[name=t2]").css("display", "block")
	});
	$("li[name=t1]").mouseout(function() {
		$("ul[name=t2]").css("display", "none")
	});
});
