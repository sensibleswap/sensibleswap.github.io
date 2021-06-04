'use strict';
import BaseAPI from './base';

class Token extends BaseAPI {

	queryAllPairs() {
		return this._request('allpairs');
	}

	querySwapInfo(symbol) {
		return this._request('swapinfo', {
			symbol
		});
	}


}

export default new Token();
