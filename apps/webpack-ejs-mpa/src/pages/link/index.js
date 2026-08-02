import $ from 'jquery'
import '@/assets/common.css'
import './index.css'

$(function () {
	const $box = $('#userBox')
	$.ajax({
		url: `/api/user/all`,
		method: 'GET',
		success(res) {
			// 判断res.data存在且为数组，否则请求失败
			if (res && Array.isArray(res.data)) {
				let html = '<ul class="user-list">'
				res.data.forEach(item => {
					html += `<li>${item.name} - ${item.email}</li>`
				})
				html += '</ul>'
				$box.html(html)
			} else {
				$box.html('<div class="error-tip">请求失败</div>')
			}
		},
		error() {
			$box.html('<div class="error-tip">请求失败</div>')
		}
	})
})
