/* ===================================================
 * Js XML Tree v1.0.0
 * filename: jsxmltree.js
 * http://jsxmltree.dfp.me
 * ===================================================
 * Copyright 2013 dfp.me
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


/* 树形目录调用主函数
 * =========================================== */
$.fn.jsxmltree = function(options) {

	var obj = $(this);
	if (obj.attr("id") == undefined) {
		alert("引用错误！必须在一个定义了 id 的 div 中使用 $('#example').jsxmltree() 的方式调用本插件！");
		return;
	}

	// 载入XML数据
	$.ajax({
        type: "get",
        url: options.xmlurl,
        dataType: "xml",
        success: function (data) {
			$(data).children().each(function() {
				$(this).attr("node-sn", "0");  // 初始化根节点的顺序号
				// 使用调用对象的一个属性作为生成HTML的临时存储区
				obj.attr("html", "<div id=\"jsxmltree-" + obj.attr("id") + "-" + $(this).attr("node-sn") + "-children\">{jsxmltree-" + obj.attr("id") + "-" + $(this).attr("node-sn") + "-children}</div>");
				obj.html($(this).treeInit(obj, options));  // 树形目录初始化
				obj.removeAttr("html");  // 移除临时属性

				if (options.expand == true) {  // 是否默认展开
					$(obj).expand();
				}
			});
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
			alert("XML载入错误：" + errorThrown);
        }
    });
}


/* 树形列表初始化
 * ===================== */
