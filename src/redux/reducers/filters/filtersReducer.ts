import {
	FILTER_SET_CATEGORY,
	FILTER_SET_QUERY,
	FILTER_SET_SORT
} from '@/redux/actions/filters/filterAction'

export interface FiltersState {
	query: string
	category: string
	sort: string
}

const initialState: FiltersState = {
	query: '',
	category: 'all',
	sort: 'featured'
}

export function filtersReducer(
	state = initialState,
	action: { type: string; payload?: string }
): FiltersState {
	switch (action.type) {
		case FILTER_SET_QUERY:
			return { ...state, query: action.payload ?? '' }
		case FILTER_SET_CATEGORY:
			return { ...state, category: action.payload ?? 'all' }
		case FILTER_SET_SORT:
			return { ...state, sort: action.payload ?? 'featured' }
		default:
			return state
	}
}

