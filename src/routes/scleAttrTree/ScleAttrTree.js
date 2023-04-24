import { PureComponent } from "react";
import { Table, Tabs, Tree } from "antd";
import "./scleAttrTree.less";
import { IsPhone } from "../../utils/Browser";
import { DoubleRightOutlined } from '@ant-design/icons';
import { scleCustomEvent } from '../../utils';


const { TabPane } = Tabs;
const { TreeNode } = Tree;

const columns = [
  {
    title: "参数名",
    dataIndex: "name",
  },
  {
    title: "参数值",
    dataIndex: "value",
  },
];
export default class ScleAttrTree extends PureComponent {
  keys = []; //显示的的keys
  tempMutilpSelect = []; // 临时多选
  tempMutilpPMI = []; // 临时多选
  nodeIds = { // { objId : 模型树ID}

  }
  state = {
    treeData: {
      child: [],
    },
    paramsData: [], // 模型参数
    treeNodeCheckedKeys: [], // 显示隐藏复选框
    treeNodeSelectKeys: [], // 选中的key
    expandedKeys: [], //展开的key
    PMITreeData: [],
    PMINodeCheckedKeys:[],
    PMISelectKeys:[],
    PMIExpandedKeys:[],
    hideAnoot:false,
    show: false
  };

  render() {
    const cmlib = window.P3D_LIB;
    const {
      treeData,
      treeNodeCheckedKeys,
      treeNodeSelectKeys,
      expandedKeys,
      paramsData,
      PMITreeData,
    } = this.state;
    return (
      // <Tabs
      //   defaultActiveKey="1"
      //   className="scleAttrTree"
      //   renderTabBar={this.renderTabBar}
      // >
      //   <TabPane tab="模型树" key="1">
      //     <Tree
      //       checkable
      //       checkStrictly
      //       checkedKeys={treeNodeCheckedKeys}
      //       selectedKeys={treeNodeSelectKeys}
      //       expandedKeys={expandedKeys}
      //       onClick={(e) => {
      //         return false;
      //       }}
      //       onExpand={(e) => {
      //         this.hideSelect = true;
      //         this.setState({
      //           expandedKeys: e,
      //         });
      //       }}
      //       onCheck={(treeNodeCheckedKeys, e) => {
      //         this.setState({
      //           treeNodeCheckedKeys,
      //         });
      //         window.setModelVisible(
      //           this.findleafIndexs(e.node.props.dataRef),
      //           e.checked
      //         );
      //          // 模型树隐藏时 dofeel
      //         const ms = this.state.treeNodeSelectKeys;
      //         if (ms * 1 === e.node.props.dataRef.key) {
      //           window.pickObjectVisible = e.checked;
      //           window.setPickObjectParameters();
      //         }
      //       //

      //       }}
      //     >
      //       {this.renderTreeNodes(treeData)}
      //     </Tree>
      //   </TabPane>
      //   <TabPane tab="参数" key="2">
      //     <Table
      //       className="attrTable"
      //       columns={columns}
      //       dataSource={paramsData}
      //       locale={{ emptyText: "无数据" }}
      //       size="middle"
      //     />
      //   </TabPane>
      // </Tabs>

      <>
        {!this.props.showParams ? (
          <div ref={el => this.modelTree = el} className={`tree_box attr_tree ${this.state.show?'':''}`}>
            <div>
              <h4 className="title">模型树</h4>
              <Tree
                checkable
                checkedKeys={treeNodeCheckedKeys}
                selectedKeys={treeNodeSelectKeys}
                expandedKeys={expandedKeys}
                className={'reeeee'}
                onClick={(e) => {
                  return false;
                }}
                onExpand={(e) => {
                  this.hideSelect = true;
                  this.setState({
                    expandedKeys: e,
                  });
                }}
                onCheck={(treeNodeCheckedKeys, e) => {
                  // console.log(treeNodeCheckedKeys, e);
                  this.setState({
                    treeNodeCheckedKeys,
                  });
                const objIds = this.findleafIndexs(e.node.props.dataRef)

                cmlib.P3D_SetSelStatusByObjIDs(objIds);

                  cmlib.P3D_SetObjVisible(
                    objIds,
                    e.checked
                  );

                  // 模型树隐藏时 dofeel
                  const ms = this.state.treeNodeSelectKeys;
                  if (ms * 1 === e.node.props.dataRef.key) {
                    window.pickObjectVisible = e.checked;
                    window.setPickObjectParameters();
                  }
                  //
                }}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
            <div className={`anoot ${this.state.hideAnoot? 'hideAnootbox': ''}`}>
              <h4 className="title"> 标注<DoubleRightOutlined className={`down ${this.state.hideAnoot? 'hideAnoot': ''}`} onClick={e=>{
                this.setState({
                  hideAnoot: !this.state.hideAnoot
                })
              }}/>
              
              </h4>
              <Tree checkable 
                checkedKeys={this.state.PMINodeCheckedKeys}
                selectedKeys={this.state.PMISelectKeys}
                expandedKeys={this.state.PMIExpandedKeys}
                className={'pmi_tree'}
                onClick={(e) => {
                  return false;
                }}
                onExpand={(e) => {
                  // console.log(e);
                  this.setState({
                    PMIExpandedKeys: e,
                  });
                }}
                onCheck={(treeNodeCheckedKeys, e) => {
                const item = e.node.props.dataRef;

                let {PMINodeCheckedKeys} = this.state;
                // console.log('onCheck',treeNodeCheckedKeys, e,item);

                if(e.checked){
                  PMINodeCheckedKeys = Array.from(new Set(treeNodeCheckedKeys.concat(this.state.PMINodeCheckedKeys)))
                }else{
                  const cids = [item.key]; 
                  if(item.type === "view") cids.push(...item.child.map(i=>i.key));
                  if(item.type === "annot") cids.push(item.parentPmiId);
                  // 
                  PMINodeCheckedKeys = PMINodeCheckedKeys.filter(i=> !cids.includes(i))
                }

                this.setState({
                  PMINodeCheckedKeys
                })




                if(item.type ==='view'){
                  // let arrViewId = cmlib.P3D_GetAnnotViewIDByTreeID(item.pmiId);
                  // console.log(`设置${item.pmiId}视图是否显示,${e.checked}`);
                  cmlib.P3D_SetAnnotVisibleInView([item.pmiId], e.checked)
                }else{
                  // console.log(`设置${item.pmiId}批注是否显示,${e.checked}`);
                  cmlib.P3D_SetAnnotVisible([item.pmiId], e.checked)
                }


                }} 
               >
                {this.renderPMITree(PMITreeData)}
              </Tree>
            </div>
          </div>
        ) : (
          <div ref={el => this.paramsTree = el}  className={`tree_box ${this.state.show?'':''}`}>
            <h4 className="title">参数</h4>
            <Table
              className="attrTable"
              columns={columns}
              dataSource={paramsData}
              locale={{ emptyText: "无数据" }}
              size="middle"
            />
          </div>
        )}
      </>
    );
  }

