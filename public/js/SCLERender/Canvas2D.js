// File: WebGL.js

/**
 * @author wujiali
 */
 
//===================================================================================================

const FONT_DEFAULT_ANNOT = "20px 微软雅黑";
const FONT_DEFAULT_PROPE = "10px 微软雅黑";
const FILL_STYLE_DEFAULT = "#000000";
const FILL_STYLE_HIGHLIGHT = "#ff0000";
const FILL_STYLE_PROPE_RECT = "#fff8dc";
const STROKE_SRTLE_DEFAULT = "#000000";
const STROKE_SRTLE_HIGHLIGHT = "#ff0000";
const STROKE_SRTLE_WHITE = "#ffffff";
const FONT_DEFAULT_COPY = "14px 微软雅黑";

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

    this.commentId = 1000000;
    this.m_arrUsrComment = new Array();
    this.m_arrIsUsrCommentDel = new Array();

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
        if (g_GLAnnoSet != null || g_GLAnnoSet._arrComment.length > 0) {
            this.setAnnotVisible();
            this.setPickAnnotIndexs();
            this.setAnnotRect();
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
        // Clear the 2D canvas
        gl2d.clearRect(0, 0, gl2d.canvas.width, gl2d.canvas.height);
        mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.modelMatrix);
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            // 判断显隐性
            if (!this.m_arrAnnotVisiable[i]) {
                continue;
            }
            // 判断是否被拾取
            if (this.m_arrPickAnnotIndexs[i]) {
                gl2d.font = FONT_DEFAULT_ANNOT;
                gl2d.fillStyle = FILL_STYLE_HIGHLIGHT;
                gl2d.strokeStyle = STROKE_SRTLE_HIGHLIGHT;
            } else {
                gl2d.font = FONT_DEFAULT_ANNOT;
                gl2d.fillStyle = FILL_STYLE_DEFAULT;
                gl2d.strokeStyle = STROKE_SRTLE_DEFAULT;
            }

            // 绘制注释数据
            this.drawAnnoData(this.m_arrAnnotRect[i], g_GLAnnoSet._arrComment[i].stuAnnot);

            // 判断是否被拾取，绘制注释属性信息
            if (this.m_arrPickAnnotIndexs[i]) {
                this.drawAnnoProperty(this.m_arrAnnotRect[i], g_GLAnnoSet._arrComment[i].stuProperty);
            }
        }
    }

    this.cvtWorldToScreen = function(wldPos_x, wldPos_y, wldPos_z, transMat, screenPt) {
        CalTranslatePoint(wldPos_x, wldPos_y, wldPos_z, transMat, this.RealPoint1);
        screenPt.x = (this.RealPoint1.x + 1.0) * this.windowWidth / 2;
        screenPt.y = (1.0 - this.RealPoint1.y) * this.windowHeight / 2;
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

    this.drawAnnoData = function(annoRect, annotation) {
        // 计算引线位置
        gl2d.beginPath();
        this.adapterLocalToScreen(annotation.annoPlaneLocal.x, annotation.annoPlaneLocal.y, this.RealPoint2);
        for (let j=0; j<annotation.pNote.arrLeaderPos.length; j++) {
            this.cvtWorldToScreen(annotation.pNote.arrLeaderPos[j].x + annotation.annoPlaneLocal.x,
                annotation.pNote.arrLeaderPos[j].y + annotation.annoPlaneLocal.y,
                annotation.pNote.arrLeaderPos[j].z, this.MVPMatrix, this.RealPoint1);
            // 绘制引线
            gl2d.moveTo(this.RealPoint1.x, this.RealPoint1.y);
            gl2d.lineTo(this.RealPoint2.x, this.RealPoint2.y);
        }
        // 绘制文字
        this.RealPoint2.x = annoRect.min.x;
        this.RealPoint2.y = annoRect.max.y + this.annotTextFont;
        for (let j = 0; j < this.annotTextRows; j++) {
            gl2d.fillText(annotation.pNote.strText[j], this.RealPoint2.x, this.RealPoint2.y);
            this.RealPoint2.y += this.annotTextFont + this.annotPropTextLineHeight;
        }
        // 绘制底线
        gl2d.moveTo(annoRect.min.x, annoRect.min.y);
        gl2d.lineTo(annoRect.max.x, annoRect.min.y);
        gl2d.stroke();
    }

    this.drawAnnoProperty = function(annoRect, property) {
        this.RealPoint3.x = annoRect.max.x;
        this.RealPoint3.y = annoRect.min.y;
        if (this.RealPoint3.x + this.annotPropRectWidth > this.windowWidth) {
            // 超过了右界，文本框在左侧
            this.RealPoint3.x = annoRect.min.x - this.annotPropRectWidth - this.annotPropGap * 2;
        } else {
            // 没有超过右界，文本框在右侧
            this.RealPoint3.x += this.annotPropGap;
        }
        this.RealPoint3.y -= this.annotTextFont/2 + this.annotPropRectHeight/2;

        // 绘制文本矩形
        gl2d.fillStyle = FILL_STYLE_PROPE_RECT;
        gl2d.fillRect(this.RealPoint3.x, this.RealPoint3.y, this.annotPropRectWidth, this.annotPropRectHeight);
        gl2d.font = FONT_DEFAULT_PROPE;
        // 绘制文本信息
        gl2d.fillStyle = FILL_STYLE_DEFAULT;
        this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight;
        gl2d.fillText(property._strUserName, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
        this.RealPoint3.y += this.annotPropTextFont + this.annotPropTextLineHeight;
        gl2d.fillText(property._strDateTime, this.RealPoint3.x + this.annotPropGap, this.RealPoint3.y);
    }

    this.drawTestMode = function() {
        gl2d.font = FONT_DEFAULT_COPY;
        gl2d.fillStyle = FILL_STYLE_HIGHLIGHT;
        gl2d.strokeStyle = STROKE_SRTLE_HIGHLIGHT;
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

        gl2d.strokeStyle = STROKE_SRTLE_WHITE;
        gl2d.font = FONT_DEFAULT_ANNOT;
        gl2d.fillStyle = FILL_STYLE_DEFAULT;

        gl2d.beginPath();
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
                
                gl2d.moveTo(this.RealPoint1.x, this.RealPoint1.y);
                gl2d.arc(this.RealPoint1.x, this.RealPoint1.y, 5, 0, Math.PI * 2, false);
                gl2d.lineTo(this.RealPoint2.x, this.RealPoint2.y);
            }

            gl2d.fillText(curComment.stuAnnot.pNote.strText, this.RealPoint2.x, this.RealPoint2.y);
        }
        gl2d.stroke();
    }

    this.drawDuringUsrAnnoation = function(newComment, screenX, screenY) {
        if (newComment == null || newComment.stuAnnot.pNote.arrLeaderPos.length == 0) {
            return;
        }

        gl2d.beginPath();
        gl2d.strokeStyle = STROKE_SRTLE_WHITE;
        for (let j = 0; j < newComment.stuAnnot.pNote.arrLeaderPos.length; ++j) {
            leaderPt = newComment.stuAnnot.pNote.arrLeaderPos[j];
            objectIndex = newComment.stuAnnot.pNote.arrObjectIndexs[j];
            mat4.multiply(this.MVPMatrix, g_webgl.PVMattrix, g_glprogram.getObjectModelMatrix(objectIndex));
            this.cvtWorldToScreen(leaderPt.x, leaderPt.y, leaderPt.z, this.MVPMatrix, this.RealPoint1);
            
            gl2d.moveTo(this.RealPoint1.x, this.RealPoint1.y);
            gl2d.arc(this.RealPoint1.x, this.RealPoint1.y, 5, 0, Math.PI * 2, false);
            gl2d.lineTo(screenX, screenY);
        }
        gl2d.stroke();
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
        for (let i = 0; i < g_GLAnnoSet._arrComment.length; i++) {
            if (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID == 0 &&
                g_GLAnnoSet._arrComment[i].stuProperty._uFrameSize <= 1) {
                this.m_arrAnnotVisiable[i] = true;
            } else if (uStartFrame >= g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID &&
                      uStartFrame < (g_GLAnnoSet._arrComment[i].stuProperty._uStartFrameID
                      + g_GLAnnoSet._arrComment[i].stuProperty._uFrameSize)){
                this.m_arrAnnotVisiable[i] = true;
            } else {
                this.m_arrAnnotVisiable[i] = false;
            }
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
        } else {
            if (!isXml) {
                newComment.stuAnnot.uID = this.commentId++;
            }
            this.m_arrUsrComment.push(newComment);
            this.m_arrIsUsrCommentDel.push(false);
            return true;
        }
    }

    this.deleteUsrComment = function(index) {
        if (index < 0 || index >= this.m_arrUsrComment.length) {
            return;
        }
        this.m_arrIsUsrCommentDel[index] = true;
    }

}