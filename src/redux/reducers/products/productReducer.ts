import {
	PRODUCT_FETCH_FAILURE,
	PRODUCT_FETCH_REQUEST,
	PRODUCT_FETCH_SUCCESS
} from '@/redux/actions/products/productAction'

export interface ProductsState {
	loading: boolean
	error: string | null
	items: unknown[]
}

const initialState: ProductsState = {
	loading: false,
	error: null,
	items: []
}

export function productsReducer(
	state = initialState,
	action: { type: string; payload?: unknown }
): ProductsState {
	switch (action.type) {
		case PRODUCT_FETCH_REQUEST:
			return { ...state, loading: true, error: null }
		case PRODUCT_FETCH_SUCCESS:
			return {
				...state,
				loading: false,
				items: Array.isArray(action.payload) ? action.payload : []
			}
		case PRODUCT_FETCH_FAILURE:
			return {
				...state,
				loading: false,
				error: typeof action.payload === 'string' ? action.payload : 'Unknown error'
			}
		default:
			return state
	}
}

