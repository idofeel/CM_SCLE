import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Drawer, Icon, Tooltip, Tabs } from "antd";


import {
    P3D_MEASURE_ANGLE_AUTO,
    P3D_MEASURE_ANGLE_TWO_LINES,
    P3D_MEASURE_ANGLE_TWO_PALNES,
    P3D_MEASURE_ANGLE_LINE_PALNE,
} from './constant'
import PIcon from './PIcon';
import ToolsBar from "./toolsBar";


const AngleMeasure = (props) => {
    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);
    const [selectKey, setSelectKey] = useState(P3D_MEASURE_ANGLE_AUTO);
    useEffect(() => {
        setMeasureMode(selectKey)
    }, [selectKey])

    const tools = [
        { type: 'icon-AI_zhineng',isFont:true, title: '智能', name: P3D_MEASURE_ANGLE_AUTO, onClick: setMeasureMode },
        { type: 'icon-yuansu-jiaodu',isFont:true, title: '线夹角', name: P3D_MEASURE_ANGLE_TWO_LINES, onClick: setMeasureMode },
        { type: 'icon-yinqing_jiaodu',isFont:true, title: '平面夹角', name: P3D_MEASURE_ANGLE_TWO_PALNES, onClick: setMeasureMode },
        { type: 'icon-jiaodu',isFont:true, title: '线平面夹角', name: P3D_MEASURE_ANGLE_LINE_PALNE, onClick: setMeasureMode },

    ]
    return <ToolsBar onHide={props.onHide}>{tools.map((i, index) => {
        return <SwiperSlide key={index}>
            <Tooltip title={i.title}>
                <PIcon type={i.type} isFont={i.isFont} style={{color:selectKey===i.name? '#1890ff':"#333"}} className="prev_icon" onClick={() => {
                    i.onClick(i.name)
                    setSelectKey(i.name)
                }} />
            </Tooltip>
        </SwiperSlide>
    })}
    </ToolsBar>
}

export default AngleMeasure;

