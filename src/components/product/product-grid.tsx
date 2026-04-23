import dynamic from 'next/dynamic'
import type { Product } from '@/data/products'
import { ProductCard } from './product-card'

const ProductCarousel = dynamic(
	() => import('./product-carousel').then((module) => module.ProductCarousel),
	{
		loading: () => (
			<div className='rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5'>
				<div className='h-[320px] animate-pulse rounded-[1.5rem] bg-zinc-100' />
			</div>
		)
	}
)

interface ProductGridProps {
	products: Product[]
	featured?: boolean
	layout?: 'grid' | 'carousel'
	showActions?: boolean
	highlightQuery?: string
}

export function ProductGrid({
	products,
	featured = false,
	layout = 'grid',
	showActions = true,
	highlightQuery = ''
}: ProductGridProps) {
	if (layout === 'carousel') {
		return (
			<ProductCarousel
				products={products}
				featured={featured}
				showActions={showActions}
				highlightQuery={highlightQuery}
			/>
		)
	}

	return (
		<div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					featured={featured}
					showActions={showActions}
					highlightQuery={highlightQuery}
				/>
			))}
		</div>
	)
}

