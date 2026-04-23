'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, BadgeCheck, Minus, Plus, Star, ShoppingBag } from 'lucide-react'
import { useMemo } from 'react'
import type { Product } from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { formatCurrency } from '@/lib/format'
import { WishlistToggle } from '@/components/wishlist/wishlist-toggle'
import { cartAddItem, cartRemoveItem, cartUpdateQuantity } from '@/redux/actions/cart/cartAction'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectCartItems } from '@/redux/selectors'
import { cn } from '@/lib/utils'

interface ProductCardProps {
	product: Product
	featured?: boolean
	compact?: boolean
	showActions?: boolean
	highlightQuery?: string
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

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedText({
	text,
	query,
	className
}: {
	text: string
	query: string
	className?: string
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
					<mark
						key={`${segment}-${index}`}
						className={cn(
							'rounded-[0.2rem] bg-amber-200/80 px-1 py-0.5 text-zinc-950',
							className
						)}
					>
						{segment}
					</mark>
				) : (
					<span key={`${segment}-${index}`}>{segment}</span>
				)
			)}
		</>
	)
}

export function ProductCard({
	product,
	featured = false,
	compact = false,
	showActions = true,
	highlightQuery = ''
}: ProductCardProps) {
	const dispatch = useAppDispatch()
	const cartItems = useAppSelector(selectCartItems)
	const hasDiscount = typeof product.discountPrice === 'number'
	const displayPrice: number = product.discountPrice ?? product.price
	const savings =
		hasDiscount && typeof product.discountPrice === 'number'
			? product.price - product.discountPrice
			: 0
	const discountPercent = hasDiscount
		? Math.round((savings / product.price) * 100)
		: 0

	const defaultVariants = useMemo(() => getDefaultVariants(product), [product])
	const cartKey = useMemo(
		() => buildCartKey(product.slug, defaultVariants),
		[defaultVariants, product.slug]
	)
	const cartItem = cartItems.find((item) => item.cartKey === cartKey)
	const cartQuantity = cartItem?.quantity ?? 0
	const hasCartItem = cartQuantity > 0
	const imagePaddingClass = compact ? 'p-2' : 'p-4'

	return (
			<article
			className={cn(
				'group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl',
				compact ? 'min-h-[310px] w-[224px] min-w-[224px] shrink-0 snap-start sm:w-[240px] sm:min-w-[240px]' : ''
			)}
		>
			<Link href={`/products/${product.slug}`} className='block'>
				<div
					className={cn(
						'relative overflow-hidden bg-[linear-gradient(180deg,#f6f2eb_0%,#ece3d7_100%)]',
						compact ? 'h-[150px]' : 'aspect-[4/5]'
					)}
				>
					<Image
						src={product.thumbnail}
						alt={product.name}
						fill
						sizes={compact ? '(max-width: 640px) 80vw, 240px' : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw'}
						className={cn(
							'object-contain transition duration-500 group-hover:scale-[1.01]',
							imagePaddingClass
						)}
						style={compact ? { objectPosition: 'center 52%' } : undefined}
						priority={featured}
					/>
					<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.12),transparent_30%)]' />
					<div className='absolute left-2 right-2 top-2 flex items-center justify-between gap-2'>
						<div className='flex flex-wrap gap-1.5'>
							<span className='inline-flex h-7 items-center rounded-full bg-white/90 px-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-700 shadow-sm backdrop-blur'>
								{formatCategoryLabel(product.category)}
							</span>
						</div>
						<WishlistToggle product={product} compact />
					</div>
					{compact ? null : (
						<div className='absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/60 bg-white/80 p-4 backdrop-blur'>
							<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>In stock</p>
							<div className='mt-2 flex items-center justify-between gap-3'>
								<div>
									<p className='text-sm font-medium text-zinc-950'>{product.stock} units</p>
									<p className='text-xs text-zinc-500'>{product.reviewCount} reviews</p>
								</div>
								<div className='grid size-10 place-items-center rounded-full bg-zinc-950 text-white'>
									<ArrowUpRight className='size-4' />
								</div>
							</div>
							{hasDiscount ? (
								<p className='mt-3 text-xs uppercase tracking-[0.25em] text-emerald-700'>
									Save {formatCurrency(savings)}
								</p>
							) : null}
						</div>
					)}
				</div>

					<div className={cn('flex flex-1 flex-col', compact ? 'gap-2.5 p-2.5' : 'gap-2.5 p-5')}>
					<div className={cn('space-y-1.5', compact && 'space-y-1')}>
						<div className={cn('flex gap-3', compact ? 'items-start justify-between' : 'items-start justify-between')}>
							<p className={cn('font-semibold text-zinc-950', compact ? 'line-clamp-2 text-sm leading-5' : 'text-base')}>
								<HighlightedText text={product.name} query={highlightQuery} />
							</p>
							{!compact ? (
								<div className='inline-flex items-center gap-1 text-xs font-medium text-zinc-700'>
									<Star className='size-3.5 fill-current text-amber-400' />
									{product.rating.toFixed(1)}
								</div>
							) : null}
						</div>
						{compact ? (
							<p className='line-clamp-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500'>
								By {product.brand}
							</p>
						) : (
							<p className='line-clamp-2 text-sm leading-6 text-zinc-600'>
								<HighlightedText text={product.description} query={highlightQuery} />
							</p>
						)}
					</div>

					<div className={cn('mt-auto flex items-end justify-between gap-3', compact && 'items-center')}>
						<div className='space-y-1'>
							{compact ? (
								<div className='flex items-center gap-1.5'>
									<span className='text-[10px] uppercase tracking-[0.18em] text-zinc-500'>MRP</span>
									<p className='text-xs font-medium text-zinc-400 line-through'>
										{formatCurrency(product.price)}
									</p>
									{hasDiscount ? (
										<span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700'>
											{discountPercent}% OFF
										</span>
									) : null}
								</div>
							) : (
								<div className='inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500'>
									<BadgeCheck className='size-3.5' />
									{product.features[0]}
								</div>
							)}
							<div className='flex items-center gap-2'>
								<p className={cn('font-semibold text-zinc-950', compact ? 'text-sm leading-none' : 'text-lg')}>
									{formatCurrency(displayPrice)}
								</p>
								{!compact && hasDiscount ? (
									<p className='text-xs text-zinc-400 line-through'>
										{formatCurrency(product.price)}
									</p>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</Link>

			{showActions ? (
				<div className={cn('border-t border-zinc-200 bg-zinc-50 px-3', compact ? 'h-[70px] py-2' : 'h-[82px] py-3')}>
					{hasCartItem ? (
						<div className='flex h-full flex-col justify-center gap-2'>
							<div className='flex h-[46px] w-full items-center justify-between rounded-full border border-zinc-200 bg-white p-0.5'>
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
									className='grid size-9 cursor-pointer place-items-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-100'
								>
									<Minus className='size-4' />
								</button>
								<p className='min-w-10 text-center text-sm font-medium text-zinc-950'>
									{cartQuantity}
								</p>
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
									className='grid size-9 cursor-pointer place-items-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-100'
								>
									<Plus className='size-4' />
								</button>
							</div>
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
							className='inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full border border-zinc-950 bg-white px-5 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
							style={{ paddingTop: '0.125rem', paddingBottom: '0.125rem' }}
						>
							<ShoppingBag className='size-4' />
							Add to cart
						</button>
					)}
				</div>
			) : null}
		</article>
	)
}
