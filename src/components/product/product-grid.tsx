import type { Product } from '@/data/products'
import { ProductCard } from './product-card'

interface ProductGridProps {
	products: Product[]
	featured?: boolean
}

export function ProductGrid({ products, featured = false }: ProductGridProps) {
	return (
		<div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} featured={featured} />
			))}
		</div>
	)
}

