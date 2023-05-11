
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

const RenderModel = (props, ref) => {

    const [renderMode, setRenderMode] = useState(0)
    const [show, setShow] = useState(false)


    const renderModel = [
        {
            name: '着色模式',
            value: 0
        },
        {
            name: '边框模式',
            value: 1
        },
        {
            name: '投影模式',
            value: 2
        },
        {
            name: '半透明模式',
            value: 3
        },
        {
            name: '线框模式',
            value: 4
        },
        {
            name: '钢笔模式',
            value: 5
        }, {
            name: 'x光模式',
            value: 6
        },
    ]

    function onChange (e) {
        window.P3D_SetRenderMode(e.target.value)
        setRenderMode(e.target.value)
    }


    useEffect(() => {
        return () => { window.P3D_SetRenderMode(0) }

    }, [])

    useImperativeHandle(ref, () => ({
        toggle: (bl = !show) => {
            setShow(bl)
        }
    }));


    console.log('render');

    if (props.show === false) return null


    // P3D_SetRenderMode
    return (
        // <Draggable handle='.card_title' >
        // <Card  style={{ width: 600 }} size="small">
        //     <div className='card_title'>
        //         <Card.Meta title="渲染模式"></Card.Meta>
        //         <Icon type="close" className='close_icon' onClick={()=> {
        //             props.onClose && props.onClose()
        //             setShow(false)
        //             }}/>
        //     </div>

        //     <div style={{ textAlign: 'center', marginBottom: 20 }}>


        //     </div>

        // </Card>

        <Radio.Group buttonStyle="solid" onChange={onChange} defaultValue={renderMode} size='small'>
            {renderModel.map(i => <Radio.Button value={i.value}>{i.name}</Radio.Button>)}
        </Radio.Group>

        // </Draggable>
    );
}

export default forwardRef(RenderModel);
