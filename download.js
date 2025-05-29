export function download(data, strFileName, strMimeType) {
	var self = window, // 当前作用域指向浏览器 window
		defaultMime = 'application/octet-stream', // 默认 MIME 类型
		mimeType = strMimeType || defaultMime, // 如果未提供 MIME 类型则使用默认值
		payload = data, // 初始数据
		url = payload, // 若传入的是 URL
		anchor = document.createElement('a'), // 创建临时 a 标签用于下载
		toString = function (a) {
			return String(a); // 转换为字符串的函数
		},
		myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString, // 兼容旧浏览器的 Blob
		fileName = strFileName || 'download', // 默认文件名
		blob,
		reader;

	// 绑定 Blob 构造函数到当前上下文
	myBlob = myBlob.call ? myBlob.bind(self) : Blob;

	// 支持参数反向传入：download.bind(true, 'text/plain', 'test.txt')(data)
	if (String(this) === 'true') {
		payload = [payload, mimeType];
		mimeType = payload[0];
		payload = payload[1];
	}

	// 如果传入的是 URL 且长度不长，尝试用 Ajax 下载 Blob
	if (url && url.length < 2048) {
		fileName = url.split('/').pop().split('?')[0]; // 提取文件名
		anchor.href = url;

		var ajax = new XMLHttpRequest();
		ajax.open('GET', url, true);
		ajax.responseType = 'blob';
		ajax.onload = function (e) {
			download(e.target.response, fileName, defaultMime);
		};
		setTimeout(function () {
			ajax.send();
		}, 0);
		return ajax;
	}

	// 如果是 data URL（如 base64）
	if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
		if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
			// 如果数据过大，转为 Blob 对象
			payload = dataUrlToBlob(payload);
			mimeType = payload.type || defaultMime;
		} else {
			// 直接下载 data URL
			return navigator.msSaveBlob
				? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
				: saver(payload);
		}
	}

	// 如果 payload 是字符串或普通对象，包装成 Blob
	blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });

	/**
	 * 将 data URL 转为 Blob 对象
	 */
	function dataUrlToBlob(strUrl) {
		var parts = strUrl.split(/[:;,]/),
			type = parts[1],
			decoder = parts[2] === 'base64' ? atob : decodeURIComponent,
			binData = decoder(parts.pop()),
			mx = binData.length,
			i = 0,
			uiArr = new Uint8Array(mx);

		for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);
		return new myBlob([uiArr], { type: type });
	}

	/**
	 * 主下载逻辑
	 */
	function saver(url, winMode) {
		// 现代浏览器支持 a.download
		if ('download' in anchor) {
			anchor.href = url;
			anchor.setAttribute('download', fileName);
			anchor.style.display = 'none';
			document.body.appendChild(anchor);
			setTimeout(function () {
				anchor.click(); // 模拟点击
				document.body.removeChild(anchor);
				if (winMode === true) {
					// 释放内存
					setTimeout(function () {
						self.URL.revokeObjectURL(anchor.href);
					}, 250);
				}
			}, 66);
			return true;
		}

		// Safari 不支持 download 属性的兼容处理
		if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
			url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			if (!window.open(url)) {
				if (confirm('请使用右键另存为下载该文件，然后返回页面。')) {
					location.href = url;
				}
			}
			return true;
		}

		// 旧版浏览器使用 iframe 下载
		var f = document.createElement('iframe');
		document.body.appendChild(f);

		if (!winMode) {
			url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
		}
		f.src = url;
		setTimeout(function () {
			document.body.removeChild(f);
		}, 333);
	}

	// 兼容 IE10+
	if (navigator.msSaveBlob) {
		return navigator.msSaveBlob(blob, fileName);
	}

	// 现代浏览器：使用 Blob URL
	if (self.URL) {
		saver(self.URL.createObjectURL(blob), true);
	} else {
		// 如果不支持 Blob URL，用 FileReader 读取后下载
		if (typeof blob === 'string' || blob.constructor === toString) {
			try {
				return saver('data:' + mimeType + ';base64,' + self.btoa(blob));
			} catch (e) {
				return saver('data:' + mimeType + ',' + encodeURIComponent(blob));
			}
		}

		// 使用 FileReader 读取 Blob 内容为 data URL
		reader = new FileReader();
		reader.onload = function (e) {
			saver(this.result);
		};
		reader.readAsDataURL(blob);
	}

	return true;
}
