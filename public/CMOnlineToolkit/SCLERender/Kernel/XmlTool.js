// File: XmlTooljs

/**
 * @author wujiali
 */

//===================================================================================================

/**
 * 批注、注释数据XML节点信息
 */
 const XML_DOC_INFO = "DocInfo";
 const XML_COMMENT_NODE = "CommentNode";
 const XML_NODE = "Node";

 function XmlTool() {

    this.importXmlPoint3 = function(xmlNode, point) {
        let pointAttrs = xmlNode.attributes;
        point.x = parseFloat(pointAttrs.x.nodeValue);
        point.y = parseFloat(pointAttrs.y.nodeValue);
        point.z = parseFloat(pointAttrs.z.nodeValue);
    }

    this.importXmlPlane = function(xmlNode, plane) {
        let annotPlane = xmlNode.childNodes;
        for (let i = 0; i < annotPlane.length; ++i) {
            if (annotPlane[i].nodeName == "origin") {
                this.importXmlPoint3(annotPlane[i], plane);
            }
        }
    }

    this.importXmlNote = function(xmlNode, note) {
        let noteAttrs = xmlNode.attributes;
        let noteChilds = xmlNode.childNodes;
        note.strText = noteAttrs.Text.nodeValue;
        for (let i = 0; i < noteChilds.length; ++i) {
            if (noteChilds[i].nodeName == "attachPos") {
                this.importXmlPoint3(noteChilds[i], note.attachPos);
            } else if (noteChilds[i].nodeName == "LeaderPos") {
                let posChilds = noteChilds[i].childNodes;
                for (let j = 0; j < posChilds.length; ++j) {
                    if (posChilds[j].nodeName == "Pos") {
                        let leaderPt = new ADF_BASEFLOAT3();
                        this.importXmlPoint3(posChilds[j], leaderPt);
                        note.arrLeaderPos.push(leaderPt);
                    }
                }
                for (let j = 0; j < posChilds.length; ++j) {
                    if (posChilds[j].nodeName == "ObjectID") {
                        if (note.arrObjectIndexs == null) {
                            note.arrObjectIndexs = new Array();
                        }
                        // ObjectID转换为索引
                        let IdAttrs = posChilds[j].attributes;
                        let IdValue = IdAttrs.ID.nodeValue;
                        let index = glRunTime.getObjectIndexById(IdValue);
                        note.arrObjectIndexs.push(index);
                    }
                }
                // 兼容写法，添加引线objectID
                if (note.arrLeaderPos.length > 0 && note.arrObjectIndexs == null) {
                    note.arrObjectIndexs = new Array();
                    for (let j = 0; j < note.arrLeaderPos.length; ++j) {
                        note.arrObjectIndexs.push(-1);
                    }
                }
                // 世界坐标转为CMOnline坐标
                for (let j = 0; j < note.arrLeaderPos.length; ++j) {
                    glRunTime.cvtWorldToCMOnline(note.arrLeaderPos[j], note.arrObjectIndexs[j]);
                }
            }
        }
    }

    this.importXmlAnnot = function(xmlAnnot, info) {
        let annotAttrs = xmlAnnot.attributes;
        info.uID = annotAttrs.ID.nodeValue;
        info.uMtlID = annotAttrs.MtlID.nodeValue;
        info.strName = annotAttrs.Name.nodeValue;
        info.nType = annotAttrs.Type.nodeValue;

        let annotChilds = xmlAnnot.childNodes;
        for (let i = 0; i < annotChilds.length; ++i) {
            if (annotChilds[i].nodeName == "AnnotPlane") {
                this.importXmlPlane(annotChilds[i], info.annoPlaneLocal);
            } else if (annotChilds[i].nodeName == "Note") {
                this.importXmlNote(annotChilds[i], info.pNote);
            }
        }
    }

    this.importXmlCamera = function(xmlNode, camera) {
        let cameraAttrs = xmlNode.attributes;
        let cameraChilds = xmlNode.childNodes;
        camera._fAspect = parseFloat(cameraAttrs.Aspect.nodeValue);
        camera._fFOVY = parseFloat(cameraAttrs.FOVY.nodeValue);
        camera._fZNear = parseFloat(cameraAttrs.ZNear.nodeValue);
        camera._fZFar = parseFloat(cameraAttrs.ZFar.nodeValue);
        for (let i = 0; i < cameraChilds.length; ++i) {
            if (cameraChilds[i].nodeName == "EyePos") {
                this.importXmlPoint3(cameraChilds[i], camera._vEyePos);
            } else if (cameraChilds[i].nodeName == "Focus") {
                this.importXmlPoint3(cameraChilds[i], camera._vFocus);
            } else if (cameraChilds[i].nodeName == "Up") {
                this.importXmlPoint3(cameraChilds[i], camera._vUp);
            }
        }
    }

    this.importXmlProperty = function(xmlProp, info) {
        let propAttrs = xmlProp.attributes;
        info._strUserName = propAttrs.UserName.nodeValue;
        info._strDateTime = propAttrs.DateTime.nodeValue;
        info._uStartFrameID = parseInt(propAttrs.StartFrameID.nodeValue);
        info._uFrameSize = parseInt(propAttrs.FrameSize.nodeValue);

        let cameraNode = xmlProp.childNodes[0];
        this.importXmlCamera(cameraNode, info._stuCamera);
    }

    this.importXmlComment = function(xmlDoc) {
        // 版本信息，校验项
        let doc_info = xmlDoc.getElementsByTagName(XML_DOC_INFO);
        let version_attr = doc_info[0].attributes;
        if (version_attr.version.nodeValue != "1.0.0") {
            return null;
        }

        let comment_node = xmlDoc.getElementsByTagName(XML_COMMENT_NODE);
        let nodes = xmlDoc.getElementsByTagName(XML_NODE);
        if (comment_node.length != 1 || nodes.length == 0) {
            return null;
        }

        var arrComment = new Array();
        var newComment = null;
        for (let i = 0; i < nodes.length; i++) {
            let childNodes = nodes[i].childNodes;
            newComment = new ADF_COMMENT();
            for (let j = 0; j < childNodes.length; ++j) {
                if (childNodes[j].nodeName == "Property") {
                    this.importXmlProperty(childNodes[j], newComment.stuProperty);
                } else if (childNodes[j].nodeName == "Annot") {
                    this.importXmlAnnot(childNodes[j], newComment.stuAnnot);
                }
            }
            arrComment.push(newComment);
            newComment = null;
        }
        return arrComment;
    }

    this.createAttributeNode = function(xmlDoc, element, attrName, attrData) {
        let newAttr = xmlDoc.createAttribute(attrName);
        newAttr.nodeValue = attrData;
        element.setAttributeNode(newAttr);
    }

    this.exportXmlPoint3 = function(xmlDoc, ptName, point) {
        let newPoint = xmlDoc.createElement(ptName);
        this.createAttributeNode(xmlDoc, newPoint, "x", point.x);
        this.createAttributeNode(xmlDoc, newPoint, "y", point.y);
        this.createAttributeNode(xmlDoc, newPoint, "z", point.z);
        return newPoint;
    }

    this.exportXmlPlane = function(xmlDoc, plane) {
        let newPlane = xmlDoc.createElement("AnnotPlane");
        newPlane.appendChild(this.exportXmlPoint3(xmlDoc, "origin", plane));

        let plane_x = new Point3(1.0, 0, 0);
        newPlane.appendChild(this.exportXmlPoint3(xmlDoc, "x", plane_x));
        let plane_y = new Point3(0, 1.0, 0);
        newPlane.appendChild(this.exportXmlPoint3(xmlDoc, "y", plane_y));
        let plane_z = new Point3(0, 0, 1.0);
        newPlane.appendChild(this.exportXmlPoint3(xmlDoc, "z", plane_z));

        return newPlane;
    }

    this.exportTextStyle = function(xmlDoc, textStyle) {
        let newTextStyle = xmlDoc.createElement("TextStyle");
        this.createAttributeNode(xmlDoc, newTextStyle, "Font", textStyle.strFont);
        textStyle.fHeight = 0.1;
        this.createAttributeNode(xmlDoc, newTextStyle, "Height", textStyle.fHeight);
        this.createAttributeNode(xmlDoc, newTextStyle, "LineSpace", textStyle.fLineSpace);
        let mirror = textStyle.bMirror == true ? 1 : 0;
        this.createAttributeNode(xmlDoc, newTextStyle, "Mirror", mirror);
        let readonly = textStyle.bReadonly == true ? 1 : 0;
        this.createAttributeNode(xmlDoc, newTextStyle, "Readonly", readonly);
        this.createAttributeNode(xmlDoc, newTextStyle, "Slant", textStyle.fSlant);
        this.createAttributeNode(xmlDoc, newTextStyle, "Thickness", textStyle.fThickness);
        let underLine = textStyle.bUnderline == true ? 1 : 0;
        this.createAttributeNode(xmlDoc, newTextStyle, "Underline", underLine);
        this.createAttributeNode(xmlDoc, newTextStyle, "HorJust", textStyle.nHorJust);
        this.createAttributeNode(xmlDoc, newTextStyle, "VerJust", textStyle.nVerJust);
        this.createAttributeNode(xmlDoc, newTextStyle, "Width", textStyle.fWidth);

        return newTextStyle;
    }

    this.exportXmlNote = function(xmlDoc, note) {
        let newNote = xmlDoc.createElement("Note");
        this.createAttributeNode(xmlDoc, newNote, "ArrowStyle", 1);
        this.createAttributeNode(xmlDoc, newNote, "ElbowLength", 0.0);
        this.createAttributeNode(xmlDoc, newNote, "LeaderStyle", 1);
        this.createAttributeNode(xmlDoc, newNote, "Reserve", "");
        this.createAttributeNode(xmlDoc, newNote, "Text", note.strText);
        this.createAttributeNode(xmlDoc, newNote, "Text2", "");
        this.createAttributeNode(xmlDoc, newNote, "TextDir", -1);

        newNote.appendChild(this.exportXmlPoint3(xmlDoc, "attachPos", note.attachPos));

        let newLeaderPos = xmlDoc.createElement("LeaderPos");
        for (let i = 0; i < note.arrLeaderPos.length; ++i) {
            // cmonline坐标转为世界坐标
            let tmpPos = new Point3(note.arrLeaderPos[i].x, note.arrLeaderPos[i].y, note.arrLeaderPos[i].z);
            glRunTime.cvtCMOnlineToWorld(tmpPos, note.arrObjectIndexs[i]);
            newLeaderPos.appendChild(this.exportXmlPoint3(xmlDoc, "Pos", tmpPos));
        }
        for (let i = 0; i < note.arrLeaderPos.length; ++i) {
            // 兼容写法，添加引线objectID
            let objectID = glRunTime.getObjectIdByIndex(note.arrObjectIndexs[i]);
            let newObjectID = xmlDoc.createElement("ObjectID");
            this.createAttributeNode(xmlDoc, newObjectID, "ID", objectID);
            newLeaderPos.appendChild(newObjectID);
        }
        newNote.appendChild(newLeaderPos);

        newNote.appendChild(this.exportTextStyle(xmlDoc, note.textStyle));

        return newNote;
    }

    this.exportRenderProp = function(xmlDoc, renderProp) {
        let IsFront = 1;
        let IsScreenAnnot = 1;
        let Visible = 1;

        let newRenderProp = xmlDoc.createElement("RenderProp");
        this.createAttributeNode(xmlDoc, newRenderProp, "IsFront", IsFront);
        this.createAttributeNode(xmlDoc, newRenderProp, "IsScreenAnnot", IsScreenAnnot);
        this.createAttributeNode(xmlDoc, newRenderProp, "Visible", Visible);

        return newRenderProp;
    }

    this.exportXmlAnnot = function(xmlDoc, annot) {
        annot.uMtlID = 4;
        annot.nType = 2;

        let newAnnot = xmlDoc.createElement("Annot");
        this.createAttributeNode(xmlDoc, newAnnot, "ID", annot.uID);
        this.createAttributeNode(xmlDoc, newAnnot, "MtlID", annot.uMtlID);
        this.createAttributeNode(xmlDoc, newAnnot, "Name", annot.strNam);
        this.createAttributeNode(xmlDoc, newAnnot, "Type", annot.nType);

        newAnnot.appendChild(this.exportXmlPlane(xmlDoc, annot.annoPlaneLocal));
        newAnnot.appendChild(this.exportRenderProp(xmlDoc, annot.annoRenderProp));
        newAnnot.appendChild(this.exportXmlNote(xmlDoc, annot.pNote));

        return newAnnot;
    }

    this.exportXmlCamera = function(xmlDoc, camera) {
        let newCamera = xmlDoc.createElement("Camera");
        this.createAttributeNode(xmlDoc, newCamera, "Aspect", camera._fAspect);
        this.createAttributeNode(xmlDoc, newCamera, "FOVY", camera._fFOVY);
        this.createAttributeNode(xmlDoc, newCamera, "InterocularDistance", 0.000000);
        this.createAttributeNode(xmlDoc, newCamera, "ZNear", camera._fZNear);
        this.createAttributeNode(xmlDoc, newCamera, "ZFar", camera._fZFar);

        newCamera.appendChild(this.exportXmlPoint3(xmlDoc, "EyePos", camera._vEyePos));
        newCamera.appendChild(this.exportXmlPoint3(xmlDoc, "Focus", camera._vFocus));
        newCamera.appendChild(this.exportXmlPoint3(xmlDoc, "Up", camera._vUp));

        return newCamera;
    }

    this.exportXmlProperty = function(xmlDoc, property) {
        property._nCommentType = 1;

        let newProperty = xmlDoc.createElement("Property");
        this.createAttributeNode(xmlDoc, newProperty, "UserName", property._strUserName);
        this.createAttributeNode(xmlDoc, newProperty, "DateTime", property._strDateTime);
        this.createAttributeNode(xmlDoc, newProperty, "StartFrameID", property._uStartFrameID);
        this.createAttributeNode(xmlDoc, newProperty, "FrameSize", property._uFrameSize);
        this.createAttributeNode(xmlDoc, newProperty, "Type", property._nCommentType);

        newProperty.appendChild(this.exportXmlCamera(xmlDoc, property._stuCamera));

        return newProperty;
    }

    this.exportXmlComment = function(xmlDoc, arrComment) {
        // 添加根节点
        let root = xmlDoc.createElement("Root");
        // 添加版本信息节点
        let doc_info = xmlDoc.createElement(XML_DOC_INFO);
        this.createAttributeNode(xmlDoc, doc_info, "version", "1.0.0");

        let comment_node = xmlDoc.createElement(XML_COMMENT_NODE);
        for (let i = 0; i < arrComment.length; ++i) {
            let commentInfo = arrComment[i];
            let newNode = xmlDoc.createElement(XML_NODE);
            newNode.appendChild(this.exportXmlProperty(xmlDoc, commentInfo.stuProperty));
            newNode.appendChild(this.exportXmlAnnot(xmlDoc, commentInfo.stuAnnot));
            comment_node.appendChild(newNode);
        }
        root.appendChild(doc_info);
        root.appendChild(comment_node);
        return root
    }
 }