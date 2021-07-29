import React, { useEffect, useRef, useState, useReducer } from 'react';
import { message, Popover, Progress, Table, Input, Icon, Tooltip } from 'antd';
import { get, queryString } from '../utils';
import ScleToolsBar from './scleTools/scleToolsBar';
// import ScleTools from './scleTools'
import { IsPhone } from '../utils/Browser';
import scleControl from './scleControl';
import { scleCustomEvent } from '../utils';

import './scle.less';
// .default
const logo = require('../assets/images/downloadAppIcon.png').default;

const API = {};

function ScleView() {
	const [isFullScreen, setFullscreen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isHttp] = useState(window.location.origin.startsWith('http'));
	const [percent, setPercent] = useState(0);
	const obj = useRef({});
	const [notation, setNotation] = useReducer((state, action) => {
		obj.current = Object.assign({}, state, action.payload);
		return {
			...state,
			...action.payload,
		};
	}, {});

	const [showTools, toggleTools] = useState(true);

	const [coordinates, setCoordinates] = useState({
		content: '',
		x: 0,
		y: 0,
	});

	const [input, setInputText] = useState(null);

	const setCoords = (state) => {
		setCoordinates(Object.assign(coordinates, state));
	};

	const [visible, setVisible] = useState(false);
	const downloadMsg = [
		'模型下载中...',
		'模型打开中,请稍等...',
		'模型下载失败',
	];
	const [msgCode, setMsgCode] = useState(0);

	const [posInput, setPosInput] = useState({
		data: [
			// { value: '10', show: true, disabled: true, style: { top: 20, width: 200 } },
			// { value: '20', show: false, style: { top: 40, width: 200 } },
			// { value: '60', show: true, style: { top: 60, width: 200 } },
		],
		show: false, // 是否显示
	});

	// function showInput() {
	//     const option = {
	//         data: [
	//             { value: '10', show: true, disabled: true, style: { top: 20, width: 200 } },
	//             { value: '20', show: false, style: { top: 40, width: 200 } },
	//             { value: '60', show: true, style: { top: 60, width: 200 } },
	//         ],
	//         show: false, // 是否显示
	//     }
	//     Scle.showCommentInput(option)
	// }

	const inputOnChange = (e, item, index) => {
		posInput.data[index].value = e.target.value;
		const nState = { ...posInput };
		setPosInput(nState);
		scleControl.commentOnChange &&
			scleControl.commentOnChange(e, nState, item, index);
	};

	const onSubmit = (e, item, index) => {
		posInput.data[index].disabled = true;
		const nState = { ...posInput };
		setPosInput(nState);
		scleControl.commentOnSubmit &&
			scleControl.commentOnSubmit(e, nState, item, index);
	};

	/**
	 *
	 * @param {Object} posInput {show, value, style}
	 */
	const showInput = (opt = posInput) => {
		setPosInput({
			...posInput,
			...opt,
			style: {
				...posInput.style,
				...opt.style,
			},
		});
	};

	const containerRef = useRef();

	const addScleEvent = () => {
		window.isPhone = IsPhone();
		// containerRef.current.addEventListener('transitionend', function () {
		// 	window.canvasOnResize && window.canvasOnResize()
		// })
		[
			'fullscreenchange',
			'webkitfullscreenchange',
			'mozfullscreenchange',
			'MSFullscreenChange',
		].forEach((item, index) => {
			window.addEventListener(item, () => {
				const isfull =
					document.fullScreen ||
					document.mozFullScreen ||
					document.webkitIsFullScreen ||
					!!document.msFullscreenElement;
				setFullscreen(isfull);
				window.canvasOnResize();
			});
		});
	};

	const addScleAPi = () => {
		// 暴露出去API方法
		scleControl.toggleTools = (bl) => toggleTools(bl);
		// 设置提示信息
		scleControl.setTips = (options) => {
			if (
				!options.objID ||
				options.objID.lenth === 0 ||
				options.objID.filter((i) => i).length === 0
			) {
				setNotation({
					payload: { type :null },
				});
				return;
			}
			setNotation({
				payload: { ...options, type: options.type || null },
			});
			const pos = window.getObjectsCenter(options.objID)[0];
			// 设置提示数据
			let top = pos.y,
				left = pos.x;

			if (options.type === 'table') {
				// 表格形式
				top = 0;
				left = 0;
			} else if (options.type === 'lead') {
				// 引线批注
				top -= 85;
			}
			// 设置批注样式
			setCoords({
				top,
				left,
				content: options.content,
			});
			setVisible(true);
		};
		// 刷新
		scleControl.refreshNotation = (parmas) => {
			if (obj.current.objID) {
				scleControl.setTips({ ...obj.current, ...parmas });
			}
		};
		// 设置是否显示提示信息
		scleControl.setTipsVisible = (bl) => {
			setVisible(bl);
		};

		//  显示批注输入框
		// scleControl.showCommentInput = showInput;
		// // 批注信息输入改变时触发的函数
		// scleControl.commentOnChange = () => { }
		// // 批注信息提交时触发的函数
		// scleControl.commentOnSubmit = () => { }
	};

	const openScle = () => {
		let { title, link, pid, lic } = queryString(window.location.href);
		document.title = title || '三维模型';
		if (pid) {
			return openNetSCle(pid, lic);
		}
		if (link) {
			window.g_strResbaseUrl = link.replace(/(.scle|.zip|.cle)$/, '/');
			window.CMOnlineUI.getByRequest(link);
			return;
		} else {
			message.warning('请输入正确的链接');
		}
	};

	const openNetSCle = async function (pid, lic) {
		let files;
		try {
			files = await get(API.fileInfo.cle, { pid, lic });
		} catch (error) {}

		if (files.success) {
			let { cle } = files.data;
			window.g_strResbaseUrl = cle.replace(/(.cle)$/, '/');
			// // getByRequest(cle.replace(/(.cle)$/, '.scle'))
			// getByRequest('../../src/assets/68b0.scle')
			// canvasOnResize()
			window.CMOnlineUI.getByRequest(cle.replace(/(.cle)$/, '.scle'));
			//
			// window.Scle.getByRequest('../../src/assets/68b0.scle')
		} else {
			message.error(files.faildesc);
		}
	};

	const onProgress = ({ detail: evt }) => {
		if (evt.lengthComputable) {
			let percentComplete = evt.loaded / evt.total;
			window.g_nCleBufferlength = evt.total;

			setPercent(Math.floor(percentComplete * 100));

			if (percentComplete === 1) {
				setMsgCode(1);
				loadingChange(false);
			}
		}

		if (evt.target.status === 404) {
			setMsgCode(2);
		}
	};

	const loadingChange = (b) => {
		setLoading(b);
		window.canvasOnResize && window.canvasOnResize();
	};

	useEffect(() => {
		// const cmcallbacks = new window.CM_CALLBACKS();
		// window.CM_LIB = new window.CMOnlineLib(
		// 	containerRef.current,
		// 	cmcallbacks
		// );
		//
		window.addEventListener('updateProgress', onProgress);
		window.addEventListener('transferFailed', () => setMsgCode(2));
		window.CMOnlineView.default.install(window.Vue);
		new window.Vue({
			el: '#CMOnlineUI_container',
		});
		// 创建内部UI对象
		// var UI_Container = document.createElement('div');
		// UI_Container.id ='CMOnlineUI_container';
		// containerRef.current.appendChild(UI_Container);

		// scleCustomEvent('scleViewOnReady')

		window.CM_LIBReady = false;

		function asyncLoad() {
			const cmcallbacks = new window.CM_CALLBACKS();
			window.CM_LIB = new window.CMOnlineLib(
				containerRef.current,
				cmcallbacks
			);
			window.CM_LIB.CMSetUserCanCommentFlag(1);
			window.CM_LIB.CMSetCommentUsrName('test');
			if (isHttp) openScle();
			addScleAPi();
			window.CM_LIBReady = true;
		}

		window.CM_onload = asyncLoad;

		window.addEventListener('scleStreamReady', () => {
			loadingChange(false);
			addScleEvent();
		});

		window.addEventListener('resize', () => {
			scleControl.refreshNotation();
		});

		window.addEventListener('load', asyncLoad);

		scleCustomEvent('scleViewOnload');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onVisibleChange = () => {
		if (notation.type === 'table') {
			// setNotation({
			// 	type: null
			// })
		} else {
			setVisible(false);
		}
	};

	// 用户设置值
	const confirmValue = () => {
		// setCoords({
		//     ...coordinates,
		//     input: false,
		//     content: coordinates.newContent,
		// })
		setCoords({
			content: input,
		});
		setInputText(null);
	};

	function renderCommentItem(item, index) {
		return (
			<div
				key={index}
				className="annotationInput"
				onDoubleClick={() => {
					posInput.data[index].disabled = false;
					showInput({ ...posInput });
				}}
				style={item.style}
			>
				<Input
					// onDoubleClick={() => showInput({ disabled: !posInput.disabled })}
					disabled={item.disabled}
					value={item.value}
					onChange={(e) => {
						inputOnChange(e, item, index);
					}}
					autoFocus
					addonAfter={
						!item.disabled ? (
							<Icon
								type="check"
								onClick={(e) => onSubmit(e, item, index)}
							/>
						) : null
					}
				/>{' '}
			</div>
		);
	}

	function renderComment(item, index) {
		if (item.show === false) return null;
		if (
			item.disabled === true &&
			(item._strUsrName || item._strCreateTime)
		) {
			return (
				<Tooltip
					key={index}
					title={
						<div>
							<div>作 者：{item._strUsrName}</div>
							<div>创建时间：{item._strCreateTime}</div>
						</div>
					}
				>
					{renderCommentItem(item, index)}
				</Tooltip>
			);
		} else {
			return renderCommentItem(item, index);
		}
	}
	return (
		<div
			className={isFullScreen ? 'fullScreen container' : 'container'}
			ref={containerRef}
		>
			<div id="CMOnlineUI_container">
				<c-m-online-view />
			</div>
			{/* <>
                <canvas id="glcanvas" width="800" height="600"></canvas>
                <canvas id="text" width="800" height="600"></canvas>
            </> */}
			{posInput.show !== false ? posInput.data.map(renderComment) : null}

			{loading ? (
				<div className="scle_loading">
					{isHttp ? (
						<div className="scle_loadImg">
							<img src={logo} alt="loading" />
							<Progress
								strokeColor={{
									'0%': '#108ee9',
									'100%': '#87d068',
								}}
								percent={percent}
								status="active"
							/>
							<p>{downloadMsg[msgCode]}</p>
						</div>
					) : null}
				</div>
			) : (
				showTools && <ScleToolsBar></ScleToolsBar>
				// showTools && <ScleTools></ScleTools>
			)}
			{visible && notation.type !== null && (
				<Popover
					content={
						<div>
							{input === null ? (
								<div
									onDoubleClick={() => {
										// setInputText(coordinates.content)
									}}
								>
									{coordinates.content}
								</div>
							) : (
								<Input
									value={input}
									onChange={(e) =>
										setInputText(e.target.value)
									}
									autoFocus
									addonAfter={
										<Icon
											type="check"
											onClick={confirmValue}
										/>
									}
									defaultValue={coordinates.content}
								/>
							)}
						</div>
					}
					title={null}
					placement="top"
					trigger="click"
					visible={true}
					overlayClassName={`scleViewPopver ${
						notation.type === 'lead' ? 'hideArrow' : ''
					}`}
					onVisibleChange={onVisibleChange}
				>
					<div
						className={`gltext ${
							notation.type === 'lead' ? 'gltext2' : ''
						}`}
						style={{
							top: coordinates.top,
							left: coordinates.left,
						}}
					></div>
				</Popover>
			)}

			{notation.type === 'table' && (
				<div className="gltext" style={notation.tableStyle}>
					<Table {...notation} rowKey="index" />
				</div>
			)}

			{/* getobjectscenter */}
		</div>
	);
}

export default ScleView;
