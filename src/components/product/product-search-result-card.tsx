'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo, useMemo } from 'react'
import { BadgeCheck, Minus, Plus, ShoppingBag, ShieldCheck, Star } from 'lucide-react'
import type { Product } from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { cartAddItem, cartRemoveItem, cartUpdateQuantity } from '@/redux/actions/cart/cartAction'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectCartItemByKey } from '@/redux/selectors'
import { WishlistToggle } from '@/components/wishlist/wishlist-toggle'

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

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedText({
	text,
	query
}: {
	text: string
	query: string
}) {
	if (!query.trim()) {
		return <>{text}</>
	}

	const escapedQuery = escapeRegExp(query.trim())
	const segments = text.split(new RegExp(`(${escapedQuery})`, 'ig'))

	return (
		<>
			{segments.map((segment, index) =>
				segment.toLowerCase() === query.trim().toLowerCase() ? (
					<mark key={`${segment}-${index}`} className='rounded-[0.2rem] bg-amber-200/80 px-1 py-0.5 text-zinc-950'>
						{segment}
					</mark>
				) : (
					<span key={`${segment}-${index}`}>{segment}</span>
				)
			)}
		</>
	)
}

interface ProductSearchResultCardProps {
	product: Product
	query?: string
}

function ProductSearchResultCardBase({ product, query = '' }: ProductSearchResultCardProps) {
	const dispatch = useAppDispatch()
	const defaultVariants = useMemo(() => getDefaultVariants(product), [product])
	const cartKey = useMemo(() => buildCartKey(product.slug, defaultVariants), [defaultVariants, product.slug])
	const cartItem = useAppSelector((state) => selectCartItemByKey(state, cartKey))
	const cartQuantity = cartItem?.quantity ?? 0
	const hasCartItem = cartQuantity > 0
	const hasDiscount = typeof product.discountPrice === 'number'
	const displayPrice = product.discountPrice ?? product.price
	const savings =
		hasDiscount && typeof product.discountPrice === 'number' ? product.price - product.discountPrice : 0

	return (
		<article className='grid gap-2.5 rounded-[1.4rem] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)] p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md md:grid-cols-[150px_1fr] md:gap-3.5 md:p-4'>
			<Link href={`/products/${product.slug}`} className='block'>
				<div className='relative aspect-[0.9/1] overflow-hidden rounded-[1.05rem] bg-[linear-gradient(180deg,#f7f2eb_0%,#e8dfd0_100%)] md:aspect-square md:rounded-[1.15rem]'>
					<Image
						src={product.thumbnail}
						alt={product.name}
						fill
						sizes='(max-width: 768px) 92vw, 150px'
						className='object-contain p-2.5 md:p-3'
					/>
					<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.12),transparent_30%)]' />
					<div className='absolute left-3 top-3'>
						<span className='rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-700 shadow-sm backdrop-blur'>
							{formatCategoryLabel(product.category)}
						</span>
					</div>
					<div className='absolute right-3 top-3'>
						<WishlistToggle
							product={product}
							compact
							className='border-zinc-200 bg-white/90 text-zinc-600 shadow-sm backdrop-blur hover:border-zinc-950 hover:text-zinc-950'
							label='Save this product'
						/>
					</div>
				</div>
			</Link>

			<div className='flex min-w-0 flex-col gap-2 md:gap-2.5'>
				<div className='space-y-1'>
					<div className='flex flex-wrap items-start justify-between gap-3'>
						<Link href={`/products/${product.slug}`} className='min-w-0 flex-1'>
							<h2 className='line-clamp-2 text-[0.95rem] font-semibold leading-5 text-zinc-950 transition hover:text-zinc-700 md:line-clamp-1 md:text-[1.02rem] md:leading-6'>
								<HighlightedText text={product.name} query={query} />
							</h2>
						</Link>
						<div className='inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700'>
							<Star className='size-3.5 fill-current text-amber-400' />
							{product.rating.toFixed(1)}
						</div>
					</div>

					<div className='flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 md:text-[11px] md:tracking-[0.22em]'>
						<span>{product.brand}</span>
						<span aria-hidden='true'>·</span>
						<span>{formatCategoryLabel(product.category)}</span>
						<span aria-hidden='true'>·</span>
						<span>{product.reviewCount} ratings</span>
					</div>

					<p className='line-clamp-2 text-[0.8rem] leading-5 text-zinc-600 md:line-clamp-1 md:text-[0.9rem] md:leading-6'>
						<HighlightedText text={product.description} query={query} />
					</p>
				</div>

				<div className='flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 md:text-xs'>
					<div className='inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1 font-medium text-zinc-600 shadow-sm md:px-3'>
						<BadgeCheck className='size-3.5' />
						{product.features[0]}
					</div>
					<div className='inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-white px-2.5 py-1 font-medium text-zinc-600 shadow-sm md:px-3'>
						<ShieldCheck className='size-3.5' />
						{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
					</div>
				</div>

				<div className='mt-auto flex flex-wrap items-end justify-between gap-2.5 border-t border-zinc-100 pt-2 md:pt-2.5'>
					<div className='space-y-1'>
						<div className='flex flex-wrap items-end gap-2'>
							<p className='text-lg font-semibold text-zinc-950 md:text-[1.7rem]'>
								{formatCurrency(displayPrice)}
							</p>
							{hasDiscount ? (
								<p className='text-xs text-zinc-400 line-through md:text-sm'>{formatCurrency(product.price)}</p>
							) : null}
						</div>
						{hasDiscount ? (
							<p className='text-xs font-medium text-emerald-700'>Save {formatCurrency(savings)}</p>
						) : null}
					</div>

					{hasCartItem ? (
						<div className='flex h-10 items-center justify-between rounded-full border border-zinc-200 bg-white p-1 shadow-sm'>
							<button
								type='button'
								aria-label={`Decrease quantity for ${product.name}`}
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
									'grid size-8 place-items-center rounded-full bg-white text-zinc-950 transition',
									cartQuantity > 1 ? 'cursor-pointer hover:bg-zinc-100' : 'cursor-not-allowed opacity-40'
								)}
							>
								<Minus className='size-4' />
							</button>
							<p className='min-w-8 text-center text-sm font-medium text-zinc-950'>{cartQuantity}</p>
							<button
								type='button'
								aria-label={`Increase quantity for ${product.name}`}
								onClick={() =>
									dispatch(
										cartUpdateQuantity({
											cartKey,
											quantity: cartQuantity + 1
										})
									)
								}
								className='grid size-8 place-items-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-100'
							>
								<Plus className='size-4' />
							</button>
						</div>
					) : (
						<button
							type='button'
							onClick={() =>
								dispatch(
									cartAddItem({
										product,
										quantity: 1,
										selectedVariants: defaultVariants
									})
								)
							}
							className='inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 shadow-sm transition hover:border-zinc-950 hover:bg-zinc-50'
						>
							<ShoppingBag className='size-4' />
							Add to cart
						</button>
					)}
				</div>
			</div>
		</article>
	)
}

export const ProductSearchResultCard = memo(ProductSearchResultCardBase)
