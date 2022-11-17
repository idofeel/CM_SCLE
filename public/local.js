;(function () {
	var ScleView = window.CMOnlineUI;

	window.addEventListener('scleViewOnload', function () {
		ScleView = window.CMOnlineUI;
	})


	var $el = function (id) {
		return document.getElementById(id);
	};
	var scleFile = $el('scleFile');
	var scleXMLFile = $el('scleXMLFile');
	var sceneNode = $el('sceneNode');
	var partList = $el('partList');
	var notationNode = $el('notationNode');

	// 读取SCLE 文件
	scleFile.onchange = function (e) {
		document.getElementsByClassName('ant-btn')[0].blur();
		if (!e.target.files[0]) return;
		// 打开本地scle文件
		console.log('window.CMOnlineUI',window.CMOnlineUI, ScleView);
		window.CMOnlineUI.loadLocalFile(e.target);
		this.value = '';
	};

	function createSceneNodes(optNode) {
		// 增加场景事件
		if (optNode && optNode.length) {
			sceneNode.innerHTML = '<option>请选择</option>';
			for (var i = 0; i < optNode.length; i++) {
				var opt = document.createElement('option');
				opt.innerText = optNode[i].Name;
				opt.attrData = optNode[i];
				sceneNode.appendChild(opt);
			}

			var reset = document.createElement('option');
			reset.innerText = '复原';
			sceneNode.appendChild(reset);
		}
	}

	function createPartListNodes(partData) {
		// 渲染part数据
		partList.innerHTML = '';
		for (var j = 0; j < partData.length; j++) {
			// 创建行
			var tr = document.createElement('tr');
			tr.attrData = partData[j];

			// 创建序号
			var order = document.createElement('td');
			order.innerText = j;
			tr.appendChild(order);
			// 创建名称
			var name = document.createElement('td');
			name.innerText = partData[j].Name;
			tr.appendChild(name);
			// 创建数量
			var count = document.createElement('td');
			count.innerText = partData[j].Count;
			tr.appendChild(count);

			tr.onclick = function () {
				if (!window.g_GLData) return;
				const data = this.attrData.objID.split(';');
				window.setObjectsHighlight(data);

				/**
				 *
				 * @parma type  String  default | lead | table
				 * setTips(objectId, type)
				 */

				ScleView.setTips({
					objID: this.attrData.objID.split(';'), // 批注id
					content: this.attrData.Name, // 批注内容 default | lead 时有效
					type: notationNode.value, // 控制批注显示样式  default | lead | table
					columns: [
						// 批注表头
						{
							title: '序号',
							dataIndex: 'index',
							key: 'index',
							width: 60,
							align: 'center',
						},
						{
							title: '名称',
							dataIndex: 'Name',
							key: 'Name',
							ellipsis: true,
							align: 'center',
						},
						{
							title: '数量',
							dataIndex: 'Count',
							key: 'Count',
							width: 60,
							align: 'center',
						},
					],
					dataSource: [
						// 批注表格数据
						{
							index: 1,
							Name: this.attrData.Name,
							Count: this.attrData.Count,
						},
						{
							index: 2,
							Name: this.attrData.Name,
							Count: this.attrData.Count,
						},
					],
					tableStyle: {
						// 批注表格样式大小及位置
						left: 0,
						bottom: 0,
						width: 300,
						margin: 20,
						'z-index': 1002,
					},

					size: 'small',
					tableLayout: 'fixed',
					ellipsis: true,
					pagination: false, // 是否启用分页器
				});
			};
			// 渲染行
			partList.appendChild(tr);
		}
	}

	function createScleInfo(data) {
		try {
			createSceneNodes(data.Scene.Node);
		} catch (error) {
			console.log('未获取到场景信息');
		}
		try {
			createPartListNodes(data.PartList.Part);
		} catch (error) {
			console.log('未获取到列表数据');
		}
	}

	// 读取XML 文件
	scleXMLFile.onchange = function (e) {
		document.getElementsByClassName('ant-btn')[1].blur();
		if (!e.target.files[0]) return;
		// 读取本地xml文件
		var reader = new FileReader();
		reader.readAsText(e.target.files[0]);
		reader.onloadend = function () {
			var data = xml2json(this.result).Root;
			createScleInfo(data);
		};
		this.value = '';
	};

	notationNode.onchange = function (e) {
		ScleView.refreshNotation({
			type: e.target.value,
		});
	};

	// 场景事件发生变化
	sceneNode.onchange = function (e) {
		// const event = document.createEvent('CustomEvent')
		// event.initCustomEvent('stopAnimation', true, true, {})
		// window.dispatchEvent(event)
		var el = e.target;
		var data = el[el.selectedIndex].attrData;
		if (!window.g_GLData || !data) {
			window.animTerminal();
			// 切换
			ScleView.toggleTools(true);
			return;
		}
		window.g_nAnimationStart = data.Start * 1;
		window.g_nAnimationEnd = data.End * 1;
		window.animTerminal();
		window.PlaySceneAnimation();
		ScleView.toggleTools(false);
	};
	// window.addEventListener('playerStop', () => {
	// 	console.log(
	// 		'🚀 ~ file: local.js ~ line 89 ~ window.addEventListener ~ sceneNode',
	// 		sceneNode
	// 	)
	// })

	window.addEventListener(
		'pickParams',
		function () {
			ScleView.setTips({
				objID: window.pickObjectID && [window.pickObjectID], // 批注id
				content: window.pickObjectName, // 批注内容 default | lead 时有效
				type: notationNode.value, // 控制批注显示样式  default | lead | table
				columns: [
					// 批注表头
					{
						title: '序号',
						dataIndex: 'index',
						key: 'index',
						width: 60,
						align: 'center',
					},
					{
						title: '名称',
						dataIndex: 'Name',
						key: 'Name',
						ellipsis: true,
						align: 'center',
					},
					{
						title: '数量',
						dataIndex: 'Count',
						key: 'Count',
						width: 60,
						align: 'center',
					},
				],
				dataSource: [
					// 批注表格数据
					{
						index: 1,
						Name: window.pickObjectName,
						Count: 1,
					},
					// {
					// 	index: 2,
					// 	Name: this.attrData.Name,
					// 	Count: this.attrData.Count,
					// },
				],
				tableStyle: {
					// 批注表格样式大小及位置
					left: 0,
					bottom: 0,
					width: 300,
					margin: 20,
					'z-index': 1002,
				},

				size: 'small',
				tableLayout: 'fixed',
				ellipsis: true,
				pagination: false, // 是否启用分页器
			});
		},
		{ passive: false }
	);
})();

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
