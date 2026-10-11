---
title: HTML
icon: code
category:
    - 前端基础
tag:
  - HTML
  - 前端基础
star: true
cover: /assets/images/1.jpg
banner: false
date: 2026-10-07
excerpt: 本文介绍 HTML 基础知识，包括文档结构、常用标签、列表、表格及表单等核心语法。
---

## 一、HTML 基础

### 1.1 什么是 HTML？

- **定义**：HTML（HyperText Markup Language）是用于创建网页结构的标记语言，并非编程语言。
- **作用**：通过标签描述网页中的文本、图片、链接、表格等元素，告诉浏览器如何展示内容。
- **版本演进**：从 HTML 1.0 到 HTML5，目前主流标准为 HTML5（2014 年正式发布）。

### 1.2 HTML 文档基本结构

所有 HTML 文档都遵循固定的结构模板，以下是标准格式：

```html
<!DOCTYPE html>  <!-- 1. 声明文档类型为 HTML5 -->
<html lang="zh-CN">  <!-- 2. 根元素，lang 指定页面语言 -->
<head>  <!-- 3. 头部：存放元数据（不直接显示） -->
  <meta charset="UTF-8">  <!-- 设置字符编码（必须），避免乱码 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <!-- 适配移动端 -->
  <title>我的第一个HTML页面</title>  <!-- 页面标题（显示在浏览器标签栏） -->
  <link rel="stylesheet" href="style.css">  <!-- 引入外部CSS文件（可选） -->
</head>
<body>  <!-- 4. 主体：网页可见内容都在这里 -->
  <h1>欢迎学习HTML！</h1>
  <p>这是页面的正文内容。</p>
</body>
</html>
```

**关键说明：**

- `<!DOCTYPE html>` 必须放在第一行，告诉浏览器按 HTML5 标准解析页面。
- `charset="UTF-8"` 是必选项，支持中文、英文等所有字符。
- `viewport` 元标签用于移动端适配，避免页面缩放异常。

### 1.3 常用基础标签

#### 1.3.1 文本标签


| 标签          | 作用                     | 示例代码                    |
|---------------|--------------------------|-----------------------------|
| `<h1>`-`<h6>` | 标题（h1 最大，h6 最小） | `<h2>二级标题</h2>`         |
| `<p>`         | 段落                     | `<p>这是一个段落。</p>`     |
| `<br>`        | 换行（单标签）           | `第一行<br>第二行`          |
| `<hr>`        | 水平线（单标签）         | `<hr>`                      |
| `<strong>`    | 加粗（强调语义）         | `<strong>重要内容</strong>` |
| `<em>`        | 斜体（强调语义）         | `<em>强调内容</em>`         |
| `<del>`       | 删除线                   | `<del>过时内容</del>`       |

#### 1.3.2 链接与图像

**① 超链接 `<a>`**

用于跳转页面或锚点定位，核心属性 `href`（目标地址）：

```html
<!-- 1. 外部链接（新窗口打开） -->
<a href="https://www.baidu.com" target="_blank">访问百度</a>

<!-- 2. 内部链接（同一网站页面） -->
<a href="about.html">关于我们</a>

<!-- 3. 锚点链接（跳转到当前页面指定位置） -->
<a href="#section1">跳转到第一部分</a>
...
<h2 id="section1">第一部分内容</h2>
```

> `target="_blank"`：新窗口打开链接；默认 `_self`（当前窗口）。

**② 图像 `<img>`**

单标签，核心属性：

- `src`：图像路径（本地路径或网络 URL）
- `alt`：图像加载失败时的替代文本（无障碍必需）
- `width`/`height`：图像尺寸（建议用 CSS 控制）

```html
<!-- 本地图像 -->
<img src="images/photo.jpg" alt="风景照片" width="500">

<!-- 网络图像 -->
<img src="https://picsum.photos/200/300" alt="随机图片">
```

## 二、HTML 进阶元素

### 2.1 列表（有序 / 无序 / 定义）

#### 2.1.1 无序列表 `<ul>`

列表项前显示项目符号（默认圆点），用于无顺序的内容：

```html
<ul style="list-style-type: square;">  <!-- square：方块符号 -->
  <li>苹果</li>
  <li>香蕉</li>
  <li>橙子</li>
</ul>
```

> `list-style-type`：修改符号样式（`circle`：圆圈、`none`：隐藏符号）。

#### 2.1.2 有序列表 `<ol>`

列表项前显示数字 / 字母，用于有顺序的内容：

```html
<ol start="3" type="A">  <!-- start：从3开始；type：A=大写字母 -->
  <li>第一步：打开浏览器</li>
  <li>第二步：输入网址</li>
  <li>第三步：点击回车</li>
</ol>
```

#### 2.1.3 定义列表 `<dl>`

