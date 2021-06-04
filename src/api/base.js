'use strict';
import 'whatwg-fetch';
import querystring from 'querystringify';

export default class API {
    constructor() {
        this.baseUrl = '/';
        
        this._requestQueue = {};
    }

    _request(api, params = {}, url = '', method = 'GET', catchError) {
        // const data = {
        //     params: JSON.stringify(params)
        // };
        if(url) this.baseUrl = url;
        let api_url = this.baseUrl + api;
        return this.sendRequest(api_url, params, method, catchError);
    }

    sendRequest(url, data = {}, method = 'GET', catchError = true, handle) {
        let key;
        let options;
        if (method.toUpperCase() === 'GET') {
            const params = querystring.stringify(data);
            if (url.indexOf('?') === -1) {
                url = url + '?' + params;
            } else {
                url = url + '&' + params;
            }
            key = url;
            options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',
            };
        } else {
            const body = JSON.stringify(data);
            key = url + body;
            options = {
                method,
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
        }

        // if (this.host) {
        //   url = this.host + url;
        // }

        if (!this._requestQueue[key]) {
            this._requestQueue[key] = [];
            fetch(url, options).then(res => {
                return res.json();
            }).then(data => {
                if (handle) {
                    data = handle(data);
                }
                // if (data.code) {
                //     const err = new Error(data.msg);
                //     err.code = data.code;
                //     throw err;
                // }
                this._requestQueue[key].forEach(fn => {
                    fn(null, data);
                });
                delete this._requestQueue[key];
            }).catch(err => {
                this._requestQueue[key].forEach(fn => {
                    fn(err);
                });
                delete this._requestQueue[key];
            });
        }

        return new Promise((resolve, reject) => {
            this._requestQueue[key].push((err, data) => {
                if (err) {
                    if (catchError) {
                        // message.error(err.message, 1);
                        console.log(err.msg)
                        resolve(err);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(data);
                }
            });
        });
    }
}