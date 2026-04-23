import type { Product } from '@/data/products'
import { ProductCard } from './product-card'
import { ProductCarousel } from './product-carousel'

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

