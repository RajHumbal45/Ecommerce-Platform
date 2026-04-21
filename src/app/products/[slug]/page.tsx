import { notFound } from 'next/navigation'

export default async function ProductDetailPage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	if (!slug) {
		notFound()
	}

	return (
		<section className='space-y-4'>
			<div>
				<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Product</p>
				<h1 className='mt-2 text-3xl font-semibold text-zinc-950'>Detail view</h1>
			</div>
			<div className='rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-sm text-zinc-500'>
				Product detail for <span className='font-medium text-zinc-950'>{slug}</span>{' '}
				will be built in the next phase.
			</div>
		</section>
	)
}

