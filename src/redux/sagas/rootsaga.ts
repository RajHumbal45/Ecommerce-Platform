import { all, fork } from 'redux-saga/effects'
import { cartHandler } from './handlers/cart/cartHandler'
import { checkoutHandler } from './handlers/checkout/checkoutHandler'
import { filterHandler } from './handlers/filters/filterHandler'
import { productHandler } from './handlers/products/productHandler'
import { wishlistHandler } from './handlers/wishlist/wishlistHandler'
import { uiHandler } from './handlers/ui/uiHandler'

export function* rootSaga() {
	yield all([
		fork(productHandler),
		fork(cartHandler),
		fork(filterHandler),
		fork(checkoutHandler),
		fork(wishlistHandler),
		fork(uiHandler)
	])
}
