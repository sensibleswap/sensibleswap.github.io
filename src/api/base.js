'use strict';
import 'whatwg-fetch';
import querystring from 'querystringify';
const query = querystring.parse(window.location.search);

export default class API {
    constructor() {
        this.baseUrl = 'https://volt.id/api.json';
        if(window.location.pathname.indexOf('test.html') > -1) {
            //预发环境
            this.baseUrl = 'https://voltpre.bitmesh.com/api.json';
        }
        
        if (process.env.NODE_ENV === 'development') {
            this.baseUrl = '/api.json';
            // this.baseUrl = 'http://127.0.0.1:7001/api.json';
            // this.baseUrl = 'http://8.210.215.23:7001/api.json';
            // this.baseUrl = 'https://voltpre.bitmesh.com/api.json';
            if (query.wss) {
                this.baseUrl = `${query.wss.replace('wss:', 'https://').replace('ws:', 'http://')}/api.json`;
            } else if (process.env.wss) {
                this.baseUrl = `${process.env.wss.replace('ws', 'http')}/api.json`;
            }
        }
        this._requestQueue = {};
    }

    _request(api, params = {}, method = 'GET', catchError) {
        const data = {
            method: api,
            params: JSON.stringify(params)
        };
        let url = this.baseUrl;
        return this.sendRequest(url, data, method, catchError);
    }

    sendRequest(url, data = {}, method = 'GET', catchError = true, handle) {
        let req;
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
                if (!data.success) {
                    if (data.message === 'not login') {
                        if (window.location.search.indexOf('redirect') < 0) {
                            return window.location.href = `/?redirect=${encodeURIComponent(window.location.href)}#/user/entry`;
                        }

                    }
                    const err = new Error(data.message);
                    err.code = data.code;
                    throw err;
                }
                this._requestQueue[key].forEach(fn => {
                    fn(null, data.data);
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
                        console.log(err.message)
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