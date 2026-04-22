export interface ProductImage {
	id: string
	src: string
	alt: string
}

export interface ProductVariant {
	label: string
	value: string
	options?: string[]
}

export interface Product {
	id: number
	name: string
	slug: string
	price: number
	discountPrice?: number
	category: string
	description: string
	rating: number
	reviewCount: number
	stock: number
	features: string[]
	images: ProductImage[]
	variants: ProductVariant[]
	thumbnail: string
	brand: string
	shippingInformation: string
	warrantyInformation: string
	returnPolicy: string
	availabilityStatus: string
	tags: string[]
}

export type ProductSortKey = 'featured' | 'price-low' | 'price-high' | 'rating'

export interface CatalogCategory {
	slug: string
	label: string
}

export function formatCategoryLabel(slug: string) {
	return slug
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')
}

export function slugifyProductName(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function getCategories(products: Product[]) {
	return Array.from(new Set(products.map((product) => product.category)))
}

export function getProductCountByCategory(products: Product[], category: string) {
	return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
		.length
}

export function getFeaturedProducts(products: Product[]) {
	return products.slice(0, 4)
}

export function getTopRatedProduct(products: Product[]) {
	return [...products].sort((first, second) => second.rating - first.rating)[0]
}

export function getLowestPriceProduct(products: Product[]) {
	return [...products].sort(
		(first, second) => (first.discountPrice ?? first.price) - (second.discountPrice ?? second.price)
	)[0]
}

export function getRelatedProducts(products: Product[], slug: string, category: string) {
	return products
		.filter((product) => product.slug !== slug && product.category === category)
		.slice(0, 3)
}

export function filterAndSortProducts(
	products: Product[],
	{
		query = '',
		category = 'all',
		sort = 'featured'
	}: {
		query?: string
		category?: string
		sort?: ProductSortKey
	}
) {
	const normalizedQuery = query.trim().toLowerCase()

	let result = products.filter((product) => {
		const matchesQuery =
			normalizedQuery.length === 0 ||
			product.name.toLowerCase().includes(normalizedQuery) ||
			product.description.toLowerCase().includes(normalizedQuery) ||
			product.category.toLowerCase().includes(normalizedQuery) ||
			product.brand.toLowerCase().includes(normalizedQuery) ||
			product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
		const matchesCategory = category === 'all' || product.category.toLowerCase() === category

		return matchesQuery && matchesCategory
	})

	if (sort === 'price-low') {
		result = [...result].sort(
			(first, second) => (first.discountPrice ?? first.price) - (second.discountPrice ?? second.price)
		)
	}

	if (sort === 'price-high') {
		result = [...result].sort(
			(first, second) => (second.discountPrice ?? second.price) - (first.discountPrice ?? first.price)
		)
	}

	if (sort === 'rating') {
		result = [...result].sort((first, second) => second.rating - first.rating)
	}

	return result
}
