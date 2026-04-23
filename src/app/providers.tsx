'use client'

import { Provider } from 'react-redux'
import { useEffect, useRef } from 'react'
import { makeStore } from '@/redux/store'
import { cartHydrate } from '@/redux/actions/cart/cartAction'
import {
	checkoutHydrate,
	type CheckoutSuccessPayload
} from '@/redux/actions/checkout/checkoutAction'
import { wishlistHydrate } from '@/redux/actions/wishlist/wishlistAction'
import {
	selectCartItems,
	selectCheckoutOrder,
	selectCheckoutOrderId,
	selectWishlistItems
} from '@/redux/selectors'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

const CART_STORAGE_KEY = 'ecom-studio-cart'
const CHECKOUT_STORAGE_KEY = 'ecom-studio-checkout'
const WISHLIST_STORAGE_KEY = 'ecom-studio-wishlist'

function isCheckoutSuccessPayload(value: unknown): value is CheckoutSuccessPayload {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as { orderId?: unknown }).orderId === 'string' &&
		typeof (value as { order?: unknown }).order === 'object' &&
		(value as { order?: unknown }).order !== null
	)
}

function isCartHydrationItem(value: unknown) {
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
		typeof value === 'object' &&
		value !== null &&
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

function isWishlistHydrationItem(value: unknown) {
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
		typeof value === 'object' &&
		value !== null &&
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

function CartPersistence() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectCartItems)
	const hydratedRef = useRef(false)

	useEffect(() => {
		try {
			const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
			if (!storedCart) {
				hydratedRef.current = true
				return
			}

			const parsed = JSON.parse(storedCart) as unknown
			if (Array.isArray(parsed)) {
				dispatch(cartHydrate({ items: parsed.filter(isCartHydrationItem) }))
			}
		} catch {
			window.localStorage.removeItem(CART_STORAGE_KEY)
		} finally {
			hydratedRef.current = true
		}
	}, [dispatch])

	useEffect(() => {
		if (!hydratedRef.current) {
			return
		}

		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
	}, [items])

	return null
}

function CheckoutPersistence() {
	const dispatch = useAppDispatch()
	const orderId = useAppSelector(selectCheckoutOrderId)
	const order = useAppSelector(selectCheckoutOrder)
	const hydratedRef = useRef(false)

	useEffect(() => {
		try {
			const storedOrder = window.sessionStorage.getItem(CHECKOUT_STORAGE_KEY)
			if (!storedOrder) {
				hydratedRef.current = true
				return
			}

			const parsed = JSON.parse(storedOrder) as unknown
			if (isCheckoutSuccessPayload(parsed)) {
				dispatch(checkoutHydrate(parsed))
			}
		} catch {
			window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY)
		} finally {
			hydratedRef.current = true
		}
	}, [dispatch])

	useEffect(() => {
		if (!hydratedRef.current) {
			return
		}

		if (orderId && order) {
			window.sessionStorage.setItem(
				CHECKOUT_STORAGE_KEY,
				JSON.stringify({ orderId, order })
			)
			return
		}

		window.sessionStorage.removeItem(CHECKOUT_STORAGE_KEY)
	}, [order, orderId])

	return null
}

function WishlistPersistence() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectWishlistItems)
	const hydratedRef = useRef(false)

	useEffect(() => {
		try {
			const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
			if (!storedWishlist) {
				hydratedRef.current = true
				return
			}

			const parsed = JSON.parse(storedWishlist) as unknown
			if (Array.isArray(parsed)) {
				dispatch(wishlistHydrate(parsed.filter(isWishlistHydrationItem)))
			}
		} catch {
			window.localStorage.removeItem(WISHLIST_STORAGE_KEY)
		} finally {
			hydratedRef.current = true
		}
	}, [dispatch])

	useEffect(() => {
		if (!hydratedRef.current) {
			return
		}

		window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
	}, [items])

	return null
}

export function Providers({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<ReturnType<typeof makeStore> | null>(null)

	if (!storeRef.current) {
		storeRef.current = makeStore()
	}

	return (
		<Provider store={storeRef.current}>
			<CartPersistence />
			<CheckoutPersistence />
			<WishlistPersistence />
			{children}
		</Provider>
	)
}

