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

```
