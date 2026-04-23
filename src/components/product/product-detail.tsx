'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
	ArrowLeft,
	ArrowUpRight,
	Check,
	Minus,
	Plus,
	ShoppingBag,
	ShieldCheck,
	Star
} from 'lucide-react'
import type { Product } from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { cartAddItem, cartRemoveItem, cartUpdateQuantity } from '@/redux/actions/cart/cartAction'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectCartItemByKey } from '@/redux/selectors'
import { WishlistToggle } from '@/components/wishlist/wishlist-toggle'

interface ProductDetailProps {
	product: Product
	relatedProducts: Product[]
}

function getDefaultVariants(product: Product) {
	return product.variants.reduce<Record<string, string>>((accumulator, variant) => {
		accumulator[variant.label] = variant.value
		return accumulator
	}, {})
}

function buildCartKey(productSlug: string, selectedVariants: Record<string, string>) {
	const variantSuffix = Object.entries(selectedVariants)
		.sort(([first], [second]) => first.localeCompare(second))
		.map(([label, value]) => `${label}:${value}`)
		.join('|')

	return `${productSlug}__${variantSuffix}`
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
	const dispatch = useAppDispatch()
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)

	const selectedImage = product.images[selectedImageIndex] ?? product.images[0]
	const hasDiscount = typeof product.discountPrice === 'number'
	const displayPrice = product.discountPrice ?? product.price
	const savings = hasDiscount && typeof product.discountPrice === 'number' ? product.price - product.discountPrice : 0
	const isSoldOut = product.stock === 0

	const defaultVariants = useMemo(() => getDefaultVariants(product), [product])
	const cartKey = useMemo(() => buildCartKey(product.slug, defaultVariants), [defaultVariants, product.slug])
	const cartItem = useAppSelector((state) => selectCartItemByKey(state, cartKey))
	const cartQuantity = cartItem?.quantity ?? 0
	const hasCartItem = cartQuantity > 0

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-2 text-sm text-zinc-500'>
				<Link href='/products' className='inline-flex items-center gap-2 transition hover:text-zinc-950'>
					<ArrowLeft className='size-4' />
					Back to products
				</Link>
				<span>/</span>
				<span className='text-zinc-950'>{formatCategoryLabel(product.category)}</span>
			</div>

			<section className='grid gap-5 lg:grid-cols-[1fr_0.92fr]'>
				<div className='space-y-2.5'>
					<div className='mx-auto w-full max-w-[500px] overflow-hidden rounded-[1.65rem] border border-zinc-200 bg-white p-2 shadow-sm'>
						<div className='relative aspect-[0.9/1] overflow-hidden rounded-[1.2rem] bg-[linear-gradient(180deg,#f7f2eb_0%,#e8dfd0_100%)]'>
							<Image
								src={selectedImage.src}
								alt={selectedImage.alt}
								fill
								sizes='(max-width: 1024px) 100vw, 50vw'
								className='object-contain p-3.5'
								priority
							/>
							<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.12),transparent_30%)]' />
							<div className='absolute left-3 top-3 flex flex-wrap gap-2'>
								<span className='rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-700'>
									{formatCategoryLabel(product.category)}
								</span>
								{hasDiscount ? (
									<span className='rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white'>
										Save {formatCurrency(savings)}
									</span>
								) : null}
							</div>
						</div>
					</div>

					{product.images.length > 1 ? (
						<div className='grid grid-cols-4 gap-2'>
							{product.images.map((image, index) => (
								<button
									key={image.id}
									type='button'
									onClick={() => setSelectedImageIndex(index)}
									aria-pressed={selectedImageIndex === index}
									aria-label={`View ${image.alt}`}
									className={cn(
										'cursor-pointer rounded-xl border p-1.5 transition',
										selectedImageIndex === index
											? 'border-zinc-950 bg-white shadow-sm'
											: 'border-zinc-200 bg-white/70 hover:border-zinc-500'
									)}
								>
									<div className='relative aspect-square overflow-hidden rounded-lg bg-zinc-100'>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											sizes='(max-width: 640px) 25vw, 112px'
											className='object-cover'
										/>
									</div>
								</button>
							))}
						</div>
					) : null}
				</div>

				<div className='space-y-4'>
					<div className='flex flex-wrap items-center gap-3'>
						<div className='inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500'>
							<Star className='size-3.5 fill-current text-amber-400' />
							{product.rating.toFixed(1)} rating
						</div>
						<div className='inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500'>
							<Check className='size-3.5' />
							{product.reviewCount} reviews
						</div>
						<div className='inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-zinc-500'>
							<ShieldCheck className='size-3.5' />
							{isSoldOut ? 'Sold out' : `${product.stock} available`}
						</div>
					</div>

					<div className='space-y-2.5'>
						<div className='flex flex-wrap items-start justify-between gap-3'>
							<div className='space-y-2'>
								<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Product detail</p>
								<h1 className='max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl'>
									{product.name}
								</h1>
							</div>
							<WishlistToggle
								product={product}
								className='border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
								label='Save this product'
							/>
						</div>
						<p className='max-w-2xl text-sm leading-6 text-zinc-600'>{product.description}</p>
					</div>

					<div className='grid gap-3 sm:grid-cols-[0.92fr_1.08fr]'>
						<div className='rounded-[1.35rem] border border-zinc-200 bg-white p-4 shadow-sm'>
							<p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>Price</p>
							<div className='mt-2 flex flex-wrap items-end gap-2.5'>
								<p className='text-2xl font-semibold text-zinc-950'>{formatCurrency(displayPrice)}</p>
								{hasDiscount ? (
									<p className='text-sm text-zinc-400 line-through'>{formatCurrency(product.price)}</p>
								) : null}
							</div>
							{hasDiscount ? (
								<p className='mt-2 text-sm font-medium text-emerald-700'>
									You save {formatCurrency(savings)}
								</p>
							) : null}
						</div>

						<div className='rounded-[1.35rem] border border-zinc-200 bg-white p-4 shadow-sm'>
							{hasCartItem ? (
								<div className='space-y-2.5'>
									<div className='flex items-center justify-between gap-3'>
										<div>
											<p className='text-sm font-medium text-zinc-950'>In cart</p>
											<p className='text-xs text-zinc-500'>Adjust quantity or remove it</p>
										</div>
										<button
											type='button'
											onClick={() => dispatch(cartRemoveItem({ cartKey }))}
											className='text-sm font-medium text-zinc-500 transition hover:text-zinc-950'
										>
											Remove
										</button>
									</div>

									<div className='flex h-10 items-center justify-between rounded-full border border-zinc-200 bg-zinc-50 p-1'>
										<button
											type='button'
											aria-label='Decrease quantity'
											onClick={() => {
												if (cartQuantity === 1) {
													dispatch(cartRemoveItem({ cartKey }))
													return
												}

												dispatch(
													cartUpdateQuantity({
														cartKey,
														quantity: cartQuantity - 1
													})
												)
											}}
											className={cn(
												'grid size-8.5 place-items-center rounded-full bg-white text-zinc-950 transition',
												cartQuantity > 1 ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-not-allowed opacity-40'
											)}
										>
											<Minus className='size-4' />
										</button>
										<p className='min-w-10 text-center text-sm font-medium text-zinc-950'>
											{cartQuantity}
										</p>
										<button
											type='button'
											aria-label='Increase quantity'
											onClick={() =>
												dispatch(
													cartUpdateQuantity({
														cartKey,
														quantity: cartQuantity + 1
													})
												)
											}
											className='grid size-8.5 place-items-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-100'
										>
											<Plus className='size-4' />
										</button>
									</div>
								</div>
							) : (
								<div className='space-y-2.5'>
									<button
										type='button'
										disabled={isSoldOut}
										onClick={() =>
											dispatch(
												cartAddItem({
													product,
													quantity: 1,
													selectedVariants: defaultVariants
												})
											)
										}
										className={cn(
											'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition',
											isSoldOut
												? 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400'
												: 'border-zinc-950 bg-white text-zinc-950 hover:border-zinc-700 hover:bg-zinc-50'
										)}
									>
										<ShoppingBag className='size-4' />
										{isSoldOut ? 'Notify me' : 'Add to cart'}
									</button>
									<p className='text-xs leading-5 text-zinc-500'>
										One tap adds the default selection to your cart.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className='space-y-4'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Related</p>
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Recommended products</h2>
					</div>
				</div>
				{relatedProducts.length > 0 ? (
					<div className='no-scrollbar overflow-x-auto pb-2'>
						<div className='flex gap-2.5'>
							{relatedProducts.map((relatedProduct) => (
								<Link
									key={relatedProduct.id}
									href={`/products/${relatedProduct.slug}`}
									className='flex w-[200px] shrink-0 items-center gap-2.5 rounded-[1.2rem] border border-zinc-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
								>
									<div className='relative size-14 overflow-hidden rounded-xl bg-[linear-gradient(180deg,#f7f2eb_0%,#e8dfd0_100%)]'>
										<Image
											src={relatedProduct.thumbnail}
											alt={relatedProduct.name}
											fill
											sizes='56px'
											className='object-contain p-1.5'
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<p className='line-clamp-2 text-[0.8125rem] font-medium leading-5 text-zinc-950'>
											{relatedProduct.name}
										</p>
										<p className='mt-1 text-sm font-semibold text-zinc-950'>
											{formatCurrency(relatedProduct.discountPrice ?? relatedProduct.price)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				) : (
					<div className='rounded-[1.5rem] border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm'>
						No related products available right now.
					</div>
				)}
			</section>
		</div>
	)
}
