import type { Product } from '@/data/products'

export const CART_ADD_ITEM = 'cart/CART_ADD_ITEM' as const
export const CART_REMOVE_ITEM = 'cart/CART_REMOVE_ITEM' as const
export const CART_UPDATE_QUANTITY = 'cart/CART_UPDATE_QUANTITY' as const
export const CART_CLEAR = 'cart/CART_CLEAR' as const
export const CART_HYDRATE = 'cart/CART_HYDRATE' as const

export interface CartAddItemPayload {
	product: Product
	quantity: number
	selectedVariants: Record<string, string>
}

export interface CartUpdateQuantityPayload {
	cartKey: string
	quantity: number
}

export interface CartRemoveItemPayload {
	cartKey: string
}

export interface CartHydratePayload {
	items: unknown[]
}

export interface CartAddItemAction {
	type: typeof CART_ADD_ITEM
	payload: CartAddItemPayload
}

export interface CartRemoveItemAction {
	type: typeof CART_REMOVE_ITEM
	payload: CartRemoveItemPayload
}

export interface CartUpdateQuantityAction {
	type: typeof CART_UPDATE_QUANTITY
	payload: CartUpdateQuantityPayload
}

export interface CartClearAction {
	type: typeof CART_CLEAR
}

export interface CartHydrateAction {
	type: typeof CART_HYDRATE
	payload: CartHydratePayload
}

export type CartAction =
	| CartAddItemAction
	| CartRemoveItemAction
	| CartUpdateQuantityAction
	| CartClearAction
	| CartHydrateAction

export function cartAddItem(payload: CartAddItemPayload): CartAddItemAction {
	return {
		type: CART_ADD_ITEM,
		payload
	}
}

export function cartRemoveItem(payload: CartRemoveItemPayload): CartRemoveItemAction {
	return {
		type: CART_REMOVE_ITEM,
		payload
	}
}

export function cartUpdateQuantity(
	payload: CartUpdateQuantityPayload
): CartUpdateQuantityAction {
	return {
		type: CART_UPDATE_QUANTITY,
		payload
	}
}

export function cartClear(): CartClearAction {
	return {
		type: CART_CLEAR
	}
}

export function cartHydrate(payload: CartHydratePayload): CartHydrateAction {
	return {
		type: CART_HYDRATE,
		payload
	}
}
