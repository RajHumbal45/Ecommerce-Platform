'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
	ArrowLeft,
	BadgeCheck,
	Check,
	Minus,
	Plus,
	ShieldCheck,
	Star,
	Truck
} from 'lucide-react'
import type { Product } from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { cartAddItem } from '@/redux/actions/cart/cartAction'
import { useAppDispatch } from '@/redux/hooks'
import { ProductGrid } from './product-grid'
import { WishlistToggle } from '@/components/wishlist/wishlist-toggle'

interface ProductDetailProps {
	product: Product
	relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
	const dispatch = useAppDispatch()
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const [quantity, setQuantity] = useState(1)
	const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
		() =>
			product.variants.reduce<Record<string, string>>((accumulator, variant) => {
				accumulator[variant.label] = variant.value
				return accumulator
			}, {})
	)

	const selectedImage = product.images[selectedImageIndex] ?? product.images[0]
	const savings = useMemo(
		() => (product.discountPrice ? product.price - product.discountPrice : 0),
		[product.discountPrice, product.price]
	)
	const displayPrice = product.discountPrice ?? product.price
	const selectedConfiguration = Object.entries(selectedVariants)
		.map(([label, value]) => `${label}: ${value}`)
		.join(' | ')
	const canDecreaseQuantity = quantity > 1
	const isSoldOut = product.stock === 0

	return (
		<div className='space-y-10'>
			<div className='flex items-center gap-2 text-sm text-zinc-500'>
				<Link href='/products' className='inline-flex items-center gap-2 transition hover:text-zinc-950'>
					<ArrowLeft className='size-4' />
					Back to products
				</Link>
				<span>/</span>
				<span className='text-zinc-950'>{formatCategoryLabel(product.category)}</span>
				<span>/</span>
				<span>{product.name}</span>
			</div>

			<section className='grid gap-8 lg:grid-cols-[1.05fr_0.95fr]'>
				<div className='space-y-4'>
					<div className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm'>
						<div className='relative aspect-square overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#f7f2eb_0%,#e8dfd0_100%)]'>
							<Image
								src={selectedImage.src}
								alt={selectedImage.alt}
								fill
								sizes='(max-width: 1024px) 100vw, 50vw'
								className='object-cover'
								priority
							/>
							<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.12),transparent_30%)]' />
							<div className='absolute left-4 top-4 flex flex-wrap gap-2'>
								<span className='rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-700'>
									{formatCategoryLabel(product.category)}
								</span>
								{product.discountPrice ? (
									<span className='rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white'>
										Save {formatCurrency(savings)}
									</span>
								) : null}
							</div>

							<div className='absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/60 bg-white/85 p-4 backdrop-blur'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Product image</p>
								<p className='mt-2 text-sm font-medium text-zinc-950'>{selectedImage.alt}</p>
								<p className='mt-1 text-xs text-zinc-500'>
									{selectedConfiguration || 'Configuration selected before checkout'}
								</p>
							</div>
						</div>
					</div>

					{product.images.length > 1 ? (
						<div className='grid grid-cols-3 gap-3'>
							{product.images.map((image, index) => (
								<button
									key={image.id}
									type='button'
									onClick={() => setSelectedImageIndex(index)}
									aria-pressed={selectedImageIndex === index}
									aria-label={`View ${image.alt}`}
									className={cn(
										'cursor-pointer rounded-2xl border p-2 transition',
										selectedImageIndex === index
											? 'border-zinc-950 bg-white'
											: 'border-zinc-200 bg-white/70 hover:border-zinc-500'
									)}
								>
									<div className='relative aspect-square overflow-hidden rounded-xl bg-zinc-100'>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											sizes='(max-width: 640px) 33vw, 160px'
											className='object-cover'
										/>
										<p className='absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1 text-left text-[10px] uppercase tracking-[0.2em] text-white'>
											{index + 1} / {product.images.length}
										</p>
									</div>
								</button>
							))}
						</div>
					) : null}
				</div>

				<div className='space-y-6'>
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
						</div>

						<div>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>
								{formatCategoryLabel(product.category)}
							</p>
							<div className='mt-3 flex flex-wrap items-start justify-between gap-3'>
								<h1 className='text-4xl font-semibold tracking-tight text-zinc-950'>
									{product.name}
								</h1>
								<WishlistToggle
									product={product}
									className='border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
									label='Save this product'
								/>
							</div>
							<p className='mt-4 max-w-2xl text-base leading-7 text-zinc-600'>
								{product.description}
							</p>
						</div>
					</div>

					<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'>
						<div className='flex items-end justify-between gap-4'>
							<div>
								<p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>Price</p>
								<div className='mt-2 flex items-center gap-3'>
									<p className='text-3xl font-semibold text-zinc-950'>
										{formatCurrency(displayPrice)}
									</p>
									{product.discountPrice ? (
										<p className='text-sm text-zinc-400 line-through'>
											{formatCurrency(product.price)}
										</p>
									) : null}
								</div>
								{product.discountPrice ? (
									<p className='mt-2 text-sm font-medium text-emerald-700'>
										You save {formatCurrency(savings)}
									</p>
								) : null}
							</div>
							<div className='rounded-2xl bg-zinc-950 px-4 py-3 text-right text-white'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-400'>Stock</p>
								<p className='mt-1 text-sm font-medium'>
									{isSoldOut ? 'Sold out' : `${product.stock} available`}
								</p>
							</div>
						</div>

						<div className='mt-6 grid gap-3 sm:grid-cols-3'>
							{[
								{ label: 'Category', value: formatCategoryLabel(product.category) },
								{ label: 'Reviews', value: `${product.reviewCount}` },
								{ label: 'Availability', value: product.stock > 0 ? 'In stock' : 'Sold out' }
							].map((item) => (
								<div key={item.label} className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>{item.label}</p>
									<p className='mt-2 text-sm font-medium text-zinc-950'>{item.value}</p>
								</div>
							))}
						</div>

						<div className='mt-6 grid gap-4 sm:grid-cols-2'>
							<div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
								<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
									<Truck className='size-4' />
									Delivery
								</div>
								<p className='mt-2 text-sm leading-6 text-zinc-600'>
									Estimated dispatch within 24 hours. Delivery window shown at checkout.
								</p>
							</div>
							<div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
								<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
									<ShieldCheck className='size-4' />
									Returns
								</div>
								<p className='mt-2 text-sm leading-6 text-zinc-600'>
									30-day return window and support for exchange or refund.
								</p>
							</div>
						</div>
					</div>

					<div className='space-y-4'>
						{product.variants.map((variant) => (
							<div key={variant.label} className='space-y-3'>
								<div className='flex items-center justify-between gap-4'>
									<p className='text-sm font-medium text-zinc-950'>{variant.label}</p>
									<p className='text-sm text-zinc-500'>{selectedVariants[variant.label]}</p>
								</div>
								<div className='flex flex-wrap gap-2'>
									{(variant.options ?? [variant.value]).map((option) => (
										<button
											key={`${variant.label}-${option}`}
											type='button'
											onClick={() =>
												setSelectedVariants((current) => ({
													...current,
													[variant.label]: option
												}))
											}
											className={cn(
												'rounded-full border px-4 py-2 text-sm font-medium transition',
												selectedVariants[variant.label] === option
													? 'border-zinc-950 bg-zinc-950 text-white'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											{option}
										</button>
									))}
								</div>
							</div>
						))}
					</div>

					<div className='grid gap-4 sm:grid-cols-[0.4fr_0.6fr]'>
						<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-sm'>
							<p className='text-sm font-medium text-zinc-950'>Quantity</p>
							<div className='mt-3 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-2'>
								<button
									type='button'
									onClick={() => setQuantity((current) => Math.max(1, current - 1))}
									disabled={!canDecreaseQuantity}
									className={cn(
										'grid size-10 place-items-center rounded-xl bg-white text-zinc-950 transition',
										canDecreaseQuantity ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-not-allowed opacity-40'
									)}
								>
									<Minus className='size-4' />
								</button>
								<p className='text-base font-medium text-zinc-950'>{quantity}</p>
								<button
									type='button'
									onClick={() => setQuantity((current) => current + 1)}
									className='grid size-10 place-items-center rounded-xl bg-white text-zinc-950 transition hover:bg-zinc-100'
								>
									<Plus className='size-4' />
								</button>
							</div>
						</div>

						<div className='flex flex-col gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-950 p-4 text-white shadow-sm'>
							<button
								type='button'
								disabled={isSoldOut}
								onClick={() =>
									dispatch(
										cartAddItem({
											product,
											quantity,
											selectedVariants
										})
									)
								}
								className={cn(
									'rounded-full px-5 py-3 text-sm font-medium text-zinc-950 transition',
									isSoldOut
										? 'cursor-not-allowed bg-white/60 opacity-60'
										: 'cursor-pointer bg-white hover:bg-zinc-100'
								)}
							>
								{isSoldOut ? 'Notify me' : 'Add to cart'}
							</button>
							<button
								type='button'
								className='cursor-pointer rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10'
							>
								Buy now
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
				<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'>
					<div className='flex items-center gap-2'>
						<BadgeCheck className='size-4 text-zinc-950' />
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Features</p>
					</div>
					<ul className='mt-5 space-y-3'>
						{product.features.map((feature) => (
							<li key={feature} className='flex items-start gap-3 text-sm text-zinc-600'>
								<span className='mt-1 grid size-5 place-items-center rounded-full bg-zinc-950 text-white'>
									<Check className='size-3' />
								</span>
								{feature}
							</li>
						))}
					</ul>
				</div>

				<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'>
					<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>What you get</p>
					<div className='mt-5 grid gap-4 sm:grid-cols-3'>
						{[
							{
								title: 'Quick dispatch',
								copy: 'Fast shipping-friendly operations.'
							},
							{
								title: 'Secure checkout',
								copy: 'Future checkout is designed to feel trusted.'
							},
							{
								title: 'Easy returns',
								copy: 'Policy copy is surfaced before purchase.'
							}
						].map((item) => (
							<div key={item.title} className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
								<p className='text-sm font-medium text-zinc-950'>{item.title}</p>
								<p className='mt-2 text-sm leading-6 text-zinc-600'>{item.copy}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
					<div className='max-w-2xl'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-400'>Checkout context</p>
						<h2 className='mt-2 text-2xl font-semibold'>Prepared for a clean purchase handoff.</h2>
						<p className='mt-3 text-sm leading-6 text-zinc-300'>
							This detail page already surfaces the key signals a shopper needs before checkout:
							price, savings, stock, delivery, returns, and configuration.
						</p>
					</div>
					<div className='grid gap-3 sm:min-w-64'>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-xs uppercase tracking-[0.3em] text-zinc-400'>Quantity selected</p>
							<p className='mt-2 text-lg font-medium'>{quantity}</p>
						</div>
						<div className='rounded-2xl bg-white/10 p-4'>
							<p className='text-xs uppercase tracking-[0.3em] text-zinc-400'>Configuration</p>
							<p className='mt-2 text-sm leading-6 text-zinc-200'>{selectedConfiguration}</p>
						</div>
					</div>
				</div>
			</section>

			<section className='space-y-5'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Related</p>
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Recommended products</h2>
					</div>
				</div>
				{relatedProducts.length > 0 ? (
					<ProductGrid products={relatedProducts} />
				) : (
					<div className='rounded-[1.5rem] border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm'>
						No related products available right now.
					</div>
				)}
			</section>
		</div>
	)
}
