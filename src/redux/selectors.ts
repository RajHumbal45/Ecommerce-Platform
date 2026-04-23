import type { RootState } from './store'

export const FREE_SHIPPING_THRESHOLD = 100

export function selectCartItems(state: RootState) {
	return state.cart.items
}

export function selectCartCount(state: RootState) {
	return state.cart.items.reduce((total, item) => total + item.quantity, 0)
}

export function selectCartSubtotal(state: RootState) {
	return state.cart.items.reduce(
		(total, item) => total + (item.product.discountPrice ?? item.product.price) * item.quantity,
		0
	)
}

export function selectCartShipping(state: RootState) {
	const subtotal = selectCartSubtotal(state)
	return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12
}

export function selectCartTotal(state: RootState) {
	return selectCartSubtotal(state) + selectCartShipping(state)
}

export function selectWishlistItems(state: RootState) {
	return state.wishlist.items
}

export function selectWishlistCount(state: RootState) {
	return state.wishlist.items.length
}

export function selectCheckoutOrderId(state: RootState) {
	return state.checkout.orderId
}

export function selectCheckoutOrder(state: RootState) {
	return state.checkout.order
}

export function selectCheckoutStatus(state: RootState) {
	return {
		submitting: state.checkout.submitting,
		error: state.checkout.error
	}
}

export function selectCheckoutSubmitting(state: RootState) {
	return state.checkout.submitting
}

export function selectCheckoutError(state: RootState) {
	return state.checkout.error
}
