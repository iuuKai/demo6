export const useRelativeFetch = (url: string, options: any = {}) => {
	return $fetch(url, {
		baseURL: '',
		...options
	})
}
