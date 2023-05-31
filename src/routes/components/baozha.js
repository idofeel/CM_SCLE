

import {
    Card,
    // Spin,
    Icon,
    Radio,
    Slider,
    Button
} from 'antd'
import Draggable from 'react-draggable';

import { useEffect, useRef, forwardRef, useState, useImperativeHandle, useReducer } from 'react';

import './baozha.less'


function Baozha (props, ref) {
    const [expMode, setExpMode] = useState(3)
    const [progress, setProgress] = useState(0)
    const [show, setVisible] = useState(false)


    const expModes = [
        {
            name: '自由爆炸',
            value: 3
        },
        {
            name: '沿X轴爆炸',
            value: 0
        },
        {
            name: '沿Y轴爆炸',
            value: 1
        },
        {
            name: '沿Z轴爆炸',
            value: 2
        },
    ]

    function onChange (e) {

        setExpMode(e.target.value)
        setProgress(0)
        window.P3D_ExplodeStart(null, e.target.value, 4, 100);
    }

    function setShow(bl){
        setVisible(bl)
        if(!bl)reset()
    }


    function handleSliderChange (value) {
        setProgress(value)
        window.P3D_ExplodeUpdate(value);

    }


    useEffect(() => {
        console.log('创建');

        if(props.show){
            window.P3D_ExplodeStart(null, expMode, 4, 100);

        }

        // return () => {
        //     console.log('销毁');
        //     window.P3D_ExplodeFinish();
        // }
    }, [props.show])

    function reset(){
        setProgress(0)
        window.P3D_ExplodeFinish();
    }

    useImperativeHandle(ref, () => ({
        toggle: (bl = !show) => {
            setShow(bl)
        }
      }));
      
      console.log(props);
    if(props.show === false) return null

    return <Draggable handle='.card_title' >
        <Card className='exp_card' style={{ width: 260 }} size="small">
            <div className='card_title'>
                <Card.Meta title="爆炸视图"></Card.Meta>
                <Icon type="close" className='close_icon' onClick={()=> {
                    props.onClose && props.onClose()
                    setShow(false)
                }}/>
            </div>
            <div className='boom_radios'>
                <Radio.Group onChange={onChange} defaultValue={expMode} buttonStyle="solid" >
                    {expModes.map(i => <Radio value={i.value}>{i.name}</Radio>)}
                </Radio.Group>
                </div>

            <div className='silder_bar'>
                <Slider className='silder' tooltipVisible={false} value={progress} min={0} max={100} step={1} onChange={handleSliderChange} />
                <Button
                    type="primary"
                    onClick={reset}
                    ghost> 重置  </Button>
            </div>
           
        </Card>

    </Draggable>
}


export default forwardRef(Baozha)