import {
	CHECKOUT_HYDRATE,
	CHECKOUT_SUBMIT_FAILURE,
	CHECKOUT_SUBMIT_REQUEST,
	CHECKOUT_SUBMIT_SUCCESS,
	type CheckoutSuccessPayload
} from '@/redux/actions/checkout/checkoutAction'

export interface CheckoutState {
	submitting: boolean
	error: string | null
	orderId: string | null
	order: CheckoutSuccessPayload['order'] | null
}

const initialState: CheckoutState = {
	submitting: false,
	error: null,
	orderId: null,
	order: null
}

export function checkoutReducer(
	state = initialState,
	action:
		| { type: string; payload?: CheckoutSuccessPayload | string | null }
		| { type: string; payload?: unknown }
): CheckoutState {
	switch (action.type) {
		case CHECKOUT_SUBMIT_REQUEST:
			return { ...state, submitting: true, error: null }
		case CHECKOUT_SUBMIT_SUCCESS: {
			const payload = action.payload as CheckoutSuccessPayload | undefined

			if (!payload) {
				return state
			}

			return {
				...state,
				submitting: false,
				orderId: payload.orderId,
				order: payload.order
			}
		}
		case CHECKOUT_SUBMIT_FAILURE:
			return {
				...state,
				submitting: false,
				error: typeof action.payload === 'string' ? action.payload : 'Checkout failed'
			}
		case CHECKOUT_HYDRATE: {
			const payload = action.payload as CheckoutSuccessPayload | null | undefined

			if (!payload) {
				return initialState
			}

			return {
				...state,
				orderId: payload.orderId,
				order: payload.order
			}
		}
		default:
			return state
	}
}
