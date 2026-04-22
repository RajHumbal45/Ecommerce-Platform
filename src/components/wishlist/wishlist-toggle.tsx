'use client'

import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { Product } from '@/data/products'
import type { RootState } from '@/redux/store'
import { wishlistToggleItem } from '@/redux/actions/wishlist/wishlistAction'
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
}

export function WishlistToggle({ product, className, label = 'Save to wishlist' }: WishlistToggleProps) {
	const dispatch = useDispatch()
	const isSaved = useSelector((state: RootState) =>
		state.wishlist.items.some((item) => item.product.slug === product.slug)
	)

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
				'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition',
				isSaved
					? 'border-rose-500 bg-rose-500 text-white'
					: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950',
				className
			)}
		>
			<Heart className={cn('size-3.5', isSaved && 'fill-current')} />
			<span>{isSaved ? 'Saved' : 'Save'}</span>
		</button>
	)
}
