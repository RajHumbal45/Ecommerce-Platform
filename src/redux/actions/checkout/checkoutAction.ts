export const CHECKOUT_SUBMIT_REQUEST = 'checkout/CHECKOUT_SUBMIT_REQUEST' as const
export const CHECKOUT_SUBMIT_SUCCESS = 'checkout/CHECKOUT_SUBMIT_SUCCESS' as const
export const CHECKOUT_SUBMIT_FAILURE = 'checkout/CHECKOUT_SUBMIT_FAILURE' as const

export function checkoutSubmitRequest(payload: unknown) {
	return {
		type: CHECKOUT_SUBMIT_REQUEST,
		payload
	}
}

export function checkoutSubmitSuccess(payload: { orderId: string }) {
	return {
		type: CHECKOUT_SUBMIT_SUCCESS,
		payload
	}
}

export function checkoutSubmitFailure(payload: string) {
	return {
		type: CHECKOUT_SUBMIT_FAILURE,
		payload
	}
}

