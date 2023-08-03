import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Drawer, Icon, Slider, Tabs, Tooltip } from "antd";


import {
    P3D_MEASURE_OBJECT_AUTO,
    P3D_MEASURE_OBJECT_VOLUME,
    P3D_MEASURE_OBJECT_SURFACE_AREA,
    P3D_MEASURE_OBJECT_MASS,
    P3D_MEASURE_OBJECT_MASS_CENTER,
    P3D_MEASURE_OBJECT_BOUNDING_BOX,
} from './constant'
import PIcon from './PIcon';
import ToolsBar from "./toolsBar";


const ObjectMeasure = (props) => {

    const setMeasureMode = (name) => window.P3D_SetMeasureMode(name);

    const [selectKey, setSelectKey] = useState(P3D_MEASURE_OBJECT_AUTO);
    useEffect(() => {
        setMeasureMode(selectKey)
    }, [selectKey])

    const tools = [
        { type: 'icon-AI_zhineng', title: '智能测量', isFont: true, name: P3D_MEASURE_OBJECT_AUTO, onClick: setMeasureMode },
        { type: 'icon-cib-laravel', title: '物件体积', isFont: true, name: P3D_MEASURE_OBJECT_VOLUME, onClick: setMeasureMode },
        { type: 'icon-mianji', title: '物件表面积', isFont: true, name: P3D_MEASURE_OBJECT_SURFACE_AREA, onClick: setMeasureMode },
        { type: 'icon-tongshifenxi', title: '物件质量', isFont: true, name: P3D_MEASURE_OBJECT_MASS, onClick: setMeasureMode },
        { type: 'icon-icon-test', title: '物件质心', isFont: true, name: P3D_MEASURE_OBJECT_MASS_CENTER, onClick: setMeasureMode },
        { type: 'icon-hezi301', title: '物件包围盒', isFont: true, name: P3D_MEASURE_OBJECT_BOUNDING_BOX, onClick: setMeasureMode },

    ]
    return <ToolsBar onHide={props.onHide}>
        {tools.map((i, index) => {
            return <SwiperSlide>
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

export default ObjectMeasure;
