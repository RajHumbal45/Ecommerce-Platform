import {
	CHECKOUT_SUBMIT_FAILURE,
	CHECKOUT_SUBMIT_REQUEST,
	CHECKOUT_SUBMIT_SUCCESS
} from '@/redux/actions/checkout/checkoutAction'

export interface CheckoutState {
	submitting: boolean
	error: string | null
	orderId: string | null
}

const initialState: CheckoutState = {
	submitting: false,
	error: null,
	orderId: null
}

export function checkoutReducer(
	state = initialState,
	action: { type: string; payload?: { orderId: string } | string }
): CheckoutState {
	switch (action.type) {
		case CHECKOUT_SUBMIT_REQUEST:
			return { ...state, submitting: true, error: null }
		case CHECKOUT_SUBMIT_SUCCESS:
			return {
				...state,
				submitting: false,
				orderId: (action.payload as { orderId: string }).orderId
			}
		case CHECKOUT_SUBMIT_FAILURE:
			return {
				...state,
				submitting: false,
				error: typeof action.payload === 'string' ? action.payload : 'Checkout failed'
			}
		default:
			return state
	}
}

