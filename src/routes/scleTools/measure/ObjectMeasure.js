import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Drawer, Icon, Slider, Tabs,Tooltip } from "antd";


import {
    P3D_MEASURE_OBJECT_AUTO,
    P3D_MEASURE_OBJECT_VOLUME, 
    P3D_MEASURE_OBJECT_SURFACE_AREA,
    P3D_MEASURE_OBJECT_MASS,
    P3D_MEASURE_OBJECT_MASS_CENTER,
    P3D_MEASURE_OBJECT_BOUNDING_BOX,
 } from './constant'
import PIcon from './PIcon';


const ObjectMeasure = (props) => {

    const setMEasureMode=(name)=> window.P3D_SetMeasureMode(name);

    const tools = [
        {type:'icon-AI_zhineng', title:'智能测量', isFont:true, name: P3D_MEASURE_OBJECT_AUTO, onClick: setMEasureMode},
        {type:'icon-cib-laravel', title:'物件体积', isFont:true,  name: P3D_MEASURE_OBJECT_VOLUME, onClick: setMEasureMode},
        {type:'icon-mianji', title:'物件表面积', isFont:true, name: P3D_MEASURE_OBJECT_SURFACE_AREA, onClick: setMEasureMode},
        {type:'icon-tongshifenxi', title:'物件质量',isFont:true,  name: P3D_MEASURE_OBJECT_MASS, onClick: setMEasureMode},
        {type:'icon-icon-test', title:'物件质心', isFont:true, name: P3D_MEASURE_OBJECT_MASS_CENTER, onClick: setMEasureMode},
        {type:'icon-hezi301', title:'物件包围盒', isFont:true, name: P3D_MEASURE_OBJECT_BOUNDING_BOX, onClick: setMEasureMode},
      
    ]
    return (
        
            tools.map((i,index)=>{
                return <SwiperSlide>
                    <Tooltip title={i.title}>
                        <PIcon type={i.type} isFont={i.isFont} className="prev_icon" onClick={() =>{
                             i.onClick(i.name)
                        }} />
                    </Tooltip>
                </SwiperSlide>
            })

    );
}

export default ObjectMeasure;
