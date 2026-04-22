import { call, put, takeLatest } from 'redux-saga/effects'
import {
	CHECKOUT_SUBMIT_REQUEST,
	checkoutSubmitFailure,
	checkoutSubmitSuccess,
	type CheckoutSubmitPayload
} from '@/redux/actions/checkout/checkoutAction'
import { cartClear } from '@/redux/actions/cart/cartAction'
import { submitCheckoutRequest } from '@/redux/sagas/requests/checkoutRequest'

function* handleCheckoutSubmit(action: { type: string; payload?: CheckoutSubmitPayload }) {
	try {
		const payload = action.payload

		if (!payload) {
			throw new Error('Missing checkout payload')
		}

		const response: Awaited<ReturnType<typeof submitCheckoutRequest>> = yield call(
			submitCheckoutRequest,
			payload
		)

		yield put(checkoutSubmitSuccess(response))
		yield put(cartClear())
	} catch {
		yield put(checkoutSubmitFailure('We could not place the order. Please try again.'))
	}
}

export function* checkoutHandler() {
	yield takeLatest(CHECKOUT_SUBMIT_REQUEST, handleCheckoutSubmit)
}
