'use client'

import { Heart } from 'lucide-react'
import type { Product } from '@/data/products'
import { wishlistToggleItem } from '@/redux/actions/wishlist/wishlistAction'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectWishlistItems } from '@/redux/selectors'
import { cn } from '@/lib/utils'

interface WishlistToggleProps {
	product: Pick<
		Product,
		| 'id'
		| 'name'
		| 'slug'
		| 'price'
		| 'discountPrice'
		| 'category'
		| 'thumbnail'
		| 'rating'
		| 'reviewCount'
		| 'stock'
	>
	className?: string
	label?: string
	compact?: boolean
}

export function WishlistToggle({
	product,
	className,
	label = 'Save to wishlist',
	compact = false
}: WishlistToggleProps) {
	const dispatch = useAppDispatch()
	const items = useAppSelector(selectWishlistItems)
	const isSaved = items.some((item) => item.product.slug === product.slug)

	return (
		<button
			type='button'
			onClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
				dispatch(wishlistToggleItem({ product }))
			}}
			aria-pressed={isSaved}
			aria-label={isSaved ? 'Remove from wishlist' : label}
			className={cn(
				'inline-flex items-center gap-2 rounded-full border text-xs font-medium transition',
				compact ? 'h-7 w-7 justify-center p-0' : 'px-3 py-2',
				isSaved
					? 'border-rose-500 bg-rose-500 text-white'
					: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950',
				className
			)}
		>
			<Heart className={cn(compact ? 'size-[0.72rem]' : 'size-3.5', isSaved && 'fill-current')} />
			<span className={compact ? 'sr-only' : ''}>{isSaved ? 'Saved' : 'Save'}</span>
		</button>
	)
}
