import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Drawer, Icon, Tooltip, Tabs } from "antd";


import {
    P3D_MEASURE_DISTANCE_AUTO,
    P3D_MEASURE_DISTANCE_TWO_POINTS,
    P3D_MEASURE_DISTANCE_POINT_LINE,
    P3D_MEASURE_DISTANCE_POINT_PLANE,
    P3D_MEASURE_DISTANCE_TWO_LINES,
    P3D_MEASURE_DISTANCE_LINE_PLANE,
    P3D_MEASURE_DISTANCE_TWO_PLANES
} from './constant'
import PIcon from './PIcon';

const DistanceMeasure = () => {
    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);

    const tools = [
        { type: 'icon-AI_zhineng', isFont: true, title: '智能测量', name: P3D_MEASURE_DISTANCE_AUTO, onClick: setMeasureMode },
        { type: 'icon-dianceliang', isFont: true, title: '点到点', name: P3D_MEASURE_DISTANCE_TWO_POINTS, onClick: setMeasureMode },
        { type: 'icon-guangdianceliang', isFont: true, title: '点到线', name: P3D_MEASURE_DISTANCE_POINT_LINE, onClick: setMeasureMode },
        { type: 'icon-jiaoduceliang', isFont: true, title: '点到平面', name: P3D_MEASURE_DISTANCE_POINT_PLANE, onClick: setMeasureMode },
        { type: 'icon-cejua', isFont: true, title: '线到线', name: P3D_MEASURE_DISTANCE_TWO_LINES, onClick: setMeasureMode },
        { type: 'icon-juliceliang', isFont: true, title: '线到平面', name: P3D_MEASURE_DISTANCE_LINE_PLANE, onClick: setMeasureMode },
        { type: 'icon-47gongyegongcheng_celiang', isFont: true, title: '平面到平面', name: P3D_MEASURE_DISTANCE_TWO_PLANES, onClick: setMeasureMode },

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

export default DistanceMeasure;