用于 "术语 - 解释" 场景，包含 `<dt>`（术语）和 `<dd>`（解释）：

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，用于创建网页结构</dd>

  <dt>CSS</dt>
  <dd>层叠样式表，用于美化网页。</dd>
</dl>
```

### 2.2 表格 `<table>`

用于展示结构化数据（如成绩表、商品列表），核心标签：

- `<table>`：表格容器
- `<tr>`：表格行（table row）
- `<th>`：表头单元格（默认加粗居中）
- `<td>`：普通单元格（table data）

```html
<table border="1" cellpadding="8" cellspacing="0">
  <!-- 表头行 -->
  <tr>
    <th>姓名</th>
    <th>年龄</th>
    <th>性别</th>
  </tr>
  <!-- 数据行 -->
  <tr>
    <td>张三</td>
    <td>20</td>
    <td>男</td>
  </tr>
  <tr>
    <td>李四</td>
    <td>22</td>
    <td>女</td>
  </tr>
</table>
```

> `border`：表格边框宽度；`cellpadding`：单元格内边距；`cellspacing`：单元格间距（建议设为 0）。

**合并单元格**：使用 `colspan`（跨列）或 `rowspan`（跨行）：

```html
<td colspan="2">合并两列</td>  <!-- 跨2列 -->
<td rowspan="3">合并三行</td>  <!-- 跨3行 -->
```

### 2.3 表单 `<form>`

用于收集用户输入（如登录、注册），核心属性 `action`（提交地址）和 `method`（提交方式）。

#### 2.3.1 常见表单控件

| 控件类型       | 标签 / 属性               | 示例代码                                                           |
|----------------|---------------------------|--------------------------------------------------------------------|
| 文本输入框     | `<input type="text">`     | `<input type="text" name="username" placeholder="请输入用户名">`   |
| 密码输入框     | `<input type="password">` | `<input type="password" name="password" placeholder="请输入密码">` |
| 单选按钮       | `<input type="radio">`    | `<input type="radio" name="gender" value="male"> 男`               |
| 复选框         | `<input type="checkbox">` | `<input type="checkbox" name="hobby" value="reading"> 阅读`        |
| 提交按钮       | `<input type="submit">`   | `<input type="submit" value="登录">`                               |
| 重置按钮       | `<input type="reset">`    | `<input type="reset" value="重置">`                                |
| 下拉列表       | `<select>`+`<option>`     | `<select name="city"><option value="bj">北京</option></select>`    |
| 文本域（多行） | `<textarea>`              | `<textarea name="intro" rows="5" cols="30">个人简介</textarea>`    |

#### 2.3.2 完整表单示例

```html
<form action="login.php" method="post">
  <div>
    <label for="username">用户名：</label>
    <input type="text" id="username" name="username" required>
    <!-- required：必填项，浏览器自动验证 -->
  </div>

  <div style="margin: 10px 0;">
    <label for="password">密码：</label>
    <input type="password" id="password" name="password" required>
  </div>

  <div>
    <input type="submit" value="登录">
    <input type="reset" value="重置">
  </div>
</form>
```

> - `label for="id"`：关联输入框，点击标签可聚焦输入框（提升用户体验）。
> - `method="post"`：提交方式（`post`：数据隐藏；`get`：数据显示在 URL 中，适合简单查询）。

## 三、HTML5 新特性

HTML5 是 HTML 的第五个版本，新增了**语义化标签、新表单类型、多媒体支持**等功能，解决了传统 HTML 结构混乱、依赖插件（如 Flash）的问题。

### 3.1 语义化标签

传统 HTML 用大量 `<div>` 划分结构，语义模糊；HTML5 新增以下标签，让结构更清晰：

| 标签        | 作用                      |          适用场景          |
|-------------|---------------------------|:--------------------------:|
| `<header>`  | 页面 / 区块的头部（页眉） |      网站标题、导航栏      |
| `<nav>`     | 导航链接区域              |     主导航、侧边栏导航     |
| `<section>` | 独立的内容区块            |     文章章节、产品列表     |
| `<article>` | 独立的可复用内容          |     博客文章、新闻报道     |
| `<aside>`   | 辅助内容区域（侧边栏）    |     相关推荐、作者信息     |
| `<footer>`  | 页面 / 区块的底部（页脚） |     版权信息、联系方式     |
| `<main>`    | 页面的主要内容（唯一）    | 排除导航、侧边栏等辅助内容 |

#### 3.1.1 语义化页面结构示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>HTML5 语义化页面</title>
</head>
<body>
  <!-- 页眉 -->
  <header>
    <h1>我的博客</h1>
    <!-- 导航 -->
    <nav>
      <ul>
        <li><a href="#">首页</a></li>
        <li><a href="#">文章</a></li>
        <li><a href="#">关于</a></li>
      </ul>
    </nav>
  </header>

  <!-- 主要内容 -->
  <main>
    <!-- 文章区块 -->
    <section>
      <!-- 单篇文章 -->
      <article>
        <h2>HTML5 语义化的优势</h2>
        <p>1. 提升代码可读性，便于团队协作...</p>
        <p>2. 有利于搜索引擎优化（SEO）...</p>
      </article>
    </section>

    <!-- 侧边栏 -->
    <aside>
      <h3>热门文章</h3>
      <ul>
        <li><a href="#">CSS Flex 布局教程</a></li>
        <li><a href="#">JavaScript 基础语法</a></li>
      </ul>
    </aside>
  </main>

  <!-- 页脚 -->
  <footer>
    <p>© 2024 我的博客 版权所有</p>
  </footer>
</body>
</html>
```

