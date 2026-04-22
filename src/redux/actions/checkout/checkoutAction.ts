export interface CheckoutItemSnapshot {
	cartKey: string
	name: string
	slug: string
	category: string
	quantity: number
	price: number
}

export interface CheckoutSummary {
	itemCount: number
	subtotal: number
	shipping: number
	total: number
}

export interface CheckoutSubmitPayload {
	contactName: string
	email: string
	addressLine1: string
	city: string
	postalCode: string
	country: string
	paymentMethod: string
	shippingMethod: string
	items: CheckoutItemSnapshot[]
	summary: CheckoutSummary
}

export interface CheckoutSuccessPayload {
	orderId: string
	order: CheckoutSubmitPayload
}

export const CHECKOUT_SUBMIT_REQUEST = 'checkout/CHECKOUT_SUBMIT_REQUEST' as const
export const CHECKOUT_SUBMIT_SUCCESS = 'checkout/CHECKOUT_SUBMIT_SUCCESS' as const
export const CHECKOUT_SUBMIT_FAILURE = 'checkout/CHECKOUT_SUBMIT_FAILURE' as const
export const CHECKOUT_HYDRATE = 'checkout/CHECKOUT_HYDRATE' as const

export function checkoutSubmitRequest(payload: CheckoutSubmitPayload) {
	return {
		type: CHECKOUT_SUBMIT_REQUEST,
		payload
	}
}

export function checkoutSubmitSuccess(payload: CheckoutSuccessPayload) {
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

export function checkoutHydrate(payload: CheckoutSuccessPayload | null) {
	return {
		type: CHECKOUT_HYDRATE,
		payload
	}
}
