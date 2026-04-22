import { combineReducers } from '@reduxjs/toolkit'
import { productsReducer } from './reducers/products/productReducer'
import { cartReducer } from './reducers/cart/cartReducer'
import { wishlistReducer } from './reducers/wishlist/wishlistReducer'
import { filtersReducer } from './reducers/filters/filtersReducer'
import { checkoutReducer } from './reducers/checkout/checkoutReducer'
import { uiReducer } from './reducers/ui/uiReducer'

export const rootReducer = combineReducers({
	products: productsReducer,
	cart: cartReducer,
	wishlist: wishlistReducer,
	filters: filtersReducer,
	checkout: checkoutReducer,
	ui: uiReducer
})

