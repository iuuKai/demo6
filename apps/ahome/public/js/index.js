import { APPS_CONFIG } from './apps.js'
$(function () {
	function renderTagsAndCards() {
		const uniqueTypes = ['全部', ...new Set(APPS_CONFIG.map(item => item.type))]
		const tagsHtml = uniqueTypes
			.map(
				type =>
					`<div class="tag${type === '全部' ? ' active' : ''}" data-type="${type}">${type === '全部' ? type : type.toUpperCase()}</div>`
			)
			.join('\n')
		$('.tags').html(tagsHtml)

		const appsLinks = APPS_CONFIG.map(item => {
			return `<a href="${item.path}" class="card" data-type="${item.type}" target="_blank">
					<div class="card-img">
						<img src="${item.banner}" alt="${item.name}">
						<div class="mask"></div>
					</div>
					<div class="card-body">
						<div class="card-title">${item.name}</div>
						<p class="card-desc">${item.description}</p>
					</div>
				</a>`
		}).join('\n')
		$('.card-grid').html(appsLinks)
	}

	renderTagsAndCards()

	function filterCards() {
		const selectedType = $('.tag.active').data('type')
		const searchText = $('.search-input').val().toLowerCase().trim()

		$('.card').each(function () {
			const cardType = $(this).data('type')
			const cardTitle = $(this).find('.card-title').text().toLowerCase()
			const cardDesc = $(this).find('.card-desc').text().toLowerCase()

			const matchType = selectedType === '全部' || cardType === selectedType
			const matchSearch =
				searchText === '' || cardTitle.includes(searchText) || cardDesc.includes(searchText)

			if (matchType && matchSearch) {
				$(this).show()
			} else {
				$(this).hide()
			}
		})
	}

	$('.tag').click(function () {
		$(this).addClass('active').siblings().removeClass('active')
		filterCards()
	})

	$('.search-input').on('input', filterCards)

	const scrollTopBtn = $('#scrollTopBtn')

	function checkScroll() {
		if ($(window).scrollTop() > 300) {
			scrollTopBtn.addClass('visible')
		} else {
			scrollTopBtn.removeClass('visible')
		}
	}

	$(window).on('scroll resize', checkScroll)
	checkScroll()

	scrollTopBtn.click(function () {
		$('html, body').animate(
			{
				scrollTop: 0
			},
			400
		)
	})
})
