'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { cn } from '@/lib/utils'

const navigation = [
	{ href: '/products', label: 'Products' },
	{ href: '/products?category=apparel', label: 'Apparel' },
	{ href: '/products?category=accessories', label: 'Accessories' },
	{ href: '/checkout', label: 'Checkout' }
]

export function Header() {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const cartCount = useSelector((state: RootState) => state.cart.items.length)

	const activePath = pathname.startsWith('/products/') ? '/products' : pathname

	return (
		<header className='sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl'>
			<div className='border-b border-zinc-100 bg-zinc-950 text-white'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8'>
					<p className='uppercase tracking-[0.3em] text-zinc-300'>
						Free delivery on orders over $100
					</p>
					<p className='hidden text-zinc-400 sm:block'>
						Challenge build for a production-style buying flow
					</p>
				</div>
			</div>

			<div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'>
				<Link href='/' className='flex items-center gap-3'>
					<div className='grid size-10 place-items-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white'>
						ES
					</div>
					<div>
						<p className='text-sm font-semibold uppercase tracking-[0.3em] text-zinc-950'>
							Ecom Studio
						</p>
						<p className='text-xs text-zinc-500'>Curated retail shell</p>
					</div>
				</Link>

				<div className='hidden flex-1 items-center justify-center lg:flex'>
					<div className='flex w-full max-w-xl items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm'>
						<Search className='size-4 text-zinc-400' />
						<span className='text-sm text-zinc-400'>Search products, brands, categories</span>
					</div>
				</div>

				<nav className='hidden items-center gap-2 lg:flex'>
					{navigation.map((item) => {
						const isActive = activePath === item.href

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'rounded-full px-4 py-2 text-sm font-medium transition',
									isActive
										? 'bg-zinc-950 text-white'
										: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
								)}
							>
								{item.label}
							</Link>
						)
					})}
				</nav>

				<div className='hidden items-center gap-2 lg:flex'>
					<Link
						href='/cart'
						className='relative grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 transition hover:border-zinc-950'
						aria-label='View cart'
					>
						<ShoppingBag className='size-4' />
						{cartCount > 0 ? (
							<span className='absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-zinc-950 px-1 text-[10px] font-semibold text-white'>
								{cartCount}
							</span>
						) : null}
					</Link>
				</div>

				<button
					type='button'
					className='grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 lg:hidden'
					onClick={() => setMenuOpen((value) => !value)}
					aria-expanded={menuOpen}
					aria-controls='mobile-navigation'
					aria-label='Toggle navigation menu'
				>
					{menuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
				</button>
			</div>

			{menuOpen ? (
				<div id='mobile-navigation' className='border-t border-zinc-200 bg-white lg:hidden'>
					<div className='mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8'>
						<div className='flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3'>
							<Search className='size-4 text-zinc-400' />
							<span className='text-sm text-zinc-400'>Search products, brands, categories</span>
						</div>

						<nav className='grid gap-2'>
							{navigation.map((item) => {
								const isActive = activePath === item.href

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMenuOpen(false)}
										className={cn(
											'rounded-2xl border px-4 py-3 text-sm font-medium transition',
											isActive
												? 'border-zinc-950 bg-zinc-950 text-white'
												: 'border-zinc-200 bg-white text-zinc-600'
										)}
									>
										{item.label}
									</Link>
								)
							})}
						</nav>

						<div className='grid grid-cols-2 gap-3'>
							<Link
								href='/products'
								onClick={() => setMenuOpen(false)}
								className='rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-950'
							>
								Browse
							</Link>
							<Link
								href='/cart'
								onClick={() => setMenuOpen(false)}
								className='rounded-2xl bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white'
							>
								Cart {cartCount > 0 ? `(${cartCount})` : ''}
							</Link>
						</div>
					</div>
				</div>
			) : null}
		</header>
	)
}
