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
		<footer className='mt-12 border-t border-zinc-200/80 bg-[linear-gradient(180deg,#fff_0%,#f4efe6_100%)]'>
			<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
				<div className='grid gap-10 rounded-[2rem] border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm lg:grid-cols-[1.15fr_0.85fr]'>
					<div className='space-y-5'>
						<p className='text-sm font-semibold uppercase tracking-[0.35em] text-zinc-950'>
							Everyday Store
						</p>
						<p className='max-w-xl text-sm leading-6 text-zinc-600'>
							A calm, user-first shopping experience for discovering products,
							comparing options, and checking out with confidence.
						</p>
						<div className='flex flex-wrap gap-3'>
							<Link
								href='/products'
								className='inline-flex items-center gap-2 rounded-full border border-zinc-950 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-700 hover:bg-zinc-50'
							>
								Explore the catalog
								<ArrowUpRight className='size-4' />
							</Link>
							<Link
								href='/checkout'
								className='inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
							>
								Review checkout
							</Link>
						</div>
					</div>

					<div className='grid gap-8 sm:grid-cols-2'>
						{footerLinks.map((group) => (
							<div key={group.title} className='space-y-4 rounded-[1.5rem] border border-zinc-200 bg-white p-5'>
								<p className='text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500'>
									{group.title}
								</p>
								<div className='grid gap-3 text-sm text-zinc-600'>
									{group.links.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className='transition hover:text-zinc-950'
										>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

			</div>
		</footer>
	)
}
