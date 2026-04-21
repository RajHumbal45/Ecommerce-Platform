export const UI_SET_LOADING = 'ui/UI_SET_LOADING' as const
export const UI_SET_SIDEBAR_OPEN = 'ui/UI_SET_SIDEBAR_OPEN' as const

export function uiSetLoading(payload: boolean) {
	return {
		type: UI_SET_LOADING,
		payload
	}
}

export function uiSetSidebarOpen(payload: boolean) {
	return {
		type: UI_SET_SIDEBAR_OPEN,
		payload
	}
}

