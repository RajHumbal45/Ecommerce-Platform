export const FILTER_SET_QUERY = 'filters/FILTER_SET_QUERY' as const
export const FILTER_SET_CATEGORY = 'filters/FILTER_SET_CATEGORY' as const
export const FILTER_SET_SORT = 'filters/FILTER_SET_SORT' as const

export function filterSetQuery(payload: string) {
	return {
		type: FILTER_SET_QUERY,
		payload
	}
}

export function filterSetCategory(payload: string) {
	return {
		type: FILTER_SET_CATEGORY,
		payload
	}
}

export function filterSetSort(payload: string) {
	return {
		type: FILTER_SET_SORT,
		payload
	}
}

