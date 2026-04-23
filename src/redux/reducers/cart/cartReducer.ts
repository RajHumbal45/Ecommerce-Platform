import {
	CART_ADD_ITEM,
	CART_CLEAR,
	CART_HYDRATE,
	CART_REMOVE_ITEM,
	CART_UPDATE_QUANTITY,
	type CartAction,
	type CartAddItemPayload
} from '@/redux/actions/cart/cartAction'
import type { Product } from '@/data/products'

export interface CartItem {
	cartKey: string
	product: Pick<
		Product,
		| 'id'
		| 'name'
		| 'slug'
		| 'price'
		| 'discountPrice'
		| 'category'
		| 'thumbnail'
		| 'stock'
	>
	quantity: number
	selectedVariants: Record<string, string>
}

export interface CartState {
	items: CartItem[]
}

const initialState: CartState = {
	items: []
}

function buildCartKey(productSlug: string, selectedVariants: Record<string, string>) {
	const variantSuffix = Object.entries(selectedVariants)
		.sort(([first], [second]) => first.localeCompare(second))
		.map(([label, value]) => `${label}:${value}`)
		.join('|')

	return `${productSlug}__${variantSuffix}`
}

function isCartItem(value: unknown): value is CartItem {
	if (!value || typeof value !== 'object') {
		return false
	}

	const candidate = value as {
		cartKey?: unknown
		quantity?: unknown
		selectedVariants?: unknown
		product?: {
			slug?: unknown
			name?: unknown
			category?: unknown
			thumbnail?: unknown
			price?: unknown
			stock?: unknown
		}
	}

	return (
		typeof candidate.cartKey === 'string' &&
		typeof candidate.quantity === 'number' &&
		typeof candidate.selectedVariants === 'object' &&
		candidate.selectedVariants !== null &&
		typeof candidate.product?.slug === 'string' &&
		typeof candidate.product?.name === 'string' &&
		typeof candidate.product?.category === 'string' &&
		typeof candidate.product?.thumbnail === 'string' &&
		typeof candidate.product?.price === 'number' &&
		typeof candidate.product?.stock === 'number'
	)
}

function normalizePayload(payload: CartAddItemPayload): CartItem {
	const cartKey = buildCartKey(payload.product.slug, payload.selectedVariants)

	return {
		cartKey,
		product: {
			id: payload.product.id,
			name: payload.product.name,
			slug: payload.product.slug,
			price: payload.product.price,
			discountPrice: payload.product.discountPrice,
			category: payload.product.category,
			thumbnail: payload.product.thumbnail,
			stock: payload.product.stock
		},
		quantity: Math.max(1, payload.quantity),
		selectedVariants: payload.selectedVariants
	}
}

function sanitizeQuantity(quantity: number, maxStock: number) {
	return Math.min(Math.max(1, quantity), Math.max(1, maxStock))
}

export function cartReducer(
	state = initialState,
	action: CartAction
): CartState {
	switch (action.type) {
		case CART_ADD_ITEM: {
			const nextItem = normalizePayload(action.payload)
			const existingItem = state.items.find((item) => item.cartKey === nextItem.cartKey)

			if (existingItem) {
				return {
					...state,
					items: state.items.map((item) =>
						item.cartKey === nextItem.cartKey
							? {
									...item,
									quantity: sanitizeQuantity(
										item.quantity + nextItem.quantity,
										item.product.stock
									)
								}
							: item
					)
				}
			}

			return {
				...state,
				items: [...state.items, nextItem]
			}
		}
		case CART_REMOVE_ITEM: {
			return {
				...state,
				items: state.items.filter((item) => item.cartKey !== action.payload.cartKey)
			}
		}
		case CART_UPDATE_QUANTITY: {
			return {
				...state,
				items: state.items
					.map((item) =>
						item.cartKey === action.payload.cartKey
							? {
									...item,
									quantity: sanitizeQuantity(action.payload.quantity, item.product.stock)
								}
							: item
					)
					.filter((item) => item.quantity > 0)
			}
		}
		case CART_CLEAR:
			return initialState
		case CART_HYDRATE: {
			return {
				...state,
				items: action.payload.items.filter(isCartItem)
			}
		}
		default:
			return state
	}
}
