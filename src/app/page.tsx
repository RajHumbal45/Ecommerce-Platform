import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { ProductGrid } from '@/components/product/product-grid'
import {
	fetchCatalogProducts
} from '@/lib/products-api'
import { formatCategoryLabel, getCategories, getFeaturedProducts } from '@/data/products'

const trustItems = [
	{
		icon: Truck,
		title: 'Fast delivery',
		description: 'Shipping-friendly experience with clear delivery expectations.'
	},
	{
		icon: ShieldCheck,
		title: 'Secure checkout',
		description: 'Checkout flow designed around trust, clarity, and confidence.'
	},
	{
		icon: BadgeCheck,
		title: 'Reliable quality',
		description: 'Well-structured product pages that support buying decisions.'
	}
]

export const revalidate = 3600

export default async function HomePage() {
	const products = await fetchCatalogProducts()
	const featuredProducts = getFeaturedProducts(products)
	const categories = getCategories(products).slice(0, 3)

	const categoryCards = categories.map((category, index) => ({
		name: formatCategoryLabel(category),
		href: `/products?category=${category}`,
		description: `Browse curated ${formatCategoryLabel(category).toLowerCase()} from the live catalog.`,
		index
	}))

	return (
		<div className='space-y-12'>
			<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f4eee3_100%)] shadow-[0_30px_80px_rgba(24,24,27,0.08)]'>
				<div className='grid gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-10 lg:py-12'>
					<div className='space-y-8'>
						<div className='inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-zinc-600 shadow-sm'>
							<Sparkles className='size-4 text-zinc-950' />
							Live catalog feed
						</div>
						<div className='space-y-5'>
							<h1 className='max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl'>
								A storefront shaped like a real product launch.
							</h1>
							<p className='max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg'>
								Curated products, fast discovery, and a clean checkout path,
								served directly from a free public API.
							</p>
						</div>
						<div className='flex flex-wrap gap-3'>
							<Link
								href='/products'
								className='inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
							>
								Browse collection
								<ArrowRight className='size-4' />
							</Link>
							<Link
								href='/checkout'
								className='rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
							>
								Preview checkout
							</Link>
						</div>

						<div className='grid gap-4 sm:grid-cols-3'>
							{[
								['24h', 'Average shipping'],
								['4.8/5', 'Customer rating'],
								[`${products.length}+`, 'Live products']
							].map(([value, label]) => (
								<div key={label} className='rounded-[1.25rem] border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur'>
									<p className='text-2xl font-semibold text-zinc-950'>{value}</p>
									<p className='mt-1 text-sm text-zinc-500'>{label}</p>
								</div>
							))}
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2 lg:pt-8'>
						<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'>
							<p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>Phase 1</p>
							<p className='mt-4 text-lg font-medium text-zinc-950'>Setup complete</p>
							<p className='mt-2 text-sm leading-6 text-zinc-600'>
								Next.js App Router, TypeScript, Tailwind, Redux, and SSR wiring
								are established.
							</p>
						</div>

						<div className='rounded-[1.5rem] border border-zinc-950 bg-zinc-950 p-5 text-white shadow-sm sm:translate-y-10'>
							<p className='text-sm uppercase tracking-[0.3em] text-zinc-400'>Architecture</p>
							<p className='mt-4 text-lg font-medium'>Feature-based Redux</p>
							<p className='mt-2 text-sm leading-6 text-zinc-300'>
								Reducers, actions, sagas, and request modules are split by
								feature for scalability.
							</p>
						</div>

						<div className='rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5 shadow-sm sm:col-span-2'>
							<p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>Catalog focus</p>
							<p className='mt-4 text-lg font-medium text-zinc-950'>
								Designed to support the buying journey from browse to checkout.
							</p>
							<p className='mt-2 text-sm leading-6 text-zinc-600'>
								The product feed is sourced from DummyJSON and transformed into a
								storefront-ready data model.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className='space-y-5'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Categories</p>
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Shop by section</h2>
					</div>
					<Link
						href='/products'
						className='text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline'
					>
						See all products
					</Link>
				</div>

				<div className='grid gap-4 md:grid-cols-3'>
					{categoryCards.map((category) => (
						<Link
							key={category.name}
							href={category.href}
							className='group rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
						>
							<p className='text-sm uppercase tracking-[0.3em] text-zinc-500'>
								0{category.index + 1}
							</p>
							<h3 className='mt-4 text-xl font-semibold text-zinc-950'>
								{category.name}
							</h3>
							<p className='mt-2 text-sm leading-6 text-zinc-600'>
								{category.description}
							</p>
							<div className='mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-950'>
								Explore
								<ArrowRight className='size-4 transition group-hover:translate-x-1' />
							</div>
						</Link>
					))}
				</div>
			</section>

			<section className='space-y-5'>
				<div className='flex items-end justify-between gap-4'>
					<div>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Featured</p>
						<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Popular picks</h2>
					</div>
					<Link
						href='/products'
						className='text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-950 hover:underline'
					>
						Browse catalog
					</Link>
				</div>

				<ProductGrid products={featuredProducts} featured />
			</section>

			<section className='grid gap-4 lg:grid-cols-[0.95fr_1.05fr]'>
				<div className='rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-6 text-white sm:p-8'>
					<p className='text-xs uppercase tracking-[0.35em] text-zinc-400'>
						Why this works
					</p>
					<h2 className='mt-3 max-w-md text-2xl font-semibold'>
						Structured for trust, clarity, and fast purchasing decisions.
					</h2>
					<p className='mt-3 max-w-lg text-sm leading-6 text-zinc-300'>
						The visual system keeps the home page focused on discovery while
						presenting enough depth to feel like a real storefront.
					</p>
				</div>

				<div className='grid gap-4 sm:grid-cols-3'>
					{trustItems.map((item) => {
						const Icon = item.icon

						return (
							<div
								key={item.title}
								className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'
							>
								<div className='grid size-11 place-items-center rounded-2xl bg-zinc-950 text-white'>
									<Icon className='size-5' />
								</div>
								<h3 className='mt-4 text-base font-semibold text-zinc-950'>
									{item.title}
								</h3>
								<p className='mt-2 text-sm leading-6 text-zinc-600'>
									{item.description}
								</p>
							</div>
						)
					})}
				</div>
			</section>
		</div>
	)
}
