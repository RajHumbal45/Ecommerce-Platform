import type { Product } from '@/data/products'

export const WISHLIST_TOGGLE_ITEM = 'wishlist/WISHLIST_TOGGLE_ITEM' as const
export const WISHLIST_CLEAR = 'wishlist/WISHLIST_CLEAR' as const
export const WISHLIST_HYDRATE = 'wishlist/WISHLIST_HYDRATE' as const

export interface WishlistItemPayload {
	product: Pick<
		Product,
		| 'id'
		| 'name'
		| 'slug'
		| 'price'
		| 'discountPrice'
		| 'category'
		| 'thumbnail'
		| 'rating'
		| 'reviewCount'
		| 'stock'
	>
}

export interface WishlistToggleAction {
	type: typeof WISHLIST_TOGGLE_ITEM
	payload: WishlistItemPayload
}

export interface WishlistClearAction {
	type: typeof WISHLIST_CLEAR
}

export interface WishlistHydrateAction {
	type: typeof WISHLIST_HYDRATE
	payload: WishlistItemPayload[]
}

export type WishlistAction =
	| WishlistToggleAction
	| WishlistClearAction
	| WishlistHydrateAction

export function wishlistToggleItem(payload: WishlistItemPayload): WishlistToggleAction {
	return {
		type: WISHLIST_TOGGLE_ITEM,
		payload
	}
}

export function wishlistClear(): WishlistClearAction {
	return {
		type: WISHLIST_CLEAR
	}
}

export function wishlistHydrate(payload: WishlistItemPayload[]): WishlistHydrateAction {
	return {
		type: WISHLIST_HYDRATE,
		payload
	}
}
