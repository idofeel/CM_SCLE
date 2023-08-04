import React, { useEffect, useRef, useState,useReducer } from "react";
import { Drawer, Icon, Slider, Tabs, Tooltip } from "antd";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ToolsBar from "./toolsBar";

import ObjectMeasure from './ObjectMeasure'
import AngleMeasure from './AngleMeasure'
import DistanceMeasure from './DistanceMeasure'
import CurveMeasure from './CurveMeasure'
import PIcon from './PIcon';


const P3D_MEASURE_NONE = 0;

function MeasureTools (props) {

    const setMEasureNone = () => window.P3D_SetMeasureMode(P3D_MEASURE_NONE);

    const [visible, setVisible] = useState(false)
    const [allVisible, setAllVisible] = useState(false)
    // const [allVisible, useReducer] = useState(false)

    const tools = [
        { type: 'icon-moxing', title: '物件',isFont: true, name: 'OBJECT', onClick: setMEasureNone },
        { type: 'icon-min_quxianceliang',isFont: true, title: '曲线', name: 'CURVE', onClick: setMEasureNone },
        { type: 'icon-yuansu-jiaodu', title: '角度',isFont: true, name: 'ANGLE', onClick: setMEasureNone },
        { type: 'icon-juli', title: '距离',isFont: true, name: 'DISTANCE', onClick: setMEasureNone },
        {
            type: 'icon-xianshiceliang', isFont: true, title: '隐藏', name: null, onClick: () => {
                window.P3D_SetMeasureUnitVisibe(-2, visible)
                setVisible(!visible)
            }
        },
        {
            type: 'icon-show_line', isFont: true, title: '全部隐藏', name: null, onClick: () => {
                window.P3D_SetMeasureUnitVisibe(-1, allVisible)
                setAllVisible(!allVisible)
                // setTools()
                console.log(allVisible);
            }
        },
        {
            type: 'icon-shanchuceliang', isFont: true, title: '删除', name: null, onClick: () => {
                window.P3D_DeleteMeasureUnit(-2)
            }
        },
        {
            type: 'icon-qingchuceliang1', isFont: true, title: '清空', name: null, onClick: () => {
                window.P3D_DeleteMeasureUnit(-1)
            }
        },

        
    ]



    const [reactiveTools, setTools] = useState(tools)


    useEffect(()=>{
        const showIcons = ['icon-show_line', 'icon-hide_line'];
        const eyeIndex = tools.findIndex(i=> showIcons.includes(i.type));
        tools[eyeIndex].type = allVisible ?showIcons[1] :showIcons[0]
        tools[eyeIndex].title = allVisible ? '全部显示' : '全部隐藏'
        setTools([...tools])
    }, [allVisible])


    // useEffect(()=>{
    //     const showIcons = ['icon--yincangceliang', 'icon-xianshiceliang'];
    //     const eyeIndex = tools.findIndex(i=> showIcons.includes(i.type));
    //     tools[eyeIndex].type = visible ? showIcons[0] : showIcons[1]
    //     tools[eyeIndex].title = visible ? '显示' : '隐藏'
    //     setTools([...tools])
    // }, [visible])


    // 

    return <>
        <ToolsBar onHide={() => { props.onHide(); }}>

            {
                reactiveTools.map((i, index) => {
                    return <SwiperSlide key={index}>
                        <Tooltip title={i.title}>
                            <PIcon type={i.type} isFont={i.isFont}  className="prev_icon" onClick={() => {
                                props.onSelect(i.name)
                                i.onClick()
                            }} />
                        </Tooltip>
                    </SwiperSlide>
                })
            }

        </ToolsBar>

    </>
}

function Measure (props) {
    const [measureName, setMeasureName] = useState(null);

    useEffect(() => {
        window.P3D_InitMeasure()
        return () => {
            window.P3D_UnInitMeasure()
        }
    }, [])

    // 测量菜单工具栏
    if (measureName === null) return <MeasureTools onHide={props.onHide} onSelect={name => setMeasureName(name)} />

    const onHide = () => {
        setMeasureName(null);
        window.P3D_SetMeasureMode(P3D_MEASURE_NONE);
    }
    // 子测量菜单
    return <>
            {measureName === 'OBJECT' ? <ObjectMeasure onHide={onHide}/> : null}
            {measureName === 'ANGLE' ? <AngleMeasure onHide={onHide}/> : null}
            {measureName === 'DISTANCE' ? <DistanceMeasure onHide={onHide}/> : null}
            {measureName === 'CURVE' ? <CurveMeasure onHide={onHide}/> : null}
    </>
}




export default Measure;
