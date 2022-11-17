// File: SceneAnnotation.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const WIDTH_UNIT = 100;
const HEIGHT_UNIT = 25;

function SceneAnnotation() {
    // 批注参数
    this.DEFAULT_COMMENT_LINE_X = 0.1;
    this.usrNewComment = null;
    this.commentPickUnit = new GL_PICK_UNIT();
    this.RayPoint1 = new Point3(0, 0, 0);
    this.RayPoint2 = new Point3(0, 0, 0);

    /**
     * 对指定零件添加注释数据
     */
     this.addCommentOnObjectById = function(objectID, annoText) {
        let index = glRunTime.getObjectIndexById(objectID);
        if (index >= 0) {
            this.addCommentOnObjectByIndex(index, annoText);
        }
    }

    this.addCommentOnObjectByIndex = function(index, annoText) {
        let Center = glRunTime.getObjectCenterByIndex(index);
        let center3D = Center.Center3D;
        let center2D = Center.Center2D;
        // 新注释，指向零件包围盒中心点
        let comment = new ADF_COMMENT();

        if (center2D.x > 0 && center2D.x < 0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x + this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.x > 0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x - this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.x < 0 && center2D.x > -0.8) {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x - this.DEFAULT_COMMENT_LINE_X;
        } else {
            comment.stuAnnot.annoPlaneLocal.x = center2D.x + this.DEFAULT_COMMENT_LINE_X;
        }

        if (center2D.y > 0 && center2D.y < 0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.y > 0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y - this.DEFAULT_COMMENT_LINE_X;
        } else if (center2D.y < 0 && center2D.y > -0.8) {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        } else {
            comment.stuAnnot.annoPlaneLocal.y = center2D.y + this.DEFAULT_COMMENT_LINE_X;
        }

        center3D.x -= comment.stuAnnot.annoPlaneLocal.x;
        center3D.y -= comment.stuAnnot.annoPlaneLocal.y;

        comment.stuAnnot.pNote.strText = GetSplitStringArray(annoText);
        comment.stuAnnot.pNote.arrLeaderPos.push(center3D);
        comment.stuProperty._strUserName = "";
        comment.stuProperty._strDateTime = "";
        comment.stuProperty._uStartFrameID = 0;

        g_canvas.addComment(g_camera, comment);
    }

    this.createCommentBegin = function() {
        if (this.usrNewComment != null) {
            this.usrNewComment.Clear();
        } else {
            this.usrNewComment = new ADF_COMMENT();
        }
        g_canvas.isDuringComment = true;
    }

    this.createCommentUpdate = function(screenX, screenY) {
        if (this.usrNewComment == null) {
            return;
        }
        glRunTime.cvtScreenToWorld(screenX, screenY, this.RayPoint1, this.RayPoint2);
        // 根据射线，计算与Object的相交
        let intersectRet = g_glprogram.intersectRayScene(this.RayPoint1, this.RayPoint2, this.commentPickUnit);
        if (intersectRet == null) {
            return false;
        } else {
            g_glprogram.pickObjectByIndex(intersectRet.objectIndex, true);
            this.usrNewComment.stuAnnot.pNote.arrLeaderPos.push(intersectRet.intersectPt.copy());
            // 兼容处理，添加ObjectID数据
            if (this.usrNewComment.stuAnnot.pNote.arrObjectIndexs == null) {
                this.usrNewComment.stuAnnot.pNote.arrObjectIndexs = new Array();
            }
            this.usrNewComment.stuAnnot.pNote.arrObjectIndexs.push(intersectRet.objectIndex);
            this.commentPickUnit.Reset();
            return true;
        }
    }

    this.createCommentFinal = function(screenX, screenY, info) {
        if (this.usrNewComment == null || this.usrNewComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return false;
        } else {
            this.usrNewComment.stuAnnot.pNote.strText = info._uAnnotText;
            this.usrNewComment.stuAnnot.strName = info._uAnnotName;

            this.usrNewComment.stuProperty._strUserName = info._strUsrName;
            this.usrNewComment.stuProperty._strDateTime = info._strCreateTime;
            this.usrNewComment.stuProperty._uStartFrameID = info._uStartFrame;
            this.usrNewComment.stuProperty._uFrameSize = info._uFrameSize;

            g_canvas.adapterScreenToLocal(screenX, screenY, this.usrNewComment.stuAnnot.annoPlaneLocal);
            g_canvas.addUsrComment(this.usrNewComment, false);
            this.usrNewComment = null;
            g_canvas.isDuringComment = false;
            return true;
        }
    }

    this.createCommentCancel = function() {
        if (this.usrNewComment != null) {
            this.usrNewComment.Clear();
            this.usrNewComment = null;
            g_canvas.isDuringComment = false;
        }
    }

    this.isCommentValid = function() {
        if (this.usrNewComment == null || this.usrNewComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return false;
        }
        return true;
    }

    this.updateCommentById = function(x, y, commentInfo) {
        let isNewNote = true;
        let index = -1;
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            if (g_canvas.m_arrIsUsrCommentDel[i]) {
                continue;
            }
            if (g_canvas.m_arrUsrComment[i].stuAnnot.uID == commentInfo._uAnnotID) {
                isNewNote = false;
                index = i;
                break;
            }
        }

        if (!isNewNote) {
            g_canvas.updateUsrComment(commentInfo, index);
            return true;
        }
        return false;
    }

    this.deleteCommentById = function(id) {
        let index = -1;
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            if (g_canvas.m_arrIsUsrCommentDel[i]) {
                continue;
            }
            if (g_canvas.m_arrUsrComment[i].stuAnnot.uID == id) {
                index = i;
                break;
            }
        }
        g_canvas.deleteUsrComment(index);
    }

    this.getCommentObjectIndexs = function(id) {
        for (let i = 0; i < g_canvas.m_arrUsrComment.length; ++i) {
            if (g_canvas.m_arrIsUsrCommentDel[i]) {
                continue;
            }
            if (g_canvas.m_arrUsrComment[i].stuAnnot.uID == id) {
                return g_canvas.m_arrUsrComment[i].stuAnnot.pNote.arrObjectIndexs;
            }
        }
        return null;
    }

    this.importXmlComment = function(xmlDoc) {
        if (g_canvas == null) {
            return false;
        }

        g_xmlTool = new XmlTool();
        let arrComment = g_xmlTool.importXmlComment(xmlDoc);
        if (arrComment == null || arrComment.length == 0) {
            return false;
        }
        for (let i = 0; i < arrComment.length; ++i) {
            g_canvas.addUsrComment(arrComment[i], true);

            // 添加UI
            var newCommentNode = new GL_USRANNOTATION();
            let point2d = new Point2(0, 0);
            g_canvas.adapterLocalToScreen(arrComment[i].stuAnnot.annoPlaneLocal.x, arrComment[i].stuAnnot.annoPlaneLocal.y, point2d);
            newCommentNode.copyFromScle(arrComment[i], point2d, true);
            newCommentNode._attachPt.set(arrComment[i].stuAnnot.annoPlaneLocal.x, arrComment[i].stuAnnot.annoPlaneLocal.y);
            g_usrCommOption.data.push(newCommentNode);
        }
        return true;
    }

    this.exportXmlComment = function(xmlDoc) {
        let arrComment = new Array();
        for (let i = 0; i < g_canvas.m_arrIsUsrCommentDel.length; ++i) {
            if (!g_canvas.m_arrIsUsrCommentDel[i]) {
                arrComment.push(g_canvas.m_arrUsrComment[i]);
            }
        }
        if (arrComment.length == 0) {
            return null;
        }

        g_xmlTool = new XmlTool();
        return g_xmlTool.exportXmlComment(xmlDoc, arrComment);
    }

    /**
     * 标注数据拾取
     */
    this.pickAnnotation = function(screenX, screenY, isMult) {
        // 屏幕鼠标坐标与常用坐标系y轴反向
        return g_canvas.pickAnnotationByRay(screenX, screenY, isMult);
    }
}

