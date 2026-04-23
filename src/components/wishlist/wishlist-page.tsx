'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { wishlistClear, wishlistToggleItem } from '@/redux/actions/wishlist/wishlistAction'
import { formatCategoryLabel } from '@/data/products'
import { formatCurrency } from '@/lib/format'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectWishlistItems } from '@/redux/selectors'

export function WishlistPage() {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectWishlistItems)

	return (
		<div className='space-y-8'>
			<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f7ecef_100%)] p-6 shadow-sm sm:p-8'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
					<div className='max-w-2xl space-y-3'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Wishlist</p>
						<h1 className='text-4xl font-semibold tracking-tight text-zinc-950'>
							Products you want to come back to.
						</h1>
						<p className='max-w-xl text-sm leading-6 text-zinc-600'>
							Saved items persist locally so shoppers can revisit them later without losing context.
						</p>
					</div>

					<div className='rounded-[1.25rem] border border-zinc-200 bg-white p-4 shadow-sm'>
						<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Saved items</p>
						<p className='mt-2 text-3xl font-semibold text-zinc-950'>{items.length}</p>
					</div>
				</div>
			</section>

			{items.length > 0 ? (
				<div className='space-y-4'>
					<div className='flex items-center justify-between gap-3'>
						<div>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Saved</p>
							<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Wishlist items</h2>
						</div>
						<button
							type='button'
							onClick={() => dispatch(wishlistClear())}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
						>
							Clear wishlist
						</button>
					</div>

					<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
						{items.map((item) => {
							const displayPrice = item.product.discountPrice ?? item.product.price

							return (
								<div
									key={item.product.slug}
									className='overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm'
								>
									<div className='relative aspect-[4/5] bg-zinc-100'>
										<Image
											src={item.product.thumbnail}
											alt={item.product.name}
											fill
											sizes='(max-width: 640px) 100vw, 33vw'
											className='object-cover'
										/>
									</div>
									<div className='space-y-4 p-5'>
										<div className='space-y-2'>
											<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>
												{formatCategoryLabel(item.product.category)}
											</p>
											<Link
												href={`/products/${item.product.slug}`}
												className='block text-lg font-semibold text-zinc-950 transition hover:text-zinc-700'
											>
												{item.product.name}
											</Link>
											<p className='text-sm leading-6 text-zinc-600'>
												{item.product.rating.toFixed(1)} rating | {item.product.reviewCount} reviews
											</p>
										</div>

										<div className='flex items-center justify-between gap-3'>
											<div>
												<p className='text-lg font-semibold text-zinc-950'>
													{formatCurrency(displayPrice)}
												</p>
												{item.product.discountPrice ? (
													<p className='text-xs text-zinc-400 line-through'>
														{formatCurrency(item.product.price)}
													</p>
												) : null}
											</div>

											<button
												type='button'
												onClick={() => dispatch(wishlistToggleItem({ product: item.product }))}
												className='inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:border-rose-500 hover:bg-rose-100'
											>
												<Trash2 className='size-3.5' />
												Remove
											</button>
										</div>

										<Link
											href={`/products/${item.product.slug}`}
											className='inline-flex items-center gap-2 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline'
										>
											<ShoppingBag className='size-4' />
											Open product page
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			) : (
				<div className='rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm'>
					<div className='mx-auto grid size-16 place-items-center rounded-full bg-zinc-100 text-zinc-950'>
						<Heart className='size-6' />
					</div>
					<h2 className='mt-5 text-2xl font-semibold text-zinc-950'>Your wishlist is empty</h2>
					<p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600'>
						Use the heart button on product cards or product pages to save items here.
					</p>
					<div className='mt-6 flex flex-wrap justify-center gap-3'>
						<Link
							href='/products'
							className='inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
						>
							Browse products
							<ArrowRight className='size-4' />
						</Link>
						<Link
							href='/cart'
							className='rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
						>
							Go to cart
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
