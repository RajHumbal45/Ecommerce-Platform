import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, Star } from 'lucide-react'
import type { Product } from '@/data/products'
import { formatCurrency } from '@/lib/format'

interface ProductCardProps {
	product: Product
	featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
	const hasDiscount = typeof product.discountPrice === 'number'
	const displayPrice: number = product.discountPrice ?? product.price

	return (
		<Link
			href={`/products/${product.slug}`}
			className='group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl'
		>
			<div className='relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,#f6f2eb_0%,#ece3d7_100%)]'>
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.12),transparent_30%)]' />
				<div className='absolute left-4 top-4 flex flex-wrap gap-2'>
					<span className='rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-700'>
						{product.category}
					</span>
					{featured ? (
						<span className='rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white'>
							Featured
						</span>
					) : null}
				</div>
				<div className='absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/60 bg-white/80 p-4 backdrop-blur'>
					<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>In stock</p>
					<div className='mt-2 flex items-center justify-between gap-3'>
						<div>
							<p className='text-sm font-medium text-zinc-950'>{product.stock} units</p>
							<p className='text-xs text-zinc-500'>
								{product.reviewCount} reviews
							</p>
						</div>
						<div className='grid size-10 place-items-center rounded-full bg-zinc-950 text-white'>
							<ArrowUpRight className='size-4' />
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-1 flex-col gap-4 p-5'>
				<div className='space-y-2'>
					<div className='flex items-center justify-between gap-3'>
						<p className='text-base font-semibold text-zinc-950'>{product.name}</p>
						<div className='inline-flex items-center gap-1 text-sm font-medium text-zinc-700'>
							<Star className='size-4 fill-current text-amber-400' />
							{product.rating.toFixed(1)}
						</div>
					</div>
					<p className='line-clamp-2 text-sm leading-6 text-zinc-600'>
						{product.description}
					</p>
				</div>

				<div className='mt-auto flex items-end justify-between gap-3'>
					<div>
						<div className='flex items-center gap-2'>
							<p className='text-lg font-semibold text-zinc-950'>
								{formatCurrency(displayPrice)}
							</p>
							{hasDiscount ? (
								<p className='text-sm text-zinc-400 line-through'>
									{formatCurrency(product.price)}
								</p>
							) : null}
						</div>
						<div className='mt-2 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500'>
							<BadgeCheck className='size-3.5' />
							{product.features[0]}
						</div>
					</div>

					<span className='rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-950 transition group-hover:border-zinc-950'>
						View
					</span>
				</div>
			</div>
		</Link>
	)
}