// 用户批注数据
function GL_USRANNOTATION() {
    this.show = true;                      // 文本框使用参数
    this.disabled = false;
    this.style = null;
    this.value = "文本";
    this.type = "";

    this._uAnnotID = -1;
    this._uAnnotName = "节点";              // 模型树显示
    this._uAnnotText = "文本";              // 批注控件显示
    this._strUsrName = "unknow";            // 作者
    this._strCreateTime = "19710101010159"; // 注释日期，精确到秒，总共14位
    this._uStartFrame = 0;                  // 起始帧
    this._uFrameSize = 0;                   // 帧段长度
    this._attachPt = new Point2(0, 0);      // 批注悬挂点

    this.cvtPointToStyle = function(point2d) {
        this.style = {left: 0, top: 0, width: 0};
        this.style.top = point2d.y - HEIGHT_UNIT;
        this.style.width = WIDTH_UNIT;
        this.style.left = point2d.x - this.style.width / 2;
        return this.style;
    }

    this.cvtStyleToPoint = function() {
        let y = this.style.top + HEIGHT_UNIT;
        let x = this.style.left + this.style.width / 2;
        return new Point2(x, y);
    }

    this.copyFromScle = function(comment, point2d, isVisible) {
        this._uAnnotID = comment.stuAnnot.uID;
        this._strUsrName = comment.stuProperty._strUserName;
        this._strCreateTime = comment.stuProperty._strDateTime;
        this._uAnnotText = comment.stuAnnot.pNote.strText;
        this.value = comment.stuAnnot.pNote.strText;
        this.style = this.cvtPointToStyle(point2d);
        this.disabled = true;

        // 根据有无引线，判断显示样式
        if (comment.stuAnnot.pNote.arrLeaderPos == null || comment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            this.type = "input";
        }
        
        this.show = isVisible;
    }
}
