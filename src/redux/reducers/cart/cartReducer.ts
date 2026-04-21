import {
	CART_ADD_ITEM,
	CART_CLEAR,
	CART_REMOVE_ITEM,
	CART_UPDATE_QUANTITY
} from '@/redux/actions/cart/cartAction'

export interface CartItem {
	id: string
	quantity: number
}

export interface CartState {
	items: CartItem[]
}

const initialState: CartState = {
	items: []
}

export function cartReducer(
	state = initialState,
	action: { type: string; payload?: CartItem | { id: string } }
): CartState {
	switch (action.type) {
		case CART_ADD_ITEM:
			return {
				...state,
				items: [...state.items, action.payload as CartItem]
			}
		case CART_REMOVE_ITEM:
			return {
				...state,
				items: state.items.filter((item) => item.id !== (action.payload as { id: string }).id)
			}
		case CART_UPDATE_QUANTITY:
			return {
				...state,
				items: state.items.map((item) =>
					item.id === (action.payload as CartItem).id
						? { ...item, quantity: (action.payload as CartItem).quantity }
						: item
				)
			}
		case CART_CLEAR:
			return initialState
		default:
			return state
	}
}

