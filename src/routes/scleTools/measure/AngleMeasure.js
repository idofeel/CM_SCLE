import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Drawer, Icon, Tooltip, Tabs } from "antd";


import {
    P3D_MEASURE_ANGLE_AUTO,
    P3D_MEASURE_ANGLE_TWO_LINES,
    P3D_MEASURE_ANGLE_TWO_PALNES,
    P3D_MEASURE_ANGLE_LINE_PALNE,
} from './constant'
import PIcon from './PIcon';


const AngleMeasure = () => {
    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);

    const tools = [
        { type: 'icon-AI_zhineng',isFont:true, title: '智能', name: P3D_MEASURE_ANGLE_AUTO, onClick: setMeasureMode },
        { type: 'icon-yuansu-jiaodu',isFont:true, title: '线夹角', name: P3D_MEASURE_ANGLE_TWO_LINES, onClick: setMeasureMode },
        { type: 'icon-yinqing_jiaodu',isFont:true, title: '平面夹角', name: P3D_MEASURE_ANGLE_TWO_PALNES, onClick: setMeasureMode },
        { type: 'icon-jiaodu',isFont:true, title: '线平面夹角', name: P3D_MEASURE_ANGLE_LINE_PALNE, onClick: setMeasureMode },

    ]
    return tools.map((i, index) => {
        return <SwiperSlide key={index}>
            <Tooltip title={i.title}>
                <PIcon type={i.type} isFont={i.isFont} className="prev_icon" onClick={() => {
                    i.onClick(i.name)
                }} />
            </Tooltip>
        </SwiperSlide>
    })
}

export default AngleMeasure;

