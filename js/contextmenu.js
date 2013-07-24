/* ===================================================
 * Js XML Tree v1.0.0
 * filename: contextmenu.js
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

/* 输出上下文菜单容器
 * =========================================== */
document.write("<div class=\"contextmenu-container\" onclick=\"javascript:hiddencontextmenu();\" onmousemove=\"javascript:delay=10;\" onmouseover=\"javascript:timing=false;\" onmouseout=\"javascript:timing=true;\"></div>");

/* 上下文菜单调用主函数
 * =========================================== */
function showcontextmenu(options) {
	// 延展时间变量
	delay = 10;

	// 遍历输出菜单项
	var menuHtml = "";

	$.each(options.menu, function (index) {
		if (options.menu[index].url != undefined) {
			if (options.menu[index].target != undefined) {
				menuHtml += "<a class=\"contextmenu-menu\" href=\"" + options.menu[index].url + "\" target=\"" + options.menu[index].target + "\">" + options.menu[index].text + "</a>";
			}
			else {
				menuHtml += "<a class=\"contextmenu-menu\" href=\"" + options.menu[index].url + "\">" + options.menu[index].text + "</a>";
			}
		}
		else if (options.menu[index].onclick != undefined) {
			menuHtml += "<div class=\"contextmenu-menu\" onclick=\"javascript:" + options.menu[index].onclick + "\">" + options.menu[index].text + "</div>";
		}
		else {
			menuHtml += "<div class=\"contextmenu-menu\">" + options.menu[index].text + "</div>";
		}
	});
	$(".contextmenu-container").css("left", "0px");
	$(".contextmenu-container").css("top", "0px");

	$(".contextmenu-container").html(menuHtml);

	// 根据菜单依附对象调整菜单位置
	$(".contextmenu-container").css("left", $(options.attach).position().left + $(options.attach).width() + 4 + "px");
	$(".contextmenu-container").css("top", $(options.attach).position().top + "px");

	// 显示上下文菜单
	$(".contextmenu-container").css("visibility", "visible");
}


/* 隐藏上下文菜单
 * =========================================== */
function hiddencontextmenu() {
	$(".contextmenu-container").css("visibility", "hidden");
}


/* 通过倒计时实现上下文菜单的自动隐藏
 * =========================================== */
var timing = true;  // 计时器设置为true
var delay = 0;  // 倒计时初始值
function setDelay() {
    if (delay > 0 && timing == true) {
        delay = delay - 1;
    }
    else if (delay == 0) {
        hiddencontextmenu();
    }
    setTimeout(setDelay, 250);
}
setDelay();

// 点击页面中的其他位置，自动隐藏上下文菜单
$(function(){
	$(document).bind("click", function (e) {
		if (delay <= 9) {
			hiddencontextmenu();
		}
	});
});