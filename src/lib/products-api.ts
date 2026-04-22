import { cache } from 'react'
import { formatCategoryLabel, slugifyProductName, type Product } from '@/data/products'

const API_BASE = 'https://dummyjson.com'
const PRODUCT_SELECT =
	'id,title,description,category,price,discountPercentage,rating,stock,tags,brand,thumbnail,images,shippingInformation,warrantyInformation,returnPolicy,availabilityStatus,reviews'

interface DummyJsonProduct {
	id: number
	title: string
	description: string
	category: string
	price: number
	discountPercentage: number
	rating: number
	stock: number
	tags: string[]
	brand: string
	thumbnail: string
	images: string[]
	shippingInformation: string
	warrantyInformation: string
	returnPolicy: string
	availabilityStatus: string
	reviews: Array<{
		rating: number
	}>
}

interface DummyJsonProductListResponse {
	products: DummyJsonProduct[]
	total: number
	skip: number
	limit: number
}

interface DummyJsonCategory {
	slug: string
	name: string
}

function toProductImage(src: string, index: number, title: string) {
	return {
		id: `${index}-${src}`,
		src,
		alt: `${title} image ${index + 1}`
	}
}

function buildVariants(product: DummyJsonProduct) {
	const tagValues = product.tags.slice(0, 3).map((tag) => formatCategoryLabel(tag))
	const primaryLabel = formatCategoryLabel(product.category)
	const brandLabel = product.brand

	return [
		{
			label: 'Collection',
			value: primaryLabel,
			options: [primaryLabel, ...(tagValues.length > 0 ? tagValues : [brandLabel])]
		},
		{
			label: 'Finish',
			value: brandLabel,
			options: [brandLabel, ...tagValues.slice(0, 2)]
		}
	]
}

export function mapDummyJsonProduct(product: DummyJsonProduct): Product {
	const displayPrice = Number(product.price.toFixed(2))
	const discountPrice = Number((product.price * (1 - product.discountPercentage / 100)).toFixed(2))
	const images = (product.images.length > 0 ? product.images : [product.thumbnail]).map(
		(image, index) => toProductImage(image, index, product.title)
	)
	const reviewCount = product.reviews.length
	const features = [
		product.brand,
		product.shippingInformation,
		product.returnPolicy
	].filter(Boolean)

	return {
		id: product.id,
		name: product.title,
		slug: slugifyProductName(product.title),
		price: displayPrice,
		discountPrice: discountPrice < displayPrice ? discountPrice : undefined,
		category: product.category,
		description: product.description,
		rating: product.rating,
		reviewCount,
		stock: product.stock,
		features,
		images,
		variants: buildVariants(product),
		thumbnail: product.thumbnail,
		brand: product.brand,
		shippingInformation: product.shippingInformation,
		warrantyInformation: product.warrantyInformation,
		returnPolicy: product.returnPolicy,
		availabilityStatus: product.availabilityStatus,
		tags: product.tags
	}
}

export const fetchCatalogProducts = cache(async (): Promise<Product[]> => {
	const response = await fetch(`${API_BASE}/products?limit=0&select=${encodeURIComponent(PRODUCT_SELECT)}`, {
		next: { revalidate: 3600 }
	})

	if (!response.ok) {
		throw new Error('Failed to load products')
	}

	const data = (await response.json()) as DummyJsonProductListResponse

	return data.products.map(mapDummyJsonProduct)
})

export const fetchCatalogCategories = cache(async (): Promise<string[]> => {
	const response = await fetch(`${API_BASE}/products/category-list`, {
		next: { revalidate: 3600 }
	})

	if (!response.ok) {
		throw new Error('Failed to load categories')
	}

	return (await response.json()) as string[]
})

export const fetchCatalogProductBySlug = cache(async (slug: string): Promise<Product | null> => {
	const products = await fetchCatalogProducts()
	return products.find((product) => product.slug === slug) ?? null
})
