export const PRODUCT_FETCH_REQUEST = 'products/PRODUCT_FETCH_REQUEST' as const
export const PRODUCT_FETCH_SUCCESS = 'products/PRODUCT_FETCH_SUCCESS' as const
export const PRODUCT_FETCH_FAILURE = 'products/PRODUCT_FETCH_FAILURE' as const

export function productFetchRequest() {
	return {
		type: PRODUCT_FETCH_REQUEST
	}
}

export function productFetchSuccess(payload: unknown[]) {
	return {
		type: PRODUCT_FETCH_SUCCESS,
		payload
	}
}

export function productFetchFailure(payload: string) {
	return {
		type: PRODUCT_FETCH_FAILURE,
		payload
	}
}

