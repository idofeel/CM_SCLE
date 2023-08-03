import React, { useEffect, useRef, useState } from "react";
import { Drawer, Icon, Slider, Tabs } from "antd";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide,Grid } from "swiper/react";

import {
    ScleRest,
    ScleMove,
    ScleApartment,
    ScleHide,
    ScleColor,
    ScleOpacity,
    ScleBgColor,
    ScleViewDirection,
    SclePlayer,
    ScleFullscreen,
    ScleStopPlay,
} from "../toolsCompoents/scleToolsBtn";
import './toolsBar.less'


import "swiper/swiper.less";




function ToolsBar (props) {
    const swiperRef = useRef(null);
  const [sliderNum, setSliderNum] = useState(1);

    // const sliderNum = 5;
    useEffect(() => {
        setSliderNum((swiperRef.current.offsetWidth + 10) / 38);
    },[])


    return  <div style={{display:'inline-block'}}>
        <div className="ant-tabs" style={{display:'flex'}}>
            <div className="rollback" >
                <Icon style={{fontSize:'18px'}} type="rollback" onClick={() => props.onHide()} />
            </div>
            {/* <Icon type="left" className="prev_icon" /> */}

            <Swiper
                ref={swiperRef}
                spaceBetween={0}
                loop={false}
                slidesPerView={sliderNum + 0.5}
                navigation={{
                    nextEl: ".next_icon",
                    prevEl: ".prev_icon",
                }}
                onSlideChange={() => { }}
                className="measure_swiper"
            // onSwiper={(swiper) => console.log(swiper)}
            >
               {props.children}
            </Swiper>
            {/* <Icon type="right" className="next_icon" /> */}
        </div>
    </div>

}




export default ToolsBar;
