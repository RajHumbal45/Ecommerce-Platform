'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
	cartClear,
	cartRemoveItem,
	cartUpdateQuantity
} from '@/redux/actions/cart/cartAction'
import { formatCurrency } from '@/lib/format'
import { formatCategoryLabel } from '@/data/products'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
	FREE_SHIPPING_THRESHOLD,
	selectCartCount,
	selectCartItems,
	selectCartShipping,
	selectCartSubtotal,
	selectCartTotal,
	selectCartQuantityCount
} from '@/redux/selectors'

export function CartPage() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectCartItems)
	const subtotal = useAppSelector(selectCartSubtotal)
	const shipping = useAppSelector(selectCartShipping)
	const total = useAppSelector(selectCartTotal)
	const totalItems = useAppSelector(selectCartCount)
	const totalQuantity = useAppSelector(selectCartQuantityCount)
	const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

	return (
		<div className='space-y-8'>
			<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f6f1e8_100%)] p-6 shadow-sm sm:p-8'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
					<div className='max-w-2xl space-y-3'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Cart</p>
						<h1 className='text-4xl font-semibold tracking-tight text-zinc-950'>
							Review your selection before checkout.
						</h1>
						<p className='max-w-xl text-sm leading-6 text-zinc-600'>
							Persistent cart state, quantity controls, and a clear order summary keep the purchase
							flow predictable.
						</p>
					</div>

					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
						{[
							{ label: 'Items', value: totalItems },
							{ label: 'Qty', value: totalQuantity },
							{ label: 'Subtotal', value: formatCurrency(subtotal) },
							{ label: 'Shipping', value: shipping === 0 ? 'Free' : formatCurrency(shipping) }
						].map((item) => (
							<div key={item.label} className='rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-sm'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>{item.label}</p>
								<p className='mt-2 text-lg font-semibold text-zinc-950'>{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{items.length > 0 ? (
				<div className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between gap-3'>
							<div>
								<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Items</p>
								<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Your cart</h2>
							</div>
							<button
								type='button'
								onClick={() => dispatch(cartClear())}
								className='cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
							>
								Clear cart
							</button>
						</div>

						<div className='space-y-4'>
							{items.map((item) => {
								const displayPrice = item.product.discountPrice ?? item.product.price
								const lineTotal = displayPrice * item.quantity
								const canDecrease = item.quantity > 1

								return (
									<div
										key={item.cartKey}
										className='overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm'
									>
										<div className='grid gap-4 p-4 sm:grid-cols-[120px_1fr] sm:p-5'>
											<div className='relative aspect-square overflow-hidden rounded-[1.25rem] bg-zinc-100'>
												<Image
													src={item.product.thumbnail}
													alt={item.product.name}
													fill
													sizes='(max-width: 640px) 100vw, 120px'
													className='object-cover'
												/>
											</div>

											<div className='space-y-4'>
												<div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
													<div>
														<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>
															{formatCategoryLabel(item.product.category)}
														</p>
														<Link
															href={`/products/${item.product.slug}`}
															className='mt-1 inline-flex text-lg font-semibold text-zinc-950 transition hover:text-zinc-700'
														>
															{item.product.name}
														</Link>
														<div className='mt-3 flex flex-wrap gap-2'>
															{Object.entries(item.selectedVariants).map(([label, value]) => (
																<span
																	key={`${item.cartKey}-${label}`}
																	className='rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600'
																>
																	{label}: {value}
																</span>
															))}
														</div>
													</div>

													<button
														type='button'
														onClick={() => dispatch(cartRemoveItem({ cartKey: item.cartKey }))}
														className='inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
													>
														<Trash2 className='size-3.5' />
														Remove
													</button>
												</div>

												<div className='flex flex-col gap-4 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
													<div className='flex items-center gap-3'>
														<div className='rounded-2xl bg-zinc-950 px-4 py-3 text-white'>
															<p className='text-[10px] uppercase tracking-[0.3em] text-zinc-400'>
																Unit
															</p>
															<p className='mt-1 text-sm font-medium'>
																{formatCurrency(displayPrice)}
															</p>
														</div>
														<div className='rounded-2xl bg-zinc-50 px-4 py-3'>
															<p className='text-[10px] uppercase tracking-[0.3em] text-zinc-500'>
																Line total
															</p>
															<p className='mt-1 text-sm font-semibold text-zinc-950'>
																{formatCurrency(lineTotal)}
															</p>
														</div>
													</div>

													<div className='flex items-center gap-3'>
														<button
															type='button'
															aria-label={`Decrease quantity for ${item.product.name}`}
															disabled={!canDecrease}
															onClick={() =>
																dispatch(
																	cartUpdateQuantity({
																		cartKey: item.cartKey,
																		quantity: item.quantity - 1
																	})
																)
															}
															className={cn(
																'grid size-10 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-950 transition',
																canDecrease
																	? 'cursor-pointer hover:border-zinc-950'
																	: 'cursor-not-allowed opacity-40'
															)}
														>
															<Minus className='size-4' />
														</button>
														<p className='min-w-10 text-center text-base font-medium text-zinc-950'>
															{item.quantity}
														</p>
														<button
															type='button'
															aria-label={`Increase quantity for ${item.product.name}`}
															onClick={() =>
																dispatch(
																	cartUpdateQuantity({
																		cartKey: item.cartKey,
																		quantity: item.quantity + 1
																	})
																)
															}
															className='grid size-10 cursor-pointer place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-950 transition hover:border-zinc-950'
														>
															<Plus className='size-4' />
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<aside className='space-y-4'>
						<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm'>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Summary</p>
							<div className='mt-4 space-y-3 text-sm'>
								<div className='flex items-center justify-between text-zinc-600'>
									<span>Subtotal</span>
									<span>{formatCurrency(subtotal)}</span>
								</div>
								<div className='flex items-center justify-between text-zinc-600'>
									<span>Shipping</span>
									<span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
								</div>
								<div className='flex items-center justify-between border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-950'>
									<span>Total</span>
									<span>{formatCurrency(total)}</span>
								</div>
							</div>

							<div className='mt-4 rounded-2xl bg-zinc-50 p-4'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Shipping note</p>
								<p className='mt-2 text-sm leading-6 text-zinc-600'>
									{shipping === 0
										? 'You qualify for free delivery.'
										: `Add ${formatCurrency(remainingForFreeShipping)} more for free shipping.`}
								</p>
							</div>

							<Link
								href='/checkout'
								className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-950 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
							>
								Proceed to checkout
								<ArrowRight className='size-4' />
							</Link>
						</div>

						<div className='rounded-[1.75rem] border border-zinc-200 bg-[linear-gradient(180deg,#111827_0%,#030712_100%)] p-5 text-white shadow-sm'>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-400'>Why this cart works</p>
							<p className='mt-3 text-lg font-semibold'>Persistent, variant-aware, and ready for checkout.</p>
							<p className='mt-2 text-sm leading-6 text-zinc-300'>
								Selections survive reloads, item quantities stay in sync, and the total cost updates
								without relying on a backend.
							</p>
						</div>
					</aside>
				</div>
			) : (
				<div className='overflow-hidden rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm'>
					<div className='mx-auto grid size-16 place-items-center rounded-full bg-zinc-100 text-zinc-950'>
						<ShoppingBag className='size-6' />
					</div>
					<h2 className='mt-5 text-2xl font-semibold text-zinc-950'>Your cart is empty</h2>
					<p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600'>
						Go back to the catalog, pick a product, and add it with the options you want. The cart
						will keep the item selection for you.
					</p>
					<div className='mt-6 flex flex-wrap justify-center gap-3'>
						<Link
							href='/products'
							className='inline-flex items-center gap-2 rounded-full border border-zinc-950 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
						>
							Shop products
							<ArrowRight className='size-4' />
						</Link>
						<Link
							href='/'
							className='rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
						>
							Back to home
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
