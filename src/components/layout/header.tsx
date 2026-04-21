import Link from 'next/link'

export function Header() {
	return (
		<header className='border-b border-zinc-200/80 bg-white/70 backdrop-blur-md'>
			<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
				<Link href='/' className='text-sm font-semibold uppercase tracking-[0.35em] text-zinc-950'>
					Atlas Store
				</Link>
				<nav className='flex items-center gap-5 text-sm text-zinc-600'>
					<Link href='/products' className='transition hover:text-zinc-950'>
						Products
					</Link>
					<Link href='/cart' className='transition hover:text-zinc-950'>
						Cart
					</Link>
					<Link href='/checkout' className='transition hover:text-zinc-950'>
						Checkout
					</Link>
				</nav>
			</div>
		</header>
	)
}

