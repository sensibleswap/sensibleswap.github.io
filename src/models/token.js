import Tokenlist from '../../mock/tokenlist.json';
import tokenApi from 'api/token';

export default {

  namespace: 'token',

  state: {
    tokenlist: Tokenlist,
    current_token_origin: '',
    current_token_aim: ''
  },

  subscriptions: {
    async setup({ dispatch, history }) {  // eslint-disable-line

      const res = await tokenApi.queryList();
      // console.log(res);
      dispatch({
        type: 'user/save',
        payload: {
          tokens: [
            {
              name: 'bsv',
              tokenId: 'BSV',
              value: 0,
              symbol: 'BSV',
              icon: 'iconlogo-bitcoin'
            },
            ...res
          ]
        }
      })

    }
  },

  effects: {
    * getTokenDetail({ payload }, { call, put }) {
      const res = yield tokenApi.queryDetail.call(tokenApi, payload);
      return res;
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
