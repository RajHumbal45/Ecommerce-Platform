'use client'

import { Provider } from 'react-redux'
import { useRef } from 'react'
import { makeStore } from '@/redux/store'

export function Providers({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<ReturnType<typeof makeStore> | null>(null)

	if (!storeRef.current) {
		storeRef.current = makeStore()
	}

	return <Provider store={storeRef.current}>{children}</Provider>
}

