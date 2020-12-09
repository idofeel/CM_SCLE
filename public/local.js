;(function () {
	var ScleView = window.Scle

	var $el = function (id) {
		return document.getElementById(id)
	}
	var scleFile = $el('scleFile')
	var scleXMLFile = $el('scleXMLFile')
	var sceneNode = $el('sceneNode')
    var partList = $el('partList')
    // 读取SCLE 文件
	scleFile.onchange = function (e) {
		if (!e.target.files[0]) return
		// 打开本地scle文件
		ScleView.loadLocalFile(e.target)
    }
    // 读取XML 文件
	scleXMLFile.onchange = function (e) {
		if (!e.target.files[0]) return
		// 读取本地xml文件
		var reader = new FileReader()
		reader.readAsText(e.target.files[0])
		reader.onloadend = function () {
            
            var data = xml2json(this.result).Root
            
            // 增加场景事件
			sceneNode.innerHTML = '<option>请选择</option>'
			var optNode = data.Scene.Node
			var partData = data.PartList.Part
			for (var i = 0; i < optNode.length; i++) {
				var opt = document.createElement('option')
				opt.innerText = optNode[i].Name
				opt.attrData = optNode[i]
				sceneNode.appendChild(opt)
			}

            // 渲染part数据
			partList.innerHTML = ''
			for (var j = 0; j < partData.length; j++) {
                // 创建行
				var tr = document.createElement('tr')
                tr.attrData = partData[j]

                // 创建序号
				var order = document.createElement('td')
				order.innerText = j
				tr.appendChild(order)
                // 创建名称
				var name = document.createElement('td')
				name.innerText = partData[j].Name
				tr.appendChild(name)
                // 创建数量
				var count = document.createElement('td')
				count.innerText = partData[j].Count
                tr.appendChild(count)

                // 渲染行
				partList.appendChild(tr)
			}
		}
	}
    // 场景事件发生变化
	sceneNode.onchange = function (e) {
		var el = e.target
		var data = el[el.selectedIndex].attrData
		if (!window.g_GLData || !data) {
			window.animPause()
			window.animTerminal()
			return
		}
		window.g_nAnimationStart = data.Start * 1
        window.g_nAnimationEnd = data.End * 1
		window.animTerminal()
		window.PlaySceneAnimation()
	}
})()

//
function getXMLDOM(xmlStr) {
	var xmlDoc = null
	if (window.ActiveXObject) {
		xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
		if (xmlDoc) {
			xmlDoc.async = false
			xmlDoc.loadXML(xmlStr)
		}
	} else if (
		document.implementation &&
		document.implementation.createDocument &&
		DOMParser
	) {
		xmlDoc = document.implementation.createDocument('', '', null)
		var parser = new DOMParser()
		xmlDoc = parser.parseFromString(xmlStr, 'text/xml')
	}
	return xmlDoc
}
function xmlToJson(xml) {
	var obj = {}
	if (xml.nodeType == 1) {
		if (xml.attributes.length > 0) {
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j)
				obj[attribute.nodeName] = attribute.nodeValue
			}
		}
	} else if (xml.nodeType == 3 || xml.nodeType == 4) {
		obj = xml.nodeValue
	}
	if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i)
			var nodeName = item.nodeName
			if (typeof obj[nodeName] == 'undefined') {
				if (typeof item.nodeValue === 'string') {
					item.nodeType === 4 && (nodeName = '$cdata')
					item.nodeValue.replace(/\s/g, '') !== '' &&
						(obj[nodeName] = xmlToJson(item))
				} else {
					obj[nodeName] = xmlToJson(item)
				}
			} else {
				if (typeof obj[nodeName].length == 'undefined') {
					var old = obj[nodeName]
					obj[nodeName] = []
					obj[nodeName].push(old)
				}
				obj[nodeName] instanceof Array &&
					obj[nodeName].push(xmlToJson(item))
			}
		}
	}
	return obj
}
function xml2json(xml) {
	return xmlToJson(getXMLDOM(xml))
}
