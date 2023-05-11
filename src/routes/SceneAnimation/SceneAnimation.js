

import React, { useEffect, useReducer } from "react";

import { Tree, Icon } from 'antd';
import './SceneAnimation.less';



const { TreeNode } = Tree;




export default function SceneAnimation () {

    let data = []

    window.P3D_GetAllSceneAnimNodeData(data);

// console.log(data);
    const animaNodeData = useReducer((state, action) => {
        return
    }, data)

    // P3D_PlaySceneAnimRange
    // 
    useEffect(() => { }, []);


    if(data.length === 0) return <div style={{textAlign:'center'}}>该模型没有场景事件</div>

    return <Tree
        className="scene"
        showIcon
        defaultExpandAll
        defaultSelectedKeys={['0-0-0']}
        switcherIcon={<Icon type="down"  /> }
        onSelect={(keys, e)=>{
            const i = e.node.props.item;
            window.P3D_PlaySceneAnimRange(i._uStart, i._uEnd)
        }}
    >
          <TreeNode icon={<Icon type="play-circle" />} title={'场景事件'} key={'root'}>
            {  RenderNode(data) }
        </TreeNode>
       

    </Tree>
}


function RenderNode(data) {

   
   return  data.map((i) => {
        if(i._arrSubNode && i._arrSubNode.length){
            return <TreeNode icon={<Icon type="play-circle" />} title={i._strName} key={i._uTimeNodeID} item={i} >{RenderNode(i._arrSubNode)} </TreeNode>
        }
        return <TreeNode icon={<Icon type="play-circle" />} title={i._strName} key={i._uTimeNodeID} item={i}> </TreeNode>
    })

}
