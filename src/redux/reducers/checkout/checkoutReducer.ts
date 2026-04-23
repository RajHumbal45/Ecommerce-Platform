import {
	CHECKOUT_HYDRATE,
	CHECKOUT_SUBMIT_FAILURE,
	CHECKOUT_SUBMIT_REQUEST,
	CHECKOUT_SUBMIT_SUCCESS,
	type CheckoutAction,
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
	action: CheckoutAction
): CheckoutState {
	switch (action.type) {
		case CHECKOUT_SUBMIT_REQUEST:
			return { ...state, submitting: true, error: null }
		case CHECKOUT_SUBMIT_SUCCESS: {
			return {
				...state,
				submitting: false,
				error: null,
				orderId: action.payload.orderId,
				order: action.payload.order
			}
		}
		case CHECKOUT_SUBMIT_FAILURE:
			return {
				...state,
				submitting: false,
				error: typeof action.payload === 'string' ? action.payload : 'Checkout failed'
			}
		case CHECKOUT_HYDRATE: {
			if (!action.payload) {
				return initialState
			}

			return {
				...state,
				submitting: false,
				error: null,
				orderId: action.payload.orderId,
				order: action.payload.order
			}
		}
		default:
			return state
	}
}
