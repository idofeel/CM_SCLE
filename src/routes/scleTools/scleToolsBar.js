import {
	Drawer,
	Icon,
	message,
	notification,
	Popover,
	Radio,
	Slider,
	Tabs,
	Checkbox,
	Switch,
	Tooltip,
	Card,
	Button,
	Spin
} from 'antd'
import { PureComponent, createRef } from 'react'
import { ChromePicker } from 'react-color'
import {
	fullScreen,
	exitFullscreen,
	IEVersion,
	IsPhone
} from '../../utils/Browser'
import ScleAttrTree from '../scleAttrTree/ScleAttrTree'

import './scleTools.less'
import { scleCustomEvent } from '../../utils'
import { DoubleRightOutlined, DoubleLeftOutlined, SwitcherOutlined } from '@ant-design/icons';

import Draggable from 'react-draggable';

import Baozha from '../components/baozha'
import RenderModel from '../components/renderModel/renderModel'
import Projection from '../components/projection/projection'
import Measure from './measure/measure'




const IconFont = Icon.createFromIconfontCN({
	// scriptUrl: '//at.alicdn.com/t/font_1616415_u6ht57qahg.js'
	scriptUrl: './localiconfont/iconfont.js'
})
const { TabPane } = Tabs

message.config({
	maxCount: 1
})


let p3dtoolkitlib = window.P3D_LIB;
export default class scleTools extends PureComponent {
	#tools = [
		// eslint-disable-next-line no-undef
		{ type: 'home', title: '复位', onClick: () => window.P3D_Home(P3D_HOME_TYPE_ALL) },
		{
			type: 'icon-shituxuanranmoshi',
			title: '渲染模式',
			isFont: true,
			popover: () => <RenderModel show={this.state.activeTab === 'icon-shituxuanranmoshi'} ref={this.renderModelRef} onClose={() => {
				this.setState({ activeTab: null })
			}} />
		},
		{
			type: 'icon-touying',
			title: '投影模式',
			isFont: true,
			popover: () => <Projection show={this.state.activeTab === 'icon-touying'} ref={this.projectionRef} onClose={() => {
				this.setState({ activeTab: null })
			}} />
			// onClick:()=>{
			// 	this.projectionRef.current.toggle()
			// }
		},
		{
			type: 'drag',
			title: '移动零件'
			// onClick: () => this.isPickNull(() => window.moveModel())
		},
		// {
		// 	type: 'font-colors',
		// 	title: '批注',
		// 	popover: () => this.renderAnnotation()
		// },
		// {
		// 	type: 'apartment',
		// 	title: '模型树',
		// 	onClick: () => this.drawerToggle()
		// },
		{ type: 'eye-invisible', title: '隐藏', key: "show" },
		{ type: 'bg-colors', resetTheme: true, title: '颜色', popover: () => this.renderColor() },
		{
			type: 'icon-toumingdu',
			title: '透明度',
			isFont: true,
			key: "toumingdu",
			popover: () => this.renderSlider()
		},
		{
			type: 'icon-background-l',
			// title: "背景色",
			isFont: true,
			popover: () => this.renderBackground()
		},
		{
			type: 'icon-box',
			isFont: true,
			popover: () => this.renderViewDire()
		},
		{
			type: 'icon-shitupouqiehe',
			isFont: true,
			onClick: () => this.handleOpenSectionNotification()
		},
		{
			type: 'icon-goujianbaozha',
			isFont: true,
			onClick: () => this.handleBaozha()
		},
		{
			type: 'icon-a-ziyuan10',
			isFont: true,
			onClick: () => {
				// window.startMeasureMode();
				// this.setState({
				// 	tools: [...this.#measurement]
				// })
			}
		},

		{
			type: 'play-circle',
			title: '播放',
			onClick: () => {
				this.setState({
					tools: [...this.#playerTools]
				})
			}
		},

		{ type: 'fullscreen', title: '全屏', key: "fullscreen", }
	]


