import {
    Card,
    // Spin,
    Icon,
    Radio,
    Slider,
    Button
} from 'antd'
import Draggable from 'react-draggable';

import { useEffect,forwardRef, useRef, useState, useReducer, useImperativeHandle } from 'react';
// import '../baozha.less'

const Projection = (props, ref) => {
    const [mode, setMode] = useState(0)
    const [show, setShow] = useState(false)


    const renderModel = [
        {
            name: '透视投影',
            value:  0
        },
        {
            name: '正交投影',
            value: 1
        },
    ]

    function onChange(e){
        window.P3D_CameraSetProjectType(e.target.value)
        setMode(e.target.value)
    }


    useImperativeHandle(ref, () => ({
        toggle: (bl = !show) => {
            setShow(bl)
        }
      }));


    useEffect(()=>{
        return ()=>{window.P3D_CameraSetProjectType(renderModel[0].value)}
    },[])


    if(props.show === false) return null


    // P3D_SetRenderMode
    return (
        // <Draggable handle='.card_title' >
            // <Card  style={{ width: 300 }} size="small">
            //     <div className='card_title'>
            //         <Card.Meta title="投影模式"></Card.Meta>
            //         <Icon type="close" className='close_icon' onClick={()=> {
            //             props.onClose && props.onClose();
            //             setShow(false)
            //             }}/>
            //     </div>

            //     <div style={{ textAlign: 'center', marginBottom: 20 }}>

                   
            //     </div>

            // </Card>
             <Radio.Group buttonStyle="solid" onChange={onChange} defaultValue={mode}  size='small'>
             {renderModel.map(i => <Radio.Button value={i.value}>{i.name}</Radio.Button>)}
         </Radio.Group>

        // </Draggable>
    );
}

export default forwardRef(Projection);
