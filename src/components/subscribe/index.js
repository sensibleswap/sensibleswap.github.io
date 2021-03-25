'use strict';
import 'whatwg-fetch';
import md5 from 'md5';
import querystring from 'querystringify';

const url = 'https://api.laxo.io/subscribe';
const str = 'c51bbbac6fb44c41e87c718118359aea5ca63bca5356ffd5cbb6fba86d30165d';

const subscribe = (email, callback) => {

    const t = new Date().getTime();
    const h = md5([str, email, t].join(''));
    const subscribe_url = url + '?' + querystring.stringify({
        email,
        t,
        h
    })
    fetch(subscribe_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'

    }).then(res => {
        return res.json();
    }).then(data => {
        // console.log(data);
        callback(data);
    });
}

export default subscribe;