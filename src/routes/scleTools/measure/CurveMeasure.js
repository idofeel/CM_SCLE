import React from 'react';
import {  SwiperSlide } from "swiper/react";
import { Icon, Tooltip } from "antd";




import {
    P3D_MEASURE_CURVE_AUTO,
    P3D_MEASURE_CURVE_LINE, 
    P3D_MEASURE_CURVE_ARC,
 } from './constant'
 import PIcon from './PIcon';


const CurveMeasure = () => {
    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);

    
    const tools = [
        { type: 'icon-AI_zhineng',isFont:true, title: '智能', name: P3D_MEASURE_CURVE_AUTO, onClick: setMeasureMode },
        { type: 'icon-line',isFont:true, title: '直线', name: P3D_MEASURE_CURVE_LINE, onClick: setMeasureMode },
        { type: 'icon-curve1',isFont:true, title: '弧线', name: P3D_MEASURE_CURVE_ARC, onClick: setMeasureMode },

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

export default CurveMeasure;
