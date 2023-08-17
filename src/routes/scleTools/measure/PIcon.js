import {  Icon } from "antd";

const IconFont = Icon.createFromIconfontCN({
	// scriptUrl: '//at.alicdn.com/t/c/font_1616415_52shxlt2e7n.js'
	scriptUrl: './localiconfont/iconfont.js'
})



export default function PIcon (props) {
    console.log(props);
    return props.isFont ? <IconFont style={{fontSize:'18px'}} {...props} /> : <Icon style={{fontSize:'18px'}} {...props} />
}


