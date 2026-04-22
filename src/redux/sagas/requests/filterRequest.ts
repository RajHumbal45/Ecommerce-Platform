import { fetchCatalogProducts } from '@/lib/products-api'

export async function fetchFilteredProductsRequest() {
	return fetchCatalogProducts()
}

