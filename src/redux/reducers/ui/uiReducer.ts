import { UI_SET_LOADING, UI_SET_SIDEBAR_OPEN } from '@/redux/actions/ui/uiAction'

export interface UiState {
	loading: boolean
	sidebarOpen: boolean
}

const initialState: UiState = {
	loading: false,
	sidebarOpen: false
}

export function uiReducer(
	state = initialState,
	action: { type: string; payload?: boolean }
): UiState {
	switch (action.type) {
		case UI_SET_LOADING:
			return { ...state, loading: Boolean(action.payload) }
		case UI_SET_SIDEBAR_OPEN:
			return { ...state, sidebarOpen: Boolean(action.payload) }
		default:
			return state
	}
}

