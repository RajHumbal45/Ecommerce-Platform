'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import type { Product } from '@/data/products'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'

interface ProductCarouselProps {
	products: Product[]
	featured?: boolean
	showActions?: boolean
	highlightQuery?: string
}

export function ProductCarousel({
	products,
	featured = false,
	showActions = true,
	highlightQuery = ''
}: ProductCarouselProps) {
	const scrollerRef = useRef<HTMLDivElement | null>(null)

	function scrollByAmount(direction: -1 | 1) {
		const element = scrollerRef.current
		if (!element) {
			return
		}

		element.scrollBy({
			left: direction * Math.round(element.clientWidth * 0.76),
			behavior: 'smooth'
		})
	}

	return (
		<div className='relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#fbf8f2_100%)] p-4 shadow-[0_18px_40px_rgba(24,24,27,0.06)] sm:p-5'>
			<button
				type='button'
				aria-label='Scroll featured products left'
				onClick={() => scrollByAmount(-1)}
				className={cn(
					'absolute left-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-950 shadow-sm backdrop-blur transition hover:border-zinc-950 hover:bg-white sm:size-11'
				)}
			>
				<ChevronLeft className='size-5' />
			</button>

			<div
				ref={scrollerRef}
				className='no-scrollbar overflow-x-auto overflow-y-hidden px-11 pb-2 sm:px-14'
			>
				<div className='flex snap-x snap-mandatory gap-3 pr-2'>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							featured={featured}
							compact
							showActions={showActions}
							highlightQuery={highlightQuery}
						/>
					))}
				</div>
			</div>

			<button
				type='button'
				aria-label='Scroll featured products right'
				onClick={() => scrollByAmount(1)}
				className={cn(
					'absolute right-3 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-950 shadow-sm backdrop-blur transition hover:border-zinc-950 hover:bg-white sm:size-11'
				)}
			>
				<ChevronRight className='size-5' />
			</button>
		</div>
	)
}
