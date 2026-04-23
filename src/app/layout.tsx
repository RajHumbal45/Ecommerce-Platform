import type { Metadata } from 'next'
import { Cormorant_Garamond, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { fetchCatalogProducts } from '@/lib/products-api'
import { formatCategoryLabel } from '@/data/products'

export const metadata: Metadata = {
	title: {
		default: 'Everyday Store',
		template: '%s | Everyday Store'
	},
	description: 'A modern storefront for beauty, fragrance, skincare, and home essentials',
	metadataBase: new URL('https://ecommerce-platform.local')
}

const displayFont = Cormorant_Garamond({
	subsets: ['latin'],
	weight: ['500', '600', '700'],
	variable: '--font-display'
})

const bodyFont = Source_Sans_3({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	variable: '--font-body'
})

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const products = await fetchCatalogProducts()
	const searchProducts = products.map((product) => ({
		name: product.name,
		slug: product.slug,
		category: product.category,
		brand: product.brand,
		thumbnail: product.thumbnail,
		price: product.price,
		discountPrice: product.discountPrice
	}))

	return (
		<html lang='en'>
			<body className={`${displayFont.variable} ${bodyFont.variable}`}>
				<Providers>
					<div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
						<Header searchProducts={searchProducts} />
						<main className='page-grid mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
							{children}
						</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	)
}

