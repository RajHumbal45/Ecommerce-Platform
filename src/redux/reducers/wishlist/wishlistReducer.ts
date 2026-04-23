import {
	WISHLIST_CLEAR,
	WISHLIST_HYDRATE,
	WISHLIST_TOGGLE_ITEM,
	type WishlistAction,
	type WishlistItemPayload
} from '@/redux/actions/wishlist/wishlistAction'

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

	const candidate = value as {
		product?: {
			slug?: unknown
			name?: unknown
			category?: unknown
			thumbnail?: unknown
			price?: unknown
			rating?: unknown
			reviewCount?: unknown
			stock?: unknown
		}
	}

	return (
		typeof candidate.product?.slug === 'string' &&
		typeof candidate.product?.name === 'string' &&
		typeof candidate.product?.category === 'string' &&
		typeof candidate.product?.thumbnail === 'string' &&
		typeof candidate.product?.price === 'number' &&
		typeof candidate.product?.rating === 'number' &&
		typeof candidate.product?.reviewCount === 'number' &&
		typeof candidate.product?.stock === 'number'
	)
}

export function wishlistReducer(
	state = initialState,
	action: WishlistAction
): WishlistState {
	switch (action.type) {
		case WISHLIST_TOGGLE_ITEM: {
			const existing = state.items.some((item) => item.product.slug === action.payload.product.slug)

			return {
				...state,
				items: existing
					? state.items.filter((item) => item.product.slug !== action.payload.product.slug)
					: [...state.items, action.payload]
			}
		}
		case WISHLIST_CLEAR:
			return initialState
		case WISHLIST_HYDRATE: {
			return {
				...state,
				items: action.payload.filter(isWishlistItem)
			}
		}
		default:
			return state
	}
}
