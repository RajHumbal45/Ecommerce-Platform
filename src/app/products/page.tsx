import { CatalogBrowser } from '@/components/product/catalog-browser'
import { fetchCatalogProducts } from '@/lib/products-api'

export const revalidate = 3600

type ProductsPageProps = {
	searchParams: Promise<{
		query?: string
		category?: string
		sort?: string
	}>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
	const products = await fetchCatalogProducts()
	const resolvedSearchParams = await searchParams
	const initialQuery = resolvedSearchParams.query ?? ''
	const initialCategory = resolvedSearchParams.category ?? 'all'
	const initialSort = resolvedSearchParams.sort ?? 'featured'

	return (
		<CatalogBrowser
			products={products}
			initialQuery={initialQuery}
			initialCategory={initialCategory}
			initialSort={initialSort}
		/>
	)
}