$.fn.treeInit = function(obj, options) {

	var nodes = $(this).children();

	// ===1、获取下级节点的HTML代码===
	var nodeHtml = "";
	for (var i = 0; i < nodes.length; i++) {
		// 当前节点的顺序号
		$(nodes[i]).attr("node-sn", $(this).attr("node-sn") + "-" + i);

		// 当前节点的节点模型
		$(nodes[i]).attr("piece-mode", $(nodes[i]).getPieceMode({
			"index": i,
			"length": nodes.length,
			"parent": $(this)
		}));

		// 节点HTML
		nodeHtml += "<table class=\"node-table\" id=\"jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr>";  // 当前节点的div起始标记

		// 根据节点模式输出节点的结构线
		for (var j = 0; j < $(nodes[i]).attr("piece-mode").length; j++) {
			// 输出层次线
			switch ($(nodes[i]).attr("piece-mode").substring(j, j + 1)) {
				case "0":
					nodeHtml += "<td><span class=\"piece-blank\"></span></td>";
					break;

				case "1":
					nodeHtml += "<td><span class=\"piece-list\"></span></td>";
					break;

				case "2":
					nodeHtml += "<td><span class=\"piece-body-nochild\"></span></td>";
					break;

				case "3":
					nodeHtml += "<td><span class=\"piece-body-plus\" onclick=\"javascript:toggleNode(this);\"></span></td>";
					break;

				case "4":
					nodeHtml += "<td><span class=\"piece-top-nochild\"></span></td>";
					break;

				case "5":
					nodeHtml += "<td><span class=\"piece-top-plus\" onclick=\"javascript:toggleNode(this);\"></span></td>";
					break;

				case "6":
					nodeHtml += "<td><span class=\"piece-bottom-nochild\"></span></td>";
					break;

				case "7":
					nodeHtml += "<td><span class=\"piece-bottom-plus\" onclick=\"javascript:toggleNode(this);\"></span></td>";
					break;

				case "8":
					nodeHtml += "<td><span class=\"piece-root-nochild\"></span></td>";
					break;

				case "9":
					nodeHtml += "<td><span class=\"piece-root-plus\" onclick=\"javascript:toggleNode(this);\"></span></td>";
					break;
			}
		}

		// 输出选项框
		if (options.checktype == "checkbox" || options.checktype == "radio") {
			nodeHtml += "<td><input type=\"" + options.checktype + "\" id=\"jsxmltree-"  + obj.attr("id") + "-check-" + $(nodes[i]).attr("node-sn") + "\" name=\"jsxmltree-"  + obj.attr("id") + "-check\"";

			if($(nodes[i]).attr("checked") == "true") {
				nodeHtml += " checked";
			}

			if($(nodes[i]).attr("disabled") == "true") {
				nodeHtml += " disabled";
			}

			if($(nodes[i]).attr("value") != undefined) {
				nodeHtml += " value=\"" + $(nodes[i]).attr("value")+ "\"";
			}

			if($(nodes[i]).attr("text") != undefined) {
				nodeHtml += " text=\"" + $(nodes[i]).attr("text")+ "\"";
			}

			nodeHtml += " /></td>";
		}

		// 输出图标
		if (options.icon == true) {
			if($(nodes[i]).attr("icon") != undefined && $(nodes[i]).attr("icon") != "") {
				nodeHtml += "<td><span class=\"" + $(nodes[i]).attr("icon") + "\"></span></td>";
			}
			else {
				nodeHtml += "<td><span class=\"piece-icon-txt\"></span></td>";
			}
		}

		// 输出文本
		if ($(nodes[i]).attr("href") != undefined) {
			if ($(nodes[i]).attr("target") != undefined) {
				nodeHtml += "<td><a class=\"piece-text\" href=\"" + $(nodes[i]).attr("href") + "\" target=\"" + $(nodes[i]).attr("target") + "\">" + $(nodes[i]).attr("text") + "</a></td>";
			}
			else {
				nodeHtml += "<td><a class=\"piece-text\" href=\"" + $(nodes[i]).attr("href") + "\">" + $(nodes[i]).attr("text") + "</a></td>";
			}
		}
		else if ($(nodes[i]).attr("onclick") != undefined) {
				nodeHtml += "<td><span class=\"piece-text\" onclick=\"javascript:" + $(nodes[i]).attr("onclick") + "\">" + $(nodes[i]).attr("text") + "</span></td>";
		}
		else {
			if (options.checktype == "checkbox" || options.checktype == "radio") {
				nodeHtml += "<td><label class=\"piece-text\" for=\"jsxmltree-"  + obj.attr("id") + "-check-" + $(nodes[i]).attr("node-sn") + "\">" + $(nodes[i]).attr("text") + "</label></td>";
			}
			else {
				nodeHtml += "<td><span class=\"piece-text\" onclick=\"javascript:toggleClick(this);\">" + $(nodes[i]).attr("text") + "</span></td>";
			}
		}

		nodeHtml += "</tr></tbody></table>";  // 当前节点的div结束标记

		// 如果当前节点有子节点，输出该节点的子节点占位区和占位符
		if ($(nodes[i]).children().length > 0) {
			nodeHtml += "<div id=\"jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "-children\" style=\"display: none\">";
			nodeHtml += "{jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "-children}"; // 输出该节点的子节点替换位
			nodeHtml += "</div>";
		}
	}

	// ===2、使用获取的下级节点HTML代码替换模版中当前节点的占位符
	obj.attr("html", obj.attr("html").replace("{jsxmltree-" + obj.attr("id") + "-" + $(this).attr("node-sn") + "-children}", nodeHtml));

	// ===3、递归下级节点===
	var nodes = $(this).children();
	for (var i = 0; i < nodes.length; i++) {
		$(nodes[i]).treeInit(obj, options);
	}

	return obj.attr("html");
}


/* 获取当前节点的节点模式
 * ===================== */
