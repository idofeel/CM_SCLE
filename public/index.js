;(function () {
	var onload = function () {
        
		const keyCodeMap = {
			// 91: true, // command
			61: true,
			107: true, // 数字键盘 +
			109: true, // 数字键盘 -
			173: true, // 火狐 - 号
			187: true, // +
			189: true // -
		}
		// 覆盖ctrl||command + ‘+’/‘-’
		document.onkeydown = function (event) {
			const e = event || window.event
			const ctrlKey = e.ctrlKey || e.metaKey
			if (ctrlKey && keyCodeMap[e.keyCode]) {
				e.preventDefault()
			} else if (e.detail) {
				// Firefox
				event.returnValue = false
			}
		}
		// 覆盖鼠标滑动
		document.body.addEventListener(
			'wheel',
			function (e) {
				if (e.ctrlKey) {
					if (e.deltaY < 0) {
						e.preventDefault()
						return false
					}
					if (e.deltaY > 0) {
						e.preventDefault()
						return false
					}
				}
			},
			{ passive: false }
		)

		// 移动端设备
		const mobile =
			/(iPhone|iPad|iPod|iOS|Android|ipad)/i.test(navigator.userAgent) ||
			(/(Macintosh)/i.test(navigator.userAgent) &&
				'ontouchend' in document)
		if (mobile) {
			// 自定义设置移动端样式
			document.getElementById('scleView').className = 'mobile'
		}

		/**
		 * 事件监听
		 */
		window.addEventListener('scleStreamReady', function () {
			console.log('SCLE 准备就绪')
		})

		document.addEventListener('touchstart', function (event) {
			if (event.touches.length > 1) {
				event.preventDefault()
			}
		})

		var lastTouchEnd = 0
		document.addEventListener(
			'touchend',
			function (event) {
				var now = new Date().getTime()
				if (now - lastTouchEnd <= 300) {
					event.preventDefault()
				}
				lastTouchEnd = now
			},
			false
		)

		document.addEventListener('gesturestart', function (event) {
			event.preventDefault()
		})
	}


	window.addEventListener('load',onload)

	function scleCustomEvent(name, detail) {
		const event = document.createEvent('CustomEvent')
		event.initCustomEvent(name, true, true, detail)
		window.dispatchEvent(event)
	}

	let g_sclehttp = null
	const scle = {
		getByRequest: function (url) {
			g_sclehttp = new XMLHttpRequest()
			g_sclehttp.addEventListener(
				'progress',
				function (evt) {
					// ScleView 进度条
					scleCustomEvent('updateProgress', evt)
				},
				false
			)
			g_sclehttp.addEventListener('load', this.transferComplete, false)
			g_sclehttp.addEventListener('error', this.transferFailed, false)
			g_sclehttp.addEventListener('abort', this.transferCanceled, false)
			g_sclehttp.open('GET', url, true) // true 表示异步，false表示同步
			g_sclehttp.responseType = 'arraybuffer' // XMLHttpRequest Level 2 规范中新加入了 responseType 属性 ，使得发送和接收二进制数据变得更加容易
			const self = this
			g_sclehttp.onreadystatechange = function (e) {
				self.readcleStreamChange(e)
			}
			g_sclehttp.send()
		},
		readcleStreamChange: function (evt) {
			if (g_sclehttp.readyState === 4 && g_sclehttp.status === 200) {
				// 4 = "loaded" // 200 = OK
				this.startLoadFile(g_sclehttp.response)
			}
		},
		starLoadNetCLEFile: function () {
			// 解析cle文件
			var bResult = window.ParseCleStream()
			if (bResult) {
				// alert("An error occurred while transferring the file.");
			}
			window.g_arrayByteBuffer = null
			window.g_arrayCleBuffer = null
			g_sclehttp = null
			// 绘制三维模型
			window.startRender()
			this.loadEnd()
		},
		loadEnd:function () {
			scleCustomEvent('scleStreamReady')
			scleCustomEvent('onScleReady')
			window.setPickObjectParameters = function () {
				scleCustomEvent('pickParams')
			}
		},
		//  加载本地文件
		loadLocalFile: function (e) {
			const sclereader = new FileReader()
			sclereader.readAsArrayBuffer(e.files[0])
			const self = this
			sclereader.onload = function () {
				self.startLoadFile(sclereader.result)
			}
		},
		startLoadFile: function (res) {
			// 使用CM_LIB API
			return CM_LIB.CMInitData(res)
			const self = this
			const new_zip = new window.JSZip()
			new_zip.loadAsync(res).then(function (zip) {
				const key = function () {
					for (let i in zip.files) {
						return i
					}
				}
				zip.files[key()]
					.async('arraybuffer')
					.then(function (arrBuffer) {
						window.g_arrayByteBuffer = arrBuffer
						window.g_arrayCleBuffer = new DataView(
							arrBuffer,
							0,
							arrBuffer.byteLength
						)
						self.starLoadNetCLEFile()
					})
			})
		}
	}

	const Scle = function () {}
	Scle.prototype = scle
	// window.Scle = new Scle()
	window.CMOnlineUI = Object.assign(window.CMOnlineUI, scle)
	console.log(window.CMOnlineUI);
})()
