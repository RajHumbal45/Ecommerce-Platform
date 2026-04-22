'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowRight, BadgeCheck, Filter, Search, Star } from 'lucide-react'
import type { Product, ProductSortKey } from '@/data/products'
import {
	filterAndSortProducts,
	getCategories,
	getProductCountByCategory,
	getLowestPriceProduct,
	getTopRatedProduct
} from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { cn } from '@/lib/utils'
import { ProductGrid } from './product-grid'

const sortOptions: Array<{ label: string; value: ProductSortKey }> = [
	{ label: 'Featured', value: 'featured' },
	{ label: 'Price: Low to High', value: 'price-low' },
	{ label: 'Price: High to Low', value: 'price-high' },
	{ label: 'Top Rated', value: 'rating' }
]

interface CatalogBrowserProps {
	products: Product[]
	initialQuery?: string
	initialCategory?: string
	initialSort?: string
}

function normalizeSort(sort?: string): ProductSortKey {
	return sortOptions.some((option) => option.value === sort) ? (sort as ProductSortKey) : 'featured'
}

function buildSearchParams({
	query,
	category,
	sort
}: {
	query: string
	category: string
	sort: ProductSortKey
}) {
	const params = new URLSearchParams()

	if (query.trim().length > 0) {
		params.set('query', query.trim())
	}

	if (category !== 'all') {
		params.set('category', category)
	}

	if (sort !== 'featured') {
		params.set('sort', sort)
	}

	return params
}

