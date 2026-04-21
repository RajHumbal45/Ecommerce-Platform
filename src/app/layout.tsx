import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
	title: 'E-Commerce Platform',
	description: 'A production-shaped e-commerce platform for the SDE-2 challenge'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<Providers>
					<div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
						<Header />
						<main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
							{children}
						</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	)
}