### 3.2 新表单类型与属性

HTML5 新增了多种表单类型，减少 JavaScript 验证成本：

| 类型     | 作用                     | 示例代码                                                     |
|----------|--------------------------|--------------------------------------------------------------|
| `email`  | 邮箱输入（自动验证格式） | `<input type="email" name="email">`                          |
| `url`    | 网址输入（自动验证格式） | `<input type="url" name="website">`                          |
| `number` | 数字输入（限制数字范围） | `<input type="number" min="0" max="100" step="5">`           |
| `date`   | 日期选择器（无需插件）   | `<input type="date" name="birthday">`                        |
| `time`   | 时间选择器               | `<input type="time" name="meeting">`                         |
| `search` | 搜索框（自带清除按钮）   | `<input type="search" name="keyword" placeholder="搜索...">` |

#### 3.2.1 新表单属性

- `required`：必填项（浏览器提示 "请填写此字段"）
- `placeholder`：输入框提示文本（聚焦后消失）
- `autofocus`：页面加载后自动聚焦该输入框
- `pattern`：自定义正则表达式验证（如手机号）

```html
<!-- 手机号验证（11位数字） -->
<input type="text" name="phone" pattern="^1[3-9]\d{9}$" placeholder="请输入手机号" required>
```

### 3.3 多媒体标签（无需 Flash）

HTML5 新增 `<audio>`（音频）和 `<video>`（视频）标签，原生支持多媒体播放。

#### 3.3.1 音频 `<audio>`

```html
<audio controls autoplay loop>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  您的浏览器不支持音频播放。
</audio>
```

> - `controls`：显示播放控件（播放 / 暂停 / 音量）
> - `autoplay`：页面加载后自动播放（部分浏览器需用户交互后生效）
> - `loop`：循环播放
> - `<source>`：提供多种格式，确保浏览器兼容性。

#### 3.3.2 视频 `<video>`

```html
<video controls width="600" poster="cover.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放。
</video>
```

> `poster`：视频加载前显示的封面图；`width`：视频宽度（高度自动按比例适配）。

### 3.4 其他 HTML5 特性

#### 3.4.1 本地存储

- `localStorage`：永久存储（除非手动删除）
- `sessionStorage`：会话存储（关闭浏览器后清除）

```js
// 存储数据
localStorage.setItem("username", "张三");

// 获取数据
let name = localStorage.getItem("username");

// 删除数据
localStorage.removeItem("username");
```

#### 3.4.2 Canvas 绘图

`<canvas>` 是一个绘图容器，通过 JavaScript 绘制图形、动画、游戏等：

```html
<canvas id="myCanvas" width="400" height="200" style="border:1px solid #000;" />
```

```js
// 获取 Canvas 上下文
let ctx = document.getElementById("myCanvas").getContext("2d");

// 绘制矩形（x, y, 宽, 高）
ctx.fillStyle = "red";  // 填充颜色
ctx.fillRect(50, 50, 100, 80);
```

## 四、HTML 知识思维导图

```markmap
- HTML
  - 基础
    - 文档结构
      - DOCTYPE 声明
      - html 根元素
      - head 头部
      - body 主体
    - 文本标签
      - 标题 h1-h6
      - 段落 p
      - 换行 br
      - 水平线 hr
      - 加粗 strong
      - 斜体 em
      - 删除线 del
    - 链接 a
      - 外部链接
      - 内部链接
      - 锚点链接
    - 图像 img
  - 进阶元素
    - 列表
      - 无序列表 ul
      - 有序列表 ol
      - 定义列表 dl
    - 表格 table
      - 行 tr
      - 表头 th
      - 单元格 td
      - 合并 colspan / rowspan
    - 表单 form
      - 文本输入 input
      - 密码 input
      - 单选 radio
      - 复选 checkbox
      - 下拉 select
      - 文本域 textarea
  - HTML5 新特性
    - 语义化标签
      - header
      - nav
      - section
      - article
      - aside
      - footer
      - main
    - 新表单类型
      - email
      - url
      - number
      - date
      - time
      - search
    - 多媒体
      - 音频 audio
      - 视频 video
    - 本地存储
      - localStorage
      - sessionStorage
    - Canvas 绘图
```