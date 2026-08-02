$(function () {
	const BASE_URL = '/vanilla-spa/'
	const $container = $('#viewContainer')
	// 页面地址映射
	const pageMap = {
		home: `${BASE_URL}pages/home.html`,
		about: `${BASE_URL}pages/about.html`,
		link: `${BASE_URL}pages/link.html`
	}

	// 从url search读取当前页面名
	function getCurrentPageFromUrl() {
		const params = new URLSearchParams(location.search)
		// 无page参数默认打开home
		return params.get('page') || 'home'
	}

	// 核心渲染页面方法
	function renderPage(pageName, pushHistory = true) {
		const pageUrl = pageMap[pageName]
		if (!pageUrl) return

		// 操作浏览器历史记录栈
		if (pushHistory) {
			const newSearch = new URLSearchParams(location.search)
			newSearch.set('page', pageName)
			const newUrl = `${location.pathname}?${newSearch.toString()}`
			history.pushState({ page: pageName }, '', newUrl)
		}

		// Ajax 请求页面碎片
		$.ajax({
			url: pageUrl,
			type: 'GET',
			success: function (htmlFragment) {
				// 替换资源占位符 %{BASE_URL}% 为全局BASE_URL
				const realHtml = htmlFragment.replaceAll('%{BASE_URL}%', BASE_URL)
				$container.html(realHtml)

				// link页面加载完毕后请求接口
				if (pageName === 'link') {
					loadUserApi()
				}
			},
			error: function () {
				$container.html('<div class="error-tip">页面加载失败</div>')
			}
		})
	}

	// Link页面接口请求，对齐统一错误规则
	function loadUserApi() {
		const $wrap = $container.find('.user-wrap')
		$wrap.html('<div>加载中...</div>')

		$.ajax({
			url: `/api/user/all`,
			type: 'GET',
			success: function (res) {
				// 判断res.data存在且为数组才渲染列表，否则提示请求失败
				if (res && Array.isArray(res.data)) {
					let listHtml = '<ul class="user-list">'
					res.data.forEach(item => {
						listHtml += `<li>${item.name} - ${item.email}</li>`
					})
					listHtml += '</ul>'
					$wrap.html(listHtml)
				} else {
					$wrap.html('<div class="error-tip">请求失败</div>')
				}
			},
			error: function () {
				$wrap.html('<div class="error-tip">请求失败</div>')
			}
		})
	}

	// 导航点击切换页面
	$('.nav a').on('click', function (e) {
		e.preventDefault()
		const targetPage = $(this).data('page')
		renderPage(targetPage, true)
	})

	// 监听浏览器前进/后退按钮
	window.addEventListener('popstate', function () {
		const page = getCurrentPageFromUrl()
		renderPage(page, false)
	})

	// 页面初始化：刷新后读取地址参数恢复页面
	const initPage = getCurrentPageFromUrl()
	renderPage(initPage, false)
})