export function CatalogBrowser({
	products,
	initialQuery = '',
	initialCategory = 'all',
	initialSort = 'featured'
}: CatalogBrowserProps) {
	const router = useRouter()
	const pathname = usePathname()
	const [query, setQuery] = useState(initialQuery)
	const [category, setCategory] = useState(initialCategory)
	const [sort, setSort] = useState<ProductSortKey>(normalizeSort(initialSort))
	const deferredQuery = useDeferredValue(query)

	useEffect(() => {
		setQuery(initialQuery)
	}, [initialQuery])

	useEffect(() => {
		setCategory(initialCategory)
	}, [initialCategory])

	useEffect(() => {
		setSort(normalizeSort(initialSort))
	}, [initialSort])

	useEffect(() => {
		const params = buildSearchParams({ query, category, sort })
		const nextSearch = params.toString()
		const currentSearch = new URLSearchParams(window.location.search).toString()

		if (nextSearch === currentSearch) {
			return
		}

		const nextUrl = nextSearch.length > 0 ? `${pathname}?${nextSearch}` : pathname
		router.replace(nextUrl, { scroll: false })
	}, [category, pathname, query, router, sort])

	const categories = getCategories(products)
	const topRatedProduct = getTopRatedProduct(products)
	const lowestPriceProduct = getLowestPriceProduct(products)
	const selectedCategoryLabel =
		category === 'all'
			? 'All categories'
			: formatCategoryLabel(categories.find((item) => item.toLowerCase() === category) ?? category)
	const currentSortLabel =
		sortOptions.find((option) => option.value === sort)?.label ?? 'Featured'

	const filteredProducts = useMemo(
		() => filterAndSortProducts(products, { query: deferredQuery, category, sort }),
		[products, deferredQuery, category, sort]
	)

	const activeLabel =
		category === 'all'
			? 'All products'
			: `${selectedCategoryLabel} (${getProductCountByCategory(products, category)})`

	return (
		<div className='space-y-6'>
			<section className='overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6'>
				<div className='grid gap-5 lg:grid-cols-[1.35fr_0.65fr]'>
					<div className='space-y-4'>
						<div>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Catalog</p>
							<h1 className='mt-2 text-3xl font-semibold text-zinc-950'>Browse products</h1>
							<p className='mt-2 max-w-2xl text-sm leading-6 text-zinc-600'>
								Search, narrow by category, and sort by relevance or price.
							</p>
						</div>

						<div className='flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 transition focus-within:border-zinc-950 focus-within:bg-white'>
							<Search className='size-4 text-zinc-400' />
							<input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								type='search'
								placeholder='Search products, categories, features'
								aria-label='Search products'
								className='w-full bg-transparent text-sm outline-none placeholder:text-zinc-400'
							/>
						</div>
						<p className='text-xs leading-6 text-zinc-500'>
							Try short queries like <span className='font-medium text-zinc-950'>jacket</span>,{' '}
							<span className='font-medium text-zinc-950'>watch</span>, or{' '}
							<span className='font-medium text-zinc-950'>tote</span>.
						</p>
					</div>

					<div className='grid gap-3'>
						<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
							<label className='space-y-2'>
								<span className='inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500'>
									<Filter className='size-3.5' />
									Sort by
								</span>
								<select
									value={sort}
									onChange={(event) => setSort(event.target.value as ProductSortKey)}
									className='w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none'
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</label>

							<div className='grid gap-3'>
								<div className='flex flex-wrap gap-2'>
									{[
										{ key: 'all', label: 'All' },
										...categories.map((item) => ({
											key: item.toLowerCase(),
											label: `${formatCategoryLabel(item)} (${getProductCountByCategory(products, item)})`
										}))
									].map((item) => (
										<button
											key={item.key}
											type='button'
											onClick={() => setCategory(item.key)}
											className={cn(
												'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition',
												category === item.key
													? 'bg-zinc-950 text-white'
													: 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											{item.label}
										</button>
									))}
								</div>

								<div className='grid gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4'>
									<div className='flex items-start justify-between gap-4'>
										<div>
											<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>
												Storefront spotlight
											</p>
											<p className='mt-2 text-sm font-medium text-zinc-950'>
												Top rated and lowest priced products stay highlighted here.
											</p>
										</div>
										<div className='grid size-10 place-items-center rounded-full bg-zinc-950 text-white'>
											<BadgeCheck className='size-4' />
										</div>
									</div>

									<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
										<div className='rounded-2xl bg-white p-4 shadow-sm'>
											<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
												<Star className='size-4 fill-current text-amber-400' />
												Top rated
											</div>
											<p className='mt-2 text-sm text-zinc-600'>
												{topRatedProduct?.name ?? 'Top rated product unavailable'}
											</p>
										</div>

										<div className='rounded-2xl bg-white p-4 shadow-sm'>
											<div className='flex items-center gap-2 text-sm font-medium text-zinc-950'>
												<Filter className='size-4 text-zinc-500' />
												Best price
											</div>
											<p className='mt-2 text-sm text-zinc-600'>
												{lowestPriceProduct?.name ?? 'Lowest priced product unavailable'}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className='grid gap-4 sm:grid-cols-3'>
				<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Catalog size</p>
					<p className='mt-3 text-3xl font-semibold text-zinc-950'>{products.length}</p>
					<p className='mt-2 text-sm text-zinc-600'>Products currently available to browse.</p>
				</div>
				<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Active category</p>
					<p className='mt-3 text-3xl font-semibold text-zinc-950'>{selectedCategoryLabel}</p>
					<p className='mt-2 text-sm text-zinc-600'>Category filter applied to the catalog.</p>
				</div>
				<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'>
					<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Sort mode</p>
					<p className='mt-3 text-3xl font-semibold text-zinc-950'>{currentSortLabel}</p>
					<p className='mt-2 text-sm text-zinc-600'>Current ordering used for the grid.</p>
				</div>
			</section>

			<section className='flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-500 shadow-sm'>
				<p>
					Showing <span className='font-medium text-zinc-950'>{filteredProducts.length}</span>{' '}
					of <span className='font-medium text-zinc-950'>{products.length}</span> products in{' '}
					<span className='font-medium text-zinc-950'>{activeLabel}</span>
				</p>
				<div className='flex flex-wrap items-center gap-2'>
					{query ? (
						<button
							type='button'
							onClick={() => setQuery('')}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
						>
							Query: "{query}"
						</button>
					) : null}
					{category !== 'all' ? (
						<button
							type='button'
							onClick={() => setCategory('all')}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
						>
							Category: {selectedCategoryLabel}
						</button>
					) : null}
					{sort !== 'featured' ? (
						<button
							type='button'
							onClick={() => setSort('featured')}
							className='cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
						>
							Sort: {currentSortLabel}
						</button>
					) : null}
					{query || category !== 'all' || sort !== 'featured' ? (
						<button
							type='button'
							onClick={() => {
								setQuery('')
								setCategory('all')
								setSort('featured')
							}}
							className='cursor-pointer font-medium text-zinc-950 underline-offset-4 hover:underline'
						>
							Clear all
						</button>
					) : null}
				</div>
			</section>

			{filteredProducts.length > 0 ? (
				<ProductGrid products={filteredProducts} />
			) : (
				<div className='rounded-[1.5rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm'>
					<div className='mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-950'>
						<ArrowRight className='size-5 rotate-45' />
					</div>
					<p className='mt-5 text-lg font-medium text-zinc-950'>No products found</p>
					<p className='mt-2 text-sm text-zinc-600'>
						Try another search term, switch category, or reset the filters.
					</p>
					<button
						type='button'
						onClick={() => {
							setQuery('')
							setCategory('all')
							setSort('featured')
						}}
						className='mt-6 cursor-pointer rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
					>
						Reset catalog
					</button>
				</div>
			)}
		</div>
	)
}
