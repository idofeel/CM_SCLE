webpackJsonp([0],{"5DwM":function(t,e){},HplY:function(t,e){},KVxe:function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});n("dich"),n("Qa/u");var i=n("/5sW"),o=n("Itbb"),a=n.n(o),r={init:function(){},showCommentInput:function(){},commentOnSubmit:function(t,e,n,i){},commentOnChange:function(t,e,n,i){},refreshNotation:function(){},commentOnClick:function(){},deleteCommentInput:function(){},moveCommentInput:function(){}};window.CMOnlineUI=r;var s=r,l=void 0,u="\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n",c=["letter-spacing","line-height","padding-top","padding-bottom","font-family","font-weight","font-size","text-rendering","text-transform","width","text-indent","padding-left","padding-right","border-width","box-sizing"];function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;l||(l=document.createElement("textarea"),document.body.appendChild(l));var i=function(t){var e=window.getComputedStyle(t),n=e.getPropertyValue("box-sizing"),i=parseFloat(e.getPropertyValue("padding-bottom"))+parseFloat(e.getPropertyValue("padding-top")),o=parseFloat(e.getPropertyValue("border-bottom-width"))+parseFloat(e.getPropertyValue("border-top-width"));return{contextStyle:c.map(function(t){return t+":"+e.getPropertyValue(t)}).join(";"),paddingSize:i,borderSize:o,boxSizing:n}}(t),o=i.paddingSize,a=i.borderSize,r=i.boxSizing,s=i.contextStyle;l.setAttribute("style",s+";"+u),l.value=t.value||t.placeholder||"";var d=l.scrollHeight,p={};"border-box"===r?d+=a:"content-box"===r&&(d-=o),l.value="";var h=l.scrollHeight-o;if(null!==e){var f=h*e;"border-box"===r&&(f=f+o+a),d=Math.max(f,d),p.minHeight=f+"px"}if(null!==n){var m=h*n;"border-box"===r&&(m=m+o+a),d=Math.min(m,d)}return p.height=d+"px",l.parentNode&&l.parentNode.removeChild(l),l=null,p}var p={props:{value:{type:String,default:""},disabled:{type:Boolean,default:!1},index:{type:Number,default:null},item:{type:Object,default:{}}},data:function(){return{height:"26px"}},watch:{value:function(){this.getHeight()}},mounted:function(){this.focus()},methods:{getHeight:function(){this.height=d(this.$refs.textarea,1,3).height},doChange:function(t){this.$emit("update:value",t.target.value)},inputChange:function(t){this.$emit("onChange",t,this.item,this.index)},submit:function(t){this.$emit("update:disabled",!this.disabled),this.$emit("onSubmit",t,this.item,this.index)},showIpunt:function(){this.$emit("update:disabled",!1),this.focus()},onMouseover:function(t){this.$emit("onMouseover")},onMouseleave:function(t){this.$emit("onMouseleave")},focus:function(){var t=this;this.$nextTick(function(e){t.$refs.textarea.focus();try{var n=t.$refs.textarea,i=n.createTextRange();i.moveStart("character",n.value.length),i.collapse(!0),i.select()}catch(t){}t.getHeight()})}}},h={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"input_comments",class:{input_box:"input"===t.item.type},on:{dblclick:t.showIpunt}},[n("div",{staticClass:"auto-textarea",on:{mouseover:function(e){return t.onMouseover(e,t.item,t.index)},mouseleave:function(e){return t.onMouseleave(e,t.item,t.index)}}},[n("textarea",{ref:"textarea",staticClass:"textarea",class:{radius:t.disabled},style:{height:t.height,width:t.item.style.width},attrs:{disabled:t.disabled},domProps:{value:t.value},on:{input:t.doChange,change:t.inputChange}})]),t._v(" "),t.disabled?t._e():n("button",{style:{height:t.height},on:{click:function(e){return e.stopPropagation(),t.submit.apply(null,arguments)}}},[n("svg",{staticClass:"icon",attrs:{t:"1623808337640",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"1209"}},[n("path",{attrs:{d:"M384.044 759.713l486.49-486.49c17.573-17.573 46.065-17.573 63.639 0 17.573 17.575 17.573 46.067 0 63.64l-550.13 550.13L89.18 592.129c-17.573-17.574-17.573-46.066 0-63.64 17.574-17.573 46.066-17.573 63.64 0l231.224 231.224z","p-id":"1210",fill:"#707070"}})])])])},staticRenderFns:[]};var f=n("VU/8")(p,h,!1,function(t){n("HplY")},"data-v-1c26e7f3",null).exports,m={name:"App",components:{Popper:a.a,autoTextarea:f},data:function(){return{count:1,edit:!0,options:{data:[],show:!0},trigger:"clickToOpen",recode:"",value:"",height:"25px",selectIndex:null,clickItemFlag:!1}},mounted:function(){var t=this;s.showCommentInput=this.showCommentInput,document.addEventListener("click",function(){if(!0===t.clickItemFlag)return t.clickItemFlag=!1;t.selectIndex=null})},methods:{getStyle:function(t){return console.log(t),"top:"+(t.style.top+25)+"px;left:"+t.style.left+"px;width:"+t.style.width+"px;"},showCommentInput:function(t){console.log(t),t.data.forEach(function(t){return t.value="string"==typeof t.value?t.value:t.value[0],t}),this.options=t},onSubmit:function(t,e,n){s.commentOnSubmit(t,this.options,e,n)},onChange:function(t,e,n){s.commentOnChange(t,this.options,e,n)},onClick:function(t,e,n){e.disabled&&(this.selectIndex=n,s.commentOnClick(t,this.options,e,n),this.clickItemFlag=!0)},onMouseover:function(t){t.forceShow=!0,this.$forceUpdate()},onMouseleave:function(t){t.forceShow=!1,this.$forceUpdate()}}},v={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"CMOnlineUI_container"}},[t.options.show&&t.options.data.length?n("div",[t._l(t.options.data,function(e,i){return[e.show?n("div",{key:i,staticClass:"comments_box",style:Object.assign({},e.style,{top:e.style.top+25+"px",left:e.style.left+"px",width:e.style.width+"px"})},[e.disabled?n("popper",{attrs:{forceShow:e.forceShow,trigger:"hover",options:{placement:"top"},disabled:!e.disabled}},[n("div",{staticClass:"popper"},[n("p",[t._v(" 作 者： "+t._s(e._strUsrName))]),t._v(" "),n("p",[t._v(" 创建时间："+t._s(e._strCreateTime))])]),t._v(" "),n("div",{class:{cm_input:"input"!==e.type,active_item:t.selectIndex===i},attrs:{slot:"reference"},on:{dblclick:function(t){e.disabled=!e.disabled},click:function(n){return t.onClick(n,e,i)}},slot:"reference"},[n("div",{staticClass:"ellipsis"},[t._v(t._s(e.value))])])]):n("autoTextarea",{attrs:{disabled:e.disabled,value:e.value,item:e,index:i},on:{"update:disabled":function(n){return t.$set(e,"disabled",n)},"update:value":function(n){return t.$set(e,"value",n)},onSubmit:t.onSubmit,onChange:t.onChange,onMouseover:function(n){return t.onMouseover(e)},onMouseleave:function(n){return t.onMouseleave(e)}}})],1):t._e()]})],2):t._e()])},staticRenderFns:[]};var g=n("VU/8")(m,v,!1,function(t){n("KVxe"),n("5DwM")},"data-v-307c9d8d",null).exports;i.a.config.productionTip=!1,window.onload=function(){console.log("VUe CMOnlineUI_container"),new i.a({el:"#CMOnlineUI_container",render:function(t){return t(g)}})}}},["NHnr"]);