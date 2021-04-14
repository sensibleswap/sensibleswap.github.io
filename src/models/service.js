import WebSocketApi from '../service/ws';

let ws;
let request;

export default {


    namespace: 'service',

    state: {
    },

    subscriptions: {
        setup({ dispatch, history }) { // eslint-disable-line
            ws = new WebSocketApi();
            ws.init();
            request = ws.request.bind(ws);
            // ws.addEventListener('open', function (event) {
            //     ws.send('Hello Server!');
            // });

            // // Listen for messages
            // ws.addEventListener('message', function (event) {
            //     console.log('Message from server ', event.data);
            // });
        }

    },

    effects: {

        * queryTx({ payload }, { call, put }) {
            // debugger
            let {tokenids} = payload;
            let res = yield call(request, 'pair.data', {
                tokenids
            });
            // ws.send('transaction.data');
            // ws.once
            // let res = yield call(request, 'transaction.data', payload);
            // console.log('transaction.data:', res)
            // if (res.success) {

            //     return res.data;
            // }
            console.log('queryTx:',payload.tokenids, res);
            if (res.success) {
                yield put({
                    type: 'user/save',
                    payload: {
                        pair_data: res.data
                    }
                })
            }

            return res;
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },

    }

};
