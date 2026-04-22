import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/product/product-detail'
import { getRelatedProducts } from '@/data/products'
import {
	fetchCatalogProductBySlug,
	fetchCatalogProducts
} from '@/lib/products-api'

export const revalidate = 3600

export async function generateStaticParams() {
	const products = await fetchCatalogProducts()

	return products.map((product) => ({
		slug: product.slug
	}))
}

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const product = await fetchCatalogProductBySlug(slug)

	if (!product) {
		return {
			title: 'Product not found'
		}
	}

	return {
		title: product.name,
		description: product.description
	}
}

export default async function ProductDetailPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const product = await fetchCatalogProductBySlug(slug)

	if (!product) {
		notFound()
	}

	const allProducts = await fetchCatalogProducts()
	const relatedProducts = getRelatedProducts(allProducts, product.slug, product.category)

	return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
