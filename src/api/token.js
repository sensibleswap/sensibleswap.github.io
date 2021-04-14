'use strict';
import BaseAPI from './base';

class Token extends BaseAPI {

	queryDetail(params) {
		return this._request('token.detail', params);
	}

	queryList() {
		return this._request('token.list');
	}


}

export default new Token();
