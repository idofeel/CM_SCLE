(function () {
	// UI
	let CMOnlineUIDiv = document.createElement('div');
	function CMUIFun() {

		function commentOnSubmit() {}
		function commentOnChange() {}
		function refreshNotation() {}
		function commentOnClick() {}
		function deleteCommentInput() {}
		function moveCommentInput() {}
		
		const CMUI = {
			init: init,
			showCommentInput: showCommentInput,
			commentOnSubmit: commentOnSubmit,
			commentOnChange: commentOnChange,
			refreshNotation: refreshNotation,
			commentOnClick: commentOnClick,
			deleteCommentInput: deleteCommentInput,
			moveCommentInput: moveCommentInput,
		};
		// 初始化input容器
		CMOnlineUIDiv.className = 'CMOnlineUI_container';

		CMOnlineUIDiv.cssText = 'width:100%;height:100%';
		// 初始化
		function init(contianer) {
			CMOnlineUIDiv.innerHTML = '';
			initTips(contianer);
			contianer.appendChild(CMOnlineUIDiv);
			//
		}

		const transStyle = function (styleObj) {
			return Object.keys(styleObj)
				.map(function(item){return item + ':' + styleObj[item]})
				.join(';');
		}

		// 显示输入框
		let cIndex = -1;
		function showCommentInput(options) {
			options.show = [];
			const data = options.data || [];
			let fragment = document.createDocumentFragment();

			data.forEach(function (item, index){
				if (item.show === false) return;
				// 创建容器
				const CMOnlineUI_inputBox = document.createElement('div');
				CMOnlineUI_inputBox.className = 'CMOnlineUI_input';
				const CMOnlineUI_inputBox_cssText =
					'position: absolute;display:flex;';

				// 设置样式
				const width = item.style.width;
				// item.style.width = 'auto';
				CMOnlineUI_inputBox.style.cssText =
					CMOnlineUI_inputBox_cssText + transStyle(item.style);
				item.style.width = width;

				const oDiv = document.createElement('div');
				oDiv.className = 'cm-input-box';

				const InputBox = oDiv;

				// 创建输入框
				let CMOnlineUI_input = null;
				if (!item.disabled) {
					CMOnlineUI_input = document.createElement('textarea');
					CMOnlineUI_input.value = item.value;
					CMOnlineUI_input.autofocus = true;
					autoTextarea(
						CMOnlineUI_input,
						item.style.maxHeight || 100,
						item.style.minHeight || 31,
						InputBox
					);
				} else {
					CMOnlineUI_input = document.createElement('div');
					CMOnlineUI_input.innerText = item.value;
					CMOnlineUI_input.style.height = item.style.height || 'auto';
					CMOnlineUI_input.style.maxHeight = item.style.height || 100;
					CMOnlineUI_input.style.overflow = 'auto';
				}

				CMOnlineUI_input.className = 'cm-input input_comment';
				CMOnlineUI_input.disabled = item.disabled;
				CMOnlineUI_input.placeholder = '请输入';
				CMOnlineUI_input.style.width = width;

			
				//
				if (cIndex === index) {
					setTimeout(function(e_) {
						CMOnlineUI_input.focus();
					}, 0);
					cIndex = -1;
				}

				// 输入事件
				CMOnlineUI_input.onchange = function(e) {
					options.data[index].value = e.target.value;
					CMUI.commentOnChange(e, options, item, index);
				};

				// 追加CMOnlineUI_input
				InputBox.appendChild(CMOnlineUI_input);
				// 未禁用显示确定按钮
				if (!item.disabled) {
					// 创建按钮
					const CMOnlineUI_Btn = document.createElement('button');
					CMOnlineUI_Btn.className = 'cm-btn submit_comment';
					CMOnlineUI_Btn.innerHTML =
						'<svg t="1623808337640" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1209"><path d="M384.044 759.713l486.49-486.49c17.573-17.573 46.065-17.573 63.639 0 17.573 17.575 17.573 46.067 0 63.64l-550.13 550.13L89.18 592.129c-17.573-17.574-17.573-46.066 0-63.64 17.574-17.573 46.066-17.573 63.64 0l231.224 231.224z" p-id="1210" fill="#707070"></path></svg>';
					// CMOnlineUI_Btn.style.cssText = 'height:auto;';
					CMOnlineUI_Btn.disabled = item.disabled;
					// 点击事件
					CMOnlineUI_Btn.onclick = function(e){
						options.data[index].disabled = true;
						// options.data[index].style.autoHeight =
						// 	InputBox.firstChild.style.height;
						CMUI.commentOnSubmit(e, options, item, index);
						showCommentInput(options);
						InputBox.setAttribute(
							'data-tooltip',
							'作   者：' +
								item._strUsrName +
								'\n创建时间：' +
								item._strCreateTime
						);
					};
					InputBox.appendChild(CMOnlineUI_Btn);
				} else {
					InputBox.setAttribute(
						'data-tooltip',
						// `作   者：${item._strUsrName}\n创建时间：${item._strCreateTime}`
						'作   者：' +
							item._strUsrName +
							'\n创建时间：' +
							item._strCreateTime
					);
				}
				InputBox.ondblclick = function () {
					if (item.disabled === false) return;
					cIndex = index;
					options.data[index].disabled = false;
					showCommentInput(options);
					hideTooltip();
				};
				// 防止被冒泡
				CMOnlineUI_inputBox.onkeydown = function (e) { e.stopPropagation() };
				CMOnlineUI_inputBox.appendChild(InputBox);
				fragment.appendChild(CMOnlineUI_inputBox);
			});
			// data-tooltip="Tooltip in the left corner of the viewport"
			CMOnlineUIDiv.innerHTML = '';
			CMOnlineUIDiv.appendChild(fragment);
			onReady();
		}

		return CMUI;
	}

	/**
	 * 自动输入框高度
	 */
	function autoTextarea(el, maxHeight, minHeight, elm) {
		el.onchange =
			el.oninput =
			el.onpaste =
			el.oncut =
			el.onkeydown =
			el.onkeyup =
			el.onfocus =
			el.onblur =
				function () {
					var height,
						style = this.style;
					this.style.height = minHeight + 'px';
					elm.style.height = minHeight + 'px';

					if (this.scrollHeight > minHeight) {
						if (maxHeight && this.scrollHeight > maxHeight) {
							height = maxHeight;
							style.overflowY = 'scroll';
						} else {
							height = this.scrollHeight;
							style.overflowY = 'hidden';
						}
						style.height = height + 'px';
						elm.style.height = height + 'px';
					}
				};
	}

	/**
	 * tooltip
	 */
	let tooltip, elm_edges, tooltip_text;

	var Tooltip = {
		create: function (tooltip, elm) {
			elm_edges = elm.getBoundingClientRect();
			var text = elm.getAttribute('data-tooltip');

			text.split('\n').forEach(function (item) {
				var Div = document.createElement('div');
				Div.appendChild(document.createTextNode(item));
				tooltip.appendChild(Div);
			});

			if (elm_edges.left > window.innerWidth - 100) {
				tooltip.className = 'tooltip-container tooltip-left';
			} else if (elm_edges.left + elm_edges.width / 2 < 100) {
				tooltip.className = 'tooltip-container tooltip-right';
			} else {
				tooltip.className = 'tooltip-container tooltip-center';
			}
		},
		position: function (tooltip, elm) {
			const parentNode = CMOnlineUIDiv.parentNode.getBoundingClientRect();
			const elm_top =
				elm_edges.top + elm_edges.height + 10 - parentNode.top;
			const viewport_edges = window.innerWidth - 100;

			if (elm_edges.left > viewport_edges && elm_edges.width < 50) {
				tooltip.style.left =
					elm_edges.left -
					(tooltip.offsetWidth + elm_edges.width) +
					'px';
				tooltip.style.top = elm.offsetTop + 'px';
			} else if (
				elm_edges.left > viewport_edges &&
				elm_edges.width > 50
			) {
				tooltip.style.left =
					elm_edges.left - tooltip.offsetWidth - 20 + 'px';
				tooltip.style.top = elm.offsetTop + 'px';
			} else if (elm_edges.left + elm_edges.width / 2 < 100) {
				tooltip.style.left =
					elm_edges.left + elm_edges.width + 20 + 'px';
				tooltip.style.top = elm.offsetTop + 'px';
			} else {
				const centered =
					elm_edges.left +
					elm_edges.width / 2 -
					tooltip.offsetWidth / 2;
				tooltip.style.left = centered + 'px';
				tooltip.style.top = elm_top + 'px';
			}
		},
	};

	function showTooltip(evt) {
		const item = Object.create(Tooltip);
		item.create(tooltip, evt.currentTarget);
		item.position(tooltip, evt.currentTarget);
	}

	function hideTooltip() {
		tooltip.className = 'tooltip-container no-display';
		// tooltip.removeChild(tooltip.lastChild);
		tooltip.innerHTML = '';
		tooltip.removeAttribute('style');
	}
	function initTips(InputBox) {
		tooltip = document.createElement('div');
		tooltip.className = 'tooltip-container no-display';
		InputBox.appendChild(tooltip);
	}
	function onReady() {
		// tooltip = document.documentElement.querySelector('.tooltip-container');
		const tooltip_elms =
			document.documentElement.querySelectorAll('[data-tooltip]');
		Array.prototype.forEach.call(tooltip_elms, function (elm) {
			elm.addEventListener('mouseover', showTooltip, false);
			elm.addEventListener('mouseout', hideTooltip, false);
		});



		


	}

	// document.addEventListener('DOMContentLoaded', onReady, false);

	// CMOnlineUI
	window.CMOnlineUI = new CMUIFun();
})();
