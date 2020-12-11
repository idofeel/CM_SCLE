import {
	Button,
	Drawer,
    message,
	// Tabs,
	// Icon,
	// Popover,
	// Radio,
	// Slider,
	// Tooltip
} from 'antd'
import React, { useReducer, useState } from 'react'
// import { ChromePicker } from 'react-color'

// import {
// 	fullScreen,
// 	exitFullscreen,
// 	IEVersion,
// 	IsPhone
// } from '../../utils/Browser'
// import ScleAttrTree from '../scleAttrTree/ScleAttrTree'

import './scleTools.less'

// const { TabPane } = Tabs

message.config({
	maxCount: 1
})

export default function ScleToolsBar(props) {
	const [visible, setDrawerVisible] = useState(false)

	const [store, dispatch] = useReducer(
		(state, action) => {
			alert('dispatch', action.data)
			return {
				...state,
				...action.data
			}
		},
		{  }
	)

	function setDrawer(vis) {
		setDrawerVisible(!!vis)
	}

	console.log('render')
	return (
		<>
			<Drawer
				title={null}
				closable={false}
				mask={true}
				placement="left"
				width="auto"
				visible={visible}
				getContainer={false}
				bodyStyle={{ padding: 0 }}
				onClose={() => setDrawer()}
				className="cleTreeDrawer"
			>
				{/* <ScleAttrTree></ScleAttrTree> */}
			</Drawer>

			<div className="scleToolsBar" onClick={() => setDrawer(true)}>
				<Button
					onClick={() => dispatch({ data: { name: Math.random() } })}
				>
					{store.name || 123}
				</Button>
			</div>
		</>
	)

	// function renderTools(){
	// 	return tools.map((item, index) => (
	// 		<TabPane
	// 			tab={
	// 				item.tabComponent
	// 					? item.tabComponent(item, index)
	// 					: IsPhone()
	// 					? this.renderPopover(item, index)
	// 					: this.renderTipsPopover(item, index)
	// 			}
	// 			key={item.type}
	// 		></TabPane>
	// 	))
	// }
}