  renderTabBar(DefaultTabBarProps, DefaultTabBar) {
    return <DefaultTabBar {...DefaultTabBarProps} />;
  }

  renderTreeNodes(treeData) {
    if (!treeData.length) return null;
    return treeData.map((item) => {
      if (item.child) {
        return (
          <TreeNode
            checkable={true}
            title={this.renderTitle(item)}
            key={item.key}
            dataRef={item}
          >
            {this.renderTreeNodes(item.child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          checkable={true}
          key={item.key}
          title={item.title}
          {...item}
          dataRef={item}
        />
      );
    });
  }

  toggle(){
    const show = !this.state.show
    this.setState({ show })
    return show
  }


  findAllKeys(item, keys = []){
    keys.push(item.key);
    if(item.child && item.child.length) item.child.forEach((i)=>this.findAllKeys(i, keys))
    return keys
  }

  renderTitle(item) {
    const cmlib = window.P3D_LIB;
    const key = item.key;
    const isChecked = this.state.treeNodeSelectKeys.indexOf(key) > -1

    return (
      <span
      id={`tree${key}`}
        className={
          isChecked ? "tree_selected" : ""
        }
        onClick={() => {
          // 选择模型名称时 dofeel
          if (this.keyCode) return;
          this.hideSelect = true;
          // isChecked
        console.log(item);

          this.tempMutilpSelect = this.findleafIndexs(item);
          this.setState({
            treeNodeSelectKeys: this.findAllKeys(item),
            paramsData: item.params,
          });

          // const objIds = this.findleafIndexs(item)


          cmlib.P3D_SetSelStatusByObjIDs(this.tempMutilpSelect);

          scleCustomEvent('updateParams', item.params);
          if(item.objId !== -1){
            scleCustomEvent('treeNodeSelect', {
              ...item,
              visible: isChecked
            });
          }
         
          this.handleInitPMI(true)

          this.SetTreeNodePmiView(item.nodeid);

          // window.setPickObjectParameters();

          // this.pickObjectParameters(objIds, item.nodeid)
          // window.pickModelByIndex(this.tempMutilpSelect, IsPhone());
        }}
        onMouseDown={() => {
          if (this.keyCode === 17) {
            let { treeNodeSelectKeys } = this.state;

            const leafKeys = this.findleafIndexs(item);

            if (treeNodeSelectKeys.indexOf(key) > -1) {
              const keys =  this.findAllKeys(item)
              // // 已选择，取消选择
              treeNodeSelectKeys = treeNodeSelectKeys.filter(
                (item) => !keys.includes(item)
              );
              // 临时多选
              this.tempMutilpSelect = this.tempMutilpSelect.filter(
                (item) => leafKeys.indexOf(item) === -1
              );
            } else {
              treeNodeSelectKeys.push(...this.findAllKeys(item));
              this.tempMutilpSelect = Array.from(new Set(this.tempMutilpSelect.concat(leafKeys)));
            }

            this.hideSelect = true;
            this.setState({
              treeNodeSelectKeys:Array.from(new Set(treeNodeSelectKeys)),
              paramsData: [],
            });
            cmlib.P3D_SetSelStatusByObjIDs(this.tempMutilpSelect);
            console.log(this.state.treeNodeSelectKeys.length);


            const isSigle = this.state.treeNodeSelectKeys.length === 1;
            this.handleInitPMI(isSigle)

            if(isSigle){
              scleCustomEvent('updateParams', item.params);
            }
            this.SetTreeNodePmiView(isSigle?item.nodeid:null);


         


            // window.pickModelByIndex(this.tempMutilpSelect, IsPhone());
            // 多选 dofeel
            // window.setPickObjectParameters();
          }
        }}
      >
        {item.title}
      </span>
    );
  }

  //   scleStreamReady
  loadTree() {
     this.keys = []; //显示的的keys
     this.tempMutilpSelect = []; // 临时多选

    const treeData = [this.getTreeNodeData(window.g_GLData.GLModelTreeNode)];

    const { expandedKeys } = this.getExpandedAndSelctKeys(treeData, [-1]);

    this.setState({
      treeData,
      expandedKeys,
      treeNodeCheckedKeys: this.keys,
      treeNodeSelectKeys:[],
      paramsData:[],
      PMITreeData: [],
      PMINodeCheckedKeys:[],
      PMISelectKeys:[],
    });

    this.keys= null;
  }

  setVisible(visible) {

    const objIds = window.P3D_GetSelObjIDs()
    
    const pickTreeNodeIds = objIds.map(i=> String(this.getTreeNodeIdByObjId(i)));
    
    let {treeNodeCheckedKeys} = this.state;
    if(visible){
      treeNodeCheckedKeys = treeNodeCheckedKeys.concat(pickTreeNodeIds)
    }else{
      treeNodeCheckedKeys = treeNodeCheckedKeys.filter((nodeid) => !pickTreeNodeIds.includes(nodeid));
    }

    this.setState({
      treeNodeCheckedKeys
    });
  }

  setTreeVisible(data, keys, visible, visibleKeys = []) {
    for (let i = 0; i < data.length; i++) {
      if (keys.indexOf(data[i].nodeid) > -1) {
        visibleKeys.push(data[i].nodeid);
      }
      if (data[i].child.length) {
        this.setTreeVisible(data[i].child, keys, visible, visibleKeys);
      }
    }
    return visibleKeys;
  }
  /**
   *
   * @param data
   * @param leafIndexs  叶子的index []
   */
  getExpandedAndSelctKeys(data, leafIndexs) {
    let findParentKeys = this.findParentKeys(data, leafIndexs),
      expandedKeys = [],
      treeNodeSelectKeys = [];
    findParentKeys.forEach((item) => {
      const { parentKeys } = item;
      treeNodeSelectKeys.push(parentKeys[parentKeys.length - 1]);
      expandedKeys = expandedKeys.concat(item.parentKeys);
    });

    // 去重展开的key
    expandedKeys = new Set(expandedKeys.concat(this.state.expandedKeys));
    expandedKeys = Array.from(expandedKeys);

    return {
      expandedKeys,
      treeNodeSelectKeys,
      item: findParentKeys,
    };
  }

  findParentKeys(data, objIndexs, key = []) {
    if (!objIndexs.length) return key;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const index = objIndexs.indexOf(node.objId);
      if (index > -1) {
        key.push(node);
        objIndexs.filter((item) => item !== node.objId);
      } else if (node.child && node.child.length) {
        this.findParentKeys(node.child, objIndexs, key);
      }
    }
    return key;
  }

  pickObjectParameters = (objIds, nodeid) => {
    console.log('pickObjectParameters');
    // scrollIntoView
    const cmlib = window.P3D_LIB;

    // let pickElem = cmlib.P3D_GetPickElements();

    let pickObjIds = cmlib.P3D_GetSelObjIDs();

    
    // console.log(pickObjIds,pickElem);

    
    const pickObjectIndexs = objIds || pickObjIds

    this.tempMutilpSelect = pickObjectIndexs
    // const notPickModel = !window.pickObjectIndexs || (window.pickObjectIndexs && !window.pickObjectIndexs.length)
    const notPickModel = !pickObjectIndexs || (pickObjectIndexs && !pickObjectIndexs.length)
    if (notPickModel) {
      // this.setState({
      //   treeNodeSelectKeys: [],
      //   // isVisible: !!window.pickObjectVisible,
      //   // alphaRange: window.pickObjectTransparent,
      // });
      return;
    }

    this.handleInitPMI(!notPickModel)

    const { expandedKeys,treeNodeSelectKeys,  item } =
      this.getExpandedAndSelctKeys(
        this.state.treeData,
        pickObjectIndexs 
      );

      let NodeId = (item && item.length === 1) ? item[0].nodeid: nodeid;
      
      if(NodeId || NodeId === 0) this.SetTreeNodePmiView(NodeId);

      
        if(pickObjectIndexs.length === 1){
          this.setState({
            expandedKeys,
            treeNodeSelectKeys,
            paramsData: item.length === 1 ? item[0].params : [],
            // isVisible: !!pickObjectVisible,
            // alphaRange: pickObjectTransparent
          },()=>{
            try {
              var treeItem = document.getElementById('tree'+treeNodeSelectKeys[0]);
              setTimeout(() => {
                // treeItem && treeItem.scrollIntoView({block:'start'});
                document.getElementsByClassName('reeeee')[0].scroll(0, treeItem.offsetTop - 100)
              }, 500);
            } catch (error) {
              
            }
          });
        }else{
          this.setState({
            treeNodeSelectKeys,
            paramsData: item.length === 1 ? item[0].params : [],
          });
        }

    // console.log('treeNodeSelectKeys', item.length === 1 ? item[0].params : []);
   
  };

  renderPMITree(treeData) {
    if (!treeData.length) return null;
    return treeData.map((item) => {
      if (item.child) {
        return (
          <TreeNode title={this.renderPMITitle(item)} key={item.key} dataRef={item}>
            {this.renderPMITree(item.child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.key} title={this.renderPMITitle(item)}  {...item} dataRef={item} />
      );
    });
  }

  renderPMITitle(item){
    const cmlib = window.P3D_LIB;
    return <span   id={`pmi${item.key}`} className={
      this.state.PMISelectKeys.indexOf(item.key) > -1 ? "tree_selected" : ""
    } 
    onClick={()=>{
      if(item.type ==='view'){
        // console.log('P3D_ShiftAnnotView', item);
        cmlib.P3D_ShiftAnnotView(item.pmiId)
      } else {
        cmlib.P3D_ClearAnnotSelected();
        this.tempMutilpPMI = [item.pmiId]
        cmlib.P3D_SelectAnnot(this.tempMutilpPMI)
      }
      this.setState({
        PMISelectKeys:[item.key]
      })
    }}
    onMouseDown={() => {
      if (this.keyCode === 17) {
        let {PMISelectKeys} = this.state;
        if(item.type ==='view'){
          cmlib.P3D_ShiftAnnotView(item.pmiId)
        } else {
          cmlib.P3D_ClearAnnotSelected();
          if(this.tempMutilpPMI.includes(item.pmiId)){
            PMISelectKeys = PMISelectKeys.filter(i => i !== item.key)
            this.tempMutilpPMI = this.tempMutilpPMI.filter(i => i !== item.pmiId)
          }else{
            this.tempMutilpPMI.push(item.pmiId)
            PMISelectKeys = PMISelectKeys.concat(item.key)
          }
          cmlib.P3D_SelectAnnot(this.tempMutilpPMI)
        }
        this.setState({
          PMISelectKeys
        })
      }
    }}
    onDoubleClick={()=>{
      if(item.type !== 'view'){
        cmlib.P3D_ClearAnnotSelected();
        cmlib.P3D_SelectAnnot([item.pmiId])
        // console.log('P3D_ChangeCameraFocusToAnnot', item);
        cmlib.P3D_ChangeCameraFocusToAnnot(item.pmiId)
      }
    }}>
      {item.name}
    </span>
  }

  SetTreeNodePmiView(nodeid) {
    let cmlib = window.P3D_LIB;
    let arrViewId = cmlib.P3D_GetAnnotViewIDByTreeID(nodeid);
    const notPickModel = arrViewId === null || arrViewId.length <= 0;

    if (notPickModel) return this.setState({
      PMITreeData: [],
    });;

    const pmiTree = arrViewId.map((id) => {
      const name = cmlib.P3D_GetAnnotViewName(id);
      
      const arrAnnotId = cmlib.P3D_GetAnnotIDInView(id);

      return {
        name,
        key: "view" + id,
        pmiId: id,
        type:'view',
        child: arrAnnotId.map((i) => {
          return {
            name: cmlib.P3D_GetAnnotName(i),
            key: "annotid" + i,
            type:'annot',
            pmiId: i,
            parentPmiId: "view" + id,
          };
        }),
      };
    });
    console.log('pmiTree',pmiTree);
    this.setState({
      PMITreeData: pmiTree,
    });

    // console.log(pmiTree);
    // let viewName = cmlib.P3D_GetAnnotViewName(arrViewId[0]);

    // let arrAnnotId = cmlib.P3D_GetAnnotIDInView(arrViewId[0]);
    // let annotViewId = cmlib.P3D_GetViewIDByAnnotID(arrAnnotId[0]);
    // let annotName = cmlib.P3D_GetAnnotName(arrAnnotId[0]);
    // let annotType = cmlib.P3D_GetAnnotType(arrAnnotId[0]);
    // let annotVisible = cmlib.P3D_IsAnnotVisible(arrAnnotId[0]);
    // cmlib.P3D_SetAnnotVisibleInView(arrViewId, true);
  }

  handleP3D_SetAnnotVisibleInView(treeNodeIds) {
    let cmlib = window.P3D_LIB;
    cmlib.P3D_SetAnnotVisibleInView(treeNodeIds, true);
  }


  handleInitPMI(bl) {
    let cmlib = window.P3D_LIB;

    if (bl) {
      cmlib.P3D_InitPmi();
    } else {
      cmlib.P3D_ResetPmiDispColor();
      cmlib.P3D_UnInitPmi();
    }
  }

  getTreeNodeIdByObjId(objId){
    return this.nodeIds[objId];
  }

  getTreeNodeData(item, parentKeys = [], parent) {
    const key = `${item._uTreeNodeID}`
    parentKeys = parentKeys.concat(key);
   
    
    // 设置obj ID 与 tree node id 对应关系
    if(item._uObjectID !== -1 ) {
      this.nodeIds[item._uObjectID] = item._uTreeNodeID
      if (item._bVisible) this.keys.push(key);
    }

    const data = {
      key,
      parentKeys,
      nodeid: item._uTreeNodeID,
      treeid: item._uJSTreeID,
      title: item._strName,
      params: this.getTreeNodeParams(item._arrNodeParameters),
      objIndex: item._uObjectIndex,
      originVisible: item._bVisibleOriginal,
      visible: item._bVisible,
      TriangleCount: item._uObjectTriangleCount,
      objId: item._uObjectID,
      parent
    };

    data.child = this.processTreeData(item._arrSubNode, parentKeys, data)


    return data
  }

  processTreeData(treeData, parentKeys, parent) {
    // console.log(parent);
    // console.log(treeData);
    if (!treeData || !treeData.length) return [];
    return treeData.map((item) => this.getTreeNodeData(item, parentKeys, parent));
  }

  getTreeNodeParams(arrParmas) {
    return arrParmas.map((item) => ({
      name: item._strName,
      value: item._strValue,
    }));
  }

  findleafIndexs = (data, key = 'objId') => {
    let indexs = [];
    if (data.child && data.child.length) {
      data.child.map(
        (item) => (indexs = indexs.concat(this.findleafIndexs(item, key)))
      );
      return indexs;
    } else {
      indexs.push(data[key]);
      return indexs;
    }
  };

  disableContextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  keyup = (e) => {
    this.keyCode = 0;
    if (this.state.multipleSelcet) {
      this.setState({
        multipleSelcet: false,
      });
    }
  };
  keydown = (e) => {
    if (e.keyCode === 17) {
      this.keyCode = 17;

      this.setState({
        multipleSelcet: true,
      });
    }
  };
  pickAnnot(){
    const cmlib = window.P3D_LIB;
    const ids = cmlib.P3D_GetSelAnnotID();
    // console.log('pickElem._arrPickElements', ids, this.state.PMITreeData);

    // let item;
    // this.state.PMITreeData.some(i=> {
    //   const findview = i.pmiId === ids
    //   if(findview)item = i;
    //   return  findview || i.child.some(j=>{
    //     const isFind = j.pmiId === ids;
    //     if(isFind)item = j;
    //     return isFind
    //   })
    // })
    const PMISelectKeys = ids.map(i=>('annotid'+i))

    // function findItem(items, key, keys){
    //   if(!items || !items.length) return keys
    //   items.forEach(item=>{
    //     if(item.key === key){
    //       keys = item;
    //     }else if(item.child && item.child.length){
    //       findItem(item.child, key, keys)
    //     }
    //   })

    //   return keys
    // }
    // const selectItem = findItem(this.state.PMITreeData, PMISelectKeys[0])
    let pmiIds = []
    let selectItem;
    this.state.PMITreeData.forEach(item=>{
      item.child.forEach(i=>{
        if(i.key === PMISelectKeys[0]) selectItem = i;
        PMISelectKeys.includes(i.key) &&  pmiIds.push(i.pmiId)
      })
    })
   
    // console.log('selectItem',selectItem);


    this.tempMutilpPMI = pmiIds


    let {PMIExpandedKeys}  = this.state;
    if(PMISelectKeys.length === 1){
      PMIExpandedKeys = selectItem?[selectItem.parentPmiId]:[]
    }

    this.setState({
      PMISelectKeys,
      PMIExpandedKeys
    })

    try {
      var treeItem = document.getElementById('pmi'+PMISelectKeys[0]);
      setTimeout(() => {
        const tree = document.getElementsByClassName('pmi_tree')[0]
        tree.scroll(0, treeItem.offsetTop - (tree.offsetTop + tree.offsetHeight / 2)  )
      }, 500);
    } catch (error) {
      
    }
   
    
  }
  modelTree= null;
  paramsTree= null;
  //   ---------------------
  componentDidMount() {
    if (window.g_GLData) {
      this.loadTree();
    } 
    window.addEventListener("scleStreamReady", () => this.loadTree(), {
      passive: false,
    });
    console.log(this.modelTree);
    if(this.modelTree){
      this.modelTree.addEventListener('transitionend', function () {
        window.onCanvasResize && window.onCanvasResize()
      })
    }

    if(this.paramsTree){
      this.paramsTree.addEventListener('transitionend', function () {
        window.onCanvasResize && window.onCanvasResize()
      })
    }
   

    

    window.addEventListener("CMOnMouseUpCallBack", (e) => {
      const cmlib = window.P3D_LIB;
      let pickElem = cmlib.P3D_GetPickElements();
      const hasPick = pickElem && pickElem._arrPickElements && pickElem._arrPickElements.length;
      // console.log('hasPick', hasPick, pickElem);


      if(!hasPick){
        console.log('nopick');
        this.tempMutilpSelect = [];
        this.setState({
          paramsData:[],
          treeNodeSelectKeys:[],
          PMISelectKeys:[]
        })
      }

      // eslint-disable-next-line
      if (pickElem._uPickType == P3D_PICK_TYPE_PART) {
          // console.log("type: 零件" +
          //             "; elems: " , pickElem._arrPickElements[0] ,
          //             "; 名称: " , cmlib.P3D_GetObjName(pickElem._arrPickElements[0]) ,
          //             "; 参数: ", cmlib.P3D_GetObjParams(pickElem._arrPickElements[0]));
        this.pickObjectParameters();
      // eslint-disable-next-line
      } else if (pickElem._uPickType == P3D_PICK_TYPE_PMI_ITEM) {
          // console.log("type: PMI" +
          //             "; elems: " + pickElem._arrPickElements[0] +
          //             "; 名称: " + cmlib.P3D_GetAnnotName(pickElem._arrPickElements[0]));
        this.pickAnnot();
      }

    }, { passive: false,});

    

    window.addEventListener('setVisible', this.setVisible)
  
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    document.addEventListener("contextmenu", this.disableContextmenu);

    window.addEventListener('updateParams', e=>{
      this.setState({
        paramsData: e.detail
      })
    })
  }
  componentWillUnmount() {
    window.removeEventListener("scleStreamReady", this.loadTree.bind(this), {
      passive: false,
    });

    // window.removeEventListener("pickParams", this.pickObjectParameters, {
    //   passive: false,
    // });

    document.removeEventListener("contextmenu", this.disableContextmenu);
    window.removeEventListener("keyup", this.keyup);
    window.removeEventListener("keydown", this.keydown);
  }
}
