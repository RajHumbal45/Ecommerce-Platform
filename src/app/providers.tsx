'use client'

import { Provider, useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { makeStore } from '@/redux/store'
import { cartHydrate } from '@/redux/actions/cart/cartAction'
import {
	checkoutHydrate,
	type CheckoutSuccessPayload
} from '@/redux/actions/checkout/checkoutAction'
import type { RootState } from '@/redux/store'

const CART_STORAGE_KEY = 'ecom-studio-cart'
const CHECKOUT_STORAGE_KEY = 'ecom-studio-checkout'

function isCheckoutSuccessPayload(value: unknown): value is CheckoutSuccessPayload {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as CheckoutSuccessPayload).orderId === 'string' &&
		typeof (value as CheckoutSuccessPayload).order === 'object' &&
		(value as CheckoutSuccessPayload).order !== null
	)
}

function CartPersistence() {
	const dispatch = useDispatch()
	const items = useSelector((state: RootState) => state.cart.items)
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
				dispatch(cartHydrate({ items: parsed }))
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
	const dispatch = useDispatch()
	const orderId = useSelector((state: RootState) => state.checkout.orderId)
	const order = useSelector((state: RootState) => state.checkout.order)
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

export function Providers({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<ReturnType<typeof makeStore> | null>(null)

	if (!storeRef.current) {
		storeRef.current = makeStore()
	}

	return (
		<Provider store={storeRef.current}>
			<CartPersistence />
			<CheckoutPersistence />
			{children}
		</Provider>
	)
}

