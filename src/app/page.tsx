import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/product/product-grid'
import { fetchCatalogProducts } from '@/lib/products-api'
import { formatCategoryLabel, getCategories } from '@/data/products'
import { HomeSearchAutocomplete } from '@/components/home/home-search-autocomplete'

export const revalidate = 3600

export default async function HomePage() {
	const products = await fetchCatalogProducts()
	const featuredProducts = products.slice(0, 8)
	const categories = getCategories(products).slice(0, 8)
	const searchSuggestions = products.map((product) => ({
		name: product.name,
		slug: product.slug,
		category: product.category,
		brand: product.brand,
		thumbnail: product.thumbnail,
		price: product.price,
		discountPrice: product.discountPrice
	}))

	return (
		<div className='space-y-8'>
			<section className='overflow-visible rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f6f1e7_100%)] shadow-[0_28px_70px_rgba(24,24,27,0.08)]'>
				<div className='px-5 py-9 sm:px-8 sm:py-12 lg:px-10 lg:py-12'>
					<div className='space-y-6'>
						<div className='space-y-4'>
							<h1 className='max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-950 sm:text-5xl lg:text-7xl'>
								Discover products you actually want to keep.
							</h1>
							<p className='max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg'>
								Shop skincare, fragrance, beauty, and home essentials with a fast search,
								clear product cards, and a simple checkout flow.
							</p>
						</div>

						<HomeSearchAutocomplete products={searchSuggestions} stretch />
					
						<div className='flex flex-wrap gap-3'>
							<Link
								href='/products'
								className='inline-flex items-center gap-2 rounded-full border border-zinc-950 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
							>
								Browse collection
								<ArrowRight className='size-4' />
							</Link>
							<Link
								href='/checkout'
								className='rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
							>
								Preview checkout
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className='space-y-4'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Browse by category</h2>
					</div>
					<Link
						href='/products'
						className='text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline'
					>
						See all products
					</Link>
				</div>

				<div className='flex flex-wrap gap-2'>
					{categories.map((category) => (
						<Link
							key={category}
							href={`/products?category=${category}`}
							className='rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
						>
							{formatCategoryLabel(category)}
						</Link>
					))}
				</div>
			</section>

			<section className='space-y-4'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Top trending products</h2>
					</div>
					<Link
						href='/products'
						className='text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline'
					>
						View all
					</Link>
				</div>

				<ProductGrid products={featuredProducts} featured layout='carousel' />
			</section>
		</div>
	)
}
