import {
	WISHLIST_CLEAR,
	WISHLIST_HYDRATE,
	WISHLIST_TOGGLE_ITEM,
	type WishlistItemPayload
} from '@/redux/actions/wishlist/wishlistAction'

export interface WishlistItem extends WishlistItemPayload {
	isSaved: boolean
}

export interface WishlistState {
	items: WishlistItemPayload[]
}

const initialState: WishlistState = {
	items: []
}

function isWishlistItem(value: unknown): value is WishlistItemPayload {
	if (!value || typeof value !== 'object') {
		return false
	}

	const candidate = value as WishlistItemPayload

	return typeof candidate.product?.slug === 'string' && typeof candidate.product?.name === 'string'
}

export function wishlistReducer(
	state = initialState,
	action: { type: string; payload?: WishlistItemPayload | WishlistItemPayload[] }
): WishlistState {
	switch (action.type) {
		case WISHLIST_TOGGLE_ITEM: {
			const payload = action.payload as WishlistItemPayload | undefined

			if (!payload) {
				return state
			}

			const existing = state.items.some((item) => item.product.slug === payload.product.slug)

			return {
				...state,
				items: existing
					? state.items.filter((item) => item.product.slug !== payload.product.slug)
					: [...state.items, payload]
			}
		}
		case WISHLIST_CLEAR:
			return initialState
		case WISHLIST_HYDRATE: {
			const payload = action.payload as WishlistItemPayload[] | undefined

			if (!payload) {
				return state
			}

			return {
				...state,
				items: payload.filter(isWishlistItem)
			}
		}
		default:
			return state
	}
}
