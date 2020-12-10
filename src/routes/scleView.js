import React, { useEffect, useRef, useState } from 'react'
import { message, Progress } from 'antd'
import { queryString, scleCustomEvent } from '../utils'
import ScleToolsBar from './scleTools/scleToolsBar'
import { IsPhone } from '../utils/Browser'

import  './scleControl'
import './scle.less'

const logo = require('../assets/images/downloadAppIcon.png')

function ScleView() {

	const [isFullScreen, setFullscreen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [isHttp] = useState(window.location.origin.startsWith('http'))
	const [percent, setPercent] = useState(0)

	const containerRef = useRef()

	const addScleEvent = () => {
		window.isPhone = IsPhone()
		// containerRef.current.addEventListener('transitionend', function () {
		// 	window.canvasOnResize && window.canvasOnResize()
		// })
		;[
			'fullscreenchange',
			'webkitfullscreenchange',
			'mozfullscreenchange',
			'MSFullscreenChange'
		].forEach((item, index) => {
			window.addEventListener(item, () => {
				const isfull =
					document.fullScreen ||
					document.mozFullScreen ||
					document.webkitIsFullScreen ||
					!!document.msFullscreenElement
				setFullscreen(isfull)
				window.canvasOnResize()
			})
		})
	}

	const openScle = () => {
		const { title, link } = queryString(window.location.href)
		document.title = title || '三维模型'
		if (link) {
			window.g_strResbaseUrl = link.replace(/(.scle|.zip)$/, '/')
			window.Scle.getByRequest(link)
			return
		} else {
			message.warning('请输入正确的链接')
		}
	}

	const onProgress = ({ detail: evt }) => {
		if (evt.lengthComputable) {
			let percentComplete = evt.loaded / evt.total
			window.g_nCleBufferlength = evt.total

			setPercent(Math.floor(percentComplete * 100))

			if (percentComplete === 1) {
				loadingChage(false)
			}
		}
	}

	const loadingChage = (b) => {
		setLoading(b)
		window.canvasOnResize && window.canvasOnResize()
	}

	useEffect(() => {
		window.addEventListener('updateProgress', onProgress)

		scleCustomEvent('scleViewOnReady')

		if (isHttp) openScle()
		window.addEventListener('scleStreamReady', () => {
			loadingChage(false)
			addScleEvent()
		})
	}, [])

	return (
        <div
            className={isFullScreen ? 'fullScreen container' : 'container'}
            ref={containerRef}
        >
            <>
                <canvas id="glcanvas" width="800" height="600"></canvas>
                <canvas id="text" width="800" height="600"></canvas>
            </>
            {loading ? (
                <div className="scle_loading">
                    {isHttp ? (
                        <div className="scle_loadImg">
                            <img src={logo.default} alt="loading" />
                            <Progress
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068'
                                }}
                                percent={percent}
                                status="active"
                            />
                            <p>模型下载中...</p>
                        </div>
                    ) : null}
                </div>
            ) : (
                <ScleToolsBar></ScleToolsBar>
            )}
        </div>
	)
}

export default ScleView