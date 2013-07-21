Js XML Tree说明
================
Js Xml Tree，是一个简洁易用的把xml文档转化为树形列表显示的JavaScript插件，并提供了单选框、复选框、节点图标、节点菜单等功能，基于jQuery框架开发。

作者：东风破 @ 济南


调用接口
----------------
$('#example').jsxmltree(options); // options 采取 json 的写法提供。


options列表
----------------
* xmlurl: '';  // XML数据源的路径，必选参数
* checktype: 'radio', 'checkbox', undefined // 选择框类型，默认为 undefined
* icon: true, false;  // 是否要输出图标（图标定义于 XML 的每个节点的 icon 属性），默认是 false
* expand: true, false;  // 输出后是否默认展开，默认是 false


相关函数
----------------
* $('#example').expand();  // 完全展开某个树形列表
* $('#example').retract();  // 完全收起某个树形列表
* $('#example').allcheck();  // 全选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）
* $('#example').alluncheck();  // 全不选某个树形列表中所有节点（在 checktype == 'checkbox' 时有效）
* $('#example').getvalues();  // 获取选中节点的值（在 checktype != null 时有效，多个值用逗号隔开）
* $('#example').gettexts();  // 获取选中节点的显示文字（在 checktype != null 时有效，多个值用逗号隔开）


节点属性定义
----------------
* text - 必选属性，该节点显示的文字
* value - 可选属性，表示该节点的值（在 checktype != null 时有效）
* icon - 可选属性，表示该节点的图标（在 icon == true 时有效）
* checked - 可选属性，true, false，是否已选中（在 checktype != null 时有效）
* disabled - 可选属性，true, false，表示该节点是否禁用（在 checktype != null 时有效）
* href - 可选属性，表示该节点的链接
* target - 可选属性，表示节点的链接要跳转的框架（如 "self"、"blank" 或者某个 iframe，与 href 是关联参数，只有 href 存在时有效）
* onclick - 可选属性，表示节点单击时要执行的动作（与 href 是互斥参数，只能存其一）


功能特点
----------------
* 支持同一页面调用多个树形列表，通过调用接口容器的 id 作为区分。
* 支持 text 和可选的 value 属性。
* 通过 checktype 可以设置节点的选择框，并可以设置 checkbox 和 radio 两种类型，此时可以通过内置的方法获取选中项的值。
* 通过 icon 设置节点的图标。


应用场景
----------------
* 组织机构与用户列表、权限角色与菜单列表等功能的设置与选择，这时会用到选择框，或许会用到图标
* 多级菜单目录，通常放在系统左边栏，这时或许会用到图标，但主要会用到列表项的文本自身应当具有链接功能
* 组织机构、用户、菜单项的维护管理界面，此时可能不会用到选择框，但为了操作的直观性，可能需要列表项本身可以出现弹出式菜单，以便容纳更多的操作选项。


节点的上下文菜单
================
在节点上，某些场景下可能会用到弹出菜单，以便实现对节点的编辑、删除、增加子节点等功能。


调用接口
----------------
showcontextmenu(options); // options 采取 json 的写法提供。

注：showcontextmenu 不能被节点本身的href直接调用，需要根据具体节点的类型与应用场景，通过自定义的function来间接调用，同时，自定义 function 负责提供 options 参数。

options列表
----------------
* menu: [{text: '菜单1', url: 'menu1.html', target: 'blank', onclick: 'action1'}, {text: '菜单1', url: 'menu1.html', target: 'blank', onclick: 'action2'}];  // 菜单列表的定义，必选参数

  > 菜单项的定义中，text是必选的， url、target、onclick 三个参数根据需要进行选择（其中 onclick 与 href 是互斥参数，只能存其一； target 是 href 的关联参数）。

* attach: obj;  // 菜单所依附的对象，必选参数