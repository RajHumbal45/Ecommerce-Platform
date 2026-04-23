'use client'

import Link from 'next/link'
import { BadgeCheck, ArrowRight, Truck, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { formatCategoryLabel } from '@/data/products'
import { selectCheckoutOrder, selectCheckoutOrderId } from '@/redux/selectors'
import { useAppSelector } from '@/redux/hooks'

export function SuccessPage() {
	const orderId = useAppSelector(selectCheckoutOrderId)
	const order = useAppSelector(selectCheckoutOrder)

	if (!orderId || !order) {
		return (
			<div className='rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm'>
				<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Success</p>
				<h1 className='mt-3 text-3xl font-semibold text-zinc-950'>No recent order found</h1>
				<p className='mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600'>
					Complete checkout from the cart to generate an order confirmation.
				</p>
				<div className='mt-6 flex justify-center'>
					<Link
						href='/products'
						className='inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
					>
						Shop products
						<ArrowRight className='size-4' />
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-8'>
			<section className='overflow-hidden rounded-[2rem] border border-zinc-200 bg-[linear-gradient(180deg,#fff_0%,#eef2f7_100%)] p-6 shadow-sm sm:p-8'>
				<div className='max-w-2xl space-y-4'>
					<div className='inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-zinc-600 shadow-sm'>
						<BadgeCheck className='size-4 text-zinc-950' />
						Order confirmed
					</div>
					<h1 className='text-4xl font-semibold tracking-tight text-zinc-950'>
						Your order is ready for fulfillment.
					</h1>
					<p className='max-w-xl text-sm leading-6 text-zinc-600'>
						The confirmation keeps the core purchase details visible so the flow feels complete even
						without a backend payment processor.
					</p>
				</div>
			</section>

			<div className='grid gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
				<section className='space-y-4 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Confirmation</p>
							<h2 className='mt-2 text-2xl font-semibold text-zinc-950'>Order summary</h2>
						</div>
						<div className='rounded-2xl bg-zinc-950 px-4 py-3 text-white'>
							<p className='text-[10px] uppercase tracking-[0.3em] text-zinc-400'>Order ID</p>
							<p className='mt-1 text-sm font-medium'>{orderId}</p>
						</div>
					</div>

					<div className='space-y-3'>
						{order.items.map((item) => (
							<div
								key={item.cartKey}
								className='flex items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm'
							>
								<div>
									<p className='font-medium text-zinc-950'>{item.name}</p>
									<p className='text-zinc-500'>
										{item.quantity} x {formatCategoryLabel(item.category)}
									</p>
								</div>
								<p className='font-medium text-zinc-950'>
									{formatCurrency(item.price * item.quantity)}
								</p>
							</div>
						))}
					</div>

					<div className='grid gap-4 sm:grid-cols-3'>
						{[
							{ label: 'Items', value: order.summary.itemCount },
							{ label: 'Shipping', value: order.summary.shipping === 0 ? 'Free' : formatCurrency(order.summary.shipping) },
							{ label: 'Total', value: formatCurrency(order.summary.total) }
						].map((item) => (
							<div key={item.label} className='rounded-[1.25rem] border border-zinc-200 bg-zinc-50 p-4'>
								<p className='text-xs uppercase tracking-[0.3em] text-zinc-500'>{item.label}</p>
								<p className='mt-2 text-lg font-semibold text-zinc-950'>{item.value}</p>
							</div>
						))}
					</div>
				</section>

				<aside className='space-y-4'>
					<div className='rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Customer</p>
						<div className='mt-4 space-y-3 text-sm'>
							<div>
								<p className='text-zinc-500'>Name</p>
								<p className='font-medium text-zinc-950'>{order.contactName}</p>
							</div>
							<div>
								<p className='text-zinc-500'>Email</p>
								<p className='font-medium text-zinc-950'>{order.email}</p>
							</div>
							<div>
								<p className='text-zinc-500'>Address</p>
								<p className='font-medium text-zinc-950'>
									{order.addressLine1}, {order.city}, {order.postalCode}, {order.country}
								</p>
							</div>
							<div>
								<p className='text-zinc-500'>Delivery</p>
								<p className='font-medium text-zinc-950'>
									{order.shippingMethod} shipping via {order.paymentMethod}
								</p>
							</div>
						</div>
					</div>

					<div className='rounded-[1.75rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm'>
						<div className='flex items-center gap-2'>
							<Truck className='size-4' />
							<p className='text-xs uppercase tracking-[0.35em] text-zinc-400'>Next steps</p>
						</div>
						<p className='mt-3 text-lg font-semibold'>Processing and delivery updates.</p>
						<p className='mt-2 text-sm leading-6 text-zinc-300'>
							Confirmation details, dispatch timing, and support handoff would normally continue from
							a backend order service.
						</p>
						<div className='mt-5 rounded-2xl bg-white/10 p-4'>
							<div className='flex items-center gap-2 text-sm font-medium'>
								<ShieldCheck className='size-4' />
								Support-ready
							</div>
							<p className='mt-2 text-sm leading-6 text-zinc-300'>
								Keep this order number handy if you need assistance.
							</p>
						</div>
					</div>

					<div className='rounded-[1.75rem] border border-dashed border-zinc-300 bg-white p-5 shadow-sm'>
						<p className='text-xs uppercase tracking-[0.35em] text-zinc-500'>Continue shopping</p>
						<Link
							href='/products'
							className='mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline'
						>
							Back to catalog
							<ArrowRight className='size-4' />
						</Link>
					</div>
				</aside>
			</div>
		</div>
	)
}
