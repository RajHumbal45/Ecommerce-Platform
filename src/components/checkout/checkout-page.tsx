'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react'
import { checkoutSubmitRequest } from '@/redux/actions/checkout/checkoutAction'
import { formatCurrency } from '@/lib/format'
import { formatCategoryLabel } from '@/data/products'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	selectCartCount,
	selectCartItems,
	selectCartShipping,
	selectCartSubtotal,
	selectCartTotal,
	selectCheckoutOrderId,
	selectCheckoutError,
	selectCheckoutSubmitting
} from '@/redux/selectors'

export function CheckoutPage() {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const cartItems = useAppSelector(selectCartItems)
	const itemCount = useAppSelector(selectCartCount)
	const subtotal = useAppSelector(selectCartSubtotal)
	const shipping = useAppSelector(selectCartShipping)
	const total = useAppSelector(selectCartTotal)
	const orderId = useAppSelector(selectCheckoutOrderId)
	const isSubmitting = useAppSelector(selectCheckoutSubmitting)
	const error = useAppSelector(selectCheckoutError)

	const [formData, setFormData] = useState({
		contactName: '',
		email: '',
		addressLine1: '',
		city: '',
		postalCode: '',
		country: 'United States',
		paymentMethod: 'Card',
		shippingMethod: 'Standard'
	})

	const summary = {
		itemCount,
		subtotal,
		shipping,
		total
	}

	useEffect(() => {
		if (orderId) {
			router.push(`/success?order=${orderId}`)
		}
	}, [orderId, router])

	const canSubmit = cartItems.length > 0 && !isSubmitting
	const formId = 'checkout-form'
	const errorId = 'checkout-error'

	return (
		<div className='space-y-8'>
			<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f3efe7_100%)] p-6 shadow-sm sm:p-8'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
					<div className='max-w-2xl space-y-3'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Checkout</p>
						<h1 className='text-4xl font-semibold tracking-tight text-zinc-950'>
							Complete your order with confidence.
						</h1>
						<p className='max-w-xl text-sm leading-6 text-zinc-600'>
							The checkout form is connected to the cart summary and submits through Redux Saga.
						</p>
					</div>

					<div className='grid gap-3 sm:grid-cols-3'>
						{[
							{ label: 'Items', value: summary.itemCount },
							{ label: 'Subtotal', value: formatCurrency(summary.subtotal) },
							{ label: 'Total', value: formatCurrency(summary.total) }
						].map((item) => (
							<div key={item.label} className='rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-sm'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>{item.label}</p>
								<p className='mt-2 text-lg font-semibold text-zinc-950'>{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{cartItems.length > 0 ? (
				<div className='grid gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
					<form
						className='space-y-5 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'
						aria-busy={isSubmitting}
						aria-describedby={error ? errorId : undefined}
						id={formId}
						onSubmit={(event) => {
							event.preventDefault()

							dispatch(
								checkoutSubmitRequest({
									...formData,
									items: cartItems.map((item) => ({
										cartKey: item.cartKey,
										name: item.product.name,
										slug: item.product.slug,
										category: item.product.category,
										quantity: item.quantity,
										price: item.product.discountPrice ?? item.product.price
									})),
									summary
								})
							)
						}}
					>
						<div>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Shipping details</p>
							<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Delivery information</h2>
						</div>

						<div className='grid gap-4 sm:grid-cols-2'>
							<label className='space-y-2 sm:col-span-2'>
								<span className='text-sm font-medium text-zinc-950'>
									Full name <span aria-hidden='true'>*</span>
								</span>
								<input
									id='checkout-full-name'
									name='fullName'
									required
									value={formData.contactName}
									onChange={(event) =>
										setFormData((current) => ({ ...current, contactName: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								/>
							</label>

							<label className='space-y-2 sm:col-span-2'>
								<span className='text-sm font-medium text-zinc-950'>
									Email <span aria-hidden='true'>*</span>
								</span>
								<input
									id='checkout-email'
									name='email'
									type='email'
									required
									value={formData.email}
									onChange={(event) =>
										setFormData((current) => ({ ...current, email: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								/>
							</label>

							<label className='space-y-2 sm:col-span-2'>
								<span className='text-sm font-medium text-zinc-950'>
									Address <span aria-hidden='true'>*</span>
								</span>
								<input
									id='checkout-address'
									name='addressLine1'
									required
									value={formData.addressLine1}
									onChange={(event) =>
										setFormData((current) => ({ ...current, addressLine1: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								/>
							</label>

							<label className='space-y-2'>
								<span className='text-sm font-medium text-zinc-950'>
									City <span aria-hidden='true'>*</span>
								</span>
								<input
									id='checkout-city'
									name='city'
									required
									value={formData.city}
									onChange={(event) =>
										setFormData((current) => ({ ...current, city: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								/>
							</label>

							<label className='space-y-2'>
								<span className='text-sm font-medium text-zinc-950'>
									Postal code <span aria-hidden='true'>*</span>
								</span>
								<input
									id='checkout-postal-code'
									name='postalCode'
									required
									value={formData.postalCode}
									onChange={(event) =>
										setFormData((current) => ({ ...current, postalCode: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								/>
							</label>

							<label className='space-y-2'>
								<span className='text-sm font-medium text-zinc-950'>Country</span>
								<select
									id='checkout-country'
									name='country'
									value={formData.country}
									onChange={(event) =>
										setFormData((current) => ({ ...current, country: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								>
									<option>United States</option>
									<option>Canada</option>
									<option>United Kingdom</option>
									<option>India</option>
								</select>
							</label>

							<label className='space-y-2'>
								<span className='text-sm font-medium text-zinc-950'>Payment method</span>
								<select
									id='checkout-payment-method'
									name='paymentMethod'
									value={formData.paymentMethod}
									onChange={(event) =>
										setFormData((current) => ({ ...current, paymentMethod: event.target.value }))
									}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-zinc-950 focus:bg-white'
								>
									<option>Card</option>
									<option>UPI</option>
									<option>Cash on delivery</option>
								</select>
							</label>

							<label className='space-y-2 sm:col-span-2'>
								<span className='text-sm font-medium text-zinc-950'>Shipping method</span>
								<div className='grid gap-3 sm:grid-cols-2' role='radiogroup' aria-label='Shipping method'>
									{['Standard', 'Express'].map((method) => (
										<button
											key={method}
											type='button'
											aria-pressed={formData.shippingMethod === method}
											aria-label={`${method} shipping`}
											onClick={() => setFormData((current) => ({ ...current, shippingMethod: method }))}
											className={cn(
												'rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
												formData.shippingMethod === method
													? 'border-zinc-950 bg-zinc-950 text-white'
													: 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											{method}
										</button>
									))}
								</div>
							</label>
						</div>

						<div className='rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4'>
							<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
								<BadgeCheck className='size-4' />
								Buyer protections
							</div>
							<div className='mt-3 grid gap-3 sm:grid-cols-2'>
								<div className='rounded-2xl bg-white p-4'>
									<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
										<Truck className='size-4' />
										Shipping
									</div>
									<p className='mt-2 text-sm leading-6 text-zinc-600'>
										Standard and express delivery options are shown clearly before submission.
									</p>
								</div>
								<div className='rounded-2xl bg-white p-4'>
									<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
										<ShieldCheck className='size-4' />
										Secure flow
									</div>
									<p className='mt-2 text-sm leading-6 text-zinc-600'>
										The order confirmation is handled through Redux Saga for a realistic submit path.
									</p>
								</div>
							</div>
						</div>

						{error ? (
							<p id={errorId} role='alert' className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
								{error}
							</p>
						) : null}

						<button
							type='submit'
							disabled={!canSubmit}
							className={cn(
								'w-full rounded-full border px-5 py-3 text-sm font-medium transition',
								canSubmit
									? 'cursor-pointer border-zinc-950 bg-white text-zinc-950 hover:border-zinc-700 hover:bg-zinc-50'
									: 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-500'
							)}
						>
							{isSubmitting ? 'Placing order...' : 'Place order'}
						</button>
					</form>

					<aside className='space-y-4'>
						<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm'>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Order summary</p>
							<div className='mt-4 space-y-3'>
								{cartItems.map((item) => (
									<div key={item.cartKey} className='flex items-start justify-between gap-4 text-sm'>
										<div>
											<p className='font-medium text-zinc-950'>{item.product.name}</p>
											<p className='text-zinc-500'>
												{formatCategoryLabel(item.product.category)} x {item.quantity}
											</p>
										</div>
										<p className='font-medium text-zinc-950'>
											{formatCurrency((item.product.discountPrice ?? item.product.price) * item.quantity)}
										</p>
									</div>
								))}
							</div>

							<div className='mt-4 border-t border-zinc-200 pt-4 text-sm'>
								<div className='flex items-center justify-between text-zinc-600'>
									<span>Subtotal</span>
									<span>{formatCurrency(summary.subtotal)}</span>
								</div>
								<div className='mt-2 flex items-center justify-between text-zinc-600'>
									<span>Shipping</span>
									<span>{summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping)}</span>
								</div>
								<div className='mt-3 flex items-center justify-between text-base font-semibold text-zinc-950'>
									<span>Total</span>
									<span>{formatCurrency(summary.total)}</span>
								</div>
							</div>
						</div>

						<div className='rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm'>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-400'>What happens next</p>
							<p className='mt-3 text-lg font-semibold'>Order confirmation and cart reset.</p>
							<p className='mt-2 text-sm leading-6 text-zinc-300'>
								Once the saga resolves, the order number will appear on the success page and the cart
								will be cleared.
							</p>
						</div>

						<div className='rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-5 shadow-sm'>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Back to shopping</p>
							<Link
								href='/products'
								className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline'
							>
								Continue browsing
								<ArrowRight className='size-4' />
							</Link>
						</div>
					</aside>
				</div>
			) : (
				<div className='rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm'>
					<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Checkout</p>
					<h2 className='mt-3 text-2xl font-semibold text-zinc-950'>Your cart is empty</h2>
					<p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600'>
						Add a product to the cart before checkout. The form and order summary will appear here
						once you have items ready.
					</p>
					<div className='mt-6 flex justify-center'>
						<Link
							href='/products'
							className='inline-flex items-center gap-2 rounded-full border border-zinc-950 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
						>
							Shop products
							<ArrowRight className='size-4' />
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
