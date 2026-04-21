export const CART_ADD_ITEM = 'cart/CART_ADD_ITEM' as const
export const CART_REMOVE_ITEM = 'cart/CART_REMOVE_ITEM' as const
export const CART_UPDATE_QUANTITY = 'cart/CART_UPDATE_QUANTITY' as const
export const CART_CLEAR = 'cart/CART_CLEAR' as const

export function cartAddItem(payload: { id: string; quantity: number }) {
	return {
		type: CART_ADD_ITEM,
		payload
	}
}

export function cartRemoveItem(payload: { id: string }) {
	return {
		type: CART_REMOVE_ITEM,
		payload
	}
}

export function cartUpdateQuantity(payload: { id: string; quantity: number }) {
	return {
		type: CART_UPDATE_QUANTITY,
		payload
	}
}

export function cartClear() {
	return {
		type: CART_CLEAR
	}
}

