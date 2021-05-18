'use strict';
// import qs from 'querystringify';
import msgpack5 from 'msgpack5';
import EventEmitter from 'eventemitter3';
import { sleep } from '../common/utils';
import debug from 'debug';
// import { LOCAL_NAME, clearLocalDataFun, appVersion } from 'config';
import _ from 'i18n';
const { Mnemonic, crypto, PublicKey, PrivateKey, HDPrivateKey } = require('nakasendo');
const ECDSA = crypto.ECDSA;
const sha256 = crypto.Hash.sha256;
const log = debug('socket');
const apiLog = debug('api');
const location = window.location;
// const query = qs.parse(location.search);
const { encode, decode } = msgpack5();
const MAX = Math.pow(2, 31);
let protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';


export default class WebSocketApi extends EventEmitter {
  constructor(options = {}) {
    super();
    let baseHost  = 'ws://127.0.0.1:8888';
    

    this._ready = false;
    this.requestId = 1;
    this.baseUrl = baseHost; //`${baseHost}?biz=threshold&uid=${query.uid}`;
    this._queue = [];
    this.state = {};

    this.on('update', (data) => {
      const [id, key, val] = data;
      if (!this.state[id]) {
        this.state[id] = {};
      }
      this.state[id][key] = val;
      this.emit([id, key].join(':'), val);
    });
  }

  ready() {
    if (this._ready) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.once('ready', resolve);
    });
  }

  init() {
    // const isJSON = this.binaryType === 'json';

    // const t = Date.now().toString();
    // const hash = sha256(Buffer.from(t));
    // // const pk = new PrivateKey();
    // const { SEED, UID} = LOCAL_NAME;
    // const seed = window.sessionStorage.getItem(SEED);
    // // const seed = 'stay guess pill profit twin legend buzz cage penalty hero number apology';
    // const xpriv = HDPrivateKey.fromSeed(Mnemonic.fromString(seed).toSeed());
    // const pk = xpriv.deriveChild(0).privateKey;

    // const pub = pk.toPublicKey().toHex();
    // const sig = ECDSA.sign(hash, pk).toString();
    // const uid = window.sessionStorage.getItem(UID)
    const ws = new WebSocket(`${this.baseUrl}`);

    ws.binaryType = 'arraybuffer';

    ws.onmessage = (event) => {
      const message = event.data;
      // console.log(message)
      if(String(message) === '400') {
        return clearLocalDataFun();
      }
      try {
        const data = decode(message);
        log(data);
        // console.log('receive:', data);
        if (data[0] === 'res') {
          return this.emit(`res:${data[1]}`, data[2]);
        }

        if (data[0] === 'OK') {
          this.user = data[1];
          this._ready = true;
          this.emit('ready');
          return;
        }

        if(data[0] === 'login') {
          if(data[1][0] === 'pc' && data[1][1] !== t) {
            this.emit(data[0], data.slice(1));
            return;
          }
          return;
        }

        this.emit(data[0], data.slice(1));

      } catch (err) {
        log(message);
        log(err);
      }
    }

    ws.onopen = () => {
      console.log('open')
      for (let data of this._queue) {
        this.send(data);
      }
      this._queue = [];
    }

    ws.onerror = () => {
      console.log('error')
    }

    ws.onclose = () => {
      console.log('close')
      setTimeout(() => {
        this.init();
      }, 3000);
    };

    this.ws = ws;
  }

  _getRequestId() {
    let id = this.requestId++;
    if (this.requestId > MAX) {
      this.requestId = 1;
    }
    return id;
  }

  send(data) {
    const ws = this.ws;
    log(data);
    if (ws.readyState === 1) {
      if (ws.binaryType === 'arraybuffer') {
        ws.send(encode(data));
      } else {
        ws.send(JSON.stringify(data));
      }
    } else {
      this._queue.push(data);
    }
  }

  subscribe(method, params) {
    const data = [0, method, params || []]
    this.send(data);
  }

  request(api, params) {
    const id = this._getRequestId();
    return new Promise((resolve, reject) => {
      if (this.ws) {
        this.send(['req', id, api, params || []]);
        this.once(`res:${id}`, (data) => {
          apiLog(api, params, data);
          resolve(data);
        });
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  }

  ping() {
    return this.request('ping');
  }

  push(params) {
    return this.request('message.set', params);
  }

  _get(params) {
    const { id, key } = params;
    const state = this.state[id];
    if (state && typeof state[key] != 'undefined') {
      return state[key];
    }

    return this.request('message.get', params).then(data => {
      // console.log(params);
      // console.log(data);
      return data;
    })
  }

  async poll(params) {
    const id = params.id;
    const key = params.key;

    const data = await this._get(params);
    if (data) {
      return data;
    }

    let finished = false;
    const event_name = [id, key].join(':');

    return new Promise(resolve => {
      const done = (data) => {
        if (!finished) {
          finished = true;
          this.removeAllListeners(event_name);
          resolve(data);
        }
      }

      setTimeout(async () => {
        while (!finished) {
          const data = await this._get(params);
          if (data) {
            return done(data);
          }

          count = count - 1;
          if (count === 0) {
            return done();
          }

          await sleep(100);
        }
      });

      this.once(event_name, async () => {
        const data = await this._get(key);
        if (data) {
          return done(data);
        }
      });
    });
  }
}
