import { fetchCatalogProducts } from '@/lib/products-api'

export async function fetchProductsRequest() {
	return fetchCatalogProducts()
}

