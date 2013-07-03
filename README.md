Js XML Tree说明
================

Js Xml Tree，是一个简洁易用的把xml文档转化为树形列表显示的JavaScript插件，并提供了单选框、复选框、节点图标、节点菜单等功能，基于jQuery框架开发。



================
调用接口：
$('#example').jsxmltree(options); // options采取json的写法提供。

options列表：
xmlurl: '';  // XML数据源的路径，必选参数
checktype: 'radio', 'checkbox', undefined // 选择框类型，默认为undefined
icon: true, false;  // 是否要输出图标（图标定义于XML的每个节点的icon属性），默认是false
expand: true, false;  // 输出后是否默认展开，默认是false


其他接口：
$('#example').expand();  // 完全展开某个树形列表
$('#example').retract();  // 完全收起某个树形列表

$('#example').allcheck();  // 全选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）
$('#example').alluncheck();  // 全不选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）

$('#example').getvalues();  // 获取选中节点的值（在 checktype != null 时有效，多个值用逗号隔开）
$('#example').gettexts();  // 获取选中节点的显示文字（在 checktype != null 时有效，多个值用逗号隔开）


节点属性：
text - 必选属性，该节点显示的文字
value - 可选属性，表示该节点的值（在 checktype != null 时有效）
icon - 可选属性，表示该节点的图标（在 icon == true 时有效）
checked - 可选属性，true, false，是否已选中（在 checktype != null 时有效）
disabled - 可选属性，true, false，表示该节点是否禁用（在 checktype != null 时有效）


实现功能：
支持同一页面调用多个树形列表，通过调用接口容器的id作为区分。
支持text和可选的value属性。
通过checktype可以设置节点的选择框，并可以设置checkbox和radio两种类型，此时可以通过内置的方法获取选中项的值。
通过icon设置节点的图标。


应用场景：
组织机构与用户列表、权限角色与菜单列表等功能的设置与选择，这时会用到选择框，或许会用到图标
多级菜单目录，通常放在系统左边栏，这时或许会用到图标，但主要会用到列表项的文本自身应当具有链接功能
组织机构、用户、菜单项的维护管理界面，此时可能不会用到选择框，但为了操作的直观性，可能需要列表项本身可以出现弹出式菜单，以便容纳更多的操作选项。


====================
节点弹出菜单的设计：
在节点上，某些场景下可能会用到弹出菜单，以便实现对节点的编辑、删除、增加子节点等功能，但是，这个如何定义呢？
如果定义在调用接口的options列表中，然后由节点直接调用菜单名称，那么有时候链接是需要传递id的，无法固定。
如果定义在节点的属性里面，那么有点太长，且过于重复。
而且，节点的动作，有时未必是url可以概括的，也可能是要执行一段脚本。

结论：弹出菜单，设计专门的插件。