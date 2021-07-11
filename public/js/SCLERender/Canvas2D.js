// File: WebGL.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const FONT_DEFAULT_ANNOT = "20px 微软雅黑";
const FONT_DEFAULT_PROPE = "10px 微软雅黑";
const FONT_DEFAULT_COPY = "14px 微软雅黑";
const FILL_STYLE_PROPE_RECT = "#fff8dc";
const FILL_STYLE_SELE_RECT = "rgba(0,128,200,0.5)";
const STYLE_DEFAULT = "#000000";
const STYLE_HIGHLIGHT = "#ff0000";
const STYLE_WHITE = "#ffffff";
const DOT_RIDUS = 3;

function Canvas2D() {

    this.m_arrAnnotVisiable = new Array();
    this.m_arrAnnotRect = new Array();
    this.m_arrPickAnnotIndexs = new Array();
    this.GL_PICKSTATUSANNO = 0;

    this.MVPMatrix = mat4.create();
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.RealPoint1 = new Point3(0, 0, 0);
    this.RealPoint2 = new Point3(0, 0, 0);
    this.RealPoint3 = new Point3(0, 0, 0);

    this.annotTextRows = 1;             // 注释行数
    this.annotTextFont = 20;            // 注释文本字号
    this.annotPropGap = 3;              // 注释属性框与注释间隙
    this.annotPropTextFont = 10;        // 注释属性文本字号
    this.annotPropRectWidth = 180;      // 注释属性框宽
    this.annotPropRectHeight = 40;      // 注释属性框高
    this.annotPropTextLineHeight = 5;   // 注释属性框内行距
    this.annotDire = 1;                 // 注释文字底线方向，临时变量
    this.annotTextLength = 0;           // 注释文字总长度，临时变量
    this.annotTextHeight = 0;           // 注释文字总高度，临时变量
    this.isOutWindow = false;           // 注释文字是否超出界限，临时变量

    this.commentId = 200000;
    this.m_arrUsrComment = new Array();
    this.m_arrIsUsrCommentDel = new Array();
    this.isDrawLeaderPos = true;

    /**
     * 初始化canvas参数
     */
    this.initCanvasView = function(width, height) {
        this.windowWidth = width;
        this.windowHeight = height;
    }

    /**
     * 初始化2D注释数据
     */
     this.initAnnoData = function() {
        if (g_GLAnnoSet != null && g_GLAnnoSet._arrComment.length > 0) {
            this.setAnnotVisible();
            this.setPickAnnotIndexs();
            this.setAnnotUI();
            // 初始化ID
            this.commentId = g_GLAnnoSet._arrComment[g_GLAnnoSet._arrComment.length - 1].stuAnnot.uID + 1;
        }
    }

    /**
     * 清空2D注释数据
     */
    this.uninitAnnoData = function() {
        if (g_GLAnnoSet != null || g_GLAnnoSet._arrComment.length > 0) {
            this.m_arrAnnotVisiable.splice(0, this.m_arrAnnotVisiable.length);
            this.m_arrAnnotRect.splice(0, this.m_arrAnnotRect.length);
            this.m_arrPickAnnotIndexs.splice(0, this.m_arrPickAnnotIndexs.length);
            this.m_arrUsrComment.splice(0, this.m_arrUsrComment.length);
            this.m_arrIsUsrCommentDel.splice(0, this.m_arrIsUsrCommentDel.length);
        }
    }

    /**
     * 恢复初始状态
     */
    this.home =function(type) {
        switch (type) {
            case HOME_ALL:
            case HOME_ANNOT:
                this.setAnnotVisible();
                break;
            default:
                return;
        }
    }

    /**
     * 绘制注释数据
     */
     this.drawAnnotation2D = function() {
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.modelMatrix);
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            // 判断显隐性
            if (!this.m_arrAnnotVisiable[i]) {
                continue;
            }
            // 绘制注释数据
            this.drawAnnoData(g_GLAnnoSet._arrComment[i].stuAnnot);
        }
    }

    this.drawAnnoData = function(annotation) {
        // 计算引线位置
        gl2d.beginPath();
        this.adapterLocalToScreen(annotation.annoPlaneLocal.x, annotation.annoPlaneLocal.y, this.RealPoint2);
        for (let j=0; j<annotation.pNote.arrLeaderPos.length; j++) {
            this.cvtWorldToScreen(annotation.pNote.arrLeaderPos[j].x + annotation.annoPlaneLocal.x,
                annotation.pNote.arrLeaderPos[j].y + annotation.annoPlaneLocal.y,
                annotation.pNote.arrLeaderPos[j].z, this.MVPMatrix, this.RealPoint1);
            // 绘制引线
            this.drawFillCircle(this.RealPoint1.x, this.RealPoint1.y, DOT_RIDUS);
            this.drawLine(this.RealPoint1.x, this.RealPoint1.y, RealPoint2.x, RealPoint2.y);
        }
        gl2d.stroke();
    }

    this.drawTestMode = function() {
        gl2d.font = FONT_DEFAULT_COPY;
        gl2d.fillStyle = STYLE_HIGHLIGHT;
        gl2d.strokeStyle = STYLE_HIGHLIGHT;
        // 绘制测试模式
        if (g_nEventVersion >=2) {
            var strCoyy = g_strCopy.substring(5, g_strCopy.length);
            gl2d.fillText(strCoyy, 5, this.windowHeight - 5);
        }
    }

    this.drawUsrAnnotation = function() {
        if (this.m_arrUsrComment.length == 0) {
            return;
        }

        gl2d.strokeStyle = STYLE_WHITE;
        gl2d.font = FONT_DEFAULT_ANNOT;

        let curComment = null;
        let attachPt = null;
        let leaderPt = null;
        for (let i = 0; i < this.m_arrUsrComment.length; ++i) {
            if (this.m_arrIsUsrCommentDel[i]) {
                continue;
            }
            curComment = this.m_arrUsrComment[i];
            for (let j = 0; j < curComment.stuAnnot.pNote.arrLeaderPos.length; ++j) {
                leaderPt = curComment.stuAnnot.pNote.arrLeaderPos[j];
                objectIndex = curComment.stuAnnot.pNote.arrObjectIndexs[j];
                attachPt = curComment.stuAnnot.annoPlaneLocal;
                mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.getObjectModelMatrix(objectIndex));
                this.cvtWorldToScreen(leaderPt.x, leaderPt.y, leaderPt.z, this.MVPMatrix, this.RealPoint1);
                this.adapterLocalToScreen(attachPt.x, attachPt.y, this.RealPoint2);
                
                if (this.isDrawLeaderPos) {
                    this.drawFillCircle(this.RealPoint1.x, this.RealPoint1.y, DOT_RIDUS);
                    this.drawLine(this.RealPoint1.x, this.RealPoint1.y, this.RealPoint2.x, this.RealPoint2.y);
                }
            }
        }
    }

    this.drawDuringUsrAnnoation = function(newComment, screenX, screenY) {
        if (newComment == null || newComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return;
        }

        gl2d.strokeStyle = STYLE_WHITE;
        for (let j = 0; j < newComment.stuAnnot.pNote.arrLeaderPos.length; ++j) {
            leaderPt = newComment.stuAnnot.pNote.arrLeaderPos[j];
            objectIndex = newComment.stuAnnot.pNote.arrObjectIndexs[j];
            mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.getObjectModelMatrix(objectIndex));
            this.cvtWorldToScreen(leaderPt.x, leaderPt.y, leaderPt.z, this.MVPMatrix, this.RealPoint1);
            
            if (this.isDrawLeaderPos) {
                this.drawFillCircle(this.RealPoint1.x, this.RealPoint1.y, DOT_RIDUS);
                this.drawLine(this.RealPoint1.x, this.RealPoint1.y, screenX, screenY);
            }
        }
    }

    this.drawFillCircle = function(x, y, r) {
        gl2d.beginPath();
        gl2d.arc(x, y, r, 0, Math.PI * 2, true);
        gl2d.closePath();
        gl2d.fillStyle = STYLE_WHITE;
        gl2d.fill();
    }

    this.drawLine = function(start_x, start_y, end_x, end_y) {
        gl2d.beginPath();
        gl2d.moveTo(start_x, start_y);
        gl2d.lineTo(end_x, end_y);
        gl2d.stroke();
    }

    this.drawFillRect = function(rect2D) {
        gl2d.beginPath();
        gl2d.fillStyle = FILL_STYLE_SELE_RECT;
        gl2d.fillRect(rect2D.min.x, rect2D.min.y, rect2D.max.x - rect2D.min.x, rect2D.max.y - rect2D.min.y);
    }

    /**
     * 生成注释拾取标识数组
     */
     this.setPickAnnotIndexs = function() {
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            this.m_arrPickAnnotIndexs.push(false);
        }
    }

    /**
     * 生成SCLE批注UI
     */
    this.setAnnotUI = function() {
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            let curComment = g_GLAnnoSet._arrComment[i];
            var newCommentNode = new GL_USRANNOTATION();
            let point2d = new Point2(0, 0);
            this.adapterLocalToScreen(curComment.stuAnnot.annoPlaneLocal.x, curComment.stuAnnot.annoPlaneLocal.y, point2d);
            newCommentNode.copyFromScle(curComment, point2d, this.m_arrAnnotVisiable[i]);
            newCommentNode._attachPt.set(curComment.stuAnnot.annoPlaneLocal.x, curComment.stuAnnot.annoPlaneLocal.y);
            g_usrCommOption.data.push(newCommentNode);
        }
        callback_v2.showCommentInput(g_usrCommOption);
    }

    /**
     * 注释拾取
     */
     this.pickAnnotationByIndex = function(index, isMult) {
        if (index < -1 || index >= g_GLAnnoSet._arrComment.length) {
            return;
        }
        if (index > -1) {
            if (!isMult) {
                this.GL_PICKSTATUSANNO = 1;
                for (let i = 0; i < this.m_arrPickAnnotIndexs.length; i++) {
                    this.m_arrPickAnnotIndexs[i] = false;
                }
            } else {
                this.GL_PICKSTATUSANNO = 2;
            }
            this.m_arrPickAnnotIndexs[index] = true;
        } else {
            for (let i = 0; i < this.m_arrPickAnnotIndexs.length; i++) {
                this.m_arrPickAnnotIndexs[i] = false;
            }
            this.GL_PICKSTATUSANNO = 0;
        }
    }
    this.pickAnnotationMultByIndex = function(indexs) {
        let isAllNull = true;
        for (let i = 0; i < this.m_arrPickAnnotIndexs.length; i++) {
            this.m_arrPickAnnotIndexs[i] = false;
        }
        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] >= g_GLAnnoSet._arrComment.length) {
                continue;
            }
            this.m_arrPickAnnotIndexs[indexs[i]] = true;
            isAllNull = false;
        }
        if (isAllNull) {
            this.GL_PICKSTATUSANNO = 0;
            return -1;
        }
        if (indexs.length == 1) {
            this.GL_PICKSTATUSANNO = 1;
            return indexs[0];
        } else {
            this.GL_PICKSTATUSANNO = 2;
            return -1;
        }
    }
    this.pickAnnotationByRay = function(x, y, isMult) {
        // console.log(x + " " + y);
        let index = -1;
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            // 判断是否隐藏
            if (!this.m_arrAnnotVisiable[i]) {
                continue;
            }
            // 文字矩形区域求交
            if ((x>this.m_arrAnnotRect[i].min.x && x<this.m_arrAnnotRect[i].max.x) &&
                (y<this.m_arrAnnotRect[i].min.y && y>this.m_arrAnnotRect[i].max.y)) {
                index = i;
                break;
            }
        }
        this.pickAnnotationByIndex(index, isMult);
        return index;
    }

    /**
     * 设置所有注释的显隐性
     */
     this.setAnnotVisible = function() {
        if (this.m_arrAnnotVisiable.length == 0) {
            for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
                // 判断当前帧是否显示
                if (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0) {
                    this.m_arrAnnotVisiable.push(true);
                } else {
                    this.m_arrAnnotVisiable.push(false);
                }
            }
        } else {
            for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
                if (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0) {
                    this.m_arrAnnotVisiable[i] = true;
                } else {
                    this.m_arrAnnotVisiable[i] = false;
                }
            }
        }
    }
    this.setAnnotVisibleMult = function(bVisible) {
        for (let i = 0; i < this.m_arrPickAnnotIndexs.length; i++) {
            if (this.m_arrPickAnnotIndexs[i]) {
                this.m_arrAnnotVisiable[i] = bVisible;
            }
        }
    }
    this.getAnnotVisible = function(nAnnoIndex) {
        if (nAnnoIndex < 0 || nAnnoIndex >= g_GLAnnoSet._arrComment.length) {
            return false;
        }
        return this.m_arrAnnotVisiable[nAnnoIndex];
    }
    this.setAnnotVisibleByIndexs = function(indexs, bVisible) {
        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i] < 0 || indexs[i] > g_GLAnnoSet._arrComment.length) {
                continue;
            }
            this.m_arrAnnotVisiable[indexs[i]] = bVisible;
        }
    }

    /**
     * 设置所有注释的矩形区域
     */
    this.setAnnotRect = function() {
        let hasAnnotRect = this.m_arrAnnotRect.length > 0 ? true : false;
        let rect = null;
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            rect = this.calAnnotRect(g_GLAnnoSet._arrComment[i].stuAnnot);

            if (hasAnnotRect) {
                this.m_arrAnnotRect[i].set(rect.min.x, rect.min.y, rect.max.x, rect.max.y);
            } else {
                this.m_arrAnnotRect.push(rect);
            }
        }
    }

    /**
     * 计算注释信息矩形区
     */
    this.calAnnotRect = function(annotation) {
        // 计算文字总长度，总高度，默认绘制一行
        this.annotTextLength = 0;
        let textLen = 0;
        for (let i = 0; i < annotation.pNote.strText.length; i++) {
            textLen = GetStringLength(annotation.pNote.strText[i]);
            if (textLen > this.annotTextLength) {
                this.annotTextLength = textLen;
            }
        }
        this.annotTextRows = annotation.pNote.strText.length;
        this.annotTextLength = this.annotTextLength * this.annotTextFont / 2;
        this.annotTextHeight = this.annotTextFont * this.annotTextRows + this.annotPropTextLineHeight * (this.annotTextRows - 1);
        // 计算注释的文字底线方向
        this.adapterLocalToScreen(annotation.annoPlaneLocal.x, annotation.annoPlaneLocal.y, this.RealPoint2);
        // 默认向右，如果超过右界，则向左
        this.isOutWindow = false;
        if (this.RealPoint2.x + this.annotTextLength > this.windowWidth) {
            this.isOutWindow = true;
            this.annotDire = -1;
        } else if (this.RealPoint2.x - this.annotTextLength < 0) {
            this.isOutWindow = true;
            this.annotDire = 1;
        }
        // 只有没有查过界限的情况下，才按照引线方位做进一步计算
        if (!this.isOutWindow) {
            mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.modelMatrix);
            this.annotDire = -1;
            for (let j=0; j<annotation.pNote.arrLeaderPos.length; j++) {
                this.cvtWorldToScreen(annotation.pNote.arrLeaderPos[j].x + annotation.annoPlaneLocal.x,
                    annotation.pNote.arrLeaderPos[j].y + annotation.annoPlaneLocal.y,
                    annotation.pNote.arrLeaderPos[j].z, this.MVPMatrix, this.RealPoint1);
                // 判断引线方向
                if (this.RealPoint1.x < this.RealPoint2.x) {
                    this.annotDire = 1;
                    break;
                }
            }
        }
        // 计算所有注释的矩形区域
        if (this.annotDire == 1) {
            // 底线在右侧
            this.RealPoint1.x = this.RealPoint2.x;
            this.RealPoint1.y = this.RealPoint2.y;
            this.RealPoint2.x = this.RealPoint1.x + this.annotTextLength;
            this.RealPoint2.y = this.RealPoint1.y - this.annotTextHeight;
        } else {
            this.RealPoint1.x = this.RealPoint2.x - this.annotTextLength;
            this.RealPoint1.y = this.RealPoint2.y;
            this.RealPoint2.y = this.RealPoint1.y - this.annotTextHeight;
        }

        return new Rect2D(this.RealPoint1.x, this.RealPoint1.y, this.RealPoint2.x, this.RealPoint2.y);
    }

    /**
     * 计算注释数据显隐性
     */
     this.setAnnotationAnim = function(uStartFrame) {
        let isUIChanged = false;
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            if (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0 &&
                g_GLAnnoSet._arrComment[i].stuProperty._uFrameSize <= 1) {
                this.m_arrAnnotVisiable[i] = true;
            } else if (uStartFrame >= g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID &&
                      uStartFrame < (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID
                      + g_GLAnnoSet._arrComment[i].stuProperty._uFrameSize)){
                this.m_arrAnnotVisiable[i] = true;
                if (!g_usrCommOption.data[i].show) {
                    g_usrCommOption.data[i].show = true;
                    isUIChanged = true;
                }
            } else {
                this.m_arrAnnotVisiable[i] = false;
                if (g_usrCommOption.data[i].show) {
                    g_usrCommOption.data[i].show = false;
                    isUIChanged = true;
                }
            }
        }
        if (isUIChanged) {
            callback_v2.showCommentInput(g_usrCommOption);
        }
    }

    /**
     * 用户新增自定义注释数据
     */
    this.addComment = function(camera, comment) {
        g_GLAnnoSet._arrComment.push(comment);
        this.m_arrAnnotRect.push(this.calAnnotRect(camera, comment.stuAnnot));
        this.m_arrAnnotVisiable.push(true);
    }

    this.addUsrComment = function(newComment, isXml) {
        if (newComment == null || newComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return false;
        }

        newComment.stuAnnot.uID = this.commentId++;
        this.m_arrUsrComment.push(newComment);
        this.m_arrIsUsrCommentDel.push(false);
        return true;
    }

    this.updateUsrComment = function(oldComment, index) {
        if (index < 0 || index >= this.m_arrUsrComment.length) {
            return;
        }
        // 只允许更新文本和时间
        this.m_arrUsrComment[index].stuAnnot.pNote.strText = oldComment._uAnnotText;
        this.m_arrUsrComment[index].stuProperty._strDateTime = oldComment._strCreateTime;
    }

    this.deleteUsrComment = function(index) {
        if (index < 0 || index >= this.m_arrUsrComment.length) {
            return;
        }
        this.m_arrUsrComment[index] = null;
        this.m_arrIsUsrCommentDel[index] = true;
    }

    this.cvtWorldToScreen = function(wldPos_x, wldPos_y, wldPos_z, transMat, screenPt) {
        CalTranslatePoint(wldPos_x, wldPos_y, wldPos_z, transMat, this.RealPoint1);
        // 如果坐标在摄像机剪裁面之外
        if (this.RealPoint1.z < 0.0 || this.RealPoint1.z > 1.0) {
            this.isDrawLeaderPos = false;
        } else {
            screenPt.x = (this.RealPoint1.x + 1.0) * this.windowWidth / 2;
            screenPt.y = (1.0 - this.RealPoint1.y) * this.windowHeight / 2;
            this.isDrawLeaderPos = true;
        }
    }

    this.adapterLocalToScreen = function(local_x, local_y, screenPt) {
        let tmp_x = local_x + this.windowWidth/this.windowHeight;
        screenPt.x = tmp_x * this.windowHeight / 2;
        if (screenPt.x < 0) {
            screenPt.x = 0;
        }
        if (screenPt.x > this.windowWidth) {
            screenPt.x = this.windowWidth;
        }
        screenPt.y = this.windowHeight - (local_y + 1.0) * this.windowHeight / 2;
    }

    this.adapterScreenToLocal = function(screen_x, screen_y, local) {
        local.x = (screen_x * 2 / this.windowHeight) - this.windowWidth / this.windowHeight;
        local.y = (this.windowHeight - screen_y) * 2 / this.windowHeight - 1.0;
    }

}