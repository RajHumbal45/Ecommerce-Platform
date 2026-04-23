import { call, put, takeLatest } from 'redux-saga/effects'
import {
	CHECKOUT_SUBMIT_REQUEST,
	checkoutSubmitFailure,
	checkoutSubmitSuccess,
	type CheckoutSubmitAction
} from '@/redux/actions/checkout/checkoutAction'
import { cartClear } from '@/redux/actions/cart/cartAction'
import { submitCheckoutRequest } from '@/redux/sagas/requests/checkoutRequest'

function* handleCheckoutSubmit(action: CheckoutSubmitAction) {
	try {
		const response: Awaited<ReturnType<typeof submitCheckoutRequest>> = yield call(
			submitCheckoutRequest,
			action.payload
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
