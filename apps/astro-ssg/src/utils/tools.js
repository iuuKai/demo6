const BASE_URL = import.meta.env.BASE_URL
const joinBaseUrl = path => {
	return BASE_URL.replace(/\/?$/, '/') + path.replace(/^\/?/, '')
}

export { joinBaseUrl }