	#measurement = [
		{
			type: 'icon-lingjian',
			isFont: true,
			title: '零件测量',
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_OBJECT)
			}
		},
		{
			type: 'icon-qumian',
			title: '曲面测量',
			isFont: true,
			onClick: () => {
				// console.log(window.setMeasureMode);
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_SURFACE)
			}
		},
		{
			type: 'icon-quxian',
			title: '曲线测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_CURVE)
			}
		},
		{
			type: 'icon-min_quxianceliang',
			title: '曲线与曲线测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_TWO_CURVES)
			}
		},
		{
			type: 'icon-zuobiaoceliang',
			title: '点测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_POINT)
			}
		},
		{
			type: 'icon-dianceliang',
			title: '点与点测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureMode(MEASURE_TWO_POINTS)
			}
		},
		{
			type: 'icon-qingchuceliang1',
			title: '取消测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.cancelMeacureMode()
			}
		},
		{
			type: 'icon-yincang',
			title: '隐藏测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureUnitVisible(-2, false)
			}
		},
		{
			type: 'icon-xianshi',
			title: '显示测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.setMeasureUnitVisible(-1, true)
			}
		},
		{
			type: 'icon-shanchuceliang',
			title: '删除测量',
			isFont: true,
			onClick: () => {
				// eslint-disable-next-line
				window.deleteMeasureUnit(-2)
			}
		},
		{
			type: 'poweroff',
			title: '退出测量',
			onClick: () => {
				this.exitMeasurement()
				window.cancelMeacureMode()
			}
		}
	]

	#playerTools = [
		{
			type: 'pause-circle',
			title: '暂停'
		},
		{
			type: 'renderPlayerBar',
			tabComponent: () => this.renderPlayerBar()
		},
		{
			type: 'icon-Stop',
			isFont: true,
			title: '停止',
			onClick: () => this.playerStop()
		}
	]

	state = {
		activeTab: null,
		tools: [...this.#tools],
		background: {
			// 调色板
			r: 255,
			g: 0,
			b: 0,
			a: 1
		},
		playPercent: 0,
		alpha: 1,
		drawerVisible: false,
		showParams: false,
		showSectioning: false,
		axis: null,
		checkedAxis: [],
		switched: false,
		loading: true
	}
	isMove = false
	totalFrames = 0


	baozhaRef = createRef();
	renderModelRef = createRef();
	projectionRef = createRef();

	componentDidMount () {
		window.isPhone = IsPhone()

			// window.addEventListener("fullscreenchange", () =>
			//   this.fullScreenHandle(!!document.fullscreenElement)
			// );
			// // IE
			// window.addEventListener("MSFullscreenChange", () =>
			//   this.fullScreenHandle(document.msFullscreenElement != null)
			// );
			;[
				'fullscreenchange',
				'webkitfullscreenchange',
				'mozfullscreenchange',
				'MSFullscreenChange'
			].forEach((item, index) => {
				window.addEventListener(item, () => {
					this.fullScreenHandle(
						document.fullScreen ||
						document.mozFullScreen ||
						document.webkitIsFullScreen ||
						!!document.msFullscreenElement
					)
				})
			})
		if (window.g_GLData) {
			this.scleStreamReady()
		}
		window.addEventListener(
			'scleStreamReady',
			this.scleStreamReady.bind(this),
			{
				passive: false
			}
		)

		window.addEventListener(
			'pickParams',
			this.pickObjectParameters.bind(this),
			{ passive: false }
		)

		window.addEventListener(
			'resize',
			() => {
				const newTools = this.state.tools.map((i) => {
					i.visible = false
					return i
				})
				this.setState({ activeTab: null, tools: [...newTools] })
			},
			{ passive: false }
		)

		window.addEventListener('stopAnimation', () => {
			// this.playerStop()
			this.setState({
				tools: [...this.#playerTools]
			})
		})

		window.addEventListener("treeNodeSelect", (item) => {
			this.pickObjectParameters()
		}, {});

	}
	componentWillUnmount () {
		window.removeEventListener(
			'scleStreamReady',
			this.scleStreamReady.bind(this),
			{
				passive: false
			}
		)
		window.removeEventListener(
			'pickParams',
			this.pickObjectParameters.bind(this),
			{ passive: false }
		)

		window.removeEventListener("treeNodeSelect", () => {

		}, {});
		this.setState = () => { }
	}
	//   scleStreamReady
	scleStreamReady () {
		// this.totalFrames = window.getTotalFrames()
		this.totalFrames = window.P3D_LIB.P3D_GetAnimFrames()

		window.setAnmiIcon = this.setAnmiIcon

		window.addEventListener('P3D_OnAnimRefreshCallBack', e => {
			this.getCurFrame(e.detail)
		})

		p3dtoolkitlib = window.P3D_LIB;

		// window.getCurFrame = (CurFrame) => this.getCurFrame(CurFrame)
	}

	render () {

		return (
			<>
				<Drawer
					title={null}
					closable={false}
					mask={false}
					maskClosable={false}
					placement="left"
					width="auto"
					visible={this.state.drawerVisible}
					getContainer={false}
					bodyStyle={{ padding: 0 }}
					onClose={() => this.hideDrawer()}
					className="cleTreeDrawer"
					id="cleTreeDrawer"
				>
					<ScleAttrTree
						ref={(el) => (this.sclAttrTree = el)}
						showParams={false}
					></ScleAttrTree>
					<div className={`expand_box ${this.state.drawerVisible ? 'active' : ''}`} onClick={() => this.drawerToggle()}>
						<Icon type="apartment" />
					</div>
				</Drawer>

				<Drawer
					title={null}
					closable={false}
					mask={false}
					maskClosable={false}
					placement="right"
					width="auto"
					visible={this.state.showParams}
					getContainer={false}
					bodyStyle={{ padding: 0 }}
					onClose={() => this.hideDrawer()}
					className="cleTreeDrawer"
					id="cleTreeDrawer"
				>
					<ScleAttrTree
						showParams={true}
					></ScleAttrTree>
					<div className={`expand_box expand_box2 ${this.state.showParams ? 'active' : ''}`} onClick={() => {
						this.setState({
							showParams: !this.state.showParams
						})
					}}>
						<SwitcherOutlined />
					</div>
				</Drawer>

				{/* <div className='fixed_left_tools'>
					<div className={`left_tools_btn ${this.state.drawerVisible && !this.state.showParams ? 'active':''}`} onClick={() => this.handleShowTree()}>
						<Icon type="apartment"/>
					</div>

					<div className={`left_tools_btn ${this.state.drawerVisible && this.state.showParams ? 'active':''}`} onClick={() => this.handleShowParams()}>
						<SwitcherOutlined />
					</div>

				</div> */}
				{
					this.state.showSectioning ?
						<Draggable handle='.pq_card_title' >

							<Card className='pq_card' style={{ width: 300 }} size="small">
								<Spin spinning={this.state.loading}>
									<div className='pq_card_title'>
										<Card.Meta title="选择切割面"></Card.Meta>
										<Icon type="close" className='close_icon' onClick={() => this.handleOpenSectionNotification(false)} />
									</div>
									<div>
										<Checkbox.Group style={{ width: '100%' }} value={this.state.checkedAxis} onChange={e => this.onCheckedChange(e)}>
											<div className="checkbox_item">
												<div>
													<Checkbox value={0} checked={this.state.checkedAxis.includes(0)} onChange={e => this.checkedChange(e)}></Checkbox>
													<span className={this.state.axis === 0 ? 'activeAxis' : ''} onClick={e => {
														e.stopPropagation();
														; this.slectAxis(0)
													}}>沿X轴切割</span>
												</div>

												<IconFont className="checkbox_item_icon" type="icon-jiaohuanshuju" onClick={() => this.P3D_SetClipRevert(0)} />
											</div>
											<div className="checkbox_item">
												<div>
													<Checkbox value={1} checked={this.state.checkedAxis.includes(1)} onChange={e => this.checkedChange(e)}></Checkbox>
													<span className={this.state.axis === 1 ? 'activeAxis' : ''} onClick={e => {
														e.stopPropagation();
														; this.slectAxis(1)
													}}>沿Y轴切割</span>

												</div>
												<IconFont className="checkbox_item_icon" type="icon-jiaohuanshuju" onClick={() => this.P3D_SetClipRevert(1)} />
											</div>
											<div className="checkbox_item">

												<div>
													<Checkbox value={2} checked={this.state.checkedAxis.includes(2)} onChange={e => this.checkedChange(e)}>
													</Checkbox>
													<span className={this.state.axis === 2 ? 'activeAxis' : ''} onClick={e => {
														e.stopPropagation();
														; this.slectAxis(2)
													}}>沿Z轴切割</span>
												</div>

												<IconFont className="checkbox_item_icon" type="icon-jiaohuanshuju" onClick={() => this.P3D_SetClipRevert(2)} />
											</div>
										</Checkbox.Group>
										<div className="checkbox_item">
											切面隐藏
											<Switch checked={this.state.switched} onChange={(e) => this.switchChange(e)} />
										</div>

										<Button block style={{ marginTop: 40 }} onClick={() => this.handleReset()}>全部重置</Button>
									</div>
								</Spin>
							</Card>

						</Draggable>
						: null
				}


				<div className="scleToolsBar">
					{this.state.activeTab === 'icon-a-ziyuan10' ? <Measure onHide={() => {
						this.setState({
							activeTab: null
						})
					}} /> : <Tabs
						activeKey={this.state.activeTab}
						tabPosition="bottom"
						animated={false}
						onChange={(activeTab) => this.setState({ activeTab })}
					>
						{this.renderTools()}
					</Tabs>}





				</div>

				<Baozha show={this.state.activeTab === 'icon-goujianbaozha'} ref={this.baozhaRef} onClose={() => { this.setState({ activeTab: null }) }} />
				{/* <RenderModel show={this.state.activeTab === 'icon-shituxuanranmoshi'}  ref={this.renderModelRef} onClose={()=>{
					this.setState({activeTab:null})
				}}/> */}

				{/* <Projection show={this.state.activeTab === 'icon-touying'}  ref={this.projectionRef} onClose={()=>{
					this.setState({activeTab:null})
				}}/> */}

			</>
		)
	}

	// 选中轴
	slectAxis (currentAxis) {

		if (this.state.axis === currentAxis) return;

		const { checkedAxis } = this.state;

		const isCheck = checkedAxis.includes(currentAxis)

		if (!isCheck) {
			this.onCheckedChange(checkedAxis.concat(currentAxis));

		} else {
			

			this.setState({ axis: currentAxis });
			// 选中当前起切面
			this.setSection(currentAxis, true);

		}

		p3dtoolkitlib.P3D_SetClipVisible(currentAxis, true)
			
		this.setState({switched:false})
		// this.setClipVisible(currentAxis)

	}

	setClipVisible (index) {
		// const axis = [0, 1, 2];
		// // axis.forEach(i=> cmlib.P3D_SetClipVisible(i, false));
		// axis.includes(index) && p3dtoolkitlib.P3D_SetClipVisible(index, bl)

		this.setState({  switched: !p3dtoolkitlib.P3D_GetClipVisible(index) });

	}

	// 复选框选中
	onCheckedChange (e) {
		if (e.length === 0) return;
		let { axis, checkedAxis } = this.state;
		const checkAxis = e.find(i => !checkedAxis.includes(i));
		const prevAxis = checkedAxis[checkedAxis.length - 1];
		// console.log(checkAxis, e);
		if (checkAxis !== undefined) {
			axis = checkAxis;
			// 选中时，清除上一个切面；
			// 选中当前起切面
			this.setSection(axis, true);

		} else {
			const prev = checkedAxis.find(i => !e.includes(i));
			this.setSection(prev, false);

			axis = e[0];
			// // 设置当前剖切
			this.setSection(axis, true);

		}
		// // 新增


		this.setState({
			checkedAxis: e,
			axis,
			switched:false
		})

		p3dtoolkitlib.P3D_SetClipVisible(axis, true)

	}

	checkedChange (e) {
		// 	const {value, checked}= e.target;
		// 	if(!checked && this.state.checkedAxis.length === 1)return;
		// 	this.setSection(value, checked);


	}

	setSection (axis, checked) {

		setTimeout(() => {
			const arr = ['x', 'y', 'z']
			try {

				// console.log(`显示${arr[axis]}剖切`, checked);
				p3dtoolkitlib.P3D_SetClipEnable(axis, checked);

				if (checked) {
					// console.log(`选中${arr[axis]}轴`);
					p3dtoolkitlib.P3D_SelectClip(axis);
				}

			} catch (error) {
				// console.log(error);
			}
		});
	}

	switchChange (e) {
		// console.log(e);

		[0, 1, 2].forEach(i => p3dtoolkitlib.P3D_SetClipVisible(i, !e))

		// p3dtoolkitlib.P3D_SetClipVisible(this.state.axis, !e)

		this.setState({ switched: e })
	}

	P3D_SetClipRevert (index) {
		// cmlib.P3D_SelectClip(index);

		p3dtoolkitlib.P3D_SetClipRevert(index);
	}

	handleReset () {
		this.setState({
			checkedAxis: [0],
			axis: 0,
		})

		this.setClipVisible(0);
		this.setSection(0, true);
		this.setSection(1, false);
		this.setSection(2, false);
	}



	drawerToggle () {
		this.setState({
			drawerVisible: !this.state.drawerVisible,
			// showParams:  false
			// activeTab: !this.state.drawerVisible ? this.state.activeTab : null,
		})
	}


	handleShowTree () {
		const { showParams, drawerVisible } = this.state;
		this.setState({
			drawerVisible: !(drawerVisible && !showParams),
			showParams: false
		})
	}

	handleShowParams () {
		const { showParams, drawerVisible } = this.state;

		this.setState({
			drawerVisible: !(drawerVisible && showParams),
			showParams: true
		})
	}

	hideDrawer () {
		this.setState({
			drawerVisible: false,
			activeTab: null
		})
	}

	renderTools () {
		const { tools } = this.state
		return tools.map((item, index) => (
			<TabPane
				tab={
					item.tabComponent
						? item.tabComponent(item, index)
						: IsPhone()
							? this.renderPopover(item, index)
							: this.renderTipsPopover(item, index)
				}
				key={item.type}
			></TabPane>
		))
	}

	renderAnnotation () {
		return <div className="annotation_icons">
			<Tooltip title={'创建批注'}>
				<Icon
					type={'edit'}
					onClick={() => {
						window.setUsrCommentMode && window.setUsrCommentMode(1, 1)
					}}
				/>
			</Tooltip>
			<Tooltip title={'取消批注'}>
				<Icon
					type={'close-circle'}
					onClick={() => {
						window.setUsrCommentMode && window.setUsrCommentMode(0, 1)
					}}
				/>
			</Tooltip>
			<Tooltip title={'上传批注'}>
				<Icon
					type={'cloud-upload'}
					onClick={() => {
						window.uploadXmlCommentToCloud && window.uploadXmlCommentToCloud()
					}}
				/>
			</Tooltip>
			<Tooltip title={'下载批注'}>
				<Icon
					type={'cloud-download'}
					onClick={() => {
						window.syncXmlCommentFromCloud && window.syncXmlCommentFromCloud()
					}}
				/>
			</Tooltip>

		</div>
	}


	renderTipsPopover (item, index) {
		return (
			<Tooltip title={item.title}>
				{this.renderPopover(item, index)}
			</Tooltip>
		)
	}
	renderPopover (item, index) {
		return item.popover ? (
			<Popover
				content={item.popover()}
				trigger="click"
				visible={item.visible}
				onVisibleChange={(visible) => {
					if (
						this.state.activeTab === 'icon-toumingdu' &&
						IsPhone()
					) {
						return
					}
					this.changeVisible(visible, index)
					if (!visible && item.resetTheme) {
						this.setState({
							activeTab: null
						})
					}
				}}
			>
				{this.renderToolsIcon(item, index)}
			</Popover>
		) : (
			this.renderToolsIcon(item, index)
		)
	}

	renderColor () {
		return (
			<ChromePicker
				onChange={(e) => {
					this.isPickNull(() => {
						const { r, g, b, a } = e.rgb
						this.setState({
							background: e.rgb
						})
						const p3dtoolkitlib = window.P3D_LIB;
						p3dtoolkitlib.P3D_GetSelObjIDs().forEach(id => p3dtoolkitlib.P3D_SetObjColor(id, r / 255, g / 255, b / 255, a))
					})
				}}
				color={this.state.background}
			></ChromePicker>
		)
	}

	renderPlayerBar (item, index) {
		return (
			<Slider
				className="progressSlider"
				min={0}
				max={100}
				value={this.state.playPercent}
				key={index}
				tipFormatter={(e) => e + '%'}
				onChange={(playPercent) => {
					this.setState({ playPercent })
					window.P3D_LIB.P3D_SetAnimCurFrame(this.totalFrames * (playPercent / 100))
				}}
			/>
		)
	}

	// 渲染透明度进度条
	renderSlider () {
		return (
			<div className="transparent">
				<Slider
					defaultValue={1}
					step={0.1}
					min={0}
					max={1}
					value={this.state.alpha}
					onChange={(value) => {
						this.isPickNull(() => {
							this.setState({
								alpha: value
							})
							const objIds = window.P3D_GetSelObjIDs();
							window.P3D_LIB.P3D_SetObjTransparent(objIds, value)
						})
					}}
				/>
			</div>
		)
	}

	// 渲染背景色
	renderBackground () {
		return (
			<Radio.Group
				defaultValue="0"
				buttonStyle="solid"
				onChange={(e) => {
					console.log(e.target.value);
					window.P3D_LIB.P3D_SetBkImage(e.target.value)
				}}
			>
				<Radio.Button value="blue.jpg">淡蓝色</Radio.Button>
				<Radio.Button value="white.jpg">浅白色</Radio.Button>
				<Radio.Button value="grey.jpg">银灰色</Radio.Button>
			</Radio.Group>
		)
	}

	renderViewDire () {
		const bg = { background: 'rgba(24,144,255, 0.6)' }
		const viewDirections = [
			{ title: '正视图', value: 0, forward: bg },
			{ title: '后视图', value: 1, back: bg },
			{ title: '左视图', value: 2, left: bg },
			{ title: '右视图', value: 3, right: bg },
			{ title: '俯视图', value: 4, up: bg },
			{ title: '仰视图', value: 5, down: bg },
			{ title: '等轴侧', value: 6, forward: bg, right: bg }
		]
		return (
			<div className="DivBox">
				{!IEVersion() ? (
					viewDirections.map((item) => (
						<DivBox
							key={item.value}
							{...item}
							onTouchEnd={() => window.P3D_ChangeView(item.value)}
							onClick={() => window.P3D_ChangeView(item.value)}
						/>
					))
				) : (
					<Radio.Group
						defaultValue={0}
						buttonStyle="solid"
						onChange={(item) => {
							window.P3D_ChangeView(item.target.value)
						}}
					>
						{viewDirections.map((item) => (
							<Radio.Button value={item.value} key={item.value}>
								{item.title}
							</Radio.Button>
						))}
					</Radio.Group>
				)}
			</div>
		)
	}

	renderToolsIcon (item, index) {
		return item.isFont ? (
			<IconFont
				type={item.type}
				onClick={() => {
					this.changeVisible(!item.visible, index)
					this.toolsClickHandle(item, index)
				}}
			/>
		) : (
			<Icon
				type={item.type}
				onClick={() => {
					this.changeVisible(!item.visible, index)
					this.toolsClickHandle(item, index)
				}}
			/>
		)
	}

	// player
	playHandle (item, index) {
		const newTools = this.state.tools
		if (item.type === 'play-circle') {
			newTools[index] = {
				type: 'pause-circle',
				title: '暂停'
			}
			const g_bPause = newTools.length === 3;
			if (g_bPause) {
				window.P3D_LIB.P3D_AnimResume();
			} else {
				window.P3D_LIB.P3D_AnimPlay();
			}
			// window.animRun();
		}
		if (item.type === 'pause-circle') {
			newTools[index] = {
				type: 'play-circle',
				title: '播放'
			}
			window.P3D_LIB.P3D_AnimPause();
		}

		this.setState({ tools: newTools })
	}

	// 工具栏 触发事件统一处理
	toolsClickHandle (item, index) {
		// console.log(item);
		const newTools = this.state.tools

		if (item.type === 'eye') {
			this.isPickNull(() => {
				newTools[index].type = 'eye-invisible'
				newTools[index].title = '隐藏'

				const objIds = window.P3D_GetSelObjIDs();
				objIds.forEach(i => window.P3D_SetObjVisible(i, true))

				newTools[index].pickObjectVisible = true
				if (this.sclAttrTree.setVisible) {
					this.sclAttrTree.setVisible(true)
				}
			})
		} else if (item.type === 'eye-invisible') {
			this.isPickNull(() => {
				newTools[index].type = 'eye'
				newTools[index].title = '显示'
				const objIds = window.P3D_GetSelObjIDs();
				objIds.forEach(i => window.P3D_SetObjVisible(i, false))

				newTools[index].pickObjectVisible = false
				if (this.sclAttrTree.setVisible) {
					this.sclAttrTree.setVisible(false)
				}
			})
		}

		if (item.type === 'pause-circle' || item.type === 'play-circle') {
			this.playHandle(item, index)
		}

		if (item.type === 'fullscreen') {
			newTools[index] = { type: 'fullscreen-exit', title: '退出全屏' }
			//   console.log(this);
			//   this.props.onFullScreen(true);
			fullScreen()
			//   window.canvasOnResize();
		}
		if (item.type === 'fullscreen-exit') {
			newTools[index] = { type: 'fullscreen', title: '全屏' }
			//   this.props.onFullScreen(false);
			exitFullscreen()
		}



		// console.log(item, 'icon-shitupouqiehe', this.state.activeTab);
		if (this.state.activeTab === '' && item.type !== 'icon-shitupouqiehe') {
			this.handleOpenSectionNotification(false)
		}

		if (item.type === 'icon-goujianbaozha') {
			let { activeTab } = this.state
			activeTab = activeTab === 'icon-goujianbaozha' ? null : 'icon-goujianbaozha'

			this.setState({
				activeTab
			})
		}



		this.setState(
			{
				tools: [...newTools]
			},
			() => {
				item.onClick && item.onClick()
				if (item.type === 'drag') {
					if (this.state.activeTab && this.isMove) {

						this.setState({
							activeTab: null
						})
						this.moveHandle()
					} else {
						this.isPickNull(() => {
							this.moveHandle()
							if (!IsPhone()) {
								notification.info({
									message: '移动操作',
									description: '使用Ctrl+鼠标左键，移动模型。',
									duration: 3,
								})
							}
						})
					}
				} else {
					if (this.isMove && !item.type.startsWith('eye')) {
						this.moveHandle()
					}
					if (item.type.startsWith('eye') && this.isMove) {
						this.setState({
							activeTab: 'drag'
						})
					}
				}



				// console.log(this.isMove);

			}
		)
	}

	moveHandle () {
		this.isMove = !this.isMove
		window.P3D_SetObjMoveByWindow(this.isMove)
	}

	fullScreenHandle (fullScreen) {
		const icon = fullScreen ? 'fullscreen-exit' : 'fullscreen'
		const newTools = this.state.tools
		const [fullScreenIndex] = this.findToolsIndex(['fullscreen']);
		newTools[fullScreenIndex].type = icon
		this.setState({ tools: [...newTools], activeTab: null })
	}

	pickObjectParameters () {
		const objIds = window.P3D_GetSelObjIDs();
		if (!objIds && objIds.length === 0) return;

		const visible = objIds.length === 1 ? window.P3D_LIB.P3D_GetObjVisible(objIds[0]) : false;

		const [visibleIndex, alphaIndex] = this.findToolsIndex(['show', 'toumingdu']);
		const newTools = this.state.tools


		// 
		const icon = visible ? 'eye-invisible' : 'eye'

		newTools[visibleIndex].type = icon
		newTools[visibleIndex].title = icon === 'eye' ? '显示' : '隐藏'

		// 
		newTools[alphaIndex].visible = false

		this.setState({
			tools: [...newTools],
			alpha: window.pickObjectTransparent || 0
		})
	}

	handleOpenSectionNotification (show) {
		const showSectioning = show !== undefined ? !!show : !this.state.showSectioning
		this.setState({
			showSectioning,
			activeTab: showSectioning ? 'icon-shitupouqiehe' : null,
			loading: !show
		})

		setTimeout(() => {
			try {
				// console.log('showSectioning',showSectioning?'开始剖切':'结束剖切');
				showSectioning ? p3dtoolkitlib.P3D_InitSection() : p3dtoolkitlib.P3D_UnInitSection();
				this.handleReset()
			} catch (error) {
				// error
			} finally {
				// console.log('loadingend');
				this.setState({ loading: false });
			}
		})

	}

	handleBaozha () {

		this.baozhaRef.current.toggle()
		// 开始爆炸
		window.P3D_ExplodeStart()
	}


	findToolsIndex (keys) {
		return keys.map(key => this.#tools.findIndex(i => i.key === key))
	}

	//   停止播放
	playerStop () {
		scleCustomEvent('playerStop')
		window.animTerminal()
		this.setState({
			tools: [...this.#tools]
		})
	}

	// 退出测量
	exitMeasurement () {
		this.setState({
			tools: [...this.#tools]
		})
	}

	changeVisible (visible, index) {
		const newTools = this.state.tools
		newTools[index].visible = visible
		this.setState({
			tools: [...newTools]
		})
	}

	isPickNull = (callback = () => { }) => {
		const objIds = window.P3D_GetSelObjIDs();

		if (!objIds || objIds.length === 0) {
			this.setState({
				activeTab: null
			})
			return message.info('需先选中模型')
		}
		callback()
	}

	// 需要暴露到window的方法
	setAnmiIcon = (isPause) => {
		const newTools = this.state.tools
		const newStatus = isPause
			? {
				type: 'play-circle',
				title: '播放'
			}
			: {
				type: 'pause-circle',
				title: '暂停'
			}

		this.setState({
			tools: newTools.map((item) => {
				if (
					item.type === 'pause-circle' ||
					item.type === 'play-circle'
				) {
					return {
						...item,
						...newStatus
					}
				}
				return item
			})
		})
	}

	getCurFrame (CurFrame) {
		const playPercent = (CurFrame / this.totalFrames) * 100
		// console.log(CurFrame, this.totalFrames);
		this.setState({
			playPercent
		})
	}
}

function DivBox (props) {
	const { up, down, left, right, forward, back } = props

	return (
		<Tooltip title={props.title}>
			<div className="box" {...props}>
				<div className="up" style={up}></div>
				<div className="down" style={down}></div>
				<div className="left" style={left}></div>
				<div className="right" style={right}></div>
				<div className="forward" style={forward}></div>
				<div className="back" style={back}></div>
			</div>
		</Tooltip>
	)
}
