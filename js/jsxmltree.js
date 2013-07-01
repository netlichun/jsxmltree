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
	if(obj.attr("id") == undefined) {
		alert("引用错误！必须在一个定义了 id 的 div 中使用 $('#example').jsxmltree() 的方式调用本插件！");
		return;
	}

	// 载入XML数据
	$.ajax({
        type: "get",
        url: options.xmlurl,
        dataType: "xml",
        success: function (data) {
			$(data).find("root").each(function() {
				$(this).attr("node-sn", "0");  // 初始化根节点的顺序号
				obj.attr("html", "{jsxmltree-" + obj.attr("id") + "-" + $(this).attr("node-sn") + "-children}");
				obj.html($(this).treeInit(obj, options));  // 树形目录初始化
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
		nodeHtml += "<div class=\"node-normal\" id=\"jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "\">";  // 当前节点的div起始标记
		// 根据节点模式输出节点的结构线

		for (var j = 0; j < $(nodes[i]).attr("piece-mode").length; j++) {
			// 输出层次线
			switch ($(nodes[i]).attr("piece-mode").substring(j, j + 1)) {
				case "0":
					nodeHtml += "<span class=\"piece-blank\"></span>";
					break;

				case "1":
					nodeHtml += "<span class=\"piece-list\"></span>";
					break;

				case "2":
					nodeHtml += "<span class=\"piece-body-nochild\"></span>";
					break;

				case "3":
					nodeHtml += "<span class=\"piece-body-plus\" onclick=\"javascript:toggleNode(this);\"></span>";
					break;

				case "4":
					nodeHtml += "<span class=\"piece-top-nochild\"></span>";
					break;

				case "5":
					nodeHtml += "<span class=\"piece-top-plus\" onclick=\"javascript:toggleNode(this);\"></span>";
					break;

				case "6":
					nodeHtml += "<span class=\"piece-bottom-nochild\"></span>";
					break;

				case "7":
					nodeHtml += "<span class=\"piece-bottom-plus\" onclick=\"javascript:toggleNode(this);\"></span>";
					break;

				case "8":
					nodeHtml += "<span class=\"piece-root-nochild\"></span>";
					break;

				case "9":
					nodeHtml += "<span class=\"piece-root-plus\" onclick=\"javascript:toggleNode(this);\"></span>";
					break;
			}
		}

		// 输出选项框
		if (options.checktype == "checkbox" || options.checktype == "radio") {
			nodeHtml += "<span class=\"piece-check\"><input type=\"" + options.checktype + "\" id=\"jsxmltree-"  + obj.attr("id") + "-check-" + $(nodes[i]).attr("node-sn") + "\" name=\"jsxmltree-"  + obj.attr("id") + "-check\"";

			if($(nodes[i]).attr("checked") != undefined && $(nodes[i]).attr("checked") == true) {
				nodeHtml += " checked";
			}

			if($(nodes[i]).attr("disabled") != undefined && $(nodes[i]).attr("disabled") == true) {
				nodeHtml += " disabled";
			}

			if($(nodes[i]).attr("value") != undefined) {
				nodeHtml += " value=\"" + $(nodes[i]).attr("value")+ "\"";
			}

			nodeHtml += " /></span>";
		}

		// 输出图标
		if (options.icon == true || options.icon == "true") {
			if($(nodes[i]).attr("icon") != undefined && $(nodes[i]).attr("icon") != "") {
				nodeHtml += "<span class=\"" + $(nodes[i]).attr("icon") + "\"></span>";
			}
			else {
				nodeHtml += "<span class=\"piece-icon-txt\"></span>";
			}
		}

		// 输出文本
		nodeHtml += "<span class=\"piece-text\">" + $(nodes[i]).attr("text") + "</span>";
		nodeHtml += "</div>";

		// 输出该节点的子节点占位区
		nodeHtml += "<div class=\"children-normal\" id=\"jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "-children\" style=\"display: none\">";
		nodeHtml += "{jsxmltree-" + obj.attr("id") + "-" + $(nodes[i]).attr("node-sn") + "-children}"; // 输出该节点的子节点替换位
		nodeHtml += "</div>";

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
	if(pieceParent != undefined && pieceParent != "") {
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
 * ======================== */
function toggleNode(node) {

	if($(node).attr("class").indexOf("plus") > -1) {
		var currentClass = $(node).attr("class");
		$(node).removeClass(currentClass);
		$(node).addClass(currentClass.replace("plus", "minus"));
		$("#" + $(node).parent().attr("id") + "-children").fadeIn("fast");
	}
	else if($(node).attr("class").indexOf("minus") > -1) {
		var currentClass = $(node).attr("class");
		$(node).removeClass(currentClass);
		$(node).addClass(currentClass.replace("minus", "plus"));
		$("#" + $(node).parent().attr("id") + "-children").fadeOut("fast");
	}
}


/* 完全展开某个树形列表
 * ======================== */
$.fn.expand = function () {
	$(this).find("span[class$=-plus]").click();
}

/* 完全收起某个树形列表
 * ======================== */
$.fn.retract = function () {
	$(this).find("span[class$=-minus]").click();
}