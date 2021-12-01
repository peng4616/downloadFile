export function download(data, strFileName, strMimeType) {
	var self = window, //这个脚本只适用于浏览器
		defaultMime = 'application/octet-stream', // 这个默认mime也会触发iframe下载
		mimeType = strMimeType || defaultMime,
		payload = data,
		url = payload,
		anchor = document.createElement('a'),
		toString = function (a) {
			return String(a);
		},
		myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
		fileName = strFileName || 'download',
		blob,
		reader;
	myBlob = myBlob.call ? myBlob.bind(self) : Blob;

	if (String(this) === 'true') {
		//反向参数，允许下载。绑定(true， "text/xml"， "export.xml")作为回调
		payload = [payload, mimeType];
		mimeType = payload[0];
		payload = payload[1];
	}

	if (url && url.length < 2048) {
		// 如果没有文件名和mime，假设url作为唯一的参数被传递
		fileName = url.split('/').pop().split('?')[0];
		anchor.href = url; // 将href prop赋给临时锚
		debugger;

		// if (anchor.href.indexOf(escapeUrl) !== -1) {
		// 如果浏览器认为它是一个潜在有效的url路径:
		// debugger;
		var ajax = new XMLHttpRequest();
		ajax.open('GET', url, true);
		ajax.responseType = 'blob';
		ajax.onload = function (e) {
			download(e.target.response, fileName, defaultMime);
		};
		setTimeout(function () {
			ajax.send();
		}, 0); // 允许使用return设置自定义ajax头:

		return ajax;
		// } // 结束，如果有效的url?
	} //如果url结束?

	//马上去下载dataURLs

	if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
		if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
			payload = dataUrlToBlob(payload);
			mimeType = payload.type || defaultMime;
		} else {
			return navigator.msSaveBlob // IE10不能做[下载]，只有Blobs:
				? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
				: saver(payload); //其他所有人都可以保存未处理的数据
		}
	} //结束如果dataURL通过?

	blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });
	function dataUrlToBlob(strUrl) {
		var parts = strUrl.split(/[:;,]/),
			type = parts[1],
			decoder = parts[2] == 'base64' ? atob : decodeURIComponent,
			binData = decoder(parts.pop()),
			mx = binData.length,
			i = 0,
			uiArr = new Uint8Array(mx);

		for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

		return new myBlob([uiArr], { type: type });
	}

	function saver(url, winMode) {
		if ('download' in anchor) {
			//html5 A(下载)

			anchor.href = url;
			anchor.setAttribute('download', fileName);
			anchor.className = 'download-js-link';
			anchor.innerHTML = 'downloading...';
			anchor.style.display = 'none';
			document.body.appendChild(anchor);
			setTimeout(function () {
				anchor.click();
				document.body.removeChild(anchor);
				if (winMode === true) {
					setTimeout(function () {
						self.URL.revokeObjectURL(anchor.href);
					}, 250);
				}
			}, 66);
			return true;
		}

		// 处理非[下载]safari，我们可以:

		if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
			url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			if (!window.open(url)) {
				// 弹出阻止，提供直接下载:

				if (confirm('Displaying New Document\n\nUse Save As... to download, then click back to return to this page.')) {
					location.href = url;
				}
			}
			return true;
		}

		//做iframe dataURL下载(旧的ch+FF):

		var f = document.createElement('iframe');
		document.body.appendChild(f);

		if (!winMode) {
			// 强制一个mime将下载:

			url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
		}
		f.src = url;
		setTimeout(function () {
			document.body.removeChild(f);
		}, 333);
	} //end saver

	if (navigator.msSaveBlob) {
		//IE10+:(有Blob，但没有[下载]或URL)

		return navigator.msSaveBlob(blob, fileName);
	}

	if (self.URL) {
		// 简单快速和现代的方式使用Blob和URL:

		saver(self.URL.createObjectURL(blob), true);
	} else {
		//处理non-Blob () + non-URL浏览器:

		if (typeof blob === 'string' || blob.constructor === toString) {
			try {
				return saver('data:' + mimeType + ';base64,' + self.btoa(blob));
			} catch (y) {
				return saver('data:' + mimeType + ',' + encodeURIComponent(blob));
			}
		}

		// Blob但不支持URL:

		reader = new FileReader();
		reader.onload = function (e) {
			saver(this.result);
		};
		reader.readAsDataURL(blob);
	}
	return true;
} /*结束下载()*/
