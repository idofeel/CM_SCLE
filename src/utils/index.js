/** @format */

function scleCustomEvent(name, detail) {
	const event = document.createEvent('CustomEvent')
	event.initCustomEvent(name, true, true, { detail })
    window.dispatchEvent(event)
}

const queryString = (url) => {
	let param = url.split('?'),
		// type = (param[0] || '').split('://'),
		json = param.length > 0 ? parseUrl(param[1]) : {}

	return json
}

const parseUrl = (url) => {
	if (!url || url == null) return {}
	let queryArr = decodeURIComponent(url).split('&'),
		result = {}
	queryArr.forEach(function (item) {
		result[item.split('=')[0]] = item.split('=')[1]
	})
	return result
}

const urlEncoded = (data) => {
	if (typeof data === 'string') return encodeURIComponent(data)
	let params = []
	for (let k in data) {
		if (!data.hasOwnProperty(k)) return
		let v = data[k]
		if (typeof v === 'string') v = encodeURIComponent(v)
		if (v === undefined) v = ''
		params.push(`${encodeURIComponent(k)}=${v}`)
	}
	return params.join('&')
}

const joinUrlEncoded = (url, data) => {
	const params = urlEncoded(data)
	if (url.indexOf('?') < 0 && params) {
		url += '?' + params
	} else {
		url += '&' + params
	}
	return url
}

const replaceState = (urlSearch, payload) => {
	let parmas = queryString(urlSearch)
	let param = window.location.href.split('?')
	parmas.m = payload.selectKey
	parmas.s = payload.secondaryKey
	window.history.replaceState({}, '0', joinUrlEncoded(param[0], parmas))
}

export {
	joinUrlEncoded,
	parseUrl,
	urlEncoded,
	queryString,
	replaceState,
	scleCustomEvent
}
