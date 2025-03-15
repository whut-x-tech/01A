### 后端程序员好上手的前端框架——layui

layui的基础之后再补，现在是介绍**pear admin layui**

测试用后端项目[地址](https://github.com/9lucifer/pear_admin_crud/tree/master)

### 安装

[地址](https://gitee.com/pear-admin/pear-admin-layui)（gitee）

推荐下载的版本：

- 3.5.0
- 4.0.3

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250106002609852.png" alt="image-20250106002609852" style="zoom:67%;" />

#### 运行

把项目在vscode打开，找到index.html直接运行即可看到效果

![image-20250106002714081](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250106002714081.png)

（还是很炫酷的）





#### 和vue的对比

vue的生态太多，对js的特性掌握要求较高(但是在移动端的开发上兼容不错)

- vue2
- vue3

而layui只需要简单是三件套(html,css,javascript)的基础知识

###### 总结

如果需要支持大规模的管理和开发，还需要跨平台多端使用，需要实现的功能是更多的情况下，这个时候适合选用vue；如果是需要快速搭建一个网站，使用layui



### 整体结构

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250108032034353.png" alt="image-20250108032034353" style="zoom:50%;" />

其中，index页面是入口，运行的时候直接运行这个html页面即可，类似导航栏的作用；导航栏的细分的页面一般是存在view文件夹中

![image-20250108032311723](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250108032311723.png)

而admin/data/menu.js大概类似vue里面的router的作用（说错了欢迎指正，本人主后端）



### 通用部分

#### 需求举例：若需编写一个表格进行渲染。

##### **html 部分：**

```html
<table class="layui-hide" id="test1"></table>
```

（具体 API 可详见官网）。

##### **script 部分：**

###### 从 layui 引入各种组件：

```javascript
<script>
    layui.use(function () {
        let table = layui.table;
        let layer = layui.layer;
        let $ = layui.$;
    });
</script>
```

###### 删除操作的回调函数：

```javascript
table.on('tool(test1)', function (obj) {
    console.log(obj);
    let event = obj.event;
    if (event === 'delete') {
        // 删除提示
        layer.confirm('确定删除吗？', { btn: ['ok', 'close'] }, function (index) {
            // 删除操作
            console.log("删除");
            console.log(index);
            // 发送 Ajax 请求
            let roleId = obj.data.roleId;
            console.log("roleId");
            console.log(roleId);
            $.getJSON("http://localhost:8084/deleteRole", { roleId: roleId }, function (res) {
                console.log(res);
                if (res.code === 0) {
                    table.reload("test1");
                } else {

                }
            });
            layer.close(index);
        });
    } else if (event === 'edit') {
        // 更新操作
    }
});
```

###### 对表格进行渲染：

```javascript
// 表格渲染
table.render({
    elem: "#test1",
    url: "http://localhost:8084/getPages",
    page: {
        limit: 10,
        prev: "上一页",
        next: "下一页"
    },
    toolbar: `
        <div>
            <button type="button" class="layui-btn layui-bg-blue layui-btn-sm">添加</button>
        </div>
    `,
    request: {
        pageName: "pageNo",
        limitName: "pageSize"
    },
    parseData: function (res) {
        return {
            code: res.code,
            msg: res.msg,
            data: res.data.page,
            count: res.data.total
        };
    },
    cols: [
        [
            {
                title: "角色编号",
                field: "roleId"
            },
            {
                title: "角色名称",
                field: "roleName"
            },
            {
                title: "是否禁用",
                templet: function (row) {
                    return row.status === 1? '<span class="layui-badge layui-bg-green">有效</span>' : '<span class="layui-badge layui-bg-orange">禁用</span>';
                }
            },
            {
                title: "操作",
                templet: function (row) {
                    let s = '<div style="display: flex; flex-direction: column; align-items: center; gap: 5px; position: relative;">' +
                        '<button lay-event="edit" type="button" class="layui-btn layui-bg-orange layui-btn-sm" style="position: relative; top: 50%; transform: translateY(-50%);">' +
                        '更新</button>' +
                        '<button lay-event="delete" type="button" class="layui-btn layui-bg-red layui-btn-sm" style="position: relative; top: 50%; transform: translateY(-50%);">' +
                        '删除</button>' +
                        '</div>';
                    return s;
                }
            }
        ]
    ]
});
</script>
```

###### Ajax 的示例（需引用 layui 里的 $）：

```javascript
$.getJSON("http://localhost:8084/deleteRole", { roleId: roleId }, function (res) {
    console.log(res);
    if (res.code === 0) {
        table.reload("test1");
    } else {

    }
});
```

#### 完整代码和效果

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>角色管理</title>
		<link href="../../component/pear/css/pear.css" rel="stylesheet" />
		<link href="../../admin/css/other/error.css" rel="stylesheet" />
	</head>
	<body class="pear-container">
				<table class="layui-hide" id="test1" ></table>
		<script src="../../component/layui/layui.js"></script>
		<script src="../../component/pear/pear.js"></script>
		<script>
			layui.use(function () {
				let table = layui.table;
				let layer = layui.layer;
				let $ = layui.$;

				table.on('tool(test1)',function(obj){
					console.log(obj);
					let event = obj.event;
					if(event == 'delete'){
						//删除
						layer.confirm(
							'确定删除吗？',{
								btn:['ok','close']
							},function(index){
								//删除
								console.log("删除");
								console.log(index);
								//ajax
								let roleId = obj.data.roleId;
								console.log("roleId");
								console.log(roleId);
								$.getJSON("http://localhost:8084/deleteRole",{roleId:roleId},function(res){
									console.log(res);
									if(res.code==0){
										table.reload("test1");
									}else{

									}
								})

								layer.close(index)
							}
						);
					}else if(event == 'edit'){
						//更新
					}
				});

				//表格渲染
				table.render({
					elem:"#test1",
					url:"http://localhost:8084/getPages",
					page:{
						limit:10,
						prev:"上一页",
						next:"下一页"
					},
					toolbar:`
							<div>
								<button type="button" class="layui-btn layui-bg-blue layui-btn-sm">添加</button>
							</div>
					`,
					request:{
						pageName:"pageNo",
						limitName:"pageSize"
					},
					parseData:function(res){
						return{
							code:res.code,
							msg:res.msg,
							data:res.data.page,
							count:res.data.total
						}
					},
					cols:[[
						{
							title:"角色编号",
							field:"roleId"
						},
						{
							title:"角色名称",
							field:"roleName"
						},
						{
							title:"是否禁用",
							templet:function(row){
								return row.status == 1?'<span class="layui-badge layui-bg-green">有效</span></span>':'<span class="layui-badge layui-bg-orange">禁用</span>';
							}
						},
						{
							title: "操作",
							templet: function (row) {
								let s = '<div style="display: flex; flex - direction: column; align - items: center; gap: 5px; position: relative;">' +
									'<button lay-event="edit" type="button" class="layui-btn layui-bg-orange layui-btn-sm" style="position: relative; top: 50%; transform: translateY(-50%);">' +
									'更新</button>' +
									'<button lay-event="delete" type="button" class="layui-btn layui-bg-red layui-btn-sm" style="position: relative; top: 50%; transform: translateY(-50%);">' +
									'删除</button>' +
									'</div>';
								return s;
							}
						}
					]]
				})
			});
			
		</script>
	</body>
</html>
```

![image-20250108032929279](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250108032929279.png)



<Artalk />