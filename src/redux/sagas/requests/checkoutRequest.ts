import type { CheckoutSubmitPayload } from '@/redux/actions/checkout/checkoutAction'

export async function submitCheckoutRequest(payload: CheckoutSubmitPayload) {
	await new Promise((resolve) => setTimeout(resolve, 900))

	return {
		orderId: `ORD-${Date.now().toString().slice(-6)}`,
		order: payload
	}
}
