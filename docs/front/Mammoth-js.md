# 📄 使用 Mammoth.js 渲染 Word 文档为 HTML：详细教程 🚀

在现代 Web 开发中，处理 Word 文档并将其渲染为 HTML 是一个常见的需求。Mammoth.js 是一个强大的 JavaScript 库，能够将 `.docx` 文件转换为 HTML，非常适合在网页中展示文档内容。本文将详细介绍如何使用 Mammoth.js 渲染 Word 文档，并提供一个完整的代码示例。🌟

## 🧰 Mammoth.js 简介

![image-20250219070114594](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250219070114594.png)

Mammoth.js 是一个轻量级的 JavaScript 库，专门用于将 `.docx` 文件转换为 HTML。它的主要特点包括：
- **简单易用**：只需几行代码即可完成转换。
- **保留基本格式**：支持段落、标题、列表、图片等基本格式。
- **高度可定制**：可以通过自定义样式和处理器来扩展功能。

---

## 🛠️ 准备工作

在开始之前，确保你已经准备好以下内容：
1. **一个 `.docx` 文件**：这是你要渲染的 Word 文档。
2. **Mammoth.js 库**：可以通过 CDN 引入，也可以使用 npm 安装。
3. **一个简单的 HTML 页面**：用于展示渲染后的内容。

---

## 🚀 实现步骤

### 1. 引入 Mammoth.js
在 HTML 文件中，通过 CDN 引入 Mammoth.js：
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script>
```

### 2. 创建 HTML 结构
创建一个简单的 HTML 页面，用于展示渲染后的内容：
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新闻详情</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .news-container {
            max-width: 800px;
            margin: 50px auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }

        .news-title {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #222;
            text-align: center;
        }

        .news-meta {
            font-size: 14px;
            color: #777;
            text-align: center;
            margin-bottom: 20px;
        }

        .news-content {
            font-size: 18px;
            line-height: 1.8;
            text-align: justify;
        }

        .news-content img {
            max-width: 100%;  
            height: auto;     
            display: block;   
            margin: 20px 0;   
        }

        .loading {
            text-align: center;
            font-size: 18px;
            color: #555;
        }

        .error {
            color: red;
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="news-container">
        <h1 class="news-title">新闻标题</h1>
        <div class="news-meta">发布时间：2025-02-09 | 作者：未知</div>
        <div id="loading" class="loading">正在加载新闻内容...</div>
        <div id="output" class="news-content"></div>
        <div id="error" class="error" style="display: none;">加载失败，请稍后重试。</div>
    </div>
</body>
</html>
```

### 3. 使用 Mammoth.js 渲染 Word 文档
在 `<script>` 标签中编写 JavaScript 代码，使用 Mammoth.js 将 Word 文档转换为 HTML 并插入到页面中：
```javascript
<script>
    // 从 OSS URL 获取 Word 文档
    fetch('http://imgtu.oss-cn-beijing.aliyuncs.com/docx/2025_02_09/3883643b845b49c38b8e198ccd063721.docx')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            // 使用 Mammoth.js 将 Word 文档转换为 HTML
            mammoth.convertToHtml({ arrayBuffer: buffer })
                .then(function(result) {
                    // 手动处理 HTML 内容，确保外部图片正常显示
                    let htmlContent = result.value;

                    // 正则表达式匹配所有图片标签
                    const imgRegex = /<img[^>]+src="([^">]+)"/g;
                    htmlContent = htmlContent.replace(imgRegex, (match, src) => {
                        // 检查图片 URL 是否为有效的外部 URL
                        if (src.startsWith('http')) {
                            return match; // 如果图片 URL 有效，保持不变
                        }
                        return match; // 如果需要，可以在此处处理无效的图片 URL
                    });

                    // 将 HTML 内容插入到页面中
                    document.getElementById('output').innerHTML = htmlContent;
                })
                .catch(function(err) {
                    console.log("文档转换失败:", err);
                    document.getElementById('error').style.display = 'block';
                });
        })
        .catch(function(error) {
            console.log("文档加载失败:", error);
            document.getElementById('error').style.display = 'block';
        });
</script>
```

---

### 效果展示

![image-20250219070217508](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250219070217508.png)

## 🎯 核心功能解析

### 1. **加载 Word 文档**
使用 `fetch` 从远程 URL 加载 `.docx` 文件，并将其转换为 `ArrayBuffer`。

### 2. **转换 Word 文档为 HTML**
调用 `mammoth.convertToHtml` 方法，将 `ArrayBuffer` 转换为 HTML。

### 3. **处理图片**
通过正则表达式匹配所有 `<img>` 标签，并检查 `src` 是否为有效的外部 URL。如果需要，可以在此处添加自定义逻辑来处理图片。

### 4. **插入 HTML 内容**
将转换后的 HTML 内容插入到页面的 `#output` 元素中。

---

## 🚨 错误处理
- **加载失败**：如果无法加载 Word 文档，显示错误提示。
- **转换失败**：如果 Mammoth.js 转换失败，显示错误提示。

---

## 🌟 总结

通过 Mammoth.js，我们可以轻松地将 Word 文档渲染为 HTML，并在网页中展示。本文提供了一个完整的代码示例，涵盖了从加载文档到渲染内容的全部流程。希望这篇教程能帮助你快速上手 Mammoth.js，并在项目中实现 Word 文档的渲染功能！🎉

---

## 📚 参考链接
- [Mammoth.js 官方文档](https://github.com/mwilliamson/mammoth.js)
- [Fetch API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

如果你有任何问题或建议，欢迎在评论区留言！💬

<Artalk />