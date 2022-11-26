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
  };
  render() {
    const cmlib = window.CM_LIB;
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
          <div className="attr_tree">
            <div>
              <h4 className="title">模型树</h4>
              <Tree
                checkable
                checkStrictly
                checkedKeys={treeNodeCheckedKeys}
                selectedKeys={treeNodeSelectKeys}
                expandedKeys={expandedKeys}
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
                  // console.log(treeNodeCheckedKeys);
                  this.setState({
                    treeNodeCheckedKeys,
                  });
                  cmlib.CMSetObjVisible(
                    this.findleafIndexs(e.node.props.dataRef),
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
                  // let arrViewId = cmlib.CMGetAnnotViewIDByTreeID(item.pmiId);
                  // console.log(`设置${item.pmiId}视图是否显示,${e.checked}`);
                  cmlib.CMSetAnnotVisibleInView([item.pmiId], e.checked)
                }else{
                  // console.log(`设置${item.pmiId}批注是否显示,${e.checked}`);
                  cmlib.CMSetAnnotVisible([item.pmiId], e.checked)
                }


                }} 
               >
                {this.renderPMITree(PMITreeData)}
              </Tree>
            </div>
          </div>
        ) : (
          <>
            <h4 className="title">参数</h4>
            <Table
              className="attrTable"
              columns={columns}
              dataSource={paramsData}
              locale={{ emptyText: "无数据" }}
              size="middle"
            />
          </>
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

  renderTitle(item) {
    const cmlib = window.CM_LIB;
    const key = item.key;
    return (
      <span
        className={
          this.state.treeNodeSelectKeys.indexOf(key) > -1 ? "tree_selected" : ""
        }
        onClick={() => {
          // 选择模型名称时 dofeel
          if (this.keyCode) return;
          this.hideSelect = true;

          this.tempMutilpSelect = this.findleafIndexs(item, 'key');
          // this.setState({
          //   treeNodeSelectKeys: this.tempMutilpSelect,
          //   paramsData: item.params,
          // });

          const objIds = this.findleafIndexs(item)


          cmlib.CMSetSelStatusByObjIDs(objIds);

          scleCustomEvent('updateParams', item.params);

          // window.setPickObjectParameters();

          this.pickObjectParameters(objIds, item.nodeid)
          // window.pickModelByIndex(this.tempMutilpSelect, IsPhone());
        }}
        onMouseDown={() => {
          if (this.keyCode === 17) {
            let { treeNodeSelectKeys } = this.state;

            const leafKeys = this.findleafIndexs(item);

            if (treeNodeSelectKeys.indexOf(key) > -1) {
              // 已选择，取消选择
              treeNodeSelectKeys = treeNodeSelectKeys.filter(
                (item) => item !== key
              );
              // 临时多选
              this.tempMutilpSelect = this.tempMutilpSelect.filter(
                (item) => leafKeys.indexOf(item) === -1
              );
            } else {
              treeNodeSelectKeys.push(key);
              this.tempMutilpSelect = this.tempMutilpSelect.concat(leafKeys);
            }

            this.hideSelect = true;
            this.setState({
              treeNodeSelectKeys,
              paramsData: [],
            });

            window.pickModelByIndex(this.tempMutilpSelect, IsPhone());
            // 多选 dofeel
            window.setPickObjectParameters();
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

    let { treeNodeCheckedKeys } = this.state;
    treeNodeCheckedKeys = treeNodeCheckedKeys.checked || treeNodeCheckedKeys;
    if (window.pickObjectIndexs === null) {
      return;
    }
    const visibleKeys = this.setTreeVisible(
      this.state.treeData,
      window.pickObjectIndexs,
      visible
    );
    treeNodeCheckedKeys = visible
      ? treeNodeCheckedKeys.concat(visibleKeys)
      : treeNodeCheckedKeys.filter((item) => visibleKeys.indexOf(item) < 0);
    this.setState({
      treeNodeCheckedKeys,
    });
  }

  setTreeVisible(data, keys, visible, visibleKeys = []) {
    for (let i = 0; i < data.length; i++) {
      if (keys.indexOf(data[i].objIndex) > -1) {
        visibleKeys.push(data[i].key);
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
    expandedKeys = new Set(expandedKeys);
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

    
    const cmlib = window.CM_LIB;

    let pickElem = cmlib.CMGetPickElements();

    
    // console.log(pickElem, this.state.treeData);

    
    const pickObjectIndexs = objIds || pickElem._arrPickElements
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


    // console.log('treeNodeSelectKeys', item.length === 1 ? item[0].params : []);
    this.setState({
      expandedKeys,
      treeNodeSelectKeys,
      paramsData: item.length === 1 ? item[0].params : [],
      // isVisible: !!pickObjectVisible,
      // alphaRange: pickObjectTransparent
    });
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
    const cmlib = window.CM_LIB;
    return <span className={
      this.state.PMISelectKeys.indexOf(item.key) > -1 ? "tree_selected" : ""
    } 
    onClick={()=>{
      if(item.type ==='view'){
        // console.log('CMShiftAnnotView', item);
        cmlib.CMShiftAnnotView(item.pmiId)
      } else {
        cmlib.CMClearAnnotSelected();
        cmlib.CMSelectAnnot([item.pmiId])
      }
      this.setState({
        PMISelectKeys:[item.key]
      })
    }}
    
    onDoubleClick={()=>{
      if(item.type !== 'view'){
        cmlib.CMClearAnnotSelected();
        cmlib.CMSelectAnnot([item.pmiId])
        // console.log('CMChangeCameraFocusToAnnot', item);
        cmlib.CMChangeCameraFocusToAnnot(item.pmiId)
      }
    }}>
      {item.name}
    </span>
  }

  SetTreeNodePmiView(nodeid) {
    let cmlib = window.CM_LIB;
    let arrViewId = cmlib.CMGetAnnotViewIDByTreeID(nodeid);
    const notPickModel = arrViewId === null || arrViewId.length <= 0;

    if (notPickModel) return this.setState({
      PMITreeData: [],
    });;

    const pmiTree = arrViewId.map((id) => {
      const name = cmlib.CMGetAnnotViewName(id);
      
      const arrAnnotId = cmlib.CMGetAnnotIDInView(id);

      return {
        name,
        key: "view" + id,
        pmiId: id,
        type:'view',
        child: arrAnnotId.map((i) => {
          return {
            name: cmlib.CMGetAnnotName(i),
            key: "annotid" + i,
            type:'annot',
            pmiId: i,
            parentPmiId: "view" + id,
          };
        }),
      };
    });
    this.setState({
      PMITreeData: pmiTree,
    });

    // console.log(pmiTree);
    // let viewName = cmlib.CMGetAnnotViewName(arrViewId[0]);

    // let arrAnnotId = cmlib.CMGetAnnotIDInView(arrViewId[0]);
    // let annotViewId = cmlib.CMGetViewIDByAnnotID(arrAnnotId[0]);
    // let annotName = cmlib.CMGetAnnotName(arrAnnotId[0]);
    // let annotType = cmlib.CMGetAnnotType(arrAnnotId[0]);
    // let annotVisible = cmlib.CMIsAnnotVisible(arrAnnotId[0]);
    // cmlib.CMSetAnnotVisibleInView(arrViewId, true);
  }

  handleCMSetAnnotVisibleInView(treeNodeIds) {
    let cmlib = window.CM_LIB;
    cmlib.CMSetAnnotVisibleInView(treeNodeIds, true);
  }


  handleInitPMI(bl) {
    let cmlib = window.CM_LIB;

    if (bl) {
      cmlib.CMInitPmi();
    } else {
      cmlib.CMResetPmiDispColor();
      cmlib.CMUnInitPmi();
    }
  }

  getTreeNodeData(item, parentKeys = []) {
    const key = `${item._uTreeNodeID}`
    parentKeys = parentKeys.concat(key);
    if (item._bVisible) this.keys.push(key);
    return {
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
      child: this.processTreeData(item._arrSubNode, parentKeys),
      objId: item._uObjectID
    };
  }

  processTreeData(treeData, parentKeys) {
    // console.log(treeData);
    if (!treeData || !treeData.length) return [];
    return treeData.map((item) => this.getTreeNodeData(item, parentKeys));
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
    const cmlib = window.CM_LIB;
    let pickElem = cmlib.CMGetPickElements();
    const ids = pickElem._arrPickElements[0]
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
    const PMISelectKeys = ['annotid'+ids]
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
    let selectItem;
    this.state.PMITreeData.forEach(item=>{
      item.child.forEach(i=>{
        if(i.key === PMISelectKeys[0]) selectItem = i;
      })
    })
   
    // console.log('selectItem',selectItem);



    this.setState({
      PMISelectKeys,
      PMIExpandedKeys: selectItem?[selectItem.parentPmiId] :[]
    })
    
  }
  //   ---------------------
  componentDidMount() {
    if (window.g_GLData) {
      this.loadTree();
    } 
    window.addEventListener("scleStreamReady", () => this.loadTree(), {
      passive: false,
    });

    window.addEventListener("CMOnMouseUpCallBack", (e) => {
      const cmlib = window.CM_LIB;
      let pickElem = cmlib.CMGetPickElements();
      const hasPick = pickElem && pickElem._arrPickElements && pickElem._arrPickElements.length;
      // console.log('hasPick', hasPick, pickElem);


      if(!hasPick){
        this.setState({
          paramsData:[],
          treeNodeSelectKeys:[],
          PMISelectKeys:[]
        })
      }

      // eslint-disable-next-line
      if (pickElem._uPickType == CM_PICK_TYPE_PART) {
          // console.log("type: 零件" +
          //             "; elems: " , pickElem._arrPickElements[0] ,
          //             "; 名称: " , cmlib.CMGetObjName(pickElem._arrPickElements[0]) ,
          //             "; 参数: ", cmlib.CMGetObjParams(pickElem._arrPickElements[0]));
        this.pickObjectParameters();
      // eslint-disable-next-line
      } else if (pickElem._uPickType == CM_PICK_TYPE_PMI_ITEM) {
          // console.log("type: PMI" +
          //             "; elems: " + pickElem._arrPickElements[0] +
          //             "; 名称: " + cmlib.CMGetAnnotName(pickElem._arrPickElements[0]));
        this.pickAnnot();
      }

    }, { passive: false,});

    
    window.setVisibleTree = this.setVisible.bind(this);
  
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
