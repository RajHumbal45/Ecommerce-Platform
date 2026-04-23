'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SearchSuggestion = {
	name: string
	slug: string
	category: string
	brand: string
	thumbnail: string
	price: number
	discountPrice?: number
}

interface HomeSearchAutocompleteProps {
	products: SearchSuggestion[]
	compact?: boolean
	stretch?: boolean
}

const SUGGESTION_LIMIT = 6
const ALLOWED_CATEGORIES = new Set(['skincare', 'beauty', 'fragrance', 'furniture'])

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightedMatch({ text, query }: { text: string; query: string }) {
	const trimmedQuery = query.trim()

	if (!trimmedQuery) {
		return <>{text}</>
	}

	const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'ig')
	const parts = text.split(pattern)

	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === trimmedQuery.toLowerCase() ? (
					<mark key={`${part}-${index}`} className='rounded-[0.2rem] bg-amber-200/80 px-1 py-0.5 text-zinc-950'>
						{part}
					</mark>
				) : (
					<span key={`${part}-${index}`}>{part}</span>
				)
			)}
		</>
	)
}

export function HomeSearchAutocomplete({ products, compact = false, stretch = false }: HomeSearchAutocompleteProps) {
	const router = useRouter()
	const containerRef = useRef<HTMLDivElement | null>(null)
	const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)

	const suggestions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()
		const source = products.filter((product) => ALLOWED_CATEGORIES.has(product.category.toLowerCase()))
		const filtered =
			normalizedQuery.length > 0
				? source.filter(
						(product) =>
							product.name.toLowerCase().includes(normalizedQuery) ||
							product.category.toLowerCase().includes(normalizedQuery) ||
							product.brand.toLowerCase().includes(normalizedQuery)
					)
				: source

		return filtered.slice(0, SUGGESTION_LIMIT)
	}, [products, query])

	const trimmedQuery = query.trim()
	const hasQuery = trimmedQuery.length > 0

	function navigateToSearch(searchTerm: string) {
		const nextQuery = searchTerm.trim()
		if (!nextQuery) {
			return
		}

		router.push(`/products?query=${encodeURIComponent(nextQuery)}`)
	}

	function handleSubmit() {
		if (activeIndex >= 0 && suggestions[activeIndex]) {
			navigateToSearch(suggestions[activeIndex].name)
			return
		}

		if (hasQuery) {
			navigateToSearch(trimmedQuery)
			return
		}

		if (suggestions[0]) {
			navigateToSearch(suggestions[0].name)
		}
	}

	useEffect(() => {
		function handlePointerDown(event: MouseEvent | TouchEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
				setActiveIndex(-1)
			}
		}

		document.addEventListener('mousedown', handlePointerDown)
		document.addEventListener('touchstart', handlePointerDown)

		return () => {
			document.removeEventListener('mousedown', handlePointerDown)
			document.removeEventListener('touchstart', handlePointerDown)
		}
	}, [])

	useEffect(() => {
		if (!isOpen || activeIndex < 0) {
			return
		}

		optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
	}, [activeIndex, isOpen])

	useEffect(() => {
		setActiveIndex(suggestions.length > 0 ? 0 : -1)
	}, [query, suggestions.length])

	const wrapperSizeClass = compact
		? 'w-[min(440px,calc(100vw-24rem))]'
		: stretch
			? 'w-full max-w-none'
			: 'w-full max-w-2xl'
	const dropdownSizeClass = 'left-0 right-0'
	const dropdownPositionClass = stretch ? 'top-[calc(100%-0.5rem)]' : 'top-[calc(100%+0.5rem)]'
	const inputRowClass = compact ? 'h-11 px-4 py-2' : stretch ? 'h-14 px-5 py-3' : 'px-4 py-2.5'
	const inputClassName = stretch
		? 'w-full min-w-0 bg-transparent text-[0.98rem] text-zinc-950 caret-zinc-950 outline-none placeholder:text-zinc-400 focus:outline-none focus-visible:outline-none'
		: 'w-full min-w-0 bg-transparent text-sm text-zinc-950 caret-zinc-950 outline-none placeholder:text-zinc-400 focus:outline-none focus-visible:outline-none'
	const suggestionButtonClass = compact
		? 'gap-2 rounded-xl px-2.5 py-2.5'
		: stretch
			? 'gap-2 rounded-2xl px-3 py-1.5'
			: 'gap-3 rounded-2xl px-3 py-3'
	const thumbnailClass = compact ? 'size-10 rounded-xl' : stretch ? 'size-9 rounded-2xl' : 'size-12 rounded-2xl'
	const titleClass = compact ? 'text-[0.8125rem]' : 'text-sm'
	const metaClass = compact ? 'mt-0.5 text-[11px]' : stretch ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs'

	return (
		<div ref={containerRef} className={cn('relative', compact ? 'w-full' : '')}>
			<div
				className={cn(
					'flex items-center gap-3 rounded-full border border-zinc-200 bg-white shadow-sm transition duration-200',
					wrapperSizeClass,
					inputRowClass
				)}
			>
				<Search className={cn('shrink-0 text-zinc-400', stretch ? 'size-[1.1rem]' : 'size-4')} />
				<input
					type='search'
					value={query}
					onChange={(event) => {
						setQuery(event.target.value)
						setIsOpen(true)
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={(event) => {
						if (event.key === 'ArrowDown') {
							event.preventDefault()
							setIsOpen(true)
							setActiveIndex((current) => {
								if (suggestions.length === 0) return -1
								if (current < 0) return 0
								return (current + 1) % suggestions.length
							})
						}
						if (event.key === 'ArrowUp') {
							event.preventDefault()
							setIsOpen(true)
							setActiveIndex((current) => {
								if (suggestions.length === 0) return -1
								if (current < 0) return suggestions.length - 1
								return (current - 1 + suggestions.length) % suggestions.length
							})
						}
						if (event.key === 'Enter') {
							event.preventDefault()
							handleSubmit()
						}
						if (event.key === 'Escape') {
							setIsOpen(false)
							setActiveIndex(-1)
						}
					}}
					placeholder='Search products, brands, collections'
					aria-label='Search catalog'
					className={inputClassName}
				/>
			</div>

			{isOpen ? (
				<div
					className={cn(
						'absolute z-20 overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(24,24,27,0.12)]',
						dropdownPositionClass,
						dropdownSizeClass
					)}
				>
					<div className='border-b border-zinc-100 px-4 py-3'>
						<p className={cn('uppercase tracking-[0.3em] text-zinc-500', compact ? 'text-[10px]' : 'text-xs')}>
							{hasQuery ? 'Search results' : 'Popular picks'}
						</p>
					</div>
					<div
						className={cn(
							'no-scrollbar overflow-y-auto p-1.5',
							compact ? 'max-h-[20rem]' : stretch ? 'h-[28rem] max-h-[28rem]' : 'max-h-[26rem]'
						)}
					>
						{suggestions.length > 0 ? (
							suggestions.map((product, index) => (
								<button
									key={product.slug}
									ref={(element) => {
										optionRefs.current[index] = element
									}}
									type='button'
									onMouseDown={(event) => event.preventDefault()}
									onMouseEnter={() => setActiveIndex(index)}
									onClick={() => navigateToSearch(product.name)}
									className={cn(
										'flex w-full items-start text-left transition',
										suggestionButtonClass,
										index === activeIndex
											? 'bg-zinc-950 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
											: 'hover:bg-zinc-50',
										'focus:bg-zinc-50 focus:outline-none'
									)}
								>
									<div
										className={cn(
											'relative mt-0.5 shrink-0 overflow-hidden border bg-zinc-50',
											thumbnailClass,
											index === activeIndex ? 'border-white/10' : 'border-zinc-200'
										)}
									>
										<Image
											src={product.thumbnail}
											alt={product.name}
											fill
											sizes={compact ? '40px' : '48px'}
											className={cn('object-contain', compact ? 'p-1.25' : 'p-1.5')}
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<p
											className={cn(
												'truncate font-medium',
												titleClass,
												index === activeIndex ? 'text-white' : 'text-zinc-950'
											)}
										>
											<HighlightedMatch text={product.name} query={query} />
										</p>
										<p
											className={cn(
												'truncate',
												metaClass,
												index === activeIndex ? 'text-zinc-300' : 'text-zinc-500'
											)}
										>
											{product.brand} · {product.category}
										</p>
									</div>
								</button>
							))
						) : (
							<div className='px-4 py-8 text-center text-sm text-zinc-500'>
								No matches for "{trimmedQuery}".
							</div>
						)}
					</div>
				</div>
			) : null}
		</div>
	)
}