$.fn.getPieceMode = function(options) {

	// 首先解析当前的节点模式
	// 包括：0: blank; 1: list; 2: piece-body-nochild; 3: piece-body-plus; 4: piece-top-nochild; 5: piece-top-plus;
	// ----  6: piece-bottom-nochild; 7: piece-bottom-plus; 8: piece-root-nochild; 9: piece-root-plus

	var pieceCurrent = "2";  // 默认该节点是列表项

	if ($(this).children().length > 0) {
		pieceCurrent = "3"; // 有子节点的列表项
	}

	// 是否顶节点
	if (options.index == 0) {
		// 一级节点的顶节点
		if ($(options.parent).context.nodeName == "root") {
			if ($(this).children().length > 0) {
				pieceCurrent = "9";
			}
			else {
				pieceCurrent = "8";
			}
		}
		// 非一级节点的顶节点
		else {
			if ($(this).children().length > 0) {
				pieceCurrent = "5";
			}
			else {
				pieceCurrent = "4";
			}
		}
	}

	// 是否尾节点
	if (options.index == options.length - 1) {
		if ($(this).children().length > 0) {
			pieceCurrent = "7";
		}
		else {
			pieceCurrent = "6";
		}
	}

	// 根据父节点的类型推理节点前缀
	var pieceMode = "";

	var pieceParent = $(options.parent).attr("piece-mode");
	if (pieceParent != undefined && pieceParent != "") {
		for (var i = 0; i < pieceParent.length; i++) {
			// 假如父节点不是尾节点或空白，则继承父节点信息，输出竖线
			if (pieceParent.substring(i, i + 1) != "7" && pieceParent.substring(i, i + 1) != "0") {
				pieceMode += "1";
			}
			// 如果是尾节点或空白，则输出空白
			else {
				pieceMode += "0";
			}
		}
	}

	// 获得当前节点的模型
	pieceMode += pieceCurrent;

	return pieceMode;
 }


/* 点击展开或收起某个节点
 * ========================== */
function toggleNode(obj) {
	if ($(obj).attr("class").indexOf("plus") > -1) {
		var currentClass = $(obj).attr("class");
		$(obj).removeClass(currentClass);
		$(obj).addClass(currentClass.replace("plus", "minus"));
		$("#" + $(obj).parent().parent().parent().parent().attr("id") + "-children").fadeIn("fast");
	}
	else if ($(obj).attr("class").indexOf("minus") > -1) {
		var currentClass = $(obj).attr("class");
		$(obj).removeClass(currentClass);
		$(obj).addClass(currentClass.replace("minus", "plus"));
		$("#" + $(obj).parent().parent().parent().parent().attr("id") + "-children").fadeOut("fast");
	}
}

/* 点击展开或收起某个节点（通过点击节点文本）
 * ========================== */
function toggleClick(obj) {
	if ($(obj).parent().parent().children("[class$=-plus]")[0] != undefined) {
		$(obj).parent().parent().children("[class$=-plus]").click();
	}
	else if ($(obj).parent().parent().children("[class$=-minus]")[0] != undefined) {
		$(obj).parent().parent().children("[class$=-minus]").click();
	}
}

/* 完全展开某个树形列表
 * ============================ */
$.fn.expand = function () {
	$(this).find("[class$=-plus]").click();
}

/* 完全收起某个树形列表
 * ============================ */
$.fn.retract = function () {
	$(this).find("[class$=-minus]").click();
}


/* 全选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）
 * ============================ */
$.fn.allcheck = function () {
	$(this).expand();
	$(this).find(":checkbox").each(function () {
		if ($(this).prop("disabled") != true)
		{
			$(this).prop("checked", true);
		}
	});
}

/* 全不选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）
 * ============================ */
$.fn.alluncheck = function () {
	$(this).expand();
	$(this).find(":checkbox").each(function () {
		$(this).prop("checked", false);
	});
}


/* 获取选中节点的值（在 checktype != null 时有效，多个值用逗号隔开）
 * ============================ */
$.fn.getvalues = function () {
	var values = "";

	$(this).find(":checkbox").each(function () {
		if ($(this).prop("checked") == true) {
			values += $(this).attr("value") + ",";
		}
	});

	$(this).find(":radio").each(function () {
		if ($(this).prop("checked") == true) {
			values += $(this).attr("value") + ",";
		}
	});

	if (values.length > 0) {
		values = values.substring(0, values.length - 1);
	}

	return values;
}

/* 获取选中节点的显示文字（在 checktype != null 时有效，多个值用逗号隔开）
 * ============================ */
$.fn.gettexts = function () {
	var texts = "";

	$(this).find(":checkbox").each(function () {
		if ($(this).prop("checked") == true) {
			texts += $(this).attr("text") + ",";
		}
	});

	$(this).find(":radio").each(function () {
		if ($(this).prop("checked") == true) {
			texts += $(this).attr("text") + ",";
		}
	});

	if (texts.length > 0) {
		texts = texts.substring(0, texts.length - 1);
	}

	return texts;
}