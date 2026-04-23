'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Heart, Menu, ShoppingBag, X } from 'lucide-react'
import { selectCartCount, selectWishlistCount } from '@/redux/selectors'
import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/lib/utils'
import { HomeSearchAutocomplete, type SearchSuggestion } from '@/components/home/home-search-autocomplete'

const navigation = [
	{ href: '/products', label: 'Products' },
	{ href: '/products?category=apparel', label: 'Apparel' },
	{ href: '/products?category=accessories', label: 'Accessories' },
	{ href: '/checkout', label: 'Checkout' }
]

interface HeaderProps {
	searchProducts: SearchSuggestion[]
}

export function Header({ searchProducts }: HeaderProps) {
	const pathname = usePathname()
	const [menuOpen, setMenuOpen] = useState(false)
	const cartCount = useAppSelector(selectCartCount)
	const wishlistCount = useAppSelector(selectWishlistCount)

	const activePath = pathname.startsWith('/products/') ? '/products' : pathname

	return (
		<header className='sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl'>
			<div className='border-b border-zinc-100 bg-zinc-950 text-white'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8'>
					<p className='uppercase tracking-[0.3em] text-zinc-300'>
						Free delivery on orders over $100
					</p>
				</div>
			</div>

			<div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:hidden lg:px-8'>
				<Link href='/' className='flex items-center gap-2.5'>
					<div className='grid size-9 place-items-center rounded-2xl bg-zinc-950 text-[0.7rem] font-semibold text-white'>
						ES
					</div>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.28em] text-zinc-950'>
							Everyday Store
						</p>
						<p className='text-[11px] text-zinc-500'>Everyday essentials</p>
					</div>
				</Link>

				<button
					type='button'
					className='grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-sm lg:hidden'
					onClick={() => setMenuOpen((value) => !value)}
					aria-expanded={menuOpen}
					aria-controls='mobile-navigation'
					aria-label='Toggle navigation menu'
				>
					{menuOpen ? <X className='size-[1.05rem]' /> : <Menu className='size-[1.05rem]' />}
				</button>
			</div>

			<div className='mx-auto hidden max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid lg:px-8'>
				<Link href='/' className='flex items-center gap-3 shrink-0'>
					<div className='grid size-10 place-items-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white'>
						ES
					</div>
					<div>
						<p className='text-sm font-semibold uppercase tracking-[0.3em] text-zinc-950'>
							Everyday Store
						</p>
						<p className='text-xs text-zinc-500'>Everyday essentials</p>
					</div>
				</Link>

				<div className='justify-self-center'>
					<HomeSearchAutocomplete products={searchProducts} compact />
				</div>

				<div className='flex items-center gap-2 justify-self-end'>
					<nav className='flex items-center gap-1.5'>
						{navigation.map((item) => {
							const isActive = activePath === item.href

							return (
								<Link
									key={item.href}
									href={item.href}
									aria-current={isActive ? 'page' : undefined}
									className={cn(
										'rounded-full px-4 py-2 text-sm font-medium transition',
										isActive
											? 'border border-zinc-950 bg-white text-zinc-950 shadow-sm'
											: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
									)}
								>
									{item.label}
								</Link>
							)
						})}
					</nav>

					<div className='flex items-center gap-1.5'>
						<Link
							href='/wishlist'
							className='relative grid size-11 place-items-center rounded-full border border-zinc-200 bg-white/70 text-zinc-950 shadow-sm backdrop-blur-sm transition hover:border-zinc-900 hover:bg-white'
							aria-label={`View wishlist${wishlistCount > 0 ? `, ${wishlistCount} saved item${wishlistCount === 1 ? '' : 's'}` : ''}`}
						>
							<Heart className='size-4' />
							{wishlistCount > 0 ? (
								<span
									aria-hidden='true'
									className='absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white'
								>
									{wishlistCount}
								</span>
							) : null}
						</Link>
						<Link
							href='/cart'
							className='relative grid size-11 place-items-center rounded-full border border-zinc-200 bg-white/70 text-zinc-950 shadow-sm backdrop-blur-sm transition hover:border-zinc-900 hover:bg-white'
							aria-label={`View cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? '' : 's'}` : ''}`}
						>
							<ShoppingBag className='size-4' />
							{cartCount > 0 ? (
								<span
									aria-hidden='true'
									className='absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-zinc-950 px-1 text-[10px] font-semibold text-white'
								>
									{cartCount}
								</span>
							) : null}
						</Link>
					</div>
				</div>
			</div>

			{menuOpen ? (
				<div
					id='mobile-navigation'
					className='border-t border-zinc-200 bg-gradient-to-b from-white via-white to-zinc-50 shadow-[0_18px_40px_rgba(24,24,27,0.08)] lg:hidden'
				>
					<div className='mx-auto max-w-7xl space-y-3 px-4 py-3.5 sm:px-6 lg:px-8'>
						<HomeSearchAutocomplete products={searchProducts} compact />

						<nav className='grid gap-1.5'>
							{navigation.map((item) => {
								const isActive = activePath === item.href

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMenuOpen(false)}
										aria-current={isActive ? 'page' : undefined}
										className={cn(
											'rounded-xl border px-4 py-2.5 text-sm font-medium transition',
											isActive
												? 'border-zinc-950 bg-white text-zinc-950 shadow-sm'
												: 'border-zinc-200 bg-white text-zinc-600'
										)}
									>
										{item.label}
									</Link>
								)
							})}
						</nav>

						<div className='grid grid-cols-2 gap-2.5'>
							<Link
								href='/products'
								onClick={() => setMenuOpen(false)}
								className='rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-zinc-950 shadow-sm'
							>
								Browse
							</Link>
							<Link
								href='/cart'
								onClick={() => setMenuOpen(false)}
								className='rounded-xl border border-zinc-200 bg-zinc-950 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm'
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
