export interface ProductImage {
	id: string
	src: string
	alt: string
}

export interface ProductVariant {
	label: string
	value: string
}

export interface Product {
	id: string
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
}

export const products: Product[] = [
	{
		id: 'prod_001',
		name: 'Aurora Jacket',
		slug: 'aurora-jacket',
		price: 129,
		discountPrice: 99,
		category: 'Apparel',
		description: 'Lightweight outerwear with a clean silhouette and modern fit.',
		rating: 4.8,
		reviewCount: 142,
		stock: 18,
		features: ['Water-resistant shell', 'Breathable lining', 'Hidden pockets'],
		images: [
			{
				id: 'img_001',
				src: '/products/aurora-jacket-1.jpg',
				alt: 'Aurora Jacket front view'
			}
		],
		variants: [
			{ label: 'Size', value: 'M' },
			{ label: 'Color', value: 'Stone' }
		]
	},
	{
		id: 'prod_002',
		name: 'Nimbus Sneakers',
		slug: 'nimbus-sneakers',
		price: 99,
		category: 'Footwear',
		description: 'Daily sneakers designed for comfort, movement, and long wear.',
		rating: 4.7,
		reviewCount: 218,
		stock: 24,
		features: ['Cushioned sole', 'Lightweight build', 'Premium mesh upper'],
		images: [
			{
				id: 'img_002',
				src: '/products/nimbus-sneakers-1.jpg',
				alt: 'Nimbus Sneakers side view'
			}
		],
		variants: [
			{ label: 'Size', value: '42' },
			{ label: 'Color', value: 'White' }
		]
	},
	{
		id: 'prod_003',
		name: 'Satin Tote',
		slug: 'satin-tote',
		price: 74,
		category: 'Accessories',
		description: 'Structured tote with premium finishing and a refined profile.',
		rating: 4.6,
		reviewCount: 88,
		stock: 31,
		features: ['Reinforced straps', 'Laptop fit', 'Soft matte finish'],
		images: [
			{
				id: 'img_003',
				src: '/products/satin-tote-1.jpg',
				alt: 'Satin Tote front view'
			}
		],
		variants: [{ label: 'Color', value: 'Black' }]
	},
	{
		id: 'prod_004',
		name: 'Orbit Watch',
		slug: 'orbit-watch',
		price: 189,
		category: 'Accessories',
		description: 'Minimal analog watch with modern detailing and durable build.',
		rating: 4.9,
		reviewCount: 64,
		stock: 12,
		features: ['Sapphire glass', 'Stainless steel case', 'Water resistant'],
		images: [
			{
				id: 'img_004',
				src: '/products/orbit-watch-1.jpg',
				alt: 'Orbit Watch face view'
			}
		],
		variants: [{ label: 'Color', value: 'Silver' }]
	}
]

export function getProductBySlug(slug: string) {
	return products.find((product) => product.slug === slug)
}

export function getFeaturedProducts() {
	return products.slice(0, 4)
}

