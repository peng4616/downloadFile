# 📦 download.js

一个功能强大且兼容性良好的浏览器文件下载工具函数，支持字符串、Blob、data URL 和远程 URL 的文件下载。

> 无依赖，兼容现代浏览器和 IE10+

---

## ✨ 功能特性

- ✅ 支持字符串直接下载为文件
- ✅ 支持 `Blob` 下载
- ✅ 支持 `data:` base64 URL 下载
- ✅ 支持远程文件 URL 下载（通过 `XHR` 转为 Blob）
- ✅ 自动处理文件名和 MIME 类型
- ✅ 支持 IE10+、Chrome、Firefox、Edge、Safari

---

## 📦 安装方式

你可以直接复制 `download.js` 文件到你的项目中，或作为模块引入：

```js
import { download } from './download.js';

1. 下载文本为 .txt 文件
download('Hello world!', 'example.txt', 'text/plain');

2. 下载 base64 图片
const blob = new Blob(['some text'], { type: 'text/plain' });
download(blob, 'file.txt', 'text/plain');

3. 下载 Blob 文件
const blob = new Blob(['some text'], { type: 'text/plain' });
download(blob, 'file.txt', 'text/plain');


4. 下载远程文件
 download('https://example.com/file.pdf');
// 自动通过 XHR 获取 Blob 并下载

```

⚙️ API 说明

```js
download(data, fileName, mimeType);


```
| 参数         | 类型               | 说明                                     |
| ---------- | ---------------- | -------------------------------------- |
| `data`     | `String \| Blob` | 可下载的内容，可以是字符串、dataURL、Blob、URL         |
| `fileName` | `String`（可选）     | 下载保存的文件名，默认会从 URL 中提取                  |
| `mimeType` | `String`（可选）     | MIME 类型，默认是 `application/octet-stream` |


🌐 浏览器兼容性

| 浏览器     | 支持情况                    |
| ------- | ----------------------- |
| Chrome  | ✅ 支持                    |
| Firefox | ✅ 支持                    |
| Safari  | ✅ 支持（dataURL 下载时采用弹窗提示） |
| Edge    | ✅ 支持                    |
| IE 10+  | ✅ 支持                    |


📝 License
MIT License © 2025

欢迎自由使用与修改！


