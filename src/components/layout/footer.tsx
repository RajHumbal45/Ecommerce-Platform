import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const footerLinks = [
	{
		title: 'Shop',
		links: [
			{ href: '/products', label: 'All products' },
			{ href: '/products?category=apparel', label: 'Apparel' },
			{ href: '/products?category=accessories', label: 'Accessories' }
		]
	},
	{
		title: 'Experience',
		links: [
			{ href: '/cart', label: 'Cart' },
			{ href: '/checkout', label: 'Checkout' },
			{ href: '/success', label: 'Confirmation' }
		]
	}
]

export function Footer() {
	return (
		<footer className='mt-12 border-t border-zinc-200/80 bg-white'>
			<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
				<div className='grid gap-10 lg:grid-cols-[1.2fr_0.8fr]'>
					<div className='space-y-4'>
						<p className='text-sm font-semibold uppercase tracking-[0.35em] text-zinc-950'>
							Ecom Studio
						</p>
						<p className='max-w-xl text-sm leading-6 text-zinc-600'>
							A production-shaped storefront built for the SDE-2 assignment.
							Focused on browsing, cart management, checkout clarity, and clean
							navigation.
						</p>
						<Link
							href='/products'
							className='inline-flex items-center gap-2 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline'
						>
							Explore the catalog
							<ArrowUpRight className='size-4' />
						</Link>
					</div>

					<div className='grid gap-8 sm:grid-cols-2'>
						{footerLinks.map((group) => (
							<div key={group.title} className='space-y-4'>
								<p className='text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500'>
									{group.title}
								</p>
								<div className='grid gap-3 text-sm text-zinc-600'>
									{group.links.map((link) => (
										<Link key={link.href} href={link.href} className='transition hover:text-zinc-950'>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='mt-10 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-xs uppercase tracking-[0.3em] text-zinc-400 sm:flex-row sm:items-center sm:justify-between'>
					<p>Built for the E-Commerce Platform challenge</p>
					<p>Next.js App Router - TypeScript - Redux Saga</p>
				</div>
			</div>
		</footer>
	)
}
