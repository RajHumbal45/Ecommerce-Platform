'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowRight, Filter, Menu, X } from 'lucide-react'
import type { Product, ProductSortKey } from '@/data/products'
import {
	filterAndSortProducts,
	getCategories,
	getProductCountByCategory
} from '@/data/products'
import { formatCategoryLabel } from '@/data/products'
import { cn } from '@/lib/utils'
import { ProductSearchResultCard } from './product-search-result-card'

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

type PriceFilter = 'all' | 'under500' | '500to1000' | 'over1000'

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
	const [priceFilter, setPriceFilter] = useState<PriceFilter>('all')
	const [minRating, setMinRating] = useState<number | 'all'>('all')
	const [showMobileFilters, setShowMobileFilters] = useState(false)
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
		if (!showMobileFilters) {
			return
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setShowMobileFilters(false)
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [showMobileFilters])

	useEffect(() => {
		const html = document.documentElement
		const body = document.body
		const previousHtmlOverflow = html.style.overflow
		const previousBodyOverflow = body.style.overflow

		html.style.overflow = 'hidden'
		body.style.overflow = 'hidden'

		return () => {
			html.style.overflow = previousHtmlOverflow
			body.style.overflow = previousBodyOverflow
		}
	}, [])

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
	const filteredProducts = useMemo(
		() =>
			filterAndSortProducts(products, { query: deferredQuery, category, sort }).filter((product) => {
				const displayPrice = product.discountPrice ?? product.price
				const matchesPrice =
					priceFilter === 'all' ||
					(priceFilter === 'under500' && displayPrice < 500) ||
					(priceFilter === '500to1000' && displayPrice >= 500 && displayPrice <= 1000) ||
					(priceFilter === 'over1000' && displayPrice > 1000)
				const matchesRating = minRating === 'all' || product.rating >= minRating

				return matchesPrice && matchesRating
			}),
		[products, deferredQuery, category, sort, priceFilter, minRating]
	)

	const trimmedQuery = query.trim()
	const hasQuery = trimmedQuery.length > 0
	const selectedCategoryLabel =
		category === 'all'
			? 'All categories'
			: formatCategoryLabel(categories.find((item) => item.toLowerCase() === category) ?? category)
	const activeLabel =
		category === 'all'
			? 'All products'
			: `${selectedCategoryLabel} (${getProductCountByCategory(products, category)})`
	const currentSortLabel =
		sortOptions.find((option) => option.value === sort)?.label ?? 'Featured'
	const priceFilterLabel =
		priceFilter === 'all'
			? 'Any price'
			: priceFilter === 'under500'
				? 'Under 500'
				: priceFilter === '500to1000'
					? '500 to 1000'
					: 'Over 1000'
	const ratingLabel = minRating === 'all' ? 'Any rating' : `${minRating}+`
	const mobileFilterCount =
		(category !== 'all' ? 1 : 0) +
		(sort !== 'featured' ? 1 : 0) +
		(priceFilter !== 'all' ? 1 : 0) +
		(minRating !== 'all' ? 1 : 0)

	return (
		<div className='space-y-3 lg:h-[calc(100dvh-7rem)] lg:overflow-hidden'>
			<div className='grid gap-4 lg:h-full lg:grid-cols-[280px_1fr]'>
				<aside className='hidden space-y-4 lg:block lg:h-full lg:self-start lg:overflow-y-auto lg:pr-2 no-scrollbar'>
					<div className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#faf9f7_100%)] p-4 shadow-sm'>
						<div className='flex items-start justify-between gap-3 border-b border-zinc-100 px-1 pb-4'>
							<div className='space-y-1'>
								<div className='flex items-center gap-2'>
									<Filter className='size-4 text-zinc-950' />
									<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Filters</p>
								</div>
								<p className='text-sm text-zinc-600'>Refine by sort, price, rating, or category.</p>
								
							</div>
							<button
								type='button'
								onClick={() => {
									setQuery('')
									setCategory('all')
									setSort('featured')
									setPriceFilter('all')
									setMinRating('all')
								}}
								className='rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950'
							>
								Reset
							</button>
						</div>

						<div className='mt-4 space-y-3.5'>
							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Sort by</p>
									<span className='text-xs text-zinc-400'>{currentSortLabel}</span>
								</div>
								<select
									value={sort}
									onChange={(event) => setSort(event.target.value as ProductSortKey)}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:bg-white'
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Price</p>
									<span className='text-xs text-zinc-400'>{priceFilterLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'Any price' },
										{ key: 'under500', label: 'Under 500' },
										{ key: '500to1000', label: '500 to 1000' },
										{ key: 'over1000', label: 'Over 1000' }
									].map((item) => (
										<button
											key={item.key}
											type='button'
											onClick={() => setPriceFilter(item.key as PriceFilter)}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition',
												priceFilter === item.key
													? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 hover:shadow-sm'
											)}
										>
											<span>{item.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Rating</p>
									<span className='text-xs text-zinc-400'>{ratingLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'Any rating' },
										{ key: 4, label: '4 stars & up' },
										{ key: 3, label: '3 stars & up' }
									].map((item) => (
										<button
											key={String(item.key)}
											type='button'
											onClick={() => setMinRating(item.key as number | 'all')}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition',
												minRating === item.key
													? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 hover:shadow-sm'
											)}
										>
											<span>{item.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Category</p>
									<span className='text-xs text-zinc-400'>{selectedCategoryLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'All categories', count: products.length },
										...categories.map((item) => ({
											key: item.toLowerCase(),
											label: formatCategoryLabel(item),
											count: getProductCountByCategory(products, item)
										}))
									].map((item) => (
										<button
											key={item.key}
											type='button'
											onClick={() => setCategory(item.key)}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition',
												category === item.key
													? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 hover:shadow-sm'
											)}
										>
											<span>{item.label}</span>
											<span className='text-xs font-medium opacity-70'>{item.count}</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</aside>

				<section className='space-y-2.5 lg:h-full lg:overflow-y-auto lg:pr-2 no-scrollbar'>
					<div className='sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-zinc-200 bg-white/90 px-4 py-4 text-sm text-zinc-500 shadow-sm backdrop-blur-sm sm:px-5'>
						<p>
							Showing <span className='font-medium text-zinc-950'>{filteredProducts.length}</span>{' '}
							matches from <span className='font-medium text-zinc-950'>{products.length}</span> products
						</p>
						<div className='flex flex-wrap items-center gap-2'>
							<button
								type='button'
								onClick={() => setShowMobileFilters(true)}
								className='inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950 lg:hidden'
							>
								<Menu className='size-3.5' />
								Filters{mobileFilterCount > 0 ? ` (${mobileFilterCount})` : ''}
							</button>
							{hasQuery ? (
								<button
									type='button'
									onClick={() => setQuery('')}
									className='cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950'
								>
									Searching: "{trimmedQuery}"
								</button>
							) : null}
							{category !== 'all' ? (
								<button
									type='button'
									onClick={() => setCategory('all')}
									className='cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950'
								>
									Category: {selectedCategoryLabel}
								</button>
							) : null}
							{sort !== 'featured' ? (
								<button
									type='button'
									onClick={() => setSort('featured')}
									className='cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950'
								>
									Sort: {currentSortLabel}
								</button>
							) : null}
							{priceFilter !== 'all' ? (
								<button
									type='button'
									onClick={() => setPriceFilter('all')}
									className='cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950'
								>
									Price: {priceFilterLabel}
								</button>
							) : null}
							{minRating !== 'all' ? (
								<button
									type='button'
									onClick={() => setMinRating('all')}
									className='cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:bg-white hover:text-zinc-950'
								>
									Rating: {ratingLabel}
								</button>
							) : null}
							{hasQuery || category !== 'all' || sort !== 'featured' ? (
								<button
									type='button'
									onClick={() => {
										setQuery('')
										setCategory('all')
										setSort('featured')
										setPriceFilter('all')
										setMinRating('all')
									}}
									className='cursor-pointer inline-flex items-center gap-1 rounded-full border border-transparent bg-transparent px-2 py-1 font-medium text-zinc-950 underline-offset-4 hover:bg-zinc-50 hover:underline'
								>
									<X className='size-3.5' />
									Clear all
								</button>
							) : null}
						</div>
					</div>

					{filteredProducts.length > 0 ? (
						<div className='space-y-2.5'>
							<div className='flex items-center justify-between gap-3 px-1 py-1'>
								<p className='text-sm font-medium text-zinc-950'>Products</p>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>
									{filteredProducts.length} shown
								</p>
							</div>
							<div className='space-y-2 lg:space-y-2'>
								{filteredProducts.map((product) => (
									<ProductSearchResultCard key={product.id} product={product} query={trimmedQuery} />
								))}
							</div>
						</div>
					) : (
						<div className='rounded-[1.5rem] border border-dashed border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#faf9f7_100%)] p-10 text-center shadow-sm'>
							<div className='mx-auto flex size-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-sm'>
								<ArrowRight className='size-5 rotate-45' />
							</div>
							<p className='mt-5 text-lg font-medium text-zinc-950'>No products found</p>
							<p className='mt-2 text-sm text-zinc-600'>
								{hasQuery
									? `No products match "${trimmedQuery}". Try another term, switch category, or reset the filters.`
									: 'Try another search term, switch category, or reset the filters.'}
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
				</section>
			</div>

			{showMobileFilters ? (
				<div className='fixed inset-0 z-50 lg:hidden'>
					<button
						type='button'
						aria-label='Close filters'
						className='absolute inset-0 bg-zinc-950/40'
						onClick={() => setShowMobileFilters(false)}
					/>
					<div className='no-scrollbar absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[1.75rem] border border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#faf9f7_100%)] p-4 shadow-[0_-20px_60px_rgba(24,24,27,0.18)]'>
						<div className='flex items-start justify-between gap-3 border-b border-zinc-100 pb-4'>
							<div className='space-y-1'>
								<div className='flex items-center gap-2'>
									<Filter className='size-4 text-zinc-950' />
									<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Filters</p>
								</div>
								<p className='text-sm text-zinc-600'>Refine the list without leaving the page.</p>
							</div>
							<button
								type='button'
								onClick={() => setShowMobileFilters(false)}
								className='grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950'
								aria-label='Close filters panel'
							>
								<X className='size-4' />
							</button>
						</div>

						<div className='mt-4 space-y-3.5'>
							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Sort by</p>
									<span className='text-xs text-zinc-400'>{currentSortLabel}</span>
								</div>
								<select
									value={sort}
									onChange={(event) => setSort(event.target.value as ProductSortKey)}
									className='w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:bg-white'
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Price</p>
									<span className='text-xs text-zinc-400'>{priceFilterLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'Any price' },
										{ key: 'under500', label: 'Under 500' },
										{ key: '500to1000', label: '500 to 1000' },
										{ key: 'over1000', label: 'Over 1000' }
									].map((item) => (
										<button
											key={item.key}
											type='button'
											onClick={() => setPriceFilter(item.key as PriceFilter)}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
												priceFilter === item.key
													? 'border-zinc-950 bg-zinc-950 text-white'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											<span>{item.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Rating</p>
									<span className='text-xs text-zinc-400'>{ratingLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'Any rating' },
										{ key: 4, label: '4 stars & up' },
										{ key: 3, label: '3 stars & up' }
									].map((item) => (
										<button
											key={String(item.key)}
											type='button'
											onClick={() => setMinRating(item.key as number | 'all')}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
												minRating === item.key
													? 'border-zinc-950 bg-zinc-950 text-white'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											<span>{item.label}</span>
										</button>
									))}
								</div>
							</div>

							<div className='rounded-[1.5rem] border border-zinc-200 bg-white/90 p-4 shadow-sm'>
								<div className='mb-3 flex items-center justify-between gap-3'>
									<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>Category</p>
									<span className='text-xs text-zinc-400'>{selectedCategoryLabel}</span>
								</div>
								<div className='grid gap-2'>
									{[
										{ key: 'all', label: 'All categories', count: products.length },
										...categories.map((item) => ({
											key: item.toLowerCase(),
											label: formatCategoryLabel(item),
											count: getProductCountByCategory(products, item)
										}))
									].map((item) => (
										<button
											key={item.key}
											type='button'
											onClick={() => setCategory(item.key)}
											className={cn(
												'flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
												category === item.key
													? 'border-zinc-950 bg-zinc-950 text-white'
													: 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950 hover:text-zinc-950'
											)}
										>
											<span>{item.label}</span>
											<span className='text-xs font-medium opacity-70'>{item.count}</span>
										</button>
									))}
								</div>
							</div>

							<div className='flex gap-2 pt-2'>
								<button
									type='button'
									onClick={() => {
										setQuery('')
										setCategory('all')
										setSort('featured')
										setPriceFilter('all')
										setMinRating('all')
									}}
									className='flex-1 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950'
								>
									Reset
								</button>
								<button
									type='button'
									onClick={() => setShowMobileFilters(false)}
									className='flex-1 rounded-full bg-zinc-950 px-4 py-3 text-sm font-medium text-white'
								>
									Show results
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
