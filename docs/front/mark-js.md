### 🎨 Mark.js 的使用指南

Mark.js 是一个用于在网页中高亮显示关键词的 JavaScript 库。它可以帮助用户在文本内容中快速定位和突出显示特定的关键词或短语。以下是如何在项目中集成和使用 Mark.js 的详细说明。

官网：[mark.js – JavaScript keyword highlight](https://markjs.io/)

![image-20250215155900029](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250215155900029.png)

---

### 1. **引入 Mark.js 📦**

首先，我们需要在 HTML 文件中引入 Mark.js 库。可以通过 CDN 或下载本地文件的方式引入。

```html
<script src="https://cdn.jsdelivr.net/npm/mark.js/dist/mark.min.js"></script>
```

---

### 2. **初始化 Mark.js ⚙️**

在 JavaScript 代码中，初始化 Mark.js 并配置高亮选项。

```javascript
// 初始化 Mark.js
const markInstance = new Mark(document.getElementById("content"));

// 配置高亮选项
const options = {
    element: "span", // 高亮标签
    className: "highlight", // 高亮样式类名
    separateWordSearch: false, // 是否启用单词匹配
};
```

---

### 3. **高亮关键词 🔍**

使用 Mark.js 的 `mark()` 方法在指定的 DOM 元素中高亮显示关键词。

```javascript
// 高亮关键词
markInstance.mark("关键词", options);
```

- **关键词**：可以是字符串或正则表达式。
- **options**：配置高亮的样式和行为。

---

### 4. **结合项目代码 🛠️**

在项目中，Markdown 内容会被渲染到 `#content` 元素中。可以在 Markdown 内容加载完成后，使用 Mark.js 高亮关键词。

```javascript
fetch('http://imgtu.oss-cn-beijing.aliyuncs.com/md/2025_02_09/14c7bcca85d04b2fa7704b392cce8fd1.md')
  .then(response => response.text())
  .then(markdown => {
    // 将 Markdown 解析为 HTML 并插入到页面
    document.getElementById('content').innerHTML = marked.parse(markdown);

    // 初始化 Mark.js
    const markInstance = new Mark(document.getElementById("content"));

    // 高亮关键词
    markInstance.mark("关键词", {
      element: "span",
      className: "highlight",
      separateWordSearch: false,
    });
  })
  .catch(error => {
    // 错误处理
    document.getElementById('content').innerHTML = '<p>加载文章失败，请稍后再试。</p>';
    console.error('加载 Markdown 文件出错:', error);
  });
```

---

### 5. **自定义高亮样式 🎨**

可以通过 CSS 自定义高亮样式。例如：

```css
.highlight {
  background-color: yellow; /* 背景色 */
  color: black; /* 文字颜色 */
  font-weight: bold; /* 加粗 */
}
```

---

### 6. **注意事项 ⚠️**

- **性能问题**：如果文本内容较大或关键词较多，高亮操作可能会影响页面性能。建议对高亮操作进行优化，例如限制高亮范围或使用防抖（debounce）技术。
- **关键词匹配**：Mark.js 支持单词匹配、正则表达式等多种匹配方式，可以根据需求灵活配置。

---

### 7. **效果展示 🖼️**

![image-20250215155547022](https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20250215155547022.png)



---

### 8. **参考链接 🔗**

- [Mark.js 官方文档](https://markjs.io/)
- [Mark.js GitHub 仓库](https://github.com/julmot/mark.js)

---

### 9. **小贴士 💡**

- 如果你需要高亮多个关键词，可以将关键词放入数组中：
  ```javascript
  markInstance.mark(["关键词1", "关键词2"], options);
  ```
- 使用正则表达式可以更灵活地匹配关键词：
  ```javascript
  markInstance.mark(/关键词\d+/g, options);
  ```

<Artalk />