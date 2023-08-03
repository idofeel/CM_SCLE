import React, { useEffect, useState } from 'react';
import { SwiperSlide } from "swiper/react";
import { Icon, Tooltip } from "antd";




import {
    P3D_MEASURE_CURVE_AUTO,
    P3D_MEASURE_CURVE_LINE,
    P3D_MEASURE_CURVE_ARC,
} from './constant'
import PIcon from './PIcon';

import ToolsBar from "./toolsBar";


function CurveMeasure (props) {
    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);

    const [selectKey, setSelectKey] = useState(P3D_MEASURE_CURVE_AUTO);
    useEffect(() => {
        setMeasureMode(selectKey)
    }, [selectKey])

    const tools = [
        { type: 'icon-AI_zhineng', isFont: true, title: '智能', name: P3D_MEASURE_CURVE_AUTO, onClick: setMeasureMode },
        { type: 'icon-line', isFont: true, title: '直线', name: P3D_MEASURE_CURVE_LINE, onClick: setMeasureMode },
        { type: 'icon-curve1', isFont: true, title: '弧线', name: P3D_MEASURE_CURVE_ARC, onClick: setMeasureMode },

    ]

    return <ToolsBar onHide={props.onHide}>
        {
            tools.map((i, index) => {
                return <SwiperSlide key={index}>
                    <Tooltip title={i.title}>
                        <PIcon type={i.type} isFont={i.isFont} style={{ color: selectKey === i.name ? '#1890ff' : "#333" }} className="prev_icon" onClick={() => {
                            i.onClick(i.name)
                            setSelectKey(i.name)
                        }} />
                    </Tooltip>
                </SwiperSlide>
            })

        }
    </ToolsBar>
}

export default CurveMeasure;
