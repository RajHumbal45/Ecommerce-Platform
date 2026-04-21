import Link from 'next/link'

export default function HomePage() {
	return (
		<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#f6f2eb_100%)] px-6 py-12 shadow-[0_30px_80px_rgba(24,24,27,0.08)] sm:px-10 sm:py-16'>
			<div className='grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
				<div className='space-y-6'>
					<p className='text-xs uppercase tracking-[0.4em] text-zinc-500'>
						Editorial commerce system
					</p>
					<h1 className='max-w-xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl'>
						A restrained storefront with a serious buying flow.
					</h1>
					<p className='max-w-xl text-base leading-7 text-zinc-600 sm:text-lg'>
						This project is being built as a production-shaped e-commerce
						experience with browsing, cart, checkout, SSR state hydration, and a
						scalable Redux architecture.
					</p>
					<div className='flex flex-wrap gap-3'>
						<Link
							href='/products'
							className='rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
						>
							Browse products
						</Link>
						<Link
							href='/checkout'
							className='rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:border-zinc-950'
						>
							Preview checkout
						</Link>
					</div>
				</div>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div className='rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm'>
						<p className='text-sm text-zinc-500'>Phase 1</p>
						<p className='mt-3 text-lg font-medium text-zinc-950'>Setup complete</p>
						<p className='mt-2 text-sm leading-6 text-zinc-600'>
							Next.js, TypeScript, Tailwind, Redux, and base routing are ready
							for the build phases.
						</p>
					</div>
					<div className='rounded-[1.5rem] border border-zinc-200 bg-zinc-950 p-5 text-white shadow-sm sm:translate-y-8'>
						<p className='text-sm text-zinc-400'>Architecture</p>
						<p className='mt-3 text-lg font-medium'>Feature-based Redux</p>
						<p className='mt-2 text-sm leading-6 text-zinc-300'>
							Actions, reducers, saga handlers, and request modules will stay
							separated by feature.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

